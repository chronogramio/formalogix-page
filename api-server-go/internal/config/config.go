package config

import (
	"fmt"
	"os"
	"strconv"
	"strings"
)

// Config holds all application configuration
type Config struct {
	// Server
	Port string

	// SMTP
	SMTPHost string
	SMTPPort int
	SMTPUser string
	SMTPPass string
	EmailTo  string

	// File Upload
	MaxFileSize  int64
	AllowedMimes []string

	// CORS
	AllowedOrigins []string
}

// Load reads configuration from environment variables
func Load() (*Config, error) {
	cfg := &Config{
		Port:        getEnv("PORT", "3000"),
		SMTPHost:    getEnv("EMAIL_HOST", ""),
		SMTPPort:    getEnvInt("EMAIL_PORT", 587),
		SMTPUser:    getEnv("EMAIL_USER", ""),
		SMTPPass:    getEnv("EMAIL_PASS", ""),
		EmailTo:     getEnv("EMAIL_TO", ""),
		MaxFileSize: 10 * 1024 * 1024, // 10MB
		AllowedMimes: []string{
			"application/pdf",
			"image/jpeg",
			"image/jpg",
			"image/png",
		},
		AllowedOrigins: parseOrigins(getEnv("CORS_ORIGINS",
			"http://localhost:4321,http://localhost:4322,https://formalogix.com,https://www.formalogix.com,https://*.pages.dev")),
	}

	// Validate required fields
	if cfg.SMTPHost == "" {
		return nil, fmt.Errorf("EMAIL_HOST is required")
	}
	if cfg.SMTPUser == "" {
		return nil, fmt.Errorf("EMAIL_USER is required")
	}
	if cfg.SMTPPass == "" {
		return nil, fmt.Errorf("EMAIL_PASS is required")
	}
	if cfg.EmailTo == "" {
		return nil, fmt.Errorf("EMAIL_TO is required")
	}

	return cfg, nil
}

// getEnv retrieves an environment variable or returns a fallback value
func getEnv(key, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
}

// getEnvInt retrieves an integer environment variable or returns a fallback value
func getEnvInt(key string, fallback int) int {
	if value := os.Getenv(key); value != "" {
		if i, err := strconv.Atoi(value); err == nil {
			return i
		}
	}
	return fallback
}

// parseOrigins splits comma-separated origins and trims whitespace
func parseOrigins(origins string) []string {
	parts := strings.Split(origins, ",")
	result := make([]string, 0, len(parts))
	for _, part := range parts {
		if trimmed := strings.TrimSpace(part); trimmed != "" {
			result = append(result, trimmed)
		}
	}
	return result
}
