package events

import (
	"time"

	"github.com/CodesForge/SunBunniesHackathon2026Project/internal/domain/value_objects"
)

type DomainEvent interface {
	EventID() value_objects.IDv7
	EventName() string
	OccurredAt() time.Time
	AggregateID() value_objects.IDv7
	Payload() any
}

type BaseEvent struct {
	ID        value_objects.IDv7 `json:"event_id"`
	AggID     value_objects.IDv7 `json:"aggregate_id"`
	Timestamp time.Time          `json:"occurred_at"`
}

func NewBaseEvent(aggregateID value_objects.IDv7) BaseEvent {
	return BaseEvent{
		ID:        value_objects.NewIDv7(),
		AggID:     aggregateID,
		Timestamp: time.Now().UTC(),
	}
}

func (b BaseEvent) EventID() value_objects.IDv7 {
	return b.ID
}

func (b BaseEvent) OccurredAt() time.Time {
	return b.Timestamp
}

func (b BaseEvent) AggregateID() value_objects.IDv7 {
	return b.AggID
}
