import { useState } from 'react';
import { ContactFormTracking } from '../utils/analytics';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    company: '',
    homepage: '',
    name: '',
    email: '',
    formCount: 1000,
    industry: '',
    timeline: '',
    currentSolution: '',
    message: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [formStarted, setFormStarted] = useState(false);

  // Track form start on first interaction
  const handleFormStart = () => {
    if (!formStarted) {
      ContactFormTracking.started({
        industry: formData.industry || undefined,
        formCount: formData.formCount,
      });
      setFormStarted(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Track form submission attempt
    const trackingData = {
      industry: formData.industry,
      formCount: formData.formCount,
      hasFile: !!file,
      timeline: formData.timeline,
    };
    ContactFormTracking.submitted(trackingData);

    try {
      // Create FormData for API submission
      const formDataToSend = new FormData();
      formDataToSend.append('company', formData.company);
      formDataToSend.append('homepage', formData.homepage);
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('formCount', formData.formCount.toString());
      formDataToSend.append('industry', formData.industry);
      formDataToSend.append('timeline', formData.timeline);
      formDataToSend.append('currentSolution', formData.currentSolution);
      formDataToSend.append('message', formData.message);

      if (file) {
        formDataToSend.append('file', file);
      }

      const apiUrl = import.meta.env.PUBLIC_API_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/api/contact`, {
        method: 'POST',
        body: formDataToSend
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Track successful submission
        ContactFormTracking.success(trackingData);

        setIsSubmitting(false);
        setSubmitStatus('success');

        // Reset form after success
        setTimeout(() => {
          setFormData({
            company: '',
            homepage: '',
            name: '',
            email: '',
            formCount: 1000,
            industry: '',
            timeline: '',
            currentSolution: '',
            message: '',
          });
          setFile(null);
          setSubmitStatus('idle');
          setFormStarted(false);
        }, 5000);
      } else {
        throw new Error(result.error || 'Form submission failed');
      }
    } catch (error) {
      console.error('Form submission error:', error);

      // Track error
      ContactFormTracking.error({
        industry: formData.industry || undefined,
        formCount: formData.formCount,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      });

      setIsSubmitting(false);
      setSubmitStatus('error');

      // Reset error message after 5 seconds
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);

      // Track file upload
      ContactFormTracking.fileUploaded({
        fileName: selectedFile.name,
        fileSize: selectedFile.size,
        fileType: selectedFile.type,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
            Ihr Unternehmen
          </label>
          <input
            type="text"
            id="company"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            onFocus={handleFormStart}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-formalogix-500 focus:border-transparent outline-none"
          />
        </div>

        <div>
          <label htmlFor="homepage" className="block text-sm font-medium text-gray-700 mb-2">
            Homepage
          </label>
          <input
            type="url"
            id="homepage"
            value={formData.homepage}
            onChange={(e) => setFormData({ ...formData, homepage: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-formalogix-500 focus:border-transparent outline-none"
          />
        </div>

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-formalogix-500 focus:border-transparent outline-none"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            E-Mail *
          </label>
          <input
            type="email"
            id="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-formalogix-500 focus:border-transparent outline-none"
          />
        </div>
      </div>

      <div>
        <label htmlFor="formCount" className="block text-sm font-medium text-gray-700 mb-2">
          Wie viele Formulare verarbeiten Sie monatlich?
        </label>
        <div className="space-y-2">
          <input
            type="range"
            id="formCount"
            min="50"
            max="100000"
            step="50"
            value={formData.formCount}
            onChange={(e) => setFormData({ ...formData, formCount: parseInt(e.target.value) })}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-formalogix-500"
          />
          <div className="text-center text-lg font-semibold text-formalogix-600">
            {formData.formCount.toLocaleString('de-DE')}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-2">
            Branche
          </label>
          <select
            id="industry"
            value={formData.industry}
            onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-formalogix-500 focus:border-transparent outline-none"
          >
            <option value="">Bitte wählen</option>
            <option value="versicherung">Versicherung</option>
            <option value="bildung">Bildung</option>
            <option value="gesundheitswesen">Gesundheitswesen</option>
            <option value="grosshandel">Großhandel</option>
            <option value="oeffentlich">Öffentliche Verwaltung</option>
            <option value="andere">Andere</option>
          </select>
        </div>

        <div>
          <label htmlFor="timeline" className="block text-sm font-medium text-gray-700 mb-2">
            Wann möchten Sie starten?
          </label>
          <select
            id="timeline"
            value={formData.timeline}
            onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-formalogix-500 focus:border-transparent outline-none"
          >
            <option value="">Bitte wählen</option>
            <option value="sofort">Sofort</option>
            <option value="innerhalb-monat">Innerhalb eines Monats</option>
            <option value="naechstes-quartal">Nächstes Quartal</option>
            <option value="nur-infos">Nur Informationen</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="currentSolution" className="block text-sm font-medium text-gray-700 mb-2">
          Wie verarbeiten Sie aktuell Formulare?
        </label>
        <select
          id="currentSolution"
          value={formData.currentSolution}
          onChange={(e) => setFormData({ ...formData, currentSolution: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-formalogix-500 focus:border-transparent outline-none"
        >
          <option value="">Bitte wählen</option>
          <option value="manuell">Manuell</option>
          <option value="outsourcing">Outsourcing</option>
          <option value="ocr-software">OCR-Software</option>
          <option value="andere">Andere</option>
        </select>
      </div>

      <div>
        <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-2">
          Beispiel des Formulars hochladen
        </label>
        <input
          type="file"
          id="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-formalogix-500 focus:border-transparent outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-formalogix-50 file:text-formalogix-600 hover:file:bg-formalogix-100"
        />
        {file && <p className="mt-2 text-sm text-gray-600">Ausgewählt: {file.name}</p>}
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
          Beschreiben Sie kurz Ihre Herausforderung *
        </label>
        <textarea
          id="message"
          required
          rows={5}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-formalogix-500 focus:border-transparent outline-none resize-none"
        />
      </div>

      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-formalogix-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-formalogix-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Wird gesendet...' : 'Anfrage senden'}
        </button>
        {submitStatus === 'success' && (
          <p className="mt-4 text-formalogix-500 text-center font-medium">
            ✓ Vielen Dank! Wir melden uns bald bei Ihnen.
          </p>
        )}
        {submitStatus === 'error' && (
          <p className="mt-4 text-red-600 text-center font-medium">
            Fehler beim Senden. Bitte versuchen Sie es erneut.
          </p>
        )}
      </div>
    </form>
  );
}
