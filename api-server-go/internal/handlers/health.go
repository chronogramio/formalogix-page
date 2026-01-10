package handlers

import (
	"encoding/json"
	"net/http"

	"api-server-go/internal/models"
)

// HealthHandler handles health check requests
type HealthHandler struct{}

// NewHealthHandler creates a new health handler
func NewHealthHandler() *HealthHandler {
	return &HealthHandler{}
}

// Handle processes health check requests
func (h *HealthHandler) Handle(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	response := models.HealthResponse{
		Status:  "ok",
		Message: "Formalogix API Server is running",
	}

	json.NewEncoder(w).Encode(response)
}
