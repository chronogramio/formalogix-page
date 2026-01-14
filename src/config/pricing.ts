export type Region = 'EU' | 'CH';
export type Currency = 'EUR' | 'CHF';

export interface RegionalPricing {
  currency: Currency;
  analysis: number;
  verification: number;
  scanning: number;
}

export const PRICING_CONFIG: Record<Region, RegionalPricing> = {
  EU: {
    currency: 'EUR',
    analysis: 0.10,
    verification: 0.60,
    scanning: 0.30,
  },
  CH: {
    currency: 'CHF',
    analysis: 0.10,
    verification: 0.60,
    scanning: 0.30,
  },
};

// Helper function to get pricing by region
export function getPricingByRegion(region: Region): RegionalPricing {
  return PRICING_CONFIG[region];
}

// Helper function to detect region from locale
export function getRegionFromLocale(locale: string): Region {
  // Swiss locales (de-CH, fr-CH, it-CH, en-CH)
  if (locale.endsWith('-CH') || locale.endsWith('-ch')) {
    return 'CH';
  }
  // Default to EU for all other locales
  return 'EU';
}

// Helper function to format currency
export function formatCurrency(
  amount: number,
  currency: Currency,
  locale: string
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
