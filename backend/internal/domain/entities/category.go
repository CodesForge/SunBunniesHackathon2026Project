package entities

import (
	"time"

	"github.com/CodesForge/SunBunniesHackathon2026Project/internal/domain/events"
	"github.com/CodesForge/SunBunniesHackathon2026Project/internal/domain/value_objects"
)

type Category struct {
	AggregateRoot `json:"-"`

	ID                value_objects.IDv7   `json:"id"`
	UserID            value_objects.IDv7   `json:"user_id"`
	TotalSpent        *value_objects.Money `json:"total_spent"`
	MandatoryExpenses *value_objects.Money `json:"mandatory_expenses"`
	OptionalExpenses  *value_objects.Money `json:"optional_expenses"`
	DreamSavings      *value_objects.Money `json:"dream_savings"`
	Version           int64                `json:"version"`
	CreatedAt         time.Time            `json:"created_at"`
	UpdatedAt         time.Time            `json:"updated_at"`
}

func NewCategory(
	userID value_objects.IDv7,
	mandatoryExpenses, optionalExpenses, dreamSavings int64,
) (*Category, error) {
	mandatory, err := value_objects.NewMoney(mandatoryExpenses)
	if err != nil {
		return nil, err
	}

	optional, err := value_objects.NewMoney(optionalExpenses)
	if err != nil {
		return nil, err
	}

	savings, err := value_objects.NewMoney(dreamSavings)
	if err != nil {
		return nil, err
	}

	total, err := mandatory.Add(*optional)
	if err != nil {
		return nil, err
	}

	total, err = total.Add(*savings)
	if err != nil {
		return nil, err
	}

	now := time.Now().UTC()
	id := value_objects.NewIDv7()

	category := &Category{
		ID:                id,
		UserID:            userID,
		TotalSpent:        total,
		MandatoryExpenses: mandatory,
		OptionalExpenses:  optional,
		DreamSavings:      savings,
		Version:           1,
		CreatedAt:         now,
		UpdatedAt:         now,
	}

	category.RecordEvent(events.NewCategoryCreatedEvent(id, userID, mandatory, optional, savings, total))

	return category, nil
}
