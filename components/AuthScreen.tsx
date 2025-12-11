
import React, { useState } from 'react';
import { Gamepad2, ArrowRight } from 'lucide-react';
import TactileButton from './TactileButton';
import { t } from '../utils/i18n';
import { Language } from '../types';

interface AuthScreenProps {
  onLogin: (username: string) => void;
  lang: Language;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin, lang }) => {
  const [username, setUsername] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onLogin(username.trim());
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#f0f2f5]">
      <div className="w-full max-w-sm animate-in zoom-in duration-500">
        
        {/* Logo Area */}
        <div className="flex flex-col items-center gap-4 mb-10">
          <div className="bg-indigo-600 text-white p-6 rounded-3xl shadow-xl rotate-[-6deg] border-b-[8px] border-indigo-800">
             <Gamepad2 size={64} strokeWidth={2.5} />
          </div>
          <h1 className="text-5xl font-black text-slate-800 tracking-tight uppercase mt-4">
            {t(lang, 'appTitle')}<span className="text-indigo-600">{t(lang, 'appTitleSuffix')}</span>
          </h1>
        </div>

        {/* Card */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl border-b-[8px] border-slate-200">
          <h2 className="text-2xl font-black text-slate-700 mb-2 text-center">{t(lang, 'welcome')}</h2>
          <p className="text-slate-400 text-center font-bold mb-8 text-sm">{t(lang, 'loginDescription')}</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={t(lang, 'enterName')}
              className="
                w-full bg-slate-100 text-slate-800 font-bold text-lg text-center
                placeholder:text-slate-400
                rounded-2xl px-5 py-4
                border-b-[4px] border-slate-300 focus:border-indigo-500 focus:bg-white
                outline-none transition-all
              "
              autoFocus
            />
            
            <TactileButton 
              type="submit" 
              variant="primary" 
              fullWidth 
              className="mt-2"
              disabled={!username.trim()}
              icon={<ArrowRight />}
            >
              {t(lang, 'startAdventure')}
            </TactileButton>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
