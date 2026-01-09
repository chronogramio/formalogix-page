import { useState, useEffect } from 'react';

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isUseCasesOpen, setIsUseCasesOpen] = useState(false);

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
              href="#services"
              className="text-gray-700 hover:text-formalogix-500 transition-colors py-2"
              onClick={() => setIsOpen(false)}
            >
              Lösungen
            </a>

            {/* Erfolgsgeschichten Dropdown */}
            <div className="py-2">
              <button
                onClick={() => setIsUseCasesOpen(!isUseCasesOpen)}
                className="text-gray-700 hover:text-formalogix-500 transition-colors flex items-center justify-between w-full"
              >
                <span>Erfolgsgeschichten</span>
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
                    href="#usecases"
                    className="text-gray-600 hover:text-formalogix-500 transition-colors text-sm"
                    onClick={() => setIsOpen(false)}
                  >
                    Übersicht
                  </a>
                  <a
                    href="/use-cases/versicherungen"
                    className="text-gray-600 hover:text-formalogix-500 transition-colors text-sm"
                    onClick={() => setIsOpen(false)}
                  >
                    Versicherungen
                  </a>
                  <a
                    href="/use-cases/bildungswesen"
                    className="text-gray-600 hover:text-formalogix-500 transition-colors text-sm"
                    onClick={() => setIsOpen(false)}
                  >
                    Bildungswesen
                  </a>
                  <a
                    href="/use-cases/gesundheitswesen"
                    className="text-gray-600 hover:text-formalogix-500 transition-colors text-sm"
                    onClick={() => setIsOpen(false)}
                  >
                    Gesundheitswesen
                  </a>
                  <a
                    href="/use-cases/grosshandel"
                    className="text-gray-600 hover:text-formalogix-500 transition-colors text-sm"
                    onClick={() => setIsOpen(false)}
                  >
                    Großhandel
                  </a>
                </div>
              )}
            </div>

            <a
              href="/pricing"
              className="text-gray-700 hover:text-formalogix-500 transition-colors py-2"
              onClick={() => setIsOpen(false)}
            >
              Preise
            </a>
            <a
              href="#contact"
              className="text-gray-700 hover:text-formalogix-500 transition-colors py-2"
              onClick={() => setIsOpen(false)}
            >
              Kontakt
            </a>
            <a
              href="https://app.formalogix.com"
              className="text-gray-700 hover:text-formalogix-500 transition-colors py-2"
              onClick={() => setIsOpen(false)}
            >
              Zur App
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
