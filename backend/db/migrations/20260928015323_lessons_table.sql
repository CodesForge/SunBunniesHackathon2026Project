-- +goose Up
CREATE TABLE IF NOT EXISTS lessons (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    completed_lessons_count INTEGER NOT NULL DEFAULT 0
    CONSTRAINT chk_completed_lessons_count CHECK (completed_lessons_count >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lessons_user_id ON lessons(user_id);

-- +goose Down
DROP TABLE IF EXISTS lessons;
