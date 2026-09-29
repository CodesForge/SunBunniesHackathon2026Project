package events

import (
	"github.com/CodesForge/SunBunniesHackathon2026Project/internal/domain/value_objects"
	"github.com/google/uuid"
)

const CategoryCreatedEventName = "category.created"

type CategoryCreatedPayloadDTO struct {
	CategoryID        uuid.UUID `json:"category_id"`
	UserID            uuid.UUID `json:"user_id"`
	TotalSpent        int64     `json:"total_spent"`
	MandatoryExpenses int64     `json:"mandatory_expenses"`
	OptionalExpenses  int64     `json:"optional_expenses"`
	DreamSavings      int64     `json:"dream_savings"`
}

type CategoryCreatedEvent struct {
	BaseEvent
	categoryID value_objects.IDv7
	userID     value_objects.IDv7
	total      *value_objects.Money
	mandatory  *value_objects.Money
	optional   *value_objects.Money
	savings    *value_objects.Money
}

func NewCategoryCreatedEvent(
	categoryID, userID value_objects.IDv7,
	mandatory, optional, savings, total *value_objects.Money,
) CategoryCreatedEvent {
	return CategoryCreatedEvent{
		BaseEvent:  NewBaseEvent(categoryID),
		categoryID: categoryID,
		userID:     userID,
		total:      total,
		mandatory:  mandatory,
		optional:   optional,
		savings:    savings,
	}
}

func (e CategoryCreatedEvent) EventName() string {
	return CategoryCreatedEventName
}

func (e CategoryCreatedEvent) Payload() any {
	return CategoryCreatedPayloadDTO{
		CategoryID:        e.categoryID.UUID(),
		UserID:            e.userID.UUID(),
		TotalSpent:        e.total.Int64(),
		MandatoryExpenses: e.mandatory.Int64(),
		OptionalExpenses:  e.optional.Int64(),
		DreamSavings:      e.savings.Int64(),
	}
}
