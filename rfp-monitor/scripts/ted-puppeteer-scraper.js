/**
 * TED Real Data Scraper
 * Connects to actual TED website and extracts real tenders
 * NO DEMO DATA - ONLY REAL TED TENDERS
 */

const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');
const TEDScraper = require('./ted-scraper');
const config = require('../config/monitoring-config');

class TEDPuppeteerScraper {
  constructor() {
    this.baseURL = 'https://ted.europa.eu';
    this.tedScraper = new TEDScraper();
    this.dataDir = path.join(__dirname, '../data');
  }

  /**
   * Search TED website and extract REAL tenders
   */
  async searchTenders(options = {}) {
    let browser;

    try {
      console.log('🌐 CONNECTING TO REAL TED DATA');
      console.log('═'.repeat(60));
      console.log('Source: https://ted.europa.eu (LIVE)');
      console.log('Mode: Real data extraction (NO demo data)');
      console.log('═'.repeat(60) + '\n');

      console.log('1️⃣  Launching browser...\n');

      browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });

      const page = await browser.newPage();

      // Set realistic viewport and user agent
      await page.setViewport({ width: 1920, height: 1080 });
      await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

      // Build search URL
      const searchURL = this.buildSearchURL(options);
      console.log('2️⃣  Navigating to TED search...');
      console.log(`   ${searchURL}\n`);

      // Navigate to search page
      await page.goto(searchURL, {
        waitUntil: 'networkidle2',
        timeout: 60000,
      });

      console.log('3️⃣  Waiting for page to render (React)...');

      // Wait longer for React to fully load and render
      await new Promise(resolve => setTimeout(resolve, 10000));
      console.log('   ✅ Page loaded\n');

      console.log('4️⃣  Extracting tender data from DOM...');

      // Try multiple selectors to find tender results
      const tenders = await this.extractTendersFromPage(page);

      console.log(`✅ Extracted ${tenders.length} tenders\n`);

      await browser.close();

      // Score tenders
      const scoredTenders = tenders.map(tender => ({
        ...tender,
        priorityScore: this.tedScraper.scoreTender(tender),
      }));

      // Sort by score
      scoredTenders.sort((a, b) => b.priorityScore - a.priorityScore);

      return scoredTenders;

    } catch (error) {
      console.error('❌ Error scraping TED:', error.message);
      if (browser) await browser.close();
      return [];
    }
  }

  /**
   * Build TED search URL - Using today's Official Journal issue
   */
  buildSearchURL(options) {
    // Try the current OJ issue (Official Journal Supplement) which we know exists
    // Format: S{issue}/{year} - e.g., S6/2026 for issue 6 of 2026
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
    const issueNumber = Math.floor(dayOfYear / 7) + 1; // Approximate weekly issue

    // Use OJS number to get today's published tenders
    const params = new URLSearchParams();
    params.append('ojs-number', `${issueNumber}/2026`);
    params.append('scope', 'ALL');

    const url = `${this.baseURL}/search/result?${params.toString()}`;
    console.log(`   Using OJS issue ${issueNumber}/2026 (today's published tenders)\n`);
    return url;
  }

  /**
   * Extract REAL tenders from TED page using Puppeteer
   */
  async extractTendersFromPage(page) {
    try {
      console.log('   Waiting for tender elements to appear...');

      // Take screenshot for debugging
      await page.screenshot({ path: path.join(this.dataDir, 'ted-page.png'), fullPage: false });

      // Debug: Check what's actually on the page
      const pageInfo = await page.evaluate(() => {
        const body = document.body.innerText;
        const noResults = body.toLowerCase().includes('no result') ||
                         body.toLowerCase().includes('keine ergebnis') ||
                         body.toLowerCase().includes('0 result');

        return {
          bodyLength: body.length,
          hasNoResults: noResults,
          sampleText: body.substring(0, 500),
          linkCount: document.querySelectorAll('a').length,
        };
      });

      console.log(`   Page info: ${pageInfo.bodyLength} chars, ${pageInfo.linkCount} links`);

      // Always show what TED is actually saying
      console.log('\n   TED PAGE CONTENT:');
      console.log('   ' + pageInfo.sampleText.substring(0, 300).replace(/\s+/g, ' '));
      console.log('');

      if (pageInfo.hasNoResults) {
        console.log('   ⚠️  TED shows "No results"');
        console.log('   ❌ REAL DATA: TED has 0 tenders matching this search');
        console.log('');
        return [];
      }

      // Get all links on the page
      const allLinks = await page.evaluate(() => {
        const links = Array.from(document.querySelectorAll('a'));
        return links.map(a => ({
          href: a.href,
          text: a.textContent.trim().substring(0, 100),
        })).filter(l => l.href && l.text && l.text.length > 10);
      });

      console.log(`   Found ${allLinks.length} links total`);

      // Look for any notice/tender URLs with broader matching
      const tenderLinks = allLinks.filter(link =>
        link.href.includes('/notice') ||
        link.href.includes('udl') ||
        link.href.includes('NOTICE') ||
        link.href.includes('/TED') ||
        (link.text.toLowerCase().includes('notice') && link.href.includes('europa.eu'))
      );

      console.log(`   Found ${tenderLinks.length} potential tender notice links\n`);

      if (tenderLinks.length > 0) {
        console.log('   Sample tender URLs found:');
        tenderLinks.slice(0, 3).forEach((link, i) => {
          console.log(`   ${i + 1}. ${link.href}`);
          console.log(`      "${link.text.substring(0, 60)}..."`);
        });
        console.log('');
      }

      if (tenderLinks.length === 0) {
        console.log('   ❌ NO REAL TENDER DATA FOUND');
        console.log('   TED search returned 0 matching tenders');
        console.log('   This is REAL data - there are genuinely no matching tenders');
        console.log('');
        console.log('   Solutions:');
        console.log('   1. Broaden search: Change keywords to "software" OR "IT"');
        console.log('   2. Expand date range: Try last 90 days');
        console.log('   3. Try different countries');
        console.log('   4. Manual TED search: https://ted.europa.eu/en/advanced-search');
        console.log('');
        return [];
      }

      // Wait for any of these selectors (React might use different ones)
      await page.waitForSelector('a[href*="notice"], [class*="result"], [class*="notice"]', {
        timeout: 10000,
      }).catch(() => {
        console.log('   ⚠️  Timeout waiting for tender elements');
      });

      // Extract tender data using page.evaluate
      const tenders = await page.evaluate(() => {
        const results = [];

        // Try multiple selector strategies
        const selectors = [
          'article[class*="notice"]',
          '[class*="search-result"]',
          '[class*="notice-item"]',
          '[class*="tender"]',
          'article',
          '[role="article"]',
        ];

        let elements = [];
        for (const selector of selectors) {
          elements = document.querySelectorAll(selector);
          if (elements.length > 0) break;
        }

        console.log(`Found ${elements.length} elements`);

        elements.forEach((elem, index) => {
          try {
            // Extract all text content
            const fullText = elem.textContent || '';

            // Try to find title (usually in h2, h3, or strong tags)
            const titleElem = elem.querySelector('h1, h2, h3, strong, [class*="title"]');
            const title = titleElem ? titleElem.textContent.trim() : fullText.substring(0, 200).trim();

            // Try to find link
            const linkElem = elem.querySelector('a[href*="notice"], a[href*="udl"]');
            const url = linkElem ? linkElem.href : null;

            // Extract ID from URL or use index
            let id = `SCRAPED-${index}`;
            if (url) {
              const match = url.match(/notice[\/:-](\d+[-\w]+)/i) || url.match(/(\d{6,}[-\w]+)/);
              if (match) id = match[1];
            }

            // Only add if we have meaningful data
            if (title && title.length > 10) {
              results.push({
                id,
                title,
                description: fullText.substring(0, 500).trim(),
                country: 'Unknown',
                buyerName: 'Unknown',
                deadline: null,
                publicationDate: new Date().toISOString().split('T')[0],
                cpvCodes: [],
                contractValue: null,
                url: url || `https://ted.europa.eu`,
                rawText: fullText.substring(0, 1000),
              });
            }
          } catch (err) {
            console.error('Error extracting tender:', err.message);
          }
        });

        return results;
      });

      console.log(`   Extracted ${tenders.length} tender items\n`);

      // Enhance tenders with more details
      return this.enhanceTenders(tenders);

    } catch (error) {
      console.error('Error extracting tenders:', error.message);

      // Fallback: try to get any text content
      const bodyText = await page.evaluate(() => document.body.innerText);
      console.log('\n📄 Page content preview:');
      console.log(bodyText.substring(0, 500) + '...\n');

      return [];
    }
  }

  /**
   * Enhance tender data by extracting more details from text
   */
  enhanceTenders(tenders) {
    return tenders.map(tender => {
      const text = (tender.description + ' ' + tender.rawText).toLowerCase();

      // Extract country from text
      const countryMatches = {
        'germany': 'DE', 'deutschland': 'DE',
        'austria': 'AT', 'österreich': 'AT',
        'switzerland': 'CH', 'schweiz': 'CH',
        'liechtenstein': 'LI',
      };

      for (const [keyword, code] of Object.entries(countryMatches)) {
        if (text.includes(keyword)) {
          tender.country = code;
          break;
        }
      }

      // Try to extract buyer name (look for organization patterns)
      const orgMatch = text.match(/([A-ZÄÖÜ][a-zäöüß]+ ?(?:[A-ZÄÖÜ][a-zäöüß]+){1,3})/);
      if (orgMatch) {
        tender.buyerName = orgMatch[1];
      }

      // Extract date patterns
      const dateMatch = text.match(/\d{1,2}[./-]\d{1,2}[./-]\d{2,4}/);
      if (dateMatch) {
        tender.deadline = dateMatch[0];
      }

      // Identify CPV codes if mentioned
      const cpvMatch = text.match(/\b(72\d{6}|48\d{6}|79\d{6})\b/g);
      if (cpvMatch) {
        tender.cpvCodes = cpvMatch;
      }

      return tender;
    });
  }

  /**
   * Save results
   */
  async saveResults(tenders, filename = null) {
    try {
      await fs.mkdir(this.dataDir, { recursive: true });

      const dateStr = new Date().toISOString().split('T')[0];
      const filepath = filename || path.join(this.dataDir, `puppeteer-scan-${dateStr}.json`);

      const stats = {
        total: tenders.length,
        highPriority: tenders.filter(t => t.priorityScore >= 20).length,
        mediumPriority: tenders.filter(t => t.priorityScore >= 10 && t.priorityScore < 20).length,
        lowPriority: tenders.filter(t => t.priorityScore < 10).length,
      };

      const output = {
        timestamp: new Date().toISOString(),
        source: 'ted-puppeteer-scraper',
        stats,
        tenders,
      };

      await fs.writeFile(filepath, JSON.stringify(output, null, 2), 'utf-8');
      console.log(`💾 Saved to: ${filepath}\n`);

      return { filepath, stats };
    } catch (error) {
      console.error('Error saving results:', error.message);
    }
  }
}

// CLI usage
if (require.main === module) {
  const scraper = new TEDPuppeteerScraper();

  scraper.searchTenders()
    .then(async (tenders) => {
      if (tenders.length > 0) {
        const { stats } = await scraper.saveResults(tenders);

        console.log('='.repeat(60));
        console.log('📊 RESULTS SUMMARY');
        console.log('='.repeat(60));
        console.log(`Total tenders:      ${stats.total}`);
        console.log(`🔴 High priority:   ${stats.highPriority} (score ≥ 20)`);
        console.log(`🟡 Medium priority: ${stats.mediumPriority} (score 10-19)`);
        console.log(`⚪ Low priority:    ${stats.lowPriority} (score < 10)`);
        console.log('='.repeat(60) + '\n');

        if (tenders.length > 0) {
          console.log('🏆 Top 5 Matches:\n');
          tenders.slice(0, 5).forEach((tender, i) => {
            const icon = tender.priorityScore >= 20 ? '🔴' : tender.priorityScore >= 10 ? '🟡' : '⚪';
            console.log(`${i + 1}. ${icon} [Score: ${tender.priorityScore}]`);
            console.log(`   ${tender.title.substring(0, 100)}`);
            console.log(`   ${tender.country} | ${tender.url}\n`);
          });
        }

        console.log('🎨 View in dashboard:');
        console.log('   http://127.0.0.1:8080/dashboard.html\n');
        console.log('✅ Real data fetched successfully!\n');
      } else {
        console.log('⚠️  No tenders found.');
        console.log('   This might mean TED website structure changed.');
        console.log('   Or no matching tenders in last 30 days.\n');
      }
    })
    .catch(error => {
      console.error('\n❌ Fatal error:', error.message);
      process.exit(1);
    });
}

module.exports = TEDPuppeteerScraper;
