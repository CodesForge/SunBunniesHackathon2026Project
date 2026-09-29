
-- name: CreateCategory :one
INSERT INTO categories (
    id,
    user_id,
    total_spent,
    mandatory_expenses,
    optional_expenses,
    dream_savings
) VALUES (
    $1, $2, $3, $4, $5, $6
) RETURNING *;

-- name: GetCategoryByUserID :one
SELECT * FROM categories WHERE user_id = $1;