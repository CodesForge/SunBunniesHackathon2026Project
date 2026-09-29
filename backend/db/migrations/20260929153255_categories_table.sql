-- +goose Up
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    total_spent BIGINT NOT NULL DEFAULT 0,
    mandatory_expenses BIGINT NOT NULL DEFAULT 0,
    optional_expenses BIGINT NOT NULL DEFAULT 0,
    dream_savings BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- +goose Down
DROP TABLE IF EXISTS categories;