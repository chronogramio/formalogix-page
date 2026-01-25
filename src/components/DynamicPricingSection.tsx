import { useState, useEffect } from 'react';
import { getPricingByRegion, formatCurrency, type Region } from '../config/pricing';
import { getTranslations, type Locale } from '../i18n';

interface DynamicPricingSectionProps {
  initialLocale: Locale;
  initialRegion: Region;
}

export default function DynamicPricingSection({ initialLocale, initialRegion }: DynamicPricingSectionProps) {
  const [region, setRegion] = useState<Region>(initialRegion);
  const [locale, setLocale] = useState<Locale>(initialLocale);

  // Load saved currency from localStorage
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
    <section id="pricing" className="min-h-screen py-24 bg-gray-50 flex flex-col justify-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6">
          <span className="section-badge bg-blue-100 text-blue-800">Transparent & Fair</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 text-gray-900">
          {t.pricing.title}
        </h2>
        <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto text-lg">
          {t.pricing.subtitle}
        </p>

        {/* Vertical Pricing List (matching pricing page) */}
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-3xl mx-auto mb-12">
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-4 border-b">
              <div className="flex-1">
                <p className="font-semibold text-gray-900 mb-1">
                  {t.pricing.services.analysis.name}
                </p>
                <p className="text-sm text-gray-600">{t.pricing.services.analysis.description}</p>
              </div>
              <div className="ml-8 text-right flex-shrink-0">
                <p className="text-lg font-bold text-formalogix-500">
                  {t.pricing.services.analysis.prefix} {formatPrice(pricing.analysis)}
                </p>
                <p className="text-sm text-gray-500">{t.pricing.services.analysis.unit}</p>
              </div>
            </div>

            <div className="flex justify-between items-center pb-4 border-b">
              <div className="flex-1">
                <p className="font-semibold text-gray-900 mb-1">
                  {t.pricing.services.verification.name}
                </p>
                <p className="text-sm text-gray-600">
                  {t.pricing.services.verification.description}
                </p>
              </div>
              <div className="ml-8 text-right flex-shrink-0">
                <p className="text-lg font-bold text-formalogix-500">
                  {t.pricing.services.verification.prefix} {formatPrice(pricing.verification)}
                </p>
                <p className="text-sm text-gray-500">{t.pricing.services.verification.unit}</p>
              </div>
            </div>

            <div className="flex justify-between items-center pb-4 border-b">
              <div className="flex-1">
                <p className="font-semibold text-gray-900 mb-1">
                  {t.pricing.services.scanning.name}
                </p>
                <p className="text-sm text-gray-600">{t.pricing.services.scanning.description}</p>
              </div>
              <div className="ml-8 text-right flex-shrink-0">
                <p className="text-lg font-bold text-formalogix-500">
                  {t.pricing.services.scanning.prefix} {formatPrice(pricing.scanning)}
                </p>
                <p className="text-sm text-gray-500">{t.pricing.services.scanning.unit}</p>
              </div>
            </div>

            <div className="flex justify-between items-center pb-4">
              <div className="flex-1">
                <p className="font-semibold text-gray-900 mb-1">
                  {t.pricing.services.extras.name}
                </p>
                <p className="text-sm text-gray-600">{t.pricing.services.extras.description}</p>
              </div>
              <div className="ml-8 text-right flex-shrink-0">
                <p className="text-lg font-bold text-formalogix-500">
                  {t.pricing.services.extras.price}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-blue-50 p-6 rounded-lg border-2 border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2">
              {t.pricing.volumeDiscount.title}
            </h4>
            <p className="text-sm text-blue-800">{t.pricing.volumeDiscount.description}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
