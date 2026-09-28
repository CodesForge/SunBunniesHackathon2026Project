package dto

import "github.com/CodesForge/SunBunniesHackathon2026Project/internal/domain/entities"

type CreatePetRequestDTO struct {
	Name string `json:"name"`
}

type CreatePetResponseDTO struct {
	Success bool         `json:"success"`
	Pet     entities.Pet `json:"pet"`
}
