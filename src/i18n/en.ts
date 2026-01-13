export default {
  lang: 'en',
  locale: 'en-US',

  nav: {
    solutions: 'Solutions',
    successStories: 'Success Stories',
    pricing: 'Pricing',
    contact: 'Contact',
  },

  hero: {
    title: 'Reliably Process Handwritten Forms',
    subtitle: 'Thousands of forms efficiently processed – structured, analyzable, and immediately usable.',
    keyPoints: {
      largeVolumes: 'Large form volumes',
      timeConstraints: 'Fast under time pressure',
      structuredData: 'Structured data',
      accuracy: '99.8% accuracy',
    },
    cta: {
      primary: 'Contact Us',
      primarySub: 'Quote in 24h',
      secondary: 'Calculate Savings',
      secondarySub: 'View pricing',
    },
  },

  pricing: {
    title: 'Pricing',
    subtitle: 'Our pricing is modular – pay only for the services you need.',
    services: {
      analysis: {
        name: 'Analysis',
        description: 'Automatic AI-based form recognition',
        unit: 'page',
      },
      verification: {
        name: 'Human Verification',
        description: 'Quality assurance through manual review',
        unit: 'page',
        prefix: 'from',
      },
      scanning: {
        name: 'Scanning',
        description: 'Digitization of physical documents',
        unit: 'page',
      },
      extras: {
        name: 'Extra Services',
        description: 'Data processing, API integration, etc.',
        price: 'On Request',
      },
    },
    volumeDiscount: {
      title: 'Volume Discounts Available',
      description: 'For larger projects (10,000+ pages), we offer attractive volume discounts. Contact us for a custom quote.',
    },
    detailedCalculator: 'Go to Detailed Pricing Calculator',
  },

  calculator: {
    title: 'Cost Calculator',
    pagesLabel: 'Number of Pages',
    services: {
      analysis: 'Analysis',
      verification: 'Human Verification',
      scanning: 'Scanning',
    },
    costBreakdown: {
      analysis: 'Analysis',
      verification: 'Verification',
      scanning: 'Scanning',
      total: 'Total Cost',
    },
    disclaimer: '* Prices are estimates. Extra services such as data processing or conversion to special formats available on request.',
    requestOfferButton: 'Request Offer',
  },

  footer: {
    tagline: 'Formalogix – Your Partner for Intelligent Form Processing',
    company: 'Company',
    legal: 'Legal',
    contact: 'Contact',
    links: {
      about: 'About Us',
      pricing: 'Pricing',
      useCases: 'Use Cases',
      imprint: 'Imprint',
      privacy: 'Privacy Policy',
      terms: 'Terms & Conditions',
    },
  },

  common: {
    perPage: 'per page',
    from: 'from',
    page: 'page',
    pages: 'pages',
    onRequest: 'On Request',
    learnMore: 'Learn More',
    getStarted: 'Get Started',
    contactUs: 'Contact Us',
  },

  problemStatement: {
    title: 'Does This Sound Familiar?',
    subtitle: 'Many businesses face the same challenges:',
    painPoints: {
      volume: {
        title: 'Thousands of Forms Piling Up?',
        description: 'Employees lose hours on monotonous data entry.',
      },
      handwriting: {
        title: 'Handwriting Becoming a Problem?',
        description: 'OCR software fails with handwriting and threatens data quality.',
      },
      deadlines: {
        title: 'Tight Deadlines?',
        description: 'Form processing becomes a bottleneck and delays projects.',
      },
    },
    solution: 'This is exactly where Formalogix comes in.',
    solutionDescription: 'We handle the complete form processing – fast, precise, and reliable.',
    cta: 'How Formalogix Helps →',
  },

  howItWorks: {
    title: 'From Form to Structured Database',
    subtitle: 'In 4 steps, we transform handwritten forms into precise, analyzable data – through the combination of AI technology and human expertise.',
    steps: {
      capture: {
        title: 'Capture & Digitization',
        description: 'Forms are scanned and prepared for AI analysis.',
      },
      analysis: {
        title: 'AI-Powered Analysis',
        description: 'AI automatically analyzes all fields and extracts structured data.',
      },
      verification: {
        title: 'Human Verification',
        description: 'Expert team reviews critical fields for 99.8% accuracy.',
      },
      output: {
        title: 'Structured Data Output',
        description: 'Verified data ready for Excel, databases, or API integration.',
      },
    },
    cta: 'Try It Free Now',
    tagline: 'Hybrid technology for maximum precision.',
  },

  efficiencyComparison: {
    title: 'Efficiency Comparison: Manual vs. Automated',
    subtitle: 'Professional automation measurably optimizes your processes.',
    manual: {
      title: 'Manual Processing:',
      points: {
        time: '3-4 weeks turnaround time for larger volumes',
        errors: 'Fluctuating error rate with high volume',
        resources: 'Personnel-intensive processes',
        availability: 'Delayed data availability',
        scalability: 'Limited scalability',
      },
      example: 'Example: 50,000 forms annually require multiple full-time employees and weeks of processing time',
    },
    automated: {
      title: 'Automated with Formalogix:',
      points: {
        time: '24-48 hours turnaround time',
        accuracy: '99.8% accuracy through hybrid approach',
        resources: 'Efficient resource utilization',
        availability: 'Data immediately available',
        scalability: 'Scalable to any volume',
      },
      example: 'Example: 50,000 forms are automatically processed with guaranteed quality and fast availability',
    },
    cta: 'Calculate Your Savings Potential',
  },

  useCases: {
    title: 'Success Stories from Practice',
    subtitle: 'Real projects. Real results. Real challenges solved.',

    // Use Case 1: Building Insurance
    buildingInsurance: {
      // Homepage card content
      title: 'Property Insurance',
      volume: '103,000 forms',
      tagline: '16M data points from handwritten forms',
      description: '156 fields per form, varying handwriting since 1996, complex signature verification.',

      // Detail page sections
      hero: {
        title: 'Property Insurance: 16M Data Points in 2 Weeks',
        subtitle: 'From unstructured PDFs to fully analyzable databases',
      },
      problem: {
        title: 'The Challenge',
        intro: '103,000 historical insurance forms with 156 fields per document needed to be digitized.',
        challenges: [
          'Varying handwriting styles from 1996 to present',
          'Multiple fields distributed across different areas',
          'Signature verification required',
          'Checkboxes and handwritten notes combined',
          'Traditional OCR completely failed with handwriting'
        ],
      },
      situation: {
        title: 'Initial Condition',
        description: 'The forms existed as scanned PDFs. Previous attempts with traditional OCR software failed on checkboxes and illegible handwriting. Manual data entry by 3 people over 3 months for 1,000 forms was economically unfeasible.',
      },
      solution: {
        title: 'The Solution',
        description: 'Formalogix developed a tailored hybrid approach:',
        steps: [
          'Automated AI analysis of all 156 fields',
          'Human-in-the-Loop verification for critical fields',
          'Unified data structure for all 103,000 forms',
          'Signature verification by trained auditors',
          'Structured output in desired database format'
        ],
      },
      results: {
        title: 'Results',
        metrics: {
          forms: '103,000 forms',
          fields: '16M fields',
          timeframe: '2 weeks',
          accuracy: '99.7% accuracy',
        },
        outcomes: [
          'All 103,000 forms processed in just 2 weeks',
          '16 million individual fields evaluated',
          'In comparison: 3 people would have needed 3 months for 1,000 forms',
          'Fully structured data, immediately analyzable',
          'Massive cost savings compared to manual entry',
          '99.7% accuracy through Human-in-the-Loop'
        ],
      },
      quote: {
        text: 'The combination of AI and human verification enabled us to implement a project that would have been impossible with traditional methods. The data quality exceeds our expectations.',
        author: 'Project Manager Digitalization, Insurance Company'
      },
    },

    // Use Case 2: GDPR Event Registration
    gdprEvent: {
      // Homepage card content
      title: 'GDPR Event Registration',
      volume: '3,000 forms',
      tagline: 'GDPR-compliant processing during ongoing registration',
      description: '3 months of dynamic form intake, automatic batch assignment, direct database integration.',

      // Detail page sections
      hero: {
        title: 'GDPR Forms for Event Registration',
        subtitle: '3,000 forms seamlessly processed during registration period',
      },
      problem: {
        title: 'The Challenge',
        intro: 'An annual major event required GDPR-compliant consent forms from all participants.',
        challenges: [
          'Registration period over 3 months with continuous form intake',
          'Forms contain batch assignments for photo/film/press releases',
          'Entire team had to manually review forms under time pressure',
          'Data had to be GDPR-compliant and error-free in existing database',
          'Increasing form numbers exponentially increased administrative overhead'
        ],
      },
      situation: {
        title: 'Initial Condition',
        description: 'Forms were transmitted via API from the organizer. The dynamically arriving forms massively increased administrative overhead. Data had to be integrated into the existing event database in a GDPR-compliant and error-free manner.',
      },
      solution: {
        title: 'The Solution',
        description: 'Formalogix implemented a fully automated workflow:',
        steps: [
          'Automated analysis of all incoming forms',
          'Human-in-the-Loop only for critical fields',
          'Direct database integration via API',
          'Automatic batch assignment based on releases',
          'Fast processing even with increasing form numbers'
        ],
      },
      results: {
        title: 'Results',
        metrics: {
          forms: '3,000 forms',
          timeframe: '3 months',
          processing: 'Seamlessly integrated',
          compliance: '100% GDPR compliant',
        },
        outcomes: [
          'All 3,000 forms seamlessly processed during registration period',
          'Fully structured data for event logistics',
          'Automatic batch assignment worked flawlessly',
          'High data quality and GDPR compliance guaranteed',
          'Team resources freed for other tasks',
          'Stress-free handling despite time pressure'
        ],
      },
      quote: {
        text: 'The seamless integration during the ongoing registration period relieved us enormously. We could focus on event planning while Formalogix processed the forms in the background.',
        author: 'Event Manager, Major Event'
      },
    },

    // Use Case 3: Trade Fair Raffle
    tradeFairRaffle: {
      // Homepage card content
      title: 'Trade Fair Raffle',
      volume: '10,000 forms',
      tagline: 'From paper form to marketing database in 3 days',
      description: 'Capturing address, contact data, raffle answers, and consents.',

      // Detail page sections
      hero: {
        title: 'Marketing Raffle at Trade Fair',
        subtitle: '10,000 forms efficiently processed – over 830 hours saved',
      },
      problem: {
        title: 'The Challenge',
        intro: 'A company conducted a raffle at a major trade fair where visitors had to fill out a form.',
        challenges: [
          '10,000 paper forms with multiple required fields',
          'Required information: address, phone, email, signature, raffle answer, terms acceptance',
          'Manual data entry would take ~5 minutes per form',
          'Data should be quickly available for marketing campaigns',
          'High quality requirements for email addresses and signatures'
        ],
      },
      situation: {
        title: 'Initial Condition',
        description: 'Paper forms had to be integrated into the existing database. Manual entry of 10,000 forms at 5 minutes each would have taken over 830 hours or 104 working days (more than 5 months full-time).',
      },
      solution: {
        title: 'The Solution',
        description: 'Formalogix handled the entire process:',
        steps: [
          'Scanning all 10,000 paper forms',
          'Automated data extraction via AI',
          'Human-in-the-Loop for critical fields (signatures, emails)',
          'Validation of all email addresses and phone numbers',
          'Direct integration into marketing database'
        ],
      },
      results: {
        title: 'Results',
        metrics: {
          forms: '10,000 forms',
          timeframe: '3 working days',
          timeSaved: '830+ hours',
          equivalentTime: '104 working days',
        },
        outcomes: [
          '10,000 forms processed efficiently and error-free',
          'Completed in just 3 working days',
          'Saved over 830 hours (104 working days = 5+ months full-time)',
          'Fully structured datasets ready for marketing',
          'Maximum data quality for subsequent campaigns',
          'Quick campaign start one week after the fair'
        ],
      },
      quote: {
        text: 'Without Formalogix, we would have needed months to capture the raffle data. Instead, we were able to start the marketing campaign one week after the trade fair.',
        author: 'Marketing Manager, B2B Company'
      },
    },

    ctaQuestion: 'Would you like to achieve similar results in your company?',
    cta: 'Get Consultation Now',
  },

  competitive: {
    title: 'What Sets Formalogix Apart from Other Solutions',
    subtitle: 'We solve problems where tools or manual capture reach their limits. Formalogix delivers structured, analyzable data, even with handwritten or complex forms – fast, precise, and reliable.',
    differentiators: {
      responsibility: {
        title: 'Taking Responsibility',
        description: 'We handle the entire process – you deliver forms, we deliver usable data.',
      },
      humanInLoop: {
        title: 'Human-in-the-Loop',
        description: 'Automated AI analysis combined with human verification for highest quality.',
      },
      dataStructures: {
        title: 'Data Structures, Not PDFs',
        description: 'We deliver structured, analyzable datasets instead of unstructured PDFs.',
      },
      scalability: {
        title: 'Scalable Under Time Pressure',
        description: 'Large volumes reliably processed – even under tight time constraints.',
      },
    },
    summary: {
      title: 'Formalogix Combines AI Speed with Human Precision',
      subtitle: 'For reliable results in 24-48 hours – without compromising accuracy.',
      metrics: {
        accuracy: 'Accuracy',
        turnaround: 'Turnaround',
        price: 'Per Page',
      },
      cta: 'Get Consultation Now',
    },
  },

  services: {
    title: 'Our Services',
    subtitle: 'We offer flexible solutions for every need - from self-service to customized enterprise solutions.',
    popular: 'Popular',
    fullService: {
      title: 'Full Service',
      tagline: 'Complete form processing from scanning to data entry.',
      description: 'Ideal for larger projects and recurring processes.',
      features: {
        accuracy: '99.8% accuracy via AI + human',
        turnaround: '24-48h turnaround time',
        output: 'Excel, CSV, or API',
      },
      cta: 'Request Full Service',
    },
    enterprise: {
      title: 'Enterprise',
      tagline: 'For complex requirements and high volumes.',
      description: 'Optimized for long-term projects with high complexity.',
      features: {
        workflows: 'Individual workflows',
        integration: 'ERP/CRM & on-premise',
        support: 'Volume pricing & account manager',
      },
      cta: 'Discuss Enterprise Solution',
    },
    selfService: {
      title: 'Self-Service',
      tagline: 'For tests, pilot projects, and small volumes.',
      description: 'Cost-effective for tests and smaller projects.',
      features: {
        analysis: 'AI analysis ready immediately',
        api: 'API-first architecture',
        flexible: 'Ideal for tests & pilot projects',
      },
      cta: 'Try Self-Service',
    },
  },

  faq: {
    title: 'Frequently Asked Questions',
    subtitle: 'Answers to the most important questions about Formalogix',
    questions: {
      pricing: {
        question: 'Isn\'t Formalogix more expensive than pure OCR software?',
        answer: 'OCR software seems cheaper, but error correction often costs more than the software itself. With Formalogix, you pay transparently per page and get 99.8% accuracy without expensive post-processing.',
      },
      outsourcing: {
        question: 'Why not just use classic outsourcing?',
        answer: 'Traditional outsourcing takes 3-6 weeks and offers no API integration. Formalogix delivers in 24-48h with full API for seamless process integration.',
      },
      security: {
        question: 'How secure is my sensitive data?',
        answer: 'All data is processed GDPR-compliant on German servers with end-to-end encryption. We are ISO 27001 certified and sign a data processing agreement upon request.',
      },
      implementation: {
        question: 'How long does implementation take?',
        answer: 'You can process your first test documents within 24-48h. Full implementation takes between immediate (Self-Service) and 2-4 weeks (Enterprise) depending on service tier.',
      },
      aiFailure: {
        question: 'What happens if the AI cannot recognize a field?',
        answer: 'Our human verification automatically steps in when AI is uncertain. The trained team checks and corrects all flagged fields, ensuring you receive guaranteed 99.8% accuracy.',
      },
      formTypes: {
        question: 'What types of forms can you process?',
        answer: 'Formalogix processes nearly all structured forms – from insurance applications to patient questionnaires to order forms. Contact us for a free test evaluation within 24h!',
      },
    },
    ctaQuestion: 'Do you have more questions?',
    cta: 'Get Consultation Now',
  },

  contact: {
    title: 'Request Non-Binding Consultation',
    subtitle: 'We\'ll discuss your use case and show you how Formalogix can optimize your processes. Response within 24 hours.',
    trustSignals: {
      noObligation: 'No Obligation',
      quickResponse: 'Response in 24 Hours',
      confidential: 'Treated Confidentially',
    },
  },

  footerContent: {
    description: 'Convert handwritten forms into structured data.',
    sections: {
      services: 'Services',
      resources: 'Resources',
      contact: 'Contact',
    },
    links: {
      selfService: 'Self-Service',
      fullService: 'Full Service',
      enterprise: 'Enterprise',
      useCases: 'Use Cases',
      pricing: 'Pricing',
      launchApp: 'Launch App',
      submitRequest: 'Submit Request',
    },
    trust: {
      gdpr: 'GDPR Compliant',
      gdprSubtext: 'Privacy Guaranteed',
      accuracy: '99.8%',
      accuracySubtext: 'Accuracy Guarantee',
      pagesProcessed: '10M+',
      pagesProcessedSubtext: 'Pages Processed',
      responseTime: '24h',
      responseTimeSubtext: 'Response Time',
    },
    legal: {
      privacy: 'Privacy Policy',
      imprint: 'Imprint',
      terms: 'Terms & Conditions',
      copyright: 'All rights reserved.',
    },
  },

  offerRequest: {
    modalTitle: 'Request Offer',
    modalSubtitle: 'Fill out the form and we\'ll create a custom quote for you.',

    calculatorSummary: {
      title: 'Your Calculation',
      pages: 'Pages',
      services: 'Services',
      estimatedCost: 'Estimated Cost',
    },

    form: {
      documentDetails: 'Document Details',
      pageSize: {
        label: 'Page Size',
        placeholder: 'Select size',
        options: {
          a5: 'A5',
          a4: 'A4',
          a3: 'A3',
          other: 'Other',
        },
        otherPlaceholder: 'Please specify size',
      },
      documentCondition: {
        label: 'Document Condition',
        placeholder: 'Select condition',
        options: {
          pristine: 'Pristine/Undamaged',
          good: 'Good Condition',
          worn: 'Worn',
          crumpled: 'Crumpled',
          waterDamaged: 'Water Damaged',
          bound: 'Bound (Binder)',
          stapled: 'Stapled',
          loose: 'Loose Sheets',
        },
      },

      businessContext: 'Business Context',
      industry: {
        label: 'Industry',
        placeholder: 'Select industry',
        options: {
          insurance: 'Insurance',
          education: 'Education',
          healthcare: 'Healthcare',
          wholesale: 'Wholesale',
          publicAdmin: 'Public Administration',
          other: 'Other',
        },
      },
      urgency: {
        label: 'Urgency',
        placeholder: 'Select urgency',
        options: {
          within24h: 'Within 24 Hours',
          within1week: 'Within 1 Week',
          within1month: 'Within 1 Month',
          flexible: 'Flexible',
          specificDate: 'Specific Date',
        },
        datePlaceholder: 'Select date',
      },

      contactInfo: 'Contact Information',
      company: 'Company',
      companyPlaceholder: 'Your Company',
      name: 'Name',
      namePlaceholder: 'Your Name',
      email: 'Email',
      emailPlaceholder: 'your.email@example.com',
      phone: 'Phone (optional)',
      phonePlaceholder: '+1 234 567 8900',
      message: 'Additional Notes (optional)',
      messagePlaceholder: 'Describe special requirements...',

      fileUpload: 'Upload Sample Form (optional)',

      submitButton: 'Request Offer',
      submitting: 'Sending...',
      successMessage: 'Thank you! We\'ll get back to you within 24 hours.',
      errorMessage: 'Error sending. Please try again.',
    },

    close: 'Close',
  },

  contactModal: {
    modalTitle: 'Contact Us',
    close: 'Close',
  },
} as const;
