package dto

import (
	"github.com/CodesForge/SunBunniesHackathon2026Project/internal/domain/entities"
)

type CreateBalanceRequestDTO struct {
	MandatoryExpenses     int64 `json:"mandatory_expenses"`
	DiscretionaryExpenses int64 `json:"discretionary_expenses"`
	DreamSavings          int64 `json:"dream_savings"`
}

type CreateBalanceResponseDTO struct {
	Success bool             `json:"success"`
	Balance entities.Balance `json:"balance"`
}
