package entities

import "github.com/CodesForge/SunBunniesHackathon2026Project/internal/domain/events"

type AggregateRoot struct {
	version int64
	events  []events.DomainEvent
}

func (a *AggregateRoot) RecordEvent(e events.DomainEvent) {
	a.events = append(a.events, e)
}

func (a *AggregateRoot) PullEvents() []events.DomainEvent {
	evs := a.events
	a.events = nil
	return evs
}

func (a *AggregateRoot) Version() int64 {
	return a.version
}

func (a *AggregateRoot) IncrementVersion() {
	a.version++
}
