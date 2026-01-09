import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { type Locale, getTranslations, type Translations } from '../i18n';
import {
  type Region,
  type Currency,
  getPricingByRegion,
  type RegionalPricing,
  getRegionFromLocale,
  formatCurrency
} from '../config/pricing';

interface LocaleContextType {
  locale: Locale;
  region: Region;
  currency: Currency;
  translations: Translations;
  pricing: RegionalPricing;
  setCurrency: (currency: Currency) => void;
  setLocale: (locale: Locale) => void;
  formatPrice: (amount: number) => string;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

interface LocaleProviderProps {
  children: ReactNode;
  initialLocale: Locale;
  initialRegion?: Region;
}

export function LocaleProvider({ children, initialLocale, initialRegion }: LocaleProviderProps) {
  // Initialize from initialLocale/initialRegion for SSR, then sync with localStorage on client
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const [region, setRegion] = useState<Region>(initialRegion || getRegionFromLocale(initialLocale));

  // Sync with localStorage on client mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLocale = localStorage.getItem('formalogix-locale') as Locale | null;
      const savedRegion = localStorage.getItem('formalogix-region') as Region | null;

      if (savedLocale && savedLocale !== locale) {
        setLocaleState(savedLocale);
      }
      if (savedRegion && savedRegion !== region) {
        setRegion(savedRegion);
      }
    }
  }, []);

  // Get translations and pricing for current locale/region
  const translations = getTranslations(locale);
  const pricing = getPricingByRegion(region);

  // Save to localStorage when changed
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('formalogix-locale', locale);
    }
  }, [locale]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('formalogix-region', region);
    }
  }, [region]);

  // Handle currency change
  const setCurrency = (currency: Currency) => {
    const newRegion: Region = currency === 'CHF' ? 'CH' : 'EU';
    setRegion(newRegion);
  };

  // Handle locale change (should trigger page navigation in Astro)
  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    // In a real implementation, this would navigate to the new locale's URL
    // For now, we just save it and the parent will handle navigation
  };

  // Format price helper
  const formatPrice = (amount: number): string => {
    return formatCurrency(amount, pricing.currency, translations.locale);
  };

  const value: LocaleContextType = {
    locale,
    region,
    currency: pricing.currency,
    translations,
    pricing,
    setCurrency,
    setLocale,
    formatPrice,
  };

  return (
    <LocaleContext.Provider value={value}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextType {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
}
