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
