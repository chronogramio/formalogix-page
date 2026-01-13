import { useEffect } from 'react';
import type { Locale } from '../i18n';
import type { Region, Currency } from '../config/pricing';
import OfferRequestForm from './OfferRequestForm';
import { getTranslations } from '../i18n';

interface OfferRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  calculatorData: {
    pages: number;
    needsAnalysis: boolean;
    needsVerification: boolean;
    needsScanning: boolean;
    totalCost: number;
    region: Region;
    currency: Currency;
  };
  locale: Locale;
}

export default function OfferRequestModal({
  isOpen,
  onClose,
  calculatorData,
  locale,
}: OfferRequestModalProps) {
  const t = getTranslations(locale);

  // Handle ESC key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  // Handle click outside modal
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (isOpen && !target.closest('[data-modal-content]')) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

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
            <h2 className="text-2xl font-bold text-gray-900">
              {t.offerRequest.modalTitle}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {t.offerRequest.modalSubtitle}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold leading-none ml-4"
            aria-label={t.offerRequest.close}
          >
            ×
          </button>
        </div>

        {/* Modal Body */}
        <div className="px-6 py-6">
          <OfferRequestForm
            calculatorData={calculatorData}
            locale={locale}
            onSuccess={onClose}
          />
        </div>
      </div>
    </div>
  );
}
