package middleware

import (
	"context"
	"encoding/json"
	"net/http"

	"github.com/google/uuid"
)

const UserIDHeader = "X-User-ID"

type ctxKeyUserID struct{}

var userIDKey = ctxKeyUserID{}

func UserIDMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		raw := r.Header.Get(UserIDHeader)

		userID, err := uuid.Parse(raw)
		if err != nil {
			writeError(w, http.StatusUnauthorized, "missing or invalid X-User-ID header")
			return
		}

		ctx := WithUserID(r.Context(), userID)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func UserIDFromContext(ctx context.Context) (uuid.UUID, bool) {
	userID, ok := ctx.Value(userIDKey).(uuid.UUID)
	return userID, ok
}

func WithUserID(ctx context.Context, userID uuid.UUID) context.Context {
	return context.WithValue(ctx, userIDKey, userID)
}

func writeError(w http.ResponseWriter, code int, msg string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	_ = json.NewEncoder(w).Encode(map[string]string{"error": msg})
}
