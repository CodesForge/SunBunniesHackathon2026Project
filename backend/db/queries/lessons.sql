
-- name: CreateLesson :one
INSERT INTO lessons (
    id,
    user_id,
    completed_lessons_count
) VALUES (
    $1, $2, $3
) RETURNING *;

-- name: GetLessonByUserID :one
SELECT * FROM lessons WHERE user_id = $1;