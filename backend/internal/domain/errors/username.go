package domain_errors

import (
	"errors"
	"fmt"
)

const (
	MinUsernameLength = 3
	MaxUsernameLength = 25
)

var (
	ErrUsernameEmpty    = errors.New("имя пользователя не может быть пустым")
	ErrUsernameTooShort = fmt.Errorf("имя пользователя не может быть меньше %d символов", MinUsernameLength)
	ErrUsernameTooLong  = fmt.Errorf("имя пользователя не может быть больше %d символов", MaxUsernameLength)
	ErrUsernameInvalid  = errors.New("разрешены только буквы (русские и английские) и цифры")
)
