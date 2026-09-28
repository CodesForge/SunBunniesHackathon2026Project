package value_objects

import (
	"encoding/json"

	domain_errors "github.com/CodesForge/SunBunniesHackathon2026Project/internal/domain/errors"
)

type CompletedLessonsCount struct {
	value int
}

func NewCompletedLessonsCount(value int) (CompletedLessonsCount, error) {
	if value < 0 {
		return CompletedLessonsCount{}, domain_errors.ErrCompletedLessonsCountNegative
	}
	return CompletedLessonsCount{value: value}, nil
}

func (c CompletedLessonsCount) Int() int {
	return c.value
}

func (c CompletedLessonsCount) MarshalJSON() ([]byte, error) {
	return json.Marshal(c.value)
}
