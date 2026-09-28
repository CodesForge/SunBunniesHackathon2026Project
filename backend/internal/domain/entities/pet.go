package entities

import (
	"time"

	"github.com/CodesForge/SunBunniesHackathon2026Project/internal/domain/events"
	"github.com/CodesForge/SunBunniesHackathon2026Project/internal/domain/value_objects"
)

type Pet struct {
	AggregateRoot `json:"-"`

	ID                value_objects.IDv7     `json:"id"`
	UserID            value_objects.IDv7     `json:"user_id"`
	Name              *value_objects.PetName `json:"name"`
	Hunger            value_objects.Hunger   `json:"hunger_points"`
	Sleep             value_objects.Sleep    `json:"sleep_points"`
	MandatoryExpenses *value_objects.Money   `json:"mandatory_expenses"`
	OptionalExpenses  *value_objects.Money   `json:"optional_expenses"`
	Version           int64                  `json:"version"`
	CreatedAt         time.Time              `json:"created_at"`
	UpdatedAt         time.Time              `json:"updated_at"`
}

func NewPet(userID value_objects.IDv7, name string) (*Pet, error) {
	petName, err := value_objects.NewPetName(name)
	if err != nil {
		return nil, err
	}

	hunger, err := value_objects.NewHunger(90)
	if err != nil {
		return nil, err
	}

	sleep, err := value_objects.NewSleep(90)
	if err != nil {
		return nil, err
	}

	mandatory, err := value_objects.NewMoney(0)
	if err != nil {
		return nil, err
	}

	optional, err := value_objects.NewMoney(0)
	if err != nil {
		return nil, err
	}

	now := time.Now().UTC()
	id := value_objects.NewIDv7()

	pet := &Pet{
		ID:                id,
		UserID:            userID,
		Name:              petName,
		Hunger:            hunger,
		Sleep:             sleep,
		MandatoryExpenses: mandatory,
		OptionalExpenses:  optional,
		Version:           1,
		CreatedAt:         now,
		UpdatedAt:         now,
	}

	pet.RecordEvent(events.NewPetCreatedEvent(id, userID, petName, hunger, sleep, mandatory, optional))

	return pet, nil
}
