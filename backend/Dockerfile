FROM golang:1.26-alpine AS build

WORKDIR /src

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=0 go build -o /bin/api ./cmd/api \
 && CGO_ENABLED=0 go build -o /bin/projector ./cmd/projector \
 && go install github.com/pressly/goose/v3/cmd/goose@latest \
 && cp /go/bin/goose /bin/goose

FROM alpine:3.21

RUN apk add --no-cache tzdata ca-certificates

WORKDIR /app

COPY --from=build /bin/api /app/api
COPY --from=build /bin/projector /app/projector
COPY --from=build /bin/goose /app/goose
COPY --from=build /src/db/migrations /app/migrations

ENTRYPOINT ["/app/api"]