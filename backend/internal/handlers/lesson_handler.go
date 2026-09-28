package handlers

import (
	"context"
	"encoding/json"
	"net/http"

	appmw "github.com/CodesForge/SunBunniesHackathon2026Project/internal/middleware"
	"github.com/CodesForge/SunBunniesHackathon2026Project/internal/service/dto"
	"github.com/google/uuid"
)

type LessonService interface {
	CreateLesson(
		ctx context.Context,
		input dto.CreateLessonRequestDTO,
		userID uuid.UUID,
	) (dto.CreateLessonResponseDTO, error)
}

type LessonHandler struct {
	svc LessonService
}

func NewLessonHandler(svc LessonService) *LessonHandler {
	return &LessonHandler{svc: svc}
}

func (h *LessonHandler) CreateLesson(w http.ResponseWriter, r *http.Request) {
	userID, ok := appmw.UserIDFromContext(r.Context())
	if !ok {
		SendError(w, http.StatusInternalServerError, "lesson id missing in request context")
		return
	}

	var req dto.CreateLessonRequestDTO
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		SendError(w, http.StatusBadRequest, err.Error())
		return
	}

	resp, err := h.svc.CreateLesson(r.Context(), req, userID)
	if err != nil {
		code, msg := mapServiceError(err)
		SendError(w, code, msg)
		return
	}

	SendJSON(w, http.StatusCreated, resp)
}
