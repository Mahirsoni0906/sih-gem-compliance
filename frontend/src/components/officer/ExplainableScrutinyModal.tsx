import React from 'react';
import type { ComplianceReport } from '../../types';
import { X, CheckCircle2 } from 'lucide-react';

interface ExplainableScrutinyModalProps {
  report: ComplianceReport | null;
  onClose: () => void;
  onOpenDecision: () => void;
}

export const ExplainableScrutinyModal: React.FC<ExplainableScrutinyModalProps> = ({
  report,
  onClose,
  onOpenDecision,
}) => {
  if (!report) return null;

  const isLowRisk = report.risk_tier === 'LOW RISK';
  const isMedRisk = report.risk_tier === 'MEDIUM RISK';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border max-w-4xl w-full my-8 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#0d1d3d] text-white p-5 flex items-center justify-between border-b-2 border-yellow-400">
          <div>
            <span className="text-[10px] font-black uppercase text-yellow-300 tracking-wider">
              Layer 6: Explainable Output & AI Scrutiny
            </span>
            <h2 className="text-base font-extrabold text-white">
              Compliance Evaluation Breakdown: {report.bidder_name}
            </h2>
            <p className="text-[11px] text-gray-300 font-mono">Tender Ref: {report.tender_ref}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-300 hover:text-white p-1 rounded cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs flex-1">
          {/* Top Score Banner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-xl border">
              <span className="text-[10px] text-gray-400 font-bold uppercase">Compliance Score</span>
              <p className="text-3xl font-black text-[#162c5b] mt-1">{report.readiness_score} / 100</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl border">
              <span className="text-[10px] text-gray-400 font-bold uppercase">Risk Tier</span>
              <p className={`text-xl font-black mt-1 ${
                isLowRisk ? 'text-emerald-700' : isMedRisk ? 'text-amber-600' : 'text-red-700'
              }`}>
                {report.risk_tier}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl border">
              <span className="text-[10px] text-gray-400 font-bold uppercase">Evaluated At</span>
              <p className="text-xs font-mono font-bold text-gray-700 mt-2">{report.evaluated_at}</p>
            </div>
          </div>

          {/* AI Recommendation Callout */}
          <div className={`p-4 rounded-xl border-l-4 ${
            isLowRisk
              ? 'bg-emerald-50 border-emerald-600 text-emerald-950'
              : isMedRisk
              ? 'bg-amber-50 border-amber-500 text-amber-950'
              : 'bg-red-50 border-red-600 text-red-950'
          }`}>
            <span className="text-[10px] font-black uppercase tracking-wider block mb-1">
              AI Recommendation Engine
            </span>
            <p className="text-sm font-black mb-1">{report.ai_recommendation}</p>
            <p className="text-xs font-medium leading-relaxed">{report.recommendation_rationale}</p>
          </div>

          {/* Evaluated Rules List */}
          <div>
            <h3 className="font-extrabold text-xs text-[#162c5b] uppercase tracking-wide mb-3">
              Detailed Rule Engine Cross-Checks (Layer 4)
            </h3>
            <div className="border rounded-xl overflow-hidden divide-y">
              {report.rules_evaluated.map((rule) => (
                <div key={rule.rule_id} className="p-3 bg-white flex flex-wrap items-start justify-between gap-2">
                  <div className="space-y-0.5 max-w-xl">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-black px-2 py-0.2 rounded uppercase ${
                        rule.passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {rule.passed ? 'PASSED' : 'FAILED'}
                      </span>
                      <span className="font-bold text-xs text-gray-900">{rule.name}</span>
                      <span className="text-[10px] text-gray-400 font-mono">({rule.category})</span>
                    </div>
                    <p className="text-[11px] text-gray-600 leading-snug">{rule.details}</p>
                    <p className="text-[10px] text-blue-800 font-mono">Source: {rule.evidence_source}</p>
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase">
                    Severity: {rule.severity}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Discrepancies if any */}
          {report.discrepancies.length > 0 ? (
            <div className="bg-red-50/70 border border-red-200 rounded-xl p-4 space-y-2">
              <h4 className="font-bold text-xs text-red-900 uppercase">
                Active Discrepancies & Deficiencies Flagged ({report.discrepancies.length})
              </h4>
              <ul className="list-disc pl-5 space-y-1 text-red-800 text-xs">
                {report.discrepancies.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-green-800 font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>No statutory discrepancies or disqualifying criteria detected.</span>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-gray-50 border-t p-4 flex justify-between items-center">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg font-semibold text-gray-600 hover:bg-gray-100"
          >
            Close Breakdown
          </button>
          <button
            onClick={() => {
              onClose();
              onOpenDecision();
            }}
            className="bg-[#162c5b] hover:bg-[#0d1d3d] text-white font-bold px-5 py-2 rounded-lg shadow"
          >
            Proceed to Official Committee Decision &gt;
          </button>
        </div>
      </div>
    </div>
  );
};
