package handlers

import (
	"encoding/json"
	"net/http"
)

func SendJSON(w http.ResponseWriter, code int, data any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	_ = json.NewEncoder(w).Encode(data)
}

func SendError(w http.ResponseWriter, code int, error string) {
	SendJSON(w, code, map[string]string{"error": error})
}
