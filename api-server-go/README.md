# Formalogix API Server (Go)

Production-ready Go backend for the Formalogix contact form with Kubernetes deployment support.

## Features

- ✅ Contact form with file upload (PDF, JPG, PNG)
- ✅ Email via SMTP (info@formalogix.com)
- ✅ Rate limiting (100 requests/min)
- ✅ CORS with wildcard domain support
- ✅ Graceful shutdown
- ✅ Health check endpoint
- ✅ Docker containerization (~20-25MB image)
- ✅ Kubernetes deployment with auto-scaling
- ✅ Automatic TLS via cert-manager

## Architecture

**Stack:**
- Go 1.22
- Chi (HTTP router)
- gomail.v2 (email)
- Distroless container (security)

**Deployment:**
- Kubernetes (k0s cluster)
- nginx-ingress controller
- cert-manager (Let's Encrypt)

## Quick Start

### Local Development

```bash
# 1. Clone and navigate
cd api-server-go

# 2. Copy environment variables
cp .env.example .env
# Edit .env with your SMTP credentials

# 3. Install dependencies
go mod download

# 4. Run
go run cmd/api/main.go

# 5. Test
curl http://localhost:3000/health
```

### Docker Build

```bash
# Build
docker build -t formalogix-api:v1.0.0 -f deployments/docker/Dockerfile .

# Run locally
docker run --env-file .env -p 3000:3000 formalogix-api:v1.0.0

# Test
curl http://localhost:3000/health
```

### Kubernetes Deployment

```bash
# 1. Create namespace
kubectl apply -f deployments/kubernetes/namespace.yaml

# 2. Create secret (interactive)
./scripts/create-secret.sh

# 3. Deploy application
kubectl apply -f deployments/kubernetes/configmap.yaml
kubectl apply -f deployments/kubernetes/deployment.yaml
kubectl apply -f deployments/kubernetes/service.yaml
kubectl apply -f deployments/kubernetes/ingress.yaml

# 4. Verify
kubectl -n formalogix get pods
kubectl -n formalogix get ingress
kubectl -n formalogix logs -l app=formalogix-api --tail=50

# 5. Test
curl https://forms.flickflauder.com/health
```

## API Endpoints

### Health Check
```bash
GET /health

Response:
{
  "status": "ok",
  "message": "Formalogix API Server is running"
}
```

### Contact Form
```bash
POST /api/contact
Content-Type: multipart/form-data

Fields:
- email* (required)
- message* (required)
- company
- homepage
- name
- formCount
- industry
- timeline
- currentSolution
- file (optional, max 10MB, PDF/JPG/PNG)

Response (success):
{
  "success": true,
  "message": "Email sent successfully"
}

Response (error):
{
  "success": false,
  "error": "Error message"
}
```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `EMAIL_HOST` | SMTP server | `mx2eae.netcup.net` |
| `EMAIL_PORT` | SMTP port | `587` |
| `EMAIL_USER` | SMTP username | `info@formalogix.com` |
| `EMAIL_PASS` | SMTP password | `your-password` |
| `EMAIL_TO` | Recipient email | `info@formalogix.com` |
| `CORS_ORIGINS` | Allowed origins (comma-separated) | `https://formalogix.com,...` |

## Project Structure

```
api-server-go/
├── cmd/api/
│   └── main.go              # Application entrypoint
├── internal/
│   ├── config/              # Configuration management
│   ├── handlers/            # HTTP handlers (health, contact)
│   ├── middleware/          # CORS middleware
│   ├── services/            # Email service
│   └── models/              # Request/response structs
├── deployments/
│   ├── docker/              # Dockerfile
│   └── kubernetes/          # K8s manifests
├── scripts/                 # Helper scripts
├── go.mod                   # Go dependencies
└── README.md
```

## DNS Configuration

Add DNS A record for the API domain:

```
forms.flickflauder.com A  193.30.123.10
```

(Or use any of your cluster node IPs: 152.89.106.157, 152.89.107.143)

The TLS certificate will be provisioned automatically via Let's Encrypt.

## Monitoring

### View Logs
```bash
# All pods
kubectl -n formalogix logs -l app=formalogix-api -f

# Specific pod
kubectl -n formalogix logs formalogix-api-xxxxxxxxxx-xxxxx

# Errors only
kubectl -n formalogix logs -l app=formalogix-api | grep -i error
```

### Check Status
```bash
# Pods
kubectl -n formalogix get pods -l app=formalogix-api

# Ingress
kubectl -n formalogix get ingress formalogix-api

# Certificate
kubectl -n formalogix get certificate
```

## Troubleshooting

### Email not sending
```bash
# Check secret
kubectl -n formalogix get secret formalogix-api-secret -o yaml

# Decode credentials
kubectl -n formalogix get secret formalogix-api-secret -o jsonpath='{.data.EMAIL_USER}' | base64 -d

# Check logs
kubectl -n formalogix logs -l app=formalogix-api | grep -i smtp
```

### CORS errors
```bash
# Check ConfigMap
kubectl -n formalogix get configmap formalogix-api-config -o yaml

# Test CORS
curl -H "Origin: https://formalogix.com" \
  -H "Access-Control-Request-Method: POST" \
  -X OPTIONS https://forms.flickflauder.com/api/contact -v
```

### File upload failures
```bash
# Check ingress body size (should be 25m)
kubectl -n formalogix get ingress formalogix-api -o yaml | grep body-size
```

### Certificate issues
```bash
# Check certificate status
kubectl -n formalogix describe certificate formalogix-api-tls

# Check ClusterIssuer
kubectl get clusterissuer letsencrypt-production
```

## Development

### Run Tests
```bash
go test ./...
```

### Format Code
```bash
go fmt ./...
```

### Build Binary
```bash
go build -o api-server ./cmd/api
```

## Migration from Express.js

1. **Deploy Go API** to Kubernetes at `forms.flickflauder.com`
2. **Test thoroughly** with test form submissions
3. **Update frontend** `.env`: `PUBLIC_API_URL=https://forms.flickflauder.com`
4. **Monitor** for 48 hours
5. **Decommission** Express after validation

## Security

- ✅ Non-root container (uid 65532)
- ✅ Distroless base image (no shell)
- ✅ Rate limiting (prevents spam)
- ✅ File validation (MIME + size)
- ✅ CORS whitelist
- ✅ Automatic HTTPS (cert-manager)
- ✅ Secrets stored in Kubernetes

## Performance

- **Image size**: ~20-25MB
- **Memory**: 128Mi request, 256Mi limit
- **CPU**: 100m request, 500m limit
- **Replicas**: 3 (high availability)
- **Rate limit**: 100 requests/min

## Support

For issues or questions:
- Check logs: `kubectl -n formalogix logs -l app=formalogix-api`
- Review plan: `/Users/paroos/.claude/plans/immutable-yawning-trinket.md`
- Contact: tech@formalogix.com

## License

Proprietary - Formalogix
