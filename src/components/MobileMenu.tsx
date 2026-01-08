import { useState } from 'react';

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-700 hover:text-formalogix-500"
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
          <div className="flex flex-col space-y-4 p-4">
            <a
              href="#services"
              className="text-gray-700 hover:text-formalogix-500 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Services
            </a>
            <a
              href="#usecases"
              className="text-gray-700 hover:text-formalogix-500 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Anwendungsfälle
            </a>
            <a
              href="#pricing"
              className="text-gray-700 hover:text-formalogix-500 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Preise
            </a>
            <a
              href="#contact"
              className="text-gray-700 hover:text-formalogix-500 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Kontakt
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
