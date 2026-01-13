/**
 * TED (Tenders Electronic Daily) Scraper
 * Monitors EU public procurement notices for relevant opportunities
 */

const axios = require('axios');
const xml2js = require('xml2js');
const fs = require('fs').promises;
const path = require('path');
const config = require('../config/monitoring-config');

class TEDScraper {
  constructor() {
    this.baseURL = 'https://ted.europa.eu';
    this.searchURL = `${this.baseURL}/api/v3.0/notices/search`;
    this.dataDir = path.join(__dirname, '../data');
    this.logDir = path.join(__dirname, '../logs');
  }

  /**
   * Search TED for relevant tenders
   */
  async searchTenders(searchParams = {}) {
    try {
      console.log('🔍 Searching TED for relevant tenders...');

      // Build search query
      const query = this.buildSearchQuery(searchParams);
      console.log('Search query:', query);

      // Note: TED's actual API endpoint may require authentication
      // This is a template - you may need to adjust based on TED's current API
      const response = await axios.get(this.searchURL, {
        params: query,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Formalogix-RFP-Monitor/1.0',
        },
        timeout: 30000,
      });

      const tenders = this.parseTenderResults(response.data);
      console.log(`✅ Found ${tenders.length} potentially relevant tenders`);

      return tenders;
    } catch (error) {
      if (error.response) {
        console.error('❌ TED API Error:', error.response.status, error.response.statusText);
        console.error('Response data:', error.response.data);
      } else if (error.request) {
        console.error('❌ No response from TED API');
      } else {
        console.error('❌ Error setting up TED request:', error.message);
      }
      return [];
    }
  }

  /**
   * Build search query from keywords and CPV codes
   */
  buildSearchQuery(params) {
    const query = {
      q: '', // Main search query
      scope: 3, // EU-wide notices
      reverseOrder: false,
      pageSize: 100,
      pageNum: 1,
    };

    // Add keywords
    const keywords = [
      ...config.keywordsEN,
      ...config.keywordsDE,
    ];

    // Combine keywords with OR operator
    query.q = keywords.slice(0, 5).join(' OR '); // Limit to avoid too long query

    // Add CPV codes filter
    if (config.cpvCodes.length > 0) {
      query.cpvCode = config.cpvCodes.join(',');
    }

    // Add country filter
    if (config.targetCountries.length > 0) {
      query.country = config.targetCountries.join(',');
    }

    // Date filter - last 7 days
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    query.publicationDateFrom = lastWeek.toISOString().split('T')[0];

    return query;
  }

  /**
   * Alternative: Download daily TED XML package via FTP
   * More reliable than API for bulk downloads
   */
  async downloadDailyPackage() {
    console.log('📦 TED FTP download is available at: ftp://ted.europa.eu');
    console.log('Credentials: guest/guest');
    console.log('Daily packages location: /daily-packages/');
    console.log('');
    console.log('To automate FTP downloads, consider using node-ftp or wget:');
    console.log('wget --user=guest --password=guest ftp://ted.europa.eu/daily-packages/latest.tar.gz');

    // For now, this is a manual process
    // In production, you could use 'basic-ftp' npm package to automate this
  }

  /**
   * Parse and filter tender results
   */
  parseTenderResults(data) {
    const tenders = [];

    // This structure depends on TED API response format
    // Adjust based on actual API response
    const results = data.results || data.notices || [];

    results.forEach((tender) => {
      const parsed = this.extractTenderInfo(tender);
      const score = this.scoreTender(parsed);

      if (score > 0) {
        tenders.push({
          ...parsed,
          priorityScore: score,
        });
      }
    });

    // Sort by priority score
    tenders.sort((a, b) => b.priorityScore - a.priorityScore);

    return tenders;
  }

  /**
   * Extract relevant information from tender notice
   */
  extractTenderInfo(tender) {
    return {
      id: tender.id || tender.noticeId || 'unknown',
      title: tender.title || tender.TI || 'No title',
      description: tender.description || tender.AC || '',
      country: tender.country || tender.CY || '',
      cpvCodes: tender.cpvCodes || tender.CPV || [],
      publicationDate: tender.publicationDate || tender.PD || '',
      deadline: tender.deadline || tender.DD || '',
      contractValue: tender.contractValue || tender.VAL || null,
      buyerName: tender.buyerName || tender.ON || '',
      url: tender.url || `https://ted.europa.eu/udl?uri=TED:NOTICE:${tender.id}`,
      rawData: tender,
    };
  }

  /**
   * Score tender based on relevance to Formalogix services
   */
  scoreTender(tender) {
    let score = 0;

    const text = `${tender.title} ${tender.description}`.toLowerCase();

    // High priority keywords
    config.priorityKeywords.high.forEach((keyword) => {
      if (text.includes(keyword.toLowerCase())) {
        score += 10;
      }
    });

    // Medium priority keywords
    config.priorityKeywords.medium.forEach((keyword) => {
      if (text.includes(keyword.toLowerCase())) {
        score += 5;
      }
    });

    // Target country bonus
    if (config.targetCountries.includes(tender.country)) {
      score += 5;
    }

    // CPV code match bonus
    const matchingCPV = tender.cpvCodes.some((code) =>
      config.cpvCodes.some((targetCode) => code.startsWith(targetCode.substring(0, 4)))
    );
    if (matchingCPV) {
      score += 8;
    }

    return score;
  }

  /**
   * Save tender results to file
   */
  async saveTenders(tenders, filename = null) {
    try {
      await fs.mkdir(this.dataDir, { recursive: true });

      const dateStr = new Date().toISOString().split('T')[0];
      const filepath = filename || path.join(this.dataDir, `tenders-${dateStr}.json`);

      await fs.writeFile(filepath, JSON.stringify(tenders, null, 2), 'utf-8');
      console.log(`💾 Saved ${tenders.length} tenders to ${filepath}`);

      return filepath;
    } catch (error) {
      console.error('❌ Error saving tenders:', error.message);
    }
  }

  /**
   * Load previously saved tenders
   */
  async loadTenders(filename) {
    try {
      const data = await fs.readFile(filename, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('❌ Error loading tenders:', error.message);
      return [];
    }
  }
}

// CLI usage
if (require.main === module) {
  const scraper = new TEDScraper();

  scraper
    .searchTenders()
    .then((tenders) => {
      if (tenders.length > 0) {
        scraper.saveTenders(tenders);
        console.log('\n📊 Top 5 matches:');
        tenders.slice(0, 5).forEach((tender, i) => {
          console.log(`${i + 1}. [Score: ${tender.priorityScore}] ${tender.title}`);
          console.log(`   Country: ${tender.country} | Deadline: ${tender.deadline}`);
          console.log(`   URL: ${tender.url}\n`);
        });
      } else {
        console.log('⚠️  No matching tenders found');
        console.log('\n💡 Tip: TED API may require authentication or have rate limits.');
        console.log('Consider using the FTP download option for bulk data:');
        scraper.downloadDailyPackage();
      }
    })
    .catch((error) => {
      console.error('Fatal error:', error);
    });
}

module.exports = TEDScraper;
