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

type PetService struct {
	eventRepo EventRepository
	petRepo PetRepository
	producer  Producer
	logger    *slog.Logger
}

func NewPetService(eventRepo EventRepository, petRepo PetRepository, producer Producer, logger *slog.Logger) *PetService {
	return &PetService{eventRepo: eventRepo, petRepo: petRepo, producer: producer, logger: logger}
}

func (s *PetService) CreatePet(ctx context.Context, input dto.CreatePetRequestDTO, userID uuid.UUID) (dto.CreatePetResponseDTO, error) {
	if _, err := s.petRepo.GetPetByUserID(ctx, userID); err == nil {
		return dto.CreatePetResponseDTO{}, domain_errors.ErrPetAlreadyExists
	} else if !errors.Is(err, domain_errors.ErrPetNotFound) {
		return dto.CreatePetResponseDTO{}, err
	}

	id := value_objects.FromUUID(userID)

	pet, err := entities.NewPet(id, input.Name)
	if err != nil {
		s.logger.ErrorContext(ctx, "create pet", slog.String("error", err.Error()), slog.String("pet_name", input.Name))
		return dto.CreatePetResponseDTO{}, err
	}

	events := pet.PullEvents()
	for _, event := range events {
		body, err := events2.SerializeEvent(event)
		if err != nil {
			s.logger.ErrorContext(ctx, "serialize event", slog.String("error", err.Error()), slog.String("pet_id", pet.ID.String()))
			return dto.CreatePetResponseDTO{}, err
		}

		payloadBytes, err := json.Marshal(event.Payload())
		if err != nil {
			s.logger.ErrorContext(ctx, "marshal payloadBytes", slog.String("error", err.Error()), slog.String("pet_id", pet.ID.String()))
			return dto.CreatePetResponseDTO{}, err
		}

		if err := s.eventRepo.CreateEvent(ctx, db.CreateEventParams{
			AggregateID: pet.ID.String(),
			AggregateType: "pet",
			Version: pet.Version,
			EventType: event.EventName(),
			Payload: payloadBytes,
		}); err != nil {
			s.logger.ErrorContext(ctx, "create event", slog.String("error", err.Error()), slog.String("pet_id", pet.ID.String()))
			return dto.CreatePetResponseDTO{}, err
		}

		if err := s.producer.Send(ctx, pet.ID.String(), body); err != nil {
			s.logger.ErrorContext(ctx, "producer send event", slog.String("error", err.Error()), slog.String("pet_id", pet.ID.String()))
			return dto.CreatePetResponseDTO{}, err
		}
	}

	return dto.CreatePetResponseDTO{
		Success: true,
		Pet: *pet,
	}, nil
}
