package domain_errors

import "errors"

var (
	ErrEventAlreadyExists = errors.New("событие с такой версией для агрегата уже существует")
)
