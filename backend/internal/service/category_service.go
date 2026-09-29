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

type CategoryService struct {
	eventRepo    EventRepository
	categoryRepo CategoryRepository
	producer     Producer
	logger       *slog.Logger
}

func NewCategoryService(
	eventRepo EventRepository,
	categoryRepo CategoryRepository,
	producer Producer,
	logger *slog.Logger,
) *CategoryService {
	return &CategoryService{
		eventRepo:    eventRepo,
		categoryRepo: categoryRepo,
		producer:     producer,
		logger:       logger,
	}
}

func (s *CategoryService) CreateCategory(
	ctx context.Context,
	input dto.CreateCategoryRequestDTO,
	userID uuid.UUID,
) (dto.CreateCategoryResponseDTO, error) {
	if _, err := s.categoryRepo.GetCategoryByUserID(ctx, userID); err == nil {
		return dto.CreateCategoryResponseDTO{}, domain_errors.ErrCategoryAlreadyExists
	} else if !errors.Is(err, domain_errors.ErrCategoryNotFound) {
		return dto.CreateCategoryResponseDTO{}, err
	}

	id := value_objects.FromUUID(userID)

	category, err := entities.NewCategory(id, input.MandatoryExpenses, input.OptionalExpenses, input.DreamSavings)
	if err != nil {
		s.logger.ErrorContext(ctx, "new category",
			slog.String("error", err.Error()),
			slog.String("user_id", userID.String()),
		)
		return dto.CreateCategoryResponseDTO{}, err
	}

	events := category.PullEvents()
	for _, event := range events {
		body, err := events2.SerializeEvent(event)
		if err != nil {
			s.logger.ErrorContext(ctx, "serialize event",
				slog.String("error", err.Error()),
				slog.String("category_id", category.ID.String()),
			)
			return dto.CreateCategoryResponseDTO{}, err
		}

		payloadBytes, err := json.Marshal(event.Payload())
		if err != nil {
			s.logger.ErrorContext(ctx, "marshal payload",
				slog.String("error", err.Error()),
				slog.String("category_id", category.ID.String()),
			)
			return dto.CreateCategoryResponseDTO{}, err
		}

		if err := s.eventRepo.CreateEvent(ctx, db.CreateEventParams{
			AggregateID:   category.ID.String(),
			AggregateType: "Category",
			Version:       category.Version,
			EventType:     event.EventName(),
			Payload:       payloadBytes,
		}); err != nil {
			s.logger.ErrorContext(ctx, "create event",
				slog.String("error", err.Error()),
				slog.String("category_id", category.ID.String()),
			)
			return dto.CreateCategoryResponseDTO{}, err
		}

		if err := s.producer.Send(ctx, category.UserID.String(), body); err != nil {
			s.logger.ErrorContext(ctx, "producer send event",
				slog.String("error", err.Error()),
				slog.String("category_id", category.ID.String()),
			)
			return dto.CreateCategoryResponseDTO{}, err
		}
	}

	return dto.CreateCategoryResponseDTO{
		Success:  true,
		Category: *category,
	}, nil
}
