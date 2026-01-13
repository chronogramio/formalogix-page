# TED Account Setup - Real Data Access

**Account Created**: pascal@formalogix.com
**Date**: 2026-01-09

---

## 🎯 Immediate Actions to Get Real Tenders

### Step 1: Set Up Search Agents (5 minutes)

1. **Log in to TED**
   - Go to: https://ted.europa.eu
   - Email: pascal@formalogix.com
   - Password: [your password]

2. **Navigate to Advanced Search**
   - URL: https://ted.europa.eu/en/advanced-search
   - Or click "Search" → "Advanced Search"

3. **Configure Search Criteria**

   **Countries:**
   - ☑️ Germany (DE)
   - ☑️ Austria (AT)
   - ☑️ Switzerland (CH)
   - ☑️ Liechtenstein (LI)

   **Keywords** (enter in "Title/Description" field):
   ```
   Formulardigitalisierung OR Dokumentenverarbeitung OR
   Handschrifterkennung OR OCR OR "form digitization" OR
   "document processing" OR "handwriting recognition"
   ```

   **CPV Codes** (Common Procurement Vocabulary):
   - 72000000-5 (IT services)
   - 72260000-5 (Software-related services)
   - 72263000-6 (Software implementation)
   - 79999100-4 (Scanning services)

   **Publication Date:**
   - Select "Last 7 days" or "Last 30 days"

4. **Save Search & Enable Alerts**
   - Click "Save this search"
   - Name it: "Formalogix Form Digitization"
   - Enable email notifications: ☑️ Daily digest

---

## Step 2: Browse Today's Tenders (Right Now)

**Latest Issue**: S6/2026 (published 2026-01-09)

1. Go to: https://ted.europa.eu/search/result?ojs-number=6%2F2026&scope=ALL
2. This shows ALL tenders published today (January 9, 2026)
3. Use browser search (Ctrl+F / Cmd+F) for keywords:
   - "digitalization"
   - "digitization"
   - "OCR"
   - "form"
   - "document processing"

---

## Step 3: Download Real Data for Your System

### Option A: Manual Export (Quick)

1. Run your search on TED
2. For each relevant tender:
   - Click the tender
   - Note the tender ID (e.g., "2026/S 006-012345")
   - Copy: Title, Buyer, Country, CPV codes, Deadline
3. Create JSON file in `data/` folder:

```json
{
  "timestamp": "2026-01-09T15:00:00.000Z",
  "stats": {
    "total": 3,
    "highPriority": 2,
    "mediumPriority": 1,
    "lowPriority": 0
  },
  "tenders": [
    {
      "id": "2026/S 006-012345",
      "title": "[Actual tender title]",
      "description": "[Actual description]",
      "country": "DE",
      "cpvCodes": ["72000000"],
      "publicationDate": "2026-01-09",
      "deadline": "2026-02-15",
      "contractValue": null,
      "buyerName": "[Actual buyer name]",
      "url": "https://ted.europa.eu/udl?uri=TED:NOTICE:012345-2026",
      "priorityScore": 0
    }
  ]
}
```

4. Run scoring script to calculate priorities:
```bash
node scripts/score-manual-tenders.js data/manual-tenders-2026-01-09.json
```

---

### Option B: TED CSV Export (Better)

1. After running your search on TED
2. Look for "Export results" or "Download" button
3. Select CSV format
4. Save to `data/ted-export.csv`
5. Convert to our format:

```bash
# We can create a converter script
node scripts/convert-ted-csv.js data/ted-export.csv
```

---

### Option C: Screen Scraping (Last Resort)

Since TED's API requires special access, you can:
1. Use your browser's developer tools
2. Extract tender data from the search results page
3. Format into JSON
4. Process through your scoring system

---

## Step 4: Quick Search Right Now

**Let's find tenders published TODAY (2026-01-09):**

1. **Go to**: https://ted.europa.eu/en/advanced-search

2. **Enter these settings**:
   - **Publication date**: From: 2026-01-09, To: 2026-01-09
   - **Countries**: DE, AT, CH
   - **Text search**:
     ```
     digitalization OR digitization OR OCR OR "document processing"
     ```
   - **Scope**: Active notices

3. **Click Search**

4. **Review results** - Any tenders mentioning:
   - Forms / Formulare
   - Documents / Dokumente
   - Digitalization / Digitalisierung
   - OCR / Scanning
   - Healthcare / Insurance systems

---

## Step 5: Set Up Additional Alerts

While on TED, also create search agents for:

### Search Agent 1: "Insurance Forms"
```
Keywords: Versicherung AND (Formular OR Digitalisierung)
Countries: DE, AT, CH
CPV: 72000000, 72260000
```

### Search Agent 2: "Healthcare Documents"
```
Keywords: Gesundheitswesen AND (Dokument OR OCR OR Handschrift)
Countries: DE, AT, CH
CPV: 72000000, 79999100
```

### Search Agent 3: "Education Forms"
```
Keywords: (Bildung OR Universität) AND (Formular OR Digitalisierung)
Countries: DE, AT, CH
CPV: 72000000, 72260000
```

---

## 📊 Expected Results

Based on TED statistics:
- **740,000+ tenders/year** across EU
- **~5-10 relevant matches/month** for your criteria (form digitization, OCR)
- **High-priority matches**: 1-3/month (explicitly mentioning handwriting/forms)

---

## 🚀 Immediate Next Steps (Do Now)

1. **[ ] Log in to TED** with pascal@formalogix.com
2. **[ ] Browse today's tenders** (S6/2026)
3. **[ ] Set up 3 search agents** with email alerts
4. **[ ] Search last 30 days** for any recent opportunities
5. **[ ] Export 5-10 tenders** (any relevant ones) to test your system

---

## 💾 Save Real Data to Your System

Once you have real tender data:

```bash
# Put data in this format
data/real-tenders-2026-01-09.json

# Dashboard will automatically load it
# Refresh dashboard: http://127.0.0.1:8080/dashboard.html
```

Your system will:
- ✅ Score each tender automatically
- ✅ Display in dashboard with priority badges
- ✅ Show statistics
- ✅ Enable filtering and search

---

## 🔐 Security Note

**IMPORTANT**:
- Don't commit your TED password to git
- Consider changing it after initial setup
- Use password manager for secure storage
- The `.env` file is already in `.gitignore`

---

## 📧 Email Alerts from TED

Once you set up search agents, you'll receive:
- Daily digest email from TED
- Contains matching tenders
- Links directly to tender details
- This is your PRIMARY data source until API automation is built

---

## Next: Other Platforms

After TED is working, register on:
1. **Bund.de** - German federal tenders
2. **eVergabe** - German regional tenders
3. **SIMAP** - Swiss tenders

See: `PLATFORM_REGISTRATION_GUIDE.md`

---

**Your Action Right Now:**

🔗 **Go to**: https://ted.europa.eu/en/advanced-search

⚙️ **Search for**: Tenders published in last 7 days in DE/AT/CH with keywords "digitalization", "OCR", "document processing"

📋 **Copy results**: Save any relevant tenders to a JSON file

🎨 **View in dashboard**: Your system is ready to display them!

---

**Questions?** Check `README.md` or ask for help.
