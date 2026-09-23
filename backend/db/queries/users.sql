
-- name: CreateUser :one
INSERT INTO users (id, username) VALUES ($1, $2) RETURNING *;

-- name: GetUserByUsername :one
SELECT * FROM users WHERE username = $1;