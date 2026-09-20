package broker

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"github.com/segmentio/kafka-go"
)

type ProducerOptions struct {
	Brokers      []string
	Topic        string
	BatchTimeout time.Duration
	WriteTimeout time.Duration
}

type Producer struct {
	writer *kafka.Writer
}

func NewProducer(options ProducerOptions) *Producer {
	if options.BatchTimeout <= 0 {
		options.BatchTimeout = 10 * time.Millisecond
	}

	if options.WriteTimeout <= 0 {
		options.WriteTimeout = 3 * time.Second
	}

	return &Producer{
		writer: &kafka.Writer{
			Addr:                   kafka.TCP(options.Brokers...),
			Topic:                  options.Topic,
			Balancer:               &kafka.Hash{},
			BatchTimeout:           options.BatchTimeout,
			WriteTimeout:           options.WriteTimeout,
			AllowAutoTopicCreation: true,
			RequiredAcks:           kafka.RequireOne,
		},
	}
}

func (p *Producer) Send(ctx context.Context, key string, payload any) error {
	body, err := json.Marshal(payload)
	if err != nil {
		return fmt.Errorf("failed to marshal payload: %w", err)
	}

	if err := p.writer.WriteMessages(ctx, kafka.Message{
		Key:   []byte(key),
		Value: body,
		Time:  time.Now(),
	}); err != nil {
		return fmt.Errorf("failed to write message to kafka: %w", err)
	}

	return nil
}

func (p *Producer) Close() error {
	return p.writer.Close()
}
