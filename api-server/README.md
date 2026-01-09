# Formalogix API Server

Standalone API server for handling contact form submissions from the Formalogix website.

## Overview

This is a lightweight Express.js server that:
- Receives contact form submissions
- Sends emails via Gmail SMTP
- Handles file uploads (PDF, JPG, PNG)
- Provides CORS support for Cloudflare Pages

## Setup

### 1. Install Dependencies

```bash
cd api-server
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
nano .env
```

Required variables:
- `PORT` - Server port (default: 3000)
- `EMAIL_HOST` - SMTP host (smtp.gmail.com for Gmail)
- `EMAIL_PORT` - SMTP port (587 for Gmail)
- `EMAIL_USER` - Your Gmail address
- `EMAIL_PASS` - Gmail App Password (not your regular password!)
- `EMAIL_TO` - Where to send form submissions

### 3. Gmail App Password Setup

1. Enable 2-factor authentication on your Gmail account
2. Go to Google Account → Security → App Passwords
3. Generate a new app password for "Mail"
4. Use this app password in `EMAIL_PASS` (not your regular Gmail password)

## Development

Start the server in development mode with auto-reload:

```bash
npm run dev
```

Server will start on http://localhost:3000

Test health check:
```bash
curl http://localhost:3000/health
```

## Production Deployment

### Option 1: Using Node.js directly

```bash
npm start
```

### Option 2: Using PM2 (Recommended)

```bash
# Install PM2 globally
npm install -g pm2

# Start server
pm2 start server.js --name formalogix-api

# Auto-start on server reboot
pm2 startup
pm2 save

# View logs
pm2 logs formalogix-api

# Restart server
pm2 restart formalogix-api
```

### Option 3: Using systemd

Create `/etc/systemd/system/formalogix-api.service`:

```ini
[Unit]
Description=Formalogix API Server
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/path/to/api-server
ExecStart=/usr/bin/node server.js
Restart=on-failure
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl enable formalogix-api
sudo systemctl start formalogix-api
sudo systemctl status formalogix-api
```

## Nginx Reverse Proxy

Configure Nginx to proxy requests to the API server:

```nginx
server {
    listen 80;
    server_name api.formalogix.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # Important for file uploads
        client_max_body_size 25M;
    }
}
```

Add SSL with Let's Encrypt:
```bash
sudo certbot --nginx -d api.formalogix.com
```

## API Endpoints

### GET /health
Health check endpoint

**Response:**
```json
{
  "status": "ok",
  "message": "Formalogix API Server is running"
}
```

### POST /api/contact
Contact form submission

**Request:**
- Content-Type: `multipart/form-data`
- Fields:
  - `company` (optional)
  - `homepage` (optional)
  - `name` (optional)
  - `email` (required)
  - `formCount` (optional)
  - `industry` (optional)
  - `timeline` (optional)
  - `currentSolution` (optional)
  - `message` (required)
  - `file` (optional) - PDF, JPG, or PNG, max 10MB

**Success Response:**
```json
{
  "success": true,
  "message": "Email sent successfully"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message here"
}
```

## CORS Configuration

The server allows requests from:
- `http://localhost:4321` (Astro dev)
- `http://localhost:4322` (Astro dev alternate port)
- `https://formalogix.com` (Production)
- `https://www.formalogix.com` (Production www)
- `https://*.pages.dev` (Cloudflare Pages previews)

To add more origins, edit `server.js` and update the `corsOptions.origin` array.

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| PORT | Server port | 3000 |
| EMAIL_HOST | SMTP server hostname | smtp.gmail.com |
| EMAIL_PORT | SMTP server port | 587 |
| EMAIL_USER | SMTP username (Gmail address) | your-email@gmail.com |
| EMAIL_PASS | SMTP password (Gmail App Password) | abcd efgh ijkl mnop |
| EMAIL_TO | Recipient email for form submissions | contact@formalogix.com |

## Security

- CORS is configured to only allow specific origins
- File uploads are limited to 10MB and specific types (PDF, JPG, PNG)
- Email validation is performed server-side
- Temporary files are automatically deleted after email sending
- Uses Gmail App Passwords (not regular passwords)
- All data transmitted over HTTPS in production

## Monitoring

Monitor server health:
```bash
# Using PM2
pm2 monit

# Check logs
pm2 logs formalogix-api

# Using systemd
sudo journalctl -u formalogix-api -f
```

## Troubleshooting

### Emails not sending
1. Check Gmail credentials in `.env`
2. Verify App Password (not regular password)
3. Check server logs for errors
4. Test SMTP connection manually

### CORS errors
1. Verify origin is in `corsOptions.origin` array
2. Check browser console for exact origin
3. Add origin to allowed list if needed

### File uploads failing
1. Check `/tmp/uploads` directory permissions
2. Verify file size under 10MB
3. Check allowed MIME types
4. Ensure disk space available

## License

Proprietary - Formalogix
