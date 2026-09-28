package domain_errors

import "errors"

var (
	ErrLessonUserIDRequired          = errors.New("идентификатор пользователя обязателен")
	ErrLessonAlreadyExists           = errors.New("запись уроков уже существует")
	ErrLessonNotFound                = errors.New("запись уроков не найдена")
	ErrCompletedLessonsCountNegative = errors.New("количество завершённых уроков не может быть отрицательным")
)
