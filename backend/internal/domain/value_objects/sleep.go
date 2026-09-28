package value_objects

import (
	"encoding/json"

	domain_errors "github.com/CodesForge/SunBunniesHackathon2026Project/internal/domain/errors"
)

type Sleep struct {
	value int16
}

func NewSleep(value int16) (Sleep, error) {
	if value < 0 || value > 100 {
		return Sleep{}, domain_errors.ErrSleepOutOfRange
	}
	return Sleep{value: value}, nil
}

func (s Sleep) Int16() int16 {
	return s.value
}

func (s Sleep) MarshalJSON() ([]byte, error) {
	return json.Marshal(s.value)
}
