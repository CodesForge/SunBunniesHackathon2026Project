package main

import (
	"context"
	"fmt"
	"log/slog"
	"os"
	"os/signal"
	"syscall"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/segmentio/kafka-go"

	"github.com/CodesForge/SunBunniesHackathon2026Project/internal/broker"
	"github.com/CodesForge/SunBunniesHackathon2026Project/internal/config"
	"github.com/CodesForge/SunBunniesHackathon2026Project/internal/repositories"
	"github.com/CodesForge/SunBunniesHackathon2026Project/internal/service"
)

func main() {
	cfg := config.MustLoad()
	logger := slog.New(slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{Level: slog.LevelInfo}))
	slog.SetDefault(logger)

	if err := run(cfg, logger); err != nil {
		logger.Error("projector stopped with error", slog.String("error", err.Error()))
		os.Exit(1)
	}
}

func run(cfg *config.Config, logger *slog.Logger) error {
	ctx, stop := signal.NotifyContext(context.Background(), syscall.SIGINT, syscall.SIGTERM)
	defer stop()

	pool, err := pgxpool.New(ctx, cfg.PostgresConfig.DSN())
	if err != nil {
		return fmt.Errorf("create postgres pool: %w", err)
	}
	defer pool.Close()

	if err := pool.Ping(ctx); err != nil {
		return fmt.Errorf("ping postgres: %w", err)
	}

	consumer := broker.NewConsumer(broker.ConsumerConfig{
		Brokers:     cfg.KafkaConsumerConfig.Brokers,
		Topic:       cfg.KafkaConsumerConfig.Topic,
		GroupID:     cfg.KafkaConsumerConfig.GroupID,
		MinBytes:    cfg.KafkaConsumerConfig.MinBytes,
		MaxBytes:    cfg.KafkaConsumerConfig.MaxBytes,
		MaxWait:     cfg.KafkaConsumerConfig.MaxWait,
		StartOffset: startOffset(cfg.KafkaConsumerConfig.StartOffset),
	}, logger)
	defer func() {
		if err := consumer.Close(); err != nil {
			logger.Error("close kafka consumer", slog.String("error", err.Error()))
		}
	}()

	userRepo := repositories.NewUserRepository(pool)
	balanceRepo := repositories.NewBalanceRepository(pool)
	petRepo := repositories.NewPetRepository(pool)
	lessonRepo := repositories.NewLessonRepository(pool)

	projector := service.NewProjectorService(lessonRepo, petRepo, userRepo, balanceRepo, logger)

	if err := consumer.Start(ctx, projector.Handle); err != nil {
		return fmt.Errorf("consumer loop: %w", err)
	}

	logger.Info("projector stopped gracefully")
	return nil
}

func startOffset(s string) int64 {
	if s == "last" {
		return kafka.LastOffset
	}
	return kafka.FirstOffset
}
