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
    title: 'Reliably Process Handwritten Forms – Without Manual Data Entry',
    subtitle: 'Formalogix processes thousands of forms – efficiently, precisely, and economically. Results are structured, analyzable, and immediately usable.',
    keyPoints: {
      largeVolumes: 'Large and recurring form volumes',
      timeConstraints: 'Ready even under time pressure',
      structuredData: 'Structured data instead of just PDFs',
      accuracy: 'AI + Human-in-the-Loop for 99.8% accuracy',
    },
    cta: {
      primary: 'Calculate Your Savings Now',
      primarySub: 'Free quote within 24h',
      secondary: 'View Success Stories',
      secondarySub: 'Customers save up to 85% time',
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
        description: 'Your employees lose hours on monotonous data entry – time that\'s urgently needed elsewhere.',
      },
      handwriting: {
        title: 'Handwriting Becoming a Problem?',
        description: 'OCR software fails with illegible handwriting. Errors creep in and threaten your data quality.',
      },
      deadlines: {
        title: 'Tight Deadlines?',
        description: 'Important projects are delayed because form processing becomes a bottleneck. Pressure mounts.',
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
        description: 'Handwritten forms are scanned and digitally captured – regardless of format, structure, or handwriting. Each document is prepared for AI analysis.',
      },
      analysis: {
        title: 'AI-Powered Analysis',
        description: 'State-of-the-art AI models automatically analyze every form field – from handwriting to checkboxes to signatures. The AI extracts structured data from unstructured documents.',
      },
      verification: {
        title: 'Human Verification',
        description: 'Our expert team specifically reviews critical fields and special cases. This hybrid approach combines AI speed with human precision – for 99.8% accuracy.',
      },
      output: {
        title: 'Structured Data Output',
        description: 'Fully verified data is provided as structured datasets – directly usable in Excel, databases, or via API. Ready for analysis, integration, and further processing.',
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
        scalability: 'Limited scalability',
        resources: 'Personnel-intensive processes',
        availability: 'Delayed data availability',
      },
      example: 'Example: 50,000 forms annually require multiple full-time employees and weeks of processing time',
    },
    automated: {
      title: 'Automated with Formalogix:',
      points: {
        time: '24-48 hours turnaround time',
        accuracy: '99.8% accuracy through hybrid approach',
        scalability: 'Scalable to any volume',
        resources: 'Efficient resource utilization',
        availability: 'Data immediately available',
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
        description: 'Many providers offer a tool. Formalogix takes over the entire process – from analysis to structured data output. You deliver the forms. We deliver usable data.',
      },
      humanInLoop: {
        title: 'Human-in-the-Loop',
        description: 'Handwriting, special cases, and inconsistent forms are reality. That\'s why we combine automated analysis with targeted human verification – exactly where quality matters.',
      },
      dataStructures: {
        title: 'Data Structures, Not PDFs',
        description: 'For us, a form isn\'t a page but a collection of fields. Whether 1,000 forms with 150 fields or 100,000 pages – what matters is: structured, analyzable datasets.',
      },
      scalability: {
        title: 'Scalable Under Time Pressure',
        description: 'Formalogix reliably processes large volumes – even under tight time constraints. Where manual capture is too slow and classic OCR tools too inaccurate, we step in.',
      },
      fullService: {
        title: 'Full Service Instead of Risk',
        description: 'No training, no tool experiments, no "The system misread it." We take responsibility for quality, structure, and results – not you.',
      },
      specialCases: {
        title: 'Special Cases Can Be Handled',
        description: 'Individual fields, exceptions, and special requirements can be specifically addressed in the Enterprise model. Even with complex projects, data quality remains controllable.',
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
      tagline: 'We handle the complete form processing – from scanning to structured data entry.',
      description: 'Ideal for larger projects or recurring processes. You have enough on your plate – forms shouldn\'t be one of them.',
      features: {
        accuracy: 'AI analysis + human verification for 99.8% accuracy',
        turnaround: 'Turnaround time 24-48h – even with thousands of forms',
        output: 'Structured data in Excel, CSV, or via API',
      },
      cta: 'Request Full Service',
    },
    enterprise: {
      title: 'Enterprise',
      tagline: 'For companies with complex requirements or ongoing form volumes.',
      description: 'Optimal for companies with high complexity and long-term projects.',
      features: {
        workflows: 'Individual workflows & special cases can be handled',
        integration: 'ERP/CRM integration & on-premise option',
        support: 'Volume pricing & personal account manager',
      },
      cta: 'Discuss Enterprise Solution',
    },
    selfService: {
      title: 'Self-Service',
      tagline: 'For tests, pilot projects, or small volumes where cost matters.',
      description: 'Cost-effective – ideal for getting to know the technology or testing smaller projects internally.',
      features: {
        analysis: 'Automated AI analysis – ready immediately',
        api: 'API-first architecture for seamless integration',
        flexible: 'Flexible usage – ideal for tests and pilot projects',
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
        answer: {
          intro: 'At first glance, pure OCR software may seem cheaper. However, you must consider the Total Cost of Ownership (TCO):',
          points: [
            'OCR software for handwriting: 85-95% accuracy → 5-15% error rate',
            'Error correction requires manual rework (often 2-3h per 100 forms)',
            'Personnel costs + opportunity costs quickly exceed software costs',
            'Training, maintenance, and updates not included',
          ],
          conclusion: 'With Formalogix, you pay transparently per page and receive guaranteed 99.8% accuracy – without hidden costs or rework.',
        },
      },
      outsourcing: {
        question: 'Why not just use classic outsourcing?',
        answer: {
          intro: 'Classic outsourcing has significant disadvantages:',
          points: [
            'Speed: 3-6 weeks turnaround vs. 24-48h with Formalogix',
            'Transparency: Non-transparent pricing vs. fixed prices from €0.10/page',
            'Integration: No API connection vs. full API with Formalogix',
            'Scalability: Difficult to scale vs. elastically scalable',
          ],
          conclusion: 'Formalogix combines AI speed with human verification – you get the best of both worlds.',
        },
      },
      security: {
        question: 'How secure is my sensitive data?',
        answer: {
          intro: 'Data security is our highest priority:',
          points: [
            'GDPR-compliant: All processes comply with the General Data Protection Regulation',
            'Encryption: End-to-end encryption for all data transmissions',
            'ISO 27001: Certified information security management',
            'Server location: All servers in Germany (Made in Germany)',
            'On-premise option: Available for highest security requirements (Enterprise)',
            'Data deletion: Automatic deletion after agreed retention period',
          ],
          conclusion: 'On request, we conclude a Data Processing Agreement (DPA) according to Art. 28 GDPR with you.',
        },
      },
      implementation: {
        question: 'How long does implementation take?',
        answer: {
          intro: 'Implementation time depends on your chosen service level:',
          points: [
            'Self-Service API: Ready immediately – receive API key and get started',
            'Full Service: 1-2 weeks for onboarding and form template creation',
            'Enterprise: 2-4 weeks incl. ERP integration, workflow customization, and training',
          ],
          conclusion: 'In most cases, you can have your first test documents processed within 24-48h.',
        },
      },
      aiFailure: {
        question: 'What happens if the AI cannot recognize a field?',
        answer: {
          intro: 'This is exactly where the strength of our hybrid approach lies:',
          points: [
            'AI Analysis: Our AI first processes all fields automatically',
            'Confidence Check: Fields with low recognition confidence are marked',
            'Human Verification: Our trained team manually reviews and corrects these fields',
            'Quality Control: Additional spot checks for 99.8% accuracy guarantee',
          ],
          conclusion: 'You always receive fully verified data – without having to worry about illegible fields.',
        },
      },
      formTypes: {
        question: 'What types of forms can you process?',
        answer: {
          intro: 'Formalogix processes nearly all types of structured forms:',
          points: [
            'Insurance: Applications, claim forms, health questionnaires',
            'Education: Exam sheets, registration forms, evaluation forms',
            'Healthcare: Patient questionnaires, medical history forms, consent forms',
            'Wholesale: Order forms, delivery notes, invoices',
            'Public Administration: Applications, permits, notices',
          ],
          conclusion: 'Contact us with your form – we\'ll create a free test evaluation within 24h!',
        },
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
