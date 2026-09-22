package events

import (
	"github.com/CodesForge/SunBunniesHackathon2026Project/internal/domain/value_objects"
	"github.com/google/uuid"
)

const (
	UserCreatedEventName = "user.created"
)

type UserCreatedPayloadDTO struct {
	UserID   uuid.UUID `json:"user_id"`
	Username string    `json:"username"`
}

type UserCreatedEvent struct {
	BaseEvent
	userID   value_objects.IDv7
	username value_objects.Username
}

func NewUserCreatedEvent(userID value_objects.IDv7, username value_objects.Username) UserCreatedEvent {
	return UserCreatedEvent{
		BaseEvent: NewBaseEvent(userID),
		userID:    userID,
		username:  username,
	}
}

func (e UserCreatedEvent) EventName() string {
	return UserCreatedEventName
}

func (e UserCreatedEvent) Payload() any {
	return UserCreatedPayloadDTO{
		UserID:   e.ID.UUID(),
		Username: e.username.String(),
	}
}
