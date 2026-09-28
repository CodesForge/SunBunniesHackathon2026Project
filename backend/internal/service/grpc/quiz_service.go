package grpc_handler

import (
	"context"
	"fmt"
	"log/slog"
	"time"

	"github.com/CodesForge/SunBunniesHackathon2026Project/internal/service/dto"
	quiz_v1 "github.com/CodesForge/SunBunniesHackathon2026Project/pkg/quiz/v1"
)

type QuizService struct {
	client  quiz_v1.QuizServiceClient
	logger  *slog.Logger
	timeout time.Duration
}

func NewQuizService(client quiz_v1.QuizServiceClient, logger *slog.Logger, timeout time.Duration) *QuizService {
	if timeout <= 0 {
		timeout = 5 * time.Second
	}

	return &QuizService{
		client:  client,
		logger:  logger,
		timeout: timeout,
	}
}

func (s *QuizService) GenerateQuestion(ctx context.Context, input dto.GenerateQuestionRequestDTO) (dto.GenerateQuestionResponseDTO, error) {
	ctx, cancel := context.WithTimeout(ctx, s.timeout)
	defer cancel()

	res, err := s.client.GenerateQuestion(ctx, &quiz_v1.GenerateQuestionRequest{
		Message: input.Message,
	})
	if err != nil {
		s.logger.ErrorContext(ctx, "failed to call ml grpc service",
			slog.String("op", "QuizService.GenerateQuestion"),
			slog.String("error", err.Error()),
		)
		return dto.GenerateQuestionResponseDTO{}, fmt.Errorf("generate question grpc call: %w", err)
	}

	return dto.GenerateQuestionResponseDTO{
		Answer: res.Answer,
	}, nil
}
