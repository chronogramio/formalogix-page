import { useState, useEffect } from 'react';
import { getPricingByRegion, formatCurrency, type Region } from '../config/pricing';
import { getTranslations, type Locale } from '../i18n';

interface DynamicPriceMetricProps {
  initialLocale: Locale;
  initialRegion: Region;
  priceType: 'analysis' | 'verification' | 'scanning';
  showPlus?: boolean;
  className?: string;
}

export default function DynamicPriceMetric({
  initialLocale,
  initialRegion,
  priceType,
  showPlus = false,
  className = ''
}: DynamicPriceMetricProps) {
  const [region, setRegion] = useState<Region>(initialRegion);
  const [locale, setLocale] = useState<Locale>(initialLocale);

  // Sync with localStorage and listen for currency changes
  useEffect(() => {
    const savedRegion = localStorage.getItem('formalogix-region') as Region | null;
    const savedLocale = localStorage.getItem('formalogix-locale') as Locale | null;

    if (savedRegion && savedRegion !== region) {
      setRegion(savedRegion);
    }
    if (savedLocale && savedLocale !== locale) {
      setLocale(savedLocale);
    }

    // Listen for currency changes
    const handleCurrencyChange = (event: CustomEvent) => {
      const newRegion = event.detail.region as Region;
      setRegion(newRegion);
    };

    window.addEventListener('currencyChanged', handleCurrencyChange as EventListener);
    return () => {
      window.removeEventListener('currencyChanged', handleCurrencyChange as EventListener);
    };
  }, []);

  const pricing = getPricingByRegion(region);
  const t = getTranslations(locale);

  // Get the specific price based on priceType
  const price = pricing[priceType];

  // Format the price with currency
  const formattedPrice = formatCurrency(price, pricing.currency, t.locale);

  // Add "+" suffix if requested
  const displayText = showPlus ? `${formattedPrice}+` : formattedPrice;

  return <div className={className}>{displayText}</div>;
}
