package config

import (
	"errors"
	"fmt"
	"os"
	"time"

	"github.com/caarlos0/env/v11"
	"github.com/joho/godotenv"
)

type Config struct {
	AppConfig
	KafkaProducerConfig
	KafkaConsumerConfig
	PostgresConfig
}

type AppConfig struct {
	AppEnv   string `env:"APP_ENV" envDefault:"development"`
	HTTPPort string `env:"HTTP_PORT" envDefault:"8080"`
}

type PostgresConfig struct {
	User     string `env:"POSTGRES_USER,required"`
	Password string `env:"POSTGRES_PASSWORD,required"`
	Host     string `env:"POSTGRES_HOST" envDefault:"localhost"`
	Port     string `env:"POSTGRES_PORT" envDefault:"5432"`
	DBName   string `env:"POSTGRES_DB,required"`
	SSLMode  string `env:"POSTGRES_SSL_MODE" envDefault:"disable"`
}

type KafkaProducerConfig struct {
	Brokers      []string      `env:"KAFKA_BROKERS" envSeparator:"," envDefault:"localhost:9092"`
	Topic        string        `env:"KAFKA_TOPIC" envDefault:"user-events"`
	WriteTimeout time.Duration `env:"KAFKA_WRITE_TIMEOUT" envDefault:"3s"`
	BatchTimeout time.Duration `env:"KAFKA_BATCH_TIMEOUT" envDefault:"10ms"`
	MaxAttempts  int           `env:"KAFKA_MAX_ATTEMPTS" envDefault:"3"`
	Async        bool          `env:"KAFKA_ASYNC" envDefault:"false"`
}

type KafkaConsumerConfig struct {
	Brokers        []string      `env:"KAFKA_BROKERS" envSeparator:"," envDefault:"localhost:9092"`
	Topic          string        `env:"KAFKA_TOPIC" envDefault:"user-events"`
	GroupID        string        `env:"KAFKA_CONSUMER_GROUP_ID,required"`
	MinBytes       int           `env:"KAFKA_CONSUMER_MIN_BYTES" envDefault:"10240"`    // 10 KB
	MaxBytes       int           `env:"KAFKA_CONSUMER_MAX_BYTES" envDefault:"10485760"` // 10 MB
	MaxWait        time.Duration `env:"KAFKA_CONSUMER_MAX_WAIT" envDefault:"250ms"`     // макс. время ожидания наполнения MinBytes
	CommitInterval time.Duration `env:"KAFKA_CONSUMER_COMMIT_INTERVAL" envDefault:"1s"` // периодичность автокоммита оффсетов
	StartOffset    string        `env:"KAFKA_CONSUMER_START_OFFSET" envDefault:"first"` // "first" (earliest) или "last" (latest)
}

func (p PostgresConfig) DSN() string {
	return fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=%s",
		p.User, p.Password, p.Host, p.Port, p.DBName, p.SSLMode,
	)
}

func MustLoad() *Config {
	cfg, err := Load()
	if err != nil {
		panic(fmt.Sprintf("critical config error: %v", err))
	}
	return cfg
}

func Load() (*Config, error) {
	if err := godotenv.Load(); err != nil && !errors.Is(err, os.ErrNotExist) {
		return nil, fmt.Errorf("read .env file: %w", err)
	}

	cfg := &Config{}

	if err := env.Parse(cfg); err != nil {
		return nil, fmt.Errorf("parse env: %w", err)
	}

	return cfg, nil
}
