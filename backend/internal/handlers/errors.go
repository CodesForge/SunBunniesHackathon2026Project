package handlers

import (
	"errors"
	"net/http"

	domain_errors "github.com/CodesForge/SunBunniesHackathon2026Project/internal/domain/errors"
)

func mapServiceError(err error) (int, string) {
	switch {
	case errors.Is(err, domain_errors.ErrUsernameEmpty),
		errors.Is(err, domain_errors.ErrUsernameTooShort),
		errors.Is(err, domain_errors.ErrUsernameTooLong),
		errors.Is(err, domain_errors.ErrUsernameInvalid):
		return http.StatusBadRequest, err.Error()
	case errors.Is(err, domain_errors.ErrUsernameAlreadyExists),
		errors.Is(err, domain_errors.ErrEventAlreadyExists):
		return http.StatusConflict, err.Error()
	default:
		return http.StatusInternalServerError, "internal server error"
	}
}
