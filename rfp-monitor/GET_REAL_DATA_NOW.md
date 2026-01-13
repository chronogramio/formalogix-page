# Get Real Tender Data NOW - Quick Guide

**Your TED Account**: pascal@formalogix.com
**Status**: Ready to search for real tenders

---

## 🚀 Get Real Results in 10 Minutes

### Step 1: Search TED Right Now (3 minutes)

**Go to**: https://ted.europa.eu/en/advanced-search

**Configure Search:**

1. **Text search** (copy/paste this):
   ```
   digitalization OR digitization OR OCR OR "document processing" OR "form digitization"
   ```

2. **Publication date**: Last 30 days (to see recent tenders)

3. **Country**: Select:
   - ☑️ Germany
   - ☑️ Austria
   - ☑️ Switzerland

4. **CPV codes** (optional, helps narrow): 72000000, 72260000

5. Click **"Search"**

---

### Step 2: Copy 3-5 Relevant Tenders (5 minutes)

For each tender that mentions forms/documents/digitization:

1. Click on the tender
2. Copy this information:
   - **Tender ID** (e.g., "2026/S 006-012345")
   - **Title**
   - **Description** (at least first paragraph)
   - **Country** (DE/AT/CH)
   - **Buyer/Organization name**
   - **Publication date**
   - **Deadline** (if shown)
   - **CPV codes** (if listed)
   - **URL** (copy from browser)

---

### Step 3: Create Your Data File (2 minutes)

1. **Copy the template**:
   ```bash
   cp data/manual-tender-template.json data/real-tenders-2026-01-09.json
   ```

2. **Edit the file**:
   ```bash
   nano data/real-tenders-2026-01-09.json
   # or use your preferred editor
   ```

3. **Fill in real data** - Replace ALL CAPS placeholders with actual tender data

**Example of filled data:**
```json
{
  "tenders": [
    {
      "id": "2026/S 006-012345",
      "title": "Digitalisierung von Versicherungsunterlagen",
      "description": "Die Versicherung XY sucht einen Dienstleister für die Digitalisierung und OCR-Verarbeitung von ca. 50.000 Versicherungsformularen pro Jahr.",
      "country": "DE",
      "cpvCodes": ["72000000", "72260000"],
      "publicationDate": "2026-01-09",
      "deadline": "2026-02-15",
      "contractValue": 180000,
      "buyerName": "Versicherung XY AG",
      "url": "https://ted.europa.eu/udl?uri=TED:NOTICE:012345-2026"
    }
  ]
}
```

---

### Step 4: Score the Real Tenders (30 seconds)

```bash
node scripts/score-manual-tenders.js data/real-tenders-2026-01-09.json
```

This will:
- ✅ Calculate priority scores for each tender
- ✅ Show statistics (High/Medium/Low priority)
- ✅ Create scored output file
- ✅ Display top matches

---

### Step 5: View in Dashboard (10 seconds)

The dashboard will automatically load your scored results!

**Open**: http://127.0.0.1:8080/dashboard.html

You should see:
- Real tender statistics
- Real tender cards with priority badges
- Actual buyer names and countries
- Links to actual TED notices

---

## 🎯 Alternative: Quick TED Browse

If search returns too many results, try browsing specific categories:

### Today's Tenders
https://ted.europa.eu/search/result?ojs-number=6%2F2026&scope=ALL

Use browser search (Ctrl+F / Cmd+F) for:
- "digital"
- "OCR"
- "form"
- "document"

### By Business Sector
https://ted.europa.eu/en/browse-by-business-sector

Look for:
- **Software and information systems** (CPV 48000000)
- **IT services** (CPV 72000000)
- **Document services** (CPV 79999000)

---

## 📧 Set Up Email Alerts (Bonus - 3 minutes)

While you're on TED:

1. Run your search again
2. Click **"Save this search"** button
3. Name it: "Formalogix Digitization Opportunities"
4. Enable: ☑️ **Email notifications - Daily**
5. Click **"Save"**

Now you'll receive daily emails when new matching tenders are published!

---

## 🔄 What If No Tenders Match Today?

**Normal!** Form digitization tenders are published sporadically.

**What to do:**
1. **Broaden search** - Try just "document" or "digitalization" (broader terms)
2. **Expand timeframe** - Search last 60-90 days
3. **Any IT tender** - Grab ANY tender to test the system works
4. **Use test data** - `npm test` still validates everything works

**Remember:**
- Your **email alerts** will notify you when new relevant tenders appear
- **5-10 relevant tenders/month** is normal for this niche
- **System is ready** - just waiting for tender data

---

## 📊 Expected Search Results

Based on your criteria (form/document digitization in DE/AT/CH):

**Broad search** ("digitalization" OR "document processing"):
- 50-200 results/month
- Many irrelevant (general IT projects)
- Need manual filtering

**Narrow search** ("form digitization" OR "handwriting recognition" OR "OCR"):
- 5-15 results/month
- Higher relevance
- Better signal-to-noise ratio

**Sweet spot**: Use broad search but rely on your scoring algorithm to filter!

---

## 💡 Pro Tips

1. **Don't be too picky initially** - Grab 5-10 tenders even if not perfect matches to populate your system

2. **Check recent winners** - Search for "awarded contracts" in similar areas to see what's possible

3. **Export to spreadsheet** - TED allows CSV export for tracking multiple tenders

4. **Save search queries** - TED allows saving multiple search agents

5. **Check daily** - New tenders published Monday-Friday around 9am CET

---

## ✅ Success Checklist

- [ ] Searched TED advanced search
- [ ] Found 3-5 relevant tenders
- [ ] Copied tender details to JSON file
- [ ] Ran scoring script
- [ ] Viewed results in dashboard
- [ ] Set up email alerts on TED
- [ ] Dashboard shows real tenders with real scores

---

## 🆘 Troubleshooting

**"Search returns 0 results"**
- Try broader terms: "document" or "software" or "IT services"
- Expand date range to last 90 days
- Check if TED website is working (sometimes down for maintenance)

**"Can't find relevant tenders"**
- Grab ANY tender to test the system works
- Your email alerts will catch future relevant ones
- Remember: 5-10 relevant tenders/MONTH is normal (not daily)

**"Scoring script fails"**
- Check JSON syntax (use jsonlint.com to validate)
- Ensure all required fields are present
- Check for typos in field names

**"Dashboard doesn't show new data"**
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- Check filename: Should be `*-scored.json` after running scoring script
- Check browser console for errors (F12)

---

## 🎉 You're Done!

Once you complete these steps, you'll have:
- ✅ Real tender data in your system
- ✅ Real priority scores
- ✅ Real dashboard visualization
- ✅ Email alerts for future tenders

**Your RFP monitoring system is now LIVE with REAL DATA!**

---

**Next**: Register on other platforms (Bund.de, eVergabe, SIMAP) to increase coverage.

See: `PLATFORM_REGISTRATION_GUIDE.md`
