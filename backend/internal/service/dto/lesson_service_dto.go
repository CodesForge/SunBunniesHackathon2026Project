package dto

import (
	"github.com/CodesForge/SunBunniesHackathon2026Project/internal/domain/entities"
)

type CreateLessonRequestDTO struct {
	CompletedLessonsCount int `json:"completed_lessons_count"`
}

type CreateLessonResponseDTO struct {
	Success bool            `json:"success"`
	Lesson  entities.Lesson `json:"lesson"`
}
