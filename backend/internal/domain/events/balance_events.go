package events

import (
	"github.com/CodesForge/SunBunniesHackathon2026Project/internal/domain/value_objects"
	"github.com/google/uuid"
)

const (
	BalanceCreatedEventName = "balance.created"
)

type BalanceCreatedPayloadDTO struct {
	BalanceID             uuid.UUID `json:"balance_id"`
	UserID                uuid.UUID `json:"user_id"`
	MandatoryExpenses     int64     `json:"mandatory_expenses"`
	DiscretionaryExpenses int64     `json:"discretionary_expenses"`
	DreamSavings          int64     `json:"dream_savings"`
	TotalSpent            int64     `json:"total_spent"`
}

type BalanceCreatedEvent struct {
	BaseEvent

	balanceID     value_objects.IDv7
	userID        value_objects.IDv7
	mandatory     *value_objects.Money
	discretionary *value_objects.Money
	savings       *value_objects.Money
	total         *value_objects.Money
}

func NewBalanceCreatedEvent(
	balanceID, userID value_objects.IDv7,
	mandatory, discretionary, savings, total *value_objects.Money,
) BalanceCreatedEvent {
	return BalanceCreatedEvent{
		BaseEvent:     NewBaseEvent(balanceID),
		balanceID:     balanceID,
		userID:        userID,
		mandatory:     mandatory,
		discretionary: discretionary,
		savings:       savings,
		total:         total,
	}
}

func (e BalanceCreatedEvent) EventName() string {
	return BalanceCreatedEventName
}

func (e BalanceCreatedEvent) Payload() any {
	return BalanceCreatedPayloadDTO{
		BalanceID:             e.balanceID.UUID(),
		UserID:                e.userID.UUID(),
		MandatoryExpenses:     e.mandatory.Int64(),
		DiscretionaryExpenses: e.discretionary.Int64(),
		DreamSavings:          e.savings.Int64(),
		TotalSpent:            e.total.Int64(),
	}
}
