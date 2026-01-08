import { useState } from 'react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    company: '',
    homepage: '',
    name: '',
    email: '',
    formCount: '1000',
    message: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // TODO: Implement actual form submission to your backend
    // For now, just simulate a submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      console.log('Form submitted:', { formData, file });

      // Reset form after success
      setTimeout(() => {
        setFormData({
          company: '',
          homepage: '',
          name: '',
          email: '',
          formCount: '1000',
          message: '',
        });
        setFile(null);
        setSubmitStatus('idle');
      }, 3000);
    }, 1500);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
            Ihr Unternehmen *
          </label>
          <input
            type="text"
            id="company"
            required
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
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
            Name *
          </label>
          <input
            type="text"
            id="name"
            required
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
          Wie viele Formulare verarbeiten Sie monatlich? *
        </label>
        <select
          id="formCount"
          required
          value={formData.formCount}
          onChange={(e) => setFormData({ ...formData, formCount: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-formalogix-500 focus:border-transparent outline-none"
        >
          <option value="50">50</option>
          <option value="1000">1.000</option>
          <option value="100000">100.000</option>
          <option value="custom">Andere Anzahl</option>
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
