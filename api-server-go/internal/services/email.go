package services

import (
	"fmt"
	"html"
	"os"
	"strconv"
	"strings"

	"api-server-go/internal/config"
	"api-server-go/internal/models"

	"gopkg.in/gomail.v2"
)

// EmailService handles sending emails via SMTP
type EmailService struct {
	cfg *config.Config
}

// NewEmailService creates a new email service
func NewEmailService(cfg *config.Config) *EmailService {
	return &EmailService{cfg: cfg}
}

// SendContactEmail sends a contact form submission email
func (s *EmailService) SendContactEmail(req models.ContactRequest, attachmentPath, attachmentName string) error {
	m := gomail.NewMessage()

	// Set headers
	m.SetHeader("From", fmt.Sprintf("Formalogix Contact Form <%s>", s.cfg.SMTPUser))
	m.SetHeader("To", s.cfg.EmailTo)
	m.SetHeader("Reply-To", req.Email)

	// Set subject based on company or name
	subject := "New Contact: "
	if req.Company != "" {
		subject += req.Company
	} else if req.Name != "" {
		subject += req.Name
	} else {
		subject += "Unknown"
	}
	m.SetHeader("Subject", subject)

	// Generate HTML body
	htmlBody := s.generateEmailHTML(req, attachmentPath, attachmentName)
	m.SetBody("text/html", htmlBody)

	// Attach file if present
	if attachmentPath != "" && attachmentName != "" {
		m.Attach(attachmentPath, gomail.Rename(attachmentName))
	}

	// Create dialer and send
	d := gomail.NewDialer(s.cfg.SMTPHost, s.cfg.SMTPPort, s.cfg.SMTPUser, s.cfg.SMTPPass)

	return d.DialAndSend(m)
}

// SendOfferRequestEmail sends an offer request email with calculator data
func (s *EmailService) SendOfferRequestEmail(req models.OfferRequest, attachmentPath, attachmentName string) error {
	m := gomail.NewMessage()

	// Set headers
	m.SetHeader("From", fmt.Sprintf("Formalogix Offer Request <%s>", s.cfg.SMTPUser))
	m.SetHeader("To", s.cfg.EmailTo)
	m.SetHeader("Reply-To", req.Email)

	// Set subject with company/name and page count
	subject := "🎯 New Offer Request: "
	if req.Company != "" {
		subject += req.Company
	} else if req.Name != "" {
		subject += req.Name
	} else {
		subject += "Unknown"
	}
	if req.Pages != "" {
		if count, err := strconv.Atoi(req.Pages); err == nil {
			subject += fmt.Sprintf(" (%s pages)", formatGermanNumber(count))
		}
	}
	m.SetHeader("Subject", subject)

	// Generate HTML body
	htmlBody := s.generateOfferRequestHTML(req, attachmentPath, attachmentName)
	m.SetBody("text/html", htmlBody)

	// Attach file if present
	if attachmentPath != "" && attachmentName != "" {
		m.Attach(attachmentPath, gomail.Rename(attachmentName))
	}

	// Create dialer and send
	d := gomail.NewDialer(s.cfg.SMTPHost, s.cfg.SMTPPort, s.cfg.SMTPUser, s.cfg.SMTPPass)

	return d.DialAndSend(m)
}

// generateOfferRequestHTML creates the HTML email body for offer requests
func (s *EmailService) generateOfferRequestHTML(req models.OfferRequest, attachmentPath, attachmentName string) string {
	// Format pages with German locale
	pagesFormatted := "Not specified"
	if req.Pages != "" {
		if count, err := strconv.Atoi(req.Pages); err == nil {
			pagesFormatted = formatGermanNumber(count)
		} else {
			pagesFormatted = req.Pages
		}
	}

	// Parse and format services (from JSON array)
	servicesFormatted := "None"
	if req.Services != "" {
		// Simple parsing (assuming format like ["analysis","verification"])
		services := strings.ReplaceAll(req.Services, "[", "")
		services = strings.ReplaceAll(services, "]", "")
		services = strings.ReplaceAll(services, "\"", "")
		if services != "" {
			servicesList := strings.Split(services, ",")
			var translated []string
			for _, svc := range servicesList {
				switch strings.TrimSpace(svc) {
				case "analysis":
					translated = append(translated, "Analysis")
				case "verification":
					translated = append(translated, "Verification")
				case "scanning":
					translated = append(translated, "Scanning")
				default:
					translated = append(translated, svc)
				}
			}
			servicesFormatted = strings.Join(translated, ", ")
		}
	}

	// Format page size
	pageSizeFormatted := orDefault(req.PageSize, "Not specified")
	if req.PageSizeOther != "" {
		pageSizeFormatted += fmt.Sprintf(" (%s)", req.PageSizeOther)
	}

	// Format urgency
	urgencyFormatted := orDefault(req.Urgency, "Not specified")
	if req.UrgencyDate != "" {
		urgencyFormatted += fmt.Sprintf(" (%s)", req.UrgencyDate)
	}

	// Get file info
	var fileInfo string
	if attachmentName != "" {
		fileInfo = attachmentName
		if attachmentPath != "" {
			if stat, err := os.Stat(attachmentPath); err == nil {
				sizeKB := float64(stat.Size()) / 1024.0
				fileInfo = fmt.Sprintf("%s (%.2f KB)", attachmentName, sizeKB)
			}
		}
	}

	var html strings.Builder

	html.WriteString(`<h2 style="color: #3b82f6;">🎯 New Offer Request from Pricing Calculator</h2>`)

	// Calculator Summary Section
	html.WriteString(`<h3 style="color: #3b82f6; margin-top: 24px;">Calculator Summary</h3>`)
	html.WriteString(`<table style="border-collapse: collapse; width: 100%; margin-bottom: 16px; font-family: Arial, sans-serif;">`)

	html.WriteString(`<tr style="background-color: #f8f9fa;">`)
	html.WriteString(`<td style="padding: 12px; font-weight: bold; border: 1px solid #dee2e6;">Number of Pages:</td>`)
	html.WriteString(fmt.Sprintf(`<td style="padding: 12px; border: 1px solid #dee2e6;">%s</td>`, escape(pagesFormatted)))
	html.WriteString(`</tr>`)

	html.WriteString(`<tr>`)
	html.WriteString(`<td style="padding: 12px; font-weight: bold; border: 1px solid #dee2e6;">Selected Services:</td>`)
	html.WriteString(fmt.Sprintf(`<td style="padding: 12px; border: 1px solid #dee2e6;">%s</td>`, escape(servicesFormatted)))
	html.WriteString(`</tr>`)

	html.WriteString(`<tr style="background-color: #f8f9fa;">`)
	html.WriteString(`<td style="padding: 12px; font-weight: bold; border: 1px solid #dee2e6;">Estimated Cost:</td>`)
	html.WriteString(fmt.Sprintf(`<td style="padding: 12px; border: 1px solid #dee2e6; font-weight: bold; color: #3b82f6;">%s %s</td>`, escape(orDefault(req.TotalCost, "0")), escape(orDefault(req.Currency, "EUR"))))
	html.WriteString(`</tr>`)

	html.WriteString(`</table>`)

	// Document Details Section
	html.WriteString(`<h3 style="color: #3b82f6; margin-top: 24px;">Document Details</h3>`)
	html.WriteString(`<table style="border-collapse: collapse; width: 100%; margin-bottom: 16px; font-family: Arial, sans-serif;">`)

	html.WriteString(`<tr style="background-color: #f8f9fa;">`)
	html.WriteString(`<td style="padding: 12px; font-weight: bold; border: 1px solid #dee2e6;">Page Size:</td>`)
	html.WriteString(fmt.Sprintf(`<td style="padding: 12px; border: 1px solid #dee2e6;">%s</td>`, escape(pageSizeFormatted)))
	html.WriteString(`</tr>`)

	html.WriteString(`<tr>`)
	html.WriteString(`<td style="padding: 12px; font-weight: bold; border: 1px solid #dee2e6;">Document Condition:</td>`)
	html.WriteString(fmt.Sprintf(`<td style="padding: 12px; border: 1px solid #dee2e6;">%s</td>`, escape(orDefault(req.DocumentCondition, "Not specified"))))
	html.WriteString(`</tr>`)

	html.WriteString(`</table>`)

	// Business Context Section
	html.WriteString(`<h3 style="color: #3b82f6; margin-top: 24px;">Business Context</h3>`)
	html.WriteString(`<table style="border-collapse: collapse; width: 100%; margin-bottom: 16px; font-family: Arial, sans-serif;">`)

	html.WriteString(`<tr style="background-color: #f8f9fa;">`)
	html.WriteString(`<td style="padding: 12px; font-weight: bold; border: 1px solid #dee2e6;">Industry:</td>`)
	html.WriteString(fmt.Sprintf(`<td style="padding: 12px; border: 1px solid #dee2e6;">%s</td>`, escape(orDefault(req.Industry, "Not specified"))))
	html.WriteString(`</tr>`)

	html.WriteString(`<tr>`)
	html.WriteString(`<td style="padding: 12px; font-weight: bold; border: 1px solid #dee2e6;">Urgency:</td>`)
	html.WriteString(fmt.Sprintf(`<td style="padding: 12px; border: 1px solid #dee2e6;">%s</td>`, escape(urgencyFormatted)))
	html.WriteString(`</tr>`)

	html.WriteString(`</table>`)

	// Contact Information Section
	html.WriteString(`<h3 style="color: #3b82f6; margin-top: 24px;">Contact Information</h3>`)
	html.WriteString(`<table style="border-collapse: collapse; width: 100%; margin-bottom: 16px; font-family: Arial, sans-serif;">`)

	html.WriteString(`<tr style="background-color: #f8f9fa;">`)
	html.WriteString(`<td style="padding: 12px; font-weight: bold; border: 1px solid #dee2e6;">Company:</td>`)
	html.WriteString(fmt.Sprintf(`<td style="padding: 12px; border: 1px solid #dee2e6;">%s</td>`, escape(orDefault(req.Company, "Not provided"))))
	html.WriteString(`</tr>`)

	html.WriteString(`<tr>`)
	html.WriteString(`<td style="padding: 12px; font-weight: bold; border: 1px solid #dee2e6;">Name:</td>`)
	html.WriteString(fmt.Sprintf(`<td style="padding: 12px; border: 1px solid #dee2e6;">%s</td>`, escape(req.Name)))
	html.WriteString(`</tr>`)

	html.WriteString(`<tr style="background-color: #f8f9fa;">`)
	html.WriteString(`<td style="padding: 12px; font-weight: bold; border: 1px solid #dee2e6;">Email:</td>`)
	html.WriteString(fmt.Sprintf(`<td style="padding: 12px; border: 1px solid #dee2e6;"><a href="mailto:%s">%s</a></td>`, escape(req.Email), escape(req.Email)))
	html.WriteString(`</tr>`)

	html.WriteString(`<tr>`)
	html.WriteString(`<td style="padding: 12px; font-weight: bold; border: 1px solid #dee2e6;">Phone:</td>`)
	html.WriteString(fmt.Sprintf(`<td style="padding: 12px; border: 1px solid #dee2e6;">%s</td>`, escape(orDefault(req.Phone, "Not provided"))))
	html.WriteString(`</tr>`)

	if req.Message != "" {
		html.WriteString(`<tr style="background-color: #f8f9fa;">`)
		html.WriteString(`<td style="padding: 12px; font-weight: bold; border: 1px solid #dee2e6; vertical-align: top;">Message:</td>`)
		html.WriteString(fmt.Sprintf(`<td style="padding: 12px; border: 1px solid #dee2e6; white-space: pre-wrap;">%s</td>`, escape(req.Message)))
		html.WriteString(`</tr>`)
	}

	if fileInfo != "" {
		html.WriteString(`<tr>`)
		html.WriteString(`<td style="padding: 12px; font-weight: bold; border: 1px solid #dee2e6;">Attachment:</td>`)
		html.WriteString(fmt.Sprintf(`<td style="padding: 12px; border: 1px solid #dee2e6;">%s</td>`, escape(fileInfo)))
		html.WriteString(`</tr>`)
	}

	html.WriteString(`</table>`)

	// Action Required Callout
	html.WriteString(`<p style="margin-top: 24px; padding: 12px; background-color: #f0f9ff; border-left: 4px solid #3b82f6;">`)
	html.WriteString(`<strong>Action Required:</strong> Respond within 24 hours with a detailed offer.`)
	html.WriteString(`</p>`)

	return html.String()
}

// generateEmailHTML creates the HTML email body matching the Express.js format
func (s *EmailService) generateEmailHTML(req models.ContactRequest, attachmentPath, attachmentName string) string {
	// Format form count with German locale (1.000 instead of 1,000)
	formCount := "Not provided"
	if req.FormCount != "" {
		if count, err := strconv.Atoi(req.FormCount); err == nil {
			formCount = formatGermanNumber(count)
		} else {
			formCount = req.FormCount
		}
	}

	// Get file size if attachment exists
	var fileInfo string
	if attachmentName != "" {
		fileInfo = attachmentName
		if attachmentPath != "" {
			if stat, err := os.Stat(attachmentPath); err == nil {
				sizeKB := float64(stat.Size()) / 1024.0
				fileInfo = fmt.Sprintf("%s (%.2f KB)", attachmentName, sizeKB)
			}
		}
	}

	var html strings.Builder

	html.WriteString(`<h2>New Contact Form Submission</h2>`)
	html.WriteString(`<table style="border-collapse: collapse; width: 100%; font-family: Arial, sans-serif;">`)

	// Company
	html.WriteString(`<tr style="background-color: #f8f9fa;">`)
	html.WriteString(`<td style="padding: 12px; font-weight: bold; border: 1px solid #dee2e6;">Company:</td>`)
	html.WriteString(fmt.Sprintf(`<td style="padding: 12px; border: 1px solid #dee2e6;">%s</td>`, escape(orDefault(req.Company, "Not provided"))))
	html.WriteString(`</tr>`)

	// Homepage
	html.WriteString(`<tr>`)
	html.WriteString(`<td style="padding: 12px; font-weight: bold; border: 1px solid #dee2e6;">Homepage:</td>`)
	html.WriteString(fmt.Sprintf(`<td style="padding: 12px; border: 1px solid #dee2e6;">%s</td>`, formatHomepage(req.Homepage)))
	html.WriteString(`</tr>`)

	// Name
	html.WriteString(`<tr style="background-color: #f8f9fa;">`)
	html.WriteString(`<td style="padding: 12px; font-weight: bold; border: 1px solid #dee2e6;">Name:</td>`)
	html.WriteString(fmt.Sprintf(`<td style="padding: 12px; border: 1px solid #dee2e6;">%s</td>`, escape(orDefault(req.Name, "Not provided"))))
	html.WriteString(`</tr>`)

	// Email
	html.WriteString(`<tr>`)
	html.WriteString(`<td style="padding: 12px; font-weight: bold; border: 1px solid #dee2e6;">Email:</td>`)
	html.WriteString(fmt.Sprintf(`<td style="padding: 12px; border: 1px solid #dee2e6;"><a href="mailto:%s">%s</a></td>`, escape(req.Email), escape(req.Email)))
	html.WriteString(`</tr>`)

	// Monthly Forms
	html.WriteString(`<tr style="background-color: #f8f9fa;">`)
	html.WriteString(`<td style="padding: 12px; font-weight: bold; border: 1px solid #dee2e6;">Monthly Forms:</td>`)
	html.WriteString(fmt.Sprintf(`<td style="padding: 12px; border: 1px solid #dee2e6;">%s</td>`, escape(formCount)))
	html.WriteString(`</tr>`)

	// Industry
	html.WriteString(`<tr>`)
	html.WriteString(`<td style="padding: 12px; font-weight: bold; border: 1px solid #dee2e6;">Industry:</td>`)
	html.WriteString(fmt.Sprintf(`<td style="padding: 12px; border: 1px solid #dee2e6;">%s</td>`, escape(orDefault(req.Industry, "Not selected"))))
	html.WriteString(`</tr>`)

	// Timeline
	html.WriteString(`<tr style="background-color: #f8f9fa;">`)
	html.WriteString(`<td style="padding: 12px; font-weight: bold; border: 1px solid #dee2e6;">Timeline:</td>`)
	html.WriteString(fmt.Sprintf(`<td style="padding: 12px; border: 1px solid #dee2e6;">%s</td>`, escape(orDefault(req.Timeline, "Not selected"))))
	html.WriteString(`</tr>`)

	// Current Solution
	html.WriteString(`<tr>`)
	html.WriteString(`<td style="padding: 12px; font-weight: bold; border: 1px solid #dee2e6;">Current Solution:</td>`)
	html.WriteString(fmt.Sprintf(`<td style="padding: 12px; border: 1px solid #dee2e6;">%s</td>`, escape(orDefault(req.CurrentSolution, "Not selected"))))
	html.WriteString(`</tr>`)

	// Message
	html.WriteString(`<tr style="background-color: #f8f9fa;">`)
	html.WriteString(`<td style="padding: 12px; font-weight: bold; border: 1px solid #dee2e6; vertical-align: top;">Message:</td>`)
	html.WriteString(fmt.Sprintf(`<td style="padding: 12px; border: 1px solid #dee2e6; white-space: pre-wrap;">%s</td>`, escape(req.Message)))
	html.WriteString(`</tr>`)

	// Attachment (if present)
	if fileInfo != "" {
		html.WriteString(`<tr>`)
		html.WriteString(`<td style="padding: 12px; font-weight: bold; border: 1px solid #dee2e6;">Attachment:</td>`)
		html.WriteString(fmt.Sprintf(`<td style="padding: 12px; border: 1px solid #dee2e6;">%s</td>`, escape(fileInfo)))
		html.WriteString(`</tr>`)
	}

	html.WriteString(`</table>`)

	return html.String()
}

// orDefault returns value if non-empty, otherwise returns defaultValue
func orDefault(value, defaultValue string) string {
	if value == "" {
		return defaultValue
	}
	return value
}

// formatHomepage formats a URL as a clickable link or "Not provided"
func formatHomepage(url string) string {
	if url == "" {
		return "Not provided"
	}
	return fmt.Sprintf(`<a href="%s">%s</a>`, html.EscapeString(url), html.EscapeString(url))
}

// formatGermanNumber formats a number with German thousands separator (dot)
// Example: 1000 -> "1.000", 50000 -> "50.000"
func formatGermanNumber(n int) string {
	s := strconv.Itoa(n)
	if len(s) <= 3 {
		return s
	}

	// Insert dots from right to left every 3 digits
	var result strings.Builder
	for i, c := range s {
		if i > 0 && (len(s)-i)%3 == 0 {
			result.WriteRune('.')
		}
		result.WriteRune(c)
	}
	return result.String()
}

// escape HTML-escapes a string
func escape(s string) string {
	return html.EscapeString(s)
}
