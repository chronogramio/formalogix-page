# Hybrid Deployment Guide: Cloudflare Pages + VPS API

This guide explains how to deploy Formalogix using a hybrid approach:
- **Static site** on Cloudflare Pages (fast, global CDN)
- **API server** on your own VPS (full control, email functionality)

## Architecture Overview

```
┌─────────────────────────────────────────────┐
│   User Browser                              │
│                                             │
│   https://formalogix.com (Cloudflare)      │
└──────────┬──────────────────────────────────┘
           │
           ├─────► Static Pages (Cloudflare CDN)
           │       - Fast global delivery
           │       - HTML, CSS, JS, Images
           │
           └─────► Contact Form Submission
                   │
                   ▼
           https://api.formalogix.com (Your VPS)
           - Express.js API Server
           - Email sending via Gmail
           - File upload handling
```

## Part 1: Deploy Static Site to Cloudflare Pages

### Step 1: Build Static Site

```bash
# Install dependencies
npm install

# Build for production
npm run build
```

This creates a `dist/` folder with static files.

### Step 2: Configure Cloudflare Pages

1. **Connect Repository:**
   - Go to Cloudflare dashboard → Pages
   - Click "Create a project"
   - Connect to your GitHub repository: `chronogramio/formalogix-page`

2. **Build Settings:**
   - **Framework preset:** Astro
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Root directory:** `/` (leave empty)

3. **Environment Variables:**
   - Add: `PUBLIC_API_URL` = `https://api.formalogix.com`
   - This tells the form where to send submissions

4. **Deploy:**
   - Click "Save and Deploy"
   - Wait for build to complete (~1-2 minutes)

### Step 3: Configure Custom Domain (Optional)

1. In Cloudflare Pages project → Custom domains
2. Add domain: `formalogix.com`
3. Follow DNS configuration instructions

## Part 2: Deploy API Server to VPS

### Step 1: Prepare VPS

SSH into your VPS:
```bash
ssh user@your-vps-ip
```

Install Node.js (if not already installed):
```bash
# Using nvm (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 20
nvm use 20

# Or using apt (Ubuntu/Debian)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Step 2: Deploy API Server Code

Option A: Using Git (Recommended)
```bash
# Clone repository
git clone https://github.com/chronogramio/formalogix-page.git
cd formalogix-page/api-server

# Install dependencies
npm install
```

Option B: Upload via SCP
```bash
# On your local machine
cd /path/to/project
scp -r api-server user@your-vps-ip:/home/user/formalogix-api
```

### Step 3: Configure Environment

```bash
cd /path/to/api-server
cp .env.example .env
nano .env
```

Configure the following:
```env
PORT=3000
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-actual-gmail@gmail.com
EMAIL_PASS=your-gmail-app-password
EMAIL_TO=contact@formalogix.com
```

**Important:** Get Gmail App Password:
1. Enable 2-factor authentication on Gmail
2. Google Account → Security → App Passwords
3. Generate password for "Mail"
4. Use this password (16 characters) in `EMAIL_PASS`

### Step 4: Start API Server with PM2

```bash
# Install PM2 globally
npm install -g pm2

# Start server
pm2 start server.js --name formalogix-api

# Configure auto-start on reboot
pm2 startup
pm2 save

# Check status
pm2 status
pm2 logs formalogix-api
```

### Step 5: Configure Nginx Reverse Proxy

Create Nginx config:
```bash
sudo nano /etc/nginx/sites-available/formalogix-api
```

Add configuration:
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

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/formalogix-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Step 6: Add SSL Certificate

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d api.formalogix.com

# Certbot will auto-configure Nginx for HTTPS
```

### Step 7: Configure DNS

In your DNS provider (or Cloudflare DNS):
- Add A record: `api` → Your VPS IP address
- Wait for DNS propagation (~5 minutes)

## Part 3: Testing

### Test API Server

```bash
# Health check
curl https://api.formalogix.com/health

# Expected response:
# {"status":"ok","message":"Formalogix API Server is running"}
```

### Test Contact Form

1. Visit https://formalogix.com/#contact
2. Fill out the form
3. Submit
4. Check:
   - Success message appears
   - Email received at configured address
   - File attachment works (if uploaded)

### Troubleshooting

**Form submission fails:**
1. Check browser console for errors
2. Verify `PUBLIC_API_URL` is set in Cloudflare Pages
3. Check CORS errors - ensure origin is allowed in `api-server/server.js`

**Email not sending:**
1. Check API server logs: `pm2 logs formalogix-api`
2. Verify Gmail credentials in `.env`
3. Test SMTP connection manually

**CORS errors:**
1. Open browser DevTools → Network tab
2. Look for preflight OPTIONS request
3. Add origin to CORS whitelist in `server.js`

## Maintenance

### Update Static Site

```bash
# Local machine
git pull
npm run build

# Cloudflare Pages will auto-deploy on git push
git push origin main
```

### Update API Server

```bash
# On VPS
cd /path/to/formalogix-page/api-server
git pull
npm install
pm2 restart formalogix-api
```

### Monitor API Server

```bash
# Check status
pm2 status

# View logs
pm2 logs formalogix-api

# View real-time monitoring
pm2 monit

# Check Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## Cost Breakdown

| Component | Service | Cost |
|-----------|---------|------|
| Static Site | Cloudflare Pages | Free (unlimited bandwidth) |
| API Server | Your VPS | Your existing VPS cost |
| Email | Gmail SMTP | Free (up to 500/day) |
| SSL Certificates | Let's Encrypt | Free |
| **Total** | | **$0/month** (excluding VPS) |

## Security Checklist

- [ ] HTTPS enabled on both domains
- [ ] CORS properly configured
- [ ] Gmail App Password used (not regular password)
- [ ] Environment variables not committed to git
- [ ] Firewall configured on VPS (only ports 22, 80, 443 open)
- [ ] PM2 configured to restart on failure
- [ ] Regular security updates on VPS
- [ ] Nginx configured with security headers

## Backup Strategy

### API Server
```bash
# Backup environment variables
scp user@vps:/path/to/api-server/.env ./backups/api-env-backup

# Code is in git repository (no backup needed)
```

### Email History
- All sent emails are in Gmail Sent folder
- Consider setting up email forwarding for redundancy

## Scaling

As your traffic grows:

**Static Site (Cloudflare Pages):**
- Automatically scales globally
- No action needed

**API Server:**
- Monitor with `pm2 monit`
- If high load, consider:
  - Upgrading VPS resources
  - Running multiple PM2 instances
  - Load balancing multiple VPS servers
  - Moving to serverless (Cloudflare Workers)

## Support

For issues:
1. Check logs: `pm2 logs formalogix-api`
2. Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`
3. Review API server README: `api-server/README.md`
4. Test health endpoint: `curl https://api.formalogix.com/health`
