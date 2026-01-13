import { useState, useRef, useEffect } from 'react';
import { LocaleTracking } from '../utils/analytics';

interface SimpleLocaleSwitcherProps {
  initialLocale: 'de' | 'en';
  initialCurrency: 'EUR' | 'CHF';
}

export default function SimpleLocaleSwitcher({ initialLocale, initialCurrency }: SimpleLocaleSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [locale, setLocale] = useState(initialLocale);
  const [currency, setCurrency] = useState(initialCurrency);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Load saved preferences from localStorage
  useEffect(() => {
    const savedLocale = localStorage.getItem('formalogix-locale') as 'de' | 'en' | null;
    const savedRegion = localStorage.getItem('formalogix-region') as 'EU' | 'CH' | null;

    if (savedLocale && savedLocale !== locale) {
      setLocale(savedLocale);
    }
    if (savedRegion) {
      setCurrency(savedRegion === 'CH' ? 'CHF' : 'EUR');
    }
  }, []);

  const handleLanguageChange = (newLocale: 'de' | 'en') => {
    // Track language switch
    if (newLocale !== locale) {
      LocaleTracking.languageSwitched({
        from: locale,
        to: newLocale,
      });
    }

    const currentPath = window.location.pathname;
    let newPath = currentPath;

    // Remove current locale prefix if it exists
    if (currentPath.startsWith('/en/')) {
      newPath = currentPath.replace('/en/', '/');
    } else if (currentPath.startsWith('/en')) {
      newPath = currentPath.replace('/en', '/');
    }

    // Add new locale prefix if not default (de)
    if (newLocale === 'en') {
      newPath = `/en${newPath === '/' ? '' : newPath}`;
    }

    localStorage.setItem('formalogix-locale', newLocale);
    setLocale(newLocale);
    window.location.href = newPath;
  };

  const handleCurrencyChange = (newCurrency: 'EUR' | 'CHF') => {
    // Track currency switch
    if (newCurrency !== currency) {
      LocaleTracking.currencySwitched({
        from: currency,
        to: newCurrency,
      });
    }

    const newRegion = newCurrency === 'CHF' ? 'CH' : 'EU';
    localStorage.setItem('formalogix-region', newRegion);
    setCurrency(newCurrency);
    setIsOpen(false);
    // Dispatch event to notify components
    window.dispatchEvent(new CustomEvent('currencyChanged', { detail: { region: newRegion } }));
  };

  const languages = [
    { code: 'de' as const, label: 'Deutsch', flag: '🇩🇪' },
    { code: 'en' as const, label: 'English', flag: '🇬🇧' },
  ];

  const currencies = [
    { code: 'EUR' as const, label: 'EUR (€)', region: 'EU' },
    { code: 'CHF' as const, label: 'CHF', region: 'CH' },
  ];

  const currentLanguage = languages.find((lang) => lang.code === locale);
  const currentCurrency = currencies.find((curr) => curr.code === currency);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-sm"
        aria-label="Change language and currency"
      >
        <span>{currentLanguage?.flag}</span>
        <span className="font-medium">{currentLanguage?.code.toUpperCase()}</span>
        <span className="text-gray-400">|</span>
        <span className="font-medium">{currentCurrency?.code}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
          {/* Language Selection */}
          <div className="px-4 py-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Language
            </p>
            <div className="space-y-1">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
                    locale === lang.code
                      ? 'bg-formalogix-50 text-formalogix-700'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <span className="text-lg">{lang.flag}</span>
                  <span className="font-medium">{lang.label}</span>
                  {locale === lang.code && (
                    <svg
                      className="w-4 h-4 ml-auto text-formalogix-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-200 my-2"></div>

          {/* Currency Selection */}
          <div className="px-4 py-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Currency / Region
            </p>
            <div className="space-y-1">
              {currencies.map((curr) => (
                <button
                  key={curr.code}
                  onClick={() => handleCurrencyChange(curr.code)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition-colors ${
                    currency === curr.code
                      ? 'bg-formalogix-50 text-formalogix-700'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{curr.label}</span>
                    <span className="text-xs text-gray-500">{curr.region}</span>
                  </div>
                  {currency === curr.code && (
                    <svg
                      className="w-4 h-4 text-formalogix-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
