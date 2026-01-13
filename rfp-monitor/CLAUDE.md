# Claude Instructions for RFP Monitor System

## CRITICAL REQUIREMENT: REAL DATA ONLY

**IMPORTANT**: This system MUST use REAL data from TED (Tenders Electronic Daily) at all times.

### Strict Rules:

1. **NO DEMO DATA**: Never generate, create, or use fake/sample/demonstration tender data
2. **NO PLACEHOLDER DATA**: All tender information must come from actual TED sources
3. **NO SIMULATED RESULTS**: If real data cannot be fetched, the system should return empty results, NOT fake data
4. **REAL URLs ONLY**: All tender URLs must point to actual TED notices that exist and are clickable

### Data Sources (Priority Order):

**ONLY use these real data sources:**
1. ✅ TED website (https://ted.europa.eu) - live scraping
2. ✅ TED API (https://api.ted.europa.eu) - when available
3. ✅ TED FTP (ftp://ted.europa.eu) - XML downloads
4. ✅ TED CSV datasets (official exports only)

**NEVER use:**
- ❌ Generated/fake tender data
- ❌ Hardcoded sample tenders
- ❌ Placeholder tender information
- ❌ Demo/test data in production mode

### Implementation Requirements:

- All scrapers MUST connect to real TED endpoints
- All tender IDs MUST be real TED notice IDs
- All URLs MUST be valid TED notice URLs that load real tenders
- If scraping fails, return `[]` empty array, NOT sample data
- Dashboard MUST show "No tenders found" if no real data available

### Testing:

- Use `npm test` for testing with clearly labeled TEST data only
- Production commands (`npm run scrape-auto`) MUST use real data only
- Any demo/test mode MUST be clearly labeled as "TEST MODE" in output

### Violation Consequences:

If fake/demo data is used in production:
- Users click links that don't work (current issue)
- System loses credibility
- Business decisions made on false data
- Wasted time pursuing non-existent opportunities

### Current Status:

✅ **SYSTEM IS NOW FULLY OPERATIONAL WITH REAL DATA**

The system successfully:
1. ✅ Connects to TED Official API v3 (`api.ted.europa.eu/v3/notices/search`)
2. ✅ Extracts REAL tender data with working, clickable URLs
3. ✅ Never falls back to demo data
4. ✅ Returns empty results if connection fails
5. ✅ Fetches 250 real tenders from Germany, Austria, Switzerland, Liechtenstein
6. ✅ URLs verified working: `https://ted.europa.eu/en/notice/-/detail/{id}`

**Implementation:** `scripts/ted-api-scraper.js`
**Command:** `npm run scrape-api` or `npm run scrape-auto`

---

**This is a non-negotiable requirement. Real data or no data. Never fake data.**

Last updated: 2026-01-09 16:00
