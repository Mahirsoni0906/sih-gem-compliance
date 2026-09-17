import React, { useState } from 'react';
import { GeMStarLogo, Commemorative10Graphic, ProductCutouts } from './common/GeMAssets';
import { useLanguage } from '../context/LanguageContext';
import { OFFICIAL_GEM_SERVICES } from '../data/gemServicesData';
import {
  Sparkles,
  Compass,
  Store,
  Landmark,
  Rocket,
  Layers,
  Leaf,
  ShieldCheck,
  Building2,
  Scale,
  Flame,
  PackageCheck,
  CreditCard,
  Monitor,
  FileCheck,
  Printer,
  BadgeCheck,
  Handshake,
  Zap,
  Shield,
  HeartHandshake,
  X,
  Bell,
  Camera,
  Play,
  User,
  Accessibility,
} from 'lucide-react';
import { EnterpriseIconBadge } from './common/ProfessionalIcon';

interface LandingPageProps {
  onEnterSeller: () => void;
  onEnterOfficer: () => void;
  onEnterAudit: () => void;
  onEnterRisk?: () => void;
  onOpenProducts?: (category?: string) => void;
  onOpenBids?: (tab?: string) => void;
  onOpenServices?: (category?: string) => void;
  onOpenTraining?: () => void;
  onOpenChat?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterSeller,
  onEnterOfficer,
  onEnterAudit,
  onEnterRisk,
  onOpenProducts,
  onOpenBids,
  onOpenServices,
  onOpenTraining,
  onOpenChat,
}) => {
  const { t, language } = useLanguage();
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);
  const [socialTab, setSocialTab] = useState<'x' | 'fb'>('x');
  const [homeServicesTab, setHomeServicesTab] = useState<'TRENDING' | 'EMERGING'>('TRENDING');
  const [activeTestimonial, setActiveTestimonial] = useState(1); // 2nd dot active as in screenshot
  const [initiativesModalOpen, setInitiativesModalOpen] = useState(false);
  const [notificationsModalOpen, setNotificationsModalOpen] = useState(false);

  // 8 Outlet Store Banners matching media_1789184091731.png
  const outletStores = [
    {
      id: 'saras',
      title: 'The Saras Collection',
      tag: 'Handicrafts & Rural Artisans',
      sub: 'A showcase of rural SHG women artisans',
      icon: <Store className="w-8 h-8 text-rose-900/90 dark:text-rose-200" />,
      cardClass: 'bg-gradient-to-r from-pink-100 via-rose-100 to-pink-200 border-pink-300 dark:from-[#2e0e1e] dark:via-[#20101c] dark:to-[#131728] dark:border-rose-500/40 hover:border-pink-400 dark:hover:border-rose-400',
      titleClass: 'text-rose-950 dark:text-rose-100',
      subClass: 'text-rose-900/85 dark:text-rose-200/85',
      tagClass: 'text-rose-950 dark:text-rose-300',
      dividerClass: 'border-rose-950/15 dark:border-rose-500/30',
      exploreClass: 'text-rose-900 dark:text-rose-300 group-hover:text-rose-700 dark:group-hover:text-rose-200',
    },
    {
      id: 'odop',
      title: 'ODOP GeM BAZAAR',
      tag: 'One District One Product',
      sub: 'Empowering district indigenous specialties',
      icon: <Landmark className="w-8 h-8 text-white/95 dark:text-blue-200" />,
      cardClass: 'bg-gradient-to-r from-[#0d47a1] via-[#1565c0] to-[#1976d2] border-blue-500 dark:from-[#0d2757] dark:via-[#112445] dark:to-[#0f172a] dark:border-blue-500/50 hover:border-blue-400 dark:hover:border-blue-400',
      titleClass: 'text-white dark:text-blue-100',
      subClass: 'text-blue-100/90 dark:text-blue-200/90',
      tagClass: 'text-blue-100 dark:text-blue-300',
      dividerClass: 'border-white/20 dark:border-blue-500/30',
      exploreClass: 'text-white dark:text-blue-200 group-hover:text-blue-200 dark:group-hover:text-white',
    },
    {
      id: 'startup',
      title: 'Startup Runway',
      tag: 'Finest Indian Startups',
      sub: 'Discover innovative products from DPIIT startups',
      icon: <Rocket className="w-8 h-8 text-indigo-900/90 dark:text-indigo-200" />,
      cardClass: 'bg-gradient-to-r from-slate-100 via-blue-50 to-indigo-100 border-indigo-200 dark:from-[#112042] dark:via-[#131b35] dark:to-[#0f172a] dark:border-indigo-500/40 hover:border-indigo-300 dark:hover:border-indigo-400',
      titleClass: 'text-indigo-950 dark:text-indigo-100',
      subClass: 'text-indigo-900/85 dark:text-indigo-200/85',
      tagClass: 'text-indigo-950 dark:text-indigo-300',
      dividerClass: 'border-indigo-950/15 dark:border-indigo-500/30',
      exploreClass: 'text-indigo-900 dark:text-indigo-300 group-hover:text-indigo-700 dark:group-hover:text-indigo-200',
    },
    {
      id: 'aatmanirbhar',
      title: 'The Aabhaar Collection',
      tag: 'Aatmanirbhar Bharat Showcase',
      sub: "Celebrating India's Artisans & Master Weavers",
      icon: <ShieldCheck className="w-8 h-8 text-amber-950/90 dark:text-amber-200" />,
      cardClass: 'bg-gradient-to-r from-amber-100/90 via-orange-50 to-emerald-100/80 border-amber-300 dark:from-[#2e1d0a] dark:via-[#1d1b1f] dark:to-[#0e2417] dark:border-amber-500/40 hover:border-amber-400 dark:hover:border-amber-400',
      titleClass: 'text-amber-950 dark:text-amber-100',
      subClass: 'text-amber-900/85 dark:text-amber-200/85',
      tagClass: 'text-amber-950 dark:text-amber-300',
      dividerClass: 'border-amber-950/15 dark:border-amber-500/30',
      exploreClass: 'text-amber-900 dark:text-amber-300 group-hover:text-amber-700 dark:group-hover:text-amber-200',
    },
    {
      id: 'handloom',
      title: 'Handloom & Textiles',
      tag: 'Rich Indigenous Weaves',
      sub: 'Authentic Indian Khadi & Silk Loomcraft',
      icon: <Layers className="w-8 h-8 text-orange-950/90 dark:text-orange-200" />,
      cardClass: 'bg-gradient-to-r from-rose-100 via-amber-100 to-yellow-100 border-orange-300 dark:from-[#2f160d] dark:via-[#22171c] dark:to-[#121625] dark:border-orange-500/40 hover:border-orange-400 dark:hover:border-orange-400',
      titleClass: 'text-orange-950 dark:text-orange-100',
      subClass: 'text-orange-900/85 dark:text-orange-200/85',
      tagClass: 'text-orange-950 dark:text-orange-300',
      dividerClass: 'border-orange-950/15 dark:border-orange-500/30',
      exploreClass: 'text-orange-900 dark:text-orange-300 group-hover:text-orange-700 dark:group-hover:text-orange-200',
    },
    {
      id: 'tribal',
      title: 'Tribal & Khadi India',
      tag: 'Forest Produce & Crafts',
      sub: 'TRIFED certified indigenous heritage',
      icon: <Compass className="w-8 h-8 text-amber-950/90 dark:text-amber-200" />,
      cardClass: 'bg-gradient-to-r from-amber-100 via-orange-100 to-amber-200 border-amber-400 dark:from-[#2e1d08] dark:via-[#201815] dark:to-[#121624] dark:border-amber-500/40 hover:border-amber-500 dark:hover:border-amber-400',
      titleClass: 'text-amber-950 dark:text-amber-100',
      subClass: 'text-amber-900/85 dark:text-amber-200/85',
      tagClass: 'text-amber-950 dark:text-amber-300',
      dividerClass: 'border-amber-950/15 dark:border-amber-500/30',
      exploreClass: 'text-amber-900 dark:text-amber-300 group-hover:text-amber-700 dark:group-hover:text-amber-200',
    },
    {
      id: 'womaniya',
      title: 'WOMANIYA ON GEM',
      tag: 'Women Entrepreneurs',
      sub: 'In pursuit of life, liberty and happiness',
      icon: <Sparkles className="w-8 h-8 text-white/95 dark:text-pink-200" />,
      cardClass: 'bg-gradient-to-r from-[#ff4081] via-[#f50057] to-[#c51162] border-rose-400 dark:from-[#3a0820] dark:via-[#250d1e] dark:to-[#141224] dark:border-rose-500/50 hover:border-rose-400 dark:hover:border-rose-400',
      titleClass: 'text-white dark:text-pink-100',
      subClass: 'text-pink-100/90 dark:text-pink-200/90',
      tagClass: 'text-pink-100 dark:text-pink-300',
      dividerClass: 'border-white/20 dark:border-pink-500/30',
      exploreClass: 'text-white dark:text-pink-200 group-hover:text-pink-200 dark:group-hover:text-white',
    },
    {
      id: 'millet',
      title: 'Millet (Shree Anna)',
      tag: 'Superfoods & Agri Produce',
      sub: 'Nutri-cereals promoting health & farmers',
      icon: <Leaf className="w-8 h-8 text-white/95 dark:text-emerald-200" />,
      cardClass: 'bg-gradient-to-r from-[#2e7d32] via-[#388e3c] to-[#1b5e20] border-green-600 dark:from-[#083318] dark:via-[#0e271d] dark:to-[#0f172a] dark:border-emerald-500/50 hover:border-green-500 dark:hover:border-emerald-400',
      titleClass: 'text-white dark:text-emerald-100',
      subClass: 'text-green-100/90 dark:text-emerald-200/90',
      tagClass: 'text-green-200 dark:text-emerald-300',
      dividerClass: 'border-white/20 dark:border-emerald-500/30',
      exploreClass: 'text-white dark:text-emerald-200 group-hover:text-emerald-200 dark:group-hover:text-white',
    },
  ];


  // 6 Popular Product Categories matching media_1789184098951.png & media_1789184104801.png
  const productCategories = [
    {
      title: 'OXYGEN GAS & ACCESSORIES',
      items: [
        'Oxygen Concentrator',
        'Oxygen Flow Meter',
        'Compressed oxygen IS:309',
        'O2 Gas Cylinders - Steel',
        'HF Nasal O2 Therapy Unit',
      ],
      isHighlighted: true, // Cyan outline border as in screenshot
      component: <ProductCutouts.OxygenCylinder />,
    },
    {
      title: 'MEDICAL',
      items: [
        'Hand Sanitizer',
        'Air Pollution Mask',
        'Surgical Gloves',
        'Covid-19 Kit for...',
        'Digital BP Monitors',
      ],
      isHighlighted: false,
      component: <ProductCutouts.BPMonitor />,
    },
    {
      title: 'SARAS COLLECTION',
      items: [
        'Handicrafts',
        'Handloom Texti..',
        'Personal Care..',
        'Accessories',
        'Brass Artware',
      ],
      isHighlighted: false,
      component: <ProductCutouts.SarasLantern />,
    },
    {
      title: 'FURNITURE',
      items: [
        'Office Chair',
        'Computer Desk',
        'Lounge Chair',
        'Storage Rack',
        'Executive Tables',
      ],
      isHighlighted: false,
      component: <ProductCutouts.OfficeChair />,
    },
    {
      title: 'FIRE SAFETY',
      items: [
        'Fire Extinguishers',
        'Sprinklers',
        'Smoke Detectors',
        'Fire Alarms',
        'Safety Blankets',
      ],
      isHighlighted: false,
      component: <ProductCutouts.FireExtinguisher />,
    },
    {
      title: 'COMPUTERS',
      items: [
        'Desktop Computer',
        'Computer Monitor',
        'PC Software',
        'Computer Printer',
        'All-in-One Workstations',
      ],
      isHighlighted: false,
      component: <ProductCutouts.ComputerWorkstation />,
    },
  ];

  // 5 Popular Service Categories matching media_1789184110611.png
  const serviceCategories = [
    {
      title: 'Security Manpower',
      sub: 'Guards, Armed & Unarmed Security',
      svg: (
        <svg viewBox="0 0 100 100" className="w-12 h-12 stroke-[#f37021] fill-none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          {/* Guard Cap */}
          <path d="M30 38 Q50 30 70 38 L65 24 Q50 20 35 24 Z" />
          <path d="M25 40 Q50 34 75 40" strokeWidth="4" />
          {/* Head & Neck */}
          <ellipse cx="50" cy="48" rx="14" ry="12" />
          <line x1="50" y1="60" x2="50" y2="70" />
          {/* Torso & Shoulders with Epaulettes */}
          <path d="M22 88 L34 70 L66 70 L78 88" />
          <line x1="28" y1="74" x2="38" y2="72" strokeWidth="4" />
          <line x1="72" y1="74" x2="62" y2="72" strokeWidth="4" />
          {/* Tie */}
          <polygon points="50,70 54,80 50,88 46,80" fill="#f37021" />
        </svg>
      ),
    },
    {
      title: 'Catering',
      sub: 'Institutional Food & Canteen Services',
      svg: (
        <svg viewBox="0 0 100 100" className="w-12 h-12 stroke-[#f37021] fill-none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          {/* Cloche Dome */}
          <circle cx="50" cy="24" r="5" fill="#f37021" />
          <path d="M20 58 Q20 32 50 32 Q80 32 80 58 Z" />
          <line x1="14" y1="62" x2="86" y2="62" strokeWidth="4" />
          {/* Hand holding platter */}
          <path d="M25 74 Q50 78 75 74" />
          <path d="M30 74 Q35 84 50 84 Q65 84 70 74" />
        </svg>
      ),
    },
    {
      title: 'Human Resource',
      sub: 'Clerical, Technical & Executive Staff',
      svg: (
        <svg viewBox="0 0 100 100" className="w-12 h-12 stroke-[#f37021] fill-none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          {/* Central Person */}
          <circle cx="50" cy="42" r="8" />
          <path d="M38 64 Q50 56 62 64" />
          {/* Left Person */}
          <circle cx="30" cy="50" r="6" />
          <path d="M20 70 Q30 64 40 70" />
          {/* Right Person */}
          <circle cx="70" cy="50" r="6" />
          <path d="M60 70 Q70 64 80 70" />
          {/* Circular Process Arrows */}
          <path d="M18 42 A38 38 0 1 1 82 42" strokeDasharray="6,4" />
          <polygon points="86,40 82,48 76,42" fill="#f37021" />
        </svg>
      ),
    },
    {
      title: 'Goods and Transport Service',
      sub: 'Freight, Logistics & Movers',
      svg: (
        <svg viewBox="0 0 100 100" className="w-12 h-12 stroke-[#f37021] fill-none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          {/* Delivery Truck Body */}
          <rect x="20" y="36" width="38" height="34" rx="2" />
          {/* Cargo boxes */}
          <rect x="25" y="42" width="12" height="12" strokeDasharray="2,2" />
          <rect x="41" y="42" width="12" height="12" strokeDasharray="2,2" />
          {/* Cab */}
          <path d="M58 48 L72 48 L80 60 L80 70 L58 70 Z" />
          <line x1="62" y1="52" x2="72" y2="52" />
          {/* Wheels */}
          <circle cx="34" cy="74" r="7" fill="#ffffff" />
          <circle cx="34" cy="74" r="3" fill="#f37021" />
          <circle cx="70" cy="74" r="7" fill="#ffffff" />
          <circle cx="70" cy="74" r="3" fill="#f37021" />
          {/* Speed Lines */}
          <line x1="8" y1="44" x2="16" y2="44" />
          <line x1="6" y1="52" x2="16" y2="52" />
          <line x1="10" y1="60" x2="16" y2="60" />
        </svg>
      ),
    },
    {
      title: 'Vehicle Hiring',
      sub: 'Commercial, SUVs & EV Fleets',
      svg: (
        <svg viewBox="0 0 100 100" className="w-12 h-12 stroke-[#f37021] fill-none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          {/* Car Body */}
          <path d="M20 54 L30 42 L66 42 L76 54 L84 56 L84 64 L16 64 L16 56 Z" />
          {/* Windows */}
          <line x1="33" y1="45" x2="48" y2="45" />
          <line x1="52" y1="45" x2="65" y2="45" />
          {/* Wheels */}
          <circle cx="30" cy="65" r="6" fill="#ffffff" />
          <circle cx="30" cy="65" r="2.5" fill="#f37021" />
          <circle cx="70" cy="65" r="6" fill="#ffffff" />
          <circle cx="70" cy="65" r="2.5" fill="#f37021" />
          {/* Hand beneath supporting car */}
          <path d="M12 78 Q45 86 84 76" strokeWidth="3.5" />
          <path d="M18 78 Q22 88 38 88 L68 88" />
        </svg>
      ),
    },
    {
      title: 'Facility Management',
      sub: 'Housekeeping, Sanitation & Waste (LumpSum)',
      svg: (
        <svg viewBox="0 0 100 100" className="w-12 h-12 stroke-[#f37021] fill-none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <rect x="25" y="32" width="50" height="52" rx="3" />
          <line x1="36" y1="44" x2="46" y2="44" strokeWidth="2.5" />
          <line x1="54" y1="44" x2="64" y2="44" strokeWidth="2.5" />
          <line x1="36" y1="56" x2="46" y2="56" strokeWidth="2.5" />
          <line x1="54" y1="56" x2="64" y2="56" strokeWidth="2.5" />
          <line x1="36" y1="68" x2="64" y2="68" strokeWidth="2.5" />
          <path d="M44 24 L56 24 L50 16 Z" fill="#f37021" />
          <circle cx="76" cy="24" r="4" fill="#f37021" />
        </svg>
      ),
    },
    {
      title: 'IT & Hardware AMC',
      sub: 'Computers, Data Centers & Cloud MSP',
      svg: (
        <svg viewBox="0 0 100 100" className="w-12 h-12 stroke-[#f37021] fill-none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <rect x="18" y="24" width="64" height="44" rx="3" />
          <rect x="25" y="31" width="50" height="30" rx="1" />
          <line x1="50" y1="68" x2="50" y2="78" strokeWidth="4" />
          <line x1="34" y1="78" x2="66" y2="78" strokeWidth="4" />
          <circle cx="50" cy="46" r="6" fill="#f37021" />
        </svg>
      ),
    },
    {
      title: 'Drone as a Service (V2)',
      sub: 'Aerial GIS Mapping & Surveillance',
      svg: (
        <svg viewBox="0 0 100 100" className="w-12 h-12 stroke-[#f37021] fill-none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="50" cy="50" r="11" />
          <circle cx="50" cy="50" r="4.5" fill="#f37021" />
          <line x1="42" y1="42" x2="26" y2="26" strokeWidth="3.5" />
          <line x1="58" y1="42" x2="74" y2="26" strokeWidth="3.5" />
          <line x1="42" y1="58" x2="26" y2="74" strokeWidth="3.5" />
          <line x1="58" y1="58" x2="74" y2="74" strokeWidth="3.5" />
          <ellipse cx="26" cy="26" rx="11" ry="4" />
          <ellipse cx="74" cy="26" rx="11" ry="4" />
          <ellipse cx="26" cy="74" rx="11" ry="4" />
          <ellipse cx="74" cy="74" rx="11" ry="4" />
        </svg>
      ),
    },
  ];

  // 5 Customer Testimonials for dot pagination
  const testimonials = [
    {
      quote: "GeM has revolutionized public procurement for our PSU. The transparency in vendor evaluation and strict enforcement of GFR Rule 144(xi) has brought unparalleled integrity to our bidding process.",
      name: "Smt. Anuradha Sen",
      designation: "Executive Director (Procurement), ONGC",
    },
    {
      quote: "The main advantage of GeM is online access to all the government departments all over India. New features like custom bids and BOQs are a real boon. Dashboards are seller-friendly for monitoring the supplies and payment. Grievance redressal through the incident management process is great. We look forward to doing more business on GeM.",
      name: "Shri V. Sriganesh",
      designation: "CEO, Legend Trading",
    },
    {
      quote: "As a recognized MSME, the purchase preference policy on GeM and automatic exemption from EMD gave us the breakthrough we needed. Timely payments via TReDS have eliminated our working capital worries.",
      name: "Shri Rajesh Kumar Sharma",
      designation: "Managing Director, Bharat Precision Instruments",
    },
    {
      quote: "Handling large turnkey defence contracts requires 100% statutory compliance. GeM's automated cross-verification of GSTIN, PAN, and Udyam ensures only verified genuine manufacturers bid for critical tenders.",
      name: "Col. Sanjeev Rawat",
      designation: "Procurement Committee Chair, Ministry of Defence",
    },
    {
      quote: "The Saras Collection and ODOP Bazaar on GeM opened direct national institutional markets for our rural tribal self-help groups. Our artisans now supply directly to Raj Bhavans and Central Ministries!",
      name: "Smt. Kamla Bai",
      designation: "Lead Facilitator, Saras Rural Artisans Federation",
    },
  ];

  return (
    <div id="main-content" className="flex-1 flex flex-col bg-white text-gray-800 font-sans relative">
      {/* 2. Hero Banner Carousel: 10 Years of GeM (भरोसे और बदलाव का दशक) - WHITE BACKGROUND */}
      <section className="relative bg-white text-[#0c2340] py-8 md:py-12 px-4 sm:px-8 overflow-hidden border-b-4 border-[#ff9933]">
        {/* Tricolor flowing ribbons in background */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <svg className="w-full h-full" viewBox="0 0 1400 400" preserveAspectRatio="none">
            <path d="M0,160 C300,80 600,280 900,120 C1100,20 1300,180 1400,100" fill="none" stroke="#ff9933" strokeWidth="18" />
            <path d="M0,220 C350,140 650,320 950,160 C1150,60 1350,220 1400,140" fill="none" stroke="#138808" strokeWidth="14" />
          </svg>
        </div>

        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
          {/* Left Column: Bold Hindi Headline & Ask GeMMy Button */}
          <div className="lg:col-span-4 space-y-6">
            <div>
              <h1 className="text-4xl sm:text-5xl font-black text-[#0c2340] tracking-tight leading-none">
                {t('heroDecade')}
              </h1>
              <h2 className="text-4xl sm:text-5xl font-black text-[#0c2340] tracking-tight mt-1 leading-none">
                {t('heroDecadeSub')}
              </h2>
            </div>

            {/* Direct Portal Access Buttons */}
            <div className="pt-3">
              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  onClick={onEnterSeller}
                  className="bg-[#e67e22] hover:bg-orange-600 text-white font-bold text-xs px-4 py-2 rounded-lg shadow-sm hover:shadow transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Building2 className="w-4 h-4" />
                  <span>{t('sellerDesk')}</span>
                </button>
                <button
                  onClick={onEnterOfficer}
                  className="bg-[#162c5b] hover:bg-[#0f1f42] text-yellow-300 font-bold text-xs px-4 py-2 rounded-lg shadow-sm hover:shadow transition flex items-center gap-1.5 cursor-pointer border border-yellow-400/30"
                >
                  <Scale className="w-4 h-4" />
                  <span>{t('officerPortal')}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Center Column: Commemorative Golden 3D 10 Pedestal with Carousel Dots */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center">
            <Commemorative10Graphic className="w-64 h-64 sm:w-72 sm:h-72 drop-shadow-xl" />

            {/* 7 Carousel Dots underneath pedestal matching screenshot */}
            <div className="flex items-center space-x-2 pt-2">
              {[0, 1, 2, 3, 4, 5, 6].map((dot) => (
                <button
                  key={dot}
                  onClick={() => setActiveHeroSlide(dot)}
                  className={`rounded-full transition-all duration-300 cursor-pointer ${
                    activeHeroSlide === dot
                      ? 'w-3 h-3 bg-[#ff671f]'
                      : 'w-2.5 h-2.5 bg-white border border-gray-400 hover:bg-gray-200'
                  }`}
                  aria-label={`Slide ${dot + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Right Column: GeM 10 Logo & Poetry Motto matching media_1789184086804.png */}
          <div className="lg:col-span-4 space-y-3 text-left pl-0 lg:pl-6">
            <div className="flex items-center space-x-2">
              <span className="text-4xl sm:text-5xl font-black text-[#0f3d64] tracking-tight">GeM</span>
              <span className="text-4xl sm:text-5xl font-black text-[#f59e0b]">10</span>
              <Sparkles className="w-7 h-7 text-amber-500 inline-block" />
            </div>

            <p className="text-lg sm:text-xl font-bold text-[#0c2340]">
              {t('heroMotto')}
            </p>

            {/* Ornate Gold Floral Divider */}
            <div className="flex items-center space-x-2 py-1">
              <div className="h-0.5 bg-gradient-to-r from-transparent via-[#ca8a04] to-transparent w-full"></div>
              <span className="text-[#ca8a04] text-xs">◆</span>
              <div className="h-0.5 bg-gradient-to-r from-transparent via-[#ca8a04] to-transparent w-full"></div>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-semibold text-[#0c2340]">
                {t('heroCelebrate')}
              </p>
              <p className="text-sm font-black text-[#0056b3]">
                {t('heroSub2')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. #vocalforlocal GeM Outlet Stores matching media_1789184091731.png */}
      <section className="py-10 px-4 sm:px-8 bg-white dark:bg-[#071324] border-b border-gray-200 dark:border-slate-800 transition-colors">
        <div className="max-w-[1400px] mx-auto space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-3xl sm:text-4xl font-black text-center tracking-wide">
              <span className="bg-gradient-to-r from-[#ff671f] via-[#e67e22] to-[#046a38] bg-clip-text text-transparent">
                #vocalforlocal
              </span>
            </h2>
            <p className="text-center text-gray-700 dark:text-slate-300 text-lg sm:text-xl font-medium">
              {t('gemOutlets')}
            </p>
          </div>

          {/* 8 Banners in 2 rows of 4 columns matching screenshot */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {outletStores.map((store) => (
              <div
                key={store.id}
                onClick={() => onOpenProducts?.(store.title)}
                className={`p-3.5 rounded-lg border shadow-sm hover:shadow-md transition cursor-pointer flex flex-col justify-between h-28 group relative overflow-hidden ${store.cardClass}`}
              >
                <div className="flex items-start justify-between">
                  <div className="z-10">
                    <h4 className={`font-extrabold text-xs sm:text-sm group-hover:underline ${store.titleClass}`}>
                      {store.title}
                    </h4>
                    <p className={`text-[10px] mt-0.5 leading-tight max-w-[160px] ${store.subClass}`}>
                      {store.sub}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-black/10 dark:bg-white/10 backdrop-blur-xs flex items-center justify-center shrink-0 z-10 select-none drop-shadow-sm group-hover:scale-110 transition-transform">
                    {store.icon}
                  </div>
                </div>

                <div className={`flex items-center justify-between text-[10px] font-bold z-10 pt-1 border-t ${store.dividerClass}`}>
                  <span className={store.tagClass}>{store.tag}</span>
                  <span className={`group-hover:translate-x-1 transition font-black flex items-center gap-0.5 ${store.exploreClass}`}>
                    Explore →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Popular Product Categories (6 Cards in 2 rows of 3) matching media_1789184098951.png & media_1789184104801.png */}
      <section className="py-12 px-4 sm:px-8 bg-[#fbfcfd] dark:bg-[#0b1528] border-b border-gray-200 dark:border-slate-800 transition-colors">
        <div className="max-w-[1400px] mx-auto space-y-8">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1f2937] dark:text-white">
              {t('popularProducts')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {productCategories.map((cat, idx) => (
              <div
                key={idx}
                onClick={() => onOpenProducts?.(cat.title)}
                className={`bg-white rounded-xl shadow-sm hover:shadow-md transition p-5 flex justify-between space-x-3 cursor-pointer group ${
                  cat.isHighlighted ? 'border-2 border-[#00a0d2]' : 'border border-gray-200'
                }`}
              >
                {/* Left Text & Links */}
                <div className="flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="font-extrabold text-xs text-[#0f3d64] tracking-wide uppercase mb-3 group-hover:text-[#f37021] transition">
                      {cat.title}
                    </h3>
                    <ul className="space-y-1.5 text-xs text-gray-600 font-medium">
                      {cat.items.map((item, i) => (
                        <li key={i} className="hover:text-blue-900 transition">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenProducts?.(cat.title);
                      }}
                      className="text-[#e67e22] hover:text-[#d35400] text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <span>View All</span>
                    </button>
                  </div>
                </div>

                {/* Right Realistic Product Cutout Illustration */}
                <div className="w-24 sm:w-28 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
                  {cat.component}
                </div>
              </div>
            ))}
          </div>

          {/* Centered Orange Gradient Button EXPLORE THE MARKET */}
          <div className="text-center pt-2">
            <button
              onClick={() => onOpenProducts?.()}
              className="bg-gradient-to-r from-[#ff6026] to-[#f7931e] hover:brightness-105 text-white font-extrabold text-xs uppercase tracking-wider px-8 py-3 rounded-full shadow-md hover:shadow-lg transition cursor-pointer"
            >
              {t('exploreMarket')}
            </button>
          </div>
        </div>
      </section>

      {/* 5. Popular Service Categories matching official GeM portal */}
      <section className="bg-[#155998] text-white pt-10 pb-24 px-4 sm:px-8 relative">
        <div className="max-w-[1400px] mx-auto space-y-4">
          <div className="text-center space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-300 bg-white/10 px-3 py-1 rounded-full inline-block">
              National Public Procurement Portal Directory
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {t('popularServices')}
            </h2>
            <p className="text-xs text-blue-100 max-w-2xl mx-auto">
              Statutory-verified service tenders cross-referenced with Code on Wages, PSARA 2005, FSSAI, and GFR Rule 144(xi).
            </p>
          </div>
        </div>

        {/* Elevated Floating White Card overlapping sections */}
        <div className="max-w-6xl mx-auto -mb-32 relative z-20 px-4">
          <div className="bg-white text-gray-800 rounded-2xl p-6 sm:p-8 shadow-2xl border border-gray-100 space-y-6">
            {/* Top: 8 Core Popular Categories */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 text-center">
              {serviceCategories.map((serv, i) => (
                <div
                  key={i}
                  onClick={() => onOpenServices?.(serv.title)}
                  className="flex flex-col items-center justify-between p-2.5 rounded-xl hover:bg-orange-50/70 border border-transparent hover:border-orange-200 transition cursor-pointer group"
                >
                  <div className="w-14 h-14 rounded-full bg-orange-50/50 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    {serv.svg}
                  </div>
                  <h4 className="font-extrabold text-[11px] text-gray-900 leading-tight group-hover:text-[#f37021] line-clamp-2">
                    {serv.title}
                  </h4>
                </div>
              ))}
            </div>

            {/* Middle: Official Trending & Emerging Services Explorer */}
            <div className="pt-4 border-t border-gray-100 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setHomeServicesTab('TRENDING')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 active:scale-95 cursor-pointer flex items-center gap-1.5 ${
                      homeServicesTab === 'TRENDING'
                        ? 'bg-[#f37021] text-white shadow-xs'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Flame className="w-3.5 h-3.5 text-orange-500" />
                    <span>Trending Services (20)</span>
                  </button>
                  <button
                    onClick={() => setHomeServicesTab('EMERGING')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 active:scale-95 cursor-pointer flex items-center gap-1.5 ${
                      homeServicesTab === 'EMERGING'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Emerging Services (10)</span>
                  </button>
                </div>

                <span className="text-[11px] text-gray-500 font-medium">
                  Direct from official <strong className="text-[#155998]">gem.gov.in</strong> service catalog
                </span>
              </div>

              {/* Service Pills Grid (Top 8 of current tab) with smooth transition */}
              <div key={homeServicesTab} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1 tab-content-enter">
                {OFFICIAL_GEM_SERVICES
                  .filter((s) => s.category === (homeServicesTab === 'TRENDING' ? 'Trending' : 'Emerging'))
                  .slice(0, 8)
                  .map((s) => (
                    <div
                      key={s.id}
                      onClick={() => onOpenServices?.(s.title)}
                      className="p-2.5 rounded-lg bg-gray-50/80 hover:bg-orange-50/60 border border-gray-200/80 hover:border-orange-300 transition cursor-pointer group flex items-start space-x-2.5"
                    >
                      <div className="w-8 h-8 rounded-lg bg-orange-100/60 dark:bg-slate-800 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform text-orange-700 dark:text-orange-400">
                        <EnterpriseIconBadge type={s.domain} className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-xs text-gray-900 group-hover:text-[#155998] truncate">
                          {s.title}
                        </p>
                        <p className="text-[10px] text-gray-500 truncate mt-0.5">
                          {s.billingModel}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Bottom CTA Button */}
            <div className="text-center pt-4 border-t border-gray-100">
              <button
                onClick={() => onOpenServices?.()}
                className="bg-gradient-to-r from-[#ff6026] to-[#f7931e] hover:brightness-105 text-white font-extrabold text-xs uppercase tracking-wider px-8 py-3 rounded-full shadow-md hover:shadow-lg transition cursor-pointer inline-flex items-center gap-2"
              >
                <Landmark className="w-4 h-4" />
                <span>{t('viewAllServices')} (30+ Official GeM Services) →</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Why You Should Choose GeM matching media_1789184192832.png */}
      <section className="pt-32 pb-16 px-4 sm:px-8 bg-gradient-to-r from-[#e84126] to-[#f79722] text-white">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold">
              {t('whyChooseGem')}
            </h2>
          </div>

          {/* Bordered KPI Container */}
          <div className="border border-white/40 rounded-xl p-6 sm:p-8 bg-white/5 backdrop-blur-xs">
            {/* Top 3 KPI stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-white/30">
              <div className="space-y-1 py-1">
                <p className="text-4xl sm:text-5xl font-black tracking-tight">10,676</p>
                <p className="text-xs font-bold uppercase tracking-wider text-orange-100">
                  Product Categories
                </p>
              </div>
              <div className="space-y-1 py-1">
                <p className="text-4xl sm:text-5xl font-black tracking-tight">2,046,264</p>
                <p className="text-xs font-bold uppercase tracking-wider text-orange-100">
                  Order Value (Cr.)
                </p>
              </div>
              <div className="space-y-1 py-1">
                <p className="text-4xl sm:text-5xl font-black tracking-tight">349</p>
                <p className="text-xs font-bold uppercase tracking-wider text-orange-100">
                  Service Categories
                </p>
              </div>
            </div>

            {/* Horizontal Line Divider */}
            <div className="border-t border-white/30 my-6"></div>

            {/* Bottom 5 Feature Icons */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 text-center">
              {[
                { title: 'Rich Listing of Products / Services', icon: <PackageCheck className="w-6 h-6 text-white" /> },
                { title: 'Integrated Payment System', icon: <CreditCard className="w-6 h-6 text-white" /> },
                { title: 'Multiple Procurement Modes - Direct Purchase / Bid / RA', icon: <Scale className="w-6 h-6 text-white" /> },
                { title: 'Great Transparency and Speed of Procurement', icon: <Monitor className="w-6 h-6 text-white" /> },
                { title: 'Online Ordering and Contract Generation', icon: <FileCheck className="w-6 h-6 text-white" /> },
              ].map((f, i) => (
                <div key={i} className="flex flex-col items-center space-y-2 p-1">
                  <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur-xs flex items-center justify-center shadow-inner">
                    {f.icon}
                  </div>
                  <p className="text-[11px] font-medium leading-tight text-white/90">
                    {f.title}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* 7. Customers Speak (Testimonials) matching media_1789184198447.png */}
      <section className="py-12 px-4 sm:px-8 bg-white border-b relative">
        <div className="max-w-4xl mx-auto -mt-16 bg-white rounded-2xl shadow-xl p-8 border border-gray-100 text-center space-y-4 relative z-20">
          <h3 className="text-2xl font-bold text-gray-800">
            {t('customersSpeak')}
          </h3>

          <div key={activeTestimonial} className="tab-content-enter space-y-4">
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed italic max-w-2xl mx-auto">
              "{testimonials[activeTestimonial].quote}"
            </p>

            <div className="space-y-0.5 pt-2">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-orange-400 to-amber-200 mx-auto flex items-center justify-center shadow-md border-2 border-white">
                <User className="w-6 h-6 text-orange-950" />
              </div>
              <h4 className="font-extrabold text-xs text-gray-900 pt-1">
                {testimonials[activeTestimonial].name}
              </h4>
              <p className="text-[11px] text-gray-500">
                {testimonials[activeTestimonial].designation}
              </p>
            </div>
          </div>

          {/* 5 Pagination Dots matching screenshot */}
          <div className="flex items-center justify-center space-x-2 pt-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveTestimonial(i)}
                className={`rounded-full transition-all cursor-pointer ${
                  activeTestimonial === i
                    ? 'w-2.5 h-2.5 bg-[#f37021]'
                    : 'w-2.5 h-2.5 bg-gray-200 hover:bg-gray-300'
                }`}
                aria-label={`Testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 8. Initiatives & GeM Connect matching media_1789184204023.png & media_1789184213076.png */}
      <section className="py-12 px-4 sm:px-8 bg-white border-b">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Initiatives */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gray-800">
              Initiatives
            </h3>

            {/* Top Banner: Aadhaar Enrollment Kits */}
            <div className="border border-gray-200 rounded-xl p-4 bg-gradient-to-r from-orange-50/40 to-white flex items-center justify-between shadow-2xs">
              <div className="space-y-2 max-w-xs">
                <p className="text-xs font-semibold text-gray-700">
                  {language === 'hi'
                    ? 'आधार इनरॉलमेंट किट्स अब बिना किसी झंझट के प्राप्त करें'
                    : 'Get Aadhaar Enrollment Kits hassle-free now'}
                </p>
                <p className="text-lg font-black text-[#dc2626]">
                  Possible only @GeM
                </p>
                <p className="text-[10px] text-gray-600 font-bold">
                  {language === 'hi' ? 'दक्ष । विश्वसनीय । पारदर्शी' : 'Efficient • Reliable • Transparent'}
                </p>
                <button
                  onClick={() => setInitiativesModalOpen(true)}
                  className="bg-[#dc2626] hover:bg-red-700 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow cursor-pointer"
                >
                  {language === 'hi' ? 'और अधिक जानें' : 'Learn More'}
                </button>
              </div>
              <div className="flex items-center gap-2 pr-4 text-blue-900/80">
                <Monitor className="w-9 h-9" />
                <Printer className="w-8 h-8 opacity-70" />
              </div>
            </div>

            {/* Bottom 2 Cards: Cyber Security & Swachh Bharat */}
            <div className="grid grid-cols-2 gap-4">
              <div
                onClick={() => setInitiativesModalOpen(true)}
                className="bg-[#0f3b2c] text-white p-4 rounded-xl shadow-2xs hover:shadow-md transition cursor-pointer flex flex-col justify-between h-32"
              >
                <p className="text-[10px] text-emerald-300">Resilient Systems</p>
                <p className="font-extrabold text-xs leading-snug">
                  START WITH STRONG SECURITY
                </p>
                <p className="text-[10px] text-gray-300 underline">Explore Cyber Security</p>
              </div>

              <div
                onClick={() => setInitiativesModalOpen(true)}
                className="bg-white border border-gray-200 p-4 rounded-xl shadow-2xs hover:shadow-md transition cursor-pointer flex flex-col items-center justify-center text-center h-32"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mb-1.5 text-emerald-700">
                  <Sparkles className="w-5 h-5" />
                </div>
                <p className="font-black text-xs text-gray-800">
                  {language === 'hi' ? 'स्वच्छ भारत मिशन' : 'Swachh Bharat Mission'}
                </p>
                <p className="text-[9px] text-gray-500">Ek Kadam Swachhata Ki Ore</p>
              </div>
            </div>

            <div className="text-center pt-2">
              <button
                onClick={() => setInitiativesModalOpen(true)}
                className="bg-gradient-to-r from-[#ff6026] to-[#f7931e] hover:brightness-105 text-white font-extrabold text-xs uppercase tracking-wider px-8 py-2.5 rounded-full shadow cursor-pointer"
              >
                VIEW ALL INITIATIVES
              </button>
            </div>
          </div>

          {/* Right Column: GeM Connect Social Stream */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gray-800">
              GeM Connect
            </h3>

            {/* Social Tabs (𝕏 & Facebook) */}
            <div className="border border-gray-200 rounded-xl p-4 bg-white shadow-2xs space-y-3">
              <div className="flex space-x-4 border-b pb-2">
                <button
                  onClick={() => setSocialTab('x')}
                  className={`flex items-center gap-1 text-sm font-bold pb-1 cursor-pointer transition-all duration-200 active:scale-95 ${
                    socialTab === 'x' ? 'text-black border-b-2 border-pink-500' : 'text-gray-400'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center text-[10px]">𝕏</span>
                </button>
                <button
                  onClick={() => setSocialTab('fb')}
                  className={`flex items-center gap-1 text-sm font-bold pb-1 cursor-pointer transition-all duration-200 active:scale-95 ${
                    socialTab === 'fb' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-[#1877f2] text-white flex items-center justify-center text-[10px]">f</span>
                </button>
              </div>

              {/* Feed Content with Smooth Transition */}
              <div key={socialTab} className="tab-content-enter">
                {socialTab === 'x' ? (
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <GeMStarLogo className="w-5 h-5" />
                        <div>
                          <p className="font-bold text-gray-900 flex items-center gap-1">GeM <BadgeCheck className="w-3.5 h-3.5 text-blue-500 fill-blue-500 text-white" /></p>
                          <p className="text-[10px] text-gray-400">@GeM_India • Follow</p>
                        </div>
                      </div>
                      <span className="text-gray-400 font-bold">𝕏</span>
                    </div>
                    <p className="text-gray-700 leading-relaxed text-[11px]">
                      {language === 'hi' ? (
                        <>
                          जेम के साप्ताहिक <span onClick={() => onOpenTraining?.()} className="text-blue-600 font-bold hover:underline cursor-pointer">#TrainingCalendar</span> से लाभ उठाएं! चाहे आप Buyer हों या Seller, GeM पर आपकी ज़रूरतों को ध्यान में रखते हुए Free Online Training Sessions उपलब्ध हैं।
                        </>
                      ) : (
                        <>
                          Make the most of GeM's weekly <span onClick={() => onOpenTraining?.()} className="text-blue-600 font-bold hover:underline cursor-pointer">#TrainingCalendar</span>! Whether you are a Buyer or Seller, Free Online Training Sessions tailored to your needs are available.
                        </>
                      )}
                    </p>
                    <div
                      onClick={() => onOpenTraining?.()}
                      className="p-2 bg-blue-50/60 hover:bg-blue-100/70 cursor-pointer rounded text-[10px] text-blue-900 font-mono flex items-center justify-between transition"
                      title="Click to open GeM Interactive LMS & Live Calendar"
                    >
                      <span>Session Link: gem.gov.in/training/sessions</span>
                      <span className="font-sans font-bold text-blue-700 text-[11px]">Join Free →</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#1877f2] text-white flex items-center justify-center text-[10px]">f</span>
                      <div>
                        <p className="font-bold text-gray-900">Government e Marketplace</p>
                        <p className="text-[10px] text-gray-400">Official Page • 1.2M Followers</p>
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed text-[11px]">
                      GeM surpasses ₹2,00,000 Crore in cumulative order value! Celebrating 10 years of public procurement excellence and transparent governance.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="text-center pt-2">
              <button
                onClick={() => setNotificationsModalOpen(true)}
                className="bg-gradient-to-r from-[#ff6026] to-[#f7931e] hover:brightness-105 text-white font-extrabold text-xs uppercase tracking-wider px-8 py-2.5 rounded-full shadow cursor-pointer"
              >
                VIEW ALL NOTIFICATIONS
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Multi-Column Official Footer matching media_1789184213076.png & media_1789184217916.png */}
      <footer className="bg-white text-gray-700 text-xs border-t pt-10">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 space-y-10">
          {/* 6 Directory Link Columns */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 text-[11px]">
            {/* 1. WEB INFO */}
            <div className="space-y-2">
              <h5 className="font-black text-[#0c2340] text-xs uppercase">WEB INFO</h5>
              <ul className="space-y-1.5 text-gray-600">
                <li className="hover:underline cursor-pointer">Terms of Use</li>
                <li className="hover:underline cursor-pointer">Website Policies</li>
                <li className="hover:underline cursor-pointer">Document Help</li>
                <li className="hover:underline cursor-pointer">Sitemap</li>
                <li className="hover:underline cursor-pointer">Web Information Manager</li>
              </ul>
            </div>

            {/* 2. ABOUT GeM */}
            <div className="space-y-2">
              <h5 className="font-black text-[#0c2340] text-xs uppercase">ABOUT GeM</h5>
              <ul className="space-y-1.5 text-gray-600">
                <li className="hover:underline cursor-pointer">Introduction to GeM</li>
                <li className="hover:underline cursor-pointer">Statistics</li>
                <li className="hover:underline cursor-pointer">Right to Information</li>
                <li className="hover:underline cursor-pointer">Analytics</li>
                <li className="hover:underline cursor-pointer">New on GeM</li>
                <li className="hover:underline cursor-pointer">Testimonials</li>
                <li className="hover:underline cursor-pointer">Brand GeM</li>
              </ul>
            </div>

            {/* 3. NEWS & EVENTS */}
            <div className="space-y-2">
              <h5 className="font-black text-[#0c2340] text-xs uppercase">NEWS & EVENTS</h5>
              <ul className="space-y-1.5 text-gray-600">
                <li className="hover:underline cursor-pointer">Newsroom</li>
                <li className="hover:underline cursor-pointer">Gallery</li>
                <li className="hover:underline cursor-pointer">Latest Updates/Features</li>
                <li className="hover:underline cursor-pointer">CCM Schedule</li>
                <li className="hover:underline cursor-pointer">Forums</li>
              </ul>
            </div>

            {/* 4. RESOURCES */}
            <div className="space-y-2">
              <h5 className="font-black text-[#0c2340] text-xs uppercase">RESOURCES</h5>
              <ul className="space-y-1.5 text-gray-600">
                <li className="hover:underline cursor-pointer">GeM Handbook</li>
                <li className="hover:underline cursor-pointer">OM's/Circulars</li>
                <li className="hover:underline cursor-pointer">Terms and Conditions</li>
                <li className="hover:underline cursor-pointer">Policies/Manuals</li>
                <li className="hover:underline cursor-pointer">Miscellaneous</li>
                <li className="hover:underline cursor-pointer">GeM Integration Toolkit</li>
                <li className="hover:underline cursor-pointer">MoU's</li>
                <li className="hover:underline cursor-pointer">List of Suspended Sellers</li>
                <li
                  onClick={() => {
                    if (onEnterRisk) onEnterRisk();
                    else onEnterOfficer();
                  }}
                  className="text-red-600 font-bold hover:underline cursor-pointer pt-1"
                >
                  Sellers, Brands and Catalogues Delisted from GeM due to non-compliance with GFR Rule 144(xi)
                </li>
              </ul>
            </div>

            {/* 5. TRAINING */}
            <div className="space-y-2">
              <h5 className="font-black text-[#0c2340] text-xs uppercase">TRAINING</h5>
              <ul className="space-y-1.5 text-gray-600">
                <li
                  onClick={() => onOpenTraining?.()}
                  className="font-bold text-[#0c2340] hover:text-[#f37021] hover:underline cursor-pointer flex items-center gap-1"
                >
                  <span>Interactive Training Courses</span>
                  <span className="text-[10px] bg-orange-100 text-orange-800 px-1 rounded font-black">LMS</span>
                </li>
                <li
                  onClick={() => onOpenTraining?.()}
                  className="hover:text-[#f37021] hover:underline cursor-pointer"
                >
                  LMS & Four-Level Buyer Certification
                </li>
                <li
                  onClick={() => onOpenTraining?.()}
                  className="hover:text-[#f37021] hover:underline cursor-pointer"
                >
                  GeM Webinar Calendar
                </li>
                <li
                  onClick={() => onOpenTraining?.()}
                  className="hover:text-[#f37021] hover:underline cursor-pointer"
                >
                  Training Module & Manuals
                </li>
                <li
                  onClick={() => onOpenTraining?.()}
                  className="hover:text-[#f37021] hover:underline cursor-pointer"
                >
                  Business Facilitators
                </li>
                <li className="hover:underline cursor-pointer">GeM Logo</li>
              </ul>
            </div>

            {/* 6. NEED HELP ? */}
            <div className="space-y-2">
              <h5 className="font-black text-[#0c2340] text-xs uppercase">NEED HELP ?</h5>
              <ul className="space-y-1.5 text-gray-600">
                <li className="hover:underline cursor-pointer">FAQs</li>
                <li className="hover:underline cursor-pointer">Feedback</li>
                <li className="hover:underline cursor-pointer">Raise a Ticket</li>
                <li className="hover:underline cursor-pointer">Contact Us</li>
                <li className="hover:underline cursor-pointer">Careers</li>
                <li className="hover:underline cursor-pointer">Useful links</li>
              </ul>
            </div>
          </div>

          {/* Disclaimer text */}
          <div className="text-center text-[10px] text-gray-500 border-t pt-4 space-y-0.5">
            <p>This site is designed, developed and maintained by Managed Service Provider and is owned by Government e Marketplace (GeM)</p>
            <p>Best viewed on Google Chrome, Microsoft Edge, Mozilla Firefox, or Safari with a screen resolution of 1920 x 1080 (Full HD) or higher</p>
          </div>
        </div>

        {/* Dark Grey Institutional Trust Strip matching media_1789184217916.png */}
        <div className="bg-[#4a4a4a] text-white py-4 px-4 sm:px-8 mt-6">
          <div className="max-w-[1400px] mx-auto flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center space-x-2">
              <Landmark className="w-5 h-5 text-gray-200 shrink-0" />
              <div className="text-[10px] font-bold leading-tight">
                <p>Department of Commerce</p>
                <p className="text-gray-300">Ministry of Commerce and Industry</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Handshake className="w-5 h-5 text-gray-200 shrink-0" />
              <p className="text-[10px] font-bold">NATIONAL SC-ST HUB</p>
            </div>

            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-amber-400 shrink-0" />
              <p className="text-[10px] font-bold">Digital India</p>
            </div>

            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-orange-400 shrink-0" />
              <p className="text-[10px] font-bold">india.gov.in</p>
            </div>

            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0" />
              <div className="text-[10px] font-bold leading-tight">
                <p>STQC Certification</p>
                <p className="text-gray-300">Quality Compliance Certificate</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Leaf className="w-5 h-5 text-emerald-400 shrink-0" />
              <p className="text-[10px] font-bold">Apply for EcoMark</p>
            </div>

            <div className="flex items-center space-x-2">
              <HeartHandshake className="w-5 h-5 text-rose-400 shrink-0" />
              <p className="text-[10px] font-bold">Beti Bachao Beti Padhao</p>
            </div>
          </div>
        </div>

        {/* Bottom White Bar: Section 8 & Copyright */}
        <div className="bg-white text-gray-600 text-[10px] py-4 px-4 sm:px-8 border-t">
          <div className="max-w-[1400px] mx-auto flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-bold">© 2026 GeM All rights reserved</p>
              <p className="text-gray-400">Smart India Hackathon 2026 • SIH26100</p>
            </div>

            <div className="max-w-2xl text-center text-[9px] text-gray-500 leading-tight hidden md:block">
              Government e Marketplace is a 100 percent Government owned Section 8 company setup under the aegis of Department of Commerce, Ministry of Commerce and Industry for procurement of common use goods and services by government ministries, departments and CPSEs.
            </div>

            {/* Social Icons Stack */}
            <div className="flex items-center space-x-2">
              <span className="w-5 h-5 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 text-white flex items-center justify-center text-[9px] cursor-pointer">
                <Camera className="w-3 h-3" />
              </span>
              <span className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center text-[9px] cursor-pointer font-bold">𝕏</span>
              <span className="w-5 h-5 rounded-full bg-[#1877f2] text-white flex items-center justify-center text-[9px] cursor-pointer font-bold">f</span>
              <span className="w-5 h-5 rounded-full bg-[#ff0000] text-white flex items-center justify-center text-[9px] cursor-pointer">
                <Play className="w-2.5 h-2.5 fill-current" />
              </span>
              <span className="w-5 h-5 rounded-full bg-[#0a66c2] text-white flex items-center justify-center text-[9px] cursor-pointer font-bold">in</span>
              <span className="w-5 h-5 rounded-full bg-gray-700 text-white flex items-center justify-center text-[9px] cursor-pointer" title="Accessibility Options">
                <Accessibility className="w-3 h-3" />
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* 10. Persistent Sticky Floating Widgets matching screenshots */}
      {/* Right Sticky Social Media Stack matching screenshots */}
      <div className="fixed right-2 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col space-y-1.5">
        <a
          href="https://www.instagram.com/gem_india/"
          target="_blank"
          rel="noreferrer"
          className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 text-white flex items-center justify-center text-xs shadow hover:scale-110 transition"
          title="Instagram"
        >
          <Camera className="w-4 h-4" />
        </a>
        <a
          href="https://www.facebook.com/GovernmenteMarketplace"
          target="_blank"
          rel="noreferrer"
          className="w-8 h-8 rounded-full bg-[#1877f2] text-white flex items-center justify-center text-xs shadow hover:scale-110 transition font-bold"
          title="Facebook"
        >
          f
        </a>
        <a
          href="https://twitter.com/gem_india"
          target="_blank"
          rel="noreferrer"
          className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs shadow hover:scale-110 transition font-bold"
          title="X (Twitter)"
        >
          𝕏
        </a>
        <a
          href="https://www.youtube.com/channel/UC1LaBWVVGy4U23HYa1qUL8A"
          target="_blank"
          rel="noreferrer"
          className="w-8 h-8 rounded-full bg-[#ff0000] text-white flex items-center justify-center text-xs shadow hover:scale-110 transition"
          title="YouTube"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
        </a>
        <a
          href="https://www.linkedin.com/company/government-e-marketplace-gem"
          target="_blank"
          rel="noreferrer"
          className="w-8 h-8 rounded-full bg-[#0a66c2] text-white flex items-center justify-center text-xs shadow hover:scale-110 transition font-bold"
          title="LinkedIn"
        >
          in
        </a>
        <button
          onClick={() => {
            if (onOpenChat) onOpenChat();
          }}
          className="w-8 h-8 rounded-full bg-[#1e293b] text-white flex items-center justify-center text-xs shadow hover:scale-110 transition font-bold cursor-pointer"
          title="Feedback & AI Assistance"
        >
          <X className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="w-8 h-8 rounded-full bg-white text-gray-700 border border-gray-300 flex items-center justify-center text-xs shadow hover:bg-gray-100 transition mt-2 font-bold cursor-pointer"
          title="Scroll to top"
        >
          ▲
        </button>
      </div>

      {/* Initiatives Full Modal */}
      {initiativesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white text-gray-800 rounded-2xl shadow-2xl max-w-xl w-full p-6 space-y-4 border border-gray-200">
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <div>
                  <h4 className="font-extrabold text-sm text-[#0c2340]">GeM Special Initiatives</h4>
                  <p className="text-[10px] text-gray-500">Government of India Procurement Missions</p>
                </div>
              </div>
              <button onClick={() => setInitiativesModalOpen(false)} className="text-gray-400 hover:text-gray-600 font-bold">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                <p className="font-bold text-red-900">Aadhaar Enrollment Kits</p>
                <p className="text-gray-600 text-[11px] mt-1">Standardized biometrics hardware procurement direct to UIDAI registrars.</p>
              </div>
              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                <p className="font-bold text-emerald-900">Cyber Security Center of Excellence</p>
                <p className="text-gray-600 text-[11px] mt-1">Zero-trust architecture and automated GFR Rule 144(xi) foreign land-border screening.</p>
              </div>
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                <p className="font-bold text-amber-900">Swachh Bharat Clean Procurement</p>
                <p className="text-gray-600 text-[11px] mt-1">Preferential procurement of green, biodegradable, and recycled materials.</p>
              </div>
            </div>
            <div className="flex justify-end pt-2 border-t">
              <button
                onClick={() => setInitiativesModalOpen(false)}
                className="px-4 py-1.5 bg-[#062134] text-white text-xs font-bold rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Full Modal */}
      {notificationsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white text-gray-800 rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4 border border-gray-200">
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-blue-600" />
                <div>
                  <h4 className="font-extrabold text-sm text-[#0c2340]">Official GeM Notifications & OM</h4>
                  <p className="text-[10px] text-gray-500">Ministry of Finance & Department of Expenditure</p>
                </div>
              </div>
              <button onClick={() => setNotificationsModalOpen(false)} className="text-gray-400 hover:text-gray-600 font-bold">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="font-bold text-blue-900">OM No. F.18/37/2020-PPD: Rule 144(xi) Amendment</p>
                <p className="text-gray-600 text-[11px] mt-1">Mandatory registration of bidders sharing land borders with India prior to submission.</p>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                <p className="font-bold text-orange-900">Public Procurement (Preference to Make in India) Order 2017</p>
                <p className="text-gray-600 text-[11px] mt-1">Revision of local content verification protocols and CA turnover auditing.</p>
              </div>
            </div>
            <div className="flex justify-end pt-2 border-t">
              <button
                onClick={() => setNotificationsModalOpen(false)}
                className="px-4 py-1.5 bg-[#f37021] text-white text-xs font-bold rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
