
-- name: CreatePet :one
INSERT INTO pets (
    id,
    user_id,
    name,
    hunger_points,
    sleep_points,
    mandatory_expenses,
    optional_expenses
) VALUES (
    $1, $2, $3, $4, $5, $6, $7
) RETURNING *;

-- name: GetPetByUserID :one
SELECT * FROM pets WHERE user_id = $1;