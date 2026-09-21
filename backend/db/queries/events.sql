
-- name: CreateEvent :exec
INSERT INTO events (
    aggregate_id,
    aggregate_type,
    version,
    event_type,
    payload
) VALUES (
    $1, $2, $3, $4, $5
);