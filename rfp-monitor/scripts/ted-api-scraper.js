/**
 * TED Official API Scraper
 * Uses the official TED Search API v3 with proper query syntax
 * REAL DATA ONLY - NO DEMO DATA
 */

const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');
const config = require('../config/monitoring-config');

class TEDAPIScraper {
  constructor() {
    this.apiURL = 'https://api.ted.europa.eu/v3/notices/search';
    this.baseURL = 'https://ted.europa.eu';
    this.dataDir = path.join(__dirname, '../data');
  }

  /**
   * Search TED using official API v3
   */
  async searchTenders(options = {}) {
    try {
      console.log('🌐 CONNECTING TO TED OFFICIAL API');
      console.log('═'.repeat(60));
      console.log('Source: https://api.ted.europa.eu/v3/notices/search');
      console.log('Mode: Real data extraction (NO demo data)');
      console.log('═'.repeat(60) + '\n');

      // Build expert query
      const query = this.buildExpertQuery(options);
      console.log('🔍 Expert Query:', query);
      console.log('');

      // API request body - using only confirmed supported fields
      const requestBody = {
        query: query,
        fields: [
          'publication-number',  // ND - notice document ID
          'notice-title',        // Title
          'publication-date',    // PD - publication date
          'classification-cpv',  // PC - CPV codes
          'total-value',         // TV - total value
          'links'                // Direct URLs to notice
        ],
        limit: 250, // Max per request
        paginationMode: 'ITERATION',
        scope: 'ACTIVE',
      };

      console.log('1️⃣  Sending API request...\n');

      // Make API call
      const response = await axios.post(this.apiURL, requestBody, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'User-Agent': 'Formalogix-RFP-Monitor/1.0',
        },
        timeout: 30000,
      });

      console.log(`✅ API Response: ${response.status} ${response.statusText}`);
      console.log(`📊 Total results: ${response.data.total || 0}`);
      console.log('');

      // Parse results
      const tenders = this.parseTenderResults(response.data);

      console.log(`✅ Extracted ${tenders.length} tenders\n`);

      // Score and sort tenders
      const scoredTenders = tenders.map(tender => ({
        ...tender,
        priorityScore: this.scoreTender(tender),
      }));

      scoredTenders.sort((a, b) => b.priorityScore - a.priorityScore);

      return scoredTenders;

    } catch (error) {
      console.error('❌ Error calling TED API:', error.message);

      if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Response:', JSON.stringify(error.response.data, null, 2));
      }

      return [];
    }
  }

  /**
   * Build expert query using TED query syntax
   */
  buildExpertQuery(options) {
    const queryParts = [];

    // Date range - last 180 days by default (6 months for better coverage)
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (options.days || 180));

    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}${month}${day}`;
    };

    queryParts.push(`PD=(${formatDate(startDate)} <> ${formatDate(endDate)})`);

    // Country filter - use buyer-country field (CY)
    // TED API uses 3-letter ISO codes (DEU not DE)
    if (config.targetCountries && config.targetCountries.length > 0) {
      const countryMap = {
        'DE': 'DEU',
        'AT': 'AUT',
        'CH': 'CHE',
        'LI': 'LIE'
      };

      const apiCountries = config.targetCountries.map(c => countryMap[c] || c);
      queryParts.push(`CY IN (${apiCountries.join(' ')})`);
    }

    // Keyword filtering - DISABLED for now due to API complexity
    // TED API free-text search syntax needs more research
    // For now, we filter client-side using scoring algorithm
    //
    // To enable later: research TED API FT (free-text) field syntax
    if (false) {
      // Disabled
    }

    // Combine with AND
    const query = queryParts.join(' AND ');

    return query;
  }

  /**
   * Parse API response and extract tender information
   */
  parseTenderResults(data) {
    const tenders = [];

    if (!data || !data.notices || !Array.isArray(data.notices)) {
      console.log('⚠️  No notices found in API response');
      return tenders;
    }

    data.notices.forEach((notice) => {
      try {
        const tender = this.extractTenderInfo(notice);
        tenders.push(tender);
      } catch (error) {
        console.error('Error extracting tender:', error.message);
      }
    });

    return tenders;
  }

  /**
   * Extract tender information from API notice
   */
  extractTenderInfo(notice) {
    // Get publication number for URL
    const pubNumber = notice['publication-number'] || notice.ND || '';

    // Build real TED URL using correct format
    // Format: https://ted.europa.eu/{lang}/notice/-/detail/{publication-number}
    let url = 'https://ted.europa.eu';

    // Check if API provided direct links
    if (notice.links && Array.isArray(notice.links) && notice.links.length > 0) {
      // Use the first available link (usually English detail view)
      url = notice.links[0];
    } else if (pubNumber) {
      // Construct URL manually using correct format
      url = `https://ted.europa.eu/en/notice/-/detail/${pubNumber}`;
    }

    // Extract title - handle multi-language object
    const titleField = notice['notice-title'] || notice.TI || {};
    let title = 'No title';
    if (typeof titleField === 'string') {
      title = titleField;
    } else if (typeof titleField === 'object') {
      // Prefer German, then English, then any available language
      title = titleField.deu || titleField.eng || titleField.fra ||
              Object.values(titleField)[0] || 'No title';
    }

    return {
      id: pubNumber,
      title: title,
      description: title, // Use title as description for now
      country: notice['buyer-country'] || notice.CY || 'Unknown',
      buyerName: notice['buyer-name'] || notice.ON || 'Unknown',
      publicationDate: notice['publication-date'] || notice.PD || '',
      deadline: notice['deadline-receipt-tenders'] || notice.DD || null,
      cpvCodes: this.extractCPVCodes(notice),
      contractValue: notice['total-value'] || notice.VAL || null,
      currency: notice['total-value-cur'] || notice.CUR || null,
      url: url,
      noticeType: notice['notice-classification'] || notice.NC || '',
    };
  }

  /**
   * Extract CPV codes from notice
   */
  extractCPVCodes(notice) {
    const cpvField = notice['classification-cpv'] || notice.CPV || [];

    if (Array.isArray(cpvField)) {
      return cpvField;
    }

    if (typeof cpvField === 'string') {
      return cpvField.split(',').map(c => c.trim());
    }

    return [];
  }

  /**
   * Score tender based on relevance to Formalogix services
   */
  scoreTender(tender) {
    let score = 0;

    const text = `${tender.title} ${tender.description}`.toLowerCase();

    // High priority keywords (+10 each)
    config.priorityKeywords.high.forEach((keyword) => {
      if (text.includes(keyword.toLowerCase())) {
        score += 10;
      }
    });

    // Medium priority keywords (+5 each)
    config.priorityKeywords.medium.forEach((keyword) => {
      if (text.includes(keyword.toLowerCase())) {
        score += 5;
      }
    });

    // Target country bonus (+5)
    if (config.targetCountries.includes(tender.country)) {
      score += 5;
    }

    // CPV code match bonus (+8)
    const matchingCPV = tender.cpvCodes.some((code) =>
      config.cpvCodes.some((targetCode) =>
        code.startsWith(targetCode.substring(0, 4))
      )
    );
    if (matchingCPV) {
      score += 8;
    }

    return score;
  }

  /**
   * Save results
   */
  async saveResults(tenders, filename = null) {
    try {
      await fs.mkdir(this.dataDir, { recursive: true });

      const dateStr = new Date().toISOString().split('T')[0];
      const filepath = filename || path.join(this.dataDir, `automated-scan-${dateStr}.json`);

      const stats = {
        total: tenders.length,
        highPriority: tenders.filter(t => t.priorityScore >= 20).length,
        mediumPriority: tenders.filter(t => t.priorityScore >= 10 && t.priorityScore < 20).length,
        lowPriority: tenders.filter(t => t.priorityScore < 10).length,
      };

      const output = {
        timestamp: new Date().toISOString(),
        source: 'ted-api-v3',
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
  const scraper = new TEDAPIScraper();

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
            console.log(`   ${tender.title}`);
            console.log(`   ${tender.country} | ${tender.buyerName}`);
            console.log(`   ${tender.url}\n`);
          });
        }

        console.log('🎨 View in dashboard:');
        console.log('   http://127.0.0.1:8080/dashboard.html\n');
        console.log('✅ Real data fetched successfully from TED API!\n');
      } else {
        console.log('⚠️  No tenders found.');
        console.log('   This means TED returned 0 results for the search criteria.');
        console.log('   Try:');
        console.log('   - Broadening date range (edit script to change days)');
        console.log('   - Adjusting CPV codes in config/monitoring-config.js');
        console.log('   - Checking if TED API is accessible\n');
      }
    })
    .catch(error => {
      console.error('\n❌ Fatal error:', error.message);
      process.exit(1);
    });
}

module.exports = TEDAPIScraper;
