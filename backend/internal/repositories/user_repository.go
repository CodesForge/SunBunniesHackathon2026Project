package repositories

import (
	"context"
	"errors"
	"fmt"

	db "github.com/CodesForge/SunBunniesHackathon2026Project/internal/database/generated"
	domain_errors "github.com/CodesForge/SunBunniesHackathon2026Project/internal/domain/errors"
	"github.com/jackc/pgerrcode"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/jackc/pgx/v5/pgxpool"
)

type UserRepository struct {
	q *db.Queries
}

func NewUserRepository(pool *pgxpool.Pool) *UserRepository {
	return &UserRepository{q: db.New(pool)}
}

func (r *UserRepository) CreateUser(ctx context.Context, params db.CreateUserParams) (db.User, error) {
	user, err := r.q.CreateUser(ctx, params)
	if err != nil {
		var pgErr *pgconn.PgError
		if errors.As(err, &pgErr) && pgErr.Code == pgerrcode.UniqueViolation {
			return db.User{}, domain_errors.ErrUsernameAlreadyExists
		}
		return db.User{}, fmt.Errorf("create user: %w", err)
	}

	return user, nil
}

func (r *UserRepository) GetUserByUsername(ctx context.Context, username string) (db.User, error) {
	user, err := r.q.GetUserByUsername(ctx, username)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return db.User{}, domain_errors.ErrUserNotFound
		}
		return db.User{}, fmt.Errorf("get user by username: %w", err)
	}
	return user, nil
}
