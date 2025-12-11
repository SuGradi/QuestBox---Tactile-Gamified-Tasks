
import React, { useEffect, useState } from 'react';
import { UserStats, Language } from '../types';
import { Trophy, Star, Sparkles, Flame } from 'lucide-react';
import { t } from '../utils/i18n';

interface StatsHeaderProps {
  stats: UserStats;
  lang: Language;
  lastXpGain?: { value: number; id: number } | null;
}

const StatsHeader: React.FC<StatsHeaderProps> = ({ stats, lang, lastXpGain }) => {
  const [xpPopup, setXpPopup] = useState<{ value: number; key: number } | null>(null);
  const progressPercentage = Math.min((stats.currentXp / stats.xpToNextLevel) * 100, 100);

  useEffect(() => {
    if (lastXpGain) {
      setXpPopup({ value: lastXpGain.value, key: lastXpGain.id });
      
      const timer = setTimeout(() => {
        setXpPopup(null);
      }, 2000); 
      return () => clearTimeout(timer);
    }
  }, [lastXpGain]);

  return (
    // Removed overflow-hidden to allow the XP popup to float outside the card bounds
    <div className="bg-slate-800 text-white p-5 rounded-3xl border-b-[6px] border-slate-950 shadow-xl mb-8 relative transition-all">
      {/* Custom Keyframes for Exquisite Animation */}
      <style>{`
        @keyframes xp-float-up {
          0% {
            opacity: 0;
            transform: translateY(20px) scale(0.5) rotate(-5deg);
          }
          15% {
            opacity: 1;
            transform: translateY(0px) scale(1.2) rotate(0deg);
          }
          30% {
            transform: translateY(0px) scale(1);
          }
          70% {
            opacity: 1;
            transform: translateY(-8px);
          }
          100% {
            opacity: 0;
            transform: translateY(-30px) scale(0.9);
          }
        }
        .animate-xp-pop {
          animation: xp-float-up 1.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}</style>

      {/* Background decoration container with clipping */}
      <div className="absolute inset-0 overflow-hidden rounded-[1.3rem] pointer-events-none">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Trophy size={120} />
        </div>
      </div>

      <div className="flex items-center justify-between mb-2 relative z-10">
        <div className="flex items-center gap-3">
          <div className="bg-amber-400 text-amber-900 p-2 rounded-xl border-b-[3px] border-amber-600 shadow-sm relative group">
            <Trophy size={24} strokeWidth={3} />
          </div>
          <div>
            <h2 className="text-xs uppercase tracking-widest text-slate-400 font-bold">{t(lang, 'playerLevel')}</h2>
            <div className="text-3xl font-extrabold leading-none font-nunito flex items-baseline gap-2">
               {stats.level}
               
               {/* Streak Indicator */}
               {stats.streak > 0 && (
                 <div 
                   className="flex items-center gap-1 text-sm bg-orange-500 text-white px-2 py-0.5 rounded-full border border-orange-400 shadow-sm animate-in zoom-in"
                   title={t(lang, 'streak')}
                 >
                   <Flame size={12} fill="currentColor" />
                   <span className="font-bold">{stats.streak}</span>
                 </div>
               )}
            </div>
          </div>
        </div>
        <div className="text-right relative">
          <div className="text-xs uppercase tracking-widest text-slate-400 font-bold">{t(lang, 'experience')}</div>
          <div className="text-xl font-bold font-nunito text-indigo-300">
            {stats.currentXp} <span className="text-slate-500 text-sm">/ {stats.xpToNextLevel} {t(lang, 'xp')}</span>
          </div>

          {/* Exquisite XP Popup Effect */}
          {xpPopup && (
             <div 
               key={xpPopup.key}
               className="
                 absolute top-0 right-0 -mt-10 -mr-6
                 flex flex-col items-center justify-center
                 pointer-events-none
                 z-50
                 animate-xp-pop
               "
             >
               {/* Confetti Particles */}
               <div className="absolute inset-0 overflow-visible">
                  {[...Array(8)].map((_, i) => (
                    <div 
                      key={i}
                      className="absolute bg-amber-300 rounded-full w-1.5 h-1.5"
                      style={{
                        top: '50%',
                        left: '50%',
                        transform: `rotate(${i * 45}deg) translate(0px)`,
                        animation: `particle-burst-${i} 1s ease-out forwards`
                      }}
                    />
                  ))}
                  <style>{
                    [...Array(8)].map((_, i) => `
                      @keyframes particle-burst-${i} {
                        0% { opacity: 1; transform: rotate(${i * 45}deg) translate(0px); }
                        100% { opacity: 0; transform: rotate(${i * 45}deg) translate(${40 + Math.random() * 20}px); }
                      }
                    `).join('')
                  }</style>
               </div>

               <div className="
                 relative
                 flex items-center gap-1.5
                 bg-emerald-500
                 text-white
                 px-3 py-1.5 rounded-2xl
                 border-b-[4px] border-emerald-700
                 shadow-lg
               ">
                  <div className="relative">
                     <Star className="text-amber-300 fill-amber-300" size={18} strokeWidth={3} />
                     <Sparkles className="absolute -top-2 -right-2 text-white animate-pulse" size={12} />
                  </div>
                  <span 
                    className="font-black text-xl italic"
                    style={{ 
                      textShadow: '0 2px 0 rgba(0,0,0,0.2)',
                    }}
                  >
                    +{xpPopup.value}
                  </span>
               </div>
             </div>
          )}
        </div>
      </div>

      {/* Chunky Progress Bar */}
      <div className="relative h-6 bg-slate-900 rounded-full border-2 border-slate-700 overflow-hidden mt-3 shadow-inner z-10">
        <div 
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 to-sky-400 transition-all duration-500 ease-out flex items-center"
          style={{ width: `${progressPercentage}%` }}
        >
          {/* Shine effect */}
          <div className="w-full h-[2px] bg-white/30 absolute top-1"></div>
        </div>
      </div>
    </div>
  );
};

export default StatsHeader;
