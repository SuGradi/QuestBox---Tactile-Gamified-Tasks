
import React from 'react';
import { LeaderboardEntry, Language } from '../types';
import { t } from '../utils/i18n';
import { Trophy, Crown, Medal, User } from 'lucide-react';
import TactileButton from './TactileButton';

interface LeaderboardModalProps {
  entries: LeaderboardEntry[];
  currentUserId: string;
  onClose: () => void;
  lang: Language;
}

const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ entries, currentUserId, onClose, lang }) => {
  
  const getRankStyle = (index: number) => {
    switch (index) {
      case 0: return 'bg-yellow-100 border-yellow-300 text-yellow-700';
      case 1: return 'bg-slate-200 border-slate-300 text-slate-600';
      case 2: return 'bg-orange-100 border-orange-200 text-orange-700';
      default: return 'bg-white border-slate-100 text-slate-500';
    }
  };

  const getRankIcon = (index: number) => {
    const props = { size: 20, strokeWidth: 3 };
    switch (index) {
      case 0: return <Crown {...props} className="fill-yellow-400 text-yellow-600" />;
      case 1: return <Medal {...props} className="text-slate-500" />;
      case 2: return <Medal {...props} className="text-orange-600" />;
      default: return <span className="font-black text-lg w-5 text-center">{index + 1}</span>;
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
        border-b-[8px] border-indigo-900 shadow-2xl
        animate-in zoom-in duration-300
      "
      style={{
        backgroundImage: 'radial-gradient(circle at top right, #f1f5f9 0%, transparent 40%)'
      }}
      >
        <div className="bg-indigo-600 p-6 border-b-4 border-indigo-800 text-white">
           <h2 className="text-2xl font-black uppercase tracking-wide flex items-center justify-center gap-3">
             <Trophy size={28} className="text-yellow-300 fill-yellow-500" />
             {t(lang, 'leaderboard')}
           </h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#f8fafc]">
           {entries.length === 0 && (
             <div className="text-center p-8 text-slate-400 font-bold">
               {t(lang, 'emptyLeaderboard')}
             </div>
           )}

           {entries.map((entry, index) => {
             const isMe = entry.userId === currentUserId;
             return (
               <div 
                 key={entry.userId}
                 className={`
                   flex items-center gap-4 p-3 rounded-xl border-[3px] shadow-sm transition-transform
                   ${getRankStyle(index)}
                   ${isMe ? 'ring-2 ring-indigo-500 ring-offset-2 scale-[1.02]' : ''}
                 `}
               >
                 <div className="flex-shrink-0 w-8 flex justify-center">
                   {getRankIcon(index)}
                 </div>
                 
                 <div className="flex-grow flex items-center gap-3">
                    <div className={`p-1.5 rounded-full ${isMe ? 'bg-indigo-500 text-white' : 'bg-white/50'}`}>
                      <User size={16} strokeWidth={3} />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-black text-slate-800 leading-tight">
                        {entry.username} {isMe && <span className="text-[10px] bg-indigo-500 text-white px-1.5 rounded ml-1">YOU</span>}
                      </span>
                      <span className="text-xs font-bold opacity-70">
                        {t(lang, 'level')} {entry.level}
                      </span>
                    </div>
                 </div>

                 <div className="text-right">
                    <span className="block font-black text-sm opacity-80">{entry.totalXp} XP</span>
                 </div>
               </div>
             );
           })}
        </div>

        <div className="p-4 bg-white border-t-2 border-slate-100 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
           <TactileButton fullWidth onClick={onClose} variant="neutral">
             {t(lang, 'cancel')} 
           </TactileButton>
        </div>

      </div>
    </div>
  );
};

export default LeaderboardModal;
