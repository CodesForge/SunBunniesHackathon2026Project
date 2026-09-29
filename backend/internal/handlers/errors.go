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
		errors.Is(err, domain_errors.ErrUsernameInvalid),
		errors.Is(err, domain_errors.ErrMoneyNegative),
		errors.Is(err, domain_errors.ErrMoneyOverflow),
		errors.Is(err, domain_errors.ErrBalanceUserIDRequired),
		errors.Is(err, domain_errors.ErrPetNameEmpty),
		errors.Is(err, domain_errors.ErrPetNameTooShort),
		errors.Is(err, domain_errors.ErrPetNameTooLong),
		errors.Is(err, domain_errors.ErrPetNameTaken),
		errors.Is(err, domain_errors.ErrHungerOutOfRange),
		errors.Is(err, domain_errors.ErrSleepOutOfRange),
		errors.Is(err, domain_errors.ErrPetUserIDRequired),
		errors.Is(err, domain_errors.ErrLessonUserIDRequired),
		errors.Is(err, domain_errors.ErrCompletedLessonsCountNegative),
		errors.Is(err, domain_errors.ErrCategoryUserIDRequired):
		return http.StatusBadRequest, err.Error()
	case errors.Is(err, domain_errors.ErrUsernameAlreadyExists),
		errors.Is(err, domain_errors.ErrEventAlreadyExists),
		errors.Is(err, domain_errors.ErrBalanceAlreadyExists),
		errors.Is(err, domain_errors.ErrPetAlreadyExists),
		errors.Is(err, domain_errors.ErrLessonAlreadyExists),
		errors.Is(err, domain_errors.ErrCategoryAlreadyExists):
		return http.StatusConflict, err.Error()
	case errors.Is(err, domain_errors.ErrUserNotFound),
		errors.Is(err, domain_errors.ErrBalanceNotFound),
		errors.Is(err, domain_errors.ErrPetNotFound),
		errors.Is(err, domain_errors.ErrLessonNotFound),
		errors.Is(err, domain_errors.ErrCategoryNotFound):
		return http.StatusNotFound, err.Error()
	default:
		return http.StatusInternalServerError, "internal server error"
	}
}
