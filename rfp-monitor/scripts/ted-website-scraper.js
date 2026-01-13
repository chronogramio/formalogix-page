/**
 * TED Website Automated Scraper
 * Since the TED API v3 only has eForms (not legacy TED XML),
 * this scraper uses axios + cheerio to fetch from the TED website search
 */

const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs').promises;
const path = require('path');
const TEDScraper = require('./ted-scraper');
const config = require('../config/monitoring-config');

class TEDWebsiteScraper {
  constructor() {
    this.baseURL = 'https://ted.europa.eu';
    this.searchURL = `${this.baseURL}/en/search/result`;
    this.tedScraper = new TEDScraper();
    this.dataDir = path.join(__dirname, '../data');
  }

  /**
   * Search TED website for tenders
   */
  async searchTenders(options = {}) {
    try {
      console.log('🔍 Searching TED website for tenders...\n');

      // Build search parameters
      const params = this.buildSearchParams(options);
      console.log('Search parameters:', params);

      // Make request to TED
      const response = await axios.get(this.searchURL, {
        params,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
          'Accept': 'text/html,application/xhtml+xml',
          'Accept-Language': 'en-US,en;q=0.9,de;q=0.8',
        },
        timeout: 30000,
      });

      console.log(`✅ Got response (${response.status})\n`);

      // Parse HTML
      const $ = cheerio.load(response.data);
      const tenders = this.parseTenderList($);

      console.log(`📋 Extracted ${tenders.length} tenders from search results\n`);

      // Score tenders
      const scoredTenders = tenders.map(tender => ({
        ...tender,
        priorityScore: this.tedScraper.scoreTender(tender),
      }));

      // Sort by score
      scoredTenders.sort((a, b) => b.priorityScore - a.priorityScore);

      return scoredTenders;

    } catch (error) {
      console.error('❌ Error scraping TED website:', error.message);
      if (error.response) {
        console.error(`   Status: ${error.response.status}`);
        console.error(`   URL: ${error.config.url}`);
      }
      return [];
    }
  }

  /**
   * Build search parameters for TED website
   */
  buildSearchParams(options) {
    const keywords = [
      ...config.keywordsEN.slice(0, 5),
      ...config.keywordsDE.slice(0, 5),
    ].join(' OR ');

    return {
      // Free text search
      'FT': keywords,

      // Scope: active notices
      'scope': 'ACTIVE',

      // Countries
      'country': config.targetCountries.join(','),

      // Publication date from (last 30 days)
      'publicationDateFrom': this.getDateDaysAgo(30),

      // Page size
      'pageSize': 50,

      ...options,
    };
  }

  /**
   * Parse tender listings from HTML
   */
  parseTenderList($) {
    const tenders = [];

    // TED uses different HTML structures - we need to find the right selector
    // Try multiple patterns to find tender cards/listings

    // Pattern 1: Article elements with data attributes
    $('article[data-notice-id]').each((i, elem) => {
      const tender = this.extractTenderFromArticle($, $(elem));
      if (tender) tenders.push(tender);
    });

    // Pattern 2: Tender result rows
    $('.ted-search-result-item, .search-result-item').each((i, elem) => {
      const tender = this.extractTenderFromRow($, $(elem));
      if (tender) tenders.push(tender);
    });

    // Pattern 3: Generic container divs
    if (tenders.length === 0) {
      $('.result-item, .tender-item, [class*="notice"]').each((i, elem) => {
        const tender = this.extractTenderGeneric($, $(elem));
        if (tender) tenders.push(tender);
      });
    }

    return tenders;
  }

  /**
   * Extract tender from article element
   */
  extractTenderFromArticle($, $elem) {
    const noticeId = $elem.attr('data-notice-id');
    if (!noticeId) return null;

    const title = $elem.find('h2, h3, .title, [class*="title"]').first().text().trim();
    const description = $elem.find('p, .description, .summary').first().text().trim();
    const buyer = $elem.find('[class*="buyer"], [class*="organization"]').text().trim();
    const country = $elem.find('[class*="country"]').text().trim();
    const deadline = $elem.find('[class*="deadline"], [class*="date"]').text().trim();

    return {
      id: noticeId,
      title: title || 'Untitled tender',
      description,
      country: this.extractCountryCode(country) || 'Unknown',
      buyerName: buyer || 'Unknown',
      deadline: deadline || null,
      publicationDate: new Date().toISOString().split('T')[0],
      cpvCodes: [],
      contractValue: null,
      url: `${this.baseURL}/udl?uri=TED:NOTICE:${noticeId}`,
      rawData: {},
    };
  }

  /**
   * Extract tender from row element
   */
  extractTenderFromRow($, $elem) {
    const link = $elem.find('a[href*="notice"]').first();
    const url = link.attr('href');
    if (!url) return null;

    const title = link.text().trim() || $elem.find('.title, h2, h3').first().text().trim();
    const description = $elem.find('.description, p').first().text().trim();

    return {
      id: this.extractNoticeId(url),
      title: title || 'Untitled tender',
      description,
      country: 'Unknown',
      buyerName: 'Unknown',
      deadline: null,
      publicationDate: new Date().toISOString().split('T')[0],
      cpvCodes: [],
      contractValue: null,
      url: url.startsWith('http') ? url : `${this.baseURL}${url}`,
      rawData: {},
    };
  }

  /**
   * Generic extraction for unknown HTML structure
   */
  extractTenderGeneric($, $elem) {
    const link = $elem.find('a').first();
    const url = link.attr('href');
    if (!url || !url.includes('notice')) return null;

    const text = $elem.text().trim();

    return {
      id: this.extractNoticeId(url) || `SCRAPED-${Date.now()}`,
      title: text.substring(0, 200) || 'Tender',
      description: text.substring(0, 500),
      country: 'Unknown',
      buyerName: 'Unknown',
      deadline: null,
      publicationDate: new Date().toISOString().split('T')[0],
      cpvCodes: [],
      contractValue: null,
      url: url.startsWith('http') ? url : `${this.baseURL}${url}`,
      rawData: {},
    };
  }

  /**
   * Extract notice ID from URL
   */
  extractNoticeId(url) {
    const match = url.match(/notice[\/:-](\d+[-\w]+)/i);
    return match ? match[1] : null;
  }

  /**
   * Extract country code from text
   */
  extractCountryCode(text) {
    const countryMap = {
      'germany': 'DE', 'deutschland': 'DE', 'de': 'DE',
      'austria': 'AT', 'österreich': 'AT', 'at': 'AT',
      'switzerland': 'CH', 'schweiz': 'CH', 'ch': 'CH',
      'liechtenstein': 'LI', 'li': 'LI',
    };

    const lower = text.toLowerCase();
    for (const [key, code] of Object.entries(countryMap)) {
      if (lower.includes(key)) return code;
    }

    return null;
  }

  /**
   * Get date X days ago in YYYY-MM-DD format
   */
  getDateDaysAgo(days) {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toISOString().split('T')[0];
  }

  /**
   * Save results to file
   */
  async saveResults(tenders, filename = null) {
    try {
      await fs.mkdir(this.dataDir, { recursive: true });

      const dateStr = new Date().toISOString().split('T')[0];
      const filepath = filename || path.join(this.dataDir, `website-scan-${dateStr}.json`);

      const stats = {
        total: tenders.length,
        highPriority: tenders.filter(t => t.priorityScore >= 20).length,
        mediumPriority: tenders.filter(t => t.priorityScore >= 10 && t.priorityScore < 20).length,
        lowPriority: tenders.filter(t => t.priorityScore < 10).length,
      };

      const output = {
        timestamp: new Date().toISOString(),
        source: 'ted-website-scraper',
        stats,
        tenders,
      };

      await fs.writeFile(filepath, JSON.stringify(output, null, 2), 'utf-8');
      console.log(`💾 Saved ${tenders.length} tenders to: ${filepath}\n`);

      return { filepath, stats };
    } catch (error) {
      console.error('❌ Error saving results:', error.message);
    }
  }
}

// CLI usage
if (require.main === module) {
  const scraper = new TEDWebsiteScraper();

  scraper.searchTenders()
    .then(async (tenders) => {
      if (tenders.length > 0) {
        const { stats } = await scraper.saveResults(tenders);

        console.log('📊 SUMMARY:');
        console.log('='.repeat(60));
        console.log(`Total tenders:      ${stats.total}`);
        console.log(`🔴 High priority:   ${stats.highPriority}`);
        console.log(`🟡 Medium priority: ${stats.mediumPriority}`);
        console.log(`⚪ Low priority:    ${stats.lowPriority}`);
        console.log('='.repeat(60) + '\n');

        console.log('🏆 Top 5 Matches:\n');
        tenders.slice(0, 5).forEach((tender, i) => {
          const icon = tender.priorityScore >= 20 ? '🔴' : tender.priorityScore >= 10 ? '🟡' : '⚪';
          console.log(`${i + 1}. ${icon} [Score: ${tender.priorityScore}]`);
          console.log(`   ${tender.title}`);
          console.log(`   ${tender.url}\n`);
        });

        console.log('🎨 View in dashboard: http://127.0.0.1:8080/dashboard.html\n');
      } else {
        console.log('⚠️  No tenders found. This could mean:');
        console.log('   - TED website structure has changed (scraper needs update)');
        console.log('   - No matching tenders in last 30 days');
        console.log('   - Website blocking automated requests');
        console.log('\n💡 Try manual search at: https://ted.europa.eu/en/advanced-search\n');
      }
    })
    .catch(error => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

module.exports = TEDWebsiteScraper;
