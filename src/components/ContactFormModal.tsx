import { useState, useEffect } from 'react';
import ContactForm from './ContactForm';
import { getTranslations } from '../i18n';

export default function ContactFormModal() {
  const [isOpen, setIsOpen] = useState(false);
  // Default to German, will be updated based on URL path
  const [locale, setLocale] = useState<'de' | 'en'>('de');

  // Detect locale from URL
  useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith('/en/')) {
      setLocale('en');
    } else {
      setLocale('de');
    }
  }, []);

  const t = getTranslations(locale);

  // Listen for openContactModal event
  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
    };

    window.addEventListener('openContactModal', handleOpen);

    return () => {
      window.removeEventListener('openContactModal', handleOpen);
    };
  }, []);

  // Handle ESC key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  // Handle click outside modal
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (isOpen && !target.closest('[data-modal-content]')) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div
        data-modal-content
        className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{t.contactModal.modalTitle}</h2>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold leading-none ml-4"
            aria-label={t.contactModal.close}
          >
            ×
          </button>
        </div>

        {/* Modal Body */}
        <div className="px-6 py-6">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
