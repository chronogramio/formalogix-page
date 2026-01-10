package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"api-server-go/internal/config"
	"api-server-go/internal/handlers"
	"api-server-go/internal/middleware"
	"api-server-go/internal/services"

	"github.com/go-chi/chi/v5"
	chimiddleware "github.com/go-chi/chi/v5/middleware"
)

func main() {
	// Load configuration
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	// Initialize services
	emailService := services.NewEmailService(cfg)

	// Initialize handlers
	healthHandler := handlers.NewHealthHandler()
	contactHandler := handlers.NewContactHandler(cfg, emailService)

	// Setup router
	r := chi.NewRouter()

	// Middleware chain
	r.Use(chimiddleware.RequestID)
	r.Use(chimiddleware.RealIP)
	r.Use(chimiddleware.Logger)
	r.Use(chimiddleware.Recoverer)
	r.Use(chimiddleware.Throttle(100)) // Rate limiting: 100 requests/min
	r.Use(middleware.CORS(cfg))

	// Routes
	r.Get("/health", healthHandler.Handle)
	r.Post("/api/contact", contactHandler.Handle)

	// Create server
	srv := &http.Server{
		Addr:         ":" + cfg.Port,
		Handler:      r,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	// Start server in a goroutine
	go func() {
		log.Printf("🚀 Formalogix API Server running on port %s", cfg.Port)
		log.Printf("   Health check: http://localhost:%s/health", cfg.Port)
		log.Printf("   Contact API: http://localhost:%s/api/contact", cfg.Port)

		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Server error: %v", err)
		}
	}()

	// Graceful shutdown
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt, syscall.SIGTERM)
	<-quit

	log.Println("Shutting down server...")

	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	if err := srv.Shutdown(ctx); err != nil {
		log.Fatalf("Server shutdown error: %v", err)
	}

	log.Println("Server stopped gracefully")
}
