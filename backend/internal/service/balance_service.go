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

type BalanceService struct {
	eventRepo   EventRepository
	balanceRepo BalanceRepository
	producer    Producer
	logger      *slog.Logger
}

func NewBalanceService(eventRepo EventRepository, balanceRepo BalanceRepository, producer Producer, logger *slog.Logger) *BalanceService {
	return &BalanceService{eventRepo: eventRepo, balanceRepo: balanceRepo, producer: producer, logger: logger}
}

func (s *BalanceService) CreateBalance(ctx context.Context, input dto.CreateBalanceRequestDTO, userID uuid.UUID) (dto.CreateBalanceResponseDTO, error) {
	if _, err := s.balanceRepo.GetBalanceByUserID(ctx, userID); err == nil {
		return dto.CreateBalanceResponseDTO{}, domain_errors.ErrBalanceAlreadyExists
	} else if !errors.Is(err, domain_errors.ErrBalanceNotFound) {
		return dto.CreateBalanceResponseDTO{}, err
	}

	id := value_objects.FromUUID(userID)

	balance, err := entities.NewBalance(id, input.MandatoryExpenses, input.DiscretionaryExpenses, input.DreamSavings)
	if err != nil {
		s.logger.ErrorContext(ctx, "new balance", slog.String("error", err.Error()), slog.String("user_id", userID.String()))
		return dto.CreateBalanceResponseDTO{}, err
	}

	events := balance.PullEvents()
	for _, event := range events {
		body, err := events2.SerializeEvent(event)
		if err != nil {
			s.logger.ErrorContext(ctx, "serialize event", slog.String("error", err.Error()), slog.String("balance_id", balance.ID.String()))
			return dto.CreateBalanceResponseDTO{}, err
		}

		payloadBytes, err := json.Marshal(event.Payload())
		if err != nil {
			s.logger.ErrorContext(ctx, "marshal payloadBytes", slog.String("error", err.Error()), slog.String("balance_id", balance.ID.String()))
			return dto.CreateBalanceResponseDTO{}, err
		}

		if err := s.eventRepo.CreateEvent(ctx, db.CreateEventParams{
			AggregateID:   balance.ID.String(),
			AggregateType: "balance",
			Version:       balance.Version,
			EventType:     event.EventName(),
			Payload:       payloadBytes,
		}); err != nil {
			s.logger.ErrorContext(ctx, "create event", slog.String("error", err.Error()), slog.String("balance_id", balance.ID.String()))
			return dto.CreateBalanceResponseDTO{}, err
		}

		if err := s.producer.Send(ctx, balance.UserID.String(), body); err != nil {
			s.logger.ErrorContext(ctx, "producer send event", slog.String("error", err.Error()), slog.String("balance_id", balance.ID.String()))
			return dto.CreateBalanceResponseDTO{}, err
		}
	}

	return dto.CreateBalanceResponseDTO{
		Success: true,
		Balance: *balance,
	}, nil
}
