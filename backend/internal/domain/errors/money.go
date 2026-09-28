package domain_errors

import "errors"

const MaxMoney int64 = 999999999999

var (
	ErrMoneyNegative         = errors.New("сумма не может быть отрицательной")
	ErrMoneyOverflow         = errors.New("сумма превышает максимально допустимое значение")
	ErrBalanceUserIDRequired = errors.New("идентификатор пользователя обязателен")
	ErrBalanceAlreadyExists  = errors.New("баланс для пользователя уже существует")
	ErrBalanceNotFound       = errors.New("баланс не найден")
)
