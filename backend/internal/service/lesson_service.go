package service

import (
	"context"
	"encoding/json"
	"errors"
	"log/slog"

	db "github.com/CodesForge/SunBunniesHackathon2026Project/internal/database/generated"
	"github.com/CodesForge/SunBunniesHackathon2026Project/internal/domain/entities"
	domain_errors "github.com/CodesForge/SunBunniesHackathon2026Project/internal/domain/errors"
	events2 "github.com/CodesForge/SunBunniesHackathon2026Project/internal/domain/events"
	"github.com/CodesForge/SunBunniesHackathon2026Project/internal/domain/value_objects"
	"github.com/CodesForge/SunBunniesHackathon2026Project/internal/service/dto"
	"github.com/google/uuid"
)

type LessonService struct {
	eventRepo  EventRepository
	lessonRepo LessonRepository
	producer   Producer
	logger     *slog.Logger
}

func NewLessonService(
	eventRepo EventRepository,
	lessonRepo LessonRepository,
	producer Producer,
	logger *slog.Logger,
) *LessonService {
	return &LessonService{
		eventRepo:  eventRepo,
		lessonRepo: lessonRepo,
		producer:   producer,
		logger:     logger,
	}
}

func (s *LessonService) CreateLesson(
	ctx context.Context,
	input dto.CreateLessonRequestDTO,
	userID uuid.UUID,
) (dto.CreateLessonResponseDTO, error) {
	if _, err := s.lessonRepo.GetLessonByUserID(ctx, userID); err == nil {
		return dto.CreateLessonResponseDTO{}, domain_errors.ErrLessonAlreadyExists
	} else if !errors.Is(err, domain_errors.ErrLessonNotFound) {
		return dto.CreateLessonResponseDTO{}, err
	}

	id := value_objects.FromUUID(userID)

	lesson, err := entities.NewLesson(id, input.CompletedLessonsCount)
	if err != nil {
		s.logger.ErrorContext(ctx, "new lesson",
			slog.String("error", err.Error()),
			slog.String("user_id", userID.String()),
		)
		return dto.CreateLessonResponseDTO{}, err
	}

	events := lesson.PullEvents()
	for _, event := range events {
		body, err := events2.SerializeEvent(event)
		if err != nil {
			s.logger.ErrorContext(ctx, "serialize event",
				slog.String("error", err.Error()),
				slog.String("lesson_id", lesson.ID.String()),
			)
			return dto.CreateLessonResponseDTO{}, err
		}

		payloadBytes, err := json.Marshal(event.Payload())
		if err != nil {
			s.logger.ErrorContext(ctx, "marshal payload",
				slog.String("error", err.Error()),
				slog.String("lesson_id", lesson.ID.String()),
			)
			return dto.CreateLessonResponseDTO{}, err
		}

		if err := s.eventRepo.CreateEvent(ctx, db.CreateEventParams{
			AggregateID:   lesson.ID.String(),
			AggregateType: "Lesson",
			Version:       lesson.Version,
			EventType:     event.EventName(),
			Payload:       payloadBytes,
		}); err != nil {
			s.logger.ErrorContext(ctx, "create event",
				slog.String("error", err.Error()),
				slog.String("lesson_id", lesson.ID.String()),
			)
			return dto.CreateLessonResponseDTO{}, err
		}

		if err := s.producer.Send(ctx, lesson.UserID.String(), body); err != nil {
			s.logger.ErrorContext(ctx, "producer send event",
				slog.String("error", err.Error()),
				slog.String("lesson_id", lesson.ID.String()),
			)
			return dto.CreateLessonResponseDTO{}, err
		}
	}

	return dto.CreateLessonResponseDTO{
		Success: true,
		Lesson:  *lesson,
	}, nil
}
