-- +goose Up
CREATE TABLE IF NOT EXISTS balances (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    mandatory_expenses BIGINT NOT NULL DEFAULT 0,
    discretionary_expenses BIGINT NOT NULL DEFAULT 0,
    dream_savings BIGINT NOT NULL DEFAULT 0,
    total_spent BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_balances_mandatory_expenses CHECK (mandatory_expenses >= 0),
    CONSTRAINT chk_balances_discretionary_expenses CHECK (discretionary_expenses >= 0),
    CONSTRAINT chk_balances_dream_savings CHECK (dream_savings >= 0),
    CONSTRAINT chk_balances_total_spent CHECK (total_spent >= 0)
);

-- +goose Down
DROP TABLE IF EXISTS balances;