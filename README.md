# SunBunnies — Backend & ML

Финансовый трекер с тамагочи-питомцем и викториной по финансовой грамотности.
Серверная часть: event-sourced backend на Go + LLM-сервис на Python.

**Прод:** `https://codesforge.ru`

---

## Стек

### Backend (`backend/`, Go 1.26)

| Компонент | Технология |
|---|---|
| HTTP-роутер | `chi/v5` + CORS |
| БД | PostgreSQL 17, драйвер `pgx/v5` |
| SQL-доступ | `sqlc` (типобезопасная генерация из `db/queries/`) |
| Миграции | `goose` (`db/migrations/`) |
| События | Apache Kafka (`segmentio/kafka-go`), KRaft-режим |
| RPC к ML | gRPC (`google.golang.org/grpc`, контракт в `proto/`, генерация через `buf`) |
| ID | UUIDv7 (`google/uuid`) |
| Конфиг | `godotenv` + `caarlos0/env` |

### ML (`ml/`, Python 3.12, `uv`)

| Компонент | Технология |
|---|---|
| LLM-провайдер | GigaChat API (`gigachat` SDK) |
| RPC-сервер | `grpcio` (asyncio), порт `50051` |
| Схемы | `pydantic` + `pydantic-settings` |
| Промпты | XML-файлы (`src/prompts/`), парсинг через `xml_parser` |
| TLS к GigaChat | сертификат Минцифры (`src/cert.cer`) |

### Инфра

PostgreSQL 17, Kafka 3.9 (KRaft, 1 нода локально / 3 контроллера в k8s),
Docker Compose (локально), Kubernetes + Traefik + cert-manager (прод).

---

## Архитектура backend

DDD + Event Sourcing + CQRS. Запись и чтение разделены физически:

```
фронт ──HTTP──▶ API ──▶ events (таблица, источник правды)
                      └─▶ Kafka ──▶ projector ──▶ users / balances / pets / lessons / categories
```

`events` — append-only лог, read-таблицы — проекции. Пересоздание проекции =
реплей событий, данные не теряются.

### Слои (`backend/internal/`)

```
domain/
  entities/       агрегаты: User, Balance, Pet, Lesson, Category (+ AggregateRoot)
  value_objects/  Money (int64, копеек нет), Username, PetName, Hunger, Sleep,
                  CompletedLessonsCount, IDv7
  events/         доменные события: *.created + Envelope + сериализация
  errors/         доменные ошибки, по файлу на агрегат
repositories/     проекции в Postgres, перевод pg-кодов (23505/23503/23514)
                  в доменные ошибки
service/          команды: NewX → событие в events → Send в Kafka;
                  projector: Kafka → INSERT в проекции (идемпотентно)
handlers/         HTTP-адаптеры + mapServiceError (домен → HTTP-статусы)
middleware/       UserIDMiddleware (X-User-ID → context)
broker/           Kafka producer / consumer
config/           env-конфиг с дефолтами
cmd/api           HTTP-сервер :8080, graceful shutdown
cmd/projector     Kafka-консьюмер (группа projector)
```

### Конвенции

- Деньги — `int64` в целых единицах, `float` запрещён; `Money` иммутабелен.
- Агрегат не хранит чужие агрегаты — только `IDv7` ссылки.
- `total_spent` считается в конструкторе, а не принимается снаружи.
- Ошибки переводятся на границах: `pgerrcode` → домен → HTTP (`400/401/404/409/500`).
- Проектор идемпотентен: дубль события (at-least-once) → `return nil`, оффсет коммитится.
- Интерфейсы объявляет потребитель (`service`), реализует `repositories`/`ml`.

### API

Все тела — JSON. Ошибка: `{"error": "текст"}`. Защищённые роуты требуют
заголовок `X-User-ID: <UUID пользователя>`.

| Метод | Путь | Тело | Ответ |
|---|---|---|---|
| GET | `/healthz` | — | `{"status":"ok"}` |
| POST | `/user/create` | `{"username"}` (3–25, буквы+цифры) | `201` + user |
| POST | `/balance/create` | `mandatory/discretionary_expenses`, `dream_savings` | `201`, `total_spent` считается |
| POST | `/pet/create` | `{"name"}` (3–25, уникально глобально) | `201`, hunger/sleep = 90 |
| POST | `/lesson/create` | `{"completed_lessons_count"}` | `201` |
| POST | `/category/create` | `mandatory/optional_expenses`, `dream_savings` | `201`, `total_spent` считается |
| POST | `/quiz/generate` | `{"message"}` | `201` + `{"answer"}` (до ~30 сек) |

Один баланс / питомец / урок / категории на пользователя — повтор даёт `409`.

---

## Архитектура ML

Тонкий gRPC-адаптер над GigaChat, бизнес-логики нет — только промпты и схемы:

```
backend ──gRPC──▶ transport (quiz_servicer) ──▶ LLMService ──▶ provider ──▶ GigaChat API
                                                      │              ▲
                                                  prompts/*.xml   JsonSchema (ResponseModel)
```

```
ml/src/
  main.py → фактическая точка входа: src.grpc.server
  grpc/
    server.py         поднятие grpc.aio сервера на :50051
    quiz_handler.py   GenerateQuestion: конверт proto ⇄ LLMService
  services/
    llm_service.py    conversation_llm(prompt), quiz_llm() — выбор промпта и режима
  providers/
    generate_llm_completion.py  единый вызов client.achat + обработка ошибок
  depends/
    llm_client.py     сборка GigaChatAsyncClient из настроек
  models/
    response_model.py вопрос + варианты A/B/C + правильный ответ
    llm_completion.py конфиг генерации (temperature, reasoning_effort)
  config/
    llm_config.py     pydantic-settings (.env либо переменные окружения)
  gen/                сгенерированный protobuf-код (не править руками)
```

Контракт — `proto/quiz.proto` (`sunbunnies.quiz.v1`), генерация через `buf`
(`buf.gen.yaml` в корне). Python-код — в `ml/src/generated/`
(`grpc_tools.protoc`), Go-клиент — в `backend/internal/ml/gen/`.

---

## Локальный запуск

Требуется: Docker + Docker Compose, Go 1.26, `uv`, `goose`, `buf` (только для регенерации proto).

### 1. Переменные окружения

```bash
cp .env.example .env
# вставь свой GIGACHAT_KEY в .env
```

### 2. Поднять всё

```bash
docker compose up -d --build
```

Поднимается: `postgres:5432`, `kafka:9092`, `backend:8080`, `ml:50051`.

### 3. Накатить миграции (обязательно!)

Без этого все запросы вернут `500` — таблиц нет:

```bash
docker compose run --rm --entrypoint /app/goose backend \
  -dir /app/migrations \
  postgres "postgres://sunbunnies_app:dev_password@postgres:5432/sunbunnies_prod?sslmode=disable" up
```

Проверка:

```bash
docker exec sunbunnieshackathon2026project-postgres-1 \
  psql -U sunbunnies_app -d sunbunnies_prod -c "\dt"
```

Должны быть: `users`, `events`, `balances`, `pets`, `lessons`, `categories`, `goose_db_version`.

### 4. Проверка

```bash
curl http://localhost:8080/healthz

curl -X POST http://localhost:8080/user/create \
  -H "Content-Type: application/json" \
  -d '{"username":"LocalTest"}'
# скопируй id из ответа:
export USER_ID=<UUID>

curl -X POST http://localhost:8080/balance/create \
  -H "Content-Type: application/json" -H "X-User-ID: $USER_ID" \
  -d '{"mandatory_expenses":500,"discretionary_expenses":300,"dream_savings":1000}'
```

Проекции проверяются в БД (`SELECT * FROM balances;`) — их пишет projector,
а не API.

### 5. Запуск без Docker (по частям)

```bash
# только инфра:
docker compose up -d postgres kafka

# backend (из backend/, нужен backend/.env):
go run ./cmd/api
go run ./cmd/projector

# миграции локально:
goose -dir db/migrations postgres "postgres://...@localhost:5432/...?sslmode=disable" up

# ml (из ml/, нужен ml/.env с auth_key):
uv sync
uv run python -m src.grpc.server
```

### 6. Регенерация кода

```bash
cd backend && sqlc generate   # после правок db/queries/
buf generate                  # из корня, после правок proto/
```

---

## Прод (k3s)

```bash
helm upgrade --install postgres oci://registry-1.docker.io/bitnamicharts/postgresql \
  --set auth.username=... --set auth.password="$POSTGRES_PASSWORD" --set auth.database=...
helm upgrade --install kafka oci://registry-1.docker.io/bitnamicharts/kafka \
  --set image.repository=bitnamilegacy/kafka \
  --set listeners.client.protocol=PLAINTEXT
helm upgrade --install app ./k8s \
  --set secret.database.password="$POSTGRES_PASSWORD" \
  --set ml.secret.authKey="$GIGACHAT_KEY" \
  --wait --timeout 300s
```

Миграции накатывает Job-хук `app-sunbunnies-migrate` при установке.
TLS — Traefik + cert-manager (ClusterIssuer переключается `selfsigned`/`letsencrypt` в `values.yaml`).
