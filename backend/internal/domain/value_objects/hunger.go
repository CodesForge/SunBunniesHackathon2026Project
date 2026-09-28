package value_objects

import (
	"encoding/json"

	domain_errors "github.com/CodesForge/SunBunniesHackathon2026Project/internal/domain/errors"
)

type Hunger struct {
	value int16
}

func NewHunger(value int16) (Hunger, error) {
	if value < 0 || value > 100 {
		return Hunger{}, domain_errors.ErrHungerOutOfRange
	}
	return Hunger{value: value}, nil
}

func (h Hunger) Int16() int16 {
	return h.value
}

func (h Hunger) MarshalJSON() ([]byte, error) {
	return json.Marshal(h.value)
}
