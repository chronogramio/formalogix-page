import { useState, useEffect } from 'react';
import { getPricingByRegion, formatCurrency, type Region } from '../config/pricing';
import { getTranslations, type Locale } from '../i18n';

interface DynamicPricingBreakdownProps {
  initialLocale: Locale;
  initialRegion: Region;
}

export default function DynamicPricingBreakdown({ initialLocale, initialRegion }: DynamicPricingBreakdownProps) {
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

  const formatPrice = (amount: number) => formatCurrency(amount, pricing.currency, t.locale);

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 max-w-3xl mx-auto">
      <h3 className="text-xl font-bold mb-6 text-gray-900">{t.pricing.title}</h3>
      <div className="space-y-4">
        <div className="flex justify-between items-center pb-4 border-b">
          <div>
            <p className="font-semibold text-gray-900">{t.pricing.services.analysis.name}</p>
            <p className="text-sm text-gray-600">{t.pricing.services.analysis.description}</p>
          </div>
          <p className="text-lg font-bold text-formalogix-500">
            {formatPrice(pricing.analysis)} / {t.pricing.services.analysis.unit}
          </p>
        </div>
        <div className="flex justify-between items-center pb-4 border-b">
          <div>
            <p className="font-semibold text-gray-900">{t.pricing.services.verification.name}</p>
            <p className="text-sm text-gray-600">{t.pricing.services.verification.description}</p>
          </div>
          <p className="text-lg font-bold text-formalogix-500">
            {t.pricing.services.verification.prefix} {formatPrice(pricing.verification)} / {t.pricing.services.verification.unit}
          </p>
        </div>
        <div className="flex justify-between items-center pb-4 border-b">
          <div>
            <p className="font-semibold text-gray-900">{t.pricing.services.scanning.name}</p>
            <p className="text-sm text-gray-600">{t.pricing.services.scanning.description}</p>
          </div>
          <p className="text-lg font-bold text-formalogix-500">
            {formatPrice(pricing.scanning)} / {t.pricing.services.scanning.unit}
          </p>
        </div>
        <div className="flex justify-between items-center pb-4">
          <div>
            <p className="font-semibold text-gray-900">{t.pricing.services.extras.name}</p>
            <p className="text-sm text-gray-600">{t.pricing.services.extras.description}</p>
          </div>
          <p className="text-lg font-bold text-formalogix-500">{t.pricing.services.extras.price}</p>
        </div>
      </div>

      <div className="mt-8 bg-blue-50 p-6 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2">
          {t.pricing.volumeDiscount.title}
        </h4>
        <p className="text-sm text-blue-800">{t.pricing.volumeDiscount.description}</p>
      </div>
    </div>
  );
}
