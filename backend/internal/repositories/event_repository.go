package repositories

import (
	"context"
	"errors"
	"fmt"

	db "github.com/CodesForge/SunBunniesHackathon2026Project/internal/database/generated"
	domain_errors "github.com/CodesForge/SunBunniesHackathon2026Project/internal/domain/errors"
	"github.com/jackc/pgerrcode"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/jackc/pgx/v5/pgxpool"
)

type EventRepository struct {
	q *db.Queries
}

func NewEventRepository(pool *pgxpool.Pool) *EventRepository {
	return &EventRepository{q: db.New(pool)}
}

func (r *EventRepository) CreateEvent(ctx context.Context, params db.CreateEventParams) error {
	if err := r.q.CreateEvent(ctx, params); err != nil {
		var pgErr *pgconn.PgError
		if errors.As(err, &pgErr) && pgErr.Code == pgerrcode.UniqueViolation {
			if pgErr.ConstraintName == "uq_aggregate_version" {
				return domain_errors.ErrEventAlreadyExists
			}
			return domain_errors.ErrEventAlreadyExists
		}

		return fmt.Errorf("create event: %w", err)
	}
	return nil
}
