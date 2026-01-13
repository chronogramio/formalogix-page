package models

// ContactRequest represents the contact form submission
type ContactRequest struct {
	Company         string
	Homepage        string
	Name            string
	Email           string
	FormCount       string
	Industry        string
	Timeline        string
	CurrentSolution string
	Message         string
}

// OfferRequest represents an offer request from the pricing calculator
type OfferRequest struct {
	// Calculator data
	Pages     string
	Services  string // JSON array: ["analysis", "verification", "scanning"]
	TotalCost string
	Currency  string

	// Document details
	PageSize          string
	PageSizeOther     string
	DocumentCondition string

	// Business context
	Industry    string
	Urgency     string
	UrgencyDate string

	// Contact info
	Company string
	Name    string
	Email   string
	Phone   string
	Message string
}

// SuccessResponse represents a successful API response
type SuccessResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
}

// ErrorResponse represents an error API response
type ErrorResponse struct {
	Success bool   `json:"success"`
	Error   string `json:"error"`
}

// HealthResponse represents the health check response
type HealthResponse struct {
	Status  string `json:"status"`
	Message string `json:"message"`
}
