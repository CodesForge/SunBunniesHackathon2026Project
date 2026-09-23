package service

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"log/slog"

	db "github.com/CodesForge/SunBunniesHackathon2026Project/internal/database/generated"
	"github.com/CodesForge/SunBunniesHackathon2026Project/internal/domain/entities"
	domain_errors "github.com/CodesForge/SunBunniesHackathon2026Project/internal/domain/errors"
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
	userRepo  UserRepository
	eventRepo EventRepository
	producer  Producer
	logger    *slog.Logger
}

func NewUserService(userRepo UserRepository, eventRepo EventRepository, producer Producer, logger *slog.Logger) *UserService {
	return &UserService{userRepo: userRepo, eventRepo: eventRepo, producer: producer, logger: logger}
}

func (r *UserService) CreateUser(ctx context.Context, input dto.CreateUserRequestDTO) (dto.CreateUserResponseDTO, error) {
	if _, err := r.userRepo.GetUserByUsername(ctx, input.Username); err == nil {
		return dto.CreateUserResponseDTO{}, domain_errors.ErrUsernameAlreadyExists
	} else if !errors.Is(err, domain_errors.ErrUserNotFound) {
		return dto.CreateUserResponseDTO{}, err
	}

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
			r.logger.ErrorContext(ctx, "marshal payloadBytes", slog.String("error", err.Error()), slog.String("username", input.Username))
			return dto.CreateUserResponseDTO{}, fmt.Errorf("marshal event payload: %w", err)
		}

		if err := r.eventRepo.CreateEvent(ctx, db.CreateEventParams{
			AggregateID:   user.ID.String(),
			AggregateType: "User",
			Version:       user.Version,
			EventType:     event.EventName(),
			Payload:       payloadBytes,
		}); err != nil {
			r.logger.ErrorContext(ctx, "create event", slog.String("error", err.Error()), slog.String("username", input.Username))
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
