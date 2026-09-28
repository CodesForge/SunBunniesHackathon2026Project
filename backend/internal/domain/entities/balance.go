package entities

import (
	"time"

	"github.com/CodesForge/SunBunniesHackathon2026Project/internal/domain/events"
	"github.com/CodesForge/SunBunniesHackathon2026Project/internal/domain/value_objects"
)

type Balance struct {
	AggregateRoot `json:"-"`

	ID                    value_objects.IDv7   `json:"id"`
	UserID                value_objects.IDv7   `json:"user_id"`
	MandatoryExpenses     *value_objects.Money `json:"mandatory_expenses"`
	DiscretionaryExpenses *value_objects.Money `json:"discretionary_expenses"`
	DreamSavings          *value_objects.Money `json:"dream_savings"`
	TotalSpent            *value_objects.Money `json:"total_spent"`
	Version               int64                `json:"version"`
	CreatedAt             time.Time            `json:"created_at"`
	UpdatedAt             time.Time            `json:"updated_at"`
}

func NewBalance(
	userID value_objects.IDv7,
	mandatoryExpenses int64,
	discretionaryExpenses int64,
	dreamSavings int64,
) (*Balance, error) {
	mandatory, err := value_objects.NewMoney(mandatoryExpenses)
	if err != nil {
		return nil, err
	}

	discretionary, err := value_objects.NewMoney(discretionaryExpenses)
	if err != nil {
		return nil, err
	}

	savings, err := value_objects.NewMoney(dreamSavings)
	if err != nil {
		return nil, err
	}

	total, err := mandatory.Add(*discretionary)
	if err != nil {
		return nil, err
	}

	total, err = total.Add(*savings)
	if err != nil {
		return nil, err
	}

	now := time.Now().UTC()
	id := value_objects.NewIDv7()

	balance := &Balance{
		ID: id,
		UserID: userID,
		MandatoryExpenses: mandatory,
		DiscretionaryExpenses: discretionary,
		DreamSavings: savings,
		TotalSpent: total,
		Version: 1,
		CreatedAt: now,
		UpdatedAt: now,
	}

	balance.RecordEvent(events.NewBalanceCreatedEvent(id, userID, mandatory, discretionary, savings, total))

	return balance, nil
}