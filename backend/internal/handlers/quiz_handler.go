package handlers

import (
	"context"
	"encoding/json"
	"net/http"

	"github.com/CodesForge/SunBunniesHackathon2026Project/internal/service/dto"
)

type QuizService interface {
	GenerateQuestion(ctx context.Context, input dto.GenerateQuestionRequestDTO) (dto.GenerateQuestionResponseDTO, error)
}

type QuizHandler struct {
	svc QuizService
}

func NewQuizHandler(svc QuizService) *QuizHandler {
	return &QuizHandler{svc: svc}
}

func (h *QuizHandler) GenerateQuestion(w http.ResponseWriter, r *http.Request) {
	var req dto.GenerateQuestionRequestDTO
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		SendError(w, http.StatusBadRequest, err.Error())
		return
	}

	resp, err := h.svc.GenerateQuestion(r.Context(), req)
	if err != nil {
		SendError(w, http.StatusInternalServerError, "internal server error")
		return
	}
	
	SendJSON(w, http.StatusCreated, resp)
}