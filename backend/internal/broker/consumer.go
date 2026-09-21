package broker

import (
	"context"
	"errors"
	"io"
	"log/slog"
	"time"

	"github.com/segmentio/kafka-go"
)

type Handler func(ctx context.Context, msg kafka.Message) error

type ConsumerConfig struct {
	Brokers     []string
	Topic       string
	GroupID     string
	MinBytes    int
	MaxBytes    int
	MaxWait     time.Duration
	StartOffset int64
}

type Consumer struct {
	logger *slog.Logger
	reader *kafka.Reader
}

func NewConsumer(cfg ConsumerConfig, logger *slog.Logger) *Consumer {
	if cfg.MinBytes <= 0 {
		cfg.MinBytes = 10e3
	}
	if cfg.MaxBytes <= 0 {
		cfg.MaxBytes = 10e6
	}
	if cfg.MaxWait <= 0 {
		cfg.MaxWait = 250 * time.Millisecond
	}

	reader := kafka.NewReader(kafka.ReaderConfig{
		Brokers:        cfg.Brokers,
		Topic:          cfg.Topic,
		GroupID:        cfg.GroupID,
		MinBytes:       cfg.MinBytes,
		MaxBytes:       cfg.MaxBytes,
		MaxWait:        cfg.MaxWait,
		CommitInterval: 0,
		StartOffset:    cfg.StartOffset,
	})

	return &Consumer{
		reader: reader, logger: logger,
	}
}

func (c *Consumer) Start(ctx context.Context, handler Handler) error {
	c.logger.Info("kafka consumer loop started")

	for {
		msg, err := c.reader.FetchMessage(ctx)
		if err != nil {
			if errors.Is(err, context.Canceled) || errors.Is(err, io.EOF) {
				c.logger.Info("kafka consumer stopped gracefully")
				return nil
			}

			c.logger.ErrorContext(ctx, "failed to fetch message from kafka", slog.String("error", err.Error()))

			select {
			case <-ctx.Done():
				return nil
			case <-time.After(500 * time.Millisecond):
				continue
			}
		}

		if err := handler(ctx, msg); err != nil {
			c.logger.ErrorContext(ctx, "failed to process message",
				slog.String("error", err.Error()),
				slog.String("key", string(msg.Key)),
				slog.Int64("offset", msg.Offset),
				slog.Int("partition", msg.Partition),
			)
			continue
		}

		if err := c.reader.CommitMessages(ctx, msg); err != nil {
			c.logger.ErrorContext(ctx, "failed to commit offset",
				slog.String("error", err.Error()),
				slog.Int64("offset", msg.Offset),
			)
		}
	}
}

func (c *Consumer) Close() error {
	return c.reader.Close()
}
