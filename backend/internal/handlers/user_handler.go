package handlers

import (
	"context"
	"encoding/json"
	"net/http"

	"github.com/CodesForge/SunBunniesHackathon2026Project/internal/service/dto"
)

type UserService interface {
	CreateUser(ctx context.Context, input dto.CreateUserRequestDTO) (dto.CreateUserResponseDTO, error)
}

type UserHandler struct {
	svc UserService
}

func NewUserHandler(svc UserService) *UserHandler {
	return &UserHandler{svc: svc}
}

func (h *UserHandler) CreateUser(w http.ResponseWriter, r *http.Request) {
	var req dto.CreateUserRequestDTO
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		SendError(w, http.StatusBadRequest, err.Error())
		return
	}

	resp, err := h.svc.CreateUser(r.Context(), req)
	if err != nil {
		code, msg := mapServiceError(err)
		SendError(w, code, msg)
		return
	}

	SendJSON(w, http.StatusCreated, resp)
}
