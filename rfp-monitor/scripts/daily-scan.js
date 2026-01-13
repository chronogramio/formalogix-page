/**
 * Daily Scan Script
 * Orchestrates the daily tender monitoring process
 */

const TEDScraper = require('./ted-scraper');
const fs = require('fs').promises;
const path = require('path');
const config = require('../config/monitoring-config');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

class DailyScan {
  constructor() {
    this.tedScraper = new TEDScraper();
    this.emailNotifier = null; // Only initialize if email is enabled
    this.dataDir = path.join(__dirname, '../data');
    this.logFile = path.join(__dirname, '../logs', 'scan-history.json');

    // Load email notifier only if enabled
    if (config.notifications.enabled) {
      const EmailNotifier = require('./email-notifier');
      this.emailNotifier = new EmailNotifier();
    }
  }

  /**
   * Run the daily scan
   */
  async run() {
    console.log('🚀 Starting daily RFP/RFI scan...');
    console.log(`📅 ${new Date().toLocaleString('de-DE')}\n`);

    const results = {
      timestamp: new Date().toISOString(),
      tenders: [],
      stats: {
        total: 0,
        highPriority: 0,
        mediumPriority: 0,
        lowPriority: 0,
      },
    };

    try {
      // 1. Scan TED
      console.log('1️⃣  Scanning TED (Tenders Electronic Daily)...');
      const tedTenders = await this.tedScraper.searchTenders();
      results.tenders.push(...tedTenders);

      // 2. Filter and deduplicate
      results.tenders = this.deduplicateTenders(results.tenders);

      // 3. Calculate statistics
      results.stats.total = results.tenders.length;
      results.tenders.forEach((tender) => {
        if (tender.priorityScore >= 20) results.stats.highPriority++;
        else if (tender.priorityScore >= 10) results.stats.mediumPriority++;
        else results.stats.lowPriority++;
      });

      // 4. Save results
      await this.saveResults(results);

      // 5. Send notifications
      await this.sendNotifications(results.tenders);

      // 6. Log scan history
      await this.logScanHistory(results.stats);

      // 7. Summary
      this.printSummary(results);

      console.log('\n✅ Daily scan completed successfully!');
    } catch (error) {
      console.error('❌ Error during daily scan:', error.message);
      console.error(error.stack);
    }
  }

  /**
   * Remove duplicate tenders based on ID
   */
  deduplicateTenders(tenders) {
    const seen = new Set();
    return tenders.filter((tender) => {
      if (seen.has(tender.id)) {
        return false;
      }
      seen.add(tender.id);
      return true;
    });
  }

  /**
   * Save scan results to file
   */
  async saveResults(results) {
    try {
      await fs.mkdir(this.dataDir, { recursive: true });

      const dateStr = new Date().toISOString().split('T')[0];
      const filepath = path.join(this.dataDir, `scan-${dateStr}.json`);

      await fs.writeFile(filepath, JSON.stringify(results, null, 2), 'utf-8');
      console.log(`\n💾 Results saved to: ${filepath}`);
    } catch (error) {
      console.error('Error saving results:', error.message);
    }
  }

  /**
   * Send email notifications
   */
  async sendNotifications(tenders) {
    if (!config.notifications.enabled) {
      console.log('\n📧 Email notifications are disabled');
      return;
    }

    console.log('\n📧 Sending notifications...');

    // Send immediate alerts for high-priority tenders
    if (config.notifications.immediateAlerts) {
      const highPriorityTenders = tenders.filter((t) => t.priorityScore >= 20);

      for (const tender of highPriorityTenders) {
        await this.emailNotifier.sendImmediateAlert(tender);
        // Add delay to avoid spam filters
        await this.sleep(2000);
      }
    }

    // Send daily digest
    if (config.notifications.dailyDigest && tenders.length > 0) {
      await this.emailNotifier.sendDailyDigest(tenders);
    }
  }

  /**
   * Log scan history
   */
  async logScanHistory(stats) {
    try {
      const logDir = path.dirname(this.logFile);
      await fs.mkdir(logDir, { recursive: true });

      let history = [];
      try {
        const data = await fs.readFile(this.logFile, 'utf-8');
        history = JSON.parse(data);
      } catch (error) {
        // File doesn't exist yet, start fresh
      }

      history.push({
        date: new Date().toISOString().split('T')[0],
        timestamp: new Date().toISOString(),
        ...stats,
      });

      // Keep only last 90 days
      history = history.slice(-90);

      await fs.writeFile(this.logFile, JSON.stringify(history, null, 2), 'utf-8');
    } catch (error) {
      console.error('Error logging scan history:', error.message);
    }
  }

  /**
   * Print summary to console
   */
  printSummary(results) {
    console.log('\n' + '='.repeat(60));
    console.log('📊 SCAN SUMMARY');
    console.log('='.repeat(60));
    console.log(`Total tenders found: ${results.stats.total}`);
    console.log(`  🔴 High priority:   ${results.stats.highPriority}`);
    console.log(`  🟡 Medium priority: ${results.stats.mediumPriority}`);
    console.log(`  ⚪ Low priority:    ${results.stats.lowPriority}`);
    console.log('='.repeat(60));

    if (results.tenders.length > 0) {
      console.log('\n🏆 Top 5 Matches:');
      results.tenders.slice(0, 5).forEach((tender, i) => {
        console.log(`\n${i + 1}. ${tender.title}`);
        console.log(`   Score: ${tender.priorityScore} | ${tender.country} | ${tender.buyerName}`);
        console.log(`   ${tender.url}`);
      });
    }
  }

  /**
   * Sleep helper
   */
  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Run if called directly
if (require.main === module) {
  const scanner = new DailyScan();
  scanner.run().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = DailyScan;
