# Testing Without Email Configuration

You can fully test the RFP monitoring system without configuring email notifications.

## ✅ What's Already Done

- Email notifications are **DISABLED** in `config/monitoring-config.js`
- Test script created with 5 sample tenders matching Formalogix services
- Dashboard configured to show test results

## 🧪 Running Tests

### Test with Sample Data (Recommended First)

```bash
npm test
```

This will:
- Use 5 realistic sample tenders (insurance, healthcare, education sectors)
- Score them using your priority algorithm
- Save results to `data/test-results.json`
- Show detailed output in terminal
- **NO email required**
- **NO internet required**

**Sample output:**
```
🔴 [HIGH PRIORITY] Score: 68
Digitalisierung und OCR-Verarbeitung von Versicherungsformularen
🏢 Bundesversicherungsamt | 🌍 DE | 💰 €150,000
📅 Deadline: 2026-02-15
```

### Test with Real TED Data (Requires Internet)

```bash
npm run test-ted
```

This will:
- Attempt to connect to TED API
- Search for real tenders
- Show results (may be 0 if no matches or API requires auth)
- **NO email required**

## 🎨 Viewing Results in Dashboard

### Method 1: Direct File Open (Quick)

1. Simply double-click `dashboard.html`
2. Opens in your browser
3. Shows test results automatically

### Method 2: Local Server (Recommended)

```bash
npx http-server . -p 8080
```

Then open: http://localhost:8080/dashboard.html

**Why use a server?**
- Avoids CORS issues
- More reliable file loading
- Closer to production environment

## 📊 What You'll See in Dashboard

### Statistics Cards
- Total tenders found
- High priority count (score ≥ 20)
- Medium priority count (10-19)
- Low priority count (<10)

### Tender Cards
Each card shows:
- 🔴 Priority badge (High/Medium/Low)
- Title and description
- Buyer name and country
- Contract value and deadline
- Relevance score
- Link to original tender

### Filters
- Filter by priority level
- Filter by country (DE, AT, CH)
- Search by keyword
- Refresh to reload data

## 🔍 Understanding the Scoring

The test tenders demonstrate the scoring system:

**Sample 1: Score 68 (VERY HIGH)**
- Keywords: "Digitalisierung" (+10), "OCR" (+10), "Versicherungsformularen" (+10)
- Target country: DE (+5)
- CPV match: 72000000, 72260000 (+8 each)

**Sample 4: Score 58 (HIGH)**
- Keywords: "Archivdigitalisierung" (+10), "Handschrifterkennung" (+10)
- Target country: DE (+5)
- CPV match: 79999100, 72000000 (+8 each)

**Sample 5: Score 48 (HIGH but less relevant)**
- Only "IT-Dienstleistungen" matches
- Generic IT tender, not specifically about forms/OCR
- Target country: DE (+5)
- CPV match: 72000000 (+8)

## 📁 Test Data Location

All test results are saved to:
```
data/test-results.json
```

You can open this file to see the raw data structure.

## 🔄 Running Multiple Tests

Each time you run `npm test`, it overwrites `test-results.json` with fresh sample data.

To preserve results:
```bash
# Save current results
cp data/test-results.json data/test-backup.json

# Run new test
npm test

# Compare
diff data/test-results.json data/test-backup.json
```

## 🌐 Testing Real Scans (Without Email)

When ready to test with real TED data:

```bash
npm start
```

This will:
- Search TED for real tenders
- Score and filter results
- Save to `data/scan-YYYY-MM-DD.json`
- **Skip email notifications** (disabled in config)
- Show results in terminal

Expected outcomes:
- ✅ May find 0-5 real tenders (normal)
- ⚠️ May get API errors (TED requires authentication)
- 💡 Can use FTP alternative (see README.md)

## 🔧 When to Enable Email

Enable email when:
1. You've verified the system works with test data
2. You've seen results in the dashboard
3. You're ready for daily automated monitoring
4. You have Gmail app password ready

To enable:
1. Edit `config/monitoring-config.js`
2. Change `enabled: false` to `enabled: true` (line 115)
3. Create `.env` file with email credentials
4. Test with: `npm run test-email`

## 📋 Testing Checklist

- [x] Email notifications disabled
- [x] Test with sample data (`npm test`)
- [ ] View results in dashboard
- [ ] Test filtering and search
- [ ] Understand scoring system
- [ ] Test with real TED data (`npm start`)
- [ ] Review data files in `data/` folder
- [ ] Ready to enable email (when needed)

## 💡 Tips

1. **Start with `npm test`** - Fastest way to see the system working
2. **Use the dashboard** - Visual interface is easier than reading JSON
3. **Check the terminal output** - Shows detailed scoring breakdown
4. **Experiment with filters** - Try different priority levels and countries
5. **Read test-results.json** - Understand the data structure

## ❓ Common Questions

**Q: Why do all test tenders have high scores?**
A: They're designed to match Formalogix services (form digitization, OCR, handwriting). Real scans will have more variety.

**Q: Can I modify the test data?**
A: Yes! Edit `scripts/test-with-samples.js` and add your own sample tenders.

**Q: Do I need to run `npm test` every time?**
A: No, test results are saved. Re-run only if you want to regenerate or after changing scoring logic.

**Q: Will the dashboard show real scan data too?**
A: Yes! It will automatically load the most recent data (test or real scan).

**Q: When should I test with real TED data?**
A: After you're comfortable with the test data and understand how the system works.

---

## 🚀 Quick Start

```bash
# 1. Run test with sample data
npm test

# 2. Open dashboard (choose one):
# Option A: Direct open
open dashboard.html

# Option B: Local server
npx http-server . -p 8080
# Then visit: http://localhost:8080/dashboard.html

# 3. Explore the results!
```

That's it! You're testing the RFP monitor without any email setup required.

---

**Ready to go live?** See `QUICKSTART.md` for email configuration and automated scanning.
