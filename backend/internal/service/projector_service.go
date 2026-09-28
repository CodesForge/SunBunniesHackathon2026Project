package service

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"log/slog"

	db "github.com/CodesForge/SunBunniesHackathon2026Project/internal/database/generated"
	domain_errors "github.com/CodesForge/SunBunniesHackathon2026Project/internal/domain/errors"
	"github.com/CodesForge/SunBunniesHackathon2026Project/internal/domain/events"
	"github.com/google/uuid"
	"github.com/segmentio/kafka-go"
)

type LessonRepository interface {
	CreateLesson(ctx context.Context, params db.CreateLessonParams) (db.Lesson, error)
	GetLessonByUserID(ctx context.Context, userID uuid.UUID) (db.Lesson, error)
}

type PetRepository interface {
	CreatePet(ctx context.Context, params db.CreatePetParams) (db.Pet, error)
	GetPetByUserID(ctx context.Context, userID uuid.UUID) (db.Pet, error)
}

type BalanceRepository interface {
	CreateBalance(ctx context.Context, params db.CreateBalanceParams) (db.Balance, error)
	GetBalanceByUserID(ctx context.Context, userID uuid.UUID) (db.Balance, error)
}

type UserRepository interface {
	CreateUser(ctx context.Context, params db.CreateUserParams) (db.User, error)
	GetUserByUsername(ctx context.Context, username string) (db.User, error)
}

type ProjectorService struct {
	lessonRepo  LessonRepository
	petRepo     PetRepository
	balanceRepo BalanceRepository
	userRepo    UserRepository
	logger      *slog.Logger
}

func NewProjectorService(lessonRepo LessonRepository, petRepo PetRepository, userRepo UserRepository, balanceRepo BalanceRepository, logger *slog.Logger) *ProjectorService {
	return &ProjectorService{
		lessonRepo:  lessonRepo,
		petRepo:     petRepo,
		userRepo:    userRepo,
		balanceRepo: balanceRepo,
		logger:      logger,
	}
}

func (s *ProjectorService) Handle(ctx context.Context, msg kafka.Message) error {
	var envelope events.EventEnvelope
	if err := json.Unmarshal(msg.Value, &envelope); err != nil {
		s.logger.ErrorContext(ctx, "corrupted message envelope, skipping",
			slog.String("error", err.Error()),
			slog.String("payload", string(msg.Value)),
		)
		return nil
	}

	s.logger.Debug("received event",
		slog.String("event_type", envelope.EventType),
		slog.String("aggregate_id", envelope.AggregateID),
	)

	switch envelope.EventType {
	case "user.created":
		return s.handleUserCreated(ctx, envelope)
	case "balance.created":
		return s.handleBalanceCreated(ctx, envelope)
	case "pet.created":
		return s.handlePetCreated(ctx, envelope)
	case "lesson.created":
		return s.handleLessonCreated(ctx, envelope)
	default:
		s.logger.Debug("unhandled event type", slog.String("type", envelope.EventType))
		return nil
	}
}

func (s *ProjectorService) handleUserCreated(ctx context.Context, env events.EventEnvelope) error {
	var payload events.UserCreatedPayloadDTO
	if err := json.Unmarshal(env.Payload, &payload); err != nil {
		s.logger.ErrorContext(ctx, "invalid UserCreated payload", slog.String("error", err.Error()))
		return nil
	}

	_, err := s.userRepo.CreateUser(ctx, db.CreateUserParams{
		ID:       payload.UserID,
		Username: payload.Username,
	})
	if err != nil {
		return fmt.Errorf("insert user projection to db: %w", err)
	}

	s.logger.Info("user projection created successfully", slog.String("user_id", payload.UserID.String()))
	return nil
}

func (s *ProjectorService) handleBalanceCreated(ctx context.Context, env events.EventEnvelope) error {
	var payload events.BalanceCreatedPayloadDTO
	if err := json.Unmarshal(env.Payload, &payload); err != nil {
		s.logger.ErrorContext(ctx, "invalid BalanceCreated payload", slog.String("error", err.Error()))
		return nil
	}

	_, err := s.balanceRepo.CreateBalance(ctx, db.CreateBalanceParams{
		ID:                    payload.BalanceID,
		UserID:                payload.UserID,
		MandatoryExpenses:     payload.MandatoryExpenses,
		DiscretionaryExpenses: payload.DiscretionaryExpenses,
		DreamSavings:          payload.DreamSavings,
		TotalSpent:            payload.TotalSpent,
	})
	if err != nil {
		return fmt.Errorf("insert balance projection to db: %w", err)
	}

	s.logger.Info("balance projection created successfully", slog.String("balance_id", payload.BalanceID.String()))
	return nil
}

func (s *ProjectorService) handlePetCreated(ctx context.Context, env events.EventEnvelope) error {
	var payload events.PetCreatedPayloadDTO
	if err := json.Unmarshal(env.Payload, &payload); err != nil {
		s.logger.ErrorContext(ctx, "invalid PetCreated payload", slog.String("error", err.Error()))
		return nil
	}

	_, err := s.petRepo.CreatePet(ctx, db.CreatePetParams{
		ID:                payload.PetID,
		UserID:            payload.UserID,
		Name:              payload.Name,
		HungerPoints:      payload.Hunger,
		SleepPoints:       payload.Sleep,
		MandatoryExpenses: payload.MandatoryExpenses,
		OptionalExpenses:  payload.OptionalExpenses,
	})
	if err != nil {
		return fmt.Errorf("insert pet projection to db: %w", err)
	}

	s.logger.Info("pet projection created successfully", slog.String("pet_id", payload.PetID.String()))
	return nil
}

func (s *ProjectorService) handleLessonCreated(ctx context.Context, env events.EventEnvelope) error {
	var payload events.LessonCreatedPayloadDTO
	if err := json.Unmarshal(env.Payload, &payload); err != nil {
		s.logger.ErrorContext(ctx, "invalid LessonCreated payload", slog.String("error", err.Error()))
		return nil
	}

	_, err := s.lessonRepo.CreateLesson(ctx, db.CreateLessonParams{
		ID:                    payload.LessonID,
		UserID:                payload.UserID,
		CompletedLessonsCount: int32(payload.CompletedLessonsCount),
	})
	if err != nil {
		if errors.Is(err, domain_errors.ErrLessonAlreadyExists) {
			s.logger.Info("lesson already projected", slog.String("lesson_id", payload.LessonID.String()))
			return nil
		}
		return fmt.Errorf("insert lesson projection to db: %w", err)
	}

	s.logger.Info("lesson projection created successfully", slog.String("lesson_id", payload.LessonID.String()))
	return nil
}
