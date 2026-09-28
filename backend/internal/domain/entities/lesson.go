package entities

import (
	"time"

	"github.com/CodesForge/SunBunniesHackathon2026Project/internal/domain/events"
	"github.com/CodesForge/SunBunniesHackathon2026Project/internal/domain/value_objects"
)

type Lesson struct {
	AggregateRoot `json:"-"`

	ID                    value_objects.IDv7                  `json:"id"`
	UserID                value_objects.IDv7                  `json:"user_id"`
	CompletedLessonsCount value_objects.CompletedLessonsCount `json:"completed_lessons_count"`
	Version               int64                               `json:"version"`
	CreatedAt             time.Time                           `json:"created_at"`
	UpdatedAt             time.Time                           `json:"updated_at"`
}

func NewLesson(userID value_objects.IDv7, completedCount int) (*Lesson, error) {
	completed, err := value_objects.NewCompletedLessonsCount(completedCount)
	if err != nil {
		return nil, err
	}

	now := time.Now().UTC()
	id := value_objects.NewIDv7()

	lesson := &Lesson{
		ID:                    id,
		UserID:                userID,
		CompletedLessonsCount: completed,
		Version:               1,
		CreatedAt:             now,
		UpdatedAt:             now,
	}

	lesson.RecordEvent(events.NewLessonCreatedEvent(id, userID, completed))

	return lesson, nil
}
