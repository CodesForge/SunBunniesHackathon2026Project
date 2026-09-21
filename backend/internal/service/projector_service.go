package service

import (
	"context"
	"encoding/json"
	"fmt"
	"log/slog"

	db "github.com/CodesForge/SunBunniesHackathon2026Project/internal/database/generated"
	"github.com/CodesForge/SunBunniesHackathon2026Project/internal/domain/events"
	"github.com/segmentio/kafka-go"
)

type UserRepository interface {
	CreateUser(ctx context.Context, params db.CreateUserParams) (db.User, error)
}

type ProjectorService struct {
	repo   UserRepository
	logger *slog.Logger
}

func NewProjectorService(repo UserRepository, logger *slog.Logger) *ProjectorService {
	return &ProjectorService{
		repo:   repo,
		logger: logger,
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

	_, err := s.repo.CreateUser(ctx, db.CreateUserParams{
		ID:       payload.UserID,
		Username: payload.Username,
	})
	if err != nil {
		return fmt.Errorf("insert user projection to db: %w", err)
	}

	s.logger.Info("user projection created successfully", slog.String("user_id", payload.UserID.String()))
	return nil
}
