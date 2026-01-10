package middleware

import (
	"net/http"
	"strings"

	"api-server-go/internal/config"
)

// CORS creates a middleware that handles Cross-Origin Resource Sharing
func CORS(cfg *config.Config) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			origin := r.Header.Get("Origin")

			if isAllowedOrigin(origin, cfg.AllowedOrigins) {
				w.Header().Set("Access-Control-Allow-Origin", origin)
				w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
				w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
			}

			// Handle preflight requests
			if r.Method == "OPTIONS" {
				w.WriteHeader(http.StatusOK)
				return
			}

			next.ServeHTTP(w, r)
		})
	}
}

// isAllowedOrigin checks if the origin is in the allowed list
// Supports wildcard patterns like https://*.pages.dev
func isAllowedOrigin(origin string, allowed []string) bool {
	for _, a := range allowed {
		// Exact match
		if a == origin {
			return true
		}

		// Wildcard match for patterns like https://*.pages.dev
		if strings.Contains(a, "*") {
			// Extract the wildcard pattern
			if strings.HasPrefix(a, "https://*.") {
				suffix := strings.TrimPrefix(a, "https://*.")
				if strings.HasPrefix(origin, "https://") && strings.HasSuffix(origin, "."+suffix) {
					return true
				}
			} else if strings.HasPrefix(a, "http://*.") {
				suffix := strings.TrimPrefix(a, "http://*.")
				if strings.HasPrefix(origin, "http://") && strings.HasSuffix(origin, "."+suffix) {
					return true
				}
			}
		}
	}
	return false
}
