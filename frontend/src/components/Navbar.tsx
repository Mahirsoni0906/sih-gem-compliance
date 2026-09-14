import React, { useState, useEffect, useRef } from 'react';
import type { UserRole } from '../types';
import { AshokaEmblem, GeMStarLogo } from './common/GeMAssets';
import { useLanguage, SUPPORTED_LANGUAGES } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

export interface NavigationOptions {
  bidsTab?: 'ongoing' | 'results' | 'boq' | 'auctions' | 'notices' | 'cppp' | 'opportunities';
  sellerTab?: 'dashboard-view' | 'checklist-view' | 'upload-view' | 'issues-view';
  registrationRole?: 'seller' | 'buyer';
}

interface NavbarProps {
  activePage: string;
  setActivePage: (page: string, options?: NavigationOptions) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  onOpenChat?: () => void;
  onSearchProduct?: (query: string, category?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activePage,
  setActivePage,
  userRole,
  setUserRole,
  onOpenChat,
  onSearchProduct,
}) => {
  const { language, setLanguage, currentOption, t } = useLanguage();
  const { user, logout, switchMasterRole, isAuthenticated } = useAuth();
  const isActuallyLoggedIn = isAuthenticated && user && user.userId && user.userId !== 'GUEST-USER';
  const [searchTab, setSearchTab] = useState<'PRODUCTS' | 'SERVICES' | 'CONTENT' | 'COURSES'>('PRODUCTS');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('gem_theme');
      return saved === 'dark' || document.documentElement.classList.contains('dark');
    }
    return false;
  });
  const [fontScale, setFontScale] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('gem_font_scale');
      return saved ? parseFloat(saved) : 1.0;
    }
    return 1.0;
  });

  // Dropdown states
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [helpDropdownOpen, setHelpDropdownOpen] = useState(false);
  const [forwardAuctionOpen, setForwardAuctionOpen] = useState(false);
  const [bidsDropdownOpen, setBidsDropdownOpen] = useState(false);
  const [signupDropdownOpen, setSignupDropdownOpen] = useState(false);
  const [loginDropdownOpen, setLoginDropdownOpen] = useState(false);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);
  const [featuresDropdownOpen, setFeaturesDropdownOpen] = useState(false);
  const [sellerOnGemOpen, setSellerOnGemOpen] = useState(false);
  const [contractsDropdownOpen, setContractsDropdownOpen] = useState(false);
  const [cpppDropdownOpen, setCpppDropdownOpen] = useState(false);
  const [complianceDropdownOpen, setComplianceDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  const [trainingModalOpen, setTrainingModalOpen] = useState(false);


  // Restore saved theme and font size on load
  useEffect(() => {
    const savedTheme = localStorage.getItem('gem_theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else if (savedTheme === 'light') {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
    const savedFont = localStorage.getItem('gem_font_scale');
    if (savedFont !== null) {
      const scale = parseFloat(savedFont);
      if (!isNaN(scale)) {
        applyFontScale(scale);
      }
    }
  }, []);

  const closeAllDropdowns = () => {
    setLangDropdownOpen(false);
    setHelpDropdownOpen(false);
    setForwardAuctionOpen(false);
    setBidsDropdownOpen(false);
    setSignupDropdownOpen(false);
    setLoginDropdownOpen(false);
    setCategoriesDropdownOpen(false);
    setFeaturesDropdownOpen(false);
    setSellerOnGemOpen(false);
    setContractsDropdownOpen(false);
    setCpppDropdownOpen(false);
    setComplianceDropdownOpen(false);
    setNotificationsOpen(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    closeAllDropdowns();
    if (onSearchProduct) {
      onSearchProduct(searchQuery, searchTab === 'SERVICES' ? 'Services' : undefined);
    }
    if (searchTab === 'SERVICES') {
      setActivePage('services-page');
    } else if (searchTab === 'PRODUCTS') {
      setActivePage('products-page');
    } else if (searchTab === 'COURSES') {
      setActivePage('training-page');
    } else {
      setActivePage('bids-page', { bidsTab: 'ongoing' });
    }
  };

  const applyFontScale = (scale: number) => {
    const clamped = Math.round(Math.min(Math.max(scale, 0.85), 1.25) * 100) / 100;
    setFontScale(clamped);
    localStorage.setItem('gem_font_scale', clamped.toString());
    const root = document.documentElement;
    root.style.fontSize = `${clamped * 100}%`;
    (root.style as any).zoom = '1';
  };

  const handleFontDecrease = () => {
    applyFontScale(fontScale - 0.08);
  };

  const handleFontReset = () => {
    applyFontScale(1.0);
  };

  const handleFontIncrease = () => {
    applyFontScale(fontScale + 0.08);
  };

  const toggleDarkMode = () => {
    const nextMode = !isDarkMode;
    setIsDarkMode(nextMode);
    if (nextMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('gem_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('gem_theme', 'light');
    }
  };

  return (
    <header className="relative z-40 shadow-md font-sans select-none w-full">
      {/* 1. Top Utility Row (Language, Accessibility, Help) matching #0c2738 */}
      <div className="bg-[#0c2738] text-gray-300 text-[11px] py-1 px-4 sm:px-8 border-b border-[#1b3d54]">
        <div className="max-w-[1400px] mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Left Accessibility Controls */}
          <div className="flex items-center space-x-3.5">
            {/* Language Selector with 9 Languages */}
            <div className="relative">
              <button
                onClick={() => {
                  closeAllDropdowns();
                  setLangDropdownOpen(!langDropdownOpen);
                }}
                className="flex items-center gap-1 cursor-pointer hover:text-white transition font-medium"
              >
                <span>{currentOption.nativeName}</span>
                <span className="text-[#f37021] text-[10px]">▼</span>
              </button>
              {langDropdownOpen && (
                <div className="absolute left-0 mt-1.5 w-44 bg-white text-gray-800 shadow-2xl rounded-lg py-1.5 z-50 text-xs border border-gray-200 divide-y divide-gray-100 max-h-80 overflow-y-auto">
                  <div className="px-3 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50">
                    Select Language ({SUPPORTED_LANGUAGES.length})
                  </div>
                  {SUPPORTED_LANGUAGES.map((opt) => (
                    <button
                      key={opt.code}
                      onClick={() => {
                        setLanguage(opt.code);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 hover:bg-orange-50 hover:text-orange-700 font-semibold flex items-center justify-between transition cursor-pointer ${
                        language === opt.code ? 'text-orange-600 bg-orange-50/70 font-bold' : 'text-gray-700'
                      }`}
                    >
                      <span className="font-medium">{opt.nativeName}</span>
                      <span className="text-[10px] text-gray-400 font-normal">{opt.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <span className="text-[#3a5467]">|</span>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="flex items-center gap-1.5 cursor-pointer hover:text-white transition"
              title="Toggle Dark / Light Contrast"
            >
              <span
                className={`w-2.5 h-2.5 rounded-full border border-gray-400 transition-all ${
                  isDarkMode ? 'bg-amber-400 shadow-[0_0_8px_#f59e0b]' : 'bg-transparent'
                }`}
              ></span>
              <span>{isDarkMode ? t('lightMode') : t('darkMode')}</span>
            </button>

            <span className="text-[#3a5467]">|</span>

            {/* Font Size A- A A+ (Smaller, Reset, Bigger) */}
            <div className="flex items-center space-x-1.5">
              <span>{t('fontSize')}</span>
              <button
                onClick={handleFontDecrease}
                className={`px-1.5 py-0.5 rounded hover:text-white transition cursor-pointer font-bold ${
                  fontScale < 0.98 ? 'text-orange-400 bg-white/15 underline font-black' : ''
                }`}
                title="A- Smaller Font"
              >
                A-
              </button>
              <button
                onClick={handleFontReset}
                className={`px-1.5 py-0.5 rounded hover:text-white transition cursor-pointer font-bold ${
                  Math.abs(fontScale - 1.0) <= 0.02 ? 'text-orange-400 bg-white/15 underline font-black' : ''
                }`}
                title="A Normal Font (Reset to Default)"
              >
                A
              </button>
              <button
                onClick={handleFontIncrease}
                className={`px-1.5 py-0.5 rounded hover:text-white transition cursor-pointer font-bold ${
                  fontScale > 1.02 ? 'text-orange-400 bg-white/15 underline font-black' : ''
                }`}
                title="A+ Bigger Font"
              >
                A+
              </button>
            </div>

            <span className="text-[#3a5467]">|</span>

            <a
              href="#main-content"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('main-content')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-white hidden md:inline"
            >
              {t('skipToMain')}
            </a>
          </div>

          {/* Right Support Controls */}
          <div className="flex items-center space-x-3.5">
            <button
              onClick={() => setTicketModalOpen(true)}
              className="hover:text-white cursor-pointer transition"
            >
              {t('raiseTicket')}
            </button>

            <span className="text-[#3a5467]">|</span>

            {/* Need Help Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  closeAllDropdowns();
                  setHelpDropdownOpen(!helpDropdownOpen);
                }}
                className="flex items-center gap-1 cursor-pointer hover:text-white transition"
              >
                <span>{t('needHelp')}</span>
                <span className="text-[#f37021] text-[10px]">▼</span>
              </button>
              {helpDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-60 bg-white text-gray-800 shadow-xl rounded-lg py-2 z-50 text-xs border border-gray-200">
                  <div className="px-3 py-1 text-[10px] font-bold text-gray-500 uppercase border-b bg-gray-50">
                    GeM Support Desk
                  </div>
                  <div className="py-1">
                    <a
                      href="#faqs"
                      onClick={(e) => {
                        e.preventDefault();
                        if (onOpenChat) onOpenChat();
                        setHelpDropdownOpen(false);
                      }}
                      className="block px-3 py-1.5 hover:bg-orange-50 hover:text-orange-700 font-medium"
                    >
                      ❓ Frequently Asked Questions (FAQs)
                    </a>
                    <a
                      href="#gemmy"
                      onClick={(e) => {
                        e.preventDefault();
                        if (onOpenChat) onOpenChat();
                        setHelpDropdownOpen(false);
                      }}
                      className="block px-3 py-1.5 hover:bg-purple-50 hover:text-purple-700 font-medium"
                    >
                      🤖 Ask GeMMy (AI Support Assistant)
                    </a>
                    <button
                      onClick={() => {
                        setActivePage('training-page');
                        setHelpDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-orange-50 hover:text-orange-700 font-medium flex items-center justify-between"
                    >
                      <span>🎓 Interactive Training Courses & LMS</span>
                      <span className="text-[10px] bg-orange-100 text-orange-800 font-bold px-1.5 py-0.5 rounded">Govt Cert</span>
                    </button>
                    <button
                      onClick={() => {
                        setTicketModalOpen(true);
                        setHelpDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-orange-50 hover:text-orange-700 font-medium"
                    >
                      🎫 Incident Management / Raise Ticket
                    </button>
                    <div className="mt-1 px-3 py-1.5 bg-blue-50/70 border-t text-[11px] text-blue-900">
                      <p className="font-bold">National Toll-Free Helpline:</p>
                      <p className="font-mono text-xs font-black text-blue-950">1800-419-3436 / 1800-102-3436</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Primary Header with Ashoka Lion, GeM Logo, Search & Action Dropdowns */}
      <div className="bg-[#062134] text-white py-2.5 px-4 sm:px-8 border-b border-[#0b334e]">
        <div className="max-w-[1400px] mx-auto flex flex-wrap items-center justify-between gap-4">
          {/* Emblem & Official GeM Logo */}
          <div
            className="flex items-center space-x-3 cursor-pointer select-none"
            onClick={() => {
              closeAllDropdowns();
              setActivePage('landing-page');
            }}
          >
            <AshokaEmblem className="w-8 h-11 text-gray-200" />
            <div className="flex items-center space-x-2.5">
              <GeMStarLogo className="w-8 h-8" />
              <div className="leading-tight">
                <div className="flex items-baseline space-x-1.5">
                  <span className="text-2xl font-black tracking-tight text-white">GeM</span>
                  <span className="text-[10px] uppercase font-bold text-gray-300 hidden sm:inline tracking-wider">
                    {t('gemTitle')}
                  </span>
                </div>
                <p className="text-[9px] text-gray-300 tracking-wider italic">
                  {t('gemMotto')}
                </p>
              </div>
            </div>
          </div>

          {/* Search Section with Domain Tabs & Pill Input */}
          <div className="flex-1 max-w-xl mx-auto hidden lg:block">
            {/* Domain Tabs with Orange Active Bar */}
            <div className="flex space-x-6 text-[11px] font-bold text-gray-300 pb-1 px-2">
              <button
                onClick={() => {
                  setSearchTab('PRODUCTS');
                  setActivePage('products-page');
                }}
                className={`pb-0.5 transition cursor-pointer ${
                  (searchTab === 'PRODUCTS' && activePage !== 'services-page') || activePage === 'products-page'
                    ? 'text-[#f37021] border-b-2 border-[#f37021] font-extrabold'
                    : 'hover:text-white'
                }`}
              >
                {t('products')}
              </button>
              <button
                onClick={() => {
                  setSearchTab('SERVICES');
                  setActivePage('services-page');
                }}
                className={`pb-0.5 transition cursor-pointer ${
                  searchTab === 'SERVICES' || activePage === 'services-page'
                    ? 'text-[#f37021] border-b-2 border-[#f37021] font-extrabold'
                    : 'hover:text-white'
                }`}
              >
                {t('services')}
              </button>
              <button
                onClick={() => setSearchTab('CONTENT')}
                className={`pb-0.5 transition cursor-pointer ${
                  searchTab === 'CONTENT'
                    ? 'text-[#f37021] border-b-2 border-[#f37021] font-extrabold'
                    : 'hover:text-white'
                }`}
              >
                {t('content')}
              </button>
              <button
                onClick={() => {
                  setSearchTab('COURSES');
                  setActivePage('training-page');
                }}
                className={`pb-0.5 transition cursor-pointer ${
                  searchTab === 'COURSES' || activePage === 'training-page'
                    ? 'text-[#f37021] border-b-2 border-[#f37021] font-extrabold'
                    : 'hover:text-white'
                }`}
              >
                {t('courses')}
              </button>
            </div>

            {/* Pill Search Input with NEW Badge and Magnifier */}
            <form
              onSubmit={handleSearchSubmit}
              className="relative flex items-center bg-white rounded-full overflow-hidden shadow-md"
            >
              <span className="bg-[#f59e0b] text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full ml-2 shadow-xs">
                NEW
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  searchTab === 'SERVICES' || activePage === 'services-page'
                    ? 'Search official GeM services (e.g. Security, Cabs, Catering, Drone, AMC)...'
                    : t('searchPlaceholder')
                }
                className="w-full px-3 py-1.5 text-xs text-gray-800 placeholder-gray-400 focus:outline-none"
              />
              <button
                type="submit"
                className="px-3.5 py-2 text-gray-600 hover:text-[#062134] transition cursor-pointer"
                title="Search on GeM"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
          </div>

          {/* Top-Right Action Dropdowns with Orange Down Arrows */}
          <div className="flex items-center space-x-3.5 text-xs font-semibold">
            {/* Forward Auction Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  closeAllDropdowns();
                  setForwardAuctionOpen(!forwardAuctionOpen);
                }}
                className="hidden md:flex items-center gap-1 cursor-pointer hover:text-orange-300 py-1 transition"
              >
                <span>{t('forwardAuction')}</span>
                <span className="text-[#f37021] text-[10px]">▼</span>
              </button>
              {forwardAuctionOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white text-gray-800 shadow-2xl rounded-xl py-2 z-50 text-xs border border-gray-200">
                  <div className="px-3 py-1 text-[10px] font-bold text-gray-500 uppercase border-b bg-gray-50">
                    Forward Auction Portal
                  </div>
                  <button
                    onClick={() => {
                      setActivePage('bids-page', { bidsTab: 'auctions' });
                      setForwardAuctionOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-orange-50 hover:text-orange-700 font-medium"
                  >
                    🔨 Live Forward Auctions
                  </button>
                  <button
                    onClick={() => {
                      setActivePage('bids-page', { bidsTab: 'notices' });
                      setForwardAuctionOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-orange-50 hover:text-orange-700 font-medium"
                  >
                    📋 Auction Notices & Schedules
                  </button>
                  <button
                    onClick={() => {
                      setUserRole('officer');
                      setActivePage('risk-page');
                      setForwardAuctionOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-blue-50 hover:text-blue-900 font-medium border-t"
                  >
                    ⚖️ Auction Compliance Scrutiny
                  </button>
                </div>
              )}
            </div>

            {/* Bids Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  closeAllDropdowns();
                  setBidsDropdownOpen(!bidsDropdownOpen);
                }}
                className={`hidden md:flex items-center gap-1 cursor-pointer py-1 transition ${
                  activePage === 'bids-page' ? 'text-yellow-400 font-bold' : 'hover:text-orange-300'
                }`}
              >
                <span>{t('bids')}</span>
                <span className="text-[#f37021] text-[10px]">▼</span>
              </button>
              {bidsDropdownOpen && (
                <div className="absolute right-0 mt-2 w-60 bg-white text-gray-800 shadow-2xl rounded-xl py-2 z-50 text-xs border border-gray-200">
                  <div className="px-3 py-1 text-[10px] font-bold text-gray-500 uppercase border-b bg-gray-50">
                    Bid Plus Services
                  </div>
                  <button
                    onClick={() => {
                      setActivePage('bids-page', { bidsTab: 'ongoing' });
                      setBidsDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-orange-50 hover:text-orange-700 font-medium"
                  >
                    📑 Ongoing Bids / RA
                  </button>
                  <button
                    onClick={() => {
                      setActivePage('bids-page', { bidsTab: 'results' });
                      setBidsDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-orange-50 hover:text-orange-700 font-medium"
                  >
                    📊 Bid / RA Results
                  </button>
                  <button
                    onClick={() => {
                      setActivePage('bids-page', { bidsTab: 'boq' });
                      setBidsDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-orange-50 hover:text-orange-700 font-medium"
                  >
                    📦 Custom Bids & BOQ Items
                  </button>
                  <button
                    onClick={() => {
                      setUserRole('officer');
                      setActivePage('officer-compare-page');
                      setBidsDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 bg-gradient-to-r from-orange-50 to-amber-50 hover:from-orange-100 hover:to-amber-100 text-orange-950 font-bold border-t flex items-center justify-between"
                  >
                    <span>⚡ Verify Bidder Compliance (SIH)</span>
                    <span className="text-orange-600">→</span>
                  </button>
                </div>
              )}
            </div>

            {/* Sign Up Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  closeAllDropdowns();
                  setSignupDropdownOpen(!signupDropdownOpen);
                }}
                className="flex items-center gap-1 cursor-pointer hover:text-orange-300 py-1 transition"
              >
                <span>{t('signUp')}</span>
                <span className="text-[#f37021] text-[10px]">▼</span>
              </button>
              {signupDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white text-gray-800 shadow-2xl rounded-xl py-2 z-50 text-xs border border-gray-200">
                  <div className="px-3 py-1 text-[10px] font-bold text-gray-500 uppercase border-b bg-gray-50">
                    Registration & Onboarding
                  </div>
                  <button
                    onClick={() => {
                      setActivePage('registration-page', { registrationRole: 'seller' });
                      setSignupDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-orange-50 hover:text-orange-700 font-medium flex items-center gap-2"
                  >
                    <span>🏢</span>
                    <div>
                      <p className="font-bold">Seller Registration</p>
                      <p className="text-[10px] text-gray-500">MSME, Startup & OEM onboarding</p>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      setActivePage('registration-page', { registrationRole: 'buyer' });
                      setSignupDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-blue-50 hover:text-blue-900 font-medium border-t flex items-center gap-2"
                  >
                    <span>🏛️</span>
                    <div>
                      <p className="font-bold">Buyer Registration</p>
                      <p className="text-[10px] text-gray-500">Government Ministries & CPSEs</p>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* User Session / Login Section */}
            {isActuallyLoggedIn ? (
              <div className="flex items-center gap-2">
                {/* Master Switcher button for quick testing */}
                {user.isMaster && (
                  <button
                    onClick={() => {
                      const nextRole = user.role === 'seller' ? 'officer' : 'seller';
                      switchMasterRole(nextRole);
                      setUserRole(nextRole);
                      if (nextRole === 'seller') {
                        setActivePage('seller-page', { sellerTab: 'dashboard-view' });
                      } else {
                        setActivePage('officer-dash-page');
                      }
                    }}
                    className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-2.5 py-1 rounded text-xs flex items-center gap-1 shadow cursor-pointer transition"
                    title="Master ID: Toggle between Seller and Officer mode"
                  >
                    <span>👑⇄</span>
                    <span className="hidden sm:inline">Switch to {user.role === 'seller' ? 'Officer' : 'Seller'}</span>
                  </button>
                )}

                {/* Profile Pill Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => {
                      closeAllDropdowns();
                      setLoginDropdownOpen(!loginDropdownOpen);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-bold text-xs shadow-sm transition cursor-pointer ${
                      user.isMaster
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 border border-amber-300'
                        : user.role === 'officer'
                        ? 'bg-purple-700 hover:bg-purple-800 text-white'
                        : 'bg-[#f37021] hover:bg-[#e05e10] text-white'
                    }`}
                  >
                    <span>{user.isMaster ? '👑' : user.role === 'officer' ? '⚖️' : '🏢'}</span>
                    <span className="font-mono text-[11px] max-w-[120px] truncate">{user.userId}</span>
                    <span className="text-[10px]">▼</span>
                  </button>

                  {loginDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white text-gray-800 shadow-2xl rounded-xl py-2 z-50 text-xs border border-gray-200 divide-y divide-gray-100">
                      <div className="px-3.5 py-2.5 bg-gray-50/80">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500">
                            {user.isMaster ? '👑 Master Session' : 'Active Account'}
                          </span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            user.role === 'officer' ? 'bg-purple-100 text-purple-800' : 'bg-orange-100 text-orange-800'
                          }`}>
                            {user.role.toUpperCase()}
                          </span>
                        </div>
                        <p className="font-extrabold text-gray-900 mt-1 truncate">{user.organization || user.username}</p>
                        <p className="text-[11px] text-gray-500 font-mono">{user.userId}</p>
                      </div>

                      <div className="py-1">
                        {user.role === 'seller' ? (
                          <button
                            onClick={() => {
                              setUserRole('seller');
                              setActivePage('seller-page', { sellerTab: 'dashboard-view' });
                              setLoginDropdownOpen(false);
                            }}
                            className="w-full text-left px-3.5 py-2 hover:bg-orange-50 hover:text-orange-700 font-medium flex items-center gap-2"
                          >
                            <span>🏢</span>
                            <span>Open Seller Console</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setUserRole('officer');
                              setActivePage('officer-dash-page');
                              setLoginDropdownOpen(false);
                            }}
                            className="w-full text-left px-3.5 py-2 hover:bg-blue-50 hover:text-blue-900 font-medium flex items-center gap-2"
                          >
                            <span>⚖️</span>
                            <span>Open Procurement Officer Desk</span>
                          </button>
                        )}

                        {user.isMaster && (
                          <button
                            onClick={() => {
                              const nextRole = user.role === 'seller' ? 'officer' : 'seller';
                              switchMasterRole(nextRole);
                              setUserRole(nextRole);
                              setLoginDropdownOpen(false);
                              if (nextRole === 'seller') {
                                setActivePage('seller-page', { sellerTab: 'dashboard-view' });
                              } else {
                                setActivePage('officer-dash-page');
                              }
                            }}
                            className="w-full text-left px-3.5 py-2 bg-amber-50/70 hover:bg-amber-100/70 text-amber-950 font-bold flex items-center gap-2"
                          >
                            <span>👑⇄</span>
                            <span>Switch to {user.role === 'seller' ? 'Legal Officer Mode' : 'Seller Mode'}</span>
                          </button>
                        )}
                      </div>

                      <div className="pt-1">
                        <button
                          onClick={() => {
                            logout();
                            setLoginDropdownOpen(false);
                            setActivePage('login-page');
                          }}
                          className="w-full text-left px-3.5 py-2 text-red-600 hover:bg-red-50 font-bold flex items-center gap-2"
                        >
                          <span>🚪</span>
                          <span>Sign Out / Switch ID</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Regular Login Dropdown */
              <div className="relative">
                <button
                  onClick={() => {
                    closeAllDropdowns();
                    setLoginDropdownOpen(!loginDropdownOpen);
                  }}
                  className="flex items-center gap-1 bg-[#f37021] hover:bg-[#e05e10] text-white px-3 py-1.5 rounded font-bold shadow-sm transition cursor-pointer"
                >
                  <span>{t('login')}</span>
                  <span className="text-white text-[10px]">▼</span>
                </button>
                {loginDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-60 bg-white text-gray-800 shadow-2xl rounded-xl py-2 z-50 text-xs border border-gray-200">
                    <div className="px-3 py-1 text-[10px] font-bold text-gray-500 uppercase border-b bg-gray-50">
                      Select Portal Role
                    </div>
                    <button
                      onClick={() => {
                        setActivePage('login-page');
                        setLoginDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 bg-yellow-50/70 hover:bg-yellow-100/70 text-blue-950 font-bold flex items-center gap-2 border-b"
                    >
                      <span>🔑</span>
                      <div>
                        <p className="font-extrabold">GeM Master ID / SSO</p>
                        <p className="text-[10px] text-gray-600 font-normal">Login as Seller or Officer</p>
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        setUserRole('seller');
                        setActivePage('seller-page', { sellerTab: 'dashboard-view' });
                        setLoginDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-orange-50 hover:text-orange-700 font-bold flex items-center gap-2"
                    >
                      <span>🏢</span>
                      <span>Seller / Bidder Console</span>
                    </button>
                    <button
                      onClick={() => {
                        setUserRole('officer');
                        setActivePage('officer-dash-page');
                        setLoginDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-blue-50 hover:text-blue-900 font-bold flex items-center gap-2"
                    >
                      <span>⚖️</span>
                      <span>Procurement Officer Desk</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Sub-Navigation Bar matching #082c40 with Categories Mega Menu & Bell */}
      <nav className="bg-[#082c40] text-gray-200 text-xs font-semibold border-t border-[#133d57]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 flex flex-wrap items-center justify-between gap-2">
          {/* Main Navigation Links */}
          <div className="flex flex-wrap items-center gap-1 sm:gap-4 py-2">
            {/* Categories Dropdown / Mega-Menu */}
            <div className="relative">
              <button
                onClick={() => {
                  closeAllDropdowns();
                  setCategoriesDropdownOpen(!categoriesDropdownOpen);
                }}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded hover:bg-[#0c3952] text-white font-bold cursor-pointer transition"
              >
                <span>☰</span>
                <span>{t('categories')}</span>
              </button>
              {categoriesDropdownOpen && (
                <div className="absolute left-0 mt-2 w-80 bg-white text-gray-800 shadow-2xl rounded-xl p-3 z-50 text-xs border border-gray-200">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b">
                    <span className="font-extrabold text-[#062134] text-xs uppercase tracking-wider">
                      Product & Service Categories
                    </span>
                    <button onClick={() => setCategoriesDropdownOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <p className="font-bold text-[10px] text-orange-600 uppercase">Products</p>
                      {[
                        { title: 'Oxygen Gas & Accessories', icon: '🧪' },
                        { title: 'Medical Equipment', icon: '🩺' },
                        { title: 'Computers & IT', icon: '🖥️' },
                        { title: 'Office Furniture', icon: '🪑' },
                        { title: 'Fire Safety Systems', icon: '🧯' },
                        { title: 'Industrial Valves', icon: '⚙️' },
                      ].map((p) => (
                        <button
                          key={p.title}
                          onClick={() => {
                            if (onSearchProduct) onSearchProduct('', p.title);
                            setActivePage('products-page');
                            setCategoriesDropdownOpen(false);
                          }}
                          className="w-full text-left p-1 rounded hover:bg-orange-50 hover:text-orange-900 transition flex items-center gap-1.5 text-[11px]"
                        >
                          <span>{p.icon}</span>
                          <span className="truncate">{p.title}</span>
                        </button>
                      ))}
                    </div>
                    <div className="space-y-1 border-l pl-2">
                      <p className="font-bold text-[10px] text-blue-600 uppercase">Services (Official GeM)</p>
                      {[
                        { title: 'Security Manpower (V2.0)', icon: '👮‍♂️' },
                        { title: 'Cab & Taxi / Vehicle Hiring', icon: '🚗' },
                        { title: 'Manpower Outsourcing (Min Wage)', icon: '👥' },
                        { title: 'Catering Services (Event/Mess)', icon: '🍽️' },
                        { title: 'Goods Transport (Per KM)', icon: '🚚' },
                        { title: 'IT & Hardware AMC', icon: '🖥️' },
                        { title: 'Drone as a Service (V2)', icon: '🚁' },
                        { title: 'Facility Management (LumpSum)', icon: '🧹' },
                      ].map((s) => (
                        <button
                          key={s.title}
                          onClick={() => {
                            setActivePage('services-page');
                            setCategoriesDropdownOpen(false);
                          }}
                          className="w-full text-left p-1 rounded hover:bg-blue-50 hover:text-blue-900 transition flex items-center gap-1.5 text-[11px]"
                        >
                          <span>{s.icon}</span>
                          <span className="truncate">{s.title}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t flex justify-between text-xs font-bold">
                    <button
                      onClick={() => {
                        setActivePage('products-page');
                        setCategoriesDropdownOpen(false);
                      }}
                      className="text-orange-600 hover:text-orange-700 hover:underline"
                    >
                      Browse Products →
                    </button>
                    <button
                      onClick={() => {
                        setActivePage('services-page');
                        setCategoriesDropdownOpen(false);
                      }}
                      className="text-blue-700 hover:text-blue-900 hover:underline"
                    >
                      Browse All Services (30+) →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Features & Benefits */}
            <div className="relative">
              <button
                onClick={() => {
                  closeAllDropdowns();
                  setFeaturesDropdownOpen(!featuresDropdownOpen);
                }}
                className="flex items-center gap-1 cursor-pointer hover:text-white px-2 py-1 transition"
              >
                <span>{t('features')}</span>
                <span className="text-[#f37021] text-[10px]">▼</span>
              </button>
              {featuresDropdownOpen && (
                <div className="absolute left-0 mt-2 w-64 bg-white text-gray-800 shadow-2xl rounded-xl py-2 z-50 text-xs border border-gray-200">
                  <div className="px-3 py-1 text-[10px] font-bold text-gray-500 uppercase border-b bg-gray-50">
                    Platform Advantages
                  </div>
                  <div className="p-2 space-y-2">
                    <div>
                      <p className="font-bold text-blue-950">🏛️ For Government Buyers</p>
                      <p className="text-[10px] text-gray-600">Rich listing, price reasonability tools, GFR Rule 144(xi) compliance.</p>
                    </div>
                    <div>
                      <p className="font-bold text-orange-950">🏢 For Sellers & MSMEs</p>
                      <p className="text-[10px] text-gray-600">Direct national market access, prompt TReDS bill discounting, EMD exemptions.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Business Opportunities */}
            <button
              onClick={() => {
                closeAllDropdowns();
                setActivePage('bids-page', { bidsTab: 'opportunities' });
              }}
              className={`hover:text-white px-2 py-1 cursor-pointer transition ${
                activePage === 'bids-page' ? 'text-yellow-400 font-bold' : ''
              }`}
            >
              Business Opportunities
            </button>

            {/* Seller On GeM */}
            <div className="relative">
              <button
                onClick={() => {
                  closeAllDropdowns();
                  setSellerOnGemOpen(!sellerOnGemOpen);
                }}
                className="flex items-center gap-1 cursor-pointer hover:text-white px-2 py-1 transition"
              >
                <span>{t('sellerOnGem')}</span>
                <span className="text-[#f37021] text-[10px]">▼</span>
              </button>
              {sellerOnGemOpen && (
                <div className="absolute left-0 mt-2 w-64 bg-white text-gray-800 shadow-2xl rounded-xl py-2 z-50 text-xs border border-gray-200">
                  <button
                    onClick={() => {
                      setUserRole('seller');
                      setActivePage('seller-page', { sellerTab: 'dashboard-view' });
                      setSellerOnGemOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-orange-50 hover:text-orange-700 font-medium"
                  >
                    🏢 Seller Compliance Desk (SIH26100)
                  </button>
                  <button
                    onClick={() => {
                      setUserRole('seller');
                      setActivePage('seller-page', { sellerTab: 'upload-view' });
                      setSellerOnGemOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-orange-50 hover:text-orange-700 font-medium flex items-center justify-between"
                  >
                    <span>📄 🤖 DocScrutiny AI & OCR</span>
                    <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-1.5 py-0.5 rounded">Separate AI</span>
                  </button>
                  <button
                    onClick={() => {
                      setUserRole('seller');
                      setActivePage('seller-page', { sellerTab: 'checklist-view' });
                      setSellerOnGemOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-orange-50 hover:text-orange-700 font-medium"
                  >
                    ✅ Pre-Bid Compliance Checklist
                  </button>
                  <button
                    onClick={() => {
                      setActivePage('registration-page', { registrationRole: 'seller' });
                      setSellerOnGemOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-orange-50 hover:text-orange-700 font-medium border-t"
                  >
                    📋 MSME & Startup Onboarding
                  </button>
                </div>
              )}
            </div>

            {/* View Contracts */}
            <div className="relative">
              <button
                onClick={() => {
                  closeAllDropdowns();
                  setContractsDropdownOpen(!contractsDropdownOpen);
                }}
                className="flex items-center gap-1 cursor-pointer hover:text-white px-2 py-1 transition"
              >
                <span>{t('viewContracts')}</span>
                <span className="text-[#f37021] text-[10px]">▼</span>
              </button>
              {contractsDropdownOpen && (
                <div className="absolute left-0 mt-2 w-56 bg-white text-gray-800 shadow-2xl rounded-xl py-2 z-50 text-xs border border-gray-200">
                  <button
                    onClick={() => {
                      setActivePage('audit-page');
                      setContractsDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-emerald-50 hover:text-emerald-900 font-medium"
                  >
                    📜 Immutable Audit Ledger
                  </button>
                  <button
                    onClick={() => {
                      setActivePage('bids-page', { bidsTab: 'results' });
                      setContractsDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-blue-50 hover:text-blue-900 font-medium"
                  >
                    📑 Active Contract Awards
                  </button>
                </div>
              )}
            </div>

            {/* CPPP */}
            <div className="relative">
              <button
                onClick={() => {
                  closeAllDropdowns();
                  setCpppDropdownOpen(!cpppDropdownOpen);
                }}
                className="flex items-center gap-1 cursor-pointer hover:text-white px-2 py-1 transition"
              >
                <span>{t('cppp')}</span>
                <span className="text-[#f37021] text-[10px]">▼</span>
              </button>
              {cpppDropdownOpen && (
                <div className="absolute left-0 mt-2 w-64 bg-white text-gray-800 shadow-2xl rounded-xl p-3 z-50 text-xs border border-gray-200">
                  <p className="font-bold text-[#062134]">Central Public Procurement Portal</p>
                  <p className="text-[10px] text-gray-500 mt-1">
                    CPPP eProcurement tender synchronization and e-Publishing service gateway.
                  </p>
                  <button
                    onClick={() => {
                      setActivePage('bids-page', { bidsTab: 'cppp' });
                      setCpppDropdownOpen(false);
                    }}
                    className="mt-2 text-blue-600 font-bold text-[11px] hover:underline cursor-pointer"
                  >
                    View CPPP Integrated Tenders →
                  </button>
                </div>
              )}
            </div>

            {/* Training Courses & LMS */}
            <button
              onClick={() => {
                closeAllDropdowns();
                setActivePage('training-page');
              }}
              className={`hover:text-white px-2 py-1 cursor-pointer transition flex items-center gap-1.5 ${
                activePage === 'training-page' ? 'text-amber-300 font-bold bg-[#0c3952] rounded' : ''
              }`}
              title="GeM E-Learning & Training Portal (Courses, Webinars, Certifications)"
            >
              <span>🎓</span>
              <span>Training Courses & LMS</span>
              <span className="bg-amber-400 text-blue-950 text-[9px] font-black px-1 rounded-xs ml-0.5">Govt Cert</span>
            </button>
          </div>

          {/* Right Highlights: New on GeM + Bell + SIH AI Gateway */}
          <div className="flex items-center space-x-3 py-1.5">
            {/* SIH AI Statutory Engine Rapid Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  closeAllDropdowns();
                  setComplianceDropdownOpen(!complianceDropdownOpen);
                }}
                className="bg-gradient-to-r from-[#e67e22] to-[#d35400] text-white px-2.5 py-1 rounded font-bold text-[11px] shadow hover:brightness-110 transition flex items-center gap-1.5 cursor-pointer"
              >
                <span>{t('aiEngine')}</span>
                <span className="bg-yellow-300 text-blue-950 font-black text-[9px] px-1 rounded">SIH</span>
                <span className="text-[9px]">▼</span>
              </button>
              {complianceDropdownOpen && (
                <div className="absolute left-0 mt-2 w-72 max-w-[calc(100vw-2rem)] bg-white text-gray-800 shadow-2xl rounded-xl p-2 z-50 text-xs border border-orange-200">
                  <div className="p-2 border-b bg-orange-50/60 rounded-t-lg">
                    <p className="font-extrabold text-[#162c5b] text-[11px]">Smart India Hackathon 2026 (SIH26100)</p>
                    <p className="text-[10px] text-gray-600">Automated Statutory Verification Engine</p>
                  </div>
                  <div className="py-1 space-y-1">
                    <button
                      onClick={() => {
                        setUserRole('seller');
                        setActivePage('seller-page', { sellerTab: 'dashboard-view' });
                        setComplianceDropdownOpen(false);
                      }}
                      className="w-full text-left p-2 rounded-lg hover:bg-orange-50 font-medium flex items-center justify-between"
                    >
                      <div>
                        <p className="font-bold">🏢 Vendor Self-Service Desk</p>
                        <p className="text-[10px] text-gray-500">Readiness score, GST, PAN, Udyam</p>
                      </div>
                      <span className="text-orange-600">→</span>
                    </button>
                    <button
                      onClick={() => {
                        setUserRole('seller');
                        setActivePage('seller-page', { sellerTab: 'upload-view' });
                        setComplianceDropdownOpen(false);
                      }}
                      className="w-full text-left p-2 rounded-lg bg-purple-50/60 hover:bg-purple-100/70 font-medium flex items-center justify-between border border-purple-200/60"
                    >
                      <div>
                        <p className="font-extrabold text-purple-950 flex items-center gap-1.5">
                          <span>🤖 DocScrutiny AI Console</span>
                          <span className="text-[9px] bg-purple-600 text-white px-1.5 py-0.2 rounded-full">Separate AI</span>
                        </p>
                        <p className="text-[10px] text-purple-800">Doc verification, expiry check & competitor bid comparison</p>
                      </div>
                      <span className="text-purple-700 font-bold">→</span>
                    </button>
                    <button
                      onClick={() => {
                        setUserRole('officer');
                        setActivePage('officer-dash-page');
                        setComplianceDropdownOpen(false);
                      }}
                      className="w-full text-left p-2 rounded-lg hover:bg-blue-50 font-medium flex items-center justify-between"
                    >
                      <div>
                        <p className="font-bold">⚖️ Officer Scrutiny Desk</p>
                        <p className="text-[10px] text-gray-500">Explainable AI Scoring & GFR 144(xi)</p>
                      </div>
                      <span className="text-blue-900">→</span>
                    </button>
                    <button
                      onClick={() => {
                        setUserRole('auditor');
                        setActivePage('audit-page');
                        setComplianceDropdownOpen(false);
                      }}
                      className="w-full text-left p-2 rounded-lg hover:bg-emerald-50 font-medium flex items-center justify-between border-t"
                    >
                      <div>
                        <p className="font-bold">📜 Immutable Audit Trail</p>
                        <p className="text-[10px] text-gray-500">Cryptographic Verification Ledger</p>
                      </div>
                      <span className="text-emerald-700">→</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* New on GeM badge */}
            <div
              onClick={() => {
                closeAllDropdowns();
                setNotificationsOpen(!notificationsOpen);
              }}
              className="flex items-center gap-1 text-gray-300 hover:text-white cursor-pointer select-none"
            >
              <span className="bg-[#e53935] text-white text-[9px] font-black px-1.5 py-0.5 rounded">NEW</span>
              <span>New on GeM</span>
            </div>

            {/* Bell Icon with '03' badge */}
            <div className="relative">
              <button
                onClick={() => {
                  closeAllDropdowns();
                  setNotificationsOpen(!notificationsOpen);
                }}
                className="relative cursor-pointer text-gray-300 hover:text-white p-1"
                title="Notifications"
              >
                <span className="text-sm">🔔</span>
                <span className="absolute -top-1 -right-1 bg-[#e53935] text-white text-[9px] font-bold px-1 rounded-full">
                  03
                </span>
              </button>
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white text-gray-800 shadow-2xl rounded-xl p-3 z-50 text-xs border border-gray-200">
                  <div className="flex items-center justify-between border-b pb-1.5 mb-2">
                    <span className="font-extrabold text-[#062134]">GeM Portal Bulletins</span>
                    <button onClick={() => setNotificationsOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                  </div>
                  <div className="space-y-2 text-[11px]">
                    <div className="p-1.5 bg-blue-50 rounded border border-blue-100">
                      <p className="font-bold text-blue-900">🔔 TReDS Integration Live</p>
                      <p className="text-gray-600 text-[10px]">Instant MSME bill factoring across all CPSE orders.</p>
                    </div>
                    <div className="p-1.5 bg-orange-50 rounded border border-orange-100">
                      <p className="font-bold text-orange-900">⚡ SIH 2026 AI Statutory Verification</p>
                      <p className="text-gray-600 text-[10px]">Active verification pipeline for Rule 144(xi) and Make-in-India.</p>
                    </div>
                    <div className="p-1.5 bg-green-50 rounded border border-green-100">
                      <p className="font-bold text-green-900">🌿 EcoMark Standards</p>
                      <p className="text-gray-600 text-[10px]">Preferential indexing for verified green goods.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* 4. Live Statutory Announcement Ticker (Unified with Header so it slides together) */}
      <div className="bg-[#f0f6fc] border-b border-[#d0e1f9] py-1.5 px-4 overflow-hidden shadow-2xs">
        <div className="max-w-[1400px] mx-auto flex items-center">
          <div className="overflow-hidden whitespace-nowrap w-full">
            <p className="text-xs font-semibold text-[#0056b3] inline-block animate-pulse">
              🔔 GeM is linked with TReDS Exchanges for sharing CPSE purchases from MSMEs with financiers, encouraging cheaper and quicker financing... • Smart India Hackathon 2026: AI Statutory Compliance Verification Engine (SIH26100) Active!
            </p>
          </div>
        </div>
      </div>

      {/* Support Ticket Submission Modal */}
      {ticketModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white text-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-5 space-y-4 border border-gray-200">
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">🎫</span>
                <div>
                  <h4 className="font-bold text-sm text-[#062134]">Raise a Support Ticket</h4>
                  <p className="text-[10px] text-gray-500">Government e Marketplace Helpdesk</p>
                </div>
              </div>
              <button onClick={() => setTicketModalOpen(false)} className="text-gray-400 hover:text-gray-600 font-bold">✕</button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Issue Category</label>
                <select className="w-full border rounded-lg p-2 bg-gray-50 text-gray-800 focus:outline-none focus:border-blue-500">
                  <option>Statutory Compliance & Rule 144(xi)</option>
                  <option>Seller Registration & MSME Udyam</option>
                  <option>Tender Bid Submission / EMD</option>
                  <option>Payment & TReDS Settlement</option>
                </select>
              </div>
              <div>
                <label className="font-bold text-gray-700 block mb-1">Describe Issue / Query</label>
                <textarea
                  rows={3}
                  placeholder="Explain your inquiry in detail..."
                  className="w-full border rounded-lg p-2 text-gray-800 focus:outline-none focus:border-blue-500"
                ></textarea>
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-2 border-t">
              <button
                onClick={() => setTicketModalOpen(false)}
                className="px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert("Ticket #GEM-2026-" + Math.floor(100000 + Math.random() * 900000) + " successfully logged with GeM Helpdesk!");
                  setTicketModalOpen(false);
                }}
                className="px-4 py-1.5 text-xs bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg shadow-sm"
              >
                Submit Ticket
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Training & LMS Courses Modal */}
      {trainingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white text-gray-800 rounded-2xl shadow-2xl max-w-xl w-full p-6 space-y-4 border border-gray-200">
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🎓</span>
                <div>
                  <h4 className="font-extrabold text-sm text-[#062134]">GeM Interactive LMS & Training Courses</h4>
                  <p className="text-[10px] text-gray-500">Free Online Learning Modules for Buyers & Sellers</p>
                </div>
              </div>
              <button onClick={() => setTrainingModalOpen(false)} className="text-gray-400 hover:text-gray-600 font-bold cursor-pointer">✕</button>
            </div>
            <div className="space-y-2.5 text-xs">
              {[
                {
                  code: 'CRS-101',
                  title: 'Seller Onboarding, Catalog Upload & Brand Approval',
                  target: 'Sellers & MSMEs',
                  duration: '45 mins • Self-Paced',
                  level: 'Beginner',
                },
                {
                  code: 'CRS-202',
                  title: 'Statutory Verification & GFR Rule 144(xi) Land Border Compliance',
                  target: 'Bidders & Legal Officers',
                  duration: '30 mins • Interactive',
                  level: 'Intermediate',
                },
                {
                  code: 'CRS-303',
                  title: 'Direct Purchase, L1 Comparison & Bid / RA Creation for Government Officers',
                  target: 'Procurement Officers & DDOs',
                  duration: '60 mins • Live Webinar',
                  level: 'Advanced',
                },
                {
                  code: 'CRS-404',
                  title: 'TReDS Bill Factoring, Invoice Discounting & Milestone Payments',
                  target: 'Finance Managers',
                  duration: '35 mins • Self-Paced',
                  level: 'Essential',
                },
              ].map((crs) => (
                <div key={crs.code} className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between hover:bg-orange-50/60 transition">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[10px] font-bold text-blue-900 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                        {crs.code}
                      </span>
                      <span className="text-[10px] text-orange-700 font-bold bg-orange-50 px-1.5 py-0.2 rounded">
                        {crs.target}
                      </span>
                    </div>
                    <p className="font-extrabold text-gray-900 text-xs">{crs.title}</p>
                    <p className="text-[10px] text-gray-500">{crs.duration} • Level: {crs.level}</p>
                  </div>
                  <button
                    onClick={() => {
                      setActivePage('training-page');
                      setTrainingModalOpen(false);
                    }}
                    className="bg-[#062134] hover:bg-[#0c3952] text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-xs transition cursor-pointer"
                  >
                    Enroll & Launch →
                  </button>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center pt-2 border-t text-[11px]">
              <span className="text-gray-500">Official Government of India certification upon completion</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setActivePage('training-page');
                    setTrainingModalOpen(false);
                  }}
                  className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg cursor-pointer flex items-center gap-1 shadow-xs"
                >
                  <span>🎓 Open Full Interactive Portal</span>
                  <span>→</span>
                </button>
                <button
                  onClick={() => setTrainingModalOpen(false)}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
