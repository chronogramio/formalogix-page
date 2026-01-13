/**
 * Automated Scheduler
 * Runs daily scans at configured time using node-cron
 */

const cron = require('node-cron');
const DailyScan = require('./daily-scan');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const config = require('../config/monitoring-config');

class Scheduler {
  constructor() {
    this.scanner = new DailyScan();
    this.scanTime = process.env.SCAN_TIME || config.scanning.dailyScanTime || '09:00';
  }

  /**
   * Start the automated scheduler
   */
  start() {
    console.log('🤖 RFP Monitor Scheduler Started');
    console.log(`⏰ Daily scans scheduled at: ${this.scanTime} CET`);
    console.log('Press Ctrl+C to stop\n');

    // Parse time (format: HH:MM)
    const [hour, minute] = this.scanTime.split(':');

    // Schedule daily scan
    // Cron format: minute hour day month weekday
    const cronExpression = `${minute} ${hour} * * *`;

    const task = cron.schedule(cronExpression, () => {
      console.log('\n' + '='.repeat(60));
      console.log(`🔔 Scheduled scan triggered at ${new Date().toLocaleString('de-DE')}`);
      console.log('='.repeat(60) + '\n');

      this.scanner.run().catch((error) => {
        console.error('❌ Scheduled scan failed:', error.message);
      });
    });

    // Optionally run immediately on startup
    if (process.argv.includes('--now')) {
      console.log('▶️  Running immediate scan...\n');
      this.scanner.run();
    }

    // Keep process alive
    process.on('SIGINT', () => {
      console.log('\n\n👋 Stopping scheduler...');
      task.stop();
      process.exit(0);
    });
  }

  /**
   * Run scan immediately
   */
  async runNow() {
    console.log('▶️  Running immediate scan...\n');
    await this.scanner.run();
  }
}

// CLI usage
if (require.main === module) {
  const scheduler = new Scheduler();

  if (process.argv.includes('--run-now')) {
    scheduler.runNow().then(() => process.exit(0));
  } else {
    scheduler.start();
  }
}

module.exports = Scheduler;
