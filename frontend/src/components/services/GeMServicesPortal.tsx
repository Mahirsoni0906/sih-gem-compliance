import React, { useState, useEffect, useRef } from 'react';
import { OFFICIAL_GEM_SERVICES, CORE_SERVICE_DOMAINS, type GeMService } from '../../data/gemServicesData';

interface GeMServicesPortalProps {
  initialQuery?: string;
  initialDomain?: string;
  onClose?: () => void;
  onSelectServiceForBids?: (serviceName: string) => void;
  onRunComplianceCheck?: (service: GeMService) => void;
}

export const GeMServicesPortal: React.FC<GeMServicesPortalProps> = ({
  initialQuery = '',
  initialDomain = 'All Services',
  onClose,
  onSelectServiceForBids,
  onRunComplianceCheck,
}) => {
  const [activeTab, setActiveTab] = useState<'ALL' | 'TRENDING' | 'EMERGING'>('ALL');
  const [selectedDomain, setSelectedDomain] = useState<string>(initialDomain);
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery);
  const [inspectedService, setInspectedService] = useState<GeMService | null>(null);
  const servicesSectionRef = useRef<HTMLDivElement>(null);

  // Auto-scroll directly to services items on screen
  useEffect(() => {
    const timer = setTimeout(() => {
      if (servicesSectionRef.current) {
        servicesSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 60);
    return () => clearTimeout(timer);
  }, [initialQuery, activeTab, selectedDomain]);

  // Filter services based on activeTab, selectedDomain, and searchQuery
  const filteredServices = OFFICIAL_GEM_SERVICES.filter((serv) => {
    if (activeTab === 'TRENDING' && serv.category !== 'Trending') return false;
    if (activeTab === 'EMERGING' && serv.category !== 'Emerging') return false;
    if (selectedDomain !== 'All Services' && serv.domain !== selectedDomain) return false;

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchTitle = serv.title.toLowerCase().includes(q);
      const matchSub = serv.subTitle.toLowerCase().includes(q);
      const matchDomain = serv.domain.toLowerCase().includes(q);
      const matchBilling = serv.billingModel.toLowerCase().includes(q);
      const matchReq = serv.statutoryRequirements.some((r) => r.toLowerCase().includes(q));
      return matchTitle || matchSub || matchDomain || matchBilling || matchReq;
    }
    return true;
  });

  return (
    <div className="bg-[#f4f6f9] min-h-screen flex flex-col font-sans antialiased text-gray-800">
      {/* Top Breadcrumb & Actions Bar */}
      <header className="bg-[#0c2340] text-white px-4 sm:px-8 py-3 border-b border-blue-900/60 z-10 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <span className="bg-[#f37021] text-white font-black text-base px-2 py-0.5 rounded shadow-xs">
              GeM
            </span>
            <div>
              <h1 className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
                <span>Official Services Catalog & Directory</span>
                <span className="text-xs bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded-full border border-amber-500/30">
                  Live gem.gov.in Directory
                </span>
              </h1>
              <p className="text-[11px] text-blue-200">
                National Public Procurement Portal • All 30 Statutory Regulated Services
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {onClose && (
              <button
                onClick={onClose}
                className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded transition cursor-pointer flex items-center gap-1.5 border border-white/20"
              >
                <span>✕</span>
                <span>Back to Home</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Banner with Official GeM Context */}
      <section className="bg-gradient-to-r from-[#155998] via-[#104374] to-[#0c2340] text-white py-4 px-4 sm:px-8 border-b border-blue-900 shadow-inner">
        <div className="max-w-7xl mx-auto space-y-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#f37021] bg-white/10 px-2 py-0.5 rounded-full inline-block mb-1">
                Department of Commerce • Ministry of Commerce and Industry
              </span>
              <h2 className="text-xl sm:text-2xl font-black leading-tight">
                Statutory Service Procurement Directory
              </h2>
              <p className="text-xs text-blue-100 max-w-2xl mt-0.5">
                Browse official service specifications, standardized billing models, and statutory compliance criteria (Minimum Wages, PSARA, FSSAI, DGCA).
              </p>
            </div>

            {/* Quick KPI stats */}
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md p-2 rounded-xl border border-white/15 text-xs">
              <div className="text-center px-2">
                <span className="text-lg font-black text-amber-400">20</span>
                <p className="text-[9px] text-blue-200 font-semibold uppercase">Trending</p>
              </div>
              <div className="h-6 w-px bg-white/20"></div>
              <div className="text-center px-2">
                <span className="text-lg font-black text-emerald-400">10</span>
                <p className="text-[9px] text-blue-200 font-semibold uppercase">Emerging</p>
              </div>
              <div className="h-6 w-px bg-white/20"></div>
              <div className="text-center px-2">
                <span className="text-lg font-black text-cyan-300">100%</span>
                <p className="text-[9px] text-blue-200 font-semibold uppercase">GFR Compliant</p>
              </div>
            </div>
          </div>

          {/* Search Bar inside Hero */}
          <div>
            <div className="relative max-w-2xl bg-white rounded-full shadow-md flex items-center p-1 border border-white/40 focus-within:border-[#f37021]">
              <span className="text-gray-400 pl-3 pr-2 text-sm">🔍</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search services by title, billing model (e.g. Per KM, Monthly, DGCA, FSSAI, Minimum Wage)..."
                className="w-full text-xs sm:text-sm text-gray-800 placeholder-gray-400 outline-none pr-3 py-1"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-gray-400 hover:text-gray-700 text-xs px-2 cursor-pointer font-bold"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Filter and Tab Section - Auto-scrolled to open items directly on screen */}
      <div
        ref={servicesSectionRef}
        className="max-w-7xl mx-auto w-full px-4 sm:px-8 pt-4 pb-6 space-y-4 scroll-mt-14"
      >
        {/* 1. Main Classification Tabs (All / Trending / Emerging) */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 pb-3">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('ALL')}
              className={`px-4 py-2 rounded-lg font-bold text-xs transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'ALL'
                  ? 'bg-[#155998] text-white shadow-sm'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <span>🏛️</span>
              <span>All Official Services ({OFFICIAL_GEM_SERVICES.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('TRENDING')}
              className={`px-4 py-2 rounded-lg font-bold text-xs transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'TRENDING'
                  ? 'bg-[#f37021] text-white shadow-sm'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <span>🔥</span>
              <span>Trending Services (20)</span>
            </button>
            <button
              onClick={() => setActiveTab('EMERGING')}
              className={`px-4 py-2 rounded-lg font-bold text-xs transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'EMERGING'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <span>✨</span>
              <span>Emerging Services (10)</span>
            </button>
          </div>

          <span className="text-xs text-gray-500 font-medium">
            Showing <strong className="text-gray-900">{filteredServices.length}</strong> matching service types
          </span>
        </div>

        {/* 2. Domain Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {CORE_SERVICE_DOMAINS.map((dom) => (
            <button
              key={dom.name}
              onClick={() => setSelectedDomain(dom.name)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                selectedDomain === dom.name
                  ? 'bg-[#0c2340] text-white shadow-xs'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <span>{dom.icon}</span>
              <span>{dom.name}</span>
            </button>
          ))}
        </div>

        {/* 3. Services Grid */}
        {filteredServices.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-gray-200 space-y-3">
            <span className="text-4xl">🔍</span>
            <h3 className="text-base font-bold text-gray-800">No Services Found</h3>
            <p className="text-xs text-gray-500 max-w-md mx-auto">
              No official GeM service matched your search for "{searchQuery}". Try selecting "All Services" or clear your search term.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedDomain('All Services');
                setActiveTab('ALL');
              }}
              className="bg-[#f37021] text-white text-xs font-bold px-4 py-2 rounded-md hover:bg-orange-600 transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-xl border border-gray-200 hover:border-[#f37021]/50 shadow-xs hover:shadow-md transition flex flex-col justify-between overflow-hidden group"
              >
                <div className="p-5 space-y-3">
                  {/* Card Header with Badges */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-10 h-10 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center text-xl group-hover:scale-105 transition-transform">
                        {service.domainIcon}
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                          {service.domain}
                        </span>
                        <span
                          className={`inline-block text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                            service.category === 'Trending'
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          }`}
                        >
                          {service.category === 'Trending' ? '🔥 Trending GeM' : '✨ Emerging GeM'}
                        </span>
                      </div>
                    </div>

                    <span className="font-mono text-[9px] text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-200" title="Official GeM Category Code">
                      {service.gemCategoryCode.split('_').slice(-2).join('_')}
                    </span>
                  </div>

                  {/* Service Title & Subtitle */}
                  <div>
                    <h3 className="font-bold text-sm text-gray-900 group-hover:text-[#155998] transition leading-snug">
                      {service.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed line-clamp-2">
                      {service.subTitle}
                    </p>
                  </div>

                  {/* Billing Model Badge */}
                  <div className="bg-blue-50/70 border border-blue-100 rounded-md p-2 text-xs flex items-center gap-1.5">
                    <span className="text-blue-700 font-bold">💳 Billing Basis:</span>
                    <span className="text-blue-900 font-semibold text-[11px] truncate">
                      {service.billingModel}
                    </span>
                  </div>

                  {/* Statutory Requirements Preview */}
                  <div className="space-y-1.5 pt-1">
                    <p className="text-[10px] font-bold uppercase text-gray-400 tracking-wider flex items-center gap-1">
                      <span>⚖️</span>
                      <span>Statutory Compliance Gates ({service.statutoryRequirements.length})</span>
                    </p>
                    <ul className="space-y-1 text-[11px] text-gray-600">
                      {service.statutoryRequirements.slice(0, 2).map((req, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-emerald-600 font-bold text-xs">✓</span>
                          <span className="truncate">{req}</span>
                        </li>
                      ))}
                      {service.statutoryRequirements.length > 2 && (
                        <li className="text-[10px] text-blue-600 font-semibold pl-4">
                          +{service.statutoryRequirements.length - 2} more statutory checks...
                        </li>
                      )}
                    </ul>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="bg-gray-50/80 px-5 py-3 border-t border-gray-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setInspectedService(service)}
                    className="text-xs text-blue-700 hover:text-blue-900 font-bold hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <span>View Specifications</span>
                    <span>→</span>
                  </button>

                  <div className="flex items-center space-x-1.5">
                    {onSelectServiceForBids && (
                      <button
                        onClick={() => onSelectServiceForBids(service.title)}
                        className="bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 px-2.5 py-1 rounded text-xs font-semibold shadow-2xs transition cursor-pointer"
                        title="View Active Bids for this Service"
                      >
                        Bids
                      </button>
                    )}
                    {onRunComplianceCheck && (
                      <button
                        onClick={() => onRunComplianceCheck(service)}
                        className="bg-[#f37021] hover:bg-orange-600 text-white px-2.5 py-1 rounded text-xs font-bold shadow-xs transition cursor-pointer flex items-center gap-1"
                        title="Run AI Statutory Verification for this Service"
                      >
                        <span>⚡ Verify</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detailed Service Inspection Modal */}
      {inspectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-gray-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="bg-[#0c2340] text-white p-6 flex items-start justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-2xl border border-white/20">
                  {inspectedService.domainIcon}
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-400 text-blue-950 inline-block mb-1">
                    {inspectedService.category} Service
                  </span>
                  <h3 className="text-lg sm:text-xl font-black leading-tight">
                    {inspectedService.title}
                  </h3>
                  <p className="text-xs text-blue-200 mt-0.5">
                    {inspectedService.domain} • GeM Node: <code className="font-mono text-[10px] text-amber-300">{inspectedService.gemCategoryCode}</code>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setInspectedService(null)}
                className="text-gray-300 hover:text-white text-xl font-bold p-1 transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-5 text-xs">
              {/* Description */}
              <div>
                <h4 className="font-bold text-gray-900 uppercase tracking-wider text-[10px] text-gray-500 mb-1">
                  Scope of Service
                </h4>
                <p className="text-gray-700 leading-relaxed text-sm bg-gray-50 p-3 rounded-lg border border-gray-200">
                  {inspectedService.description}
                </p>
              </div>

              {/* Billing Model */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-blue-50/80 p-3 rounded-lg border border-blue-200">
                  <span className="font-bold text-blue-900 block text-xs mb-0.5">Standardized Billing Model</span>
                  <span className="text-blue-700 font-semibold">{inspectedService.billingModel}</span>
                </div>
                <div className="bg-orange-50/80 p-3 rounded-lg border border-orange-200">
                  <span className="font-bold text-orange-900 block text-xs mb-0.5">Statutory Governance</span>
                  <span className="text-orange-800 font-semibold">General Financial Rules (GFR 2017) & Code on Wages</span>
                </div>
              </div>

              {/* Statutory Checklist */}
              <div>
                <h4 className="font-bold text-gray-900 uppercase tracking-wider text-[10px] text-gray-500 mb-2 flex items-center gap-1.5">
                  <span>⚖️</span>
                  <span>Mandatory Statutory Compliance Verification Checklist</span>
                </h4>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 space-y-2.5">
                  {inspectedService.statutoryRequirements.map((req, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 bg-white p-2.5 rounded-lg border border-gray-100 shadow-2xs">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        ✓
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{req}</p>
                        <p className="text-[10px] text-gray-500">
                          Automated OCR cross-referenced with Central/State regulatory APIs & GFR Rule 144(xi)
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <button
                onClick={() => setInspectedService(null)}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg font-bold text-xs cursor-pointer transition"
              >
                Close
              </button>

              <div className="flex items-center space-x-2">
                {onSelectServiceForBids && (
                  <button
                    onClick={() => {
                      const title = inspectedService.title;
                      setInspectedService(null);
                      onSelectServiceForBids(title);
                    }}
                    className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-bold text-xs cursor-pointer transition shadow-xs"
                  >
                    View Active Tenders
                  </button>
                )}
                {onRunComplianceCheck && (
                  <button
                    onClick={() => {
                      const serv = inspectedService;
                      setInspectedService(null);
                      onRunComplianceCheck(serv);
                    }}
                    className="px-4 py-2 bg-[#f37021] hover:bg-orange-600 text-white rounded-lg font-bold text-xs cursor-pointer transition shadow-xs flex items-center gap-1.5"
                  >
                    <span>⚡ Run AI Statutory Check</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
