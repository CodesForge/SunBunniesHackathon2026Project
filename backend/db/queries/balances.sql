
-- name: CreateBalance :one
INSERT INTO balances (
    id,
    user_id,
    mandatory_expenses,
    discretionary_expenses,
    dream_savings,
    total_spent
) VALUES (
    $1, $2, $3, $4, $5, $6
) RETURNING *;

-- name: GetBalanceByUserID :one
SELECT * FROM balances WHERE user_id = $1;