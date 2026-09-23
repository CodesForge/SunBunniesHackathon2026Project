package domain_errors

import "errors"

var (
	ErrUsernameAlreadyExists = errors.New("имя пользователя уже занято")
	ErrUserNotFound          = errors.New("пользователь не найден")
)
