/**
 * TED Official API Scraper - FULL PAGINATION
 * Fetches ALL tenders using pagination
 * REAL DATA ONLY - NO DEMO DATA
 */

const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');
const config = require('../config/monitoring-config');

class TEDAPIScraperFull {
  constructor() {
    this.apiURL = 'https://api.ted.europa.eu/v3/notices/search';
    this.baseURL = 'https://ted.europa.eu';
    this.dataDir = path.join(__dirname, '../data');
  }

  /**
   * Search TED using official API v3 with FULL PAGINATION
   */
  async searchTenders(options = {}) {
    try {
      console.log('🌐 CONNECTING TO TED OFFICIAL API - FULL SCAN');
      console.log('═'.repeat(60));
      console.log('Source: https://api.ted.europa.eu/v3/notices/search');
      console.log('Mode: Real data extraction (NO demo data)');
      console.log('Mode: FETCHING ALL PAGES (pagination enabled)');
      console.log('═'.repeat(60) + '\n');

      // Build expert query
      const query = this.buildExpertQuery(options);
      console.log('🔍 Expert Query:', query);
      console.log('');

      let allTenders = [];
      let pageNumber = 1;
      let nextToken = '';
      let hasMore = true;

      while (hasMore) {
        // API request body
        const requestBody = {
          query: query,
          fields: [
            'publication-number',
            'notice-title',
            'publication-date',
            'classification-cpv',
            'total-value',
            'links'
          ],
          limit: 250,
          paginationMode: 'ITERATION',
          scope: 'ACTIVE',
        };

        // Add pagination token if not first page
        if (nextToken) {
          requestBody.iterationNextToken = nextToken;
        }

        console.log(`📄 Fetching page ${pageNumber}...`);

        // Make API call
        const response = await axios.post(this.apiURL, requestBody, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'User-Agent': 'Formalogix-RFP-Monitor/1.0',
          },
          timeout: 30000,
        });

        const pageCount = response.data.notices?.length || 0;
        console.log(`   ✅ Page ${pageNumber}: ${pageCount} tenders`);

        // Parse results from this page
        const tenders = this.parseTenderResults(response.data);
        allTenders = allTenders.concat(tenders);

        // Check if there are more pages
        if (response.data.iterationNextToken && pageCount > 0) {
          nextToken = response.data.iterationNextToken;
          pageNumber++;

          // Safety limit: max 20 pages (5000 tenders)
          if (pageNumber > 20) {
            console.log('   ⚠️  Reached safety limit (20 pages), stopping');
            hasMore = false;
          }
        } else {
          hasMore = false;
        }

        // Longer delay to avoid rate limiting
        if (hasMore) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }

      console.log(`\n✅ Total extracted: ${allTenders.length} tenders from ${pageNumber} pages\n`);

      // Score and sort tenders
      const scoredTenders = allTenders.map(tender => ({
        ...tender,
        priorityScore: this.scoreTender(tender),
      }));

      scoredTenders.sort((a, b) => b.priorityScore - a.priorityScore);

      return scoredTenders;

    } catch (error) {
      console.error('❌ Error calling TED API:', error.message);

      if (error.response) {
        console.error('Status:', error.response.status);
        if (error.response.status === 429) {
          console.log('\n⚠️  Rate limit hit. Returning data collected so far...\n');
        }
      }

      // Return whatever we collected so far (rate limit doesn't lose data)
      if (allTenders && allTenders.length > 0) {
        console.log(`Partial data: ${allTenders.length} tenders collected before rate limit\n`);

        const scoredTenders = allTenders.map(tender => ({
          ...tender,
          priorityScore: this.scoreTender(tender),
        }));

        scoredTenders.sort((a, b) => b.priorityScore - a.priorityScore);
        return scoredTenders;
      }

      return [];
    }
  }

  /**
   * Build expert query - 90 days (3 months)
   */
  buildExpertQuery(options) {
    const queryParts = [];

    // Date range - 90 days (3 months)
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (options.days || 90));

    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}${month}${day}`;
    };

    queryParts.push(`PD=(${formatDate(startDate)} <> ${formatDate(endDate)})`);

    // Country filter - 3-letter ISO codes
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

    const query = queryParts.join(' AND ');
    return query;
  }

  /**
   * Parse API response
   */
  parseTenderResults(data) {
    const tenders = [];

    if (!data || !data.notices || !Array.isArray(data.notices)) {
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
   * Extract tender information
   */
  extractTenderInfo(notice) {
    const pubNumber = notice['publication-number'] || notice.ND || '';

    let url = 'https://ted.europa.eu';

    if (notice.links && Array.isArray(notice.links) && notice.links.length > 0) {
      url = notice.links[0];
    } else if (pubNumber) {
      url = `https://ted.europa.eu/en/notice/-/detail/${pubNumber}`;
    }

    // Extract title
    const titleField = notice['notice-title'] || notice.TI || {};
    let title = 'No title';
    if (typeof titleField === 'string') {
      title = titleField;
    } else if (typeof titleField === 'object') {
      title = titleField.deu || titleField.eng || titleField.fra ||
              Object.values(titleField)[0] || 'No title';
    }

    return {
      id: pubNumber,
      title: title,
      description: title,
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
   * Extract CPV codes
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
   * Score tender
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
      const filepath = filename || path.join(this.dataDir, `full-scan-${dateStr}.json`);

      const stats = {
        total: tenders.length,
        highPriority: tenders.filter(t => t.priorityScore >= 20).length,
        mediumPriority: tenders.filter(t => t.priorityScore >= 10 && t.priorityScore < 20).length,
        lowPriority: tenders.filter(t => t.priorityScore < 10).length,
      };

      const output = {
        timestamp: new Date().toISOString(),
        source: 'ted-api-v3-full',
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
  const scraper = new TEDAPIScraperFull();

  scraper.searchTenders()
    .then(async (tenders) => {
      if (tenders.length > 0) {
        const { stats } = await scraper.saveResults(tenders);

        console.log('='.repeat(60));
        console.log('📊 FULL SCAN RESULTS');
        console.log('='.repeat(60));
        console.log(`Total tenders:      ${stats.total}`);
        console.log(`🔴 High priority:   ${stats.highPriority} (score ≥ 20)`);
        console.log(`🟡 Medium priority: ${stats.mediumPriority} (score 10-19)`);
        console.log(`⚪ Low priority:    ${stats.lowPriority} (score < 10)`);
        console.log('='.repeat(60) + '\n');

        console.log('✅ Full scan complete!');
        console.log('   Run: npm run show-relevant');
        console.log('   To filter for form digitization tenders\n');
      } else {
        console.log('⚠️  No tenders found.');
      }
    })
    .catch(error => {
      console.error('\n❌ Fatal error:', error.message);
      process.exit(1);
    });
}

module.exports = TEDAPIScraperFull;
