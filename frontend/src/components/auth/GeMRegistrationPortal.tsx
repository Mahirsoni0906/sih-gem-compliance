import React, { useState } from 'react';
import {
  Building2,
  Landmark,
  FileCheck,
  CheckCircle2,
  Check,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { AshokaEmblem, GeMStarLogo } from '../common/GeMAssets';

interface GeMRegistrationPortalProps {
  initialRole?: 'seller' | 'buyer';
  onCompleteSellerRegistration: () => void;
  onCompleteBuyerRegistration: () => void;
  onGoBack: () => void;
}

export const GeMRegistrationPortal: React.FC<GeMRegistrationPortalProps> = ({
  initialRole = 'seller',
  onCompleteSellerRegistration,
  onCompleteBuyerRegistration,
  onGoBack,
}) => {
  const [activeRole, setActiveRole] = useState<'seller' | 'buyer'>(initialRole);

  // Seller Form State
  const [sellerConstitution, setSellerConstitution] = useState<string>('Proprietorship');
  const [sellerOrgName, setSellerOrgName] = useState<string>('ABC Industries Pvt. Ltd.');
  const [sellerPan, setSellerPan] = useState<string>('AAACB1234F');
  const [sellerGstin, setSellerGstin] = useState<string>('24AAACB1234F1Z5');
  const [sellerUdyam, setSellerUdyam] = useState<string>('UDYAM-GJ-01-008291');
  const [sellerEmail, setSellerEmail] = useState<string>('compliance@abcind.com');
  const [sellerMobile, setSellerMobile] = useState<string>('9876543210');
  const [tredsConsent, setTredsConsent] = useState<boolean>(true);
  const [miiDeclaration, setMiiDeclaration] = useState<boolean>(true);
  const [isSellerSubmitting, setIsSellerSubmitting] = useState<boolean>(false);
  const [sellerVerified, setSellerVerified] = useState<boolean>(false);

  // Buyer Form State
  const [buyerOrgType, setBuyerOrgType] = useState<string>('Central Public Sector Enterprise (CPSE)');
  const [buyerMinistry, setBuyerMinistry] = useState<string>('Ministry of Petroleum & Natural Gas');
  const [buyerDepartment, setBuyerDepartment] = useState<string>('Oil and Natural Gas Corporation (ONGC)');
  const [buyerDesignation, setBuyerDesignation] = useState<string>('General Manager (Procurement)');
  const [buyerOfficerName, setBuyerOfficerName] = useState<string>('Shri R. K. Saxena');
  const [buyerGovEmail, setBuyerGovEmail] = useState<string>('rk.saxena@ongc.gov.in');
  const [buyerPfmsCode, setBuyerPfmsCode] = useState<string>('PFMS-CPSE-99120');
  const [isBuyerSubmitting, setIsBuyerSubmitting] = useState<boolean>(false);
  const [buyerVerified, setBuyerVerified] = useState<boolean>(false);

  const handleSellerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSellerSubmitting(true);
    setTimeout(() => {
      setIsSellerSubmitting(false);
      setSellerVerified(true);
      setTimeout(() => {
        onCompleteSellerRegistration();
      }, 1500);
    }, 1200);
  };

  const handleBuyerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsBuyerSubmitting(true);
    setTimeout(() => {
      setIsBuyerSubmitting(false);
      setBuyerVerified(true);
      setTimeout(() => {
        onCompleteBuyerRegistration();
      }, 1500);
    }, 1200);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#f4f6f9] min-h-screen">
      {/* Official Header Strip */}
      <div className="bg-[#062134] text-white py-6 px-4 sm:px-8 border-b-2 border-yellow-400 shadow-md">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <AshokaEmblem className="w-8 h-11 text-gray-200" />
            <div className="flex items-center space-x-2">
              <GeMStarLogo className="w-8 h-8" />
              <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
                  <span>GeM Primary Registration Portal</span>
                  <span className="bg-yellow-400 text-[#062134] text-[10px] font-black px-2 py-0.5 rounded uppercase">
                    Official
                  </span>
                </h1>
                <p className="text-xs text-gray-300">
                  Government e Marketplace • Department of Commerce, Ministry of Commerce & Industry
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={onGoBack}
            className="text-xs font-bold text-gray-300 hover:text-white bg-white/10 hover:bg-white/20 px-3.5 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer"
          >
            <span>← Back to GeM Home</span>
          </button>
        </div>
      </div>

      {/* Main Form Container */}
      <div className="max-w-4xl mx-auto px-4 py-8 w-full space-y-6 flex-1">
        {/* Role Selector Tabs */}
        <div className="bg-white rounded-2xl p-2 shadow-xs border border-gray-200 grid grid-cols-2 gap-2">
          <button
            onClick={() => setActiveRole('seller')}
            className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold transition cursor-pointer flex items-center justify-center gap-2.5 ${
              activeRole === 'seller'
                ? 'bg-[#f37021] text-white shadow-md'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Building2 className="w-5 h-5 shrink-0" />
            <div className="text-left">
              <p className="leading-tight">Seller Registration</p>
              <p className={`text-[10px] ${activeRole === 'seller' ? 'text-orange-100' : 'text-gray-500'}`}>
                MSME, Startup, OEM & Service Provider
              </p>
            </div>
          </button>

          <button
            onClick={() => setActiveRole('buyer')}
            className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold transition cursor-pointer flex items-center justify-center gap-2.5 ${
              activeRole === 'buyer'
                ? 'bg-[#162c5b] text-white shadow-md'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Landmark className="w-5 h-5 shrink-0" />
            <div className="text-left">
              <p className="leading-tight">Buyer Registration</p>
              <p className={`text-[10px] ${activeRole === 'buyer' ? 'text-blue-200' : 'text-gray-500'}`}>
                Central Ministries, State Depts & CPSEs
              </p>
            </div>
          </button>
        </div>

        {/* ================= SELLER REGISTRATION ================= */}
        {activeRole === 'seller' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-orange-50/70 border-b border-orange-100 p-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase text-orange-600 tracking-wider">
                  Vendor Onboarding Workflow (SIH26100 Statutory Automated)
                </span>
                <h2 className="text-lg font-black text-[#0c2340]">
                  New Seller / Service Provider Registration
                </h2>
                <p className="text-xs text-gray-600 mt-0.5">
                  Complete statutory verification via Income Tax PAN, GSTN, and Udyam MSME database.
                </p>
              </div>
              <FileCheck className="w-8 h-8 text-orange-600 shrink-0" />
            </div>

            {sellerVerified ? (
              <div className="p-8 text-center space-y-4">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-black text-gray-900">
                  Seller Account Provisioned & Statutorily Verified!
                </h3>
                <p className="text-xs text-gray-600 max-w-md mx-auto">
                  Your entity <strong className="text-blue-950">{sellerOrgName}</strong> has been registered with PAN <strong>{sellerPan}</strong> and GSTIN <strong>{sellerGstin}</strong>.
                </p>
                <div className="p-3 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-xl text-xs font-mono max-w-sm mx-auto">
                  GeM Seller ID: <strong>SELLER-GJ-8841</strong> (Active)
                </div>
                <p className="text-[11px] text-gray-400 animate-pulse">
                  Redirecting to Seller Compliance Desk...
                </p>
              </div>
            ) : (
              <form onSubmit={handleSellerSubmit} className="p-6 sm:p-8 space-y-6 text-xs">
                {/* 1. Constitution of Business */}
                <div className="space-y-2">
                  <label className="font-extrabold text-gray-800 text-xs flex items-center gap-1.5">
                    <span>1. Constitution of Business / Organization Type</span>
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {['Proprietorship', 'Partnership', 'Private Limited Company', 'Public Limited Company'].map((constType) => (
                      <button
                        type="button"
                        key={constType}
                        onClick={() => setSellerConstitution(constType)}
                        className={`p-2.5 rounded-xl border text-left font-bold transition cursor-pointer ${
                          sellerConstitution === constType
                            ? 'border-orange-500 bg-orange-50 text-orange-950 shadow-2xs'
                            : 'border-gray-200 bg-gray-50/60 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <p className="text-xs">{constType}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Organization Name & PAN */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-bold text-gray-700">
                      Company / Firm Legal Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={sellerOrgName}
                      onChange={(e) => setSellerOrgName(e.target.value)}
                      placeholder="e.g. ABC Industries Pvt. Ltd."
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2 text-xs text-gray-900 focus:bg-white focus:border-orange-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-gray-700 flex items-center justify-between">
                      <span>Income Tax PAN <span className="text-red-500">*</span></span>
                      <span className="flex items-center gap-1 text-[10px] text-emerald-700 font-semibold">
                        <Check className="w-3 h-3" />
                        <span>CBDT API Connected</span>
                      </span>
                    </label>
                    <input
                      type="text"
                      required
                      value={sellerPan}
                      onChange={(e) => setSellerPan(e.target.value.toUpperCase())}
                      placeholder="e.g. AAACB1234F"
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2 text-xs font-mono uppercase text-gray-900 focus:bg-white focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* 3. GSTIN & Udyam Number */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-bold text-gray-700 flex items-center justify-between">
                      <span>GSTIN (Goods and Services Tax ID) <span className="text-red-500">*</span></span>
                      <span className="flex items-center gap-1 text-[10px] text-blue-700 font-semibold">
                        <Check className="w-3 h-3" />
                        <span>GSTN Portal 2.0</span>
                      </span>
                    </label>
                    <input
                      type="text"
                      required
                      value={sellerGstin}
                      onChange={(e) => setSellerGstin(e.target.value.toUpperCase())}
                      placeholder="e.g. 24AAACB1234F1Z5"
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2 text-xs font-mono uppercase text-gray-900 focus:bg-white focus:border-orange-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-gray-700 flex items-center justify-between">
                      <span>Udyam Registration Number (MSME)</span>
                      <span className="text-[10px] text-orange-700 font-semibold">EMD Exemption Benefit</span>
                    </label>
                    <input
                      type="text"
                      value={sellerUdyam}
                      onChange={(e) => setSellerUdyam(e.target.value.toUpperCase())}
                      placeholder="e.g. UDYAM-GJ-01-008291"
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2 text-xs font-mono uppercase text-gray-900 focus:bg-white focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* 4. Contact Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-bold text-gray-700">Authorized Email Address</label>
                    <input
                      type="email"
                      required
                      value={sellerEmail}
                      onChange={(e) => setSellerEmail(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2 text-xs text-gray-900 focus:bg-white focus:border-orange-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-gray-700">Authorized Mobile (for Aadhaar OTP)</label>
                    <input
                      type="tel"
                      required
                      value={sellerMobile}
                      onChange={(e) => setSellerMobile(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2 text-xs text-gray-900 focus:bg-white focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* 5. Statutory Undertakings */}
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={tredsConsent}
                      onChange={(e) => setTredsConsent(e.target.checked)}
                      className="mt-0.5 rounded text-orange-600 focus:ring-orange-500"
                    />
                    <span className="text-[11px] text-gray-700 font-medium">
                      <strong>TReDS Integration:</strong> I authorize GeM to share accepted invoices with RBI-regulated TReDS factoring exchanges (RXIL, M1xchange, Invoicemart) for immediate invoice discounting.
                    </span>
                  </label>

                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={miiDeclaration}
                      onChange={(e) => setMiiDeclaration(e.target.checked)}
                      className="mt-0.5 rounded text-orange-600 focus:ring-orange-500"
                    />
                    <span className="text-[11px] text-gray-700 font-medium">
                      <strong>GFR Rule 144(xi) & Make in India Undertaking:</strong> I solemnly declare that the registered entity is compliant with Public Procurement restrictions on bidders from countries sharing land borders with India.
                    </span>
                  </label>
                </div>

                {/* Submit Controls */}
                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={onGoBack}
                    className="px-4 py-2 text-gray-600 font-bold hover:bg-gray-100 rounded-xl"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSellerSubmitting}
                    className="bg-[#f37021] hover:bg-[#e05e10] text-white font-extrabold text-xs px-6 py-2.5 rounded-xl shadow-md transition cursor-pointer flex items-center gap-2"
                  >
                    {isSellerSubmitting ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Verifying with CBDT & GSTN...</span>
                      </>
                    ) : (
                      <>
                        <span>Verify Credentials & Register Seller</span>
                        <span>→</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* ================= BUYER REGISTRATION ================= */}
        {activeRole === 'buyer' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-blue-50/70 border-b border-blue-100 p-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase text-blue-800 tracking-wider">
                  Government Procurement Authority Onboarding
                </span>
                <h2 className="text-lg font-black text-[#0c2340]">
                  New Government Buyer / Officer Registration
                </h2>
                <p className="text-xs text-gray-600 mt-0.5">
                  Designate Primary or Secondary Procurement Officers with NIC/Gov email domain validation.
                </p>
              </div>
              <Landmark className="w-8 h-8 text-blue-900 shrink-0" />
            </div>

            {buyerVerified ? (
              <div className="p-8 text-center space-y-4">
                <div className="w-14 h-14 bg-blue-100 text-blue-900 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-black text-gray-900">
                  Buyer Authority Credentials Authorized!
                </h3>
                <p className="text-xs text-gray-600 max-w-md mx-auto">
                  Officer <strong className="text-blue-950">{buyerOfficerName}</strong> has been enrolled under <strong>{buyerMinistry}</strong> ({buyerDepartment}).
                </p>
                <div className="p-3 bg-blue-50 text-blue-950 border border-blue-200 rounded-xl text-xs font-mono max-w-sm mx-auto">
                  Procurement Officer Code: <strong>BUYER-ONGC-OFFICER-01</strong>
                </div>
                <p className="text-[11px] text-gray-400 animate-pulse">
                  Redirecting to Procurement Officer Scrutiny Desk...
                </p>
              </div>
            ) : (
              <form onSubmit={handleBuyerSubmit} className="p-6 sm:p-8 space-y-6 text-xs">
                {/* 1. Organization Tier */}
                <div className="space-y-1.5">
                  <label className="font-bold text-gray-800">
                    1. Government Organization Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={buyerOrgType}
                    onChange={(e) => setBuyerOrgType(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2 text-xs font-semibold text-gray-900 focus:bg-white focus:border-blue-600 focus:outline-none"
                  >
                    <option value="Central Ministry">Central Ministry / Department</option>
                    <option value="Central Public Sector Enterprise (CPSE)">Central Public Sector Enterprise (CPSE)</option>
                    <option value="State Government Department">State Government Department</option>
                    <option value="Autonomous Body">Autonomous Body / Institutional University</option>
                    <option value="Defence Procurement Agency">Defence Procurement Agency / Armed Forces</option>
                  </select>
                </div>

                {/* 2. Ministry & Department */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-bold text-gray-700">
                      Ministry / State Government <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={buyerMinistry}
                      onChange={(e) => setBuyerMinistry(e.target.value)}
                      placeholder="e.g. Ministry of Petroleum & Natural Gas"
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2 text-xs text-gray-900 focus:bg-white focus:border-blue-600 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-gray-700">
                      Department / CPSE Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={buyerDepartment}
                      onChange={(e) => setBuyerDepartment(e.target.value)}
                      placeholder="e.g. ONGC / BHEL / Railways"
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2 text-xs text-gray-900 focus:bg-white focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                </div>

                {/* 3. Officer Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-bold text-gray-700">
                      Officer Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={buyerOfficerName}
                      onChange={(e) => setBuyerOfficerName(e.target.value)}
                      placeholder="e.g. Shri R. K. Saxena"
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2 text-xs text-gray-900 focus:bg-white focus:border-blue-600 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-gray-700">
                      Designation <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={buyerDesignation}
                      onChange={(e) => setBuyerDesignation(e.target.value)}
                      placeholder="e.g. General Manager (Procurement)"
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2 text-xs text-gray-900 focus:bg-white focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                </div>

                {/* 4. Official Email & PFMS Code */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-bold text-gray-700 flex items-center justify-between">
                      <span>Government Official Email <span className="text-red-500">*</span></span>
                      <span className="text-[10px] text-emerald-700 font-semibold">@gov.in / @nic.in required</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={buyerGovEmail}
                      onChange={(e) => setBuyerGovEmail(e.target.value)}
                      placeholder="officer@ongc.gov.in"
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2 text-xs text-gray-900 focus:bg-white focus:border-blue-600 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-gray-700 flex items-center justify-between">
                      <span>PFMS / Treasury Head of Account Code</span>
                      <span className="text-[10px] text-gray-500 font-mono">DDO Code</span>
                    </label>
                    <input
                      type="text"
                      value={buyerPfmsCode}
                      onChange={(e) => setBuyerPfmsCode(e.target.value)}
                      placeholder="e.g. PFMS-CPSE-99120"
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2 text-xs font-mono text-gray-900 focus:bg-white focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Statutory Buyer Note */}
                <div className="bg-blue-50/70 p-4 rounded-xl border border-blue-200 text-[11px] text-blue-950 space-y-1">
                  <p className="font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0" />
                    <span>GFR 2017 Rule 149 Compliance:</span>
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    By registering as a Procurement Officer, you are authorized to create tenders, reverse auctions, and issue Direct Purchase Orders up to delegated financial limits in adherence to General Financial Rules.
                  </p>
                </div>

                {/* Submit Controls */}
                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={onGoBack}
                    className="px-4 py-2 text-gray-600 font-bold hover:bg-gray-100 rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isBuyerSubmitting}
                    className="bg-[#162c5b] hover:bg-[#0f1f42] text-white font-extrabold text-xs px-6 py-2.5 rounded-xl shadow-md transition cursor-pointer flex items-center gap-2"
                  >
                    {isBuyerSubmitting ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Validating HOD Authorization & DSC...</span>
                      </>
                    ) : (
                      <>
                        <span>Authorize Buyer & Open Officer Console</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
