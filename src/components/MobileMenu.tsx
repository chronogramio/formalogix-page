import { useState, useEffect } from 'react';
import { getTranslations, type Locale } from '../i18n';

interface MobileMenuProps {
  initialLocale: Locale;
}

export default function MobileMenu({ initialLocale }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isUseCasesOpen, setIsUseCasesOpen] = useState(false);
  const [locale, setLocale] = useState<Locale>(initialLocale);

  // Sync with localStorage for language changes
  useEffect(() => {
    const savedLocale = localStorage.getItem('formalogix-locale') as Locale | null;
    if (savedLocale && savedLocale !== locale) {
      setLocale(savedLocale);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isOpen && !target.closest('[data-mobile-menu]')) {
        setIsOpen(false);
        setIsUseCasesOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
        setIsUseCasesOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const t = getTranslations(locale);

  // Helper to generate locale-aware links
  function getLink(path: string) {
    if (locale === 'en') {
      return `/en${path}`;
    }
    return path;
  }

  return (
    <div className="md:hidden" data-mobile-menu>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 text-gray-700 hover:text-formalogix-500"
        aria-label="Toggle menu"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white border-b border-gray-200 shadow-lg">
          <div className="flex flex-col p-4">
            <a
              href={`${getLink('/')}#services`}
              className="text-gray-700 hover:text-formalogix-500 transition-colors py-2"
              onClick={() => setIsOpen(false)}
            >
              {t.nav.solutions}
            </a>

            {/* Success Stories Dropdown */}
            <div className="py-2">
              <button
                onClick={() => setIsUseCasesOpen(!isUseCasesOpen)}
                className="text-gray-700 hover:text-formalogix-500 transition-colors flex items-center justify-between w-full"
              >
                <span>{t.nav.successStories}</span>
                <svg
                  className={`w-4 h-4 transition-transform ${isUseCasesOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isUseCasesOpen && (
                <div className="ml-4 mt-2 flex flex-col space-y-2">
                  <a
                    href={`${getLink('/')}#usecases`}
                    className="text-gray-600 hover:text-formalogix-500 transition-colors text-sm"
                    onClick={() => setIsOpen(false)}
                  >
                    {locale === 'de' ? 'Übersicht' : 'Overview'}
                  </a>
                  <a
                    href={getLink('/use-cases/gebaudeversicherung')}
                    className="text-gray-600 hover:text-formalogix-500 transition-colors text-sm"
                    onClick={() => setIsOpen(false)}
                  >
                    {locale === 'de' ? 'Gebäudeversicherung' : 'Property Insurance'}
                  </a>
                  <a
                    href={getLink('/use-cases/dsgvo-eventanmeldung')}
                    className="text-gray-600 hover:text-formalogix-500 transition-colors text-sm"
                    onClick={() => setIsOpen(false)}
                  >
                    {locale === 'de' ? 'DSGVO-Eventanmeldung' : 'GDPR Event Registration'}
                  </a>
                  <a
                    href={getLink('/use-cases/messegewinnspiel')}
                    className="text-gray-600 hover:text-formalogix-500 transition-colors text-sm"
                    onClick={() => setIsOpen(false)}
                  >
                    {locale === 'de' ? 'Messegewinnspiel' : 'Trade Fair Raffle'}
                  </a>
                </div>
              )}
            </div>

            <a
              href={getLink('/pricing')}
              className="text-gray-700 hover:text-formalogix-500 transition-colors py-2"
              onClick={() => setIsOpen(false)}
            >
              {t.nav.pricing}
            </a>
            <a
              href="https://app.formalogix.com"
              className="text-gray-700 hover:text-formalogix-500 transition-colors py-2"
              onClick={() => setIsOpen(false)}
            >
              {locale === 'de' ? 'Zur App' : 'Go to App'}
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
