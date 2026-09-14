import React from 'react';
import { GeMMyAvatar } from './GeMAssets';
import { useLanguage } from '../../context/LanguageContext';

interface FloatingGeMMyButtonProps {
  onClick: () => void;
}

export const FloatingGeMMyButton: React.FC<FloatingGeMMyButtonProps> = ({ onClick }) => {
  const { t } = useLanguage();

  return (
    <div className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-40 animate-in fade-in slide-in-from-bottom-3 duration-300">
      <button
        onClick={onClick}
        className="group relative flex items-center gap-2.5 bg-gradient-to-r from-[#008cd3] to-[#0070a8] hover:from-[#007bbd] hover:to-[#005f8f] text-white font-extrabold text-xs py-2 px-4 rounded-full shadow-2xl hover:shadow-cyan-500/50 border-2 border-white/90 transition-all transform hover:scale-105 active:scale-95 cursor-pointer select-none"
        title="Ask GeMMy - Official AI Statutory Compliance Assistant"
        aria-label="Open Ask GeMMy AI Assistant"
      >
        {/* Animated Radar Pulse Ring */}
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border border-white"></span>
        </span>

        {/* GeMMy Avatar Graphic */}
        <div className="w-6 h-6 shrink-0 relative">
          <GeMMyAvatar className="w-6 h-6 shrink-0 group-hover:rotate-6 transition-transform" />
        </div>

        {/* Multilingual Text */}
        <span className="tracking-wide flex items-center gap-1.5 text-xs">
          <span>{t('askGemmy')}</span>
          <span className="italic font-normal text-[10px] text-sky-100 hidden sm:inline">
            {t('askGemmySub')}
          </span>
        </span>

        {/* Subtle Online Badge */}
        <span className="bg-white/20 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full backdrop-blur-xs ml-0.5">
          AI
        </span>
      </button>
    </div>
  );
};
