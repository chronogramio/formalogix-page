# Formalogix RFP/RFI Monitoring System

Automated system for discovering and tracking public procurement opportunities (RFP/RFI/tenders) that match Formalogix's form digitization services.

## 🎯 What This System Does

- **Monitors** TED (Tenders Electronic Daily) and other EU procurement platforms
- **Filters** opportunities using relevant CPV codes and keywords
- **Scores** each tender based on relevance to Formalogix services
- **Notifies** you via email for high-priority matches
- **Tracks** historical data and provides a dashboard for viewing opportunities

## 📋 Features

✅ Automated daily scanning of TED and procurement platforms
✅ Intelligent keyword and CPV code matching
✅ Priority scoring algorithm (High/Medium/Low)
✅ Email notifications (immediate alerts + daily digest)
✅ HTML dashboard for browsing opportunities
✅ Historical data tracking
✅ Configurable search parameters

---

## 🚀 Quick Start

### 1. Installation

```bash
cd rfp-monitor
npm install
```

### 2. Configuration

Create a `.env` file from the example:

```bash
cp .env.example .env
```

Edit `.env` with your email credentials:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
EMAIL_FROM=rfp-monitor@formalogix.com

NOTIFICATION_EMAILS=info@formalogix.com,sales@formalogix.com

ENABLE_DAILY_DIGEST=true
ENABLE_IMMEDIATE_ALERTS=true
SCAN_TIME=09:00
MIN_TENDER_VALUE=10000
```

**For Gmail:**
- Go to Google Account → Security → 2-Step Verification → App Passwords
- Generate an app-specific password for "Mail"
- Use this password in `EMAIL_PASSWORD`

### 3. Test Email Configuration

```bash
npm run test-email
```

### 4. Run Your First Scan

```bash
npm run start
```

This will:
- Search TED for relevant tenders
- Score and filter results
- Save data to `data/` folder
- Send email notifications (if configured)

### 5. View Results

Open `dashboard.html` in your browser to see the results.

---

## 📖 Usage

### Run a Single Scan

```bash
npm run start
```

### Test TED Scraper Only

```bash
npm run test-ted
```

### Run Daily Automated Scans

Start the scheduler (runs daily at configured time):

```bash
node scripts/scheduler.js
```

Or run with systemd/PM2 (see Production Deployment below).

### Run Scan Immediately via Scheduler

```bash
node scripts/scheduler.js --run-now
```

---

## ⚙️ Configuration

### Keywords & CPV Codes

Edit `config/monitoring-config.js` to customize:

- **Target countries**: DE, AT, CH, LI
- **CPV codes**: Common Procurement Vocabulary codes for IT services, digitization, OCR, etc.
- **Keywords**: German and English search terms
- **Target sectors**: Insurance, healthcare, education, wholesale
- **Priority scoring**: Adjust weights for different keyword matches
- **Budget thresholds**: Minimum tender values to consider

### Email Notifications

Configure in `.env`:

- `ENABLE_DAILY_DIGEST=true` - Send daily summary email
- `ENABLE_IMMEDIATE_ALERTS=true` - Send instant alerts for high-priority tenders
- `NOTIFICATION_EMAILS` - Comma-separated list of recipients

### Scan Schedule

Configure in `.env`:

```env
SCAN_TIME=09:00  # Daily scan at 9:00 AM CET
```

---

## 🏗️ Architecture

```
rfp-monitor/
├── config/
│   └── monitoring-config.js    # Search parameters, keywords, CPV codes
├── scripts/
│   ├── ted-scraper.js          # TED platform scraper
│   ├── email-notifier.js       # Email notification system
│   ├── daily-scan.js           # Main orchestration script
│   └── scheduler.js            # Automated daily scheduler
├── data/                       # Tender results (JSON files)
├── logs/                       # Scan history logs
├── dashboard.html              # HTML dashboard for viewing results
├── .env                        # Environment variables (create from .env.example)
└── package.json
```

---

## 🔍 How It Works

### 1. TED Scraper (`ted-scraper.js`)

- Searches TED API/FTP for procurement notices
- Filters by CPV codes and keywords
- Extracts tender metadata (title, deadline, buyer, value)
- Scores relevance using priority keywords

### 2. Scoring Algorithm

Each tender is scored based on:

- **High-priority keywords** (+10 points): form, handwriting, OCR, digitization
- **Medium-priority keywords** (+5 points): document, processing, automation
- **Target country match** (+5 points): DE, AT, CH, LI
- **CPV code match** (+8 points): Relevant IT/digitization codes

**Priority Levels:**
- **High Priority**: Score ≥ 20 (immediate email alert)
- **Medium Priority**: Score 10-19 (included in daily digest)
- **Low Priority**: Score < 10 (saved but not emphasized)

### 3. Email Notifications

- **Immediate Alerts**: Sent instantly for high-priority tenders (score ≥ 20)
- **Daily Digest**: Summary of all tenders found in the last 24 hours
- **HTML Emails**: Professionally formatted with tender details and direct links

### 4. Dashboard

- View all tenders in a clean HTML interface
- Filter by priority, country, or keyword
- Sort by relevance score
- Direct links to TED notices

---

## 🌐 Procurement Platforms

### Automated Monitoring

Currently implemented:
- **TED (Tenders Electronic Daily)** - EU-wide procurement notices

### Manual Registration Recommended

You should also register manually on these platforms for comprehensive coverage:

#### Germany

1. **Bund.de** - https://www.bund.de
   - Central German federal procurement platform
   - Create account → Set up email alerts
   - Keywords: "Dokumentenverarbeitung", "Formulardigitalisierung", "OCR"

2. **eVergabe Online** - https://www.evergabe-online.de
   - Major German e-procurement portal
   - Register → Configure notification preferences
   - Filter by CPV codes: 72000000, 72260000, 72263000

#### Austria

3. **Austrian Federal Procurement** - https://www.bbg.gv.at
   - Bundesbeschaffung GmbH platform
   - Register for tender notifications

#### Switzerland

4. **SIMAP** - https://www.simap.ch
   - Official Swiss public procurement platform
   - Create account → Set search agents for:
     - "Formulardigitalisierung"
     - "Dokumentenverarbeitung"
     - "OCR-Dienste"

### Setting Up Manual Alerts

For each platform:

1. **Register** with your business email
2. **Create search agents** with these keywords:
   - German: Formulardigitalisierung, Dokumentenverarbeitung, Handschrifterkennung, OCR-Dienste
   - English: form digitization, document processing, OCR services
3. **Configure CPV codes**: 72000000, 72260000, 72263000, 72268000, 79999100
4. **Set email frequency**: Daily or immediate
5. **Test alerts**: Verify you receive notifications

---

## 📊 Data Storage

### File Structure

```
data/
├── scan-2026-01-09.json      # Daily scan results
├── scan-2026-01-10.json
└── ...

logs/
└── scan-history.json         # 90-day rolling history of scan stats
```

### Data Format

Each scan file contains:

```json
{
  "timestamp": "2026-01-09T09:00:00.000Z",
  "stats": {
    "total": 15,
    "highPriority": 3,
    "mediumPriority": 7,
    "lowPriority": 5
  },
  "tenders": [
    {
      "id": "TED-12345",
      "title": "Digitalisierung von Versicherungsformularen",
      "description": "...",
      "country": "DE",
      "cpvCodes": ["72000000"],
      "publicationDate": "2026-01-08",
      "deadline": "2026-02-15",
      "contractValue": 150000,
      "buyerName": "Bundesversicherungsamt",
      "url": "https://ted.europa.eu/...",
      "priorityScore": 25
    }
  ]
}
```

---

## 🚀 Production Deployment

### Option 1: PM2 (Recommended)

```bash
# Install PM2 globally
npm install -g pm2

# Start scheduler
pm2 start scripts/scheduler.js --name rfp-monitor

# Save configuration
pm2 save

# Set up auto-restart on boot
pm2 startup
```

### Option 2: Systemd (Linux)

Create `/etc/systemd/system/rfp-monitor.service`:

```ini
[Unit]
Description=Formalogix RFP Monitor
After=network.target

[Service]
Type=simple
User=your-user
WorkingDirectory=/path/to/rfp-monitor
ExecStart=/usr/bin/node scripts/scheduler.js
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Enable and start:

```bash
sudo systemctl enable rfp-monitor
sudo systemctl start rfp-monitor
sudo systemctl status rfp-monitor
```

### Option 3: Cron Job

Add to crontab:

```bash
crontab -e
```

```cron
# Run daily at 9 AM
0 9 * * * cd /path/to/rfp-monitor && /usr/bin/node scripts/daily-scan.js >> logs/cron.log 2>&1
```

---

## 🔧 Troubleshooting

### No Tenders Found

**Possible causes:**
- TED API may require authentication (check TED documentation)
- Rate limiting (try FTP download option instead)
- Keywords too specific (broaden search terms in `config/monitoring-config.js`)

**Solutions:**
1. Check TED API status: https://ted.europa.eu/api
2. Use FTP alternative: `ftp://ted.europa.eu` (guest/guest)
3. Manually register on platforms for guaranteed coverage

### Email Not Sending

**Checklist:**
- ✅ Gmail 2-factor authentication enabled
- ✅ App-specific password generated (not your regular Gmail password)
- ✅ `.env` file has correct credentials
- ✅ Port 587 not blocked by firewall

**Test:**
```bash
npm run test-email
```

### Dashboard Shows No Data

**Ensure:**
1. You've run at least one scan: `npm run start`
2. Data files exist in `data/` folder
3. Open `dashboard.html` from a local web server (not `file://`)

**Simple web server:**
```bash
npx http-server . -p 8080
# Then open http://localhost:8080/dashboard.html
```

---

## 📈 Advanced Features

### Custom Scoring Weights

Edit `scripts/ted-scraper.js` → `scoreTender()` method to adjust scoring logic.

### Add More Platforms

1. Create new scraper: `scripts/platform-name-scraper.js`
2. Follow `ted-scraper.js` pattern
3. Import in `scripts/daily-scan.js`
4. Add platform configuration to `config/monitoring-config.js`

### Webhook Integration

Modify `email-notifier.js` to send data to Slack/Teams/Discord:

```javascript
// Example: Send to Slack webhook
const axios = require('axios');

async sendToSlack(tender) {
  await axios.post(process.env.SLACK_WEBHOOK_URL, {
    text: `New High-Priority RFP: ${tender.title}`,
    attachments: [{
      title: tender.title,
      title_link: tender.url,
      text: tender.description,
      color: 'danger'
    }]
  });
}
```

---

## 🛡️ Security & Privacy

- **Credentials**: Never commit `.env` file to version control
- **API Keys**: Store in environment variables only
- **Data**: Tender data is public information, but store securely
- **Email**: Use app-specific passwords, not your main password
- **Access**: Restrict access to dashboard and data files

---

## 📝 Maintenance

### Weekly Tasks

- Review high-priority tenders from daily digests
- Adjust keywords if getting irrelevant results
- Check scan history logs for errors

### Monthly Tasks

- Review scoring algorithm effectiveness
- Update CPV codes based on new service offerings
- Clean up old data files (older than 90 days)

### Quarterly Tasks

- Review and update keyword lists
- Check for new procurement platforms in target countries
- Audit email notification preferences

---

## 📚 Resources

### TED Documentation

- TED Homepage: https://ted.europa.eu
- TED API Docs: https://ted.europa.eu/api
- TED FTP Access: ftp://ted.europa.eu (guest/guest)
- CPV Codes: https://simap.ted.europa.eu/web/simap/cpv

### Procurement Platforms

- Germany Bund.de: https://www.bund.de
- Germany eVergabe: https://www.evergabe-online.de
- Austria BBG: https://www.bbg.gv.at
- Switzerland SIMAP: https://www.simap.ch

### Tools & Libraries

- ExtracTED (GitHub): https://github.com/ONSBigData/ExtracTED
- OpenTED Dataset: https://github.com/datasets/opented
- Node-cron: https://github.com/node-cron/node-cron
- Nodemailer: https://nodemailer.com

---

## 🤝 Support

For issues or questions:

1. Check this README
2. Review logs in `logs/` folder
3. Test individual components (`test-ted`, `test-email`)
4. Contact: paroos@formalogix.com

---

## 📄 License

Internal tool for Formalogix. Not for public distribution.

---

**Last Updated**: 2026-01-09
**Version**: 1.0.0
