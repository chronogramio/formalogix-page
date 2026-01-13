# Formalogix API Server (Go)

Backend API for Formalogix landing page contact forms.

## Quick Start

```bash
# Copy environment file
cp .env.example .env
# Edit .env with your SMTP credentials

# Run locally
go run cmd/api/main.go

# Or use the convenience script
./run-local.sh
```

## Environment Variables

Required: `EMAIL_HOST`, `EMAIL_USER`, `EMAIL_PASS`, `EMAIL_TO`
Optional: `PORT` (default: 3000), `CORS_ORIGINS`

## Endpoints

- `GET /health` - Health check
- `POST /api/contact` - General contact form
- `POST /api/offer-request` - Offer request from pricing calculator
