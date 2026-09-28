package handlers

import (
	"context"
	"encoding/json"
	"net/http"

	"github.com/CodesForge/SunBunniesHackathon2026Project/internal/middleware"
	"github.com/CodesForge/SunBunniesHackathon2026Project/internal/service/dto"
	"github.com/google/uuid"
)

type PetService interface {
	CreatePet(ctx context.Context, input dto.CreatePetRequestDTO, userID uuid.UUID) (dto.CreatePetResponseDTO, error)
}

type PetHandler struct {
	svc PetService
}

func NewPetHandler(svc PetService) *PetHandler {
	return &PetHandler{svc: svc}
}

func (h *PetHandler) CreatePet(w http.ResponseWriter, r *http.Request) {
	userID, ok := middleware.UserIDFromContext(r.Context())
	if !ok {
		SendError(w, http.StatusUnauthorized, "unauthorized")
		return
	}

	var req dto.CreatePetRequestDTO
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		SendError(w, http.StatusBadRequest, err.Error())
		return
	}
	
	resp, err := h.svc.CreatePet(r.Context(), req, userID)
	if err != nil {
		code, msg := mapServiceError(err)
		SendError(w, code, msg)
		return
	}

	SendJSON(w, http.StatusCreated, resp)
}
