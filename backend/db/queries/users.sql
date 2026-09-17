
-- name: CreateUser :one
INSERT INTO users (id, username) VALUES ($1, $2) RETURNING *;