import { useState } from 'react';

export default function PricingCalculator() {
  const [pages, setPages] = useState(1000);
  const [needsAnalysis, setNeedsAnalysis] = useState(true);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [needsScanning, setNeedsScanning] = useState(false);

  const analysisCost = needsAnalysis ? pages * 0.10 : 0;
  const verificationCost = needsVerification ? pages * 0.60 : 0;
  const scanningCost = needsScanning ? pages * 0.30 : 0;
  const totalCost = analysisCost + verificationCost + scanningCost;

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
      <h3 className="text-2xl font-bold mb-6 text-gray-900">Kostenkalkulator</h3>

      <div className="space-y-6">
        <div>
          <label htmlFor="pages" className="block text-sm font-medium text-gray-700 mb-2">
            Anzahl Seiten: {pages.toLocaleString('de-DE')}
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
              Analysieren (0,10 € pro Seite)
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
              Durch Menschen verifizieren (ab 0,60 € pro Seite)
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
              Scannen (0,30 € pro Seite)
            </label>
          </div>
        </div>

        <div className="border-t pt-6 mt-6">
          <div className="space-y-2 text-sm">
            {needsAnalysis && (
              <div className="flex justify-between">
                <span className="text-gray-600">Analyse:</span>
                <span className="font-medium">{analysisCost.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</span>
              </div>
            )}
            {needsVerification && (
              <div className="flex justify-between">
                <span className="text-gray-600">Verifikation:</span>
                <span className="font-medium">{verificationCost.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</span>
              </div>
            )}
            {needsScanning && (
              <div className="flex justify-between">
                <span className="text-gray-600">Scannen:</span>
                <span className="font-medium">{scanningCost.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</span>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center mt-4 pt-4 border-t">
            <span className="text-lg font-bold text-gray-900">Gesamtkosten:</span>
            <span className="text-2xl font-bold text-formalogix-500">
              {totalCost.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
            </span>
          </div>

          <p className="text-xs text-gray-500 mt-4">
            * Preise sind Richtwerte. Extraservices wie Datenbearbeitung oder Überführung in spezielle Formate auf Anfrage.
          </p>
        </div>
      </div>
    </div>
  );
}
