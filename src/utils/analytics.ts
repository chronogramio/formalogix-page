// Umami Analytics Tracking Utility

// Extend Window interface for TypeScript
declare global {
  interface Window {
    umami?: {
      track: (eventName: string, eventData?: Record<string, any>) => void;
    };
  }
}

// Event names enum for consistency
export enum AnalyticsEvent {
  // Contact Form Events
  CONTACT_FORM_STARTED = 'contact-form-started',
  CONTACT_FORM_FILE_UPLOADED = 'contact-form-file-uploaded',
  CONTACT_FORM_SUBMITTED = 'contact-form-submitted',
  CONTACT_FORM_SUCCESS = 'contact-form-success',
  CONTACT_FORM_ERROR = 'contact-form-error',

  // Pricing Calculator Events
  PRICING_CALCULATOR_USED = 'pricing-calculator-used',
  PRICING_CALCULATOR_HIGH_VOLUME = 'pricing-calculator-high-volume',
  PRICING_CALCULATOR_FULL_SERVICE = 'pricing-calculator-full-service-selected',
  PRICING_CALCULATOR_ENTERPRISE = 'pricing-calculator-enterprise-selected',

  // Currency/Language Events
  CURRENCY_SWITCHED = 'currency-switched',
  LANGUAGE_SWITCHED = 'language-switched',

  // CTA Events
  CTA_HERO_PRIMARY = 'cta-hero-primary-clicked',
  CTA_HERO_SECONDARY = 'cta-hero-secondary-clicked',
  CTA_PROBLEM_STATEMENT = 'cta-problem-statement-clicked',
  CTA_EFFICIENCY_COMPARISON = 'cta-efficiency-comparison-clicked',
  CTA_HOW_IT_WORKS = 'cta-how-it-works-clicked',
  CTA_USE_CASES_SUMMARY = 'cta-usecases-summary-clicked',
  CTA_COMPETITIVE = 'cta-competitive-positioning-clicked',
  CTA_FAQ = 'cta-faq-clicked',
  CTA_QUALIFICATION = 'cta-qualification-clicked',

  // Use Case Events
  USE_CASE_CARD_CLICKED = 'use-case-card-clicked',

  // External Links
  SELF_SERVICE_APP_CLICKED = 'self-service-app-clicked',
  EXTERNAL_LINK_CLICKED = 'external-link-clicked',
}

/**
 * Track a custom event with Umami Analytics
 * @param eventName - The name of the event to track
 * @param eventData - Optional data to attach to the event
 */
export function trackEvent(eventName: string, eventData?: Record<string, any>) {
  if (typeof window !== 'undefined' && window.umami) {
    try {
      window.umami.track(eventName, eventData);
      console.debug('[Analytics] Event tracked:', eventName, eventData);
    } catch (error) {
      console.error('[Analytics] Error tracking event:', error);
    }
  } else {
    console.debug('[Analytics] Umami not loaded, skipping event:', eventName);
  }
}

/**
 * Track a CTA click based on data-track-cta attribute
 * @param ctaId - The identifier from data-track-cta attribute
 * @param additionalData - Optional additional data
 */
export function trackCTAClick(ctaId: string, additionalData?: Record<string, any>) {
  trackEvent(`cta-${ctaId}-clicked`, {
    cta_id: ctaId,
    ...additionalData,
  });
}

/**
 * Track contact form events with standardized data
 */
export const ContactFormTracking = {
  started: (data: { industry?: string; formCount?: number }) => {
    trackEvent(AnalyticsEvent.CONTACT_FORM_STARTED, data);
  },

  fileUploaded: (data: { fileName: string; fileSize: number; fileType: string }) => {
    trackEvent(AnalyticsEvent.CONTACT_FORM_FILE_UPLOADED, data);
  },

  submitted: (data: { industry: string; formCount: number; hasFile: boolean; timeline: string }) => {
    trackEvent(AnalyticsEvent.CONTACT_FORM_SUBMITTED, data);
  },

  success: (data: { industry: string; formCount: number; hasFile: boolean; timeline: string }) => {
    trackEvent(AnalyticsEvent.CONTACT_FORM_SUCCESS, data);
  },

  error: (data: { industry?: string; formCount?: number; errorMessage: string }) => {
    trackEvent(AnalyticsEvent.CONTACT_FORM_ERROR, data);
  },
};

/**
 * Track pricing calculator interactions
 */
export const PricingCalculatorTracking = {
  used: (data: { pages: number; analysisEnabled: boolean; verificationEnabled: boolean; scanningEnabled: boolean; totalCost: number; currency: string }) => {
    trackEvent(AnalyticsEvent.PRICING_CALCULATOR_USED, data);

    // Track high-volume leads separately
    if (data.pages >= 10000) {
      trackEvent(AnalyticsEvent.PRICING_CALCULATOR_HIGH_VOLUME, {
        pages: data.pages,
        totalCost: data.totalCost,
        currency: data.currency,
      });
    }

    // Track service tier interest
    if (data.analysisEnabled && data.verificationEnabled && data.scanningEnabled) {
      trackEvent(AnalyticsEvent.PRICING_CALCULATOR_FULL_SERVICE, {
        pages: data.pages,
        totalCost: data.totalCost,
      });
    }
  },
};

/**
 * Track locale/currency changes
 */
export const LocaleTracking = {
  currencySwitched: (data: { from: string; to: string }) => {
    trackEvent(AnalyticsEvent.CURRENCY_SWITCHED, data);
  },

  languageSwitched: (data: { from: string; to: string }) => {
    trackEvent(AnalyticsEvent.LANGUAGE_SWITCHED, data);
  },
};

/**
 * Track use case exploration
 */
export const UseCaseTracking = {
  cardClicked: (data: { industry: string; href: string }) => {
    trackEvent(AnalyticsEvent.USE_CASE_CARD_CLICKED, data);
  },
};
