package events

import (
	"encoding/json"
	"fmt"
	"time"
)

type EventEnvelope struct {
	EventID     string          `json:"event_id"`
	EventType   string          `json:"event_type"`
	AggregateID string          `json:"aggregate_id"`
	OccurredAt  time.Time       `json:"occurred_at"`
	Payload     json.RawMessage `json:"payload"`
}

func SerializeEvent(event DomainEvent) (EventEnvelope, error) {
	payloadBytes, err := json.Marshal(event.Payload())
	if err != nil {
		return EventEnvelope{}, fmt.Errorf("marshal payload for %s: %w", event.EventName(), err)
	}

	return EventEnvelope{
		EventID:     event.EventID().String(),
		EventType:   event.EventName(),
		AggregateID: event.AggregateID().String(),
		OccurredAt:  event.OccurredAt(),
		Payload:     payloadBytes,
	}, err
}
