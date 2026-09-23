package value_objects

import (
	"encoding/json"

	"github.com/google/uuid"
)

type IDv7 struct {
	value uuid.UUID
}

func NewIDv7() IDv7 {
	return IDv7{value: uuid.Must(uuid.NewV7())}
}

func FromUUID(u uuid.UUID) IDv7 {
	return IDv7{value: u}
}

func (i IDv7) UUID() uuid.UUID {
	return i.value
}

func (i IDv7) String() string {
	return i.value.String()
}

func (i IDv7) MarshalJSON() ([]byte, error) {
	return json.Marshal(i.value.String())
}
