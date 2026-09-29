package dto

import (
	"github.com/CodesForge/SunBunniesHackathon2026Project/internal/domain/entities"
)

type CreateCategoryRequestDTO struct {
	MandatoryExpenses int64 `json:"mandatory_expenses"`
	OptionalExpenses  int64 `json:"optional_expenses"`
	DreamSavings      int64 `json:"dream_savings"`
}

type CreateCategoryResponseDTO struct {
	Success  bool              `json:"success"`
	Category entities.Category `json:"category"`
}
