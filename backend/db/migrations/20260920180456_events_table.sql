-- +goose Up
CREATE TABLE events (
    global_offset BIGSERIAL PRIMARY KEY,
    aggregate_id VARCHAR(64) NOT NULL,
    aggregate_type VARCHAR(64) NOT NULL,
    version BIGINT NOT NULL,
    event_type VARCHAR(128) NOT NULL,
    payload JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,

    CONSTRAINT uq_aggregate_version UNIQUE (aggregate_type, aggregate_id, version)
);

CREATE INDEX idx_events_aggregate ON events (aggregate_type, aggregate_id, version ASC);

CREATE INDEX idx_events_payload ON events USING GIN (payload);

-- +goose Down
DROP TABLE events;