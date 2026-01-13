/**
 * Test Script with Sample Data
 * Tests the system without requiring TED API access or email configuration
 */

const TEDScraper = require('./ted-scraper');
const fs = require('fs').promises;
const path = require('path');

// Sample tender data matching Formalogix services
const sampleTenders = [
  {
    id: 'SAMPLE-2026-001',
    title: 'Digitalisierung und OCR-Verarbeitung von Versicherungsformularen',
    description: 'Gesucht wird ein Dienstleister für die Digitalisierung von handschriftlichen Versicherungsformularen mit OCR-Technologie. Jahresvolumen ca. 50.000 Formulare. Anforderung: 99%+ Genauigkeit.',
    country: 'DE',
    cpvCodes: ['72000000', '72260000'],
    publicationDate: '2026-01-08',
    deadline: '2026-02-15',
    contractValue: 150000,
    buyerName: 'Bundesversicherungsamt',
    url: 'https://ted.europa.eu/udl?uri=TED:NOTICE:SAMPLE-001',
    rawData: {},
  },
  {
    id: 'SAMPLE-2026-002',
    title: 'Dokumentenmanagement-System für Krankenhaus',
    description: 'Implementierung eines Dokumentenmanagement-Systems inklusive Scanning-Service und automatischer Datenextraktion aus Patientenformularen.',
    country: 'AT',
    cpvCodes: ['72000000', '48000000'],
    publicationDate: '2026-01-07',
    deadline: '2026-02-20',
    contractValue: 250000,
    buyerName: 'Allgemeines Krankenhaus Wien',
    url: 'https://ted.europa.eu/udl?uri=TED:NOTICE:SAMPLE-002',
    rawData: {},
  },
  {
    id: 'SAMPLE-2026-003',
    title: 'Form Processing Software for Educational Institution',
    description: 'University seeks software solution for processing handwritten exam papers and student application forms. Requirements include OCR, data extraction, and validation.',
    country: 'CH',
    cpvCodes: ['72260000', '48700000'],
    publicationDate: '2026-01-06',
    deadline: '2026-02-28',
    contractValue: 180000,
    buyerName: 'ETH Zürich',
    url: 'https://ted.europa.eu/udl?uri=TED:NOTICE:SAMPLE-003',
    rawData: {},
  },
  {
    id: 'SAMPLE-2026-004',
    title: 'Archivdigitalisierung mit Handschrifterkennung',
    description: 'Digitalisierung historischer Dokumente und Formulare. Erforderlich ist eine Lösung zur Erkennung von Handschrift (Sütterlin und moderne Schrift) und Extraktion strukturierter Daten.',
    country: 'DE',
    cpvCodes: ['79999100', '72000000'],
    publicationDate: '2026-01-05',
    deadline: '2026-03-15',
    contractValue: 85000,
    buyerName: 'Stadtarchiv München',
    url: 'https://ted.europa.eu/udl?uri=TED:NOTICE:SAMPLE-004',
    rawData: {},
  },
  {
    id: 'SAMPLE-2026-005',
    title: 'IT-Dienstleistungen - Webportal Entwicklung',
    description: 'Entwicklung eines Webportals für die öffentliche Verwaltung. Keine spezifischen Anforderungen an Formularverarbeitung oder OCR.',
    country: 'DE',
    cpvCodes: ['72000000'],
    publicationDate: '2026-01-04',
    deadline: '2026-02-10',
    contractValue: 120000,
    buyerName: 'Landratsamt Stuttgart',
    url: 'https://ted.europa.eu/udl?uri=TED:NOTICE:SAMPLE-005',
    rawData: {},
  },
];

class TestRunner {
  constructor() {
    this.scraper = new TEDScraper();
    this.dataDir = path.join(__dirname, '../data');
  }

  async run() {
    console.log('🧪 Running RFP Monitor Test with Sample Data\n');
    console.log('='.repeat(60));
    console.log('This test simulates finding tenders without requiring:');
    console.log('  - TED API access');
    console.log('  - Email configuration');
    console.log('  - Internet connection');
    console.log('='.repeat(60) + '\n');

    // Score the sample tenders
    console.log('1️⃣  Scoring sample tenders...\n');

    const scoredTenders = sampleTenders.map((tender) => {
      const score = this.scraper.scoreTender(tender);
      return {
        ...tender,
        priorityScore: score,
      };
    });

    // Sort by score
    scoredTenders.sort((a, b) => b.priorityScore - a.priorityScore);

    // Display results
    console.log('📊 RESULTS:\n');

    let stats = {
      total: scoredTenders.length,
      highPriority: 0,
      mediumPriority: 0,
      lowPriority: 0,
    };

    scoredTenders.forEach((tender, index) => {
      const priority = this.getPriorityLevel(tender.priorityScore);
      const priorityLabel = this.getPriorityLabel(priority);
      const priorityIcon = this.getPriorityIcon(priority);

      if (priority === 'high') stats.highPriority++;
      else if (priority === 'medium') stats.mediumPriority++;
      else stats.lowPriority++;

      console.log(`${index + 1}. ${priorityIcon} [${priorityLabel}] Score: ${tender.priorityScore}`);
      console.log(`   ${tender.title}`);
      console.log(`   🏢 ${tender.buyerName} | 🌍 ${tender.country} | 💰 €${tender.contractValue?.toLocaleString()}`);
      console.log(`   📅 Deadline: ${tender.deadline}`);
      console.log(`   🔗 ${tender.url}`);
      console.log('');
    });

    // Summary statistics
    console.log('='.repeat(60));
    console.log('📈 STATISTICS:');
    console.log('='.repeat(60));
    console.log(`Total tenders:      ${stats.total}`);
    console.log(`🔴 High priority:   ${stats.highPriority} (score ≥ 20)`);
    console.log(`🟡 Medium priority: ${stats.mediumPriority} (score 10-19)`);
    console.log(`⚪ Low priority:    ${stats.lowPriority} (score < 10)`);
    console.log('='.repeat(60) + '\n');

    // Explain scoring
    console.log('💡 SCORING EXPLANATION:\n');
    console.log('High priority keywords (+10 each): form, handwriting, OCR, digitization');
    console.log('Medium priority (+5 each): document, processing, automation');
    console.log('Target country match (+5): DE, AT, CH, LI');
    console.log('CPV code match (+8): IT services, digitization codes');
    console.log('');

    // Save results
    await this.saveTestResults({
      timestamp: new Date().toISOString(),
      stats,
      tenders: scoredTenders,
    });

    // Show what would happen with email
    console.log('📧 EMAIL NOTIFICATION STATUS:\n');
    console.log('✅ Email notifications are currently DISABLED');
    console.log('   (configured in config/monitoring-config.js)');
    console.log('');
    console.log('When enabled, you would receive:');
    console.log(`  - ${stats.highPriority} immediate alert(s) for high-priority tenders`);
    console.log(`  - 1 daily digest email with all ${stats.total} tenders`);
    console.log('');

    // Dashboard info
    console.log('🎨 VIEWING RESULTS:\n');
    console.log('Results saved to: data/test-results.json');
    console.log('');
    console.log('To view in dashboard:');
    console.log('  1. Open dashboard.html in your browser');
    console.log('  2. Results will display automatically');
    console.log('');
    console.log('Or start a local server:');
    console.log('  npx http-server . -p 8080');
    console.log('  Then open: http://localhost:8080/dashboard.html');
    console.log('');

    console.log('✅ Test completed successfully!\n');
  }

  getPriorityLevel(score) {
    if (score >= 20) return 'high';
    if (score >= 10) return 'medium';
    return 'low';
  }

  getPriorityLabel(level) {
    const labels = {
      high: 'HIGH PRIORITY',
      medium: 'MEDIUM',
      low: 'LOW',
    };
    return labels[level];
  }

  getPriorityIcon(level) {
    const icons = {
      high: '🔴',
      medium: '🟡',
      low: '⚪',
    };
    return icons[level];
  }

  async saveTestResults(results) {
    try {
      await fs.mkdir(this.dataDir, { recursive: true });
      const filepath = path.join(this.dataDir, 'test-results.json');
      await fs.writeFile(filepath, JSON.stringify(results, null, 2), 'utf-8');
      console.log(`💾 Test results saved to: ${filepath}\n`);
    } catch (error) {
      console.error('Error saving test results:', error.message);
    }
  }
}

// Run test
if (require.main === module) {
  const runner = new TestRunner();
  runner.run().catch((error) => {
    console.error('Test failed:', error);
    process.exit(1);
  });
}

module.exports = TestRunner;
