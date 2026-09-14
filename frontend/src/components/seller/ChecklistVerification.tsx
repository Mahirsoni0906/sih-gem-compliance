import React, { useState } from 'react';
import { api } from '../../services/api';

export const ChecklistVerification: React.FC = () => {
  const [gstInput, setGstInput] = useState<string>('24AAACB1234F1Z5');
  const [panInput, setPanInput] = useState<string>('AAACB1234F');
  const [udyamInput, setUdyamInput] = useState<string>('UDYAM-GJ-01-008291');
  const [mcaInput, setMcaInput] = useState<string>('U28132GJ2017PTC097812');

  const [loadingKey, setLoadingKey] = useState<string | null>(null);
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [activePortalTitle, setActivePortalTitle] = useState<string>('');

  const handleVerify = async (key: string) => {
    setLoadingKey(key);
    try {
      let data = null;
      if (key === 'gst') {
        setActivePortalTitle('GSTN Common Portal (api.gst.gov.in)');
        data = await api.verifyGst(gstInput);
      } else if (key === 'pan') {
        setActivePortalTitle('Income Tax Department NSDL Gateway');
        data = await api.verifyPan(panInput);
      } else if (key === 'udyam') {
        setActivePortalTitle('Ministry of MSME Udyam Portal');
        data = await api.verifyUdyam(udyamInput);
      } else if (key === 'mca') {
        setActivePortalTitle('Ministry of Corporate Affairs MCA-21');
        data = await api.verifyMca(mcaInput);
      }
      setApiResponse(data);
    } catch (err) {
      console.error(err);
      setApiResponse({ error: "Backend connection error. Please ensure FastAPI is running on port 8000." });
    } finally {
      setLoadingKey(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b pb-3">
        <h2 className="text-base font-extrabold text-[#162c5b]">
          Layer 3: Verification Engine & External Statutory Connectors
        </h2>
        <p className="text-xs text-gray-500">
          Cross-checks bidder identities with live mock gateways for GSTN, Income Tax PAN, Udyam MSME, and MCA-21.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Verification Items List (2 columns) */}
        <div className="lg:col-span-2 space-y-3">
          {/* GSTIN */}
          <div className="bg-white p-4 rounded-xl border shadow-sm flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm">🏛️</span>
                <h4 className="font-bold text-xs text-gray-800">GSTIN Registration Status</h4>
                <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded">
                  ✓ Active Regular
                </span>
              </div>
              <p className="text-[11px] text-gray-500">
                Verified against Goods and Services Tax Network (GSTN). Monthly GSTR-3B filings up to date.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  value={gstInput}
                  onChange={(e) => setGstInput(e.target.value)}
                  className="px-2.5 py-1 border rounded text-xs font-mono font-bold text-blue-900 w-48"
                />
              </div>
            </div>
            <button
              onClick={() => handleVerify('gst')}
              disabled={loadingKey === 'gst'}
              className="bg-[#162c5b] hover:bg-[#0d1d3d] text-white text-xs font-bold px-4 py-2 rounded-lg shadow transition disabled:opacity-50"
            >
              {loadingKey === 'gst' ? 'Querying...' : 'Query GSTN API'}
            </button>
          </div>

          {/* PAN */}
          <div className="bg-white p-4 rounded-xl border shadow-sm flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm">💳</span>
                <h4 className="font-bold text-xs text-gray-800">Income Tax PAN Verification</h4>
                <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded">
                  ✓ Linked & Operative
                </span>
              </div>
              <p className="text-[11px] text-gray-500">
                Entity PAN category matches Private Limited Company. Embedded checksum aligns with GSTIN.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  value={panInput}
                  onChange={(e) => setPanInput(e.target.value)}
                  className="px-2.5 py-1 border rounded text-xs font-mono font-bold text-blue-900 w-48"
                />
              </div>
            </div>
            <button
              onClick={() => handleVerify('pan')}
              disabled={loadingKey === 'pan'}
              className="bg-[#162c5b] hover:bg-[#0d1d3d] text-white text-xs font-bold px-4 py-2 rounded-lg shadow transition disabled:opacity-50"
            >
              {loadingKey === 'pan' ? 'Querying...' : 'Query ITD PAN API'}
            </button>
          </div>

          {/* Udyam MSME */}
          <div className="bg-white p-4 rounded-xl border shadow-sm flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm">🏭</span>
                <h4 className="font-bold text-xs text-gray-800">MSME Udyam Certificate</h4>
                <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded">
                  ✓ Micro Enterprise
                </span>
              </div>
              <p className="text-[11px] text-gray-500">
                NIC Code 28132 (Manufacturing of Industrial Valves). Eligible for MSME procurement benefits.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  value={udyamInput}
                  onChange={(e) => setUdyamInput(e.target.value)}
                  className="px-2.5 py-1 border rounded text-xs font-mono font-bold text-blue-900 w-48"
                />
              </div>
            </div>
            <button
              onClick={() => handleVerify('udyam')}
              disabled={loadingKey === 'udyam'}
              className="bg-[#162c5b] hover:bg-[#0d1d3d] text-white text-xs font-bold px-4 py-2 rounded-lg shadow transition disabled:opacity-50"
            >
              {loadingKey === 'udyam' ? 'Querying...' : 'Query Udyam API'}
            </button>
          </div>

          {/* MCA-21 Corporate */}
          <div className="bg-white p-4 rounded-xl border shadow-sm flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm">⚖️</span>
                <h4 className="font-bold text-xs text-gray-800">MCA-21 Company Registry</h4>
                <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded">
                  ✓ Active RoC Status
                </span>
              </div>
              <p className="text-[11px] text-gray-500">
                Ministry of Corporate Affairs registry check. 0 Director disqualifications, paid-up capital compliant.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  value={mcaInput}
                  onChange={(e) => setMcaInput(e.target.value)}
                  className="px-2.5 py-1 border rounded text-xs font-mono font-bold text-blue-900 w-48"
                />
              </div>
            </div>
            <button
              onClick={() => handleVerify('mca')}
              disabled={loadingKey === 'mca'}
              className="bg-[#162c5b] hover:bg-[#0d1d3d] text-white text-xs font-bold px-4 py-2 rounded-lg shadow transition disabled:opacity-50"
            >
              {loadingKey === 'mca' ? 'Querying...' : 'Query MCA-21 API'}
            </button>
          </div>
        </div>

        {/* Live Response JSON Inspector (1 column) */}
        <div className="bg-[#0f172a] text-gray-100 rounded-xl p-4 shadow-md flex flex-col font-mono text-xs border border-gray-800">
          <div className="flex items-center justify-between border-b border-gray-800 pb-2 mb-3">
            <span className="text-emerald-400 font-bold text-[11px]">
              📡 Live Portal JSON Inspector
            </span>
            <span className="text-[10px] text-gray-400">FastAPI Port 8000</span>
          </div>

          <div className="flex-1 overflow-auto max-h-[380px] space-y-2">
            {apiResponse ? (
              <div>
                <p className="text-[11px] text-yellow-400 font-bold mb-1">
                  Source: {activePortalTitle || 'Statutory Gateway'}
                </p>
                <pre className="text-[11px] text-emerald-300 leading-relaxed overflow-x-auto">
                  {JSON.stringify(apiResponse, null, 2)}
                </pre>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 py-16 space-y-2">
                <span className="text-2xl">⚡</span>
                <p className="text-[11px]">Click any "Query API" button to execute a live statutory check against the backend.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
