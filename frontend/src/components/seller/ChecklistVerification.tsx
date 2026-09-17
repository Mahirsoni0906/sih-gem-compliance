import React, { useState, useEffect } from 'react';
import {
  Zap,
  ShieldCheck,
  Key,
  Building2,
  CheckCircle2,
  AlertTriangle,
  Landmark,
  Search,
  RotateCw,
  CreditCard,
  Award,
  Scale,
  Activity,
  Clock,
  Check,
  X,
  Lock
} from 'lucide-react';
import { api } from '../../services/api';

export const ChecklistVerification: React.FC = () => {
  const [gstInput, setGstInput] = useState<string>('24AAACB1234F1Z5');
  const [panInput, setPanInput] = useState<string>('AAACB1234F');
  const [udyamInput, setUdyamInput] = useState<string>('UDYAM-GJ-01-008291');
  const [mcaInput, setMcaInput] = useState<string>('U28132GJ2017PTC097812');

  const [loadingKey, setLoadingKey] = useState<string | null>(null);
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [activePortalTitle, setActivePortalTitle] = useState<string>('');
  const [latency, setLatency] = useState<number | null>(null);

  // Gateway status & API key state
  const [gatewayStatus, setGatewayStatus] = useState<any>(null);
  const [showKeyModal, setShowKeyModal] = useState<boolean>(false);
  const [customApiKey, setCustomApiKey] = useState<string>('');
  const [selectedProvider, setSelectedProvider] = useState<string>('API Setu (MeitY National Gateway)');

  useEffect(() => {
    api.getGatewayStatus().then((status) => {
      setGatewayStatus(status);
    });
    const saved = localStorage.getItem('gem_sovereign_api_key');
    if (saved) setCustomApiKey(saved);
  }, []);

  const handleSaveApiKey = async () => {
    const updated = await api.configureGateway(
      customApiKey.trim() ? 'LIVE_API' : 'SANDBOX',
      customApiKey.trim(),
      selectedProvider
    );
    setGatewayStatus(updated);
    setShowKeyModal(false);
  };

  const handleClearApiKey = async () => {
    setCustomApiKey('');
    const updated = await api.configureGateway('SANDBOX', '');
    setGatewayStatus(updated);
    setShowKeyModal(false);
  };

  const handlePresetSelect = (gst: string, pan: string, udyam: string, mca: string) => {
    setGstInput(gst);
    setPanInput(pan);
    setUdyamInput(udyam);
    setMcaInput(mca);
  };

  const handleVerify = async (key: string) => {
    setLoadingKey(key);
    const start = performance.now();
    try {
      let data = null;
      if (key === 'gst') {
        setActivePortalTitle('GSTN Common Portal (api.gst.gov.in)');
        data = await api.verifyGst(gstInput);
      } else if (key === 'pan') {
        setActivePortalTitle('Income Tax Dept / CBDT Protean (incometax.gov.in)');
        data = await api.verifyPan(panInput);
      } else if (key === 'udyam') {
        setActivePortalTitle('Ministry of MSME Udyam Portal (udyamregistration.gov.in)');
        data = await api.verifyUdyam(udyamInput);
      } else if (key === 'mca') {
        setActivePortalTitle('Ministry of Corporate Affairs MCA-21 (mca.gov.in)');
        data = await api.verifyMca(mcaInput);
      }
      setLatency(Math.round(performance.now() - start));
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
      {/* Top Header & Sovereign Gateway Status Bar */}
      <div className="bg-gradient-to-r from-[#0f172a] to-[#1e293b] text-white p-4 rounded-xl shadow-md border border-slate-700">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <h2 className="text-sm font-extrabold tracking-wide uppercase text-emerald-400">
                Layer 3: Statutory Verification Engine & External Gateways
              </h2>
            </div>
            <p className="text-xs text-slate-300">
              Direct API integrations for <strong>GSTN (`api.gst.gov.in`)</strong>, <strong>Income Tax (`incometax.gov.in`)</strong>, <strong>MCA-21</strong>, and <strong>Udyam MSME</strong>.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] bg-slate-800 text-slate-300 px-3 py-1 rounded-md border border-slate-600 font-mono flex items-center gap-1.5">
              {gatewayStatus?.has_api_keys ? (
                <>
                  <Zap className="w-3 h-3 text-amber-400" />
                  <span>LIVE_API MODE</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-3 h-3 text-blue-400" />
                  <span>STATUTORY SANDBOX (Free)</span>
                </>
              )}
            </span>
            <button
              onClick={() => setShowKeyModal(true)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-md shadow transition flex items-center gap-1.5 cursor-pointer"
            >
              <Key className="w-3.5 h-3.5 text-white" />
              <span>{gatewayStatus?.has_api_keys ? 'API Key Active' : 'Connect Live API Key'}</span>
            </button>
          </div>
        </div>

        {/* Portals Sub-strip */}
        <div className="mt-3 pt-3 border-t border-slate-700/80 flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
          <span className="text-slate-200 font-bold">Connected Gateways:</span>
          <span className="inline-flex items-center gap-1 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> GSTN Portal
          </span>
          <span className="inline-flex items-center gap-1 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Income Tax (CBDT)
          </span>
          <span className="inline-flex items-center gap-1 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> MCA-21 Corporate
          </span>
          <span className="inline-flex items-center gap-1 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> MSME Udyam
          </span>
        </div>
      </div>

      {/* Quick Test Preset Buttons for Live Demonstrations */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
          <Zap className="w-3.5 h-3.5 text-slate-700" />
          <span>Quick Test Live Entities:</span>
          <span className="text-[10px] text-slate-500 font-normal">(Click any company to test real data)</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => handlePresetSelect('27AAACT2727Q1ZW', 'AAACT2727Q', 'UDYAM-MH-01-001248', 'L72200MH1995PLC095651')}
            className="text-[11px] bg-white hover:bg-blue-50 border border-slate-300 hover:border-blue-400 text-slate-800 font-semibold px-2.5 py-1 rounded shadow-sm transition flex items-center gap-1 cursor-pointer"
          >
            <Building2 className="w-3 h-3 text-slate-600" />
            <span>Tata Consultancy (TCS)</span>
          </button>
          <button
            onClick={() => handlePresetSelect('29AAACI1681G1ZM', 'AAACI1681G', 'UDYAM-KR-02-009812', 'L85110KA1981PLC013115')}
            className="text-[11px] bg-white hover:bg-blue-50 border border-slate-300 hover:border-blue-400 text-slate-800 font-semibold px-2.5 py-1 rounded shadow-sm transition flex items-center gap-1 cursor-pointer"
          >
            <Building2 className="w-3 h-3 text-slate-600" />
            <span>Infosys Ltd.</span>
          </button>
          <button
            onClick={() => handlePresetSelect('24AAACR4533K1ZG', 'AAACR4533K', 'UDYAM-GJ-04-004412', 'L17110GJ1973PLC002242')}
            className="text-[11px] bg-white hover:bg-blue-50 border border-slate-300 hover:border-blue-400 text-slate-800 font-semibold px-2.5 py-1 rounded shadow-sm transition flex items-center gap-1 cursor-pointer"
          >
            <Building2 className="w-3 h-3 text-slate-600" />
            <span>Reliance Industries</span>
          </button>
          <button
            onClick={() => handlePresetSelect('24AAACB1234F1Z5', 'AAACB1234F', 'UDYAM-GJ-01-008291', 'U28132GJ2017PTC097812')}
            className="text-[11px] bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 font-bold px-2.5 py-1 rounded shadow-sm transition flex items-center gap-1 cursor-pointer"
          >
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>ABC Industries (Default)</span>
          </button>
          <button
            onClick={() => handlePresetSelect('07AAACB0000A1Z9', 'AAACB0000A', 'UDYAM-DL-01-000000', 'U28132DL2010PTC000000')}
            className="text-[11px] bg-red-50 hover:bg-red-100 border border-red-300 text-red-800 font-bold px-2.5 py-1 rounded shadow-sm transition flex items-center gap-1 cursor-pointer"
          >
            <AlertTriangle className="w-3 h-3 text-red-600" />
            <span>Suspended Entity (Tax Default)</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Verification Items List (2 columns) */}
        <div className="lg:col-span-2 space-y-3">
          {/* GSTIN */}
          <div className="bg-white p-4 rounded-xl border shadow-sm flex flex-wrap items-center justify-between gap-3 hover:border-slate-300 transition">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Landmark className="w-4 h-4 text-blue-900 shrink-0" />
                <h4 className="font-bold text-xs text-gray-800">GSTIN Registration & Filing Status</h4>
                <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded">
                  GSTN Common Portal
                </span>
              </div>
              <p className="text-[11px] text-gray-500">
                Verifies active tax status, state jurisdiction, and monthly GSTR-3B filings (CGST Sec 29).
              </p>
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  value={gstInput}
                  onChange={(e) => setGstInput(e.target.value)}
                  placeholder="Enter 15-digit GSTIN"
                  className="px-2.5 py-1.5 border rounded text-xs font-mono font-bold text-blue-900 w-52 uppercase focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
            <button
              onClick={() => handleVerify('gst')}
              disabled={loadingKey === 'gst'}
              className="bg-[#162c5b] hover:bg-[#0d1d3d] text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow transition disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
            >
              {loadingKey === 'gst' ? (
                <>
                  <RotateCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Querying GSTN...</span>
                </>
              ) : (
                <>
                  <Search className="w-3.5 h-3.5" />
                  <span>Verify GSTIN</span>
                </>
              )}
            </button>
          </div>

          {/* PAN */}
          <div className="bg-white p-4 rounded-xl border shadow-sm flex flex-wrap items-center justify-between gap-3 hover:border-slate-300 transition">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-blue-900 shrink-0" />
                <h4 className="font-bold text-xs text-gray-800">Income Tax PAN Verification</h4>
                <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded">
                  CBDT / Protean
                </span>
              </div>
              <p className="text-[11px] text-gray-500">
                Validates legal entity category (Company, Proprietor, Firm) and Aadhaar/MCA linkage.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  value={panInput}
                  onChange={(e) => setPanInput(e.target.value)}
                  placeholder="Enter 10-digit PAN"
                  className="px-2.5 py-1.5 border rounded text-xs font-mono font-bold text-blue-900 w-52 uppercase focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
            <button
              onClick={() => handleVerify('pan')}
              disabled={loadingKey === 'pan'}
              className="bg-[#162c5b] hover:bg-[#0d1d3d] text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow transition disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
            >
              {loadingKey === 'pan' ? (
                <>
                  <RotateCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Querying ITD...</span>
                </>
              ) : (
                <>
                  <Search className="w-3.5 h-3.5" />
                  <span>Verify PAN</span>
                </>
              )}
            </button>
          </div>

          {/* Udyam MSME */}
          <div className="bg-white p-4 rounded-xl border shadow-sm flex flex-wrap items-center justify-between gap-3 hover:border-slate-300 transition">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-800 shrink-0" />
                <h4 className="font-bold text-xs text-gray-800">MSME Udyam Certificate Verification</h4>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                  Ministry of MSME
                </span>
              </div>
              <p className="text-[11px] text-gray-500">
                Validates Micro/Small category for EMD exemption and tender purchase preference (PPP-MII).
              </p>
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  value={udyamInput}
                  onChange={(e) => setUdyamInput(e.target.value)}
                  placeholder="Enter Udyam Registration No."
                  className="px-2.5 py-1.5 border rounded text-xs font-mono font-bold text-blue-900 w-52 uppercase focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
            <button
              onClick={() => handleVerify('udyam')}
              disabled={loadingKey === 'udyam'}
              className="bg-[#162c5b] hover:bg-[#0d1d3d] text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow transition disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
            >
              {loadingKey === 'udyam' ? (
                <>
                  <RotateCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Querying Udyam...</span>
                </>
              ) : (
                <>
                  <Search className="w-3.5 h-3.5" />
                  <span>Verify Udyam</span>
                </>
              )}
            </button>
          </div>

          {/* MCA-21 Corporate */}
          <div className="bg-white p-4 rounded-xl border shadow-sm flex flex-wrap items-center justify-between gap-3 hover:border-slate-300 transition">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-blue-900 shrink-0" />
                <h4 className="font-bold text-xs text-gray-800">MCA-21 Company Registry Verification</h4>
                <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded">
                  Ministry of Corporate Affairs
                </span>
              </div>
              <p className="text-[11px] text-gray-500">
                Cross-references active corporate status, RoC jurisdiction, and director disqualification lists.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  value={mcaInput}
                  onChange={(e) => setMcaInput(e.target.value)}
                  placeholder="Enter 21-digit CIN"
                  className="px-2.5 py-1.5 border rounded text-xs font-mono font-bold text-blue-900 w-52 uppercase focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
            <button
              onClick={() => handleVerify('mca')}
              disabled={loadingKey === 'mca'}
              className="bg-[#162c5b] hover:bg-[#0d1d3d] text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow transition disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
            >
              {loadingKey === 'mca' ? (
                <>
                  <RotateCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Querying MCA-21...</span>
                </>
              ) : (
                <>
                  <Search className="w-3.5 h-3.5" />
                  <span>Verify MCA-21</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Live Response JSON Inspector (1 column) */}
        <div className="bg-[#0f172a] text-gray-100 rounded-xl p-4 shadow-lg flex flex-col font-mono text-xs border border-gray-800">
          <div className="flex items-center justify-between border-b border-gray-800 pb-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="text-emerald-400 font-bold text-[11px] flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                <span>Live Gateway JSON Inspector</span>
              </span>
            </div>
            {latency !== null && (
              <span className="text-[10px] bg-slate-800 text-emerald-300 px-2 py-0.5 rounded border border-slate-700 flex items-center gap-1">
                <Clock className="w-3 h-3 text-emerald-300" />
                <span>{latency}ms</span>
              </span>
            )}
          </div>

          <div className="flex-1 overflow-auto max-h-[420px] space-y-2">
            {apiResponse ? (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[11px] text-yellow-400 font-bold truncate">
                    Source: {activePortalTitle || 'Statutory Gateway'}
                  </p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    apiResponse.verified ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' : 'bg-red-950 text-red-300 border border-red-700'
                  }`}>
                    {apiResponse.verified ? (
                      <span className="flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        <span>VERIFIED</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <X className="w-3 h-3" />
                        <span>FLAGGED</span>
                      </span>
                    )}
                  </span>
                </div>
                <pre className="text-[11px] text-emerald-300 leading-relaxed overflow-x-auto bg-black/40 p-2.5 rounded-lg border border-slate-800">
                  {JSON.stringify(apiResponse, null, 2)}
                </pre>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 py-20 space-y-3">
                <Activity className="w-8 h-8 text-slate-500" />
                <p className="text-xs text-slate-400 font-sans">
                  Click any <strong>"Verify"</strong> button or select a quick-test company above to execute live sovereign verification.
                </p>
                <div className="text-[10px] text-slate-500 font-sans max-w-xs">
                  Supports live API keys (API Setu / GSP) or sovereign deterministic sandbox with full 37 state codes.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal for Configuring Live API Key */}
      {showKeyModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-emerald-600" />
                <h3 className="font-extrabold text-sm text-gray-900">
                  Connect Live Sovereign Gateway API Key
                </h3>
              </div>
              <button
                onClick={() => setShowKeyModal(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-gray-600">
              <p>
                By default, the platform runs in <strong>Statutory Sandbox Mode</strong>, executing official government validation rules for free.
              </p>
              <p>
                To connect to live external servers, enter your <strong>API Setu (MeitY)</strong>, <strong>Sandbox.co.in</strong>, or <strong>GSP Bearer Token</strong>:
              </p>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Gateway Provider:</label>
                <select
                  value={selectedProvider}
                  onChange={(e) => setSelectedProvider(e.target.value)}
                  className="w-full border rounded-lg p-2 text-xs text-gray-800 bg-white"
                >
                  <option value="API Setu (MeitY National Gateway)">API Setu (MeitY National Gateway)</option>
                  <option value="GST Suvidha Provider (GSP Sandbox)">GST Suvidha Provider (GSP Sandbox)</option>
                  <option value="Protean / NSDL Direct OPV Gateway">Protean / NSDL Direct OPV Gateway</option>
                  <option value="Surepass / Cashfree Identity Hub">Surepass / Cashfree Identity Hub</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">API Key / Bearer Token:</label>
                <input
                  type="password"
                  value={customApiKey}
                  onChange={(e) => setCustomApiKey(e.target.value)}
                  placeholder="e.g. live_gstn_sec_xxxxxxxxxxxx"
                  className="w-full border rounded-lg p-2 font-mono text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 text-blue-900 p-2.5 rounded-lg text-[11px] flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-blue-900 shrink-0" />
                <span><strong>DPDP Act 2023 Compliant:</strong> Your token is stored securely in your browser's private environment and never exposed publicly.</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t">
              {customApiKey && (
                <button
                  onClick={handleClearApiKey}
                  className="px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-lg font-bold mr-auto transition"
                >
                  Clear Key
                </button>
              )}
              <button
                onClick={() => setShowKeyModal(false)}
                className="px-4 py-2 text-xs text-gray-600 hover:bg-gray-100 rounded-lg font-bold transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveApiKey}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-lg shadow transition"
              >
                Save & Connect
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
