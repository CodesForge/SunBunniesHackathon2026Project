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

type PetRepository struct {
	q *db.Queries
}

func NewPetRepository(pool *pgxpool.Pool) *PetRepository {
	return &PetRepository{q: db.New(pool)}
}

func (r *PetRepository) CreatePet(ctx context.Context, params db.CreatePetParams) (db.Pet, error) {
	pet, err := r.q.CreatePet(ctx, params)
	if err != nil {
		var pgErr *pgconn.PgError
		if errors.As(err, &pgErr) && pgErr.Code == pgerrcode.UniqueViolation {
			switch pgErr.ConstraintName {
			case "pets_name_key":
				return db.Pet{}, domain_errors.ErrPetNameTaken
			default:
				return db.Pet{}, domain_errors.ErrPetAlreadyExists
			}
		}
		if errors.As(err, &pgErr) && pgErr.Code == pgerrcode.ForeignKeyViolation {
			return db.Pet{}, domain_errors.ErrUserNotFound
		}
		return db.Pet{}, fmt.Errorf("create pet: %w", err)
	}
	return pet, nil
}

func (r *PetRepository) GetPetByUserID(ctx context.Context, userID uuid.UUID) (db.Pet, error) {
	pet, err := r.q.GetPetByUserID(ctx, userID)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return db.Pet{}, domain_errors.ErrPetNotFound
		}
		return db.Pet{}, fmt.Errorf("get pet by user_id: %w", err)
	}
	return pet, nil
}
