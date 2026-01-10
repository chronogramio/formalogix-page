package handlers

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"regexp"

	"api-server-go/internal/config"
	"api-server-go/internal/models"
	"api-server-go/internal/services"
)

// ContactHandler handles contact form submissions
type ContactHandler struct {
	cfg          *config.Config
	emailService *services.EmailService
	emailRegex   *regexp.Regexp
}

// NewContactHandler creates a new contact handler
func NewContactHandler(cfg *config.Config, emailSvc *services.EmailService) *ContactHandler {
	return &ContactHandler{
		cfg:          cfg,
		emailService: emailSvc,
		emailRegex:   regexp.MustCompile(`^[^\s@]+@[^\s@]+\.[^\s@]+$`),
	}
}

// Handle processes contact form submissions
func (h *ContactHandler) Handle(w http.ResponseWriter, r *http.Request) {
	// Parse multipart form with size limit
	if err := r.ParseMultipartForm(h.cfg.MaxFileSize); err != nil {
		respondError(w, "Invalid form data", http.StatusBadRequest)
		return
	}

	// Extract form data
	req := models.ContactRequest{
		Company:         r.FormValue("company"),
		Homepage:        r.FormValue("homepage"),
		Name:            r.FormValue("name"),
		Email:           r.FormValue("email"),
		FormCount:       r.FormValue("formCount"),
		Industry:        r.FormValue("industry"),
		Timeline:        r.FormValue("timeline"),
		CurrentSolution: r.FormValue("currentSolution"),
		Message:         r.FormValue("message"),
	}

	// Validate required fields
	if req.Email == "" || req.Message == "" {
		respondError(w, "Email and message are required", http.StatusBadRequest)
		return
	}

	// Validate email format
	if !h.emailRegex.MatchString(req.Email) {
		respondError(w, "Invalid email format", http.StatusBadRequest)
		return
	}

	// Handle file upload
	var attachmentPath string
	var attachmentName string

	file, header, err := r.FormFile("file")
	if err == nil {
		defer file.Close()

		// Validate MIME type
		contentType := header.Header.Get("Content-Type")
		if !h.isAllowedMIME(contentType) {
			respondError(w, "Invalid file type. Only PDF, JPG, PNG allowed", http.StatusBadRequest)
			return
		}

		// Validate file size
		if header.Size > h.cfg.MaxFileSize {
			respondError(w, "File too large. Maximum 10MB", http.StatusBadRequest)
			return
		}

		// Save to temp directory
		tempFile, err := os.CreateTemp("/tmp", "upload-*"+filepath.Ext(header.Filename))
		if err != nil {
			respondError(w, "Failed to process file", http.StatusInternalServerError)
			return
		}
		defer tempFile.Close()

		// Copy file content
		if _, err := io.Copy(tempFile, file); err != nil {
			os.Remove(tempFile.Name())
			respondError(w, "Failed to save file", http.StatusInternalServerError)
			return
		}

		attachmentPath = tempFile.Name()
		attachmentName = header.Filename

		// Ensure cleanup after email is sent
		defer os.Remove(attachmentPath)
	}

	// Send email
	err = h.emailService.SendContactEmail(req, attachmentPath, attachmentName)
	if err != nil {
		// Log error but don't expose details to client
		fmt.Printf("Failed to send email: %v\n", err)
		respondError(w, "Failed to send email", http.StatusInternalServerError)
		return
	}

	respondSuccess(w, "Email sent successfully")
}

// isAllowedMIME checks if the MIME type is in the allowed list
func (h *ContactHandler) isAllowedMIME(mimeType string) bool {
	for _, allowed := range h.cfg.AllowedMimes {
		if mimeType == allowed {
			return true
		}
	}
	return false
}

// respondError sends a JSON error response
func respondError(w http.ResponseWriter, message string, code int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	json.NewEncoder(w).Encode(models.ErrorResponse{
		Success: false,
		Error:   message,
	})
}

// respondSuccess sends a JSON success response
func respondSuccess(w http.ResponseWriter, message string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(models.SuccessResponse{
		Success: true,
		Message: message,
	})
}
