import { useState, useEffect } from 'react';
import { getPricingByRegion, formatCurrency, getRegionFromLocale } from '../config/pricing';
import { getTranslations } from '../i18n';
import type { Region, Currency } from '../config/pricing';
import type { Locale } from '../i18n';

interface SimplePricingCalculatorProps {
  initialLocale: Locale;
  initialRegion: Region;
}

export default function SimplePricingCalculator({ initialLocale, initialRegion }: SimplePricingCalculatorProps) {
  const [pages, setPages] = useState(1000);
  const [needsAnalysis, setNeedsAnalysis] = useState(true);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [needsScanning, setNeedsScanning] = useState(false);
  const [region, setRegion] = useState<Region>(initialRegion);
  const [locale, setLocale] = useState<Locale>(initialLocale);

  // Sync with localStorage
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

  const analysisCost = needsAnalysis ? pages * pricing.analysis : 0;
  const verificationCost = needsVerification ? pages * pricing.verification : 0;
  const scanningCost = needsScanning ? pages * pricing.scanning : 0;
  const totalCost = analysisCost + verificationCost + scanningCost;

  const formatPrice = (amount: number) => formatCurrency(amount, pricing.currency, t.locale);

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
      <h3 className="text-2xl font-bold mb-6 text-gray-900">{t.calculator.title}</h3>

      <div className="space-y-6">
        <div>
          <label htmlFor="pages" className="block text-sm font-medium text-gray-700 mb-2">
            {t.calculator.pagesLabel}: {pages.toLocaleString(t.locale)}
          </label>
          <input
            type="range"
            id="pages"
            min="50"
            max="100000"
            step="50"
            value={pages}
            onChange={(e) => setPages(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-formalogix-500"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>50</span>
            <span>100.000</span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="analysis"
              checked={needsAnalysis}
              onChange={(e) => setNeedsAnalysis(e.target.checked)}
              className="w-4 h-4 text-formalogix-500 border-gray-300 rounded focus:ring-formalogix-500"
            />
            <label htmlFor="analysis" className="ml-3 text-sm text-gray-700">
              {t.calculator.services.analysis} ({formatPrice(pricing.analysis)} {t.common.perPage})
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="verification"
              checked={needsVerification}
              onChange={(e) => setNeedsVerification(e.target.checked)}
              className="w-4 h-4 text-formalogix-500 border-gray-300 rounded focus:ring-formalogix-500"
            />
            <label htmlFor="verification" className="ml-3 text-sm text-gray-700">
              {t.calculator.services.verification} ({t.pricing.services.verification.prefix} {formatPrice(pricing.verification)} {t.common.perPage})
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="scanning"
              checked={needsScanning}
              onChange={(e) => setNeedsScanning(e.target.checked)}
              className="w-4 h-4 text-formalogix-500 border-gray-300 rounded focus:ring-formalogix-500"
            />
            <label htmlFor="scanning" className="ml-3 text-sm text-gray-700">
              {t.calculator.services.scanning} ({formatPrice(pricing.scanning)} {t.common.perPage})
            </label>
          </div>
        </div>

        <div className="border-t pt-6 mt-6">
          <div className="space-y-2 text-sm">
            {needsAnalysis && (
              <div className="flex justify-between">
                <span className="text-gray-600">{t.calculator.costBreakdown.analysis}:</span>
                <span className="font-medium">{formatPrice(analysisCost)}</span>
              </div>
            )}
            {needsVerification && (
              <div className="flex justify-between">
                <span className="text-gray-600">{t.calculator.costBreakdown.verification}:</span>
                <span className="font-medium">{formatPrice(verificationCost)}</span>
              </div>
            )}
            {needsScanning && (
              <div className="flex justify-between">
                <span className="text-gray-600">{t.calculator.costBreakdown.scanning}:</span>
                <span className="font-medium">{formatPrice(scanningCost)}</span>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center mt-4 pt-4 border-t">
            <span className="text-lg font-bold text-gray-900">{t.calculator.costBreakdown.total}:</span>
            <span className="text-2xl font-bold text-formalogix-500">
              {formatPrice(totalCost)}
            </span>
          </div>

          <p className="text-xs text-gray-500 mt-4">
            {t.calculator.disclaimer}
          </p>
        </div>
      </div>
    </div>
  );
}
