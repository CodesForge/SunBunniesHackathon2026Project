package events

import (
	"github.com/CodesForge/SunBunniesHackathon2026Project/internal/domain/value_objects"
	"github.com/google/uuid"
)

const LessonCreatedEventName = "lesson.created"

type LessonCreatedPayloadDTO struct {
	LessonID              uuid.UUID `json:"lesson_id"`
	UserID                uuid.UUID `json:"user_id"`
	CompletedLessonsCount int       `json:"completed_lessons_count"`
}

type LessonCreatedEvent struct {
	BaseEvent
	lessonID  value_objects.IDv7
	userID    value_objects.IDv7
	completed value_objects.CompletedLessonsCount
}

func NewLessonCreatedEvent(
	lessonID, userID value_objects.IDv7,
	completed value_objects.CompletedLessonsCount,
) LessonCreatedEvent {
	return LessonCreatedEvent{
		BaseEvent: NewBaseEvent(lessonID),
		lessonID:  lessonID,
		userID:    userID,
		completed: completed,
	}
}

func (e LessonCreatedEvent) EventName() string {
	return LessonCreatedEventName
}

func (e LessonCreatedEvent) Payload() any {
	return LessonCreatedPayloadDTO{
		LessonID:              e.lessonID.UUID(),
		UserID:                e.userID.UUID(),
		CompletedLessonsCount: e.completed.Int(),
	}
}
