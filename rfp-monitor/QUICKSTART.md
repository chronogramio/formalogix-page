# Quick Start Guide - Formalogix RFP Monitor

Get up and running with the RFP monitoring system in 5 minutes.

---

## ⚡ 5-Minute Setup

### Step 1: Configure Email (2 minutes)

```bash
cd rfp-monitor
cp .env.example .env
```

Edit `.env` with your Gmail credentials:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
NOTIFICATION_EMAILS=info@formalogix.com
```

**Get Gmail App Password:**
1. Go to https://myaccount.google.com/security
2. Enable 2-Step Verification
3. Go to "App passwords"
4. Generate password for "Mail"
5. Copy password to `.env` file

### Step 2: Test Email (1 minute)

```bash
node scripts/email-notifier.js
```

You should see:
```
✅ Email configuration is valid
📧 Will send to: info@formalogix.com
📧 Sending test email...
✅ Sent immediate alert for: Digitalisierung von Versicherungsformularen
```

Check your inbox for the test email.

### Step 3: Run First Scan (2 minutes)

```bash
npm run start
```

This will:
- Search TED for relevant tenders
- Score and filter results
- Save to `data/` folder
- Send email notifications

### Step 4: View Results

Open `dashboard.html` in your browser to see results.

---

## 🎯 What You Get

### Automated Features

✅ **Daily TED Monitoring** - Searches 740,000+ tenders annually
✅ **Intelligent Filtering** - Keywords + CPV codes matching
✅ **Priority Scoring** - High/Medium/Low relevance ranking
✅ **Email Alerts** - Immediate + daily digest
✅ **Dashboard** - HTML interface to browse opportunities

### Search Criteria

**Countries**: Germany, Austria, Switzerland, Liechtenstein
**Keywords**: Form digitization, OCR, handwriting recognition, document processing
**CPV Codes**: IT services, software, digitization, scanning
**Target Sectors**: Insurance, healthcare, education, government

---

## 📅 Daily Usage

### Morning Routine (5 minutes)

1. **Check email** for RFP digest (arrives ~9 AM)
2. **Review high-priority** matches (red badges)
3. **Open dashboard** for full details
4. **Click links** to view tender on TED

### Weekly Tasks (15 minutes)

1. **Manual platform checks** (Bund.de, eVergabe, SIMAP)
2. **Refine keywords** if too many irrelevant results
3. **Track opportunities** in spreadsheet/CRM

---

## 🔧 Common Commands

```bash
# Run a single scan now
npm run start

# Test TED scraper only
npm run test-ted

# Test email configuration
node scripts/email-notifier.js

# Run daily automated scans (keeps running)
node scripts/scheduler.js

# Run scan immediately via scheduler
node scripts/scheduler.js --run-now
```

---

## 🎨 Customization

### Adjust Keywords

Edit `config/monitoring-config.js`:

```javascript
keywordsDE: [
  'Formulardigitalisierung',
  'YOUR_CUSTOM_KEYWORD', // Add here
],
```

### Change Scan Time

Edit `.env`:

```env
SCAN_TIME=09:00  # Change to desired time (24-hour format)
```

### Add Email Recipients

Edit `.env`:

```env
NOTIFICATION_EMAILS=email1@company.com,email2@company.com
```

---

## 📊 Understanding Priority Scores

Each tender is scored based on keyword matches:

- **High Priority (≥20 points)**: Contains "form", "handwriting", "OCR", "digitization" + matches CPV codes + target country
- **Medium Priority (10-19 points)**: Contains "document", "processing", "automation"
- **Low Priority (<10 points)**: Partial keyword match

**High-priority tenders** trigger immediate email alerts.

---

## 🚀 Production Deployment

### Run Continuously with PM2

```bash
# Install PM2 globally
npm install -g pm2

# Start scheduler
pm2 start scripts/scheduler.js --name rfp-monitor

# Check status
pm2 status

# View logs
pm2 logs rfp-monitor

# Auto-restart on server reboot
pm2 startup
pm2 save
```

### Or Use Cron (Alternative)

```bash
crontab -e
```

Add:
```cron
0 9 * * * cd /path/to/rfp-monitor && node scripts/daily-scan.js >> logs/cron.log 2>&1
```

---

## 🌐 Manual Platform Registration

While the automated system monitors TED, you should **also register manually** on these platforms for comprehensive coverage:

### Priority Platforms (Register This Week)

1. **TED** - https://ted.europa.eu
2. **Bund.de** - https://www.bund.de (Germany)
3. **eVergabe** - https://www.evergabe-online.de (Germany)
4. **SIMAP** - https://www.simap.ch (Switzerland)

See `PLATFORM_REGISTRATION_GUIDE.md` for detailed step-by-step instructions.

---

## ❓ Troubleshooting

### "No tenders found"

**Normal!** It means:
- No new tenders in last 7 days matching your criteria
- TED API may require authentication (see README for FTP alternative)
- Keywords may be too specific

**Action**: Check again tomorrow, or manually search TED to verify availability.

### Email not sending

**Check:**
1. App-specific password (not regular Gmail password)
2. 2-factor authentication enabled
3. Port 587 not blocked by firewall

**Test:** `node scripts/email-notifier.js`

### Dashboard shows no data

**Ensure:**
1. You ran at least one scan: `npm run start`
2. Files exist in `data/` folder
3. Open via web server, not `file://` protocol

**Quick server:**
```bash
npx http-server . -p 8080
# Open http://localhost:8080/dashboard.html
```

---

## 📈 Next Steps

### Week 1: Setup & Testing
- [x] Configure email
- [x] Run first scan
- [x] Test dashboard
- [ ] Register on TED manually
- [ ] Register on Bund.de

### Week 2: Optimize
- [ ] Review first week's results
- [ ] Adjust keywords if needed
- [ ] Register on remaining platforms
- [ ] Set up PM2/cron for automation

### Week 3: Production
- [ ] Deploy to production server
- [ ] Configure automated daily scans
- [ ] Set up response workflow
- [ ] Track opportunities in CRM

### Ongoing
- [ ] Daily email review (5 min)
- [ ] Weekly platform checks (15 min)
- [ ] Monthly keyword optimization
- [ ] Quarterly platform audit

---

## 📞 Need Help?

1. **Check README.md** - Full documentation
2. **Check logs** - `logs/` folder
3. **Test components** - Use `test-*` scripts
4. **Contact** - paroos@formalogix.com

---

## 🎉 You're All Set!

Your RFP monitoring system is now configured and ready to find opportunities for Formalogix.

**Remember:**
- Automated monitoring is a **supplement**, not a replacement for manual checks
- Register on platforms manually for guaranteed coverage
- Respond to high-priority tenders within 2-3 days
- Track your win rate to optimize keywords and approach

**Good luck with your RFP hunting! 🎯**

---

**Last Updated**: 2026-01-09
