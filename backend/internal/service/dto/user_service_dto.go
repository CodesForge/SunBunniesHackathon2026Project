package dto

import (
	"github.com/CodesForge/SunBunniesHackathon2026Project/internal/domain/entities"
)

type CreateUserRequestDTO struct {
	Username string `json:"username"`
}

type CreateUserResponseDTO struct {
	Success bool          `json:"success"`
	User    entities.User `json:"user"`
}
