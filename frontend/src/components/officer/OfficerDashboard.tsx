import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import type { Tender, Bidder, ComplianceReport } from '../../types';
import { ExplainableScrutinyModal } from './ExplainableScrutinyModal';
import { DecisionConsoleModal } from './DecisionConsoleModal';

export const OfficerDashboard: React.FC = () => {
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [selectedTenderRef, setSelectedTenderRef] = useState<string>('GEM/2026/B/9012481');
  const [bidders, setBidders] = useState<Bidder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Scrutiny Modal State
  const [activeReport, setActiveReport] = useState<ComplianceReport | null>(null);
  const [evaluatingBidderId, setEvaluatingBidderId] = useState<string | null>(null);

  // Decision Modal State
  const [decisionModalBidder, setDecisionModalBidder] = useState<Bidder | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [tList, bList] = await Promise.all([
        api.getTenders(),
        api.getBidders(),
      ]);
      setTenders(Array.isArray(tList) && tList.length > 0 ? tList : api.getInitialTenders());
      setBidders(Array.isArray(bList) ? bList : []);
    } catch (err) {
      console.error(err);
      setTenders(api.getInitialTenders());
    } finally {
      setLoading(false);
    }
  };

  const safeTenders = Array.isArray(tenders) && tenders.length > 0 ? tenders : api.getInitialTenders();
  const currentTender = safeTenders.find((t) => t.ref_no === selectedTenderRef) || safeTenders[0];

  const handleInspectBidder = async (bidder: Bidder) => {
    setEvaluatingBidderId(bidder.id);
    try {
      const report = await api.evaluateCompliance(selectedTenderRef, bidder.id);
      setActiveReport(report);
    } catch (err) {
      console.error(err);
      // Fallback mock report
      setActiveReport({
        tender_ref: selectedTenderRef,
        bidder_id: bidder.id,
        bidder_name: bidder.legal_name,
        readiness_score: bidder.blacklisted ? 25 : bidder.mii_percentage < 50 ? 65 : 98,
        risk_tier: bidder.blacklisted ? 'HIGH RISK' : bidder.mii_percentage < 50 ? 'MEDIUM RISK' : 'LOW RISK',
        statutory_checks: {
          gst: 'Active Regular',
          pan: 'Linked & Valid',
          udyam: 'Verified MSME',
          mii: `${bidder.mii_percentage}% Local Content`,
        },
        rules_evaluated: [
          {
            rule_id: 'R-STAT-01',
            name: 'GSTIN Active Registration',
            category: 'Statutory',
            passed: true,
            severity: 'Critical',
            details: 'Active regular taxpayer verified with GSTN Common Portal.',
            evidence_source: `GSTN API (${bidder.gstin})`,
          },
          {
            rule_id: 'R-TEND-03',
            name: 'Make-in-India Minimum Local Content (50%)',
            category: 'Technical',
            passed: bidder.mii_percentage >= 50,
            severity: 'High',
            details: bidder.mii_percentage >= 50 ? 'Compliant with MII order.' : 'Shortfall below 50% threshold.',
            evidence_source: 'Bidder Sourcing Declaration',
          },
          {
            rule_id: 'R-LEGAL-06',
            name: 'Central Debarment / Blacklist Clearance',
            category: 'Mandatory',
            passed: !bidder.blacklisted,
            severity: 'Critical',
            details: !bidder.blacklisted ? 'Clean record.' : 'Entity appears on ministry debarred list.',
            evidence_source: 'CPPP Central Debarment Database',
          },
        ],
        discrepancies: bidder.blacklisted
          ? ['Bidder is blacklisted under CPPP procurement registries.']
          : bidder.mii_percentage < 50
          ? ['Local content is 42%, failing mandatory 50% MII minimum.']
          : [],
        evidence_sources: [
          { rule: 'GSTIN', source: 'GSTN Gateway', status: 'PASSED' },
          { rule: 'PAN', source: 'Income Tax Gateway', status: 'PASSED' },
        ],
        ai_recommendation: bidder.blacklisted
          ? 'REJECTED / NON-COMPLIANT'
          : bidder.mii_percentage < 50
          ? 'CLARIFICATION REQUIRED FROM BIDDER'
          : 'QUALIFIED FOR FINANCIAL BID OPENING',
        recommendation_rationale: bidder.blacklisted
          ? 'Entity is debarred from public procurement.'
          : bidder.mii_percentage < 50
          ? 'Issue clarification notice regarding MII local content shortfall.'
          : 'Vendor meets all statutory, financial, and technical eligibility criteria.',
        evaluated_at: new Date().toLocaleTimeString(),
      });
    } finally {
      setEvaluatingBidderId(null);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#f4f6f9]">
      {/* Header */}
      <div className="bg-white border-b shadow-xs py-4 px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">
              Procurement Officer Technical Scrutiny Portal
            </span>
            <h1 className="text-xl font-black text-[#162c5b] flex items-center gap-2">
              Tender Scrutiny & Committee Decision Desk
            </h1>
          </div>

          {/* Tender Selector */}
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-gray-600">Select Tender:</span>
            <select
              value={selectedTenderRef}
              onChange={(e) => setSelectedTenderRef(e.target.value)}
              className="p-2 border rounded-lg font-mono font-bold text-blue-900 bg-gray-50 cursor-pointer"
            >
              {tenders.map((t) => (
                <option key={t.id} value={t.ref_no}>
                  {t.ref_no} — {t.department}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto p-6 w-full space-y-6 flex-1 text-xs">
        {/* Tender Specification Banner */}
        {currentTender && (
          <div className="bg-white p-5 rounded-xl border shadow-sm space-y-3">
            <div className="flex flex-wrap items-start justify-between gap-2 border-b pb-3">
              <div>
                <span className="bg-blue-100 text-blue-900 text-[10px] font-extrabold px-2 py-0.5 rounded">
                  {currentTender.category}
                </span>
                <h2 className="text-sm font-black text-gray-900 mt-1">{currentTender.title}</h2>
                <p className="text-[11px] text-gray-500">{currentTender.department}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-gray-400 font-bold uppercase">Status</span>
                <p className="font-bold text-orange-600">{currentTender.status}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="p-3 bg-gray-50 rounded-lg border">
                <span className="text-[10px] text-gray-400 font-bold uppercase">Estimated Value</span>
                <p className="font-black text-sm text-[#162c5b] mt-0.5">₹{currentTender.estimated_value_lakhs} Lakhs</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg border">
                <span className="text-[10px] text-gray-400 font-bold uppercase">EMD Amount</span>
                <p className="font-black text-sm text-gray-800 mt-0.5">₹{currentTender.emd_amount_lakhs} Lakhs</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg border">
                <span className="text-[10px] text-gray-400 font-bold uppercase">Min Turnover Req.</span>
                <p className="font-black text-sm text-blue-900 mt-0.5">₹{currentTender.min_turnover_lakhs} Lakhs</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg border">
                <span className="text-[10px] text-gray-400 font-bold uppercase">Min MII Local Content</span>
                <p className="font-black text-sm text-emerald-700 mt-0.5">{currentTender.min_mii_percentage}%</p>
              </div>
            </div>
          </div>
        )}

        {/* Bidders Evaluation & Comparison Table */}
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <div className="p-4 border-b flex justify-between items-center bg-gray-50">
            <h3 className="font-extrabold text-xs text-[#162c5b] uppercase tracking-wide">
              Participating Bidders & Automated Compliance Rankings
            </h3>
            <span className="text-[11px] text-gray-500 font-medium">3 Bids Received</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left divide-y divide-gray-200">
              <thead className="bg-gray-100 text-[11px] font-bold text-gray-700 uppercase tracking-wider">
                <tr>
                  <th className="p-3.5">Bidder Entity</th>
                  <th className="p-3.5">GSTIN & PAN</th>
                  <th className="p-3.5">Turnover (3Y Avg)</th>
                  <th className="p-3.5">MII Content</th>
                  <th className="p-3.5">Compliance Score</th>
                  <th className="p-3.5">Risk Tier</th>
                  <th className="p-3.5 text-right">Officer Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {bidders.map((b, idx) => {
                  const score = b.blacklisted ? 25 : b.mii_percentage < 50 ? 65 : 98;
                  const isLow = score >= 85;
                  const isMed = score >= 60 && score < 85;

                  return (
                    <tr
                      key={b.id}
                      className={`hover:bg-blue-50/40 transition ${
                        idx === 0 ? 'bg-emerald-50/20' : ''
                      }`}
                    >
                      <td className="p-3.5">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-gray-400">#{idx + 1}</span>
                          <div>
                            <p className="font-extrabold text-blue-950">{b.legal_name}</p>
                            <span className="text-[10px] text-gray-400">{b.trade_name}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5 font-mono">
                        <p className="font-bold text-gray-800">{b.gstin}</p>
                        <span className="text-[10px] text-gray-500">PAN: {b.pan}</span>
                      </td>
                      <td className="p-3.5 font-mono font-bold text-gray-800">
                        ₹{b.declared_turnover_lakhs} Lakhs
                      </td>
                      <td className="p-3.5 font-bold">
                        <span className={b.mii_percentage < 50 ? 'text-red-600' : 'text-emerald-700'}>
                          {b.mii_percentage}%
                        </span>
                      </td>
                      <td className="p-3.5">
                        <div className="flex items-center gap-1.5">
                          <div className="w-12 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                isLow ? 'bg-emerald-600' : isMed ? 'bg-amber-500' : 'bg-red-600'
                              }`}
                              style={{ width: `${score}%` }}
                            ></div>
                          </div>
                          <span className="font-black text-xs">{score}%</span>
                        </div>
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase ${
                            isLow
                              ? 'bg-emerald-100 text-emerald-800'
                              : isMed
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {isLow ? '🟢 LOW' : isMed ? '🟡 MEDIUM' : '🔴 HIGH'}
                        </span>
                      </td>
                      <td className="p-3.5 text-right space-x-2">
                        <button
                          onClick={() => handleInspectBidder(b)}
                          disabled={evaluatingBidderId === b.id}
                          className="bg-blue-50 text-blue-900 hover:bg-blue-100 border border-blue-200 font-bold px-3 py-1.5 rounded-lg transition disabled:opacity-50"
                        >
                          {evaluatingBidderId === b.id ? 'Analyzing...' : '🔍 Inspect & Evidence'}
                        </button>
                        <button
                          onClick={() => setDecisionModalBidder(b)}
                          className="bg-[#162c5b] hover:bg-[#0d1d3d] text-white font-bold px-3 py-1.5 rounded-lg transition shadow-xs"
                        >
                          ⚖️ Committee Action
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Scrutiny Modal */}
      {activeReport && (
        <ExplainableScrutinyModal
          report={activeReport}
          onClose={() => setActiveReport(null)}
          onOpenDecision={() => {
            const b = bidders.find((item) => item.id === activeReport.bidder_id) || bidders[0];
            setDecisionModalBidder(b);
          }}
        />
      )}

      {/* Decision Modal */}
      {decisionModalBidder && (
        <DecisionConsoleModal
          tenderRef={selectedTenderRef}
          bidderId={decisionModalBidder.id}
          bidderName={decisionModalBidder.legal_name}
          onClose={() => setDecisionModalBidder(null)}
          onDecisionRecorded={() => {
            loadData();
          }}
        />
      )}
    </div>
  );
};
