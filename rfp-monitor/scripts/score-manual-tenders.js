/**
 * Score Manual Tenders
 * Takes manually collected tender data and scores it using the existing algorithm
 */

const TEDScraper = require('./ted-scraper');
const fs = require('fs').promises;
const path = require('path');

async function scoreManualTenders(inputFile) {
  try {
    console.log('📊 Scoring manually collected tenders...\n');

    // Read input file
    const data = await fs.readFile(inputFile, 'utf-8');
    const tenderData = JSON.parse(data);

    const scraper = new TEDScraper();
    const tenders = tenderData.tenders || [];

    if (tenders.length === 0) {
      console.log('⚠️  No tenders found in input file');
      return;
    }

    console.log(`Found ${tenders.length} tenders to score\n`);

    // Score each tender
    const scoredTenders = tenders.map((tender) => {
      const score = scraper.scoreTender(tender);
      return {
        ...tender,
        priorityScore: score,
      };
    });

    // Sort by score
    scoredTenders.sort((a, b) => b.priorityScore - a.priorityScore);

    // Calculate statistics
    const stats = {
      total: scoredTenders.length,
      highPriority: scoredTenders.filter((t) => t.priorityScore >= 20).length,
      mediumPriority: scoredTenders.filter((t) => t.priorityScore >= 10 && t.priorityScore < 20).length,
      lowPriority: scoredTenders.filter((t) => t.priorityScore < 10).length,
    };

    // Create output
    const output = {
      timestamp: new Date().toISOString(),
      source: 'manual-collection',
      stats,
      tenders: scoredTenders,
    };

    // Save scored results
    const outputFile = inputFile.replace('.json', '-scored.json');
    await fs.writeFile(outputFile, JSON.stringify(output, null, 2), 'utf-8');

    console.log('✅ Scoring complete!\n');
    console.log('📊 STATISTICS:');
    console.log('='.repeat(60));
    console.log(`Total tenders:      ${stats.total}`);
    console.log(`🔴 High priority:   ${stats.highPriority} (score ≥ 20)`);
    console.log(`🟡 Medium priority: ${stats.mediumPriority} (score 10-19)`);
    console.log(`⚪ Low priority:    ${stats.lowPriority} (score < 10)`);
    console.log('='.repeat(60) + '\n');

    console.log('🏆 TOP MATCHES:\n');
    scoredTenders.slice(0, 5).forEach((tender, i) => {
      const priority = tender.priorityScore >= 20 ? '🔴' : tender.priorityScore >= 10 ? '🟡' : '⚪';
      console.log(`${i + 1}. ${priority} [Score: ${tender.priorityScore}]`);
      console.log(`   ${tender.title}`);
      console.log(`   ${tender.country} | ${tender.buyerName || 'Unknown buyer'}`);
      console.log('');
    });

    console.log(`💾 Saved scored results to: ${outputFile}`);
    console.log('\n🎨 View in dashboard:');
    console.log('   http://127.0.0.1:8080/dashboard.html\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('\nUsage: node scripts/score-manual-tenders.js <input-file.json>\n');
    console.error('Input file format:');
    console.error(JSON.stringify({
      tenders: [
        {
          id: 'TED-12345',
          title: 'Tender title',
          description: 'Description with keywords',
          country: 'DE',
          cpvCodes: ['72000000'],
          publicationDate: '2026-01-09',
          deadline: '2026-02-15',
          buyerName: 'Buyer organization',
          url: 'https://ted.europa.eu/...',
        }
      ]
    }, null, 2));
    process.exit(1);
  }
}

// CLI usage
if (require.main === module) {
  const inputFile = process.argv[2];

  if (!inputFile) {
    console.error('❌ Missing input file\n');
    console.error('Usage: node scripts/score-manual-tenders.js <input-file.json>\n');
    process.exit(1);
  }

  scoreManualTenders(inputFile);
}

module.exports = scoreManualTenders;
