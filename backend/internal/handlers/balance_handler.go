package handlers

import (
	"context"
	"encoding/json"
	"net/http"

	"github.com/CodesForge/SunBunniesHackathon2026Project/internal/middleware"
	"github.com/CodesForge/SunBunniesHackathon2026Project/internal/service/dto"
	"github.com/google/uuid"
)

type BalanceService interface {
	CreateBalance(ctx context.Context, input dto.CreateBalanceRequestDTO, userID uuid.UUID) (dto.CreateBalanceResponseDTO, error)
}

type BalanceHandler struct {
	svc BalanceService
}

func NewBalanceHandler(svc BalanceService) *BalanceHandler {
	return &BalanceHandler{svc: svc}
}

func (h *BalanceHandler) CreateBalance(w http.ResponseWriter, r *http.Request) {
	userID, ok := middleware.UserIDFromContext(r.Context())
	if !ok {
		SendError(w, http.StatusUnauthorized, "unauthorized")
		return
	}

	var req dto.CreateBalanceRequestDTO
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		SendError(w, http.StatusBadRequest, err.Error())
		return
	}

	resp, err := h.svc.CreateBalance(r.Context(), req, userID)
	if err != nil {
		code, msg := mapServiceError(err)
		SendError(w, code, msg)
		return
	}

	SendJSON(w, http.StatusCreated, resp)
}
