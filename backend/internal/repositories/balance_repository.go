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

type BalanceRepository struct {
	q *db.Queries
}

func NewBalanceRepository(pool *pgxpool.Pool) *BalanceRepository {
	return &BalanceRepository{q: db.New(pool)}
}

func (r *BalanceRepository) CreateBalance(ctx context.Context, params db.CreateBalanceParams) (db.Balance, error) {
	balance, err := r.q.CreateBalance(ctx, params)
	if err != nil {
		var pgErr *pgconn.PgError
		if errors.As(err, &pgErr) {
			switch pgErr.Code {
			case pgerrcode.UniqueViolation:
				return db.Balance{}, domain_errors.ErrBalanceAlreadyExists
			case pgerrcode.ForeignKeyViolation:
				return db.Balance{}, domain_errors.ErrBalanceNotFound
			}
		}
		return db.Balance{}, fmt.Errorf("create balance: %w", err)
	}
	return balance, nil
}

func (r *BalanceRepository) GetBalanceByUserID(ctx context.Context, userID uuid.UUID) (db.Balance, error) {
	balance, err := r.q.GetBalanceByUserID(ctx, userID)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return db.Balance{}, domain_errors.ErrBalanceNotFound
		}
		return db.Balance{}, fmt.Errorf("get balance by user_id: %w", err)
	}
	return balance, nil
}
