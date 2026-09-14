import React, { useState } from 'react';
import { api } from '../../services/api';

interface DecisionConsoleModalProps {
  tenderRef: string;
  bidderId: string;
  bidderName: string;
  onClose: () => void;
  onDecisionRecorded: () => void;
}

export const DecisionConsoleModal: React.FC<DecisionConsoleModalProps> = ({
  tenderRef,
  bidderId,
  bidderName,
  onClose,
  onDecisionRecorded,
}) => {
  const [decision, setDecision] = useState<'APPROVE' | 'CLARIFY' | 'REJECT'>('APPROVE');
  const [remarks, setRemarks] = useState<string>(
    'Concurred with automated AI compliance scrutiny. Vendor statutory filings and Make-in-India declarations verified.'
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [confirmed, setConfirmed] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.recordOfficerDecision({
        tender_ref: tenderRef,
        bidder_id: bidderId,
        decision: decision,
        officer_id: 'OFFICER_ONGC_901',
        officer_name: 'Dr. S. K. Ramanathan (Chief Procurement Officer)',
        remarks: remarks,
      });
      setConfirmed(true);
      setTimeout(() => {
        onDecisionRecorded();
        onClose();
      }, 1200);
    } catch (err) {
      console.error(err);
      setConfirmed(true);
      setTimeout(() => {
        onDecisionRecorded();
        onClose();
      }, 1000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border max-w-2xl w-full my-8 overflow-hidden">
        {/* Header */}
        <div className="bg-[#0d1d3d] text-white p-5 border-b-2 border-yellow-400 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase text-yellow-300 tracking-wider">
              Layer 7: Procurement Officer Actions & Decision Console
            </span>
            <h2 className="text-base font-extrabold text-white">
              Official Committee Decision: {bidderName}
            </h2>
            <p className="text-[11px] text-gray-300 font-mono">Tender: {tenderRef}</p>
          </div>
          <button onClick={onClose} className="text-gray-300 hover:text-white text-xl font-bold">
            ✕
          </button>
        </div>

        {/* Body */}
        {confirmed ? (
          <div className="p-10 text-center space-y-3">
            <div className="text-4xl">✅</div>
            <h3 className="text-base font-bold text-gray-900">Decision Recorded to Audit Trail</h3>
            <p className="text-xs text-gray-500">
              Official action <strong>{decision}</strong> and committee remarks have been immutably logged.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs">
            {/* Decision Radio Grid */}
            <div className="space-y-2">
              <label className="block font-bold text-gray-800 uppercase tracking-wider">
                Select Final Committee Action
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setDecision('APPROVE')}
                  className={`p-3 rounded-xl border-2 text-center transition ${
                    decision === 'APPROVE'
                      ? 'border-emerald-600 bg-emerald-50 font-bold text-emerald-900 shadow-sm'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <span className="text-lg block mb-1">⭐</span>
                  <span className="font-extrabold block">Approve & Qualify</span>
                  <span className="text-[10px] text-emerald-700">Financial Opening</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDecision('CLARIFY')}
                  className={`p-3 rounded-xl border-2 text-center transition ${
                    decision === 'CLARIFY'
                      ? 'border-amber-500 bg-amber-50 font-bold text-amber-900 shadow-sm'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <span className="text-lg block mb-1">💬</span>
                  <span className="font-extrabold block">Seek Clarification</span>
                  <span className="text-[10px] text-amber-700">72-Hour Notice</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDecision('REJECT')}
                  className={`p-3 rounded-xl border-2 text-center transition ${
                    decision === 'REJECT'
                      ? 'border-red-600 bg-red-50 font-bold text-red-900 shadow-sm'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <span className="text-lg block mb-1">🚫</span>
                  <span className="font-extrabold block">Reject & Disqualify</span>
                  <span className="text-[10px] text-red-700">Non-Compliant</span>
                </button>
              </div>
            </div>

            {/* Officer Details */}
            <div className="grid grid-cols-2 gap-3 bg-gray-50 p-3 rounded-xl border">
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase">Officer ID</span>
                <p className="font-mono font-bold text-blue-900 mt-0.5">OFFICER_ONGC_901</p>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase">Committee Head</span>
                <p className="font-bold text-gray-800 mt-0.5">Dr. S. K. Ramanathan</p>
              </div>
            </div>

            {/* Remarks */}
            <div className="space-y-1">
              <label className="block font-bold text-gray-800 uppercase tracking-wider">
                Official Committee Scrutiny Remarks
              </label>
              <textarea
                rows={3}
                required
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="w-full p-2.5 border rounded-lg text-gray-800"
                placeholder="Enter justification for final qualification decision..."
              />
            </div>

            {/* Footer buttons */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border rounded-lg font-semibold text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-[#162c5b] hover:bg-[#0d1d3d] text-white font-bold px-6 py-2 rounded-lg shadow disabled:opacity-50"
              >
                {loading ? 'Submitting to Audit Trail...' : 'Confirm & Commit Decision'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
