package service

import (
	"context"
	"encoding/json"
	"fmt"
	"log/slog"

	db "github.com/CodesForge/SunBunniesHackathon2026Project/internal/database/generated"
	"github.com/CodesForge/SunBunniesHackathon2026Project/internal/domain/entities"
	events2 "github.com/CodesForge/SunBunniesHackathon2026Project/internal/domain/events"
	"github.com/CodesForge/SunBunniesHackathon2026Project/internal/service/dto"
)

type Producer interface {
	Send(ctx context.Context, key string, payload any) error
}

type EventRepository interface {
	CreateEvent(ctx context.Context, params db.CreateEventParams) error
}

type UserService struct {
	repo     EventRepository
	producer Producer
	logger   *slog.Logger
}

func NewUserService(repo EventRepository, producer Producer, logger *slog.Logger) *UserService {
	return &UserService{repo: repo, producer: producer, logger: logger}
}

func (r *UserService) CreateUser(ctx context.Context, input dto.CreateUserRequestDTO) (dto.CreateUserResponseDTO, error) {
	user, err := entities.NewUser(input.Username)
	if err != nil {
		r.logger.ErrorContext(ctx, "create user entity", slog.String("error", err.Error()), slog.String("username", input.Username))
		return dto.CreateUserResponseDTO{}, err
	}

	events := user.PullEvents()
	for _, event := range events {
		body, err := events2.SerializeEvent(event)
		if err != nil {
			r.logger.ErrorContext(ctx, "serialize event", slog.String("error", err.Error()), slog.String("username", input.Username))
			return dto.CreateUserResponseDTO{}, err
		}

		payloadBytes, err := json.Marshal(event.Payload())
		if err != nil {
			return dto.CreateUserResponseDTO{}, fmt.Errorf("marshal event payload: %w", err)
		}

		if err := r.repo.CreateEvent(ctx, db.CreateEventParams{
			AggregateID:   user.ID.String(),
			AggregateType: "User",
			Version:       user.Version,
			EventType:     event.EventName(),
			Payload:       payloadBytes,
		}); err != nil {
			return dto.CreateUserResponseDTO{}, err
		}

		if err := r.producer.Send(ctx, user.ID.String(), body); err != nil {
			r.logger.ErrorContext(ctx, "producer send event", slog.String("error", err.Error()), slog.String("username", input.Username))
			return dto.CreateUserResponseDTO{}, err
		}
	}

	return dto.CreateUserResponseDTO{
		Success: true,
		User:    *user,
	}, nil
}
