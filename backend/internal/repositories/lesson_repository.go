package repositories

import (
	"context"
	"errors"
	"fmt"

	db "github.com/CodesForge/SunBunniesHackathon2026Project/internal/database/generated"
	domain_errors "github.com/CodesForge/SunBunniesHackathon2026Project/internal/domain/errors"
	"github.com/google/uuid"
	"github.com/jackc/pgerrcode"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/jackc/pgx/v5/pgxpool"
)

type LessonRepository struct {
	q *db.Queries
}

func NewLessonRepository(pool *pgxpool.Pool) *LessonRepository {
	return &LessonRepository{q: db.New(pool)}
}

func (r *LessonRepository) CreateLesson(ctx context.Context, params db.CreateLessonParams) (db.Lesson, error) {
	lesson, err := r.q.CreateLesson(ctx, params)
	if err != nil {
		var pgErr *pgconn.PgError
		if errors.As(err, &pgErr) && pgErr.Code == pgerrcode.UniqueViolation {
			return db.Lesson{}, domain_errors.ErrLessonAlreadyExists
		}
		if errors.As(err, &pgErr) && pgErr.Code == pgerrcode.ForeignKeyViolation {
			return db.Lesson{}, domain_errors.ErrUserNotFound
		}
		return db.Lesson{}, fmt.Errorf("create lesson: %w", err)
	}
	return lesson, nil
}

func (r *LessonRepository) GetLessonByUserID(ctx context.Context, userID uuid.UUID) (db.Lesson, error) {
	lesson, err := r.q.GetLessonByUserID(ctx, userID)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return db.Lesson{}, domain_errors.ErrLessonNotFound
		}
		return db.Lesson{}, fmt.Errorf("get lesson by user_id: %w", err)
	}
	return lesson, nil
}
