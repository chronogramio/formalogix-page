package handlers

import (
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

// OfferRequestHandler handles offer request submissions from pricing calculator
type OfferRequestHandler struct {
	cfg          *config.Config
	emailService *services.EmailService
	emailRegex   *regexp.Regexp
}

// NewOfferRequestHandler creates a new offer request handler
func NewOfferRequestHandler(cfg *config.Config, emailSvc *services.EmailService) *OfferRequestHandler {
	return &OfferRequestHandler{
		cfg:          cfg,
		emailService: emailSvc,
		emailRegex:   regexp.MustCompile(`^[^\s@]+@[^\s@]+\.[^\s@]+$`),
	}
}

// Handle processes offer request submissions
func (h *OfferRequestHandler) Handle(w http.ResponseWriter, r *http.Request) {
	// Parse multipart form with size limit
	if err := r.ParseMultipartForm(h.cfg.MaxFileSize); err != nil {
		respondError(w, "Invalid form data", http.StatusBadRequest)
		return
	}

	// Extract form data
	req := models.OfferRequest{
		// Calculator data
		Pages:     r.FormValue("pages"),
		Services:  r.FormValue("services"),
		TotalCost: r.FormValue("totalCost"),
		Currency:  r.FormValue("currency"),

		// Document details
		PageSize:          r.FormValue("pageSize"),
		PageSizeOther:     r.FormValue("pageSizeOther"),
		DocumentCondition: r.FormValue("documentCondition"),

		// Business context
		Industry:    r.FormValue("industry"),
		Urgency:     r.FormValue("urgency"),
		UrgencyDate: r.FormValue("urgencyDate"),

		// Contact info
		Company: r.FormValue("company"),
		Name:    r.FormValue("name"),
		Email:   r.FormValue("email"),
		Phone:   r.FormValue("phone"),
		Message: r.FormValue("message"),
	}

	// Validate required fields
	if req.Email == "" || req.Name == "" {
		respondError(w, "Email and name are required", http.StatusBadRequest)
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
		tempFile, err := os.CreateTemp("/tmp", "offer-upload-*"+filepath.Ext(header.Filename))
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
	err = h.emailService.SendOfferRequestEmail(req, attachmentPath, attachmentName)
	if err != nil {
		// Log error but don't expose details to client
		fmt.Printf("Failed to send offer request email: %v\n", err)
		respondError(w, "Failed to send offer request", http.StatusInternalServerError)
		return
	}

	respondSuccess(w, "Offer request sent successfully")
}

// isAllowedMIME checks if the MIME type is in the allowed list
func (h *OfferRequestHandler) isAllowedMIME(mimeType string) bool {
	for _, allowed := range h.cfg.AllowedMimes {
		if mimeType == allowed {
			return true
		}
	}
	return false
}
