import React, { useEffect } from 'react';
import { ACHIEVEMENTS_LIST } from '../utils/constants';
import { Language } from '../types';
import { t } from '../utils/i18n';
import { Medal, Award, Crown, Zap, X, Sparkles } from 'lucide-react';
import { playSound } from '../utils/soundEffects';

interface AchievementPopupProps {
  achievementId: string;
  onClose: () => void;
  lang: Language;
}

const AchievementPopup: React.FC<AchievementPopupProps> = ({ achievementId, onClose, lang }) => {
  const achievement = ACHIEVEMENTS_LIST.find(a => a.id === achievementId);

  useEffect(() => {
    playSound('levelUp'); // Use the fancy sound
    
    // Auto close after a few seconds if not clicked
    const timer = setTimeout(() => {
      onClose();
    }, 4500);
    return () => clearTimeout(timer);
  }, [achievementId, onClose]);

  if (!achievement) return null;

  const getIcon = (iconName: string) => {
    const props = { size: 48, strokeWidth: 2.5 };
    switch (iconName) {
      case 'medal': return <Medal {...props} className="text-amber-100" />;
      case 'zap': return <Zap {...props} className="text-amber-100" />;
      case 'crown': return <Crown {...props} className="text-amber-100" />;
      case 'award': return <Award {...props} className="text-amber-100" />;
      default: return <Medal {...props} className="text-amber-100" />;
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-start sm:justify-center pointer-events-none p-4 sm:pt-20">
      <div 
        className="
          pointer-events-auto
          relative 
          bg-slate-800 
          text-white
          w-full max-w-sm 
          rounded-2xl 
          p-1
          shadow-2xl 
          border-4 border-slate-700
          animate-in slide-in-from-bottom-10 fade-in duration-500
          overflow-hidden
        "
        onClick={onClose}
      >
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 animate-[gradient_3s_ease_infinite] bg-[length:200%_200%]" />

        <div className="relative bg-slate-900/90 rounded-xl p-4 flex items-center gap-4 backdrop-blur-sm">
          {/* Icon Box */}
          <div className="relative flex-shrink-0">
            <div className="absolute inset-0 bg-amber-400 blur-lg opacity-50 animate-pulse" />
            <div className="relative bg-gradient-to-br from-amber-400 to-orange-500 w-16 h-16 rounded-xl border-b-[4px] border-orange-700 flex items-center justify-center shadow-lg transform rotate-[-3deg]">
               {getIcon(achievement.icon)}
            </div>
            <div className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-sm animate-bounce">
              <Sparkles size={16} className="text-amber-500" />
            </div>
          </div>

          <div className="flex-grow min-w-0">
             <div className="text-amber-400 text-xs font-black uppercase tracking-widest mb-0.5 flex items-center gap-1">
               <Award size={12} />
               {t(lang, 'achievements')}
             </div>
             <h3 className="text-xl font-black leading-none mb-1 text-white">
               {t(lang, achievement.titleKey as any)}
             </h3>
             <p className="text-sm text-slate-300 font-bold leading-tight">
               {t(lang, achievement.descKey as any)}
             </p>
          </div>

          <button 
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            className="absolute top-2 right-2 text-slate-500 hover:text-white transition-colors"
          >
            <X size={16} strokeWidth={3} />
          </button>
        </div>

        {/* Shine effect */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg] animate-[shimmer_2s_infinite]" />
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-150%) skewX(-20deg); }
          100% { transform: translateX(150%) skewX(-20deg); }
        }
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
};

export default AchievementPopup;