import React, { useState, useEffect, useRef } from 'react';
import {
  Building2,
  Scale,
  Zap,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Check,
  Send,
  Download,
  Mail,
  X,
  Lock,
  Key,
  Search,
  ArrowUpDown,
  FileText,
  SlidersHorizontal,
  Award,
} from 'lucide-react';

import { useLanguage } from '../../context/LanguageContext';
import { DocumentIntakeOCR } from '../seller/DocumentIntakeOCR';
import { useAuth } from '../../context/AuthContext';

export interface GeMPrototypeViewProps {
  initialPage?: string;
  initialSellerTab?: string;
  onOpenChat?: () => void;
  onGoHome?: () => void;
  onNavigate?: (page: string) => void;
}

interface BidderData {
  name: string;
  regId: string;
  score: number;
  risk: 'LOW' | 'MEDIUM' | 'HIGH';
  riskColor: string;
  statutoryPassed: string;
  tenderPassed: string;
  localContent: string;
  supplierClass: string;
  udyamId: string;
  gstin: string;
  pan: string;
  itr: string;
  epfo: string;
  esic: string;
  maf: string;
  pastExp: string;
}

const BIDDER_PROFILES: Record<'ABC' | 'GLOBAL' | 'VERTEX', BidderData> = {
  ABC: {
    name: 'ABC Industries Pvt. Ltd.',
    regId: 'SELLER-GJ-8841',
    score: 94,
    risk: 'LOW',
    riskColor: 'green',
    statutoryPassed: '6 / 6',
    tenderPassed: '4 / 4',
    localContent: '58.4%',
    supplierClass: 'Class-I Local Supplier',
    udyamId: 'UDYAM-GJ-01-008291',
    gstin: '24AAACB1234F1Z5',
    pan: 'AAACB1234F',
    itr: 'FY 2021-22, 2022-23, 2023-24 Verified (ACK-91028)',
    epfo: 'Active ECR Return Lodged (GJ-EPF-10928)',
    esic: 'Contribution Paid to Date (31000982710001001)',
    maf: 'OEM-MAF-9012-ONGC (Validated Digitally)',
    pastExp: '3 Completed ONGC Valve Supply Contracts (#ONGC-2023-V-991)',
  },
  GLOBAL: {
    name: 'Global Industrial Valves Ltd.',
    regId: 'SELLER-MH-4019',
    score: 72,
    risk: 'MEDIUM',
    riskColor: 'amber',
    statutoryPassed: '5 / 6',
    tenderPassed: '3 / 4',
    localContent: '51.2%',
    supplierClass: 'Class-I Local Supplier',
    udyamId: 'UDYAM-MH-03-009182',
    gstin: '27AAACG9812E1Z8',
    pan: 'AAACG9812E',
    itr: 'FY 2022-23, 2023-24 Verified (FY 2021-22 Pending)',
    epfo: 'Active ECR Return Lodged (MH-EPF-44019)',
    esic: 'Contribution Paid (33000817290001002)',
    maf: 'OEM-MAF-7718-GLOBAL',
    pastExp: '1 Completed BHEL Flow Control Contract (#BHEL-2024-F-112)',
  },
  VERTEX: {
    name: 'Vertex Fluid Systems',
    regId: 'SELLER-DL-1102',
    score: 46,
    risk: 'HIGH',
    riskColor: 'red',
    statutoryPassed: '3 / 6',
    tenderPassed: '2 / 4',
    localContent: '34.0%',
    supplierClass: 'Non-Local Supplier (< 50% threshold)',
    udyamId: 'UDYAM-DL-02-001928',
    gstin: '07AAACV4491D1Z1',
    pan: 'AAACV4491D',
    itr: 'Income Tax Filing Discrepancy Flagged',
    epfo: 'Pending Verification (DL-EPF-9901)',
    esic: 'Statutory Default Notice on File',
    maf: 'Authorization Expired on 31-Dec-2025',
    pastExp: 'Inadequate Experience for Critical High Pressure Standards',
  },
};

export const GeMPrototypeView: React.FC<GeMPrototypeViewProps> = ({
  initialPage = 'landing-page',
  initialSellerTab = 'dashboard-view',
  onOpenChat,
  onGoHome,
  onNavigate,
}) => {
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activePage, setActivePage] = useState<string>(initialPage);
  const [activeSellerTab, setActiveSellerTab] = useState<string>(initialSellerTab);

  useEffect(() => {
    if (initialSellerTab) {
      setActiveSellerTab(initialSellerTab);
    }
  }, [initialSellerTab]);

  useEffect(() => {
    if (initialPage) {
      setActivePage(initialPage);
    }
  }, [initialPage]);
  const { user, login, logout, switchMasterRole } = useAuth();
  const [loginRole, setLoginRole] = useState<'seller' | 'officer'>('seller');
  const [loginUserId, setLoginUserId] = useState<string>('master');
  const [loginPassword, setLoginPassword] = useState<string>('master');
  const [loginLoading, setLoginLoading] = useState<boolean>(false);
  const [loginSuccessMsg, setLoginSuccessMsg] = useState<string | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Selected Bidder for Officer view (O2, O3, O4)
  const [selectedBidderKey, setSelectedBidderKey] = useState<'ABC' | 'GLOBAL' | 'VERTEX'>('ABC');
  const currentBidder = BIDDER_PROFILES[selectedBidderKey];

  // O1 Tenders Filter and Search
  const [tenderFilter, setTenderFilter] = useState<'ALL' | 'SCRUTINY' | 'DISCREPANCIES'>('ALL');
  const [tenderSearch, setTenderSearch] = useState<string>('');

  // O2 Bidder search and table sorting
  const [bidderSearch, setBidderSearch] = useState<string>('');
  const [bidderSortField, setBidderSortField] = useState<'rank' | 'score' | 'risk' | 'mii'>('rank');
  const [bidderSortAsc, setBidderSortAsc] = useState<boolean>(true);
  const [showParityMatrix, setShowParityMatrix] = useState<boolean>(true);

  // S3 Upload file state
  const [uploadedFileName, setUploadedFileName] = useState<string>('gst_certificate_24AAACB.pdf');
  const [uploadedFileSize, setUploadedFileSize] = useState<string>('2.4 MB');

  // Interactive Seller State
  const [isIssueResolved, setIsIssueResolved] = useState<boolean>(false);
  const [remedyArn, setRemedyArn] = useState<string>('AA240326009817X');
  const [isAiChecking, setIsAiChecking] = useState<boolean>(false);
  const [aiCheckCompleted, setAiCheckCompleted] = useState<boolean>(false);

  // Document modal state
  const [docModalData, setDocModalData] = useState<{
    isOpen: boolean;
    title: string;
    identifier: string;
    validity: string;
    source: string;
  }>({
    isOpen: false,
    title: '',
    identifier: '',
    validity: '',
    source: '',
  });

  // Live Gateway Ping in Doc Modal
  const [isPingingGateway, setIsPingingGateway] = useState<boolean>(false);
  const [gatewayPingResult, setGatewayPingResult] = useState<string | null>(null);

  // Officer Decision State
  const [officerNotes, setOfficerNotes] = useState<string>('');
  const [decisionReceipt, setDecisionReceipt] = useState<{
    recorded: boolean;
    action: string;
    notes: string;
    hash: string;
  }>({
    recorded: false,
    action: '',
    notes: '',
    hash: '',
  });

  // Bid Submission Modal state for Seller
  const [bidModalOpen, setBidModalOpen] = useState<boolean>(false);
  const [bidSubmitted, setBidSubmitted] = useState<boolean>(false);
  const [dscPin, setDscPin] = useState<string>('123456');

  // Traffic Light Tier selection in O4
  const [selectedRiskTier, setSelectedRiskTier] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('LOW');

  useEffect(() => {
    if (initialPage) {
      setActivePage(initialPage);
    }
  }, [initialPage]);

  useEffect(() => {
    if (initialSellerTab) {
      setActiveSellerTab(initialSellerTab);
    }
  }, [initialSellerTab]);

  const navigatePage = (pageId: string) => {
    if (pageId === 'landing-page' && onGoHome) {
      onGoHome();
      return;
    }
    setActivePage(pageId);
    if (onNavigate) onNavigate(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateSellerView = (tabId: string) => {
    setActivePage('seller-page');
    setActiveSellerTab(tabId);
    if (onNavigate) onNavigate('seller-page');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRoleChange = (role: 'seller' | 'officer') => {
    setLoginRole(role);
    setLoginError(null);
    if (loginUserId === 'master' || loginUserId.toLowerCase().includes('master')) {
      // Keep master identifier
    } else if (role === 'seller') {
      setLoginUserId('SELLER-GJ-8841');
    } else {
      setLoginUserId('GOV-OFF-9012');
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);
    try {
      const authUser = await login(loginUserId, loginPassword, loginRole);
      setLoginSuccessMsg(`Authenticated successfully as ${authUser.role === 'seller' ? 'Seller (ABC Industries)' : 'Legal Officer (Dr. Ramanathan)'}! Redirecting...`);
      setTimeout(() => {
        setLoginSuccessMsg(null);
        if (authUser.role === 'seller') {
          navigateSellerView('dashboard-view');
        } else {
          navigatePage('officer-dash-page');
        }
      }, 500);
    } catch (err: any) {
      setLoginError(err?.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleQuickLogin = async (uid: string, pwd: string, role: 'seller' | 'officer') => {
    setLoginUserId(uid);
    setLoginPassword(pwd);
    setLoginRole(role);
    setLoginLoading(true);
    setLoginError(null);
    try {
      const authUser = await login(uid, pwd, role);
      setLoginSuccessMsg(`Authenticated as ${role === 'seller' ? 'Seller (ABC Industries)' : 'Legal Officer (Dr. Ramanathan)'}! Redirecting...`);
      setTimeout(() => {
        setLoginSuccessMsg(null);
        if (authUser.role === 'seller') {
          navigateSellerView('dashboard-view');
        } else {
          navigatePage('officer-dash-page');
        }
      }, 400);
    } catch (err: any) {
      setLoginError(err?.message || 'Quick login failed');
    } finally {
      setLoginLoading(false);
    }
  };

  const openDocDetails = (title: string, identifier: string, validity: string, source: string) => {
    setDocModalData({
      isOpen: true,
      title,
      identifier,
      validity,
      source,
    });
    setGatewayPingResult(null);
    setIsPingingGateway(false);
  };

  const handlePingGateway = (sourceName: string) => {
    setIsPingingGateway(true);
    setGatewayPingResult(null);
    setTimeout(() => {
      setIsPingingGateway(false);
      setGatewayPingResult(
        `200 OK — Direct encrypted handshake with ${sourceName} successful (Latency: 38ms). Record authenticity confirmed.`
      );
    }, 700);
  };

  const handleAiCheck = () => {
    setIsAiChecking(true);
    setTimeout(() => {
      setIsAiChecking(false);
      setAiCheckCompleted(true);
    }, 1100);
  };

  const handleResolveIssue = () => {
    setIsIssueResolved(true);
  };

  const handleExecuteDecision = (action: string) => {
    const notes = officerNotes.trim() || 'Concurred with algorithmic recommendation and statutory parameters.';
    const randomHex = Array.from({ length: 16 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('').toUpperCase();
    setDecisionReceipt({
      recorded: true,
      action,
      notes,
      hash: `SHA256-${randomHex}`,
    });
  };

  const handleExportDossier = () => {
    const dossierData = {
      portal: 'Government e Marketplace (GeM)',
      tenderRef: 'GEM/2026/B/9012481',
      description: 'High Pressure Industrial Flow Control Valves',
      leadBidder: currentBidder.name,
      adjudicationScore: currentBidder.score,
      riskBand: currentBidder.risk,
      statutoryCompliance: currentBidder.statutoryPassed,
      miiLocalContent: currentBidder.localContent,
      officerDecision: decisionReceipt.recorded ? decisionReceipt.action : 'Pending Formal Sign-Off',
      officerRemarks: decisionReceipt.notes || 'Preliminary algorithmic audit completed.',
      immutableLedgerHash: decisionReceipt.hash || 'SHA256-8F4A29D81B45C6A0',
      timestamp: new Date().toISOString(),
      evaluator: 'Er. Rajesh Varma, Executive Engineer (Procurement), ONGC',
      auditLedger: [
        { time: '10:42 AM', check: 'Upload Scan', source: 'GeM Gateway', result: 'Clean', evidence: 'SHA-256: 8f4a29...' },
        { time: '10:43 AM', check: 'OCR Extraction', source: 'Vision Engine', result: '99.4% Clarity', evidence: 'Token-Map #901' },
        { time: '10:43 AM', check: 'GST Status', source: 'GSTN API', result: 'Active', evidence: 'Receipt #88192' },
        { time: '10:44 AM', check: 'PAN Verification', source: 'CBDT / NSDL', result: 'Matched', evidence: 'CBDT-TX #40192' },
        { time: '10:45 AM', check: 'Cross-Verification', source: 'ProcureAI Core', result: '11/12 Parity', evidence: 'Matrix #9012481' },
        { time: '10:45 AM', check: 'Discrepancy Flag', source: 'NLP Matcher', result: 'Name Var (Resolved)', evidence: 'Flag #DISC-1' },
        { time: '11:02 AM', check: 'Officer Review', source: 'Evaluation Desk', result: 'Accepted', evidence: 'Review #OFF-092' },
        { time: '11:05 AM', check: 'Final Adjudication', source: 'DSC Token Gate', result: 'Qualified', evidence: 'DSC-Sign #2026' },
      ],
    };

    const blob = new Blob([JSON.stringify(dossierData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `GeM_Audit_Dossier_GEM-2026-B-9012481_${selectedBidderKey}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadSignedDecision = () => {
    const certText = `=====================================================
GOVERNMENT OF INDIA - GOVERNMENT e MARKETPLACE (GeM)
OFFICIAL STATUTORY PROCUREMENT ADJUDICATION CERTIFICATE
=====================================================
Tender Reference : GEM/2026/B/9012481
Procuring Entity : Oil and Natural Gas Corporation (ONGC)
Contract Item    : High Pressure Industrial Flow Control Valves
Evaluated Bidder : ${currentBidder.name} (${currentBidder.regId})
Compliance Score : ${currentBidder.score} / 100 (Statutory Parity: ${currentBidder.statutoryPassed})
Risk Level       : ${currentBidder.risk} RISK (Traffic Light Tier: ${currentBidder.riskColor.toUpperCase()})
MII Local Content: ${currentBidder.localContent} (${currentBidder.supplierClass})

OFFICER DECISION RECORD:
Action Taken     : ${decisionReceipt.action || 'Approved / Qualified'}
Official Remarks : ${decisionReceipt.notes || 'Concurred with algorithmic recommendation.'}
Evaluator        : Er. Rajesh Varma, Executive Engineer (Procurement & Contracts), ONGC
Cryptographic Sig: ${decisionReceipt.hash}
Date & Time      : ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
Verification Ref : SIH26100 Statutory Compliance Gateway
=====================================================`;

    const blob = new Blob([certText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `GeM_Decision_Certificate_${selectedBidderKey}_9012481.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleConfirmBidSubmission = () => {
    setBidSubmitted(true);
    const receiptText = `=====================================================
GOVERNMENT e MARKETPLACE (GeM) - BID SUBMISSION RECEIPT
=====================================================
Bid ID           : BID-2026-9012481-ABC
Tender No        : GEM/2026/B/9012481
Seller Name      : ABC Industries Pvt. Ltd. (SELLER-GJ-8841)
GSTIN            : 24AAACB1234F1Z5
GSTR-3B ARN      : ${remedyArn}
Compliance Check : 98% READY (0 Detected Inconsistencies)
Digital Token ID : DSC-CLASS3-USB-TOKEN-9021 (Verified)
Signed At        : ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
Submission Status: SUCCESSFUL - LODGED IN TENDER BOX
=====================================================`;
    const blob = new Blob([receiptText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'GeM_Bid_Submission_Receipt_9012481.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      setUploadedFileName(f.name);
      setUploadedFileSize(`${(f.size / (1024 * 1024)).toFixed(1)} MB`);
      setAiCheckCompleted(false);
    }
  };

  // Reusable Officer Header with integrated O1-O5 Tabs & Controls
  const renderOfficerHeader = (currentSubPage: string) => (
    <div className="bg-[#162c5b] text-white shadow-md border-b-2 border-yellow-400">
      <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 via-white to-green-600"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigatePage('landing-page')}>
          <span className="text-2xl font-black tracking-tight text-white">GeM</span>
          <div className="border-l border-blue-400/50 pl-2 leading-tight">
            <span className="font-extrabold text-sm text-yellow-300 block">
              {t('officerConsole')}
            </span>
            <span className="text-[10px] text-gray-300">ONGC Technical Scrutiny Wing (SIH26100)</span>
          </div>
        </div>

        {/* Global Officer Actions */}
        <div className="flex items-center space-x-2">
          {user?.isMaster && (
            <button
              onClick={() => {
                switchMasterRole('seller');
                navigateSellerView('dashboard-view');
              }}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-2.5 py-1 rounded shadow-xs cursor-pointer flex items-center gap-1.5 transition text-xs"
              title="Master ID: Switch to Seller Console on the fly"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Switch to Seller Console</span>
            </button>
          )}
          <span className="hidden sm:inline text-xs text-yellow-300 font-mono bg-blue-900/80 px-2 py-1 rounded border border-blue-400/40">
            {user?.isMaster ? '★ ' : ''}{user?.userId || 'GOV-OFF-9012'}
          </span>
          <button
            onClick={() => navigatePage('landing-page')}
            className="bg-white/10 hover:bg-white/20 text-white font-semibold px-2.5 py-1 rounded text-xs border border-white/20 transition cursor-pointer flex items-center gap-1"
          >
            <span>←</span>
            <span>{t('gemHome')}</span>
          </button>
          <button
            onClick={() => {
              logout();
              navigatePage('login-page');
            }}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-2.5 py-1 rounded text-xs transition cursor-pointer"
          >
            {t('logout')}
          </button>
        </div>
      </div>

      {/* Integrated O1-O5 Stage Tabs Bar */}
      <div className="bg-[#0f1f42] px-4 sm:px-6 border-t border-blue-900/80">
        <div className="max-w-7xl mx-auto flex items-center space-x-2 overflow-x-auto py-1 text-xs font-bold">
          <button
            onClick={() => navigatePage('officer-dash-page')}
            className={`py-1.5 px-3 rounded whitespace-nowrap cursor-pointer transition-all duration-200 active:scale-95 ${
              currentSubPage === 'officer-dash-page'
                ? 'bg-yellow-400 text-blue-950 shadow-xs'
                : 'text-gray-300 hover:text-white hover:bg-white/5'
            }`}
          >
            O1. {t('activeTenders')}
          </button>
          <button
            onClick={() => navigatePage('officer-compare-page')}
            className={`py-1.5 px-3 rounded whitespace-nowrap cursor-pointer transition-all duration-200 active:scale-95 ${
              currentSubPage === 'officer-compare-page'
                ? 'bg-yellow-400 text-blue-950 shadow-xs'
                : 'text-gray-300 hover:text-white hover:bg-white/5'
            }`}
          >
            O2. {t('compareBidders')}
          </button>
          <button
            onClick={() => navigatePage('officer-page')}
            className={`py-1.5 px-3 rounded whitespace-nowrap cursor-pointer transition-all duration-200 active:scale-95 ${
              currentSubPage === 'officer-page'
                ? 'bg-yellow-400 text-blue-950 shadow-xs'
                : 'text-gray-300 hover:text-white hover:bg-white/5'
            }`}
          >
            O3. {t('deepAudit')} ({selectedBidderKey})
          </button>
          <button
            onClick={() => navigatePage('risk-page')}
            className={`py-1.5 px-3 rounded whitespace-nowrap cursor-pointer transition-all duration-200 active:scale-95 ${
              currentSubPage === 'risk-page'
                ? 'bg-yellow-400 text-blue-950 shadow-xs'
                : 'text-gray-300 hover:text-white hover:bg-white/5'
            }`}
          >
            O4. {t('findingsRisk')}
          </button>
          <button
            onClick={() => navigatePage('audit-page')}
            className={`py-1.5 px-3 rounded whitespace-nowrap cursor-pointer transition-all duration-200 active:scale-95 ${
              currentSubPage === 'audit-page'
                ? 'bg-yellow-400 text-blue-950 shadow-xs'
                : 'text-gray-300 hover:text-white hover:bg-white/5'
            }`}
          >
            O5. {t('auditSignOff')}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-[#f4f6f9] font-sans antialiased text-gray-800 min-h-screen flex flex-col">
      {/* Hidden file input for document upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".pdf,.png,.jpg,.jpeg"
      />

      {/* ========================================================
           PAGE 2: GEM AUTHENTICATION / LOGIN VIEW
           ======================================================== */}
      {activePage === 'login-page' && (
        <div id="login-page" className="flex-1 flex flex-col page-enter">
          <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 via-white to-green-600"></div>
          <div className="bg-white border-b border-gray-200 py-3 px-6 shadow-xs flex justify-between items-center">
            <div
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => navigatePage('landing-page')}
            >
              <span className="text-2xl font-black text-[#162c5b]">GeM</span>
              <div className="border-l border-gray-300 pl-2 text-xs leading-tight text-gray-600">
                <span className="font-bold block">Government e Marketplace</span>
                <span>Single Sign-On Authentication</span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigatePage('landing-page')}
                className="text-xs font-bold text-blue-700 hover:underline cursor-pointer flex items-center gap-1"
              >
                <span>← {t('home')}</span>
              </button>
            </div>
          </div>

          <main className="flex-1 flex items-center justify-center p-4 bg-slate-100/60">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
              
              {/* Master Access Privilege Banner */}
              <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-purple-600 p-3.5 text-white text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-amber-200" />
                    <div>
                      <span className="font-black tracking-wide uppercase text-[11px] block">Unified Master ID Enabled</span>
                      <span className="text-[10px] text-amber-100">Single Master ID to test both Seller and Officer views & DocAI scrutiny</span>
                    </div>
                  </div>
                  <span className="bg-white/20 border border-white/30 text-white font-mono text-[10px] px-2.5 py-0.5 rounded-full font-bold">
                    ID: master
                  </span>
                </div>
              </div>

              {/* Role Selection Tabs */}
              <div className="grid grid-cols-2 text-center text-xs font-bold border-b border-gray-200 bg-gray-50">
                <button
                  type="button"
                  onClick={() => handleRoleChange('seller')}
                  className={`py-3.5 transition cursor-pointer flex items-center justify-center gap-2 ${
                    loginRole === 'seller'
                      ? 'border-b-2 border-orange-500 text-orange-600 bg-white font-black'
                      : 'text-gray-500 hover:text-[#162c5b]'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>{t('sellerDesk')} (Seller Mode)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleChange('officer')}
                  className={`py-3.5 transition cursor-pointer flex items-center justify-center gap-2 ${
                    loginRole === 'officer'
                      ? 'border-b-2 border-purple-600 text-purple-700 bg-white font-black'
                      : 'text-gray-500 hover:text-[#162c5b]'
                  }`}
                >
                  <Scale className="w-4 h-4" />
                  <span>{t('officerPortal')} (Legal Officer Mode)</span>
                </button>
              </div>

              <div className="p-6 space-y-4">
                {/* One-Click Quick Login Section */}
                <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                    <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-blue-600" /> Quick One-Click Sign In:</span>
                    <span className="text-blue-600 font-normal lowercase">click to test</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleQuickLogin('master', 'master', 'seller')}
                      className="text-left p-2.5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 transition text-[11px] cursor-pointer flex items-center gap-2"
                    >
                      <ShieldCheck className="w-4 h-4 text-amber-700" />
                      <div>
                        <span className="font-bold text-amber-900 block">Master ID as Seller</span>
                        <span className="text-[10px] text-amber-700">ABC Industries (SELLER-GJ-8841)</span>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickLogin('master', 'master', 'officer')}
                      className="text-left p-2.5 rounded-xl border border-purple-300 bg-purple-50 hover:bg-purple-100 transition text-[11px] cursor-pointer flex items-center gap-2"
                    >
                      <Scale className="w-4 h-4 text-purple-700" />
                      <div>
                        <span className="font-bold text-purple-950 block">Master ID as Officer</span>
                        <span className="text-[10px] text-purple-700">Legal Officer (GOV-OFF-9012)</span>
                      </div>
                    </button>
                  </div>
                </div>

                <div className="flex items-center my-2">
                  <div className="flex-1 border-t border-gray-200"></div>
                  <span className="px-3 text-[10px] text-gray-400 font-bold uppercase">or login with credentials</span>
                  <div className="flex-1 border-t border-gray-200"></div>
                </div>

                {loginSuccessMsg && (
                  <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="font-medium">{loginSuccessMsg}</span>
                  </div>
                )}

                {loginError && (
                  <div className="p-3 bg-red-50 border border-red-300 text-red-800 rounded-xl text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <span className="font-medium">{loginError}</span>
                  </div>
                )}

                <form onSubmit={handleLoginSubmit} className="space-y-3.5 text-xs">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-semibold text-gray-700">
                        User ID / Registration No. / Master ID *
                      </label>
                      <span className="text-[10px] text-gray-400">Master: <code>master</code></span>
                    </div>
                    <input
                      type="text"
                      value={loginUserId}
                      onChange={(e) => setLoginUserId(e.target.value)}
                      required
                      placeholder="e.g. master or SELLER-GJ-8841 or GOV-OFF-9012"
                      className="w-full p-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Password *</label>
                    <input
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                      className="w-full p-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Captcha *</label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        defaultValue="87B4X"
                        required
                        className="flex-1 p-2.5 border border-gray-300 rounded-xl"
                      />
                      <div className="bg-gray-100 border border-gray-300 text-[#162c5b] font-mono font-bold tracking-widest px-4 py-2.5 rounded-xl select-none line-through flex items-center">
                        87B4X
                      </div>
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={loginLoading}
                    className={`w-full text-white py-3 rounded-xl font-bold transition shadow cursor-pointer flex items-center justify-center gap-2 ${
                      loginRole === 'seller' ? 'bg-[#f37021] hover:bg-[#e05e10]' : 'bg-purple-700 hover:bg-purple-800'
                    }`}
                  >
                    {loginLoading ? (
                      <span>Authenticating...</span>
                    ) : (
                      <>
                        <span>Sign In as {loginRole === 'seller' ? 'Seller (ABC Industries)' : 'Legal Officer (Dr. Ramanathan)'}</span>
                        <span>&gt;</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </main>
        </div>
      )}

      {/* ========================================================
           PAGE 3: SELLER COMPLIANCE PORTAL (S1, S2, S3, S4)
           ======================================================== */}
      {activePage === 'seller-page' && (
        <div id="seller-page" className="flex-1 flex flex-col page-enter">
          <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 via-white to-green-600"></div>
          <div className="bg-white border-b border-gray-200 shadow-xs">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-14">
                <div
                  className="flex items-center space-x-3 cursor-pointer"
                  onClick={() => navigatePage('landing-page')}
                >
                  <span className="text-2xl font-black text-[#162c5b]">GeM</span>
                  <div className="border-l border-gray-300 pl-2 text-xs leading-tight text-gray-600">
                    <span className="font-bold text-gray-800 block">Government e Marketplace</span>
                    <span>{t('sellerPortal')}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-3 text-xs">
                  {user?.isMaster && (
                    <button
                      onClick={() => {
                        switchMasterRole('officer');
                        navigatePage('officer-dash-page');
                      }}
                      className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-2.5 py-1 rounded shadow-xs cursor-pointer flex items-center gap-1.5 transition text-xs"
                      title="Master ID: Switch to Legal Officer Portal on the fly"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Switch to Legal Officer Portal</span>
                    </button>
                  )}
                  <span className="hidden sm:inline font-bold text-gray-700 font-mono bg-gray-100 px-2 py-1 rounded border border-gray-300">
                    {user?.isMaster ? '★ ' : ''}{user?.organization || 'ABC Industries Pvt. Ltd.'} ({user?.userId || 'SELLER-GJ-8841'})
                  </span>
                  <button
                    onClick={() => navigatePage('landing-page')}
                    className="border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold px-2.5 py-1 rounded cursor-pointer"
                  >
                    ← {t('gemHome')}
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      navigatePage('login-page');
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white px-2.5 py-1 rounded cursor-pointer font-semibold"
                  >
                    {t('logout')}
                  </button>
                </div>
              </div>
              {/* 4 Seller Tabs S1-S4 */}
              <nav className="flex space-x-2 text-xs font-semibold overflow-x-auto border-t border-gray-100 py-1">
                <button
                  onClick={() => setActiveSellerTab('dashboard-view')}
                  className={`py-2 px-3 border-b-2 whitespace-nowrap cursor-pointer transition-all duration-200 active:scale-95 ${
                    activeSellerTab === 'dashboard-view'
                      ? 'border-orange-500 text-orange-600 font-bold'
                      : 'border-transparent text-gray-500 hover:text-[#162c5b]'
                  }`}
                >
                  S1. {t('readiness')} {t('dashboard')}
                </button>
                <button
                  onClick={() => setActiveSellerTab('checklist-view')}
                  className={`py-2 px-3 border-b-2 whitespace-nowrap cursor-pointer transition-all duration-200 active:scale-95 ${
                    activeSellerTab === 'checklist-view'
                      ? 'border-orange-500 text-orange-600 font-bold'
                      : 'border-transparent text-gray-500 hover:text-[#162c5b]'
                  }`}
                >
                  S2. Tender Compliance Checklist
                </button>
                <button
                  onClick={() => setActiveSellerTab('upload-view')}
                  className={`py-2 px-3 border-b-2 whitespace-nowrap cursor-pointer transition-all duration-200 active:scale-95 ${
                    activeSellerTab === 'upload-view'
                      ? 'border-orange-500 text-orange-600 font-bold'
                      : 'border-transparent text-gray-500 hover:text-[#162c5b]'
                  }`}
                >
                  S3. DocScrutiny AI & OCR
                </button>
                <button
                  onClick={() => setActiveSellerTab('issues-view')}
                  className={`py-2 px-3 border-b-2 whitespace-nowrap cursor-pointer transition-all duration-200 active:scale-95 relative ${
                    activeSellerTab === 'issues-view'
                      ? 'border-orange-500 text-orange-600 font-bold'
                      : 'border-transparent text-gray-500 hover:text-[#162c5b]'
                  }`}
                >
                  S4. {t('updateInfo')} / Bid Readiness
                  <span
                    className={`text-white text-[9px] px-1.5 py-0.2 rounded-full ml-1 ${
                      isIssueResolved ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  >
                    {isIssueResolved ? '0' : '1'}
                  </span>
                </button>
              </nav>
            </div>
          </div>

          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full">
            <div key={activeSellerTab} className="tab-content-enter space-y-6">
            {/* S1. SELLER COMPLIANCE DASHBOARD */}
            {activeSellerTab === 'dashboard-view' && (
              <section id="dashboard-view" className="space-y-6">
                <div className="flex justify-between items-center border-b pb-3">
                  <div>
                    <h1 className="text-xl font-black text-[#162c5b]">
                      S1. {t('readiness')} {t('dashboard')}
                    </h1>
                    <p className="text-xs text-gray-500">
                      Overall readiness and active statutory status prior to tender submission.
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold text-blue-900 bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
                    Tender: GEM/2026/B/9012481
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div
                    onClick={() => setActiveSellerTab('checklist-view')}
                    className="bg-white p-5 rounded-lg border border-gray-200 shadow-xs flex items-center justify-between cursor-pointer hover:border-blue-400 transition"
                  >
                    <div>
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                        {t('readiness')}
                      </span>
                      <p className="text-3xl font-black text-[#162c5b] mt-1">
                        {isIssueResolved ? '98%' : '87%'}
                      </p>
                      {isIssueResolved ? (
                        <span className="text-xs text-green-600 font-bold">
                          <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5" /> {t('ready')}</span>
                        </span>
                      ) : (
                        <span className="text-xs text-amber-600 font-semibold">
                          <span className="flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" /> {t('attentionReq')}</span>
                        </span>
                      )}
                    </div>
                    <div
                      className={`w-14 h-14 rounded-full flex items-center justify-center font-black text-xs border-4 ${
                        isIssueResolved
                          ? 'bg-green-50 border-green-600 text-green-800'
                          : 'bg-blue-50 border-blue-600 text-blue-800'
                      }`}
                    >
                      {isIssueResolved ? '98%' : '87%'}
                    </div>
                  </div>

                  <div
                    onClick={() => setActiveSellerTab('checklist-view')}
                    className="bg-white p-5 rounded-lg border border-gray-200 shadow-xs flex items-center justify-between cursor-pointer hover:border-green-400 transition"
                  >
                    <div>
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>{t('verified')}</span>
                      </span>
                      <p className="text-2xl font-black text-green-600 mt-1">
                        {isIssueResolved ? '13' : '12'}
                      </p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center font-bold">
                      <Check className="w-5 h-5" />
                    </div>
                  </div>

                  <div
                    onClick={() => setActiveSellerTab('upload-view')}
                    className="bg-white p-5 rounded-lg border border-gray-200 shadow-xs flex items-center justify-between cursor-pointer hover:border-amber-400 transition"
                  >
                    <div>
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500 inline-block"></span>{t('pending')}</span>
                      </span>
                      <p className="text-2xl font-black text-amber-500 mt-1">
                        {isIssueResolved ? '1' : '2'}
                      </p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                      <Clock className="w-5 h-5" />
                    </div>
                  </div>

                  <div
                    className="bg-white p-5 rounded-lg border border-gray-200 shadow-xs flex items-center justify-between cursor-pointer hover:border-red-300 transition"
                    onClick={() => setActiveSellerTab('issues-view')}
                  >
                    <div>
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500 inline-block"></span>{t('issues')}</span>
                      </span>
                      <p className="text-2xl font-black text-red-600 mt-1">
                        {isIssueResolved ? '0' : '1'}
                      </p>
                    </div>
                    <div
                      className={`h-10 w-10 rounded-full flex items-center justify-center text-lg font-bold ${
                        isIssueResolved
                          ? 'bg-green-50 text-green-600'
                          : 'bg-red-50 text-red-600 animate-pulse'
                      }`}
                    >
                      {isIssueResolved ? <Check className="w-5 h-5 text-green-600" /> : <AlertTriangle className="w-5 h-5 text-red-600" />}
                    </div>
                  </div>
                </div>

                {/* Portal Verification Status */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-xs p-5 space-y-3">
                  <h2 className="text-xs font-black uppercase text-gray-700 tracking-wider">
                    {t('portalStatus')}
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-xs">
                    <div
                      onClick={() => openDocDetails('GSTN Live Gateway Verification', '24AAACB1234F1Z5', 'Active Regular Taxpayer', 'GSTN API Gateway')}
                      className="p-3 bg-gray-50 border rounded text-center cursor-pointer hover:border-green-400 transition"
                    >
                      <p className="text-[10px] text-gray-400 font-bold mb-1">GSTN Gateway</p>
                      <span className="font-bold text-green-700 flex items-center justify-center gap-1"><Check className="w-3.5 h-3.5" /> Live Synced</span>
                    </div>
                    <div
                      onClick={() => openDocDetails('Income Tax Portal Gateway', 'AAACB1234F', 'Pending FY2023-24 Re-auth', 'ITR e-Filing API')}
                      className="p-3 bg-gray-50 border rounded text-center cursor-pointer hover:border-amber-400 transition"
                    >
                      <p className="text-[10px] text-gray-400 font-bold mb-1">Income Tax ITR</p>
                      <span className="font-bold text-amber-600 flex items-center justify-center gap-1"><AlertTriangle className="w-3.5 h-3.5" /> Pending Re-auth</span>
                    </div>
                    <div
                      onClick={() => openDocDetails('Udyam MSME Registry', 'UDYAM-GJ-01-008291', 'Valid Lifetime (Medium Enterprise)', 'Ministry of MSME API')}
                      className="p-3 bg-gray-50 border rounded text-center cursor-pointer hover:border-green-400 transition"
                    >
                      <p className="text-[10px] text-gray-400 font-bold mb-1">Udyam MSME</p>
                      <span className="font-bold text-green-700 flex items-center justify-center gap-1"><Check className="w-3.5 h-3.5" /> Verified</span>
                    </div>
                    <div
                      onClick={() => openDocDetails('ICAI UDIN Verification Gateway', '24AAACB90182E1CA', 'CA Attestation Validated', 'ICAI Central Database')}
                      className="p-3 bg-gray-50 border rounded text-center cursor-pointer hover:border-green-400 transition"
                    >
                      <p className="text-[10px] text-gray-400 font-bold mb-1">ICAI UDIN</p>
                      <span className="font-bold text-green-700 flex items-center justify-center gap-1"><Check className="w-3.5 h-3.5" /> CA Attested</span>
                    </div>
                    <div
                      onClick={() => openDocDetails('Shram Suvidha EPFO/ESIC Gateway', 'GJ-EPF-10928-2025', 'Querying Monthly ECR File', 'Shram Suvidha Portal')}
                      className="p-3 bg-gray-50 border rounded text-center cursor-pointer hover:border-amber-400 transition"
                    >
                      <p className="text-[10px] text-gray-400 font-bold mb-1">EPFO / ESIC</p>
                      <span className="font-bold text-amber-600 flex items-center justify-center gap-1"><Clock className="w-3.5 h-3.5" /> Querying</span>
                    </div>
                    <div className="p-3 bg-gray-50 border rounded text-center">
                      <p className="text-[10px] text-gray-400 font-bold mb-1">DPIIT Startup</p>
                      <span className="font-bold text-gray-400">N/A</span>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* S2. TENDER COMPLIANCE CHECKLIST */}
            {activeSellerTab === 'checklist-view' && (
              <section id="checklist-view" className="space-y-6">
                <div className="flex justify-between items-center border-b pb-3">
                  <div>
                    <h1 className="text-xl font-black text-[#162c5b]">
                      S2. Tender Compliance Checklist
                    </h1>
                    <p className="text-xs text-gray-500">
                      Tender-specific requirements audit for Bid: GEM/2026/B/9012481
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveSellerTab('upload-view')}
                    className="bg-[#162c5b] hover:bg-blue-900 text-white text-xs font-bold px-3 py-1.5 rounded shadow cursor-pointer transition"
                  >
                    + {t('uploadMissing')}
                  </button>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 shadow-xs overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-gray-100 text-gray-600 font-bold uppercase border-b">
                      <tr>
                        <th className="p-3">Requirement</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">{t('action')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr>
                        <td className="p-3 font-bold">Udyam / MSME</td>
                        <td className="p-3 text-green-700 font-bold"><span className="flex items-center gap-1"><Check className="w-3.5 h-3.5" /> {t('verified')}</span></td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() =>
                              openDocDetails(
                                'Udyam Certificate',
                                'UDYAM-GJ-01-008291',
                                'Valid Lifetime',
                                'MSME API'
                              )
                            }
                            className="text-blue-700 font-bold hover:underline cursor-pointer"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold">GST Registration</td>
                        <td className="p-3 text-green-700 font-bold"><span className="flex items-center gap-1"><Check className="w-3.5 h-3.5" /> {t('verified')}</span></td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() =>
                              openDocDetails(
                                'GST Certificate',
                                '24AAACB1234F1Z5',
                                'Active Regular',
                                'GSTN API'
                              )
                            }
                            className="text-blue-700 font-bold hover:underline cursor-pointer"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                      <tr className={isIssueResolved ? 'bg-white' : 'bg-red-50/50'}>
                        <td className={`p-3 font-bold ${isIssueResolved ? 'text-gray-800' : 'text-red-900'}`}>
                          GST Returns (GSTR-3B)
                        </td>
                        <td className={`p-3 font-bold ${isIssueResolved ? 'text-green-700' : 'text-red-700'}`}>
                          {isIssueResolved ? <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5" /> {t('verified')}</span> : <span className="flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" /> {t('pending')}</span>}
                        </td>
                        <td className="p-3 text-right">
                          {isIssueResolved ? (
                            <button
                              onClick={() =>
                                openDocDetails(
                                  'GSTR-3B Return Filing',
                                  remedyArn,
                                  'Filed Current FY',
                                  'GSTN Portal'
                                )
                              }
                              className="text-blue-700 font-bold hover:underline cursor-pointer"
                            >
                              View
                            </button>
                          ) : (
                            <button
                              onClick={() => setActiveSellerTab('issues-view')}
                              className="bg-red-600 hover:bg-red-700 text-white px-2.5 py-1 rounded font-bold cursor-pointer"
                            >
                              Update
                            </button>
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold">PAN Card</td>
                        <td className="p-3 text-green-700 font-bold"><span className="flex items-center gap-1"><Check className="w-3.5 h-3.5" /> {t('verified')}</span></td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() =>
                              openDocDetails(
                                'PAN Card',
                                'AAACB1234F',
                                'Valid & Linked',
                                'CBDT NSDL'
                              )
                            }
                            className="text-blue-700 font-bold hover:underline cursor-pointer"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                      <tr className="bg-amber-50/40">
                        <td className="p-3 font-bold">Income Tax Returns (ITR-6)</td>
                        <td className="p-3 text-amber-700 font-bold"><span className="flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" /> {t('pending')}</span></td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => setActiveSellerTab('upload-view')}
                            className="text-blue-700 font-bold hover:underline cursor-pointer"
                          >
                            Update
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold">Make in India (MII) Undertaking</td>
                        <td className="p-3 text-green-700 font-bold"><span className="flex items-center gap-1"><Check className="w-3.5 h-3.5" /> {t('verified')}</span></td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() =>
                              openDocDetails(
                                'Make in India Declaration',
                                '58% Local Content',
                                'Class-I Local Supplier',
                                'CA Attested with UDIN'
                              )
                            }
                            className="text-blue-700 font-bold hover:underline cursor-pointer"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                      <tr className="bg-amber-50/40">
                        <td className="p-3 font-bold">EPFO / ESIC Challans</td>
                        <td className="p-3 text-amber-700 font-bold"><span className="flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" /> {t('pending')}</span></td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => setActiveSellerTab('upload-view')}
                            className="text-blue-700 font-bold hover:underline cursor-pointer"
                          >
                            Update
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold">OEM Authorization Form (MAF)</td>
                        <td className="p-3 text-green-700 font-bold"><span className="flex items-center gap-1"><Check className="w-3.5 h-3.5" /> {t('verified')}</span></td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() =>
                              openDocDetails(
                                'OEM Authorization (MAF)',
                                'OEM-MAF-9012',
                                'Valid for Bid Duration',
                                'Digital Signature Validated'
                              )
                            }
                            className="text-blue-700 font-bold hover:underline cursor-pointer"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* S3. DOCUMENT UPLOAD & LIVE DOCSCRUTINY AI CONSOLE */}
            {activeSellerTab === 'upload-view' && (
              <section id="upload-view" className="space-y-6">
                <DocumentIntakeOCR />
              </section>
            )}

            {/* S4. ISSUE RESOLUTION / BID READINESS */}
            {activeSellerTab === 'issues-view' && (
              <section id="issues-view" className="space-y-6">
                <div className="border-b pb-3">
                  <h1 className="text-xl font-black text-red-600 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <span>S4. Issue Resolution / Bid Readiness</span>
                  </h1>
                  <p className="text-xs text-gray-500">
                    Fix detected inconsistencies before bid submission to avoid automated technical rejection.
                  </p>
                </div>

                {!isIssueResolved ? (
                  <div className="bg-white rounded-lg border-2 border-red-300 p-5 space-y-4 shadow-xs">
                    <div className="p-3 bg-amber-50 border-l-4 border-amber-500 text-xs text-amber-900 space-y-1">
                      <p className="font-bold flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Latest filing information could not be verified.</p>
                      <p>
                        <strong>Reason:</strong> Data mismatch / missing GSTR-3B ARN reference
                      </p>
                      <p>
                        <strong>Action:</strong> Update information with latest GSTR-3B ARN.
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded border grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block font-bold text-gray-700 mb-1">
                          {t('enterArn')} *
                        </label>
                        <input
                          type="text"
                          value={remedyArn}
                          onChange={(e) => setRemedyArn(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded font-mono"
                        />
                      </div>
                      <div className="flex items-end">
                        <button
                          onClick={handleResolveIssue}
                          className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-2 rounded shadow cursor-pointer transition"
                        >
                          {t('updateInfo')}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-green-50 border-2 border-green-400 p-6 rounded-lg text-center space-y-3">
                    <CheckCircle2 className="w-10 h-10 text-green-600 mx-auto block" />
                    <h3 className="text-base font-bold text-green-900">{t('readiness')}: 98%</h3>
                    <p className="text-xs text-green-700">
                      All mandatory documents uploaded | Registrations verified | Zero detected inconsistencies
                    </p>
                    <div className="pt-2">
                      <button
                        onClick={() => setBidModalOpen(true)}
                        className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2.5 rounded text-xs font-bold shadow-md cursor-pointer transition"
                      >
                        <span className="flex items-center justify-center gap-1.5"><Send className="w-3.5 h-3.5" /> {t('signSubmitBid')}</span>
                      </button>
                    </div>
                  </div>
                )}
              </section>
            )}
            </div>
          </main>
        </div>
      )}

      {/* ========================================================
           PAGE 4: O1. OFFICER DASHBOARD
           ======================================================== */}
      {activePage === 'officer-dash-page' && (
        <div id="officer-dash-page" className="flex-1 flex flex-col page-enter">
          {renderOfficerHeader('officer-dash-page')}

          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full space-y-6">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <h1 className="text-xl font-black text-[#162c5b]">{t('activeProcurementTenders')}</h1>
                <p className="text-xs text-gray-500">
                  {t('activeTendersSub')}
                </p>
              </div>
              <button
                onClick={() => navigatePage('officer-compare-page')}
                className="bg-blue-900 hover:bg-blue-950 text-white text-xs font-bold px-3 py-2 rounded shadow cursor-pointer transition flex items-center gap-1"
              >
                <span>Go to O2. {t('compareBidders')}</span>
                <span>&gt;</span>
              </button>
            </div>

            {/* Interactive KPI Cards (Click to Filter) */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div
                onClick={() => setTenderFilter('ALL')}
                className={`p-4 rounded-lg border shadow-xs cursor-pointer transition ${
                  tenderFilter === 'ALL'
                    ? 'bg-blue-50 border-blue-400 ring-2 ring-blue-300'
                    : 'bg-white hover:border-gray-300'
                }`}
              >
                <p className="text-xs text-gray-500 uppercase font-bold">{t('activeTenders')}</p>
                <p className="text-2xl font-black text-[#162c5b] mt-1">8</p>
                <span className="text-[10px] text-blue-600 font-semibold">Click to show all</span>
              </div>
              <div
                onClick={() => setTenderFilter('ALL')}
                className="bg-white p-4 rounded-lg border shadow-xs hover:border-orange-300 transition cursor-pointer"
              >
                <p className="text-xs text-gray-500 uppercase font-bold">{t('bidsUnderScrutiny')}</p>
                <p className="text-2xl font-black text-orange-600 mt-1">24</p>
                <span className="text-[10px] text-orange-600 font-semibold">Under live evaluation</span>
              </div>
              <div
                onClick={() => setTenderFilter('SCRUTINY')}
                className={`p-4 rounded-lg border shadow-xs cursor-pointer transition ${
                  tenderFilter === 'SCRUTINY'
                    ? 'bg-green-50 border-green-400 ring-2 ring-green-300'
                    : 'bg-white hover:border-gray-300'
                }`}
              >
                <p className="text-xs text-gray-500 uppercase font-bold">{t('aiScannedBids')}</p>
                <p className="text-2xl font-black text-green-600 mt-1">100%</p>
                <span className="text-[10px] text-green-600 font-semibold">Click to view verified</span>
              </div>
              <div
                onClick={() => setTenderFilter('DISCREPANCIES')}
                className={`p-4 rounded-lg border shadow-xs cursor-pointer transition ${
                  tenderFilter === 'DISCREPANCIES'
                    ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-300'
                    : 'bg-white hover:border-gray-300'
                }`}
              >
                <p className="text-xs text-gray-500 uppercase font-bold">{t('discrepanciesFlagged')}</p>
                <p className="text-2xl font-black text-amber-500 mt-1">3</p>
                <span className="text-[10px] text-amber-600 font-semibold">Click to view flagged</span>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-white p-3 rounded-lg border shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-600">Filter Status:</span>
                <button
                  onClick={() => setTenderFilter('ALL')}
                  className={`px-2.5 py-1 rounded font-semibold cursor-pointer transition ${
                    tenderFilter === 'ALL' ? 'bg-[#162c5b] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All (8)
                </button>
                <button
                  onClick={() => setTenderFilter('SCRUTINY')}
                  className={`px-2.5 py-1 rounded font-semibold cursor-pointer transition ${
                    tenderFilter === 'SCRUTINY' ? 'bg-green-700 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Scrutiny Complete (5)
                </button>
                <button
                  onClick={() => setTenderFilter('DISCREPANCIES')}
                  className={`px-2.5 py-1 rounded font-semibold cursor-pointer transition ${
                    tenderFilter === 'DISCREPANCIES' ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Discrepancies Flagged (3)
                </button>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Search by tender ref / keyword..."
                  value={tenderSearch}
                  onChange={(e) => setTenderSearch(e.target.value)}
                  className="p-1.5 border border-gray-300 rounded w-60 text-xs"
                />
              </div>
            </div>

            {/* Tenders Table */}
            <div className="bg-white rounded-lg border shadow-xs overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-gray-100 border-b font-bold text-gray-600 uppercase">
                  <tr>
                    <th className="p-3">{t('tenderRefNo')}</th>
                    <th className="p-3">{t('description')}</th>
                    <th className="p-3">{t('bidders')}</th>
                    <th className="p-3">{t('aiScrutinyStatus')}</th>
                    <th className="p-3 text-right">{t('action')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className="bg-blue-50/40 hover:bg-blue-50/70 transition">
                    <td className="p-3 font-mono font-bold text-blue-900">GEM/2026/B/9012481</td>
                    <td className="p-3">
                      <span className="font-bold block text-gray-900">High Pressure Industrial Flow Control Valves</span>
                      <span className="text-[10px] text-gray-500">ONGC Offshore Drilling Platforms - Gujarat Region</span>
                    </td>
                    <td className="p-3 font-bold">3 Bidders</td>
                    <td className="p-3">
                      <span className="bg-green-100 text-green-800 font-bold px-2 py-0.5 rounded text-[10px]">
                        Scrutiny Complete
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => navigatePage('officer-compare-page')}
                        className="bg-[#162c5b] hover:bg-blue-900 text-white px-3 py-1.5 rounded font-bold cursor-pointer transition"
                      >
                        {t('compareBiddersBtn')}
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition">
                    <td className="p-3 font-mono font-bold text-gray-800">GEM/2026/B/8821902</td>
                    <td className="p-3">
                      <span className="font-bold block text-gray-900">Explosion Proof Centrifugal Slurry Pumps</span>
                      <span className="text-[10px] text-gray-500">BHEL Haridwar Power Plant Unit #4</span>
                    </td>
                    <td className="p-3 font-bold">4 Bidders</td>
                    <td className="p-3">
                      <span className="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded text-[10px]">
                        Discrepancy Ingested
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => navigatePage('officer-compare-page')}
                        className="border border-gray-300 hover:bg-gray-100 text-gray-700 px-3 py-1.5 rounded font-bold cursor-pointer transition"
                      >
                        Compare Bidders &gt;
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </main>
        </div>
      )}

      {/* ========================================================
           PAGE 5: O2. BIDDER COMPARISON
           ======================================================== */}
      {activePage === 'officer-compare-page' && (() => {
        const BIDDER_KEYS: Array<'ABC' | 'GLOBAL' | 'VERTEX'> = ['ABC', 'GLOBAL', 'VERTEX'];
        const BIDDER_RANKS: Record<'ABC' | 'GLOBAL' | 'VERTEX', number> = {
          ABC: 1,
          GLOBAL: 2,
          VERTEX: 3,
        };

        // Filter and sort evaluated bidders in real-time
        const filteredBidderKeys = BIDDER_KEYS.filter((key) => {
          if (!bidderSearch.trim()) return true;
          const q = bidderSearch.toLowerCase().trim();
          const b = BIDDER_PROFILES[key];
          return (
            b.name.toLowerCase().includes(q) ||
            b.regId.toLowerCase().includes(q) ||
            b.risk.toLowerCase().includes(q) ||
            b.localContent.toLowerCase().includes(q) ||
            b.score.toString().includes(q) ||
            `#${BIDDER_RANKS[key]}`.includes(q)
          );
        }).sort((a, b) => {
          const pA = BIDDER_PROFILES[a];
          const pB = BIDDER_PROFILES[b];
          if (bidderSortField === 'rank') {
            return bidderSortAsc ? BIDDER_RANKS[a] - BIDDER_RANKS[b] : BIDDER_RANKS[b] - BIDDER_RANKS[a];
          }
          if (bidderSortField === 'score') {
            return bidderSortAsc ? pA.score - pB.score : pB.score - pA.score;
          }
          if (bidderSortField === 'risk') {
            const riskWeight = { LOW: 1, MEDIUM: 2, HIGH: 3 };
            return bidderSortAsc ? riskWeight[pA.risk] - riskWeight[pB.risk] : riskWeight[pB.risk] - riskWeight[pA.risk];
          }
          if (bidderSortField === 'mii') {
            const miiA = parseFloat(pA.localContent);
            const miiB = parseFloat(pB.localContent);
            return bidderSortAsc ? miiA - miiB : miiB - miiA;
          }
          return 0;
        });

        return (
          <div id="officer-compare-page" className="flex-1 flex flex-col page-enter">
            {renderOfficerHeader('officer-compare-page')}

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full space-y-6">
              {/* Header Title and Navigation Bar */}
              <div className="flex flex-wrap justify-between items-center gap-3 border-b pb-3">
                <div>
                  <h1 className="text-xl font-black text-[#162c5b]">{t('comparativeScrutiny')}</h1>
                  <p className="text-xs text-gray-500">
                    Tender: GEM/2026/B/9012481 • Compare bidders by statutory parity, risk score & local content
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => navigatePage('officer-dash-page')}
                    className="border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-bold px-3 py-1.5 rounded-lg cursor-pointer transition"
                  >
                    {t('backToTenders')}
                  </button>
                  <button
                    onClick={() => navigatePage('officer-page')}
                    className="bg-gradient-to-r from-emerald-700 to-teal-800 hover:from-emerald-800 hover:to-teal-900 text-white text-xs font-bold px-3.5 py-1.5 rounded-lg shadow-sm cursor-pointer transition flex items-center gap-1.5"
                  >
                    <span>Inspect {currentBidder.name.split(' ')[0]} (O3 Detail) ★ &gt;</span>
                  </button>
                </div>
              </div>

              {/* Quick Filter & Real-Time Search Bar */}
              <div className="flex flex-wrap justify-between items-center gap-3 bg-white p-3 rounded-xl border border-gray-200 shadow-xs text-xs">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-gray-600">Select Evaluated Bidder:</span>
                  <button
                    onClick={() => setSelectedBidderKey('ABC')}
                    className={`px-3 py-1 rounded-lg font-bold cursor-pointer transition flex items-center gap-1.5 ${
                      selectedBidderKey === 'ABC' 
                        ? 'bg-emerald-700 text-white shadow-xs' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    <span>#1 ABC Industries (94%)</span>
                  </button>
                  <button
                    onClick={() => setSelectedBidderKey('GLOBAL')}
                    className={`px-3 py-1 rounded-lg font-bold cursor-pointer transition flex items-center gap-1.5 ${
                      selectedBidderKey === 'GLOBAL' 
                        ? 'bg-amber-600 text-white shadow-xs' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-300"></span>
                    <span>#2 Global Valves (72%)</span>
                  </button>
                  <button
                    onClick={() => setSelectedBidderKey('VERTEX')}
                    className={`px-3 py-1 rounded-lg font-bold cursor-pointer transition flex items-center gap-1.5 ${
                      selectedBidderKey === 'VERTEX' 
                        ? 'bg-red-700 text-white shadow-xs' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-red-300"></span>
                    <span>#3 Vertex Fluid (46%)</span>
                  </button>
                </div>

                {/* Filter Search Input */}
                <div className="relative flex items-center">
                  <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Filter bidders by name, ID, risk..."
                    value={bidderSearch}
                    onChange={(e) => setBidderSearch(e.target.value)}
                    className="pl-8 pr-7 py-1.5 border border-gray-300 rounded-lg text-xs w-60 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white"
                  />
                  {bidderSearch && (
                    <button
                      onClick={() => setBidderSearch('')}
                      className="absolute right-2 text-gray-400 hover:text-gray-600 cursor-pointer"
                      title="Clear search"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Main Comparative Scrutiny Table */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-gray-100 border-b font-bold text-gray-600 uppercase text-[11px]">
                    <tr>
                      <th
                        className="p-3 cursor-pointer hover:bg-gray-200/70 select-none transition"
                        onClick={() => {
                          if (bidderSortField === 'rank') setBidderSortAsc(!bidderSortAsc);
                          else { setBidderSortField('rank'); setBidderSortAsc(true); }
                        }}
                        title="Sort by Rank"
                      >
                        <div className="flex items-center gap-1">
                          <span>{t('rankBidderName')}</span>
                          <ArrowUpDown className="w-3 h-3 text-gray-400" />
                        </div>
                      </th>
                      <th
                        className="p-3 cursor-pointer hover:bg-gray-200/70 select-none transition"
                        onClick={() => {
                          if (bidderSortField === 'score') setBidderSortAsc(!bidderSortAsc);
                          else { setBidderSortField('score'); setBidderSortAsc(false); }
                        }}
                        title="Sort by Compliance Score"
                      >
                        <div className="flex items-center gap-1">
                          <span>{t('complianceScore')}</span>
                          <ArrowUpDown className="w-3 h-3 text-gray-400" />
                        </div>
                      </th>
                      <th
                        className="p-3 cursor-pointer hover:bg-gray-200/70 select-none transition"
                        onClick={() => {
                          if (bidderSortField === 'risk') setBidderSortAsc(!bidderSortAsc);
                          else { setBidderSortField('risk'); setBidderSortAsc(true); }
                        }}
                        title="Sort by Risk Tier"
                      >
                        <div className="flex items-center gap-1">
                          <span>{t('riskLevel')}</span>
                          <ArrowUpDown className="w-3 h-3 text-gray-400" />
                        </div>
                      </th>
                      <th className="p-3">{t('statutoryParity')}</th>
                      <th
                        className="p-3 cursor-pointer hover:bg-gray-200/70 select-none transition"
                        onClick={() => {
                          if (bidderSortField === 'mii') setBidderSortAsc(!bidderSortAsc);
                          else { setBidderSortField('mii'); setBidderSortAsc(false); }
                        }}
                        title="Sort by MII Local Content"
                      >
                        <div className="flex items-center gap-1">
                          <span>{t('localContent')}</span>
                          <ArrowUpDown className="w-3 h-3 text-gray-400" />
                        </div>
                      </th>
                      <th className="p-3 text-right">{t('detailAudit')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredBidderKeys.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-gray-500 italic">
                          No bidders match filter criteria "{bidderSearch}".{' '}
                          <button
                            onClick={() => setBidderSearch('')}
                            className="text-blue-900 underline font-bold ml-1 cursor-pointer"
                          >
                            Clear search
                          </button>
                        </td>
                      </tr>
                    ) : (
                      filteredBidderKeys.map((key) => {
                        const bidder = BIDDER_PROFILES[key];
                        const isSelected = selectedBidderKey === key;
                        const rank = BIDDER_RANKS[key];

                        return (
                          <tr
                            key={key}
                            onClick={() => setSelectedBidderKey(key)}
                            className={`cursor-pointer transition duration-150 ${
                              isSelected
                                ? key === 'ABC'
                                  ? 'bg-emerald-50/80 ring-2 ring-emerald-400'
                                  : key === 'GLOBAL'
                                  ? 'bg-amber-50/80 ring-2 ring-amber-400'
                                  : 'bg-red-50/80 ring-2 ring-red-400'
                                : 'hover:bg-gray-50'
                            }`}
                          >
                            <td className="p-3 font-bold text-gray-900">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`font-black px-1.5 py-0.5 rounded text-xs shrink-0 ${
                                    rank === 1
                                      ? 'text-emerald-800 bg-emerald-100'
                                      : rank === 2
                                      ? 'text-amber-800 bg-amber-100'
                                      : 'text-red-800 bg-red-100'
                                  }`}
                                >
                                  #{rank}
                                </span>
                                <div>
                                  <span className="font-extrabold text-gray-900 block">{bidder.name}</span>
                                  <span className="text-gray-500 font-mono text-[11px] block">
                                    {bidder.regId}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td
                              className={`p-3 font-black text-sm ${
                                bidder.score >= 90
                                  ? 'text-emerald-700'
                                  : bidder.score >= 70
                                  ? 'text-amber-700'
                                  : 'text-red-700'
                              }`}
                            >
                              {bidder.score} / 100
                            </td>
                            <td className="p-3">
                              <span
                                className={`font-bold px-2 py-0.5 rounded text-[10px] inline-flex items-center gap-1.5 border ${
                                  bidder.risk === 'LOW'
                                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                    : bidder.risk === 'MEDIUM'
                                    ? 'bg-amber-100 text-amber-800 border-amber-300'
                                    : 'bg-red-100 text-red-800 border-red-300'
                                }`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    bidder.risk === 'LOW'
                                      ? 'bg-emerald-600'
                                      : bidder.risk === 'MEDIUM'
                                      ? 'bg-amber-600'
                                      : 'bg-red-600'
                                  }`}
                                ></span>
                                <span>{bidder.risk}</span>
                              </span>
                            </td>
                            <td
                              className={`p-3 font-bold ${
                                bidder.statutoryPassed.startsWith('6')
                                  ? 'text-emerald-700'
                                  : bidder.statutoryPassed.startsWith('5')
                                  ? 'text-amber-700'
                                  : 'text-red-700'
                              }`}
                            >
                              {bidder.statutoryPassed} Passed
                            </td>
                            <td className="p-3">
                              <span
                                className={`font-mono font-bold text-xs ${
                                  parseFloat(bidder.localContent) >= 50
                                    ? 'text-emerald-800'
                                    : 'text-red-700 font-black'
                                }`}
                              >
                                {bidder.localContent}
                              </span>
                              <span className="text-[10px] text-gray-500 block">
                                {parseFloat(bidder.localContent) >= 50 ? '(Class-I)' : '(Failed < 50%)'}
                              </span>
                            </td>
                            <td className="p-3 text-right">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedBidderKey(key);
                                  navigatePage('officer-page');
                                }}
                                className={`px-3 py-1.5 rounded-lg font-bold text-xs cursor-pointer shadow-xs transition inline-flex items-center gap-1 ${
                                  key === 'ABC'
                                    ? 'bg-[#162c5b] hover:bg-blue-900 text-white'
                                    : 'border border-gray-300 hover:bg-gray-100 text-gray-800'
                                }`}
                              >
                                <span>{key === 'ABC' ? '03. Deep Audit ★' : 'Inspect Audit >'}</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Selected Bidder Insight & Action Card */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-5 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm text-white ${
                        selectedBidderKey === 'ABC'
                          ? 'bg-emerald-600'
                          : selectedBidderKey === 'GLOBAL'
                          ? 'bg-amber-600'
                          : 'bg-red-600'
                      }`}
                    >
                      #{BIDDER_RANKS[selectedBidderKey]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm sm:text-base font-extrabold text-gray-900">
                          {currentBidder.name}
                        </h3>
                        <span className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                          {currentBidder.regId}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        {currentBidder.supplierClass} • Local Value Content:{' '}
                        <strong
                          className={
                            parseFloat(currentBidder.localContent) >= 50
                              ? 'text-emerald-700'
                              : 'text-red-600'
                          }
                        >
                          {currentBidder.localContent}
                        </strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigatePage('officer-page')}
                      className="bg-[#162c5b] hover:bg-blue-900 text-white text-xs font-bold px-3.5 py-1.5 rounded-lg shadow-xs transition cursor-pointer flex items-center gap-1.5"
                    >
                      <FileText className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                      <span>Open O3 Deep Scrutiny &gt;</span>
                    </button>
                    <button
                      onClick={() => navigatePage('risk-page')}
                      className="bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold px-3.5 py-1.5 rounded-lg shadow-xs transition cursor-pointer flex items-center gap-1.5"
                    >
                      <AlertTriangle className="w-3.5 h-3.5 text-yellow-300 shrink-0" />
                      <span>O4 Risk Attribution &gt;</span>
                    </button>
                  </div>
                </div>

                {/* 4 Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">
                      Composite Score
                    </span>
                    <span className="text-xl font-black text-[#162c5b] mt-0.5 block">
                      {currentBidder.score} / 100
                    </span>
                    <span className="text-[10px] text-gray-500">Weighted Statutory Index</span>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">
                      Risk Classification
                    </span>
                    <span
                      className={`text-xl font-black mt-0.5 block ${
                        currentBidder.risk === 'LOW'
                          ? 'text-emerald-700'
                          : currentBidder.risk === 'MEDIUM'
                          ? 'text-amber-600'
                          : 'text-red-600'
                      }`}
                    >
                      {currentBidder.risk} RISK
                    </span>
                    <span className="text-[10px] text-gray-500">Zero-Trust Heuristics</span>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">
                      Statutory Parity
                    </span>
                    <span className="text-xl font-black text-gray-900 mt-0.5 block">
                      {currentBidder.statutoryPassed} Passed
                    </span>
                    <span className="text-[10px] text-gray-500">CBDT, GSTN, MSME, EPFO</span>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">
                      Tender Requirements
                    </span>
                    <span className="text-xl font-black text-gray-900 mt-0.5 block">
                      {currentBidder.tenderPassed} Met
                    </span>
                    <span className="text-[10px] text-gray-500">MII, MAF, Experience</span>
                  </div>
                </div>

                {/* Explainable Statutory Note */}
                <div
                  className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
                    selectedBidderKey === 'ABC'
                      ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                      : selectedBidderKey === 'GLOBAL'
                      ? 'bg-amber-50/70 border-amber-200 text-amber-900'
                      : 'bg-red-50/70 border-red-200 text-red-900'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <strong className="block font-bold">
                      {selectedBidderKey === 'ABC' && 'L1 Optimal Candidate: 100% Statutory Clearance'}
                      {selectedBidderKey === 'GLOBAL' &&
                        'Minor Remediation Flag: FY 2021-22 ITR Confirmation Pending'}
                      {selectedBidderKey === 'VERTEX' &&
                        'Statutory Rejection Ground: Make-in-India Sub-50% & Expired OEM MAF'}
                    </strong>
                    <p className="text-[11px] leading-relaxed">
                      {selectedBidderKey === 'ABC' &&
                        'All 6 statutory registries validated in real-time. Full GFR 153(iii) & Class-I 58.4% local value addition verified. Recommended for technical qualification.'}
                      {selectedBidderKey === 'GLOBAL' &&
                        '5 of 6 statutory registries verified. FY 2021-22 ITR filing record pending confirmation with e-Filing portal. Class-I 51.2% local value addition verified.'}
                      {selectedBidderKey === 'VERTEX' &&
                        'Critical Discrepancies: Make-in-India content (34.0%) falls below 50% GFR threshold. OEM Authorization expired 31-Dec-2025. EPFO registration pending and ESIC default notice flagged.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Side-by-Side Clause-by-Clause Statutory Parity Matrix */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden text-xs">
                <div className="bg-[#082435] text-white p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Scale className="w-4 h-4 text-yellow-400 shrink-0" />
                    <h3 className="font-extrabold text-sm uppercase tracking-wider">
                      Comparative Statutory Clause Parity Matrix (Side-by-Side)
                    </h3>
                  </div>
                  <button
                    onClick={() => setShowParityMatrix(!showParityMatrix)}
                    className="text-xs text-yellow-300 hover:text-white underline cursor-pointer"
                  >
                    {showParityMatrix ? 'Collapse Matrix' : 'Expand Matrix'}
                  </button>
                </div>

                {showParityMatrix && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-gray-100 border-b text-[11px] font-bold text-gray-600 uppercase">
                        <tr>
                          <th className="p-3 w-1/4">Statutory & Tender Clause</th>
                          <th className="p-3 text-center border-l bg-emerald-50/50">
                            #1 ABC Industries (94%)
                          </th>
                          <th className="p-3 text-center border-l bg-amber-50/50">
                            #2 Global Valves (72%)
                          </th>
                          <th className="p-3 text-center border-l bg-red-50/50">
                            #3 Vertex Fluid (46%)
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 text-xs">
                        <tr className="hover:bg-gray-50">
                          <td className="p-3 font-semibold text-gray-800">
                            1. GSTIN Active Regular Taxpayer
                            <span className="text-[10px] text-gray-500 block">GSTN Common Portal Sync</span>
                          </td>
                          <td className="p-3 text-center border-l font-bold text-emerald-700 bg-emerald-50/20">
                            <span className="inline-flex items-center gap-1">
                              <Check className="w-3.5 h-3.5 text-emerald-600" /> Active Regular
                            </span>
                          </td>
                          <td className="p-3 text-center border-l font-bold text-emerald-700 bg-amber-50/10">
                            <span className="inline-flex items-center gap-1">
                              <Check className="w-3.5 h-3.5 text-emerald-600" /> Active Regular
                            </span>
                          </td>
                          <td className="p-3 text-center border-l font-bold text-emerald-700 bg-red-50/10">
                            <span className="inline-flex items-center gap-1">
                              <Check className="w-3.5 h-3.5 text-emerald-600" /> Active Regular
                            </span>
                          </td>
                        </tr>

                        <tr className="hover:bg-gray-50">
                          <td className="p-3 font-semibold text-gray-800">
                            2. Income Tax PAN Entity Linkage
                            <span className="text-[10px] text-gray-500 block">CBDT Database Validation</span>
                          </td>
                          <td className="p-3 text-center border-l font-bold text-emerald-700 bg-emerald-50/20">
                            <span className="inline-flex items-center gap-1">
                              <Check className="w-3.5 h-3.5 text-emerald-600" /> Verified (AAACB)
                            </span>
                          </td>
                          <td className="p-3 text-center border-l font-bold text-emerald-700 bg-amber-50/10">
                            <span className="inline-flex items-center gap-1">
                              <Check className="w-3.5 h-3.5 text-emerald-600" /> Verified (AAACG)
                            </span>
                          </td>
                          <td className="p-3 text-center border-l font-bold text-emerald-700 bg-red-50/10">
                            <span className="inline-flex items-center gap-1">
                              <Check className="w-3.5 h-3.5 text-emerald-600" /> Verified (AAACV)
                            </span>
                          </td>
                        </tr>

                        <tr className="hover:bg-gray-50">
                          <td className="p-3 font-semibold text-gray-800">
                            3. Udyam MSME Registration
                            <span className="text-[10px] text-gray-500 block">National MSME Portal API</span>
                          </td>
                          <td className="p-3 text-center border-l font-bold text-emerald-700 bg-emerald-50/20">
                            <span className="inline-flex items-center gap-1">
                              <Check className="w-3.5 h-3.5 text-emerald-600" /> Active Lifetime
                            </span>
                          </td>
                          <td className="p-3 text-center border-l font-bold text-emerald-700 bg-amber-50/10">
                            <span className="inline-flex items-center gap-1">
                              <Check className="w-3.5 h-3.5 text-emerald-600" /> Active Lifetime
                            </span>
                          </td>
                          <td className="p-3 text-center border-l font-bold text-emerald-700 bg-red-50/10">
                            <span className="inline-flex items-center gap-1">
                              <Check className="w-3.5 h-3.5 text-emerald-600" /> Active Lifetime
                            </span>
                          </td>
                        </tr>

                        <tr className="hover:bg-gray-50">
                          <td className="p-3 font-semibold text-gray-800">
                            4. Income Tax Returns (Past 3 FY)
                            <span className="text-[10px] text-gray-500 block">ITD e-Filing Verification</span>
                          </td>
                          <td className="p-3 text-center border-l font-bold text-emerald-700 bg-emerald-50/20">
                            <span className="inline-flex items-center gap-1">
                              <Check className="w-3.5 h-3.5 text-emerald-600" /> 3 FY Verified
                            </span>
                          </td>
                          <td className="p-3 text-center border-l font-bold text-amber-700 bg-amber-50/10">
                            <span className="inline-flex items-center gap-1">
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> FY21-22 Pending
                            </span>
                          </td>
                          <td className="p-3 text-center border-l font-bold text-red-700 bg-red-50/10">
                            <span className="inline-flex items-center gap-1">
                              <X className="w-3.5 h-3.5 text-red-600" /> Discrepancy Flag
                            </span>
                          </td>
                        </tr>

                        <tr className="hover:bg-gray-50">
                          <td className="p-3 font-semibold text-gray-800">
                            5. EPFO Labour Compliance
                            <span className="text-[10px] text-gray-500 block">Shram Suvidha Gateway</span>
                          </td>
                          <td className="p-3 text-center border-l font-bold text-emerald-700 bg-emerald-50/20">
                            <span className="inline-flex items-center gap-1">
                              <Check className="w-3.5 h-3.5 text-emerald-600" /> ECR Lodged
                            </span>
                          </td>
                          <td className="p-3 text-center border-l font-bold text-emerald-700 bg-amber-50/10">
                            <span className="inline-flex items-center gap-1">
                              <Check className="w-3.5 h-3.5 text-emerald-600" /> ECR Lodged
                            </span>
                          </td>
                          <td className="p-3 text-center border-l font-bold text-amber-700 bg-red-50/10">
                            <span className="inline-flex items-center gap-1">
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Pending Verify
                            </span>
                          </td>
                        </tr>

                        <tr className="hover:bg-gray-50">
                          <td className="p-3 font-semibold text-gray-800">
                            6. ESIC Social Security Status
                            <span className="text-[10px] text-gray-500 block">ESIC Portal Handshake</span>
                          </td>
                          <td className="p-3 text-center border-l font-bold text-emerald-700 bg-emerald-50/20">
                            <span className="inline-flex items-center gap-1">
                              <Check className="w-3.5 h-3.5 text-emerald-600" /> Cleared
                            </span>
                          </td>
                          <td className="p-3 text-center border-l font-bold text-emerald-700 bg-amber-50/10">
                            <span className="inline-flex items-center gap-1">
                              <Check className="w-3.5 h-3.5 text-emerald-600" /> Cleared
                            </span>
                          </td>
                          <td className="p-3 text-center border-l font-bold text-red-700 bg-red-50/10">
                            <span className="inline-flex items-center gap-1">
                              <X className="w-3.5 h-3.5 text-red-600" /> Default Notice
                            </span>
                          </td>
                        </tr>

                        <tr className="hover:bg-gray-50">
                          <td className="p-3 font-semibold text-gray-800">
                            7. OEM Authorization Form (MAF)
                            <span className="text-[10px] text-gray-500 block">Clause 14.2 Manufacturer Link</span>
                          </td>
                          <td className="p-3 text-center border-l font-bold text-emerald-700 bg-emerald-50/20">
                            <span className="inline-flex items-center gap-1">
                              <Check className="w-3.5 h-3.5 text-emerald-600" /> Valid ONGC Form
                            </span>
                          </td>
                          <td className="p-3 text-center border-l font-bold text-emerald-700 bg-amber-50/10">
                            <span className="inline-flex items-center gap-1">
                              <Check className="w-3.5 h-3.5 text-emerald-600" /> Valid Global Form
                            </span>
                          </td>
                          <td className="p-3 text-center border-l font-bold text-red-700 bg-red-50/10">
                            <span className="inline-flex items-center gap-1">
                              <X className="w-3.5 h-3.5 text-red-600" /> Expired 31-Dec
                            </span>
                          </td>
                        </tr>

                        <tr className="hover:bg-gray-50">
                          <td className="p-3 font-semibold text-gray-800">
                            8. Make in India (MII) Local Content
                            <span className="text-[10px] text-gray-500 block">Minimum 50% Threshold</span>
                          </td>
                          <td className="p-3 text-center border-l font-black text-emerald-700 bg-emerald-50/20">
                            58.4% (Class-I)
                          </td>
                          <td className="p-3 text-center border-l font-black text-emerald-700 bg-amber-50/10">
                            51.2% (Class-I)
                          </td>
                          <td className="p-3 text-center border-l font-black text-red-600 bg-red-50/10">
                            34.0% (Disqualified)
                          </td>
                        </tr>

                        <tr className="bg-gray-50 font-extrabold">
                          <td className="p-3 uppercase tracking-wider text-[#162c5b]">
                            Final Technical Verdict
                          </td>
                          <td className="p-3 text-center border-l text-emerald-700 bg-emerald-100/60 font-black">
                            QUALIFIED (L1)
                          </td>
                          <td className="p-3 text-center border-l text-amber-700 bg-amber-100/60 font-black">
                            CONDITIONAL (L2)
                          </td>
                          <td className="p-3 text-center border-l text-red-700 bg-red-100/60 font-black">
                            REJECTED
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </main>
          </div>
        );
      })()}

      {/* ========================================================
           PAGE 6: O3. BIDDER VERIFICATION DETAIL ⭐ (HERO SCREEN)
           ======================================================== */}
      {activePage === 'officer-page' && (
        <div id="officer-page" className="flex-1 flex flex-col page-enter">
          {renderOfficerHeader('officer-page')}

          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full space-y-6">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-extrabold text-[#162c5b]">
                    {t('bidder')}: {currentBidder.name}
                  </h1>
                  <span className="text-xs font-mono font-bold bg-blue-100 text-blue-900 px-2 py-0.5 rounded">
                    {currentBidder.regId}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  Tender: GEM/2026/B/9012481 • Full statutory + tender compliance scrutiny
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => navigatePage('officer-compare-page')}
                  className="border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-bold px-3 py-1.5 rounded cursor-pointer"
                >
                  {t('backToComparison')}
                </button>
                <button
                  onClick={() => navigatePage('risk-page')}
                  className="bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold px-3 py-1.5 rounded shadow cursor-pointer transition"
                >
                  O4. {t('findingsRisk')} &gt;
                </button>
              </div>
            </div>

            {/* Quick Bidder Selector Buttons */}
            <div className="flex items-center gap-2 text-xs">
              <span className="font-bold text-gray-600">Switch Target Bidder:</span>
              <button
                onClick={() => setSelectedBidderKey('ABC')}
                className={`px-3 py-1 rounded font-bold cursor-pointer transition ${
                  selectedBidderKey === 'ABC' ? 'bg-[#162c5b] text-white shadow' : 'bg-white border text-gray-700 hover:bg-gray-50'
                }`}
              >
                ABC Industries (94%)
              </button>
              <button
                onClick={() => setSelectedBidderKey('GLOBAL')}
                className={`px-3 py-1 rounded font-bold cursor-pointer transition ${
                  selectedBidderKey === 'GLOBAL' ? 'bg-[#162c5b] text-white shadow' : 'bg-white border text-gray-700 hover:bg-gray-50'
                }`}
              >
                Global Valves (72%)
              </button>
              <button
                onClick={() => setSelectedBidderKey('VERTEX')}
                className={`px-3 py-1 rounded font-bold cursor-pointer transition ${
                  selectedBidderKey === 'VERTEX' ? 'bg-[#162c5b] text-white shadow' : 'bg-white border text-gray-700 hover:bg-gray-50'
                }`}
              >
                Vertex Fluid (46%)
              </button>
            </div>

            {/* HERO BANNER */}
            <div className="bg-gradient-to-r from-[#162c5b] via-[#1c3977] to-[#12244d] rounded-xl shadow-lg text-white p-6 flex flex-col md:flex-row justify-between items-center gap-6">
              <div>
                <span className="bg-yellow-400 text-blue-950 font-black text-[10px] uppercase px-2 py-0.5 rounded">
                  {t('aiComplianceSummary')}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black mt-2">
                  {currentBidder.score}% Compliance |{' '}
                  <span
                    className={
                      currentBidder.risk === 'LOW'
                        ? 'text-emerald-400'
                        : currentBidder.risk === 'MEDIUM'
                        ? 'text-amber-400'
                        : 'text-red-400'
                    }
                  >
                    {currentBidder.risk} RISK
                  </span>
                </h2>
                <p className="text-xs text-blue-200 mt-1">
                  Cross-check against 10 statutory sources and tender clauses completed.
                </p>
              </div>
              <div className="flex space-x-4 bg-black/25 p-3 rounded-lg border border-white/10 text-center text-xs">
                <div>
                  <p className="text-gray-300 font-bold">Statutory</p>
                  <p className="text-lg font-black text-green-400">{currentBidder.statutoryPassed}</p>
                </div>
                <div className="border-l border-white/20 pl-4">
                  <p className="text-gray-300 font-bold">Tender-Specific</p>
                  <p className="text-lg font-black text-green-400">{currentBidder.tenderPassed}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
              {/* Statutory Verification */}
              <div className="bg-white p-5 rounded-lg border shadow-xs space-y-2">
                <h3 className="font-bold uppercase text-gray-700 border-b pb-2">
                  {t('statutoryVerification')}
                </h3>
                <div className="flex justify-between items-center py-1.5 border-b">
                  <span>Udyam Registration</span>
                  <button
                    onClick={() =>
                      openDocDetails(
                        'Udyam Registration Certificate',
                        currentBidder.udyamId,
                        'Active Lifetime',
                        'MSME National Registry'
                      )
                    }
                    className="font-bold text-green-700 hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-emerald-700" /> {t('verified')}</span>
                    <span className="text-[10px] text-blue-600">({t('inspect')})</span>
                  </button>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b">
                  <span>GST Registration</span>
                  <button
                    onClick={() =>
                      openDocDetails(
                        'GST Active Status',
                        currentBidder.gstin,
                        'Active Regular Taxpayer',
                        'GSTN Common Portal'
                      )
                    }
                    className="font-bold text-green-700 hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-emerald-700" /> {t('verified')}</span>
                    <span className="text-[10px] text-blue-600">({t('inspect')})</span>
                  </button>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b">
                  <span>PAN Verification</span>
                  <button
                    onClick={() =>
                      openDocDetails(
                        'PAN Legal Entity Match',
                        currentBidder.pan,
                        'Valid & Linked with Income Tax Database',
                        'CBDT / NSDL'
                      )
                    }
                    className="font-bold text-green-700 hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-emerald-700" /> {t('verified')}</span>
                    <span className="text-[10px] text-blue-600">({t('inspect')})</span>
                  </button>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b">
                  <span>Income Tax Returns (Past 3 FY)</span>
                  <button
                    onClick={() =>
                      openDocDetails(
                        'ITR-6 Corporate Returns',
                        currentBidder.itr,
                        'Verified for Past 3 Assessment Years',
                        'e-Filing Central Portal'
                      )
                    }
                    className="font-bold text-green-700 hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-emerald-700" /> {t('verified')}</span>
                    <span className="text-[10px] text-blue-600">({t('inspect')})</span>
                  </button>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b">
                  <span>EPFO Compliance</span>
                  <button
                    onClick={() =>
                      openDocDetails(
                        'EPFO Electronic Challan',
                        currentBidder.epfo,
                        'Active Monthly ECR Lodged',
                        'Shram Suvidha Gateway'
                      )
                    }
                    className="font-bold text-green-700 hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-emerald-700" /> {t('verified')}</span>
                    <span className="text-[10px] text-blue-600">({t('inspect')})</span>
                  </button>
                </div>
                <div className="flex justify-between items-center py-1.5">
                  <span>ESIC Registration</span>
                  <button
                    onClick={() =>
                      openDocDetails(
                        'ESIC Employer Portal',
                        currentBidder.esic,
                        'Contribution Record Cleared',
                        'ESIC Portal'
                      )
                    }
                    className="font-bold text-green-700 hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-emerald-700" /> {t('verified')}</span>
                    <span className="text-[10px] text-blue-600">({t('inspect')})</span>
                  </button>
                </div>
              </div>

              {/* Tender-Specific Verification */}
              <div className="bg-white p-5 rounded-lg border shadow-xs space-y-2">
                <h3 className="font-bold uppercase text-gray-700 border-b pb-2">
                  {t('tenderVerification')}
                </h3>
                <div className="flex justify-between items-center py-1.5 border-b">
                  <span>OEM Authorization (MAF)</span>
                  <button
                    onClick={() =>
                      openDocDetails(
                        'OEM Manufacturer Authorization',
                        currentBidder.maf,
                        'Valid for Bid GEM/2026/B/9012481',
                        'Digital Signature Validated'
                      )
                    }
                    className="font-bold text-green-700 hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-emerald-700" /> {t('verified')}</span>
                    <span className="text-[10px] text-blue-600">({t('inspect')})</span>
                  </button>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b">
                  <span>Make in India (MII) Preference</span>
                  <button
                    onClick={() =>
                      openDocDetails(
                        'MII Local Supplier Undertaking',
                        currentBidder.supplierClass,
                        `Local Content: ${currentBidder.localContent}`,
                        'Statutory CA Attested'
                      )
                    }
                    className="font-bold text-green-700 hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-emerald-700" /> {t('verified')}</span>
                    <span className="text-[10px] text-blue-600">({t('inspect')})</span>
                  </button>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b">
                  <span>Local Content ({currentBidder.localContent})</span>
                  <button
                    onClick={() =>
                      openDocDetails(
                        'Local Content Cost Audit',
                        'CA-UDIN-24AAACB90182',
                        `${currentBidder.localContent} Domestic Manufacturing Verified`,
                        'ICAI UDIN Registry'
                      )
                    }
                    className="font-bold text-green-700 hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-emerald-700" /> {t('verified')}</span>
                    <span className="text-[10px] text-blue-600">({t('inspect')})</span>
                  </button>
                </div>
                <div className="flex justify-between items-center py-1.5">
                  <span>Required Past Experience</span>
                  <button
                    onClick={() =>
                      openDocDetails(
                        'Past Experience Verification',
                        currentBidder.pastExp,
                        'Complies with GeM Pre-Qualification Criteria',
                        'ONGC SAP Records'
                      )
                    }
                    className="font-bold text-green-700 hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-emerald-700" /> {t('verified')}</span>
                    <span className="text-[10px] text-blue-600">({t('inspect')})</span>
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      )}

      {/* ========================================================
           PAGE 7: O4. AI FINDINGS & RISK ANALYSIS
           ======================================================== */}
      {activePage === 'risk-page' && (
        <div id="risk-page" className="flex-1 flex flex-col page-enter">
          {renderOfficerHeader('risk-page')}

          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full space-y-6">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <h1 className="text-xl font-extrabold text-[#162c5b]">
                  {t('explainableRisk')}
                </h1>
                <p className="text-xs text-gray-500">
                  Target Bidder: <strong className="text-gray-900">{currentBidder.name}</strong> • Mathematical attribution of score factors.
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => navigatePage('officer-page')}
                  className="border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-bold px-3 py-1.5 rounded cursor-pointer"
                >
                  {t('backToDetail')}
                </button>
                <button
                  onClick={() => navigatePage('audit-page')}
                  className="bg-blue-900 hover:bg-blue-950 text-white text-xs font-bold px-3 py-1.5 rounded shadow cursor-pointer transition"
                >
                  O5. {t('auditSignOff')} &gt;
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="bg-white p-5 rounded-lg border shadow-xs">
                <p className="font-bold text-gray-400 uppercase">{t('complianceScore')}</p>
                <p className="text-4xl font-black text-[#162c5b] mt-1">{currentBidder.score} / 100</p>
              </div>
              <div className="bg-white p-5 rounded-lg border shadow-xs">
                <p className="font-bold text-gray-400 uppercase">{t('riskLevel')}</p>
                <p
                  className={`text-4xl font-black mt-1 ${
                    currentBidder.risk === 'LOW'
                      ? 'text-green-600'
                      : currentBidder.risk === 'MEDIUM'
                      ? 'text-amber-500'
                      : 'text-red-600'
                  }`}
                >
                  {currentBidder.risk === 'LOW' ? 'LOW RISK' : currentBidder.risk === 'MEDIUM' ? 'MEDIUM RISK' : 'HIGH RISK'}
                </p>
              </div>
              <div className="bg-white p-5 rounded-lg border shadow-xs">
                <p className="font-bold text-gray-400 uppercase">{t('trafficLightTier')}</p>
                <div className="flex space-x-2 mt-2 font-bold text-center">
                  <button
                    onClick={() => setSelectedRiskTier('LOW')}
                    className={`flex-1 py-1 rounded cursor-pointer transition ${
                      currentBidder.risk === 'LOW' ? 'bg-green-600 text-white font-extrabold shadow' : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block mr-1.5"></span>Low
                  </button>
                  <button
                    onClick={() => setSelectedRiskTier('MEDIUM')}
                    className={`flex-1 py-1 rounded cursor-pointer transition ${
                      currentBidder.risk === 'MEDIUM' ? 'bg-amber-500 text-white font-extrabold shadow' : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-600 inline-block mr-1.5"></span>Medium
                  </button>
                  <button
                    onClick={() => setSelectedRiskTier('HIGH')}
                    className={`flex-1 py-1 rounded cursor-pointer transition ${
                      currentBidder.risk === 'HIGH' ? 'bg-red-600 text-white font-extrabold shadow' : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-red-600 inline-block mr-1.5"></span>High
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border shadow-xs overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-gray-100 border-b font-bold text-gray-600 uppercase">
                  <tr>
                    <th className="p-3">{t('factor')}</th>
                    <th className="p-3">{t('weight')}</th>
                    <th className="p-3">{t('result')}</th>
                    <th className="p-3 text-right">{t('verdict')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr
                    onClick={() => openDocDetails('Document Validity Attribution', '100% Integrity', 'All digital signatures active', 'OCR Subsystem')}
                    className="hover:bg-gray-50 cursor-pointer transition"
                  >
                    <td className="p-3 font-bold">Document Validity</td>
                    <td className="p-3 font-mono">20%</td>
                    <td className="p-3 font-bold">100%</td>
                    <td className="p-3 text-right text-green-700 font-bold"><span className="flex items-center justify-end gap-1"><Check className="w-3.5 h-3.5" /> Full Score</span></td>
                  </tr>
                  <tr
                    onClick={() => openDocDetails('Government Verification Attribution', '98% Parity', 'Live synced across GSTN/CBDT/EPFO', 'Central Gateways')}
                    className="hover:bg-gray-50 cursor-pointer transition"
                  >
                    <td className="p-3 font-bold">Government Verification</td>
                    <td className="p-3 font-mono">30%</td>
                    <td className="p-3 font-bold">{currentBidder.score > 80 ? '98%' : '72%'}</td>
                    <td className="p-3 text-right text-green-700 font-bold"><span className="flex items-center justify-end gap-1"><Check className="w-3.5 h-3.5" /> API Synced</span></td>
                  </tr>
                  <tr
                    onClick={() => openDocDetails('Tender Compliance Attribution', 'Criteria Evaluation', 'Clauses 14.1 to 14.8 checked', 'Procurement Engine')}
                    className="hover:bg-gray-50 cursor-pointer transition"
                  >
                    <td className="p-3 font-bold">Tender Compliance</td>
                    <td className="p-3 font-mono">25%</td>
                    <td className="p-3 font-bold">{currentBidder.score > 80 ? '95%' : '60%'}</td>
                    <td className="p-3 text-right text-green-700 font-bold"><span className="flex items-center justify-end gap-1"><Check className="w-3.5 h-3.5" /> Criteria Met</span></td>
                  </tr>
                  <tr
                    onClick={() => openDocDetails('Data Consistency Model', 'Entity Cross-Verification', 'PAN, GST, MAF legal name match', 'NLP Core')}
                    className="hover:bg-gray-50 cursor-pointer transition"
                  >
                    <td className="p-3 font-bold">Data Consistency</td>
                    <td className="p-3 font-mono">15%</td>
                    <td className="p-3 font-bold">{currentBidder.score > 80 ? '92%' : '58%'}</td>
                    <td className="p-3 text-right text-green-700 font-bold"><span className="flex items-center justify-end gap-1"><Check className="w-3.5 h-3.5" /> High Parity</span></td>
                  </tr>
                  <tr
                    onClick={() => openDocDetails('Risk Indicators Analysis', 'Zero Adverse Red Flags', 'No statutory blacklists', 'GeM Watchlist')}
                    className="hover:bg-gray-50 cursor-pointer transition"
                  >
                    <td className="p-3 font-bold">Risk Indicators</td>
                    <td className="p-3 font-mono">10%</td>
                    <td className="p-3 font-bold text-green-700">
                      {currentBidder.risk === 'LOW' ? 'Low (Zero Negative Flags)' : 'Adverse Indicators Present'}
                    </td>
                    <td className="p-3 text-right text-green-700 font-bold">
                      {currentBidder.risk === 'LOW' ? <span className="flex items-center gap-1 text-emerald-700"><Check className="w-3.5 h-3.5" /> Clean Record</span> : <span className="flex items-center gap-1 text-amber-700"><AlertTriangle className="w-3.5 h-3.5" /> Caution</span>}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </main>
        </div>
      )}

      {/* ========================================================
           PAGE 8: O5. AUDIT TRAIL + FINAL DECISION ⭐
           ======================================================== */}
      {activePage === 'audit-page' && (
        <div id="audit-page" className="flex-1 flex flex-col page-enter">
          {renderOfficerHeader('audit-page')}

          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full space-y-6">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <h1 className="text-xl font-extrabold text-[#162c5b]">
                  {t('auditTrailTitle')}
                </h1>
                <p className="text-xs text-gray-500">
                  Chronological verification history + procurement officer decision console.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigatePage('officer-page')}
                  className="border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-bold px-3 py-1.5 rounded cursor-pointer"
                >
                  {t('backToScrutiny')}
                </button>
                <button
                  onClick={handleExportDossier}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-3 py-1.5 rounded shadow cursor-pointer transition flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{t('exportDossier')}</span>
                </button>
              </div>
            </div>

            {/* Verification Timeline */}
            <div className="bg-white p-5 rounded-lg border shadow-xs space-y-3 text-xs">
              <h2 className="font-bold uppercase text-gray-700 border-b pb-2">
                {t('verificationTimeline')}
              </h2>
              <div className="space-y-2 font-mono">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-blue-900">10:42 AM</span>
                  <span>—</span>
                  <span>Bidder document uploaded &amp; SHA-256 registered</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-400 pl-4">↓</div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-blue-900">10:43 AM</span>
                  <span>—</span>
                  <span>OCR extraction completed (Vision Engine)</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-400 pl-4">↓</div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-blue-900">10:43 AM</span>
                  <span>—</span>
                  <span>GSTN live gateway verification performed</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-400 pl-4">↓</div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-blue-900">10:44 AM</span>
                  <span>—</span>
                  <span>PAN verification performed via CBDT API</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-400 pl-4">↓</div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-blue-900">10:45 AM</span>
                  <span>—</span>
                  <span>AI cross-verification completed (ProcureAI Matrix)</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-400 pl-4">↓</div>
                <div className="flex items-center space-x-2 text-amber-700 font-bold">
                  <span className="font-bold text-amber-800">10:45 AM</span>
                  <span>—</span>
                  <span>Discrepancy flagged: Trade name minor variation</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-400 pl-4">↓</div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-blue-900">11:02 AM</span>
                  <span>—</span>
                  <span>Officer reviewed discrepancy and verified legal entity</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-400 pl-4">↓</div>
                <div className="flex items-center space-x-2 text-green-700 font-bold">
                  <span className="font-bold text-green-800">11:05 AM</span>
                  <span>—</span>
                  <span>Official sign-off recorded in immutable audit log</span>
                </div>
              </div>
            </div>

            {/* Immutable Audit Ledger Table */}
            <div className="bg-white rounded-lg border shadow-xs overflow-hidden text-xs">
              <div className="px-5 py-3 bg-gray-50 border-b flex justify-between items-center">
                <span className="font-bold uppercase text-gray-700">{t('auditTrailTable')}</span>
                <span className="text-[10px] text-gray-500">Click any evidence hash to inspect certificate</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-100 border-b font-bold text-gray-600">
                    <tr>
                      <th className="p-3">{t('timestamp')}</th>
                      <th className="p-3">{t('check')}</th>
                      <th className="p-3">{t('source')}</th>
                      <th className="p-3">{t('result')}</th>
                      <th className="p-3">{t('evidence')}</th>
                      <th className="p-3 text-right">{t('performedBy')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="p-3 font-mono">10:42 AM</td>
                      <td>Upload Scan</td>
                      <td>GeM Gateway</td>
                      <td><span className="flex items-center gap-1 text-emerald-700 font-medium"><Check className="w-3.5 h-3.5" /> Clean</span></td>
                      <td className="p-3">
                        <button
                          onClick={() => openDocDetails('Upload Checksum', 'SHA256: 8f4a29d81b45c6a0', 'Verified Match', 'GeM Gateway')}
                          className="text-blue-700 font-mono hover:underline cursor-pointer"
                        >
                          SHA-256: 8f4a29...
                        </button>
                      </td>
                      <td className="p-3 text-right">ABC Industries</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono">10:43 AM</td>
                      <td>OCR Extraction</td>
                      <td>Vision Engine</td>
                      <td><span className="flex items-center gap-1 text-emerald-700 font-medium"><Check className="w-3.5 h-3.5" /> 99.4% Clarity</span></td>
                      <td className="p-3">
                        <button
                          onClick={() => openDocDetails('Vision OCR Mapping', 'Token-Map #901', 'High Confidence Bounding Boxes', 'Vision Engine')}
                          className="text-blue-700 font-mono hover:underline cursor-pointer"
                        >
                          Token-Map #901
                        </button>
                      </td>
                      <td className="p-3 text-right">AI Microservice</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono">10:43 AM</td>
                      <td>GST Status</td>
                      <td>GSTN API</td>
                      <td><span className="flex items-center gap-1 text-emerald-700 font-medium"><Check className="w-3.5 h-3.5" /> Active</span></td>
                      <td className="p-3">
                        <button
                          onClick={() => openDocDetails('GSTN Gateway Response', 'Receipt #88192', 'Active Regular Taxpayer Confirmed', 'GSTN Portal')}
                          className="text-blue-700 font-mono hover:underline cursor-pointer"
                        >
                          Receipt #88192
                        </button>
                      </td>
                      <td className="p-3 text-right">Automated Sync</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono">10:44 AM</td>
                      <td>PAN Verification</td>
                      <td>CBDT / NSDL</td>
                      <td><span className="flex items-center gap-1 text-emerald-700 font-medium"><Check className="w-3.5 h-3.5" /> Matched</span></td>
                      <td className="p-3">
                        <button
                          onClick={() => openDocDetails('CBDT Database Match', 'CBDT-TX #40192', 'Entity PAN Valid and Operational', 'CBDT Database')}
                          className="text-blue-700 font-mono hover:underline cursor-pointer"
                        >
                          CBDT-TX #40192
                        </button>
                      </td>
                      <td className="p-3 text-right">Automated Sync</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono">10:45 AM</td>
                      <td>Cross-Verification</td>
                      <td>ProcureAI Core</td>
                      <td><span className="flex items-center gap-1 text-emerald-700 font-medium"><Check className="w-3.5 h-3.5" /> 11/12 Parity</span></td>
                      <td className="p-3">
                        <button
                          onClick={() => openDocDetails('AI Cross-Check Matrix', 'Matrix #9012481', 'Statutory Clause Parity Verified', 'ProcureAI')}
                          className="text-blue-700 font-mono hover:underline cursor-pointer"
                        >
                          Matrix #9012481
                        </button>
                      </td>
                      <td className="p-3 text-right">AI Evaluator</td>
                    </tr>
                    <tr className="bg-amber-50/50">
                      <td className="p-3 font-mono text-amber-900 font-bold">10:45 AM</td>
                      <td>Discrepancy Flag</td>
                      <td>NLP Matcher</td>
                      <td><span className="flex items-center gap-1 text-amber-700 font-medium"><AlertTriangle className="w-3.5 h-3.5" /> Name Var</span></td>
                      <td className="p-3">
                        <button
                          onClick={() => openDocDetails('NLP Discrepancy Flag', 'Flag #DISC-1', 'Name string matched with 96% semantic distance', 'NLP Matcher')}
                          className="text-amber-800 font-mono hover:underline cursor-pointer"
                        >
                          Flag #DISC-1
                        </button>
                      </td>
                      <td className="p-3 text-right">AI Evaluator</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono">11:02 AM</td>
                      <td>Officer Review</td>
                      <td>Evaluation Desk</td>
                      <td><span className="flex items-center gap-1 text-emerald-700 font-medium"><Check className="w-3.5 h-3.5" /> Accepted</span></td>
                      <td className="p-3">
                        <button
                          onClick={() => openDocDetails('Human Officer Scrutiny', 'Review #OFF-092', 'Discrepancy resolved with Certificate of Incorporation', 'Officer Desk')}
                          className="text-blue-700 font-mono hover:underline cursor-pointer"
                        >
                          Review #OFF-092
                        </button>
                      </td>
                      <td className="p-3 text-right font-bold">Er. Rajesh Varma</td>
                    </tr>
                    <tr className="bg-green-50/40">
                      <td className="p-3 font-mono text-green-900 font-bold">11:05 AM</td>
                      <td>Final Adjudication</td>
                      <td>DSC Token Gate</td>
                      <td><span className="flex items-center gap-1 text-emerald-700 font-medium"><Check className="w-3.5 h-3.5" /> Qualified</span></td>
                      <td className="p-3">
                        <button
                          onClick={() => openDocDetails('DSC Signature Gate', 'DSC-Sign #2026', 'Signed with Class-3 Government DSC', 'Token Gate')}
                          className="text-blue-700 font-mono hover:underline cursor-pointer"
                        >
                          DSC-Sign #2026
                        </button>
                      </td>
                      <td className="p-3 text-right font-bold">Er. Rajesh Varma</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Officer Final Decision Console */}
            <div className="bg-white p-6 rounded-lg border-2 border-gray-300 shadow-xs space-y-4 text-xs">
              <div className="flex justify-between items-center border-b pb-3">
                <div>
                  <h2 className="font-bold text-sm text-gray-900 uppercase">
                    {t('finalDecision')}
                  </h2>
                  <p className="text-gray-500">
                    Er. Rajesh Varma, Executive Engineer (Procurement & Contracts), ONGC
                  </p>
                </div>
                <span className="bg-blue-900 text-white font-bold px-2 py-0.5 rounded text-[10px]">
                  Human-in-Control Architecture
                </span>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-bold text-gray-700">
                    {t('committeeRemarks')} *
                  </label>
                  <div className="flex gap-1 text-[10px]">
                    <button
                      type="button"
                      onClick={() => setOfficerNotes('All statutory documents verified. Concurred with algorithmic recommendation for qualification.')}
                      className="text-blue-700 hover:underline cursor-pointer"
                    >
                      [Preset: All Verified]
                    </button>
                    <button
                      type="button"
                      onClick={() => setOfficerNotes('Minor discrepancy noted in trade name. Clarification sought under GFR clause 14.2.')}
                      className="text-blue-700 hover:underline cursor-pointer"
                    >
                      [Preset: Clarification]
                    </button>
                  </div>
                </div>
                <textarea
                  rows={2}
                  value={officerNotes}
                  onChange={(e) => setOfficerNotes(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-600"
                  placeholder="State formal committee remarks..."
                ></textarea>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <button
                  onClick={() => handleExecuteDecision('Approve / Qualify')}
                  className="p-3 bg-green-700 hover:bg-green-800 text-white rounded font-bold shadow text-center cursor-pointer transition"
                >
                  <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5" /> {t('approveQualify')}</span>
                </button>
                <button
                  onClick={() => handleExecuteDecision('Send for Clarification')}
                  className="p-3 bg-amber-500 hover:bg-amber-600 text-white rounded font-bold shadow text-center cursor-pointer transition"
                >
                  <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {t('sendClarification')}</span>
                </button>
                <button
                  onClick={() => handleExecuteDecision('Reject / Disqualify')}
                  className="p-3 bg-red-700 hover:bg-red-800 text-white rounded font-bold shadow text-center cursor-pointer transition"
                >
                  <span className="flex items-center gap-1"><X className="w-3.5 h-3.5" /> {t('rejectDisqualify')}</span>
                </button>
              </div>

              {decisionReceipt.recorded && (
                <div className="p-4 bg-green-50 border border-green-300 rounded text-green-900 space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="font-bold">
                      Official Action Recorded: <strong>{decisionReceipt.action}</strong> | Evaluator: <strong>Er. Rajesh Varma</strong>
                    </p>
                    <button
                      onClick={handleDownloadSignedDecision}
                      className="bg-green-800 hover:bg-green-900 text-white text-[11px] font-bold px-2.5 py-1 rounded cursor-pointer transition"
                    >
                      <span className="flex items-center gap-1.5"><Download className="w-3.5 h-3.5" /> Download Decision Certificate (.txt)</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-gray-700">Remarks: &ldquo;{decisionReceipt.notes}&rdquo;</p>
                  <p className="font-mono text-[11px] text-green-700">
                    Audit Ledger Hash: {decisionReceipt.hash}
                  </p>
                </div>
              )}
            </div>
          </main>
        </div>
      )}

      {/* Document Details Modal with Live Gateway Verification */}
      {docModalData.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-5 space-y-3 shadow-xl animate-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-bold text-sm text-[#162c5b]">{docModalData.title}</h3>
              <button
                onClick={() => setDocModalData((prev) => ({ ...prev, isOpen: false }))}
                className="text-gray-400 hover:text-gray-600 cursor-pointer font-bold flex items-center justify-center p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2 text-xs">
              <div className="p-3 bg-gray-50 rounded border space-y-1.5 font-mono text-xs">
                <p>
                  <strong>ID:</strong> {docModalData.identifier}
                </p>
                <p>
                  <strong>Validity:</strong> {docModalData.validity}
                </p>
                <p>
                  <strong>Channel:</strong>{' '}
                  <span className="text-green-700 font-bold">{docModalData.source}</span>
                </p>
              </div>

              {gatewayPingResult && (
                <div className="p-2.5 bg-green-50 border border-green-200 rounded text-green-900 text-[11px] font-mono">
                  {gatewayPingResult}
                </div>
              )}
            </div>
            <div className="flex justify-between items-center pt-2 border-t text-xs">
              <button
                onClick={() => handlePingGateway(docModalData.source)}
                disabled={isPingingGateway}
                className="px-2.5 py-1 bg-blue-50 text-blue-900 hover:bg-blue-100 border border-blue-200 rounded font-bold cursor-pointer transition disabled:opacity-50"
              >
                {isPingingGateway ? 'Pinging Gateway...' : <span className="flex items-center justify-center gap-1.5"><Zap className="w-3.5 h-3.5" /> Ping Govt Gateway Live</span>}
              </button>
              <button
                onClick={() => setDocModalData((prev) => ({ ...prev, isOpen: false }))}
                className="px-3 py-1 bg-[#162c5b] hover:bg-blue-900 text-white rounded font-bold cursor-pointer"
              >
                {t('close')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Seller Bid Submission DSC Confirmation Modal */}
      {bidModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150 text-xs">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-bold text-sm text-[#162c5b]">
                <span className="flex items-center gap-2"><Lock className="w-4 h-4 text-orange-400 shrink-0" /> Digital Signature Certificate (DSC) Submission</span>
              </h3>
              <button
                onClick={() => setBidModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer font-bold flex items-center justify-center p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {!bidSubmitted ? (
              <div className="space-y-3">
                <p className="text-gray-600">
                  You are submitting bid for Tender <strong>GEM/2026/B/9012481</strong> on behalf of <strong>ABC Industries Pvt. Ltd.</strong>
                </p>
                <div className="p-3 bg-blue-50 rounded border text-[11px] space-y-1 font-mono">
                  <p>• Token: ePass2003 / ProxKey Class-3</p>
                  <p>• Signer: RAJESH K. PATEL (Director)</p>
                  <p>• Certificate Expiry: 14-Aug-2027</p>
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Enter DSC Token User PIN:
                  </label>
                  <input
                    type="password"
                    value={dscPin}
                    onChange={(e) => setDscPin(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded font-mono"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2 border-t">
                  <button
                    onClick={() => setBidModalOpen(false)}
                    className="px-3 py-1.5 border border-gray-300 rounded font-bold text-gray-700 hover:bg-gray-50 cursor-pointer"
                  >
                    {t('cancel')}
                  </button>
                  <button
                    onClick={handleConfirmBidSubmission}
                    className="px-4 py-1.5 bg-green-700 hover:bg-green-800 text-white rounded font-bold shadow cursor-pointer transition"
                  >
                    Confirm &amp; Lodge Bid
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-3 py-2">
                <CheckCircle2 className="w-10 h-10 text-green-600 mx-auto block" />
                <h4 className="font-bold text-sm text-green-900">Bid Successfully Submitted!</h4>
                <p className="text-gray-600 text-[11px]">
                  Your bid has been cryptographically locked in the GeM Tender Box. The official submission receipt has been downloaded to your computer.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setBidModalOpen(false)}
                    className="px-5 py-2 bg-[#162c5b] hover:bg-blue-900 text-white rounded font-bold cursor-pointer"
                  >
                    {t('close')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
