import React from 'react';
import { Achievement, Language } from '../types';
import { ACHIEVEMENTS_LIST } from '../utils/constants';
import { t } from '../utils/i18n';
import { Lock, Medal, Award, Crown, Zap } from 'lucide-react';
import TactileButton from './TactileButton';

interface AchievementsModalProps {
  unlockedIds: string[];
  onClose: () => void;
  lang: Language;
}

const AchievementsModal: React.FC<AchievementsModalProps> = ({ unlockedIds, onClose, lang }) => {
  
  const getIcon = (iconName: string, unlocked: boolean) => {
    const props = { size: 24, strokeWidth: 3 };
    if (!unlocked) return <Lock {...props} className="text-slate-400" />;
    
    switch (iconName) {
      case 'medal': return <Medal {...props} className="text-amber-600" />;
      case 'zap': return <Zap {...props} className="text-orange-500 fill-orange-500" />;
      case 'crown': return <Crown {...props} className="text-yellow-500 fill-yellow-200" />;
      case 'award': return <Award {...props} className="text-indigo-500" />;
      default: return <Medal {...props} />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      <div className="
        relative bg-white w-full max-w-md max-h-[80vh] flex flex-col
        rounded-[2rem] overflow-hidden
        border-b-[8px] border-slate-200 shadow-2xl
        animate-in zoom-in duration-300
      ">
        <div className="bg-slate-100 p-6 border-b-2 border-slate-200">
           <h2 className="text-2xl font-black text-slate-800 uppercase tracking-wide flex items-center gap-2">
             <Award size={28} className="text-indigo-600" />
             {t(lang, 'achievements')}
           </h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
           {ACHIEVEMENTS_LIST.map((ach) => {
             const unlocked = unlockedIds.includes(ach.id);
             return (
               <div 
                 key={ach.id}
                 className={`
                   flex items-center gap-4 p-4 rounded-xl border-[3px] transition-all
                   ${unlocked 
                     ? 'bg-amber-50 border-amber-200' 
                     : 'bg-slate-50 border-slate-100 opacity-70 grayscale-[0.5]'}
                 `}
               >
                 <div className={`
                   flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center border-2
                   ${unlocked ? 'bg-white border-amber-200 shadow-sm' : 'bg-slate-200 border-slate-300'}
                 `}>
                   {getIcon(ach.icon, unlocked)}
                 </div>
                 
                 <div>
                   <h3 className={`font-bold uppercase tracking-wider text-sm ${unlocked ? 'text-slate-800' : 'text-slate-500'}`}>
                     {t(lang, ach.titleKey as any)}
                   </h3>
                   <p className="text-xs text-slate-500 font-bold leading-tight mt-0.5">
                     {t(lang, ach.descKey as any)}
                   </p>
                 </div>
               </div>
             );
           })}
        </div>

        <div className="p-4 bg-white border-t-2 border-slate-100">
           <TactileButton fullWidth onClick={onClose} variant="neutral">
             {t(lang, 'cancel')} 
           </TactileButton>
        </div>

      </div>
    </div>
  );
};

export default AchievementsModal;