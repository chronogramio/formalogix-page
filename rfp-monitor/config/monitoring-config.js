/**
 * RFP/RFI Monitoring Configuration
 * Defines search parameters for tender opportunities matching Formalogix services
 */

module.exports = {
  // Target countries (ISO 2-letter codes)
  targetCountries: ['DE', 'AT', 'CH', 'LI'], // Germany, Austria, Switzerland, Liechtenstein

  // Common Procurement Vocabulary (CPV) codes
  // https://simap.ted.europa.eu/web/simap/cpv
  cpvCodes: [
    '72000000', // IT services: consulting, software development, Internet and support
    '72260000', // Software-related services
    '72263000', // Software implementation services
    '72268000', // Software supply services
    '48000000', // Software package and information systems
    '48700000', // Application software package
    '48900000', // Miscellaneous software package
    '79999100', // Scanning services
    '79999000', // Digitization services
    '72317000', // Data storage services
    '72320000', // Database services
    '72322000', // Data management services
  ],

  // German keywords for TED and German platforms
  keywordsDE: [
    'Formulardigitalisierung',
    'Dokumentenverarbeitung',
    'Handschrifterkennung',
    'Datenextraktion',
    'OCR-Dienste',
    'Digitale Formulare',
    'Dokumentenautomatisierung',
    'Formularverarbeitung',
    'Digitalisierung von Formularen',
    'Schrifterkennung',
    'Dokumentenerfassung',
    'Datenerfassung',
    'Scan-Service',
    'Archivdigitalisierung',
  ],

  // English keywords for international tenders
  keywordsEN: [
    'form digitization',
    'document processing',
    'handwriting recognition',
    'data extraction',
    'OCR services',
    'digital forms',
    'document automation',
    'form processing',
    'intelligent document processing',
    'IDP',
    'document capture',
    'data capture',
    'scanning service',
    'document digitization',
  ],

  // Target industry sectors
  targetSectors: [
    'insurance',
    'education',
    'healthcare',
    'wholesale',
    'government',
    'public administration',
    'social services',
  ],

  // German sector keywords
  sectorKeywordsDE: [
    'Versicherung',
    'Bildung',
    'Gesundheitswesen',
    'Krankenhaus',
    'Großhandel',
    'Verwaltung',
    'Sozialwesen',
    'Schule',
    'Universität',
  ],

  // Tender platforms to monitor
  platforms: {
    ted: {
      name: 'TED (Tenders Electronic Daily)',
      url: 'https://ted.europa.eu',
      apiUrl: 'https://ted.europa.eu/api',
      ftpUrl: 'ftp://ted.europa.eu',
      enabled: true,
    },
    bundDE: {
      name: 'Bund.de (German Federal Procurement)',
      url: 'https://www.bund.de',
      enabled: true,
    },
    evergabe: {
      name: 'eVergabe Online',
      url: 'https://www.evergabe-online.de',
      enabled: true,
    },
    simap: {
      name: 'SIMAP (Swiss Public Procurement)',
      url: 'https://www.simap.ch',
      enabled: true,
    },
  },

  // Email notification settings
  notifications: {
    enabled: false, // Disabled for testing - set to true when email is configured
    recipients: ['info@formalogix.com'], // Update with actual emails
    dailyDigest: true,
    immediateAlerts: true, // Send immediately for high-priority matches
  },

  // Matching criteria for priority scoring
  priorityKeywords: {
    high: [
      'form',
      'handwriting',
      'OCR',
      'digitization',
      'Formular',
      'Handschrift',
      'Digitalisierung',
    ],
    medium: [
      'document',
      'processing',
      'automation',
      'Dokument',
      'Verarbeitung',
      'Automatisierung',
    ],
  },

  // Budget thresholds (in EUR)
  budgetThresholds: {
    minimum: 10000, // Skip very small tenders
    preferred: 50000, // Flag tenders above this amount
  },

  // Scan frequency
  scanning: {
    dailyScanTime: '09:00', // 9 AM daily scan
    enableRealtime: false, // Set to true for hourly checks (higher API usage)
  },
};
