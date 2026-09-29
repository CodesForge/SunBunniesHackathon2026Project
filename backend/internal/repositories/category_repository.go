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

type CategoryRepository struct {
	q *db.Queries
}

func NewCategoryRepository(pool *pgxpool.Pool) *CategoryRepository {
	return &CategoryRepository{q: db.New(pool)}
}

func (r *CategoryRepository) CreateCategory(ctx context.Context, params db.CreateCategoryParams) (db.Category, error) {
	category, err := r.q.CreateCategory(ctx, params)
	if err != nil {
		var pgErr *pgconn.PgError
		if errors.As(err, &pgErr) {
			switch pgErr.Code {
			case pgerrcode.UniqueViolation:
				return db.Category{}, domain_errors.ErrCategoryAlreadyExists
			case pgerrcode.ForeignKeyViolation:
				return db.Category{}, domain_errors.ErrUserNotFound
			case pgerrcode.CheckViolation:
				return db.Category{}, domain_errors.ErrMoneyNegative
			}
		}
		return db.Category{}, fmt.Errorf("create category: %w", err)
	}
	return category, nil
}

func (r *CategoryRepository) GetCategoryByUserID(ctx context.Context, userID uuid.UUID) (db.Category, error) {
	category, err := r.q.GetCategoryByUserID(ctx, userID)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return db.Category{}, domain_errors.ErrCategoryNotFound
		}
		return db.Category{}, fmt.Errorf("get category by user_id: %w", err)
	}
	return category, nil
}
