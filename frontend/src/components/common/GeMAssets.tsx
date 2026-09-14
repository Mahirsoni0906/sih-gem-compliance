import React from 'react';

/**
 * Official Ashoka Lion Capital (National Emblem of India)
 */
export const AshokaEmblem: React.FC<{ className?: string }> = ({ className = "w-8 h-10" }) => (
  <svg viewBox="0 0 100 125" className={className} fill="currentColor">
    {/* Central Crown & 3 Lions */}
    <path d="M50 12 C44 12 40 16 38 22 C36 18 31 16 26 18 C20 20 18 26 20 32 C22 38 28 42 34 42 C36 42 38 41 40 40 C41 44 45 47 50 47 C55 47 59 44 60 40 C62 41 64 42 66 42 C72 42 78 38 80 32 C82 26 80 20 74 18 C69 16 64 18 62 22 C60 16 56 12 50 12 Z" fill="#e5e7eb" />
    {/* Lion Details & Mane */}
    <path d="M35 30 Q50 25 65 30 L63 55 Q50 62 37 55 Z" fill="#cbd5e1" opacity="0.9" />
    {/* Intermediate Pillar */}
    <rect x="42" y="58" width="16" height="28" rx="2" fill="#94a3b8" />
    {/* Abacus Base with Ashoka Chakra */}
    <rect x="22" y="86" width="56" height="14" rx="3" fill="#e5e7eb" />
    <circle cx="50" cy="93" r="5" fill="#1e3a8a" />
    <circle cx="50" cy="93" r="3" fill="#e5e7eb" />
    {/* Plinth */}
    <path d="M18 100 L82 100 L76 112 L24 112 Z" fill="#64748b" />
    <rect x="15" y="112" width="70" height="5" rx="1.5" fill="#475569" />
  </svg>
);

/**
 * Official Multicolor 6-Point GeM Star Logo
 */
export const GeMStarLogo: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 100 100" className={className}>
    <polygon points="50,4 65,36 100,38 73,61 82,96 50,75 18,96 27,61 0,38 35,36" fill="#f59e0b" />
    <polygon points="50,4 65,36 50,50 35,36" fill="#ef4444" />
    <polygon points="100,38 73,61 50,50 65,36" fill="#3b82f6" />
    <polygon points="82,96 50,75 50,50 73,61" fill="#10b981" />
    <polygon points="18,96 27,61 50,50 50,75" fill="#f97316" />
    <polygon points="0,38 35,36 50,50 27,61" fill="#8b5cf6" />
    <circle cx="50" cy="50" r="10" fill="#ffffff" />
    <circle cx="50" cy="50" r="6" fill="#0d2738" />
  </svg>
);

/**
 * Official Ask GeMMy Avatar (Friendly cartoon boy with headset)
 */
export const GeMMyAvatar: React.FC<{ className?: string }> = ({ className = "w-7 h-7" }) => (
  <svg viewBox="0 0 100 100" className={className}>
    {/* Orange circular background */}
    <circle cx="50" cy="50" r="48" fill="#f97316" />
    {/* Headset arc */}
    <path d="M22 48 C22 25 78 25 78 48" fill="none" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" />
    {/* Headset ear-cushions */}
    <rect x="17" y="44" width="9" height="18" rx="4" fill="#38bdf8" />
    <rect x="74" y="44" width="9" height="18" rx="4" fill="#38bdf8" />
    {/* Face */}
    <ellipse cx="50" cy="54" rx="26" ry="25" fill="#ffedd5" />
    {/* Hair */}
    <path d="M25 45 C28 32 40 28 50 30 C60 28 72 32 75 45 C70 38 60 36 50 36 C40 36 30 38 25 45 Z" fill="#78350f" />
    {/* Eyes */}
    <circle cx="41" cy="52" r="3" fill="#1e293b" />
    <circle cx="59" cy="52" r="3" fill="#1e293b" />
    {/* Cheeks */}
    <circle cx="35" cy="59" r="3" fill="#fca5a5" opacity="0.6" />
    <circle cx="65" cy="59" r="3" fill="#fca5a5" opacity="0.6" />
    {/* Smile */}
    <path d="M43 62 Q50 68 57 62" fill="none" stroke="#ea580c" strokeWidth="2.5" strokeLinecap="round" />
    {/* Microphone boom */}
    <path d="M22 55 Q26 70 42 68" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
    <circle cx="43" cy="68" r="4" fill="#38bdf8" />
  </svg>
);

/**
 * Commemorative 3D Numeral 10 Graphic with Pedestal
 */
export const Commemorative10Graphic: React.FC<{ className?: string }> = ({ className = "w-64 h-64" }) => (
  <svg viewBox="0 0 300 300" className={className}>
    <defs>
      <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="35%" stopColor="#eab308" />
        <stop offset="70%" stopColor="#ca8a04" />
        <stop offset="100%" stopColor="#854d0e" />
      </linearGradient>
      <linearGradient id="pedestalGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#fef9c3" />
        <stop offset="50%" stopColor="#d97706" />
        <stop offset="100%" stopColor="#78350f" />
      </linearGradient>
      <linearGradient id="ribbonSaffron" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#ff9933" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#ea580c" stopOpacity="0.1" />
      </linearGradient>
      <linearGradient id="ribbonGreen" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#10b981" stopOpacity="0.1" />
        <stop offset="100%" stopColor="#059669" stopOpacity="0.4" />
      </linearGradient>
      <pattern id="collage1" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
        <rect width="40" height="40" fill="#0284c7" opacity="0.8" />
        <path d="M5 5 L35 35 M35 5 L5 35" stroke="#ffffff" strokeWidth="2" opacity="0.3" />
        <circle cx="20" cy="20" r="10" fill="#f8fafc" opacity="0.4" />
      </pattern>
      <pattern id="collage0" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
        <rect width="50" height="50" fill="#0f766e" opacity="0.8" />
        <circle cx="25" cy="25" r="18" fill="#f59e0b" opacity="0.5" />
        <rect x="15" y="15" width="20" height="20" fill="#ffffff" opacity="0.3" />
      </pattern>
    </defs>

    {/* Background Tricolor Dynamic Waves */}
    <path d="M-20 180 Q60 80 160 140 T320 100" fill="none" stroke="url(#ribbonSaffron)" strokeWidth="45" />
    <path d="M-20 220 Q120 150 200 200 T320 160" fill="none" stroke="url(#ribbonGreen)" strokeWidth="35" />

    {/* Golden Pedestal Disc */}
    <ellipse cx="150" cy="245" rx="100" ry="24" fill="url(#pedestalGrad)" />
    <ellipse cx="150" cy="240" rx="90" ry="18" fill="#fef08a" opacity="0.9" />
    <ellipse cx="150" cy="237" rx="80" ry="14" fill="url(#goldGrad)" />

    {/* 3D Numeral '1' */}
    {/* Shadow/Back 3D layer */}
    <path d="M92 48 L108 34 L128 34 L128 214 L98 214 Z" fill="#713f12" />
    {/* Face with internal collage fill */}
    <path d="M85 45 L102 30 L122 30 L122 210 L92 210 Z" fill="url(#collage1)" stroke="url(#goldGrad)" strokeWidth="5" />
    {/* Gold trim outline */}
    <path d="M85 45 L102 30 L122 30 L122 210 L92 210 Z" fill="none" stroke="#fef08a" strokeWidth="2.5" />

    {/* 3D Numeral '0' */}
    {/* Shadow/Back 3D layer */}
    <ellipse cx="198" cy="125" rx="55" ry="88" fill="#713f12" />
    <ellipse cx="198" cy="125" rx="28" ry="58" fill="#0d2738" />
    {/* Face with internal collage fill */}
    <ellipse cx="190" cy="120" rx="54" ry="86" fill="url(#collage0)" stroke="url(#goldGrad)" strokeWidth="6" />
    <ellipse cx="190" cy="120" rx="27" ry="56" fill="#f8fafc" stroke="url(#goldGrad)" strokeWidth="4" />

    {/* Sparkling Gold Highlights */}
    <polygon points="120,25 125,15 130,25 140,30 130,35 125,45 120,35 110,30" fill="#ffffff" />
    <polygon points="235,50 238,42 242,50 250,53 242,56 238,64 235,56 227,53" fill="#ffffff" />
    <polygon points="160,210 163,204 167,210 173,212 167,214 163,220 160,214 154,212" fill="#ffffff" />
  </svg>
);

/**
 * Realistic Cutout Product Illustrations
 */
export const ProductCutouts = {
  OxygenCylinder: () => (
    <svg viewBox="0 0 100 160" className="w-16 h-28 drop-shadow-md">
      {/* Regulator & Valve */}
      <rect x="44" y="8" width="12" height="14" rx="2" fill="#0284c7" />
      <circle cx="50" cy="12" r="6" fill="#e2e8f0" />
      <rect x="36" y="16" width="28" height="6" rx="1.5" fill="#64748b" />
      {/* Pressure Gauge */}
      <circle cx="68" cy="18" r="8" fill="#f8fafc" stroke="#334155" strokeWidth="2" />
      <line x1="68" y1="18" x2="72" y2="15" stroke="#ef4444" strokeWidth="1.5" />
      {/* Neck */}
      <path d="M42 22 Q50 24 58 22 L65 40 L35 40 Z" fill="#94a3b8" />
      {/* Main Cylinder Body (Medical White/Silver with Teal Shoulder) */}
      <rect x="34" y="38" width="32" height="18" rx="4" fill="#0284c7" />
      <rect x="34" y="54" width="32" height="88" rx="6" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1.5" />
      {/* High-gloss cylinder reflection */}
      <rect x="38" y="58" width="6" height="80" rx="3" fill="#ffffff" opacity="0.8" />
      {/* Stamped Text */}
      <text x="50" y="85" textAnchor="middle" fill="#0369a1" fontSize="7" fontWeight="bold" fontFamily="sans-serif">OXYGEN</text>
      <text x="50" y="96" textAnchor="middle" fill="#0369a1" fontSize="7" fontWeight="bold" fontFamily="sans-serif">MEDICAL</text>
      <text x="50" y="106" textAnchor="middle" fill="#64748b" fontSize="5" fontFamily="sans-serif">IS:309</text>
      {/* Oxygen Mask Attached */}
      <path d="M68 22 Q85 45 75 110 Q70 125 78 135" fill="none" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3,1" opacity="0.8" />
      <ellipse cx="80" cy="138" rx="10" ry="14" fill="#e0f2fe" stroke="#0284c7" strokeWidth="1.5" opacity="0.85" />
    </svg>
  ),

  BPMonitor: () => (
    <svg viewBox="0 0 140 120" className="w-24 h-20 drop-shadow-md">
      {/* Arm Cuff roll in background */}
      <rect x="10" y="25" width="55" height="70" rx="8" fill="#1e293b" />
      <rect x="15" y="30" width="45" height="15" rx="3" fill="#334155" />
      <path d="M35 95 Q40 115 70 95" fill="none" stroke="#64748b" strokeWidth="4" />
      {/* Digital Machine Body */}
      <rect x="55" y="15" width="75" height="85" rx="10" fill="#ffffff" stroke="#e2e8f0" strokeWidth="2" />
      {/* Slanted LCD Display */}
      <rect x="63" y="24" width="59" height="46" rx="4" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
      {/* Digital Readout */}
      <text x="68" y="42" fill="#0f172a" fontSize="16" fontWeight="bold" fontFamily="monospace">118</text>
      <text x="102" y="38" fill="#64748b" fontSize="7" fontFamily="sans-serif">SYS</text>
      <text x="68" y="58" fill="#0f172a" fontSize="15" fontWeight="bold" fontFamily="monospace">78</text>
      <text x="102" y="54" fill="#64748b" fontSize="7" fontFamily="sans-serif">DIA</text>
      <text x="68" y="67" fill="#059669" fontSize="9" fontWeight="bold" fontFamily="monospace">♥ 72</text>
      {/* Start/Stop Button */}
      <rect x="73" y="76" width="39" height="16" rx="8" fill="#2563eb" />
      <text x="92" y="87" textAnchor="middle" fill="#ffffff" fontSize="7" fontWeight="bold" fontFamily="sans-serif">START</text>
    </svg>
  ),

  SarasLantern: () => (
    <svg viewBox="0 0 100 150" className="w-16 h-28 drop-shadow-md">
      {/* Hanging Top Ring */}
      <circle cx="50" cy="14" r="8" fill="none" stroke="#475569" strokeWidth="3" />
      {/* Ornate Arch Roof */}
      <path d="M25 45 C25 25 75 25 75 45 Z" fill="#1e293b" />
      <circle cx="50" cy="24" r="3" fill="#d97706" />
      {/* Lattice Window Grid (Jali) */}
      <rect x="25" y="45" width="50" height="75" rx="3" fill="#0f172a" stroke="#334155" strokeWidth="2" />
      {/* Decorative Jali Cutouts */}
      {[0, 1, 2, 3].map((row) => (
        <g key={row}>
          <circle cx="37" cy={58 + row * 16} r="4" fill="#fbbf24" opacity="0.9" />
          <circle cx="50" cy={58 + row * 16} r="4" fill="#fbbf24" opacity="0.9" />
          <circle cx="63" cy={58 + row * 16} r="4" fill="#fbbf24" opacity="0.9" />
        </g>
      ))}
      {/* Base & Feet */}
      <rect x="20" y="120" width="60" height="8" rx="2" fill="#1e293b" />
      <rect x="24" y="128" width="8" height="6" fill="#334155" />
      <rect x="68" y="128" width="8" height="6" fill="#334155" />
    </svg>
  ),

  OfficeChair: () => (
    <svg viewBox="0 0 120 140" className="w-20 h-24 drop-shadow-md">
      {/* Headrest */}
      <rect x="42" y="8" width="36" height="16" rx="6" fill="#1e293b" />
      {/* Backrest Ergonomic Cushions */}
      <rect x="36" y="26" width="48" height="46" rx="8" fill="#0f172a" stroke="#334155" strokeWidth="2" />
      <rect x="42" y="32" width="36" height="34" rx="4" fill="#1e293b" />
      {/* Seat Base */}
      <rect x="32" y="74" width="56" height="14" rx="6" fill="#0f172a" stroke="#334155" strokeWidth="2" />
      {/* Armrests */}
      <path d="M30 52 L22 52 L22 76 L32 76" fill="none" stroke="#475569" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M90 52 L98 52 L98 76 L88 76" fill="none" stroke="#475569" strokeWidth="3.5" strokeLinecap="round" />
      {/* Gas Lift Hydraulic Cylinder */}
      <rect x="56" y="88" width="8" height="22" fill="#94a3b8" />
      <rect x="54" y="106" width="12" height="6" fill="#0f172a" />
      {/* 5-Star Caster Wheel Base */}
      <line x1="60" y1="110" x2="20" y2="128" stroke="#334155" strokeWidth="4" strokeLinecap="round" />
      <line x1="60" y1="110" x2="100" y2="128" stroke="#334155" strokeWidth="4" strokeLinecap="round" />
      <line x1="60" y1="110" x2="60" y2="132" stroke="#334155" strokeWidth="4" strokeLinecap="round" />
      <circle cx="20" cy="130" r="4" fill="#0f172a" />
      <circle cx="100" cy="130" r="4" fill="#0f172a" />
      <circle cx="60" cy="134" r="4" fill="#0f172a" />
    </svg>
  ),

  FireExtinguisher: () => (
    <svg viewBox="0 0 90 140" className="w-16 h-26 drop-shadow-md">
      {/* Squeeze Lever & Handle */}
      <rect x="40" y="8" width="10" height="10" fill="#1e293b" />
      <path d="M34 14 L24 8 M34 18 L24 24" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
      <path d="M50 14 L65 10" stroke="#1e293b" strokeWidth="3.5" strokeLinecap="round" />
      {/* Pressure Gauge */}
      <circle cx="36" cy="22" r="5" fill="#f8fafc" stroke="#1e293b" strokeWidth="1.5" />
      <circle cx="36" cy="22" r="1.5" fill="#10b981" />
      {/* Red Steel Cylinder Body */}
      <rect x="30" y="28" width="30" height="88" rx="8" fill="#dc2626" stroke="#b91c1c" strokeWidth="2" />
      {/* Highlight reflection */}
      <rect x="34" y="32" width="4" height="80" rx="2" fill="#f87171" opacity="0.8" />
      {/* Yellow Caution Band */}
      <rect x="30" y="62" width="30" height="24" fill="#fef08a" />
      <text x="45" y="73" textAnchor="middle" fill="#0f172a" fontSize="6" fontWeight="bold" fontFamily="sans-serif">ABC DRY</text>
      <text x="45" y="81" textAnchor="middle" fill="#dc2626" fontSize="5" fontWeight="bold" fontFamily="sans-serif">POWDER</text>
      {/* Discharge Hose with Horn */}
      <path d="M50 18 Q68 25 64 65 Q62 90 56 102" fill="none" stroke="#0f172a" strokeWidth="3" />
      <polygon points="56,98 52,108 58,110" fill="#0f172a" />
      {/* Base Ring */}
      <rect x="30" y="114" width="30" height="6" rx="2" fill="#0f172a" />
    </svg>
  ),

  ComputerWorkstation: () => (
    <svg viewBox="0 0 150 120" className="w-24 h-20 drop-shadow-md">
      {/* Desktop Tower on Left */}
      <rect x="12" y="20" width="32" height="74" rx="4" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
      <rect x="16" y="26" width="24" height="6" rx="1" fill="#1e293b" />
      <circle cx="28" cy="40" r="2.5" fill="#38bdf8" />
      <line x1="16" y1="55" x2="40" y2="55" stroke="#334155" strokeWidth="1" />
      <line x1="16" y1="65" x2="40" y2="65" stroke="#334155" strokeWidth="1" />
      <line x1="16" y1="75" x2="40" y2="75" stroke="#334155" strokeWidth="1" />
      {/* Widescreen Monitor */}
      <rect x="50" y="15" width="85" height="58" rx="4" fill="#0f172a" stroke="#334155" strokeWidth="2" />
      <rect x="54" y="19" width="77" height="50" rx="2" fill="#0284c7" />
      {/* Screen wallpaper graphic */}
      <path d="M54 45 Q75 30 95 45 T131 35 L131 69 L54 69 Z" fill="#0369a1" />
      {/* Monitor Stand */}
      <rect x="88" y="73" width="9" height="15" fill="#64748b" />
      <rect x="76" y="88" width="33" height="4" rx="2" fill="#334155" />
      {/* Keyboard */}
      <polygon points="56,96 128,96 134,106 50,106" fill="#1e293b" stroke="#334155" strokeWidth="1" />
      {/* Mouse */}
      <ellipse cx="140" cy="101" rx="4" ry="6" fill="#1e293b" stroke="#334155" strokeWidth="1" />
    </svg>
  ),
};
