import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import type { AuditLogEntry } from '../../types';

export const AuditTrailView: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const data = await api.getAuditLogs();
      setLogs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter((log) => {
    if (roleFilter === 'all') return true;
    return log.role.toLowerCase() === roleFilter.toLowerCase();
  });

  return (
    <div className="flex-1 flex flex-col bg-[#f4f6f9]">
      {/* Header */}
      <div className="bg-white border-b shadow-xs py-4 px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">
              Immutable Traceability & Governance Log
            </span>
            <h1 className="text-xl font-black text-[#162c5b] flex items-center gap-2">
              📜 Public Procurement Scrutiny Audit Trail
            </h1>
            <p className="text-xs text-gray-500">
              Complete chronological ledger of AI extractions, statutory API calls, and committee decisions.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Filter Buttons */}
            <div className="flex bg-gray-100 p-1 rounded-lg border text-xs font-semibold">
              <button
                onClick={() => setRoleFilter('all')}
                className={`px-3 py-1 rounded ${
                  roleFilter === 'all' ? 'bg-white font-bold shadow-xs text-blue-950' : 'text-gray-500'
                }`}
              >
                All Events
              </button>
              <button
                onClick={() => setRoleFilter('seller')}
                className={`px-3 py-1 rounded ${
                  roleFilter === 'seller' ? 'bg-white font-bold shadow-xs text-blue-950' : 'text-gray-500'
                }`}
              >
                Seller
              </button>
              <button
                onClick={() => setRoleFilter('officer')}
                className={`px-3 py-1 rounded ${
                  roleFilter === 'officer' ? 'bg-white font-bold shadow-xs text-blue-950' : 'text-gray-500'
                }`}
              >
                Officer
              </button>
              <button
                onClick={() => setRoleFilter('system')}
                className={`px-3 py-1 rounded ${
                  roleFilter === 'system' ? 'bg-white font-bold shadow-xs text-blue-950' : 'text-gray-500'
                }`}
              >
                System AI
              </button>
            </div>

            <button
              onClick={fetchLogs}
              className="bg-[#162c5b] hover:bg-[#0d1d3d] text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-xs transition flex items-center gap-1.5"
            >
              🔄 Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <main className="max-w-7xl mx-auto p-6 w-full flex-1 text-xs">
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left divide-y divide-gray-200">
              <thead className="bg-gray-100 text-[11px] font-bold text-gray-700 uppercase tracking-wider">
                <tr>
                  <th className="p-3.5">Timestamp</th>
                  <th className="p-3.5">User & Role</th>
                  <th className="p-3.5">Action Code</th>
                  <th className="p-3.5">Tender / Bidder</th>
                  <th className="p-3.5">Event Details</th>
                  <th className="p-3.5 text-right">Severity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs font-mono">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-gray-400 font-sans">
                      Loading audit records...
                    </td>
                  </tr>
                ) : filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-gray-400 font-sans">
                      No log entries found for this filter.
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50/70 transition">
                      <td className="p-3.5 text-gray-500 whitespace-nowrap text-[11px]">
                        {log.timestamp}
                      </td>
                      <td className="p-3.5 font-sans">
                        <p className="font-bold text-gray-800">{log.user}</p>
                        <span className="text-[10px] uppercase font-bold text-gray-400">
                          {log.role}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span className="bg-blue-50 text-blue-900 border border-blue-200 px-2 py-0.5 rounded text-[10px] font-bold">
                          {log.action}
                        </span>
                      </td>
                      <td className="p-3.5 font-sans text-gray-700">
                        {log.tender_ref && <p className="font-bold text-xs">{log.tender_ref}</p>}
                        {log.bidder_name && (
                          <p className="text-[11px] text-gray-500">{log.bidder_name}</p>
                        )}
                      </td>
                      <td className="p-3.5 font-sans text-gray-700 max-w-md leading-relaxed">
                        {log.details}
                      </td>
                      <td className="p-3.5 text-right">
                        <span
                          className={`text-[10px] font-black px-2 py-0.5 rounded uppercase font-sans ${
                            log.severity === 'SUCCESS'
                              ? 'bg-green-100 text-green-800'
                              : log.severity === 'WARNING'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {log.severity}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};
