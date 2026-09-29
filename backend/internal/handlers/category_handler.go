package handlers

import (
	"context"
	"encoding/json"
	"net/http"

	appmw "github.com/CodesForge/SunBunniesHackathon2026Project/internal/middleware"
	"github.com/CodesForge/SunBunniesHackathon2026Project/internal/service/dto"
	"github.com/google/uuid"
)

type CategoryService interface {
	CreateCategory(ctx context.Context, input dto.CreateCategoryRequestDTO, userID uuid.UUID) (dto.CreateCategoryResponseDTO, error)
}

type CategoryHandler struct {
	svc CategoryService
}

func NewCategoryHandler(svc CategoryService) *CategoryHandler {
	return &CategoryHandler{svc: svc}
}

func (h *CategoryHandler) CreateCategory(w http.ResponseWriter, r *http.Request) {
	userID, ok := appmw.UserIDFromContext(r.Context())
	if !ok {
		SendError(w, http.StatusUnauthorized, "unauthorized")
		return
	}

	var req dto.CreateCategoryRequestDTO
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		SendError(w, http.StatusBadRequest, err.Error())
		return
	}

	resp, err := h.svc.CreateCategory(r.Context(), req, userID)
	if err != nil {
		code, msg := mapServiceError(err)
		SendError(w, code, msg)
		return
	}

	SendJSON(w, http.StatusCreated, resp)
}
