-- +goose Up
CREATE TABLE IF NOT EXISTS pets (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(64) NOT NULL,
    hunger_points SMALLINT NOT NULL DEFAULT 100,
    CONSTRAINT chk_pets_hunger CHECK (hunger_points BETWEEN 0 AND 100),
    sleep_points SMALLINT NOT NULL DEFAULT 100,
    CONSTRAINT chk_pets_sleep CHECK (sleep_points BETWEEN 0 AND 100),
    mandatory_expenses BIGINT NOT NULL DEFAULT 0,
    CONSTRAINT chk_pets_mandatory_expenses CHECK (mandatory_expenses >= 0),
    optional_expenses BIGINT NOT NULL DEFAULT 0,
    CONSTRAINT chk_pets_optional_expenses CHECK (optional_expenses >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pets_user_id ON pets(user_id);

-- +goose Down
DROP TABLE IF EXISTS pets;
