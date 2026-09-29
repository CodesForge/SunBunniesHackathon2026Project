package main

import (
	"context"
	"errors"
	"fmt"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	middleware2 "github.com/CodesForge/SunBunniesHackathon2026Project/internal/middleware"
	grpc_handler "github.com/CodesForge/SunBunniesHackathon2026Project/internal/service/grpc"
	quiz_v1 "github.com/CodesForge/SunBunniesHackathon2026Project/pkg/quiz/v1"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/jackc/pgx/v5/pgxpool"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"

	"github.com/CodesForge/SunBunniesHackathon2026Project/internal/broker"
	"github.com/CodesForge/SunBunniesHackathon2026Project/internal/config"
	"github.com/CodesForge/SunBunniesHackathon2026Project/internal/handlers"
	"github.com/CodesForge/SunBunniesHackathon2026Project/internal/repositories"
	"github.com/CodesForge/SunBunniesHackathon2026Project/internal/service"
)

const (
	RouteUser     = "/user"
	RouteBalance  = "/balance"
	RoutePet      = "/pet"
	RouteLesson   = "/lesson"
	RouteQuiz     = "/quiz"
	RouteCategory = "/category"
)

func main() {
	cfg := config.MustLoad()
	logger := slog.New(slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{Level: slog.LevelInfo}))
	slog.SetDefault(logger)

	if err := run(cfg, logger); err != nil {
		logger.Error("api stopped with error", slog.String("error", err.Error()))
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

	producer := broker.NewProducer(broker.ProducerOptions{
		Brokers:      cfg.KafkaProducerConfig.Brokers,
		Topic:        cfg.KafkaProducerConfig.Topic,
		BatchTimeout: cfg.KafkaProducerConfig.BatchTimeout,
		WriteTimeout: cfg.KafkaProducerConfig.WriteTimeout,
	})
	defer func() {
		if err := producer.Close(); err != nil {
			logger.Error("close kafka producer", slog.String("error", err.Error()))
		}
	}()

	conn, err := grpc.NewClient(cfg.TargetAddr, grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		logger.Error("failed to create grpc connection to ml service", slog.Any("error", err))
		os.Exit(1)
	}
	defer func() {
		if closeErr := conn.Close(); closeErr != nil {
			logger.Error("failed to close grpc connection", slog.Any("error", closeErr))
		}
	}()

	quizGrpcClient := quiz_v1.NewQuizServiceClient(conn)

	userRepo := repositories.NewUserRepository(pool)
	eventRepo := repositories.NewEventRepository(pool)
	balanceRepo := repositories.NewBalanceRepository(pool)
	petRepo := repositories.NewPetRepository(pool)
	lessonRepo := repositories.NewLessonRepository(pool)
	categoryRepo := repositories.NewCategoryRepository(pool)

	userSvc := service.NewUserService(userRepo, eventRepo, producer, logger)
	balanceSvc := service.NewBalanceService(eventRepo, balanceRepo, producer, logger)
	petSvc := service.NewPetService(eventRepo, petRepo, producer, logger)
	lessonSvc := service.NewLessonService(eventRepo, lessonRepo, producer, logger)
	quizSvc := grpc_handler.NewQuizService(quizGrpcClient, logger, cfg.Timeout)
	categorySvc := service.NewCategoryService(eventRepo, categoryRepo, producer, logger)

	userHandler := handlers.NewUserHandler(userSvc)
	balanceHandler := handlers.NewBalanceHandler(balanceSvc)
	petHandler := handlers.NewPetHandler(petSvc)
	lessonHandler := handlers.NewLessonHandler(lessonSvc)
	quizHandler := handlers.NewQuizHandler(quizSvc)
	categoryHandler := handlers.NewCategoryHandler(categorySvc)

	r := chi.NewRouter()

	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Content-Type", "X-User-ID"},
		AllowCredentials: false,
		MaxAge:           300,
	}))

	r.Use(middleware.RequestID, middleware.RealIP, middleware.Logger, middleware.Recoverer)
	r.Use(middleware.Timeout(30 * time.Second))

	r.Get("/healthz", func(w http.ResponseWriter, _ *http.Request) {
		handlers.SendJSON(w, http.StatusOK, map[string]string{"status": "ok"})
	})
	r.Route(RouteUser, func(r chi.Router) {
		r.Post("/create", userHandler.CreateUser)
	})
	r.Route(RouteBalance, func(r chi.Router) {
		r.Use(middleware2.UserIDMiddleware)
		r.Post("/create", balanceHandler.CreateBalance)
	})
	r.Route(RoutePet, func(r chi.Router) {
		r.Use(middleware2.UserIDMiddleware)
		r.Post("/create", petHandler.CreatePet)
	})
	r.Route(RouteLesson, func(r chi.Router) {
		r.Use(middleware2.UserIDMiddleware)
		r.Post("/create", lessonHandler.CreateLesson)
	})
	r.Route(RouteQuiz, func(r chi.Router) {
		r.Post("/generate", quizHandler.GenerateQuestion)
	})
	r.Route(RouteCategory, func(r chi.Router) {
		r.Use(middleware2.UserIDMiddleware)
		r.Post("/create", categoryHandler.CreateCategory)
	})

	srv := &http.Server{
		Addr:              ":" + cfg.HTTPPort,
		Handler:           r,
		ReadHeaderTimeout: 5 * time.Second,
		ReadTimeout:       15 * time.Second,
		WriteTimeout:      15 * time.Second,
		IdleTimeout:       60 * time.Second,
	}

	errCh := make(chan error, 1)
	go func() {
		logger.Info("http server started", slog.String("addr", srv.Addr))
		if err := srv.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			errCh <- err
		}
	}()

	select {
	case err := <-errCh:
		return fmt.Errorf("http server: %w", err)
	case <-ctx.Done():
		logger.Info("shutdown signal received")
	}

	shutdownCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := srv.Shutdown(shutdownCtx); err != nil {
		return fmt.Errorf("shutdown http server: %w", err)
	}

	logger.Info("api stopped gracefully")
	return nil
}
