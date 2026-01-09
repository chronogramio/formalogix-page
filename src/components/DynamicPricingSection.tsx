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

  function getLink(path: string) {
    return locale === 'en' ? `/en${path}` : path;
  }

  return (
    <section id="pricing" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-900">
          {t.pricing.title}
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto text-lg">
          {t.pricing.subtitle}
        </p>

        {/* Modular Pricing Breakdown */}
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-12">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border-l-4 border-formalogix-500 pl-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-gray-900">
                  {t.pricing.services.analysis.name}
                </span>
                <span className="text-lg font-bold text-formalogix-600">
                  {formatPrice(pricing.analysis)} / {t.pricing.services.analysis.unit}
                </span>
              </div>
              <p className="text-sm text-gray-600">{t.pricing.services.analysis.description}</p>
            </div>

            <div className="border-l-4 border-formalogix-500 pl-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-gray-900">
                  {t.pricing.services.verification.name}
                </span>
                <span className="text-lg font-bold text-formalogix-600">
                  {t.pricing.services.verification.prefix} {formatPrice(pricing.verification)} /{' '}
                  {t.pricing.services.verification.unit}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                {t.pricing.services.verification.description}
              </p>
            </div>

            <div className="border-l-4 border-formalogix-500 pl-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-gray-900">
                  {t.pricing.services.scanning.name}
                </span>
                <span className="text-lg font-bold text-formalogix-600">
                  {formatPrice(pricing.scanning)} / {t.pricing.services.scanning.unit}
                </span>
              </div>
              <p className="text-sm text-gray-600">{t.pricing.services.scanning.description}</p>
            </div>

            <div className="border-l-4 border-formalogix-500 pl-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-gray-900">
                  {t.pricing.services.extras.name}
                </span>
                <span className="text-lg font-bold text-formalogix-600">
                  {t.pricing.services.extras.price}
                </span>
              </div>
              <p className="text-sm text-gray-600">{t.pricing.services.extras.description}</p>
            </div>
          </div>

          <div className="mt-8 bg-blue-50 p-6 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">
              💰 {t.pricing.volumeDiscount.title}
            </h4>
            <p className="text-sm text-blue-800">{t.pricing.volumeDiscount.description}</p>
          </div>
        </div>

        {/* CTA to detailed pricing page */}
        <div className="text-center">
          <a
            href={getLink('/pricing')}
            className="inline-flex items-center text-formalogix-600 hover:text-formalogix-700 font-semibold text-lg"
          >
            {t.pricing.detailedCalculator}
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
