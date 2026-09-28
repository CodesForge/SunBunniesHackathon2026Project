package value_objects

import (
	"strconv"

	"encoding/json"

	domain_errors "github.com/CodesForge/SunBunniesHackathon2026Project/internal/domain/errors"
)

type Money struct {
	value int64
}

func NewMoney(value int64) (*Money, error) {
	if err := validateMoney(value); err != nil {
		return nil, err
	}

	return &Money{value: value}, nil
}

func validateMoney(value int64) error {
	if value < 0 {
		return domain_errors.ErrMoneyNegative
	}
	if value > domain_errors.MaxMoney {
		return domain_errors.ErrMoneyOverflow
	}

	return nil
}

func Zero() *Money {
	return &Money{value: 0}
}

func (m *Money) Add(other Money) (*Money, error) {
	return NewMoney(m.value + other.value)
}

func (m *Money) Sun(other Money) (*Money, error) {
	return NewMoney(m.value - other.value)
}

func (m *Money) Equal(other Money) bool {
	return m.value == other.value
}

func (m *Money) Int64() int64 {
	return m.value
}

func (m *Money) String() string {
	return strconv.FormatInt(m.value, 10)
}

func (m *Money) MarshalJSON() ([]byte, error) {
	return json.Marshal(m.value)
}
