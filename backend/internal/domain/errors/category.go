package domain_errors

import "errors"

var (
	ErrCategoryUserIDRequired = errors.New("идентификатор пользователя обязателен")
	ErrCategoryAlreadyExists  = errors.New("категории для пользователя уже существуют")
	ErrCategoryNotFound       = errors.New("категории не найдены")
)
