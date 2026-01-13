import { useState } from 'react';
import type { Locale } from '../i18n';
import type { Region, Currency } from '../config/pricing';
import { getTranslations } from '../i18n';
import { formatCurrency, getPricingByRegion } from '../config/pricing';

interface OfferRequestFormProps {
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
  onSuccess: () => void;
}

export default function OfferRequestForm({
  calculatorData,
  locale,
  onSuccess,
}: OfferRequestFormProps) {
  const t = getTranslations(locale);

  // Editable calculator data
  const [pages, setPages] = useState(calculatorData.pages);
  const [needsAnalysis, setNeedsAnalysis] = useState(calculatorData.needsAnalysis);
  const [needsVerification, setNeedsVerification] = useState(calculatorData.needsVerification);
  const [needsScanning, setNeedsScanning] = useState(calculatorData.needsScanning);

  const [formData, setFormData] = useState({
    pageSize: '',
    pageSizeOther: '',
    documentCondition: '',
    industry: '',
    urgency: '',
    urgencyDate: '',
    company: '',
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Get pricing configuration
  const pricing = getPricingByRegion(calculatorData.region);

  // Calculate costs based on current state
  const analysisCost = needsAnalysis ? pages * pricing.analysis : 0;
  const verificationCost = needsVerification ? pages * pricing.verification : 0;
  const scanningCost = needsScanning ? pages * pricing.scanning : 0;
  const totalCost = analysisCost + verificationCost + scanningCost;

  // Get selected services as array
  const getSelectedServices = (): string[] => {
    const services: string[] = [];
    if (needsAnalysis) services.push('analysis');
    if (needsVerification) services.push('verification');
    if (needsScanning) services.push('scanning');
    return services;
  };

  // Validate form
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = t.offerRequest.form.name + ' is required';
    }

    if (!formData.email.trim()) {
      errors.email = t.offerRequest.form.email + ' is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Invalid email format';
    }

    if (formData.pageSize === 'other' && !formData.pageSizeOther.trim()) {
      errors.pageSizeOther = t.offerRequest.form.pageSize.otherPlaceholder;
    }

    if (formData.urgency === 'specificDate' && !formData.urgencyDate) {
      errors.urgencyDate = t.offerRequest.form.urgency.datePlaceholder;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Create FormData for API submission
      const formDataToSend = new FormData();

      // Calculator data (use current edited values)
      formDataToSend.append('pages', pages.toString());
      formDataToSend.append('services', JSON.stringify(getSelectedServices()));
      formDataToSend.append('totalCost', totalCost.toFixed(2));
      formDataToSend.append('currency', calculatorData.currency);

      // Document details
      formDataToSend.append('pageSize', formData.pageSize);
      formDataToSend.append('pageSizeOther', formData.pageSizeOther);
      formDataToSend.append('documentCondition', formData.documentCondition);

      // Business context
      formDataToSend.append('industry', formData.industry);
      formDataToSend.append('urgency', formData.urgency);
      formDataToSend.append('urgencyDate', formData.urgencyDate);

      // Contact info
      formDataToSend.append('company', formData.company);
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('message', formData.message);

      // File attachment
      if (file) {
        formDataToSend.append('file', file);
      }

      const apiUrl = import.meta.env.PUBLIC_API_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/api/offer-request`, {
        method: 'POST',
        body: formDataToSend,
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setIsSubmitting(false);
        setSubmitStatus('success');

        // Reset form after success
        setTimeout(() => {
          setFormData({
            pageSize: '',
            pageSizeOther: '',
            documentCondition: '',
            industry: '',
            urgency: '',
            urgencyDate: '',
            company: '',
            name: '',
            email: '',
            phone: '',
            message: '',
          });
          setFile(null);
          setSubmitStatus('idle');
          onSuccess(); // Close modal
        }, 5000);
      } else {
        throw new Error(result.error || 'Form submission failed');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setIsSubmitting(false);
      setSubmitStatus('error');

      // Reset error message after 5 seconds
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);
    }
  };

  // Handle file change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Editable Calculator */}
      <div className="bg-formalogix-50 border border-formalogix-200 rounded-lg p-4">
        <h3 className="font-semibold text-formalogix-900 mb-3">
          {t.offerRequest.calculatorSummary.title}
        </h3>

        {/* Number of Pages Slider */}
        <div className="mb-4">
          <label htmlFor="modal-pages" className="block text-sm font-medium text-gray-700 mb-2">
            {t.calculator.pagesLabel}: {pages.toLocaleString(locale)}
          </label>
          <input
            type="range"
            id="modal-pages"
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

        {/* Services Checkboxes */}
        <div className="space-y-2 mb-3">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="modal-analysis"
              checked={needsAnalysis}
              onChange={(e) => setNeedsAnalysis(e.target.checked)}
              className="w-4 h-4 text-formalogix-500 border-gray-300 rounded focus:ring-formalogix-500"
            />
            <label htmlFor="modal-analysis" className="ml-2 text-sm text-gray-700">
              {t.calculator.services.analysis}
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="modal-verification"
              checked={needsVerification}
              onChange={(e) => setNeedsVerification(e.target.checked)}
              className="w-4 h-4 text-formalogix-500 border-gray-300 rounded focus:ring-formalogix-500"
            />
            <label htmlFor="modal-verification" className="ml-2 text-sm text-gray-700">
              {t.calculator.services.verification}
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="modal-scanning"
              checked={needsScanning}
              onChange={(e) => setNeedsScanning(e.target.checked)}
              className="w-4 h-4 text-formalogix-500 border-gray-300 rounded focus:ring-formalogix-500"
            />
            <label htmlFor="modal-scanning" className="ml-2 text-sm text-gray-700">
              {t.calculator.services.scanning}
            </label>
          </div>
        </div>

        {/* Cost Summary */}
        <div className="border-t border-formalogix-200 pt-2 mt-2">
          <div className="flex justify-between">
            <span className="text-gray-900 font-semibold">
              {t.offerRequest.calculatorSummary.estimatedCost}:
            </span>
            <span className="font-bold text-formalogix-600">
              {formatCurrency(totalCost, calculatorData.currency, locale)}
            </span>
          </div>
        </div>
      </div>

      {/* Document Details */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {t.offerRequest.form.documentDetails}
        </h3>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Page Size */}
          <div>
            <label htmlFor="pageSize" className="block text-sm font-medium text-gray-700 mb-2">
              {t.offerRequest.form.pageSize.label}
            </label>
            <select
              id="pageSize"
              value={formData.pageSize}
              onChange={(e) => setFormData({ ...formData, pageSize: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-formalogix-500 focus:border-transparent outline-none"
            >
              <option value="">{t.offerRequest.form.pageSize.placeholder}</option>
              <option value="a5">{t.offerRequest.form.pageSize.options.a5}</option>
              <option value="a4">{t.offerRequest.form.pageSize.options.a4}</option>
              <option value="a3">{t.offerRequest.form.pageSize.options.a3}</option>
              <option value="other">{t.offerRequest.form.pageSize.options.other}</option>
            </select>
          </div>

          {/* Page Size Other */}
          {formData.pageSize === 'other' && (
            <div>
              <label
                htmlFor="pageSizeOther"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {t.offerRequest.form.pageSize.otherPlaceholder}
              </label>
              <input
                type="text"
                id="pageSizeOther"
                value={formData.pageSizeOther}
                onChange={(e) => setFormData({ ...formData, pageSizeOther: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 outline-none ${
                  formErrors.pageSizeOther
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-formalogix-500'
                }`}
                placeholder={t.offerRequest.form.pageSize.otherPlaceholder}
              />
              {formErrors.pageSizeOther && (
                <p className="mt-1 text-sm text-red-600">{formErrors.pageSizeOther}</p>
              )}
            </div>
          )}
        </div>

        {/* Document Condition */}
        <div className="mt-4">
          <label
            htmlFor="documentCondition"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {t.offerRequest.form.documentCondition.label}
          </label>
          <select
            id="documentCondition"
            value={formData.documentCondition}
            onChange={(e) => setFormData({ ...formData, documentCondition: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-formalogix-500 focus:border-transparent outline-none"
          >
            <option value="">{t.offerRequest.form.documentCondition.placeholder}</option>
            <option value="pristine">
              {t.offerRequest.form.documentCondition.options.pristine}
            </option>
            <option value="good">{t.offerRequest.form.documentCondition.options.good}</option>
            <option value="worn">{t.offerRequest.form.documentCondition.options.worn}</option>
            <option value="crumpled">
              {t.offerRequest.form.documentCondition.options.crumpled}
            </option>
            <option value="waterDamaged">
              {t.offerRequest.form.documentCondition.options.waterDamaged}
            </option>
            <option value="bound">{t.offerRequest.form.documentCondition.options.bound}</option>
            <option value="stapled">
              {t.offerRequest.form.documentCondition.options.stapled}
            </option>
            <option value="loose">{t.offerRequest.form.documentCondition.options.loose}</option>
          </select>
        </div>
      </div>

      {/* Business Context */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {t.offerRequest.form.businessContext}
        </h3>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Industry */}
          <div>
            <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-2">
              {t.offerRequest.form.industry.label}
            </label>
            <select
              id="industry"
              value={formData.industry}
              onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-formalogix-500 focus:border-transparent outline-none"
            >
              <option value="">{t.offerRequest.form.industry.placeholder}</option>
              <option value="insurance">
                {t.offerRequest.form.industry.options.insurance}
              </option>
              <option value="education">
                {t.offerRequest.form.industry.options.education}
              </option>
              <option value="healthcare">
                {t.offerRequest.form.industry.options.healthcare}
              </option>
              <option value="wholesale">
                {t.offerRequest.form.industry.options.wholesale}
              </option>
              <option value="publicAdmin">
                {t.offerRequest.form.industry.options.publicAdmin}
              </option>
              <option value="other">{t.offerRequest.form.industry.options.other}</option>
            </select>
          </div>

          {/* Urgency */}
          <div>
            <label htmlFor="urgency" className="block text-sm font-medium text-gray-700 mb-2">
              {t.offerRequest.form.urgency.label}
            </label>
            <select
              id="urgency"
              value={formData.urgency}
              onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-formalogix-500 focus:border-transparent outline-none"
            >
              <option value="">{t.offerRequest.form.urgency.placeholder}</option>
              <option value="within24h">{t.offerRequest.form.urgency.options.within24h}</option>
              <option value="within1week">
                {t.offerRequest.form.urgency.options.within1week}
              </option>
              <option value="within1month">
                {t.offerRequest.form.urgency.options.within1month}
              </option>
              <option value="flexible">{t.offerRequest.form.urgency.options.flexible}</option>
              <option value="specificDate">
                {t.offerRequest.form.urgency.options.specificDate}
              </option>
            </select>
          </div>
        </div>

        {/* Urgency Date */}
        {formData.urgency === 'specificDate' && (
          <div className="mt-4">
            <label
              htmlFor="urgencyDate"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {t.offerRequest.form.urgency.datePlaceholder}
            </label>
            <input
              type="date"
              id="urgencyDate"
              value={formData.urgencyDate}
              onChange={(e) => setFormData({ ...formData, urgencyDate: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 outline-none ${
                formErrors.urgencyDate
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-formalogix-500'
              }`}
            />
            {formErrors.urgencyDate && (
              <p className="mt-1 text-sm text-red-600">{formErrors.urgencyDate}</p>
            )}
          </div>
        )}
      </div>

      {/* Contact Information */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {t.offerRequest.form.contactInfo}
        </h3>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Company */}
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
              {t.offerRequest.form.company}
            </label>
            <input
              type="text"
              id="company"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-formalogix-500 focus:border-transparent outline-none"
              placeholder={t.offerRequest.form.companyPlaceholder}
            />
          </div>

          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              {t.offerRequest.form.name} *
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 outline-none ${
                formErrors.name
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-formalogix-500'
              }`}
              placeholder={t.offerRequest.form.namePlaceholder}
            />
            {formErrors.name && <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              {t.offerRequest.form.email} *
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 outline-none ${
                formErrors.email
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-formalogix-500'
              }`}
              placeholder={t.offerRequest.form.emailPlaceholder}
            />
            {formErrors.email && <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>}
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              {t.offerRequest.form.phone}
            </label>
            <input
              type="tel"
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-formalogix-500 focus:border-transparent outline-none"
              placeholder={t.offerRequest.form.phonePlaceholder}
            />
          </div>
        </div>

        {/* Message */}
        <div className="mt-4">
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
            {t.offerRequest.form.message}
          </label>
          <textarea
            id="message"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-formalogix-500 focus:border-transparent outline-none"
            placeholder={t.offerRequest.form.messagePlaceholder}
          />
        </div>

        {/* File Upload */}
        <div className="mt-4">
          <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-2">
            {t.offerRequest.form.fileUpload}
          </label>
          <input
            type="file"
            id="file"
            onChange={handleFileChange}
            accept=".pdf,.jpg,.jpeg,.png"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-formalogix-500 focus:border-transparent outline-none"
          />
          {file && (
            <p className="mt-2 text-sm text-gray-600">
              Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
            </p>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-formalogix-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-formalogix-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? t.offerRequest.form.submitting : t.offerRequest.form.submitButton}
        </button>

        {/* Success Message */}
        {submitStatus === 'success' && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800">{t.offerRequest.form.successMessage}</p>
          </div>
        )}

        {/* Error Message */}
        {submitStatus === 'error' && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{t.offerRequest.form.errorMessage}</p>
          </div>
        )}
      </div>
    </form>
  );
}
