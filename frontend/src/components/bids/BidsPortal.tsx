import React, { useState, useEffect, useRef } from 'react';
import { api } from '../../services/api';
import type { Tender } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

export type BidsPortalTab =
  | 'ongoing'
  | 'results'
  | 'boq'
  | 'auctions'
  | 'notices'
  | 'cppp'
  | 'opportunities';

interface BidsPortalProps {
  initialTab?: BidsPortalTab;
  onOpenOfficerScrutiny: (tenderRef: string) => void;
  onOpenSellerBid: (tenderRef: string) => void;
}

interface ContractAward {
  contractNo: string;
  tenderRef: string;
  title: string;
  department: string;
  awardedTo: string;
  awardedValueLakhs: number;
  savingsLakhs: number;
  awardDate: string;
  miiPercentage: number;
}

interface ForwardAuctionItem {
  auctionId: string;
  title: string;
  department: string;
  category: string;
  startingPriceLakhs: number;
  currentBidLakhs: number;
  totalBidsPlaced: number;
  reservePriceLakhs: number;
  endTime: string;
  status: 'LIVE' | 'CLOSING_SOON' | 'SCHEDULED';
}

interface BoqItemTender {
  refNo: string;
  title: string;
  department: string;
  boqItemCount: number;
  estimatedValueLakhs: number;
  closingDate: string;
  items: Array<{ itemName: string; qty: number; unit: string; estimatedRate: number }>;
}

export const BidsPortal: React.FC<BidsPortalProps> = ({
  initialTab = 'ongoing',
  onOpenOfficerScrutiny,
  onOpenSellerBid,
}) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<BidsPortalTab>(initialTab);
  const [tenders, setTenders] = useState<Tender[]>(() => api.getInitialTenders());
  const [departmentFilter, setDepartmentFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTender, setSelectedTender] = useState<Tender | null>(null);
  const [selectedBoqTender, setSelectedBoqTender] = useState<BoqItemTender | null>(null);
  const bidsSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Auto-scroll directly to bids/tenders on screen on initial navigation
  useEffect(() => {
    const timer = setTimeout(() => {
      if (bidsSectionRef.current) {
        bidsSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 60);
    return () => clearTimeout(timer);
  }, [initialTab]);

  useEffect(() => {
    api.getTenders().then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        setTenders(data);
      }
    }).catch(() => {});
  }, []);

  const departments = [
    'All',
    'Oil and Natural Gas Corporation (ONGC)',
    'Bharat Heavy Electricals Limited (BHEL)',
    'Ministry of Defence',
    'Ministry of Railways',
    'Department of Health & Family Welfare',
  ];

  // 1. Contract Awards Mock Data (For Results Tab)
  const contractAwards: ContractAward[] = [
    {
      contractNo: 'GEMC-51168772910892',
      tenderRef: 'GEM/2026/B/9012481',
      title: 'High Pressure Flow Control Industrial Ball Valves',
      department: 'Oil and Natural Gas Corporation (ONGC)',
      awardedTo: 'ABC Industries Pvt. Ltd. (L1 Winner)',
      awardedValueLakhs: 41.2,
      savingsLakhs: 6.8,
      awardDate: '28-Feb-2026',
      miiPercentage: 58.4,
    },
    {
      contractNo: 'GEMC-51168771190281',
      tenderRef: 'GEM/2026/B/8920192',
      title: 'Medical Grade Oxygen Cylinders & Regulators',
      department: 'Department of Health & Family Welfare',
      awardedTo: 'National Cryo Gas Systems (L1 Winner)',
      awardedValueLakhs: 78.5,
      savingsLakhs: 14.2,
      awardDate: '24-Feb-2026',
      miiPercentage: 65.0,
    },
    {
      contractNo: 'GEMC-51168779910287',
      tenderRef: 'GEM/2026/B/8771920',
      title: 'Heavy Duty Railway Brake Assembly Castings',
      department: 'Ministry of Railways',
      awardedTo: 'Bharat Precision Engineering Works',
      awardedValueLakhs: 112.0,
      savingsLakhs: 18.5,
      awardDate: '19-Feb-2026',
      miiPercentage: 82.0,
    },
    {
      contractNo: 'GEMC-51168778810291',
      tenderRef: 'GEM/2026/B/8441029',
      title: 'Perimeter Surveillance & Tactical Drone Systems',
      department: 'Ministry of Defence',
      awardedTo: 'AeroDefence Robotics India Pvt. Ltd.',
      awardedValueLakhs: 215.0,
      savingsLakhs: 35.0,
      awardDate: '12-Feb-2026',
      miiPercentage: 74.0,
    },
  ];

  // 2. Forward Auction Mock Data
  const forwardAuctions: ForwardAuctionItem[] = [
    {
      auctionId: 'FA-2026-ONGC-0881',
      title: 'Disposal of Surplus Drill Pipes & Heavy Industrial Scrap (Hazira Plant)',
      department: 'Oil and Natural Gas Corporation (ONGC)',
      category: 'Metals & Industrial Scrap',
      startingPriceLakhs: 25.0,
      currentBidLakhs: 34.5,
      totalBidsPlaced: 18,
      reservePriceLakhs: 28.0,
      endTime: '02 hrs 14 mins remaining',
      status: 'LIVE',
    },
    {
      auctionId: 'FA-2026-RLY-0412',
      title: 'Auction of Decommissioned Diesel Locomotive Engines & Wheel Sets',
      department: 'Ministry of Railways',
      category: 'Locomotive Assets',
      startingPriceLakhs: 48.0,
      currentBidLakhs: 62.2,
      totalBidsPlaced: 27,
      reservePriceLakhs: 50.0,
      endTime: '45 mins remaining',
      status: 'CLOSING_SOON',
    },
    {
      auctionId: 'FA-2026-DEF-0919',
      title: 'Commercial E-Waste & Obsolete Computer Hardware Disposal',
      department: 'Ministry of Defence',
      category: 'Electronics & IT Scrap',
      startingPriceLakhs: 12.0,
      currentBidLakhs: 16.8,
      totalBidsPlaced: 14,
      reservePriceLakhs: 14.0,
      endTime: '05 hrs 30 mins remaining',
      status: 'LIVE',
    },
  ];

  // 3. Custom BOQ Tenders Data
  const boqTenders: BoqItemTender[] = [
    {
      refNo: 'GEM/2026/B/BOQ-91028',
      title: 'Turnkey Supply of High Pressure Valves, Flanges & Gaskets with Inspection Testing',
      department: 'Oil and Natural Gas Corporation (ONGC)',
      boqItemCount: 4,
      estimatedValueLakhs: 48.0,
      closingDate: '28-Mar-2026',
      items: [
        { itemName: 'Forged Steel Ball Valve 4-Inch 600#', qty: 50, unit: 'Nos', estimatedRate: 45000 },
        { itemName: 'High Pressure Needle Valves 1/2-Inch 3000#', qty: 120, unit: 'Nos', estimatedRate: 9500 },
        { itemName: 'Spiral Wound SS-316 Gaskets Class 600', qty: 300, unit: 'Nos', estimatedRate: 1800 },
        { itemName: 'Pressure Safety Relief Valves ASME Section VIII', qty: 25, unit: 'Nos', estimatedRate: 68000 },
      ],
    },
    {
      refNo: 'GEM/2026/B/BOQ-88219',
      title: 'Comprehensive IT Infrastructure BOQ: Server Racks, L3 Managed Switches & CAT6A Cabling',
      department: 'Bharat Heavy Electricals Limited (BHEL)',
      boqItemCount: 3,
      estimatedValueLakhs: 32.5,
      closingDate: '02-Apr-2026',
      items: [
        { itemName: '42U Server Rack with PDU and Cable Managers', qty: 8, unit: 'Units', estimatedRate: 65000 },
        { itemName: '48-Port Gigabit L3 Managed Core Switch', qty: 12, unit: 'Units', estimatedRate: 185000 },
        { itemName: 'CAT6A UTP Pure Copper 305m Cable Roll', qty: 45, unit: 'Rolls', estimatedRate: 14200 },
      ],
    },
  ];

  // 4. CPPP Integrated Tenders
  const cpppTenders = [
    {
      cpppId: '2026_CPPP_901828_1',
      refNo: 'GEM/CPPP/2026/901',
      title: 'Construction of Solar Rooftop Micro-Grid Power Plant (500 kWp)',
      department: 'NTPC Limited',
      portalSource: 'eProcure (CPPP) Synchronized',
      valueLakhs: 185.0,
      closingDate: '15-Apr-2026',
      type: 'Open Tender (CPPP e-Publishing)',
    },
    {
      cpppId: '2026_CPPP_881290_2',
      refNo: 'GEM/CPPP/2026/882',
      title: 'Supply and Installation of Digital Micro-Irrigation Drip Control Systems',
      department: 'Ministry of Agriculture & Farmers Welfare',
      portalSource: 'Central Public Procurement Portal',
      valueLakhs: 92.0,
      closingDate: '10-Apr-2026',
      type: 'Two-Packet System',
    },
  ];

  // 5. High-Value Business Opportunities
  const highValueOpportunities = [
    {
      oppId: 'OPP-MEGA-2026-01',
      refNo: 'GEM/2026/B/MEGA-991',
      title: 'National Turnkey Defence Communications Network & Fiber Optic Gateway (Phase IV)',
      department: 'Ministry of Defence',
      estimatedValueLakhs: 1450.0,
      miiQuota: 'Class-I Local Supplier (Min 60% MII)',
      msmeReservation: '25% Purchase Preference applicable',
      closingDate: '30-Apr-2026',
      highlight: 'National Mega-Tender',
    },
    {
      oppId: 'OPP-MEGA-2026-02',
      refNo: 'GEM/2026/B/MEGA-882',
      title: 'High Speed Railway Signaling Automata & Track Diagnostic Scanners',
      department: 'Ministry of Railways',
      estimatedValueLakhs: 820.0,
      miiQuota: 'Class-I Local Supplier (Min 70% MII)',
      msmeReservation: 'EMD Exempt for Udyam registered MSEs',
      closingDate: '22-Apr-2026',
      highlight: 'Make In India Special Focus',
    },
    {
      oppId: 'OPP-MEGA-2026-03',
      refNo: 'GEM/2026/B/MEGA-773',
      title: 'Offshore Subsea Cryogenic Flow Control & High-Pressure Gate Valving Systems',
      department: 'Oil and Natural Gas Corporation (ONGC)',
      estimatedValueLakhs: 1180.0,
      miiQuota: 'Class-I Local Supplier (Min 65% MII)',
      msmeReservation: 'Relaxation in Prior Turnover for Startups & MSEs',
      closingDate: '18-Apr-2026',
      highlight: 'PSU Critical Infrastructure',
    },
    {
      oppId: 'OPP-MEGA-2026-04',
      refNo: 'GEM/2026/B/MEGA-664',
      title: 'Supercritical Thermal Turbine Electro-Hydraulic Actuators & Control Modules',
      department: 'Bharat Heavy Electricals Limited (BHEL)',
      estimatedValueLakhs: 960.0,
      miiQuota: 'Class-I Local Supplier (Min 80% MII)',
      msmeReservation: 'Mandatory MSE Vendor Sourcing Norms',
      closingDate: '25-Apr-2026',
      highlight: 'Power Sector Strategic Asset',
    },
    {
      oppId: 'OPP-MEGA-2026-05',
      refNo: 'GEM/2026/B/MEGA-555',
      title: 'Pan-India Medical Grade Oxygen Grid, Cryogenic Storage & ICU Life-Support Systems',
      department: 'Department of Health & Family Welfare',
      estimatedValueLakhs: 680.0,
      miiQuota: 'Class-I Local Supplier (Min 75% MII)',
      msmeReservation: 'EMD Waiver and Tender Fee Exemption for MSEs',
      closingDate: '29-Apr-2026',
      highlight: 'Healthcare Mission Project',
    },
    {
      oppId: 'OPP-MEGA-2026-06',
      refNo: 'GEM/2026/B/MEGA-446',
      title: 'Naval Surface & Submarine Hydraulic Fluid Valving and Marine Propulsion Seals',
      department: 'Ministry of Defence',
      estimatedValueLakhs: 1290.0,
      miiQuota: 'Class-I Local Supplier (Min 85% MII)',
      msmeReservation: 'Security Clearance & Strict GFR 144(xi) Verification',
      closingDate: '04-May-2026',
      highlight: 'Defence Indigenisation Focus',
    },
  ];

  // Defensive array safeguards and dynamic multi-tab filters
  const safeTenders = Array.isArray(tenders) && tenders.length > 0 ? tenders : api.getInitialTenders();
  const filteredTenders = safeTenders.filter((t) => {
    if (!t) return false;
    if (departmentFilter !== 'All' && !t.department?.includes(departmentFilter)) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase().trim();
      return (
        (t.ref_no || '').toLowerCase().includes(q) ||
        (t.title || '').toLowerCase().includes(q) ||
        (t.department || '').toLowerCase().includes(q) ||
        (t.category || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  const safeOpportunities = Array.isArray(highValueOpportunities) ? highValueOpportunities : [];
  const filteredOpportunities = safeOpportunities.filter((opp) => {
    if (!opp) return false;
    if (departmentFilter !== 'All' && !opp.department?.includes(departmentFilter)) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase().trim();
      return (
        (opp.refNo || '').toLowerCase().includes(q) ||
        (opp.title || '').toLowerCase().includes(q) ||
        (opp.department || '').toLowerCase().includes(q) ||
        (opp.miiQuota || '').toLowerCase().includes(q) ||
        (opp.highlight || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  const safeAwards = Array.isArray(contractAwards) ? contractAwards : [];
  const filteredAwards = safeAwards.filter((award) => {
    if (!award) return false;
    if (departmentFilter !== 'All' && !award.department?.includes(departmentFilter)) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase().trim();
      return (
        (award.contractNo || '').toLowerCase().includes(q) ||
        (award.tenderRef || '').toLowerCase().includes(q) ||
        (award.title || '').toLowerCase().includes(q) ||
        (award.department || '').toLowerCase().includes(q) ||
        (award.awardedTo || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  const safeBoq = Array.isArray(boqTenders) ? boqTenders : [];
  const filteredBoqTenders = safeBoq.filter((b) => {
    if (!b) return false;
    if (departmentFilter !== 'All' && !b.department?.includes(departmentFilter)) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase().trim();
      return (
        (b.refNo || '').toLowerCase().includes(q) ||
        (b.title || '').toLowerCase().includes(q) ||
        (b.department || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  const safeAuctions = Array.isArray(forwardAuctions) ? forwardAuctions : [];
  const filteredAuctions = safeAuctions.filter((a) => {
    if (!a) return false;
    if (departmentFilter !== 'All' && !a.department?.includes(departmentFilter)) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase().trim();
      return (
        (a.auctionId || '').toLowerCase().includes(q) ||
        (a.title || '').toLowerCase().includes(q) ||
        (a.department || '').toLowerCase().includes(q) ||
        (a.category || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  const safeCppp = Array.isArray(cpppTenders) ? cpppTenders : [];
  const filteredCppp = safeCppp.filter((c) => {
    if (!c) return false;
    if (departmentFilter !== 'All' && !c.department?.includes(departmentFilter)) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase().trim();
      return (
        (c.cpppId || '').toLowerCase().includes(q) ||
        (c.refNo || '').toLowerCase().includes(q) ||
        (c.title || '').toLowerCase().includes(q) ||
        (c.department || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="flex-1 flex flex-col bg-[#f4f6f9]">
      {/* Top Banner with GeM Bid Plus Branding */}
      <div className="bg-[#061a26] text-white py-3 px-4 sm:px-6 shadow-sm border-b-2 border-yellow-400">
        <div className="max-w-7xl mx-auto space-y-1.5">
          <div className="flex items-center space-x-2 text-xs text-gray-400">
            <span>GeM Portal</span>
            <span>&gt;</span>
            <span className="text-yellow-400 font-bold">GeM Bid Plus Portal</span>
            <span>&gt;</span>
            <span className="text-white capitalize">
              {activeTab === 'ongoing' && 'Ongoing Bids & Reverse Auctions'}
              {activeTab === 'results' && 'Bid / RA Results & Contract Awards'}
              {activeTab === 'boq' && 'Custom Bids & BOQ Items'}
              {activeTab === 'auctions' && 'Live Forward Auctions'}
              {activeTab === 'notices' && 'Auction Notices & Schedules'}
              {activeTab === 'cppp' && 'CPPP Integrated Public Tenders'}
              {activeTab === 'opportunities' && 'High-Value Business Opportunities'}
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black tracking-tight text-white">
                  GeM Bid Plus — {activeTab === 'ongoing' && 'Active Tenders & RA'}
                  {activeTab === 'results' && 'Contract Awards & L1 Results'}
                  {activeTab === 'boq' && 'Custom Bids & BOQ Packages'}
                  {activeTab === 'auctions' && 'Live Forward Auctions'}
                  {activeTab === 'notices' && 'Auction Notices & Schedules'}
                  {activeTab === 'cppp' && 'CPPP eProcurement Gateway'}
                  {activeTab === 'opportunities' && 'High-Value Business Opportunities'}
                </h1>
                <span className="bg-yellow-400 text-blue-950 text-[10px] font-black px-2 py-0.5 rounded">
                  OFFICIAL
                </span>
              </div>
              <p className="text-[11px] text-gray-300 mt-0.5">
                Central & State Government Public Procurement Tenders with integrated automated statutory scrutiny.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="bg-emerald-900/80 text-emerald-300 border border-emerald-700 px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                AI Statutory Scrutiny Engine Active
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container - Auto-scrolled to open bids directly on screen */}
      <div
        ref={bidsSectionRef}
        className="max-w-7xl mx-auto px-4 sm:px-6 pt-3 pb-6 flex-1 w-full space-y-4 scroll-mt-14"
      >
        {/* Dedicated 7-Tab Navigation Bar with Smooth Transitions */}
        <div className="bg-white rounded-2xl p-2 shadow-xs border border-gray-200 overflow-x-auto">
          <div className="flex items-center space-x-1.5 min-w-max">
            <button
              onClick={() => setActiveTab('ongoing')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 active:scale-95 cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'ongoing'
                  ? 'bg-[#062134] text-white shadow-xs scale-[1.02]'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <span>📑</span>
              <span>Ongoing Bids / RA</span>
              <span className="bg-amber-400 text-blue-950 text-[9px] px-1.5 py-0.2 rounded-full font-black ml-1">
                LIVE
              </span>
            </button>

            <button
              onClick={() => setActiveTab('results')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 active:scale-95 cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'results'
                  ? 'bg-[#062134] text-white shadow-xs scale-[1.02]'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <span>📊</span>
              <span>Bid / RA Results</span>
              <span className="bg-emerald-100 text-emerald-800 text-[9px] px-1.5 py-0.2 rounded-full font-bold ml-1">
                Awards
              </span>
            </button>

            <button
              onClick={() => setActiveTab('boq')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 active:scale-95 cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'boq'
                  ? 'bg-[#062134] text-white shadow-xs scale-[1.02]'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <span>📦</span>
              <span>Custom Bids & BOQ</span>
            </button>

            <button
              onClick={() => setActiveTab('auctions')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 active:scale-95 cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'auctions'
                  ? 'bg-[#062134] text-white shadow-xs scale-[1.02]'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <span>🔨</span>
              <span>Live Forward Auctions</span>
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse ml-1"></span>
            </button>

            <button
              onClick={() => setActiveTab('notices')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 active:scale-95 cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'notices'
                  ? 'bg-[#062134] text-white shadow-xs scale-[1.02]'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <span>📋</span>
              <span>Auction Notices & Schedules</span>
            </button>

            <button
              onClick={() => setActiveTab('cppp')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 active:scale-95 cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'cppp'
                  ? 'bg-[#062134] text-white shadow-xs scale-[1.02]'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <span>🌐</span>
              <span>CPPP Integrated Tenders</span>
            </button>

            <button
              onClick={() => setActiveTab('opportunities')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 active:scale-95 cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'opportunities'
                  ? 'bg-[#f37021] text-white shadow-xs font-black scale-[1.02]'
                  : 'text-orange-700 bg-orange-50 hover:bg-orange-100'
              }`}
            >
              <span>⭐</span>
              <span>Business Opportunities</span>
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-gray-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex-1 min-w-[280px]">
            <div className="relative flex items-center bg-gray-50 rounded-xl border border-gray-300 px-3 py-2">
              <span className="text-gray-400 mr-2">🔍</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search bids by ref no, title, department, or keyword..."
                className="w-full text-xs text-gray-800 bg-transparent focus:outline-none placeholder-gray-400"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-gray-600">Department:</span>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="bg-gray-50 border border-gray-300 px-3 py-2 rounded-xl text-xs font-semibold text-gray-800 focus:outline-none cursor-pointer"
            >
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tab Panels Container with Smooth Tab Transition */}
        <div key={activeTab} className="tab-content-enter space-y-4">
          {/* ================= TAB 1: ONGOING BIDS / RA ================= */}
          {activeTab === 'ongoing' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-gray-500 font-semibold px-1">
              <p>Showing {filteredTenders.length} Active Public Tenders & Reverse Auctions</p>
              <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                ✓ Connected to GSTN & Income Tax Registries
              </span>
            </div>

            {filteredTenders.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border space-y-3">
                <span className="text-4xl">📋</span>
                <h3 className="text-base font-bold text-gray-800">No matching tenders found</h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  Please try clearing your search query or switching the department filter to All.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTenders.map((t) => (
                  <div
                    key={t.id}
                    className="bg-white rounded-2xl border border-gray-200 shadow-xs hover:border-blue-400 hover:shadow-md transition p-5 sm:p-6 space-y-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3 border-b pb-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-blue-900 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                            {t.ref_no}
                          </span>
                          <span className="bg-amber-100 text-amber-900 text-[10px] font-extrabold px-2 py-0.5 rounded">
                            {t.status}
                          </span>
                          <span className="text-[10px] text-gray-400 uppercase font-bold">
                            {t.category}
                          </span>
                        </div>
                        <h3 className="text-base font-black text-[#162c5b]">{t.title}</h3>
                        <p className="text-xs text-gray-600 flex items-center gap-1.5 font-medium">
                          <span>🏛️ Department:</span>
                          <span className="font-bold text-gray-800">{t.department}</span>
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-gray-400 uppercase font-bold">Estimated Tender Value</span>
                        <p className="text-xl font-black text-[#162c5b]">
                          ₹{t.estimated_value_lakhs.toFixed(2)} Lakhs
                        </p>
                        <p className="text-[10px] text-gray-500">Closing: {t.closing_date}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100 text-xs">
                      <div>
                        <span className="text-[10px] text-gray-400 uppercase font-bold">EMD Deposit</span>
                        <p className="font-bold text-gray-800 mt-0.5">₹{t.emd_amount_lakhs} Lakhs</p>
                        <span className="text-[9px] text-emerald-700 font-semibold">MSME Exempt</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 uppercase font-bold">Min Turnover</span>
                        <p className="font-bold text-gray-800 mt-0.5">₹{t.min_turnover_lakhs} Lakhs / yr</p>
                        <span className="text-[9px] text-gray-500">Last 3 Years Avg</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 uppercase font-bold">Make in India (MII)</span>
                        <p className="font-bold text-emerald-700 mt-0.5">{t.min_mii_percentage}% Min Local</p>
                        <span className="text-[9px] text-gray-500">Class-I Priority</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 uppercase font-bold">Bid Evaluation</span>
                        <p className="font-bold text-blue-900 mt-0.5">Two-Packet System</p>
                        <span className="text-[9px] text-gray-500">Technical + Financial</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                      <button
                        onClick={() => setSelectedTender(t)}
                        className="text-xs text-blue-900 hover:text-blue-950 font-bold underline cursor-pointer"
                      >
                        View Tender Specification Document & BOQ 📄
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onOpenSellerBid(t.ref_no)}
                          className="bg-white hover:bg-orange-50 border border-orange-400 text-orange-700 font-bold text-xs px-4 py-2 rounded-lg transition cursor-pointer"
                        >
                          🏢 Prepare Seller Bid & Check Readiness
                        </button>
                        <button
                          onClick={() => onOpenOfficerScrutiny(t.ref_no)}
                          className="bg-gradient-to-r from-[#162c5b] to-[#082435] hover:brightness-110 text-white font-extrabold text-xs px-5 py-2 rounded-lg shadow transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <span>⚡</span>
                          <span>AI Scrutiny Desk (Officer Console) &gt;</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 2: BID / RA RESULTS & CONTRACT AWARDS ================= */}
        {activeTab === 'results' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-gray-500 font-semibold px-1">
              <p>Showing Officially Awarded GeM Contracts & L1 Bid Evaluation Summaries</p>
              <span className="text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                GFR Rule 149 Compliant Contract Orders
              </span>
            </div>

            <div className="space-y-4">
              {filteredAwards.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 space-y-3">
                  <span className="text-4xl">📊</span>
                  <h3 className="text-base font-bold text-gray-800">No matching contract awards found</h3>
                  <p className="text-xs text-gray-500 max-w-sm mx-auto">
                    Please try clearing your search query or switching the department filter to All.
                  </p>
                </div>
              ) : (
                filteredAwards.map((award) => (
                  <div
                    key={award.contractNo}
                    className="bg-white rounded-2xl border border-gray-200 shadow-xs p-5 sm:p-6 space-y-4 hover:border-emerald-400 transition"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3 border-b pb-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-black text-emerald-900 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-300">
                            {award.contractNo}
                          </span>
                          <span className="bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded">
                            AWARDED
                          </span>
                          <span className="text-[10px] text-gray-400 font-mono">
                            Ref: {award.tenderRef}
                          </span>
                        </div>
                        <h3 className="text-base font-black text-gray-900">{award.title}</h3>
                        <p className="text-xs text-gray-600">
                          🏛️ Purchasing Entity: <strong className="text-gray-800">{award.department}</strong>
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-gray-400 uppercase font-bold">Award Contract Value</span>
                        <p className="text-xl font-black text-emerald-700">
                          ₹{award.awardedValueLakhs.toFixed(2)} Lakhs
                        </p>
                        <p className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded inline-block mt-0.5">
                          Saved ₹{award.savingsLakhs} Lakhs vs Estimate
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100 text-xs">
                      <div>
                        <span className="text-[10px] text-gray-400 uppercase font-bold">Awarded Vendor</span>
                        <p className="font-bold text-[#162c5b] mt-0.5">{award.awardedTo}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 uppercase font-bold">Award Date</span>
                        <p className="font-bold text-gray-800 mt-0.5">{award.awardDate}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 uppercase font-bold">Verified Local Content</span>
                        <p className="font-bold text-emerald-700 mt-0.5">{award.miiPercentage}% (Class-I)</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-gray-500 font-mono">
                        Immutable SHA-256 Ledger Record Verified
                      </span>
                      <button
                        onClick={() => onOpenOfficerScrutiny(award.tenderRef)}
                        className="text-xs text-blue-900 font-bold hover:underline cursor-pointer"
                      >
                        View Bid Evaluation Matrix & Audit Ledger &gt;
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ================= TAB 3: CUSTOM BIDS & BOQ ITEMS ================= */}
        {activeTab === 'boq' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-gray-500 font-semibold px-1">
              <p>Showing Custom Bids with Itemized Bills of Quantities (BOQ)</p>
              <span className="text-orange-800 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                Itemized Price Schedule Supported
              </span>
            </div>

            <div className="space-y-4">
              {filteredBoqTenders.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 space-y-3">
                  <span className="text-4xl">📦</span>
                  <h3 className="text-base font-bold text-gray-800">No matching custom BOQ bids found</h3>
                  <p className="text-xs text-gray-500 max-w-sm mx-auto">
                    Please try clearing your search query or switching the department filter to All.
                  </p>
                </div>
              ) : (
                filteredBoqTenders.map((b) => (
                  <div
                    key={b.refNo}
                    className="bg-white rounded-2xl border border-gray-200 shadow-xs p-5 sm:p-6 space-y-4 hover:border-orange-400 transition"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3 border-b pb-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-black text-orange-950 bg-orange-50 px-2.5 py-0.5 rounded border border-orange-200">
                            {b.refNo}
                          </span>
                          <span className="bg-orange-600 text-white text-[10px] font-black px-2 py-0.5 rounded">
                            CUSTOM BOQ
                          </span>
                          <span className="text-xs text-gray-500">
                            {b.boqItemCount} Itemized Schedule Lines
                          </span>
                        </div>
                        <h3 className="text-base font-black text-gray-900">{b.title}</h3>
                        <p className="text-xs text-gray-600">
                          🏛️ Department: <strong className="text-gray-800">{b.department}</strong>
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-gray-400 uppercase font-bold">Total Estimated Value</span>
                        <p className="text-xl font-black text-orange-950">
                          ₹{b.estimatedValueLakhs.toFixed(2)} Lakhs
                        </p>
                        <p className="text-[10px] text-gray-500">Closing: {b.closingDate}</p>
                      </div>
                    </div>

                    {/* BOQ Items Preview Table */}
                    <div className="border border-gray-200 rounded-xl overflow-hidden text-xs">
                      <div className="bg-gray-100 px-3 py-1.5 font-bold text-gray-700 grid grid-cols-12">
                        <div className="col-span-6">BOQ Item Description</div>
                        <div className="col-span-3 text-right">Quantity</div>
                        <div className="col-span-3 text-right">Unit Estimate</div>
                      </div>
                      {b.items.map((item, idx) => (
                        <div key={idx} className="px-3 py-2 border-t grid grid-cols-12 hover:bg-gray-50">
                          <div className="col-span-6 font-semibold text-gray-800">{item.itemName}</div>
                          <div className="col-span-3 text-right text-gray-600 font-mono">
                            {item.qty} {item.unit}
                          </div>
                          <div className="col-span-3 text-right font-black text-blue-950 font-mono">
                            ₹{item.estimatedRate.toLocaleString('en-IN')}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-1">
                      <button
                        onClick={() => onOpenSellerBid(b.refNo)}
                        className="bg-[#f37021] hover:bg-[#e05e10] text-white font-bold text-xs px-4 py-2 rounded-lg shadow transition cursor-pointer"
                      >
                        Fill BOQ Schedule & Bid &gt;
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ================= TAB 4: LIVE FORWARD AUCTIONS ================= */}
        {activeTab === 'auctions' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-gray-500 font-semibold px-1">
              <p>Showing Live Government Asset Monetization & Forward e-Auctions</p>
              <span className="text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200 font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                Incremental Bidding Live
              </span>
            </div>

            <div className="space-y-4">
              {filteredAuctions.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 space-y-3">
                  <span className="text-4xl">🔨</span>
                  <h3 className="text-base font-bold text-gray-800">No matching forward auctions found</h3>
                  <p className="text-xs text-gray-500 max-w-sm mx-auto">
                    Please try clearing your search query or switching the department filter to All.
                  </p>
                </div>
              ) : (
                filteredAuctions.map((f) => (
                  <div
                    key={f.auctionId}
                    className="bg-white rounded-2xl border-2 border-amber-200 shadow-xs p-5 sm:p-6 space-y-4 hover:border-amber-400 transition"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3 border-b pb-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-black text-amber-950 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200">
                            {f.auctionId}
                          </span>
                          <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded flex items-center gap-1">
                            <span>🔨</span>
                            <span>{f.status}</span>
                          </span>
                          <span className="text-[10px] text-gray-400 uppercase font-bold">
                            {f.category}
                          </span>
                        </div>
                        <h3 className="text-base font-black text-gray-900">{f.title}</h3>
                        <p className="text-xs text-gray-600">
                          Disposal Organization: <strong className="text-gray-800">{f.department}</strong>
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-gray-400 uppercase font-bold">Current Highest Bid</span>
                        <p className="text-2xl font-black text-emerald-700">
                          ₹{f.currentBidLakhs.toFixed(2)} Lakhs
                        </p>
                        <p className="text-[10px] font-bold text-red-600 mt-0.5">
                          ⏳ {f.endTime}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-amber-50/50 p-3 rounded-xl border border-amber-100 text-xs">
                      <div>
                        <span className="text-[10px] text-gray-500 uppercase font-bold">Starting Price</span>
                        <p className="font-bold text-gray-800 mt-0.5">₹{f.startingPriceLakhs} Lakhs</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-500 uppercase font-bold">Reserve Price</span>
                        <p className="font-bold text-emerald-800 mt-0.5">₹{f.reservePriceLakhs} Lakhs (Met)</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-500 uppercase font-bold">Bids Logged</span>
                        <p className="font-bold text-blue-900 mt-0.5">{f.totalBidsPlaced} Competitive Bids</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-500 uppercase font-bold">Min Increment</span>
                        <p className="font-bold text-gray-800 mt-0.5">₹25,000 / round</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs text-gray-500">
                        EMD Deposit Verified via GeM Escrow
                      </span>
                      <button
                        onClick={() => onOpenOfficerScrutiny(f.auctionId)}
                        className="bg-gradient-to-r from-amber-600 to-orange-600 hover:brightness-110 text-white font-bold text-xs px-4 py-2 rounded-lg shadow transition cursor-pointer"
                      >
                        Enter Forward Auction Floor &gt;
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ================= TAB 5: AUCTION NOTICES & SCHEDULES ================= */}
        {activeTab === 'notices' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-gray-500 font-semibold px-1">
              <p>Showing Official Government e-Auction Notices & Inspection Windows</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
              <h3 className="font-extrabold text-sm text-[#0c2340]">
                Upcoming Forward Auction Calendar (March - April 2026)
              </h3>
              <div className="divide-y text-xs">
                {[
                  {
                    code: 'AN-2026-091',
                    entity: 'Western Railway Stores Depot, Mumbai',
                    asset: 'Surplus Unserviceable Rails & Track Turnouts (approx 1,200 MT)',
                    inspectionDate: '15-Mar to 22-Mar-2026',
                    auctionDate: '26-Mar-2026 11:00 AM',
                  },
                  {
                    code: 'AN-2026-092',
                    entity: 'Directorate of Enforcement (ED), New Delhi',
                    asset: 'Commercial High-Value Luxury Vehicles (e-Auction Lot #4)',
                    inspectionDate: '18-Mar to 25-Mar-2026',
                    auctionDate: '30-Mar-2026 02:00 PM',
                  },
                  {
                    code: 'AN-2026-093',
                    entity: 'Defence Research and Development Organisation (DRDO)',
                    asset: 'Decommissioned Laboratory Testing Equipment & Chillers',
                    inspectionDate: '20-Mar to 28-Mar-2026',
                    auctionDate: '05-Apr-2026 10:30 AM',
                  },
                ].map((notice) => (
                  <div key={notice.code} className="py-3 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <span className="font-mono font-bold text-blue-900">{notice.code}</span>
                      <p className="font-bold text-gray-900 mt-0.5">{notice.asset}</p>
                      <p className="text-gray-500 text-[11px]">{notice.entity}</p>
                    </div>
                    <div className="text-right text-[11px]">
                      <p className="text-gray-500">Inspection: {notice.inspectionDate}</p>
                      <p className="font-bold text-orange-700">Auction: {notice.auctionDate}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 6: CPPP INTEGRATED TENDERS ================= */}
        {activeTab === 'cppp' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-gray-500 font-semibold px-1">
              <p>Showing {filteredCppp.length} Tenders Synchronized from Central Public Procurement Portal (eprocure.gov.in)</p>
              <span className="text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                CPPP e-Publishing API Active
              </span>
            </div>

            <div className="space-y-4">
              {filteredCppp.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 space-y-3">
                  <span className="text-4xl">🌐</span>
                  <h3 className="text-base font-bold text-gray-800">No matching CPPP tenders found</h3>
                  <p className="text-xs text-gray-500 max-w-sm mx-auto">
                    Please try clearing your search query or switching the department filter to All.
                  </p>
                </div>
              ) : (
                filteredCppp.map((c) => (
                  <div
                    key={c.cpppId}
                    className="bg-white rounded-2xl border border-blue-200 shadow-xs p-5 sm:p-6 space-y-4 hover:border-blue-400 transition"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3 border-b pb-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-black text-blue-950 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                            {c.cpppId}
                          </span>
                          <span className="bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded">
                            CPPP SYNC
                          </span>
                          <span className="text-xs text-gray-500">{c.type}</span>
                        </div>
                        <h3 className="text-base font-black text-gray-900">{c.title}</h3>
                        <p className="text-xs text-gray-600">
                          Department: <strong className="text-gray-800">{c.department}</strong>
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-gray-400 uppercase font-bold">Tender Estimate</span>
                        <p className="text-xl font-black text-blue-950">₹{c.valueLakhs} Lakhs</p>
                        <p className="text-[10px] text-gray-500">Closing: {c.closingDate}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs text-gray-500 font-medium">
                        Gateway Source: {c.portalSource}
                      </span>
                      <button
                        onClick={() => onOpenSellerBid(c.refNo)}
                        className="bg-blue-950 hover:bg-blue-900 text-white font-bold text-xs px-4 py-2 rounded-lg transition cursor-pointer"
                      >
                        View CPPP Specification & Bid &gt;
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ================= TAB 7: HIGH-VALUE BUSINESS OPPORTUNITIES ================= */}
        {activeTab === 'opportunities' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between text-xs text-gray-500 font-semibold px-1 gap-2">
              <p>Showing {filteredOpportunities.length} High-Value Institutional Procurement Opportunities & Make in India Reserved Tenders</p>
              <span className="text-orange-900 bg-orange-100 font-bold px-2 py-0.5 rounded border border-orange-200">
                ⭐ Tier-1 Mega Opportunities (&gt; ₹500 Lakhs)
              </span>
            </div>

            <div className="space-y-4">
              {filteredOpportunities.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-orange-200 space-y-3">
                  <span className="text-4xl">⭐</span>
                  <h3 className="text-base font-bold text-gray-800">No matching business opportunities found</h3>
                  <p className="text-xs text-gray-500 max-w-sm mx-auto">
                    Please try clearing your search query or switching the department filter to All.
                  </p>
                </div>
              ) : (
                filteredOpportunities.map((opp) => (
                  <div
                    key={opp.oppId}
                    className="bg-gradient-to-r from-orange-50/70 via-white to-white rounded-2xl border-2 border-orange-300 shadow-sm p-5 sm:p-6 space-y-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3 border-b border-orange-100 pb-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-black text-orange-900 bg-orange-100 px-2.5 py-0.5 rounded">
                            {opp.refNo}
                          </span>
                          <span className="bg-gradient-to-r from-orange-600 to-amber-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-xs">
                            {opp.highlight}
                          </span>
                        </div>
                        <h3 className="text-base font-black text-gray-900">{opp.title}</h3>
                        <p className="text-xs text-gray-600">
                          Entity: <strong className="text-gray-800">{opp.department}</strong>
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-gray-400 uppercase font-bold">Estimated Contract Size</span>
                        <p className="text-2xl font-black text-orange-900">
                          ₹{(opp.estimatedValueLakhs / 100).toFixed(2)} Crore
                        </p>
                        <p className="text-[10px] text-gray-500">Closing: {opp.closingDate}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-3 rounded-xl border border-orange-200 text-xs">
                      <div>
                        <span className="text-[10px] text-gray-400 uppercase font-bold">Make In India Quota</span>
                        <p className="font-bold text-emerald-700 mt-0.5">{opp.miiQuota}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 uppercase font-bold">MSME Policy Privilege</span>
                        <p className="font-bold text-blue-900 mt-0.5">{opp.msmeReservation}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs text-gray-500">
                        Mandatory Pre-Qualification Technical Scrutiny Active
                      </span>
                      <button
                        onClick={() => onOpenSellerBid(opp.refNo)}
                        className="bg-gradient-to-r from-[#f37021] to-[#d35400] text-white font-extrabold text-xs px-5 py-2 rounded-lg shadow transition hover:brightness-110 cursor-pointer"
                      >
                        Check Eligibility & Express Interest &gt;
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
        </div>
      </div>

      {/* Tender Details & BOQ Modal */}
      {selectedTender && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border max-w-3xl w-full my-8 overflow-hidden">
            <div className="bg-[#082435] text-white p-5 flex items-center justify-between border-b-2 border-yellow-400">
              <div>
                <span className="text-[10px] font-black uppercase text-yellow-400 tracking-wider">
                  Tender Information & Statutory Compliance Schedule
                </span>
                <h3 className="text-base font-extrabold">{selectedTender.title}</h3>
                <p className="text-[11px] text-gray-300 font-mono">Ref: {selectedTender.ref_no}</p>
              </div>
              <button
                onClick={() => setSelectedTender(null)}
                className="text-gray-300 hover:text-white text-xl font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-5 text-xs">
              <div className="space-y-2">
                <h4 className="font-extrabold text-xs text-[#162c5b] uppercase tracking-wide">
                  1. Statutory Eligibility Checklist (SIH26100 Verification Rules)
                </h4>
                <div className="bg-gray-50 rounded-xl p-4 border space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span><strong>GSTIN Requirement:</strong> Valid Regular GSTIN registered in India with up-to-date GSTR-3B filings.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span><strong>Income Tax PAN:</strong> Permanent Account Number linked with GSTIN entity.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span><strong>Udyam Registration:</strong> Required for EMD waiver and purchase preference under Public Procurement Policy.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span><strong>Make in India:</strong> Minimum {selectedTender.min_mii_percentage}% local value addition verified through Self/CA certificate.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span><strong>GFR Rule 144(xi):</strong> Full land border sharing compliance and non-debarment confirmation.</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-extrabold text-xs text-[#162c5b] uppercase tracking-wide">
                  2. Bill of Quantities (BOQ) & Financial Envelope
                </h4>
                <div className="bg-gray-50 rounded-xl p-3 border space-y-1">
                  <div className="flex justify-between py-1 border-b">
                    <span>Estimated Contract Value:</span>
                    <span className="font-black text-gray-900">₹{selectedTender.estimated_value_lakhs} Lakhs</span>
                  </div>
                  <div className="flex justify-between py-1 border-b">
                    <span>Earnest Money Deposit (EMD):</span>
                    <span className="font-bold text-gray-900">₹{selectedTender.emd_amount_lakhs} Lakhs (Exempt for MSME)</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Minimum Turnover Requirement:</span>
                    <span className="font-bold text-gray-900">₹{selectedTender.min_turnover_lakhs} Lakhs</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t">
                <button
                  onClick={() => setSelectedTender(null)}
                  className="px-4 py-2 text-gray-600 font-bold hover:bg-gray-100 rounded-lg cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    const ref = selectedTender.ref_no;
                    setSelectedTender(null);
                    onOpenOfficerScrutiny(ref);
                  }}
                  className="bg-blue-950 text-white px-5 py-2 rounded-lg font-bold shadow hover:bg-blue-900 transition cursor-pointer"
                >
                  ⚡ Run Automated Scrutiny &gt;
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
