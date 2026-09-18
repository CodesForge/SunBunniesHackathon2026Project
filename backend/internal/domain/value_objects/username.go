package value_objects

import (
	"regexp"

	domain_errors "github.com/CodesForge/SunBunniesHackathon2026Project/internal/domain/errors"
)

var usernameRegex = regexp.MustCompile(`^[a-zA-Zа-яА-ЯёЁ0-9]+$`)

type Username struct {
	value string
}

func NewUsername(value string) (*Username, error) {
	if err := validateUsername(value); err != nil {
		return nil, err
	}

	return &Username{value: value}, nil
}

func validateUsername(value string) error {
	if value == "" {
		return domain_errors.ErrUsernameEmpty
	}
	if len(value) < domain_errors.MinUsernameLength {
		return domain_errors.ErrUsernameTooShort
	}
	if len(value) > domain_errors.MaxUsernameLength {
		return domain_errors.ErrUsernameTooLong
	}
	if !usernameRegex.MatchString(value) {
		return domain_errors.ErrUsernameInvalid
	}

	return nil
}

func (u *Username) String() string {
	return u.value
}