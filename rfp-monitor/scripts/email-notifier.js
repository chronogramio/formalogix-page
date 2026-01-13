/**
 * Email Notification System
 * Sends alerts when new RFP/tender opportunities are found
 */

const nodemailer = require('nodemailer');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

class EmailNotifier {
  constructor() {
    this.transporter = this.createTransporter();
    this.recipients = this.getRecipients();
  }

  /**
   * Create email transporter
   */
  createTransporter() {
    return nodemailer.createTransporter({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT) || 587,
      secure: false, // Use TLS
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  /**
   * Get notification recipients from environment
   */
  getRecipients() {
    const emails = process.env.NOTIFICATION_EMAILS || 'info@formalogix.com';
    return emails.split(',').map((email) => email.trim());
  }

  /**
   * Send immediate alert for high-priority tender
   */
  async sendImmediateAlert(tender) {
    const subject = `🚨 High-Priority RFP Alert: ${tender.title}`;
    const html = this.generateTenderHTML([tender], 'immediate');

    try {
      await this.sendEmail(subject, html);
      console.log(`✅ Sent immediate alert for: ${tender.title}`);
    } catch (error) {
      console.error('❌ Failed to send immediate alert:', error.message);
    }
  }

  /**
   * Send daily digest of all tenders found
   */
  async sendDailyDigest(tenders) {
    if (tenders.length === 0) {
      console.log('ℹ️  No tenders to report in daily digest');
      return;
    }

    const subject = `📊 Daily RFP Digest: ${tenders.length} Opportunities Found`;
    const html = this.generateTenderHTML(tenders, 'digest');

    try {
      await this.sendEmail(subject, html);
      console.log(`✅ Sent daily digest with ${tenders.length} tenders`);
    } catch (error) {
      console.error('❌ Failed to send daily digest:', error.message);
    }
  }

  /**
   * Send email using transporter
   */
  async sendEmail(subject, html) {
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: this.recipients.join(', '),
      subject: subject,
      html: html,
    };

    const info = await this.transporter.sendMail(mailOptions);
    return info;
  }

  /**
   * Generate HTML email content
   */
  generateTenderHTML(tenders, type = 'digest') {
    const isDigest = type === 'digest';
    const date = new Date().toLocaleDateString('de-DE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    let html = `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .container {
      background-color: white;
      border-radius: 8px;
      padding: 30px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .header {
      border-bottom: 3px solid #1e40af;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .header h1 {
      color: #1e40af;
      margin: 0;
      font-size: 24px;
    }
    .header p {
      color: #666;
      margin: 5px 0 0 0;
    }
    .tender-card {
      background-color: #f8f9fa;
      border-left: 4px solid #1e40af;
      padding: 20px;
      margin-bottom: 20px;
      border-radius: 4px;
    }
    .tender-card.high-priority {
      border-left-color: #dc2626;
      background-color: #fef2f2;
    }
    .tender-card.medium-priority {
      border-left-color: #f59e0b;
      background-color: #fffbeb;
    }
    .tender-title {
      font-size: 18px;
      font-weight: bold;
      color: #1e40af;
      margin: 0 0 10px 0;
    }
    .tender-meta {
      display: flex;
      gap: 20px;
      margin: 10px 0;
      font-size: 14px;
      color: #666;
    }
    .tender-meta span {
      display: flex;
      align-items: center;
      gap: 5px;
    }
    .tender-description {
      margin: 15px 0;
      color: #444;
    }
    .priority-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: bold;
      margin-bottom: 10px;
    }
    .priority-high {
      background-color: #dc2626;
      color: white;
    }
    .priority-medium {
      background-color: #f59e0b;
      color: white;
    }
    .priority-low {
      background-color: #6b7280;
      color: white;
    }
    .cta-button {
      display: inline-block;
      background-color: #1e40af;
      color: white;
      padding: 12px 24px;
      text-decoration: none;
      border-radius: 6px;
      font-weight: bold;
      margin-top: 10px;
    }
    .cta-button:hover {
      background-color: #1e3a8a;
    }
    .footer {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      color: #666;
      font-size: 14px;
      text-align: center;
    }
    .stats {
      background-color: #eff6ff;
      padding: 15px;
      border-radius: 6px;
      margin-bottom: 20px;
    }
    .stats-row {
      display: flex;
      justify-content: space-around;
      text-align: center;
    }
    .stat-item {
      flex: 1;
    }
    .stat-number {
      font-size: 28px;
      font-weight: bold;
      color: #1e40af;
    }
    .stat-label {
      font-size: 12px;
      color: #666;
      text-transform: uppercase;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${isDigest ? '📊 Täglicher RFP-Bericht' : '🚨 Wichtige RFP-Benachrichtigung'}</h1>
      <p>${date}</p>
    </div>
`;

    // Add statistics for digest
    if (isDigest) {
      const highPriority = tenders.filter((t) => t.priorityScore >= 20).length;
      const mediumPriority = tenders.filter((t) => t.priorityScore >= 10 && t.priorityScore < 20).length;

      html += `
    <div class="stats">
      <div class="stats-row">
        <div class="stat-item">
          <div class="stat-number">${tenders.length}</div>
          <div class="stat-label">Gesamt</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">${highPriority}</div>
          <div class="stat-label">Hohe Priorität</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">${mediumPriority}</div>
          <div class="stat-label">Mittlere Priorität</div>
        </div>
      </div>
    </div>
`;
    }

    // Add tender cards
    tenders.forEach((tender) => {
      const priority = this.getPriorityLevel(tender.priorityScore);
      const priorityClass = priority.toLowerCase().replace(' ', '-');

      html += `
    <div class="tender-card ${priorityClass}">
      <span class="priority-badge priority-${priorityClass}">${priority}</span>
      <h2 class="tender-title">${tender.title || 'Unbenanntes Ausschreibungsverfahren'}</h2>

      <div class="tender-meta">
        <span>🏢 ${tender.buyerName || 'Nicht angegeben'}</span>
        <span>🌍 ${tender.country || 'N/A'}</span>
        ${tender.deadline ? `<span>📅 Frist: ${tender.deadline}</span>` : ''}
      </div>

      ${
        tender.description
          ? `<div class="tender-description">${this.truncateText(tender.description, 300)}</div>`
          : ''
      }

      ${
        tender.cpvCodes && tender.cpvCodes.length > 0
          ? `<div style="font-size: 12px; color: #666;">
           <strong>CPV Codes:</strong> ${tender.cpvCodes.slice(0, 3).join(', ')}
         </div>`
          : ''
      }

      <a href="${tender.url}" class="cta-button" target="_blank">Ausschreibung ansehen →</a>
    </div>
`;
    });

    // Footer
    html += `
    <div class="footer">
      <p><strong>Formalogix RFP-Monitoring-System</strong></p>
      <p>Automatisch generiert von Ihrem Tender-Monitoring-System</p>
      <p style="font-size: 12px; margin-top: 10px;">
        Dieses System überwacht kontinuierlich öffentliche Ausschreibungen, die zu den
        Formulardigitalisierungsdiensten von Formalogix passen.
      </p>
    </div>
  </div>
</body>
</html>
`;

    return html;
  }

  /**
   * Get priority level label
   */
  getPriorityLevel(score) {
    if (score >= 20) return 'Hohe Priorität';
    if (score >= 10) return 'Mittlere Priorität';
    return 'Niedrige Priorität';
  }

  /**
   * Truncate text to specified length
   */
  truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }

  /**
   * Test email configuration
   */
  async testConnection() {
    try {
      await this.transporter.verify();
      console.log('✅ Email configuration is valid');
      console.log(`📧 Will send to: ${this.recipients.join(', ')}`);
      return true;
    } catch (error) {
      console.error('❌ Email configuration error:', error.message);
      return false;
    }
  }
}

// CLI test
if (require.main === module) {
  const notifier = new EmailNotifier();

  // Test connection
  notifier.testConnection().then((success) => {
    if (success) {
      // Send test email with sample tender
      const sampleTender = {
        id: 'TEST-001',
        title: 'Digitalisierung von Versicherungsformularen',
        description:
          'Ausschreibung für die Digitalisierung und Verarbeitung von handschriftlichen Versicherungsformularen mit OCR-Technologie.',
        country: 'DE',
        cpvCodes: ['72000000', '72260000'],
        deadline: '2026-02-15',
        buyerName: 'Bundesversicherungsamt',
        url: 'https://ted.europa.eu/udl?uri=TED:NOTICE:TEST-001',
        priorityScore: 25,
      };

      console.log('\n📧 Sending test email...');
      notifier.sendImmediateAlert(sampleTender);
    }
  });
}

module.exports = EmailNotifier;
