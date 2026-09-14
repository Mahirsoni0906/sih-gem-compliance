import React, { useState } from 'react';
import { DocumentIntakeOCR } from './DocumentIntakeOCR';
import { ChecklistVerification } from './ChecklistVerification';
import { DiscrepancyResolver } from './DiscrepancyResolver';

export const SellerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'checklist' | 'ocr' | 'discrepancies'>('overview');
  const [readinessScore, setReadinessScore] = useState<number>(87);
  const [isResolved, setIsResolved] = useState<boolean>(false);
  const [verifiedDocs, setVerifiedDocs] = useState<number>(12);

  const handleScoreUpdate = (newScore: number, resolved: boolean) => {
    setReadinessScore(newScore);
    setIsResolved(resolved);
    setVerifiedDocs(resolved ? 13 : 12);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#f4f6f9]">
      {/* Subheader with Bidder Info & Sub-tabs */}
      <div className="bg-white border-b shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">
              Bidder Self-Service Compliance Desk
            </span>
            <h1 className="text-lg font-black text-[#162c5b] flex items-center gap-2">
              ABC Industries Pvt. Ltd.
              <span className="bg-green-100 text-green-800 text-[11px] font-bold px-2 py-0.5 rounded">
                GSTIN: 24AAACB1234F1Z5
              </span>
            </h1>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-gray-400 font-bold uppercase">Active Tender Ref:</span>
            <p className="text-xs font-mono font-bold text-blue-900">GEM/2026/B/9012481 (ONGC)</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex space-x-1 sm:space-x-4 border-t text-xs font-bold overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-3 border-b-2 transition whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-orange-600 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            S1. Readiness Overview
          </button>
          <button
            onClick={() => setActiveTab('checklist')}
            className={`py-3 px-3 border-b-2 transition whitespace-nowrap ${
              activeTab === 'checklist'
                ? 'border-orange-600 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            S2. Statutory Checklist & APIs
          </button>
          <button
            onClick={() => setActiveTab('ocr')}
            className={`py-3 px-3 border-b-2 transition whitespace-nowrap ${
              activeTab === 'ocr'
                ? 'border-orange-600 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            S3. AI Document Scrutiny (OCR)
          </button>
          <button
            onClick={() => setActiveTab('discrepancies')}
            className={`py-3 px-3 border-b-2 transition whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'discrepancies'
                ? 'border-orange-600 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            S4. Discrepancy Resolution
            {!isResolved && (
              <span className="bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                1
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 w-full flex-1">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-xl border shadow-sm">
                <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">
                  Readiness Score
                </span>
                <div className="flex items-baseline justify-between mt-1">
                  <p className={`text-3xl font-black ${readinessScore >= 85 ? 'text-emerald-600' : 'text-amber-500'}`}>
                    {readinessScore}%
                  </p>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded ${
                    readinessScore >= 85 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {readinessScore >= 85 ? '🟢 LOW RISK' : '🟡 MEDIUM RISK'}
                  </span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border shadow-sm">
                <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">
                  Verified Documents
                </span>
                <div className="flex items-baseline justify-between mt-1">
                  <p className="text-3xl font-black text-blue-900">{verifiedDocs} / 13</p>
                  <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded">
                    92% Complete
                  </span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border shadow-sm">
                <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">
                  Make In India (MII)
                </span>
                <div className="flex items-baseline justify-between mt-1">
                  <p className="text-3xl font-black text-gray-800">78.5%</p>
                  <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded">
                    Class-I Local
                  </span>
                </div>
              </div>

              <div
                onClick={() => setActiveTab('discrepancies')}
                className="bg-white p-5 rounded-xl border shadow-sm cursor-pointer hover:border-red-400 transition"
              >
                <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">
                  Pending Rectifications
                </span>
                <div className="flex items-baseline justify-between mt-1">
                  <p className={`text-3xl font-black ${!isResolved ? 'text-red-600' : 'text-emerald-600'}`}>
                    {!isResolved ? '1 Action' : '0 Pending'}
                  </p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    !isResolved ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {!isResolved ? 'Fix Now ➔' : 'Resolved'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Action Banner */}
            <div className="bg-white rounded-xl border p-6 shadow-sm space-y-4">
              <h2 className="text-sm font-extrabold text-[#162c5b] uppercase tracking-wide">
                Self-Service Pre-Qualification Workflow
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div
                  onClick={() => setActiveTab('checklist')}
                  className="p-4 rounded-lg bg-gray-50 border hover:border-blue-400 cursor-pointer space-y-1 transition"
                >
                  <span className="font-bold text-blue-900 block">Step 1: Check Statutory Registrations</span>
                  <p className="text-gray-500 text-[11px]">
                    Validate GSTIN, PAN, Udyam MSME, and MCA with live government gateways.
                  </p>
                </div>
                <div
                  onClick={() => setActiveTab('ocr')}
                  className="p-4 rounded-lg bg-gray-50 border hover:border-blue-400 cursor-pointer space-y-1 transition"
                >
                  <span className="font-bold text-blue-900 block">Step 2: AI Document Scrutiny (OCR)</span>
                  <p className="text-gray-500 text-[11px]">
                    Upload and parse certificates with AI OCR, seal checking, and tampering detection.
                  </p>
                </div>
                <div
                  onClick={() => setActiveTab('discrepancies')}
                  className="p-4 rounded-lg bg-gray-50 border hover:border-blue-400 cursor-pointer space-y-1 transition"
                >
                  <span className="font-bold text-blue-900 block">Step 3: Resolve Discrepancies</span>
                  <p className="text-gray-500 text-[11px]">
                    Rectify any flagged turnover or declaration gaps before technical bid opening.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'checklist' && <ChecklistVerification />}
        {activeTab === 'ocr' && <DocumentIntakeOCR />}
        {activeTab === 'discrepancies' && (
          <DiscrepancyResolver
            onScoreUpdated={handleScoreUpdate}
            isResolved={isResolved}
          />
        )}
      </main>
    </div>
  );
};
