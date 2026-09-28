package value_objects

import (
	"encoding/json"

	domain_errors "github.com/CodesForge/SunBunniesHackathon2026Project/internal/domain/errors"
)

type PetName struct {
	value string
}

func NewPetName(value string) (*PetName, error) {
	if value == "" {
		return nil, domain_errors.ErrPetNameEmpty
	}
	if len(value) < domain_errors.MinPetNameLength {
		return nil, domain_errors.ErrPetNameTooShort
	}
	if len(value) > domain_errors.MaxPetNameLength {
		return nil, domain_errors.ErrPetNameTooLong
	}
	return &PetName{value: value}, nil
}

func (p *PetName) String() string {
	return p.value
}

func (p PetName) MarshalJSON() ([]byte, error) {
	return json.Marshal(p.value)
}
