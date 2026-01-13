/**
 * Filter and display only relevant tenders for Formalogix
 * Shows tenders matching form digitization, OCR, handwriting, document processing
 */

const fs = require('fs');
const path = require('path');

// Load latest data
const dataDir = path.join(__dirname, '../data');
const files = fs.readdirSync(dataDir)
  .filter(f => (f.startsWith('automated-scan-') || f.startsWith('full-scan-')) && f.endsWith('.json'))
  .sort()
  .reverse();

if (files.length === 0) {
  console.log('❌ No data files found. Run: npm run scrape-api or npm run scrape-full');
  process.exit(1);
}

const latestFile = path.join(dataDir, files[0]);
const data = JSON.parse(fs.readFileSync(latestFile, 'utf-8'));

console.log('📊 FILTERING FOR FORMALOGIX RELEVANT TENDERS');
console.log('═'.repeat(70));
console.log(`Source: ${latestFile}`);
console.log(`Total tenders: ${data.tenders.length}`);
console.log('═'.repeat(70) + '\n');

// Enhanced keywords for form digitization
const highPriorityKeywords = [
  'formular',
  'formulare',
  'digitalisierung',
  'digitization',
  'ocr',
  'handschrift',
  'handwriting',
  'scanning',
  'scan',
  'erfassung',
  'capture',
  'texterkennung',
  'recognition'
];

const mediumPriorityKeywords = [
  'dokument',
  'document',
  'verarbeitung',
  'processing',
  'papier',
  'paper',
  'daten',
  'data',
  'eingabe',
  'input',
  'archiv',
  'archive'
];

// Re-score tenders with enhanced algorithm
const scoredTenders = data.tenders.map(tender => {
  let score = tender.priorityScore || 0; // Keep original score

  const text = `${tender.title} ${tender.description}`.toLowerCase();

  // High priority keywords (+15 each)
  highPriorityKeywords.forEach(keyword => {
    if (text.includes(keyword.toLowerCase())) {
      score += 15;
    }
  });

  // Medium priority keywords (+8 each)
  mediumPriorityKeywords.forEach(keyword => {
    if (text.includes(keyword.toLowerCase())) {
      score += 8;
    }
  });

  return {
    ...tender,
    enhancedScore: score
  };
});

// Sort by enhanced score
scoredTenders.sort((a, b) => b.enhancedScore - a.enhancedScore);

// Filter: show tenders with enhanced score >= 20
const relevantTenders = scoredTenders.filter(t => t.enhancedScore >= 20);

console.log(`✅ Found ${relevantTenders.length} relevant tenders (score ≥ 20)\n`);

if (relevantTenders.length === 0) {
  console.log('⚠️  No highly relevant tenders found.');
  console.log('');
  console.log('Showing top 10 by score instead:\n');

  scoredTenders.slice(0, 10).forEach((tender, i) => {
    const icon = tender.enhancedScore >= 30 ? '🔴' : tender.enhancedScore >= 20 ? '🟡' : '⚪';
    console.log(`${i + 1}. ${icon} [Score: ${tender.enhancedScore}]`);
    console.log(`   ${tender.title}`);
    console.log(`   ${tender.country} | Published: ${tender.publicationDate}`);
    console.log(`   ${tender.url}\n`);
  });
} else {
  relevantTenders.forEach((tender, i) => {
    const icon = tender.enhancedScore >= 40 ? '🔴' : tender.enhancedScore >= 30 ? '🟠' : '🟡';
    console.log(`${i + 1}. ${icon} [Score: ${tender.enhancedScore}]`);
    console.log(`   ${tender.title}`);
    console.log(`   ${tender.country} | Published: ${tender.publicationDate}`);
    if (tender.contractValue) {
      console.log(`   Value: ${tender.contractValue} ${tender.currency || ''}`);
    }
    console.log(`   ${tender.url}\n`);
  });
}

console.log('═'.repeat(70));
console.log('💡 Tips:');
console.log('   • Expand date range: Edit scripts/ted-api-scraper.js line 103 (days)');
console.log('   • Run more often: Daily scans catch more opportunities');
console.log('   • View dashboard: http://127.0.0.1:8080/dashboard.html');
console.log('═'.repeat(70));
