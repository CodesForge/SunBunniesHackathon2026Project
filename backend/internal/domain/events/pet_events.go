package events

import (
	"github.com/CodesForge/SunBunniesHackathon2026Project/internal/domain/value_objects"
	"github.com/google/uuid"
)

const PetCreatedEventName = "pet.created"

type PetCreatedPayloadDTO struct {
	PetID             uuid.UUID `json:"pet_id"`
	UserID            uuid.UUID `json:"user_id"`
	Name              string    `json:"name"`
	Hunger            int16     `json:"hunger_points"`
	Sleep             int16     `json:"sleep_points"`
	MandatoryExpenses int64     `json:"mandatory_expenses"`
	OptionalExpenses  int64     `json:"optional_expenses"`
}

type PetCreatedEvent struct {
	BaseEvent
	petID     value_objects.IDv7
	userID    value_objects.IDv7
	name      *value_objects.PetName
	hunger    value_objects.Hunger
	sleep     value_objects.Sleep
	mandatory *value_objects.Money
	optional  *value_objects.Money
}

func NewPetCreatedEvent(
	petID, userID value_objects.IDv7,
	name *value_objects.PetName,
	hunger value_objects.Hunger,
	sleep value_objects.Sleep,
	mandatory, optional *value_objects.Money,
) PetCreatedEvent {
	return PetCreatedEvent{
		BaseEvent: NewBaseEvent(petID),
		petID:     petID,
		userID:    userID,
		name:      name,
		hunger:    hunger,
		sleep:     sleep,
		mandatory: mandatory,
		optional:  optional,
	}
}

func (e PetCreatedEvent) EventName() string {
	return PetCreatedEventName
}

func (e PetCreatedEvent) Payload() any {
	return PetCreatedPayloadDTO{
		PetID:             e.petID.UUID(),
		UserID:            e.userID.UUID(),
		Name:              e.name.String(),
		Hunger:            e.hunger.Int16(),
		Sleep:             e.sleep.Int16(),
		MandatoryExpenses: e.mandatory.Int64(),
		OptionalExpenses:  e.optional.Int64(),
	}
}
