package domain_errors

import "errors"

const (
	MinPetNameLength = 3
	MaxPetNameLength = 25
)

var (
	ErrPetNameEmpty      = errors.New("имя питомца не может быть пустым")
	ErrPetNameTooShort   = errors.New("имя питомца не может быть меньше 3 символов")
	ErrPetNameTooLong    = errors.New("имя питомца не может быть больше 25 символов")
	ErrPetNameTaken      = errors.New("имя питомца уже занято")
	ErrHungerOutOfRange  = errors.New("сытость должна быть от 0 до 100")
	ErrSleepOutOfRange   = errors.New("усталость должна быть от 0 до 100")
	ErrPetUserIDRequired = errors.New("идентификатор пользователя обязателен")
	ErrPetAlreadyExists  = errors.New("питомец уже существует")
	ErrPetNotFound       = errors.New("питомец не найден")
)
