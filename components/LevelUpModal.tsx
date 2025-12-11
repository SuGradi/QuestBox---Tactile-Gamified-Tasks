import React from 'react';
import { Trophy, Star, Sparkles } from 'lucide-react';
import TactileButton from './TactileButton';
import { Language } from '../types';
import { t } from '../utils/i18n';

interface LevelUpModalProps {
  level: number;
  onClose: () => void;
  lang: Language;
}

const LevelUpModal: React.FC<LevelUpModalProps> = ({ level, onClose, lang }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-500"
        onClick={onClose}
      />
      
      {/* Modal Card */}
      <div className="
        relative bg-white w-full max-w-sm rounded-[2.5rem] p-8 text-center
        border-b-[8px] border-indigo-700 shadow-2xl
        animate-in zoom-in spin-in-1 duration-500
        flex flex-col items-center gap-6
      ">
        {/* Floating Icon */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2">
           <div className="bg-amber-400 p-6 rounded-full border-4 border-white shadow-lg animate-bounce">
             <Trophy size={48} className="text-amber-900" strokeWidth={3} />
           </div>
        </div>

        <div className="mt-8 space-y-2">
          <h2 className="text-3xl font-black text-indigo-600 uppercase tracking-wide">
            {t(lang, 'levelUp')}
          </h2>
          <p className="text-slate-500 font-bold">
            {t(lang, 'levelUpMessage')}
          </p>
        </div>

        {/* Level Display */}
        <div className="relative py-4">
          <Star className="absolute top-0 right-0 text-amber-200 animate-pulse" size={40} />
          <Star className="absolute bottom-2 left-0 text-indigo-200 animate-pulse delay-100" size={30} />
          <div className="text-8xl font-black text-slate-800 font-nunito leading-none">
            {level}
          </div>
        </div>

        <TactileButton 
          fullWidth 
          variant="primary" 
          onClick={onClose}
          icon={<Sparkles className="animate-spin-slow" />}
        >
          {t(lang, 'claimRewards')}
        </TactileButton>
      </div>
    </div>
  );
};

export default LevelUpModal;