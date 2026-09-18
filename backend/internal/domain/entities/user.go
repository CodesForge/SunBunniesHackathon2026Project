package entities

import (
	"time"

	"github.com/CodesForge/SunBunniesHackathon2026Project/internal/domain/events"
	"github.com/CodesForge/SunBunniesHackathon2026Project/internal/domain/value_objects"
)

type User struct {
	AggregateRoot `json:"-"`

	ID        value_objects.IDv7      `json:"id"`
	Username  *value_objects.Username `json:"username"`
	CreatedAt time.Time               `json:"created_at"`
	UpdatedAt time.Time               `json:"updated_at"`
}

func NewUser(plainUsername string) (*User, error) {
	username, err := value_objects.NewUsername(plainUsername)
	if err != nil {
		return nil, err
	}

	now := time.Now().UTC()
	id := value_objects.NewIDv7()

	user := &User{
		ID:        id,
		Username:  username,
		CreatedAt: now,
		UpdatedAt: now,
	}

	user.RecordEvent(events.NewUserCreatedEvent(id, *username))

	return user, nil
}
