import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  UploadCloud,
  FolderOpen,
  FileText,
  AlertTriangle,
  AlertOctagon,
  CheckCircle2,
  ShieldCheck,
  Clock,
  Ban,
  RotateCw,
  Info,
  Bot,
  Landmark,
  Link2,
  Search,
  Zap,
  Check,
  X,
  Building2,
  Scale,
  HardHat,
  User,
  MessageSquare,
  ArrowRight
} from 'lucide-react';
import { api } from '../../services/api';
import type { DocumentOCRResult, DocumentChatResponse } from '../../types';
import { useAuth } from '../../context/AuthContext';

/**
 * High-Legibility Formatted AI Message Renderer
 * Formats Markdown tables, headings, lists, codes, and bold text with
 * maximum legibility in both Light Mode and Dark Mode.
 */
const FormattedAiMessage: React.FC<{ content: string }> = ({ content }) => {
  return (
    <div className="text-slate-900 dark:text-slate-100 text-xs sm:text-[13px] leading-relaxed">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto my-3 rounded-xl border border-slate-300 dark:border-slate-700 shadow-xs bg-white dark:bg-slate-900/90">
              <table className="w-full text-left border-collapse text-xs" {...props} />
            </div>
          ),
          thead: ({ node, ...props }) => (
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-cyan-300 font-extrabold border-b-2 border-slate-300 dark:border-slate-700" {...props} />
          ),
          tbody: ({ node, ...props }) => (
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-900 dark:text-slate-100" {...props} />
          ),
          tr: ({ node, ...props }) => (
            <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors" {...props} />
          ),
          th: ({ node, ...props }) => (
            <th className="p-2.5 font-black uppercase tracking-wider text-[11px] text-slate-800 dark:text-cyan-200 border-r last:border-r-0 border-slate-200 dark:border-slate-700" {...props} />
          ),
          td: ({ node, ...props }) => (
            <td className="p-2.5 font-medium border-r last:border-r-0 border-slate-200 dark:border-slate-800" {...props} />
          ),
          h1: ({ node, ...props }) => (
            <h1 className="text-sm font-black text-slate-900 dark:text-cyan-300 mt-3 mb-1.5 border-b border-slate-300 dark:border-slate-700 pb-1" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-xs sm:text-sm font-black text-slate-900 dark:text-cyan-300 mt-2.5 mb-1" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-xs font-black text-slate-900 dark:text-cyan-200 mt-2 mb-1" {...props} />
          ),
          h4: ({ node, ...props }) => (
            <h4 className="text-xs font-bold text-slate-800 dark:text-cyan-200 mt-1.5 mb-0.5" {...props} />
          ),
          p: ({ node, ...props }) => (
            <p className="my-1.5 leading-relaxed text-slate-800 dark:text-slate-200" {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul className="list-disc list-inside space-y-1 my-1.5 pl-1 text-slate-800 dark:text-slate-200" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal list-inside space-y-1 my-1.5 pl-1 text-slate-800 dark:text-slate-200" {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className="leading-relaxed font-medium" {...props} />
          ),
          strong: ({ node, ...props }) => (
            <strong className="font-extrabold text-slate-950 dark:text-amber-300" {...props} />
          ),
          code: ({ node, inline, ...props }: any) => (
            <code className="font-mono text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-blue-900 dark:text-cyan-300 px-1.5 py-0.5 rounded border border-slate-300 dark:border-slate-700" {...props} />
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote className="border-l-4 border-cyan-500 bg-cyan-50 dark:bg-cyan-950/40 p-2.5 my-2 rounded-r-xl text-xs italic text-cyan-950 dark:text-cyan-200" {...props} />
          )
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export const DocumentIntakeOCR: React.FC = () => {
  const [customFile, setCustomFile] = useState<File | null>(null);
  const [pasteMode, setPasteMode] = useState<boolean>(false);
  const [pastedText, setPastedText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [ocrResult, setOcrResult] = useState<DocumentOCRResult | null>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Floating DocScrutiny AI State (Specific to this S3 Section)
  const [isFloatingAiOpen, setIsFloatingAiOpen] = useState<boolean>(false);
  const [isAiMinimized, setIsAiMinimized] = useState<boolean>(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const { user, switchMasterRole } = useAuth();

  // Dedicated DocScrutiny AI role directly bound to logged-in user
  const isOfficer = user?.role === 'officer';
  const effectiveRole = isOfficer ? 'officer' : 'seller';
  const effectiveUserId = user?.userId || (isOfficer ? 'GOV-OFF-9012' : 'SELLER-GJ-8841');
  const effectiveOrg = user?.organization || (isOfficer ? 'Government Procurement Directorate' : 'ABC Industries Pvt. Ltd.');

  const [docAiTab, setDocAiTab] = useState<'document' | 'comparison'>('document');
  const [docAiQuestion, setDocAiQuestion] = useState<string>('');
  const [docAiLoading, setDocAiLoading] = useState<boolean>(false);
  const [docAiHistory, setDocAiHistory] = useState<Array<{ role: 'user' | 'ai'; text: string; response?: DocumentChatResponse }>>([
    {
      role: 'ai',
      text: "Namaste! I am **DocScrutiny AI**, your dedicated document verification and comparative bid intelligence engine.\n\n• **For Sellers**: You can analyze your own document flags, calculate expiry timelines, guide statutory rectification, and compare public bid parameters across competitors while competitor personal documents are strictly protected under DPDP Act 2023.\n• **For Legal Officers**: Switch to Officer Mode to exercise statutory scrutiny over uploaded documents, certificates, and compliance dossiers under GFR 2017 Rule 144."
    }
  ]);

  useEffect(() => {
    if (isFloatingAiOpen && !isAiMinimized) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [docAiHistory, isFloatingAiOpen, isAiMinimized]);

  const handleAskDocAI = async (questionText: string) => {
    const q = questionText.trim();
    if (!q) return;
    setDocAiLoading(true);
    setIsFloatingAiOpen(true);
    setIsAiMinimized(false);
    try {
      const res = await api.askDocumentScrutinyAI({
        question: q,
        filename: ocrResult?.filename || customFile?.name || '',
        active_document: ocrResult,
        organization: effectiveOrg,
        role: effectiveRole,
        user_id: effectiveUserId
      });
      setDocAiHistory(prev => [
        ...prev,
        { role: 'user', text: q },
        { role: 'ai', text: res.answer, response: res }
      ]);
      setDocAiQuestion('');
    } catch (err) {
      console.error("DocAI Error:", err);
    } finally {
      setDocAiLoading(false);
    }
  };

  const handleSendToGeMMy = (questionText: string) => {
    const q = questionText.trim();
    if (!q) return;
    setIsAiMinimized(true);
    window.dispatchEvent(new CustomEvent('open-gemmy-ai', {
      detail: { question: q, autoSend: true }
    }));
  };

  const handleRunOCRWithFile = async (fileToUpload: File) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await api.uploadDocumentOCR(fileToUpload);
      setOcrResult(res);
      // Auto-open floating AI assistant on successful extraction
      setIsFloatingAiOpen(true);
      setIsAiMinimized(false);
    } catch (err: any) {
      console.error('OCR Extraction error:', err);
      setErrorMessage(err.message || 'Failed to extract text from the uploaded document. Please check the file and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomFileUpload = (file: File) => {
    setCustomFile(file);
    setPasteMode(false);
    handleRunOCRWithFile(file);
  };

  const handleProcessPastedText = () => {
    const trimmed = pastedText.trim();
    if (!trimmed) {
      setErrorMessage('Please paste or enter document text before processing.');
      return;
    }
    const blob = new Blob([trimmed], { type: 'text/plain' });
    const textFile = new File([blob], 'pasted_document.txt', { type: 'text/plain' });
    setCustomFile(textFile);
    handleRunOCRWithFile(textFile);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleCustomFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleResetDocument = () => {
    setCustomFile(null);
    setOcrResult(null);
    setPastedText('');
    setErrorMessage(null);
  };

  return (
    <div className="space-y-6 relative">
      {/* Title & Statutory Overview Banner */}
      <div className="bg-gradient-to-r from-[#062134] to-[#0c3952] text-white p-5 rounded-2xl shadow-md border border-[#1b4360] flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-[#f37021] text-white text-[10px] font-black uppercase px-2 py-0.5 rounded shadow-xs">
              Layer 2 Engine
            </span>
            <span className="bg-blue-500/30 text-blue-200 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-400/30">
              Live OCR & Sovereign Gateway
            </span>
            <span className="bg-emerald-500/30 text-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-400/30">
              Floating AI Assistant Active
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-black tracking-tight">
            AI Document Intake, OCR Extraction & Sovereign Verification
          </h2>
          <p className="text-xs text-gray-300 mt-0.5 max-w-2xl">
            Upload any bidder document (PDF, PNG, JPG, or TXT) to perform optical character recognition, extract statutory IDs (GSTIN, PAN, Udyam, UDIN, EPFO, ESIC), and verify legitimacy directly against sovereign registries (CBDT, GSTN, MSME, ICAI, EPFO, ESIC).
          </p>
        </div>
        <div className="flex items-center gap-2 text-right">
          <div className="bg-white/10 p-3 rounded-xl border border-white/10 text-center min-w-[110px]">
            <p className="text-[10px] uppercase font-bold text-gray-300">Statutory Standard</p>
            <p className="font-mono text-xs font-black text-amber-300 mt-0.5">GFR 2017 / GTC 4</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Document Intake Station (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-extrabold text-xs text-[#062134] uppercase tracking-wider flex items-center gap-1.5">
                <UploadCloud className="w-4 h-4 text-orange-500" />
                <span>Document Intake Station</span>
              </h3>
              <div className="flex items-center gap-1 bg-gray-100 p-0.5 rounded-lg text-[10px] font-bold">
                <button
                  type="button"
                  onClick={() => setPasteMode(false)}
                  className={`px-2 py-1 rounded-md transition cursor-pointer ${!pasteMode ? 'bg-white text-orange-600 shadow-xs' : 'text-gray-500 hover:text-gray-900'}`}
                >
                  File Upload
                </button>
                <button
                  type="button"
                  onClick={() => setPasteMode(true)}
                  className={`px-2 py-1 rounded-md transition cursor-pointer ${pasteMode ? 'bg-white text-orange-600 shadow-xs' : 'text-gray-500 hover:text-gray-900'}`}
                >
                  Paste Text
                </button>
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Extraction Error</p>
                  <p className="text-[11px] mt-0.5">{errorMessage}</p>
                </div>
              </div>
            )}

            {!pasteMode ? (
              /* Custom File Upload Dropzone */
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center gap-2.5 ${
                  isDragOver
                    ? 'border-orange-500 bg-orange-50/70'
                    : 'border-gray-300 hover:border-[#f37021] bg-gray-50/60 hover:bg-orange-50/30'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg,.txt"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      handleCustomFileUpload(e.target.files[0]);
                    }
                  }}
                />
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 shadow-xs">
                  {customFile ? <FileText className="w-6 h-6" /> : <FolderOpen className="w-6 h-6" />}
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-800">
                    {customFile ? customFile.name : 'Click to Browse or Drag & Drop File'}
                  </p>
                  <p className="text-[10px] text-gray-500 mt-1">
                    {customFile
                      ? `${(customFile.size / 1024).toFixed(1)} KB • Click to choose another file`
                      : 'Accepts PDF, PNG, JPG, JPEG, and TXT files (up to 15MB)'}
                  </p>
                </div>
              </div>
            ) : (
              /* Direct Text / Dossier Paste Area */
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-gray-700 block">
                  Paste Document Text / Dossier Content:
                </label>
                <textarea
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  placeholder="Paste raw vendor verification dossier text, GSTIN certificate copy, PAN data, or statutory declaration here..."
                  rows={8}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                />
                <button
                  type="button"
                  onClick={handleProcessPastedText}
                  disabled={loading || !pastedText.trim()}
                  className="w-full bg-[#f37021] hover:bg-[#e05e10] disabled:opacity-50 text-white font-extrabold text-xs py-2.5 rounded-xl shadow-md transition cursor-pointer flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Extracting & Verifying Text...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-3.5 h-3.5 text-white" />
                      <span>Process Pasted Document Text</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Active Document Status & Reset */}
            {customFile && (
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-gray-700 flex items-center gap-1.5 truncate">
                    <FileText className="w-3.5 h-3.5 text-gray-600 shrink-0" />
                    <span className="truncate">{customFile.name}</span>
                  </span>
                  <span className="text-[10px] font-mono text-gray-500 shrink-0">
                    {(customFile.size / 1024).toFixed(1)} KB
                  </span>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleRunOCRWithFile(customFile)}
                    disabled={loading}
                    className="flex-1 bg-[#062134] hover:bg-[#0c3952] disabled:opacity-50 text-white text-xs font-bold py-2 rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <RotateCw className="w-3.5 h-3.5 text-white" />
                    <span>Re-Run OCR</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleResetDocument}
                    disabled={loading}
                    className="px-3 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-bold py-2 rounded-lg transition cursor-pointer"
                  >
                    Clear
                  </button>
                </div>
              </div>
            )}

            {/* Instruction Checklist */}
            <div className="p-3.5 bg-blue-50/50 border border-blue-100 rounded-xl space-y-1.5 text-xs text-blue-950">
              <p className="font-extrabold text-[11px] text-blue-900 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Statutory Parameters Evaluated by AI Engine:</span>
              </p>
              <ul className="text-[10px] text-blue-800 space-y-1 list-disc list-inside">
                <li>Tax Registry: GSTIN status, last GSTR-3B return period, and CBDT PAN</li>
                <li>MSME Classification: Udyam registration, category, and EMD eligibility</li>
                <li>Labor Mandates: EPFO Establishment code and ESIC employer registration</li>
                <li>Public Procurement: Make in India (MII) % & Class-I rule, ICAI UDIN, OEM MAF</li>
                <li>Financials: Multi-year audited turnover and 3-year average computation</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right: AI Scrutiny Results Dashboard (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {loading ? (
            <div className="bg-white p-14 rounded-2xl border border-gray-200 shadow-sm text-center space-y-4">
              <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <div>
                <p className="text-sm font-extrabold text-[#062134]">Performing Live OCR & Sovereign Verification...</p>
                <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                  Extracting native text layers, calculating cryptographic hash digests, and querying sovereign government APIs (CBDT, GSTN, MSME, EPFO, ESIC, ICAI).
                </p>
              </div>
            </div>
          ) : ocrResult ? (
            <div className="space-y-4">
              {/* Top Verdict Badges Grid (Legitimacy + Expiry) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* 1. Legitimacy Verdict Badge */}
                <div
                  className={`p-4 rounded-2xl border shadow-xs flex flex-col justify-between ${
                    ocrResult.legitimacy_status === 'LEGITIMATE'
                      ? 'bg-gradient-to-br from-emerald-50 to-teal-50/50 border-emerald-300'
                      : ocrResult.legitimacy_status === 'SUSPICIOUS'
                      ? 'bg-gradient-to-br from-amber-50 to-orange-50/50 border-amber-300'
                      : 'bg-gradient-to-br from-red-50 to-rose-50/50 border-red-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-gray-500">
                      AI Legitimacy Assessment
                    </span>
                    <span
                      className={`text-xs font-black px-2 py-0.5 rounded-full ${
                        ocrResult.legitimacy_status === 'LEGITIMATE'
                          ? 'bg-emerald-600 text-white'
                          : ocrResult.legitimacy_status === 'SUSPICIOUS'
                          ? 'bg-amber-600 text-white'
                          : 'bg-red-600 text-white'
                      }`}
                    >
                      {ocrResult.legitimacy_score ?? ocrResult.confidence_score}% Confidence
                    </span>
                  </div>

                  <div className="my-2">
                    <p
                      className={`text-base font-black flex items-center gap-1.5 ${
                        ocrResult.legitimacy_status === 'LEGITIMATE'
                          ? 'text-emerald-950'
                          : ocrResult.legitimacy_status === 'SUSPICIOUS'
                          ? 'text-amber-950'
                          : 'text-red-950'
                      }`}
                    >
                      {ocrResult.legitimacy_status === 'LEGITIMATE' ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      ) : ocrResult.legitimacy_status === 'SUSPICIOUS' ? (
                        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                      ) : (
                        <AlertOctagon className="w-5 h-5 text-red-600 shrink-0" />
                      )}
                      <span>
                        {ocrResult.legitimacy_status === 'LEGITIMATE'
                          ? '100% LEGITIMATE (VERIFIED)'
                          : ocrResult.legitimacy_status === 'SUSPICIOUS'
                          ? 'SUSPICIOUS / DEFAULTED'
                          : 'FORGED / NON-COMPLIANT'}
                      </span>
                    </p>
                    <p className="text-[11px] text-gray-600 mt-1 leading-relaxed">
                      {ocrResult.legitimacy_status === 'LEGITIMATE'
                        ? 'Digital signature SHA-256 validated. Sovereign authority records match letter-for-letter with sovereign gateways.'
                        : ocrResult.legitimacy_status === 'SUSPICIOUS'
                        ? 'Issuer authentic but operational default or statutory suspension active under sovereign rules.'
                        : 'Tampered instrument or statutory discrepancies detected across sovereign registries.'}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-gray-200/60 flex items-center justify-between text-[10px]">
                    <span className="font-bold text-gray-500">Seal Verification:</span>
                    <span className={`font-extrabold flex items-center gap-1 ${ocrResult.seal_verified ? 'text-emerald-700' : 'text-red-700'}`}>
                      {ocrResult.seal_verified ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      <span>{ocrResult.seal_verified ? 'Govt Watermark Valid' : 'Forged / Seal Missing'}</span>
                    </span>
                  </div>
                </div>

                {/* 2. Expiry & Validity Period Badge */}
                <div
                  className={`p-4 rounded-2xl border shadow-xs flex flex-col justify-between ${
                    ocrResult.validity_status === 'VALID' || ocrResult.validity_status === 'PERPETUAL_ACTIVE'
                      ? 'bg-gradient-to-br from-blue-50 to-indigo-50/50 border-blue-300'
                      : ocrResult.validity_status === 'EXPIRING_SOON'
                      ? 'bg-gradient-to-br from-yellow-50 to-amber-50/50 border-yellow-300'
                      : 'bg-gradient-to-br from-red-50 to-orange-50/50 border-red-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-gray-500">
                      Statutory Validity & Expiry
                    </span>
                    <span
                      className={`text-xs font-black px-2 py-0.5 rounded-full ${
                        ocrResult.validity_status === 'VALID' || ocrResult.validity_status === 'PERPETUAL_ACTIVE'
                          ? 'bg-blue-600 text-white'
                          : ocrResult.validity_status === 'EXPIRING_SOON'
                          ? 'bg-amber-600 text-white'
                          : 'bg-red-600 text-white'
                      }`}
                    >
                      {ocrResult.validity_status === 'PERPETUAL_ACTIVE'
                        ? 'PERPETUAL'
                        : ocrResult.is_expired
                        ? 'EXPIRED / SUSPENDED'
                        : ocrResult.validity_status}
                    </span>
                  </div>

                  <div className="my-2">
                    <p
                      className={`text-base font-black flex items-center gap-1.5 ${
                        ocrResult.validity_status === 'VALID' || ocrResult.validity_status === 'PERPETUAL_ACTIVE'
                          ? 'text-blue-950'
                          : ocrResult.validity_status === 'EXPIRING_SOON'
                          ? 'text-amber-950'
                          : 'text-red-950'
                      }`}
                    >
                      {ocrResult.validity_status === 'VALID' || ocrResult.validity_status === 'PERPETUAL_ACTIVE' ? (
                        <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
                      ) : ocrResult.validity_status === 'EXPIRING_SOON' ? (
                        <Clock className="w-5 h-5 text-amber-600 shrink-0" />
                      ) : (
                        <Ban className="w-5 h-5 text-red-600 shrink-0" />
                      )}
                      <span>
                        {ocrResult.validity_status === 'PERPETUAL_ACTIVE'
                          ? 'PERMANENTLY VALID (ACTIVE)'
                          : ocrResult.is_expired
                          ? 'EXPIRED / SUSPENDED'
                          : 'STATUTORILY VALID'}
                      </span>
                    </p>
                    <p className="text-[11px] text-gray-600 mt-1 leading-relaxed">
                      {ocrResult.validity_details || (ocrResult.is_expired ? 'Document has expired and cannot be accepted for bid qualification.' : 'Document is currently valid for government procurement.')}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-gray-200/60 flex items-center justify-between text-[10px]">
                    <span className="font-bold text-gray-500">Days Remaining / Overdue:</span>
                    <span className={`font-mono font-black ${ocrResult.is_expired ? 'text-red-700' : 'text-blue-800'}`}>
                      {ocrResult.days_until_expiry !== undefined && ocrResult.days_until_expiry !== null
                        ? ocrResult.days_until_expiry < 0
                          ? `${Math.abs(ocrResult.days_until_expiry)} Days Overdue`
                          : `${ocrResult.days_until_expiry} Days Active`
                        : 'Perpetual Validity'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Extracted Statutory Entities Table */}
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b pb-2">
                  <h4 className="font-extrabold text-xs text-[#062134] uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-[#062134] shrink-0" />
                    <span>Extracted Document Parameters</span>
                    <span className="text-[10px] text-gray-400 font-mono font-normal">({ocrResult.filename})</span>
                  </h4>
                  {/* Quick Floating DocScrutiny AI Launcher */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsFloatingAiOpen(true);
                      setIsAiMinimized(false);
                    }}
                    className="flex items-center gap-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-extrabold text-[11px] px-3 py-1 rounded-xl shadow-xs transition transform hover:scale-105 cursor-pointer"
                  >
                    <Bot className="w-3.5 h-3.5 text-white" />
                    <span>Ask DocScrutiny AI</span>
                    <span className="bg-white/20 text-[9px] px-1 py-0.2 rounded font-mono">Floating</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Document Classification</span>
                    <p className="font-extrabold text-[#062134] mt-0.5">{ocrResult.document_type}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Recognized Legal Entity</span>
                    <p className="font-extrabold text-gray-800 mt-0.5">
                      {ocrResult.extracted_legal_name || <span className="text-gray-400 font-normal italic">Not specified in document</span>}
                    </p>
                  </div>
                </div>

                <div className="border border-gray-100 rounded-xl divide-y divide-gray-100 text-xs bg-gray-50/40">
                  {ocrResult.extracted_gstin && (
                    <div className="p-2.5 px-3 flex justify-between items-center">
                      <span className="text-gray-500">Extracted GSTIN:</span>
                      <span className={`font-mono font-black ${ocrResult.extracted_gstin?.endsWith('9Z9') ? 'text-red-600 bg-red-50 px-2 py-0.5 rounded' : 'text-blue-900'}`}>
                        {ocrResult.extracted_gstin}
                      </span>
                    </div>
                  )}
                  {ocrResult.extracted_pan && (
                    <div className="p-2.5 px-3 flex justify-between items-center">
                      <span className="text-gray-500">Extracted PAN:</span>
                      <span className={`font-mono font-black ${ocrResult.tampering_detected ? 'text-red-600 bg-red-50 px-2 py-0.5 rounded' : 'text-blue-900'}`}>
                        {ocrResult.extracted_pan}
                      </span>
                    </div>
                  )}
                  {ocrResult.extracted_udyam && (
                    <div className="p-2.5 px-3 flex justify-between items-center">
                      <span className="text-gray-500">Udyam Registration:</span>
                      <span className="font-mono font-black text-blue-900">{ocrResult.extracted_udyam}</span>
                    </div>
                  )}
                  {ocrResult.extracted_address && (
                    <div className="p-2.5 px-3 flex justify-between items-start">
                      <span className="text-gray-500 shrink-0">Registered Address:</span>
                      <span className="font-medium text-gray-800 text-right max-w-xs">{ocrResult.extracted_address}</span>
                    </div>
                  )}
                  {ocrResult.extracted_constitution && (
                    <div className="p-2.5 px-3 flex justify-between items-center">
                      <span className="text-gray-500">Constitution of Business:</span>
                      <span className="font-bold text-gray-800">{ocrResult.extracted_constitution}</span>
                    </div>
                  )}
                  {ocrResult.extracted_epfo && (
                    <div className="p-2.5 px-3 flex justify-between items-center">
                      <span className="text-gray-500">EPFO Establishment Code:</span>
                      <span className="font-mono font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {ocrResult.extracted_epfo}
                      </span>
                    </div>
                  )}
                  {ocrResult.extracted_esic && (
                    <div className="p-2.5 px-3 flex justify-between items-center">
                      <span className="text-gray-500">ESIC Employer Code:</span>
                      <span className="font-mono font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {ocrResult.extracted_esic}
                      </span>
                    </div>
                  )}
                  {ocrResult.extracted_mii_percentage !== undefined && ocrResult.extracted_mii_percentage !== null && (
                    <div className="p-2.5 px-3 flex justify-between items-center bg-orange-50/40">
                      <span className="text-gray-700 font-semibold">Make in India (MII) Local Content:</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-black text-orange-700 font-mono">{ocrResult.extracted_mii_percentage}%</span>
                        <span className="text-[9px] bg-emerald-600 text-white font-black px-1.5 py-0.5 rounded">
                          {ocrResult.extracted_mii_class || 'Class-I Local Supplier'}
                        </span>
                      </div>
                    </div>
                  )}
                  {ocrResult.extracted_udin && (
                    <div className="p-2.5 px-3 flex justify-between items-center">
                      <span className="text-gray-500">ICAI UDIN for CA Certificate:</span>
                      <span className="font-mono font-black text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {ocrResult.extracted_udin}
                      </span>
                    </div>
                  )}
                  {ocrResult.extracted_oem_auth && (
                    <div className="p-2.5 px-3 flex justify-between items-start">
                      <span className="text-gray-500 shrink-0">OEM Authorization Reference:</span>
                      <span className="font-bold text-gray-800 text-right max-w-xs">{ocrResult.extracted_oem_auth}</span>
                    </div>
                  )}
                  {ocrResult.tender_ref && (
                    <div className="p-2.5 px-3 flex justify-between items-center">
                      <span className="text-gray-500">Tender / Bid Reference:</span>
                      <span className="font-mono font-black text-purple-900">{ocrResult.tender_ref}</span>
                    </div>
                  )}
                  {ocrResult.extracted_turnover && (
                    <div className="p-2.5 px-3 flex justify-between items-center">
                      <span className="text-gray-500">Annual Turnover (Avg):</span>
                      <span className="font-mono font-black text-emerald-700">₹{ocrResult.extracted_turnover} Lakhs</span>
                    </div>
                  )}
                  {ocrResult.turnover_breakdown && Object.keys(ocrResult.turnover_breakdown).length > 0 && (
                    <div className="p-3 bg-amber-50/50 space-y-1.5">
                      <span className="text-[10px] font-black uppercase text-amber-900 tracking-wider">
                        Past Financial Years Audited Turnover Breakdown
                      </span>
                      <div className="grid grid-cols-3 gap-1.5 text-center">
                        {Object.entries(ocrResult.turnover_breakdown).map(([fy, item]) => (
                          <div key={fy} className="bg-white p-1.5 rounded-lg border border-amber-200 shadow-2xs">
                            <span className="text-[9px] font-bold text-gray-500 block">{fy}</span>
                            <span className="text-xs font-black text-emerald-800 font-mono block">{item.declared_display}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {ocrResult.document_date && (
                    <div className="p-2.5 px-3 flex justify-between items-center">
                      <span className="text-gray-500">Certificate / Issue Date:</span>
                      <span className="font-medium text-gray-700">{ocrResult.document_date}</span>
                    </div>
                  )}
                  {ocrResult.expiry_date && (
                    <div className="p-2.5 px-3 flex justify-between items-center bg-orange-50/50">
                      <span className="text-orange-950 font-bold">Document Expiry Date:</span>
                      <span className={`font-mono font-black ${ocrResult.is_expired ? 'text-red-600' : 'text-blue-900'}`}>
                        {ocrResult.expiry_date}
                      </span>
                    </div>
                  )}
                  {!ocrResult.extracted_gstin && !ocrResult.extracted_pan && !ocrResult.extracted_udyam && !ocrResult.extracted_epfo && !ocrResult.extracted_esic && (
                    <div className="p-3 text-center text-gray-500 italic text-xs">
                      No statutory tax or enterprise registration numbers detected in this document.
                    </div>
                  )}
                </div>
              </div>

              {/* Sovereign Database Cross-Verification Table */}
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
                <h4 className="font-extrabold text-xs text-[#062134] uppercase tracking-wider flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Landmark className="w-4 h-4 text-[#062134] shrink-0" />
                    <span>Sovereign Database Cross-Verification Checks</span>
                  </span>
                  <span className="text-[10px] text-gray-400">Live Registry Handshake</span>
                </h4>

                <div className="space-y-2 text-xs">
                  {ocrResult.legitimacy_checks && ocrResult.legitimacy_checks.length > 0 ? (
                    ocrResult.legitimacy_checks.map((check, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-xl border flex items-start justify-between gap-3 ${
                          check.passed
                            ? 'bg-emerald-50/50 border-emerald-200'
                            : 'bg-red-50/60 border-red-200'
                        }`}
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            {check.passed ? (
                              <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0 font-bold" />
                            ) : (
                              <X className="w-3.5 h-3.5 text-red-700 shrink-0 font-bold" />
                            )}
                            <span className="font-extrabold text-gray-900 text-xs">{check.name}</span>
                          </div>
                          <p className="text-[11px] text-gray-600">{check.details}</p>
                          <p className="text-[9px] text-gray-400 font-mono">Source Gateway: {check.source}</p>
                        </div>
                        <span
                          className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider shrink-0 ${
                            check.passed ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {check.passed ? 'VERIFIED' : 'FAILED'}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-xl text-center text-gray-500">
                      No sovereign IDs identified for registry cross-check.
                    </div>
                  )}
                </div>
              </div>

              {/* Cross-Document Consistency Matrix */}
              {ocrResult.cross_check_summary && ocrResult.extracted_gstin && ocrResult.extracted_pan && (
                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
                  <h4 className="font-extrabold text-xs text-[#062134] uppercase tracking-wider flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Link2 className="w-4 h-4 text-[#062134] shrink-0" />
                      <span>Cross-Document Consistency & Reconciliation</span>
                    </span>
                    <span className="text-[10px] text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded">
                      Tax Instrument Match
                    </span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="p-3 bg-gray-50 rounded-xl border flex items-center justify-between">
                      <div>
                        <p className="font-bold text-gray-800 text-[11px]">PAN vs GSTIN Embedded Link</p>
                        <p className="text-[10px] text-gray-500 font-mono">
                          GSTIN[2:12] === Uploaded PAN
                        </p>
                      </div>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded ${ocrResult.cross_check_summary.pan_gstin_match ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                        {ocrResult.cross_check_summary.pan_gstin_match ? 'MATCHED (100%)' : 'MISMATCH (ALERT)'}
                      </span>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-xl border flex items-center justify-between">
                      <div>
                        <p className="font-bold text-gray-800 text-[11px]">Entity Legal Name Consistency</p>
                        <p className="text-[10px] text-gray-500">CBDT & GSTN Master Records</p>
                      </div>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded ${ocrResult.cross_check_summary.legal_name_match ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                        {ocrResult.cross_check_summary.legal_name_match ? 'EXACT MATCH' : 'UNVERIFIED'}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-blue-950">
                    <p className="font-bold text-[11px]">AI Auditor Verdict:</p>
                    <p className="text-[11px] text-blue-900 mt-0.5">
                      {ocrResult.cross_check_summary.audit_verdict}
                    </p>
                  </div>
                </div>
              )}

              {/* Pixel-Level Forensic & Digital Seal Tamper Inspection */}
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
                <h4 className="font-extrabold text-xs text-[#062134] uppercase tracking-wider flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Search className="w-4 h-4 text-[#062134] shrink-0" />
                    <span>Pixel Forensics & Anti-Tamper Inspection</span>
                  </span>
                  <span className="text-[10px] text-gray-400">Cryptographic Verification</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-gray-50 rounded-xl border">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Font Consistency & Text Layer</span>
                    <p className={`font-bold mt-1 ${ocrResult.tamper_analysis?.font_consistency?.includes('MISMATCH') ? 'text-red-700' : 'text-emerald-800'}`}>
                      {ocrResult.tamper_analysis?.font_consistency || 'UNIFORM (Native document text verified)'}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl border">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Pixel Tamper Manipulation Risk</span>
                    <p className={`font-bold mt-1 ${ocrResult.tamper_analysis?.pixel_tamper_risk?.includes('HIGH') ? 'text-red-700' : 'text-emerald-800'}`}>
                      {ocrResult.tamper_analysis?.pixel_tamper_risk || 'LOW (Zero alteration artifacts)'}
                    </p>
                  </div>
                </div>

                <div className="p-2.5 bg-gray-50 rounded-xl border text-[10px] font-mono text-gray-600 flex items-center justify-between">
                  <span>Cryptographic Digest:</span>
                  <span className="font-bold text-gray-800">{ocrResult.tamper_analysis?.hash_checksum}</span>
                </div>
              </div>

              {/* Floating Dock Status Banner */}
              <div className="bg-gradient-to-r from-cyan-900/10 via-blue-900/10 to-slate-900/10 dark:bg-slate-900/60 p-4 rounded-2xl border border-cyan-500/30 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center shrink-0">
                    <Bot className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs text-cyan-950 dark:text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                      <span>DocScrutiny AI Floating Console</span>
                      <span className="text-[9px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold px-1.5 py-0.5 rounded">
                        Window Active
                      </span>
                    </h4>
                    <p className="text-[11px] text-gray-600 dark:text-gray-400">
                      Chat with DocScrutiny AI in the floating assistant window on the bottom right.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsFloatingAiOpen(true);
                    setIsAiMinimized(false);
                  }}
                  className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-sm transition cursor-pointer flex items-center gap-1.5 shrink-0"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{isFloatingAiOpen && !isAiMinimized ? 'Bring AI to Front' : 'Open Floating AI'}</span>
                </button>
              </div>
            </div>
          ) : (
            /* Clean Initial Empty State */
            <div className="bg-white p-12 rounded-2xl border border-gray-200 shadow-sm text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center mx-auto shadow-xs">
                <FileText className="w-8 h-8 text-orange-600" />
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <h4 className="text-sm font-extrabold text-[#062134]">No Document Evaluated Yet</h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Upload a vendor verification dossier, GST certificate (REG-06), PAN card, Udyam MSME certificate, or CA turnover statement in the intake station on the left to extract credentials and execute live sovereign checks.
                </p>
              </div>

              <div className="pt-4 border-t border-gray-100 grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-left max-w-lg mx-auto">
                <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="text-[10px] font-bold text-gray-400 uppercase block">Supported Format</span>
                  <span className="text-xs font-black text-[#062134] mt-0.5 block">PDF, TXT, PNG, JPG</span>
                </div>
                <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="text-[10px] font-bold text-gray-400 uppercase block">Registries Checked</span>
                  <span className="text-xs font-black text-emerald-800 mt-0.5 block">GSTN, CBDT, MSME, EPFO</span>
                </div>
                <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-100 col-span-2 sm:col-span-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase block">Zero-Trust Security</span>
                  <span className="text-xs font-black text-blue-900 mt-0.5 block">SHA-256 Digest</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* =========================================================================
          FLOATING DOCSCRUTINY AI ASSISTANT (Exclusive to this S3 / Document Scrutiny Window)
          ========================================================================= */}
      <div className="fixed bottom-6 right-4 sm:right-6 z-40 flex flex-col items-end gap-2">
        {/* Closed or Minimized Floating Button */}
        {(!isFloatingAiOpen || isAiMinimized) && (
          <button
            type="button"
            onClick={() => {
              setIsFloatingAiOpen(true);
              setIsAiMinimized(false);
            }}
            className="group relative flex items-center gap-2.5 bg-gradient-to-r from-[#062134] to-[#0c3952] hover:from-[#092e47] hover:to-[#12496b] text-white font-extrabold text-xs py-2.5 px-4 rounded-full shadow-2xl border-2 border-cyan-400/80 hover:border-cyan-300 transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
            title="Open DocScrutiny AI Floating Console"
          >
            {/* Animated Radar Pulse Ring */}
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-cyan-500 border-2 border-white"></span>
            </span>

            <Bot className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
            <div className="text-left">
              <p className="text-xs font-black text-cyan-300 flex items-center gap-1">
                DocScrutiny AI
              </p>
              <p className="text-[10px] text-gray-300 font-medium hidden sm:block">
                {ocrResult ? `Auditing ${ocrResult.filename}` : 'Document Scrutiny Window'}
              </p>
            </div>
            <span className="bg-cyan-500/30 text-cyan-200 text-[9px] font-bold px-2 py-0.5 rounded-full border border-cyan-400/40 ml-1">
              Active
            </span>
          </button>
        )}

        {/* Expanded Floating DocScrutiny AI Modal / Window */}
        {isFloatingAiOpen && !isAiMinimized && (
          <div className="w-[94vw] sm:w-[560px] md:w-[620px] h-[600px] max-h-[82vh] flex flex-col rounded-2xl shadow-2xl border-2 border-cyan-500/60 bg-white dark:bg-[#0c1e33] text-slate-900 dark:text-slate-100 overflow-hidden backdrop-blur-2xl animate-in fade-in slide-in-from-bottom-5 duration-300 ring-4 ring-black/10">
            {/* Top Window Header Bar */}
            <div className="bg-gradient-to-r from-[#062134] via-[#092b45] to-[#0d3b5c] text-white p-3.5 px-4 flex items-center justify-between gap-2 border-b border-cyan-500/30 shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-cyan-300" />
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-black text-sm text-cyan-300 tracking-tight truncate">
                      DocScrutiny AI
                    </h4>
                    <span className="bg-cyan-500/20 text-cyan-200 border border-cyan-400/40 text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0">
                      S3 Assistant
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-300 truncate">
                    {ocrResult ? `Active File: ${ocrResult.filename}` : 'Waiting for document intake'}
                  </p>
                </div>
              </div>

              {/* Master Switcher & Window Action Controls */}
              <div className="flex items-center gap-1.5 shrink-0">
                {user?.isMaster && (
                  <div className="flex items-center gap-1 bg-white/10 p-0.5 rounded-lg text-[10px]">
                    <button
                      type="button"
                      onClick={() => switchMasterRole('seller')}
                      className={`px-2 py-0.5 rounded font-bold transition cursor-pointer flex items-center gap-1 ${!isOfficer ? 'bg-cyan-500 text-slate-950 shadow-xs' : 'text-gray-300 hover:text-white'}`}
                      title="Seller Mode"
                    >
                      <Building2 className="w-3 h-3" />
                      <span>Seller</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => switchMasterRole('officer')}
                      className={`px-2 py-0.5 rounded font-bold transition cursor-pointer flex items-center gap-1 ${isOfficer ? 'bg-purple-500 text-white shadow-xs' : 'text-gray-300 hover:text-white'}`}
                      title="Legal Officer Mode"
                    >
                      <Scale className="w-3 h-3" />
                      <span>Officer</span>
                    </button>
                  </div>
                )}

                {/* Minimize Window */}
                <button
                  type="button"
                  onClick={() => setIsAiMinimized(true)}
                  className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white flex items-center justify-center text-xs font-bold transition cursor-pointer"
                  title="Minimize AI Console"
                >
                  —
                </button>

                {/* Close Window */}
                <button
                  type="button"
                  onClick={() => setIsFloatingAiOpen(false)}
                  className="w-7 h-7 rounded-lg bg-red-500/20 hover:bg-red-500/40 text-red-200 hover:text-white flex items-center justify-center text-xs font-bold transition cursor-pointer"
                  title="Close AI Console"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Quick Diagnostics Chips Bar (Sticky Top Inside Window) */}
            <div className="bg-slate-100 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 p-2.5 shrink-0 space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-600 dark:text-gray-400 uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <span>Quick Legal Diagnostics:</span>
                  {!ocrResult && (
                    <span className="bg-sky-500/20 text-sky-700 dark:text-sky-300 font-semibold text-[9px] px-1.5 py-0.5 rounded border border-sky-400/30 normal-case">
                      General Rules → GeMMy AI
                    </span>
                  )}
                </span>
                <span className="text-cyan-600 dark:text-cyan-400 font-normal lowercase">click to ask</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {ocrResult ? (
                  <>
                    <button
                      type="button"
                      onClick={() => handleAskDocAI(`Verify all statutory details and tender eligibility for ${ocrResult.filename || 'this uploaded document'}`)}
                      className="bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-900 dark:text-cyan-200 text-[11px] px-2.5 py-1 rounded-lg transition font-bold cursor-pointer flex items-center gap-1"
                    >
                      <Landmark className="w-3 h-3 text-cyan-700 dark:text-cyan-300" />
                      <span>Verify all statutory details</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAskDocAI(`Verify EPFO and ESIC statutory labor compliance in ${ocrResult.filename || 'this document'}`)}
                      className="bg-white dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-gray-200 text-[11px] px-2.5 py-1 rounded-lg transition font-medium cursor-pointer flex items-center gap-1"
                    >
                      <HardHat className="w-3 h-3 text-slate-600 dark:text-gray-300" />
                      <span>Check EPFO & ESIC</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAskDocAI(`Audit Make in India (MII) local content and OEM authorization in ${ocrResult.filename || 'this document'}`)}
                      className="bg-white dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-gray-200 text-[11px] px-2.5 py-1 rounded-lg transition font-medium cursor-pointer flex items-center gap-1"
                    >
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      <span>Audit MII & OEM</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAskDocAI(`When does ${ocrResult.filename || 'this certificate'} expire and how many days are left?`)}
                      className="bg-white dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-gray-200 text-[11px] px-2.5 py-1 rounded-lg transition font-medium cursor-pointer flex items-center gap-1"
                    >
                      <Clock className="w-3 h-3 text-amber-600" />
                      <span>Expiry timeline</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAskDocAI("Compare my bid with Zenith Global Tech on public technical criteria")}
                      className="bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-[11px] px-2.5 py-1 rounded-lg transition font-bold cursor-pointer flex items-center gap-1"
                    >
                      <Scale className="w-3 h-3 text-amber-700" />
                      <span>Compare with Zenith</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => handleAskDocAI("What statutory documents and certificates are mandatory for GeM tender eligibility?")}
                      className="bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-900 dark:text-cyan-200 text-[11px] px-2.5 py-1 rounded-lg transition font-bold cursor-pointer flex items-center gap-1"
                    >
                      <Landmark className="w-3 h-3 text-cyan-700 dark:text-cyan-300" />
                      <span>Required Documents</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAskDocAI("What are the EPFO and ESIC compliance thresholds for public procurement bids?")}
                      className="bg-white dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-gray-200 text-[11px] px-2.5 py-1 rounded-lg transition font-medium cursor-pointer flex items-center gap-1"
                    >
                      <HardHat className="w-3 h-3 text-slate-600 dark:text-gray-300" />
                      <span>EPFO & ESIC Thresholds</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAskDocAI("What are Class-I and Class-II Make in India (MII) local content requirements under DPIIT?")}
                      className="bg-white dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-gray-200 text-[11px] px-2.5 py-1 rounded-lg transition font-medium cursor-pointer flex items-center gap-1"
                    >
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      <span>MII Local Content Rules</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAskDocAI("What are the validity and renewal rules for GST, PAN, and MSME on GeM?")}
                      className="bg-white dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-gray-200 text-[11px] px-2.5 py-1 rounded-lg transition font-medium cursor-pointer flex items-center gap-1"
                    >
                      <Clock className="w-3 h-3 text-amber-600" />
                      <span>Validity & Expiry Rules</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAskDocAI("Compare my bid with Zenith Global Tech on public technical criteria")}
                      className="bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-[11px] px-2.5 py-1 rounded-lg transition font-bold cursor-pointer flex items-center gap-1"
                    >
                      <Scale className="w-3 h-3 text-amber-700" />
                      <span>Compare with Zenith</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Conversation & Results Thread (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/70 dark:bg-slate-950/60">
              {docAiHistory.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-2xl shadow-xs ${
                    item.role === 'user'
                      ? 'bg-cyan-50 dark:bg-cyan-950/70 border border-cyan-200 dark:border-cyan-500/40 text-cyan-950 dark:text-cyan-100 ml-8'
                      : 'bg-white dark:bg-[#0f243a] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 mr-2 space-y-2'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-gray-400 font-bold mb-1 border-b pb-1 border-slate-100 dark:border-slate-800">
                    <span className="flex items-center gap-1.5">
                      {item.role === 'user' ? (
                        <User className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                      ) : (
                        <Bot className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                      )}
                      <span>{item.role === 'user' ? 'Your Question' : 'DocScrutiny AI Legal Scrutiny'}</span>
                    </span>
                    {item.response?.tenant_verified && (
                      <span className="text-emerald-700 dark:text-emerald-400 font-mono text-[9px] bg-emerald-50 dark:bg-emerald-950/50 px-1.5 py-0.2 rounded border border-emerald-300 dark:border-emerald-600/40">
                        Verified DPDP Tenant Scope
                      </span>
                    )}
                  </div>

                  {/* DPDP Redaction Notice Banner */}
                  {item.response?.redacted_fields && item.response.redacted_fields.length > 0 && (
                    <div className="p-2 bg-red-50 dark:bg-red-950/80 border border-red-200 dark:border-red-500/50 rounded-lg text-red-900 dark:text-red-200 text-[11px] flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-red-600 shrink-0" />
                      <div>
                        <span className="font-bold block">DPDP Act 2023 Redaction Applied</span>
                        <span>Sensitive competitor fields protected: {item.response.redacted_fields.join(', ')}</span>
                      </div>
                    </div>
                  )}

                  {/* Render High-Legibility Markdown Content */}
                  {item.role === 'user' ? (
                    <p className="text-xs sm:text-[13px] font-semibold text-cyan-950 dark:text-cyan-100 whitespace-pre-wrap leading-relaxed">
                      {item.text}
                    </p>
                  ) : (
                    <>
                      <FormattedAiMessage content={item.text} />

                      {/* Direct to GeMMy AI Card for General Rules / Non-Doc Questions */}
                      {item.response?.redirect_to_gemmy && (
                        <div className="mt-3 p-3 bg-gradient-to-r from-sky-50 via-blue-50 to-indigo-50 dark:from-sky-950/70 dark:via-blue-950/70 dark:to-indigo-950/70 border-2 border-sky-400 dark:border-sky-500/60 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 shadow-sm animate-in fade-in duration-300">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <Bot className="w-6 h-6 text-sky-600 dark:text-sky-400 shrink-0" />
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-extrabold text-xs text-sky-950 dark:text-cyan-200">
                                  Ask GeMMy AI
                                </span>
                                <span className="bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 text-[9px] font-bold px-1.5 py-0.5 rounded">
                                  Official Rules Advisor
                                </span>
                              </div>
                              <p className="text-[11px] text-sky-900/80 dark:text-slate-300 mt-0.5 leading-snug">
                                General procurement rules don't require an uploaded document. Send this inquiry to GeMMy AI for interactive policy guidance.
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleSendToGeMMy(item.response?.gemmy_query || item.text)}
                            className="w-full sm:w-auto bg-gradient-to-r from-[#008cd3] to-[#0070a8] hover:from-[#007bbd] hover:to-[#005f8f] text-white font-extrabold text-xs px-3.5 py-2 rounded-xl shadow-md hover:shadow-cyan-500/40 transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0 transform active:scale-95"
                            title="Open GeMMy AI and automatically ask this question"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Send to GeMMy AI</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </>
                  )}

                  {/* Follow-up action buttons if present */}
                  {item.response?.suggested_actions && item.response.suggested_actions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                      {item.response.suggested_actions.map((act, actIdx) => {
                        const isGeMMyAction = act.action === 'send_to_gemmy';
                        return (
                          <button
                            key={actIdx}
                            type="button"
                            onClick={() => {
                              if (isGeMMyAction) {
                                handleSendToGeMMy(act.query || act.label);
                              } else {
                                handleAskDocAI(act.label);
                              }
                            }}
                            className={`text-[10px] px-2.5 py-1 rounded-lg cursor-pointer transition font-bold flex items-center gap-1 ${
                              isGeMMyAction
                                ? 'bg-sky-500/15 hover:bg-sky-500/25 border border-sky-400/50 text-sky-900 dark:text-sky-200'
                                : 'bg-cyan-50 dark:bg-cyan-500/20 hover:bg-cyan-100 dark:hover:bg-cyan-500/30 text-cyan-800 dark:text-cyan-200 border border-cyan-200 dark:border-cyan-400/30'
                            }`}
                          >
                            {isGeMMyAction ? <Bot className="w-3 h-3 inline" /> : '↳'} {act.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}

              {docAiLoading && (
                <div className="p-4 rounded-2xl bg-white dark:bg-[#0f243a] border border-cyan-400/40 shadow-sm flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-xs font-bold text-cyan-900 dark:text-cyan-200">
                    DocScrutiny AI is evaluating statutory rules and cross-referencing sovereign portals...
                  </span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Bar (Sticky Bottom) */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAskDocAI(docAiQuestion);
              }}
              className="p-3 bg-white dark:bg-[#091a2c] border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 shrink-0"
            >
              <input
                type="text"
                value={docAiQuestion}
                onChange={(e) => setDocAiQuestion(e.target.value)}
                placeholder={
                  ocrResult
                    ? (isOfficer
                        ? (ocrResult.filename ? `Inquire about ${ocrResult.filename}'s credentials, flags, or Rule 144...` : "Inquire about this document's credentials, flags, or GFR 2017 Rule 144...")
                        : (ocrResult.filename ? `Ask about ${ocrResult.filename}'s verified parameters, flags, or eligibility...` : "Ask about this document's verified parameters, flags, or tender eligibility..."))
                    : (isOfficer
                        ? "Upload a vendor dossier to audit, or ask about GFR 2017 Rule 144 compliance..."
                        : "Upload a document to audit, or ask general statutory compliance & GeM guidelines...")
                }
                className="flex-1 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:border-cyan-500 dark:focus:border-cyan-400 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition font-medium"
              />
              <button
                type="submit"
                disabled={docAiLoading || !docAiQuestion.trim()}
                className="bg-[#f37021] hover:bg-[#e05e10] disabled:opacity-50 text-white font-extrabold text-xs px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-md shrink-0"
              >
                {docAiLoading ? (
                  <RotateCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <>
                    <span>Ask AI</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
