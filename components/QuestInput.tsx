
import React, { useState } from 'react';
import { QuestCategory, Language } from '../types';
import TactileButton from './TactileButton';
import { Plus, Wand2, Loader2, Sword, Scroll, Zap } from 'lucide-react';
import { t } from '../utils/i18n';
import { playSound } from '../utils/soundEffects';

interface QuestInputProps {
  onAdd: (title: string, category: QuestCategory, description?: string) => void;
  onMagicAssist: (input: string) => Promise<void>;
  isGenerating: boolean;
  lang: Language;
}

const QuestInput: React.FC<QuestInputProps> = ({ onAdd, onMagicAssist, isGenerating, lang }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<QuestCategory>('daily');
  const [showDetails, setShowDetails] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    playSound('pop');
    onAdd(title.trim(), category, description.trim() || undefined);
    setTitle('');
    setDescription('');
    // Reset category to daily, or keep it? Keeping it feels better.
    setShowDetails(false);
  };

  const handleMagicClick = () => {
    playSound('magic');
    onMagicAssist(title);
    setTitle('');
    setDescription('');
  };

  const getCategoryIcon = (c: QuestCategory) => {
    switch (c) {
      case 'daily': return <Scroll size={16} />;
      case 'epic': return <Sword size={16} />;
      case 'side-quest': return <Zap size={16} />;
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-md p-3 rounded-[2rem] shadow-xl border-4 border-white mb-6 animate-in zoom-in duration-300">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        
        {/* Main Title Input */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t(lang, 'newQuestPlaceholder')}
          className="
            w-full bg-slate-100 text-slate-800 font-bold text-lg 
            placeholder:text-slate-400
            rounded-2xl px-5 py-4
            border-2 border-transparent focus:border-indigo-400 focus:bg-white
            outline-none transition-all
          "
        />

        {/* Expandable Details Area */}
        <div className={`
          overflow-hidden transition-all duration-300 ease-in-out
          ${title || showDetails ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
        `}>
          <div className="flex flex-col gap-3 px-1">
            {/* Category Selection */}
            <div className="flex gap-2">
              {(['daily', 'side-quest', 'epic'] as QuestCategory[]).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => { setCategory(cat); playSound('click'); }}
                  className={`
                    flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-bold border-b-[3px] transition-all
                    ${category === cat 
                      ? 'bg-indigo-100 text-indigo-700 border-indigo-300 translate-y-[1px] border-b-[1px]' 
                      : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'}
                  `}
                >
                  {getCategoryIcon(cat)}
                  <span className="hidden sm:inline">{t(lang, `cat_${cat}` as any)}</span>
                </button>
              ))}
            </div>

            {/* Description Textarea */}
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t(lang, 'descriptionPlaceholder')}
              rows={2}
              className="
                w-full bg-slate-50 text-slate-700 font-medium text-sm
                rounded-xl px-4 py-3
                border-2 border-slate-100 focus:border-indigo-200 focus:bg-white
                outline-none resize-none
              "
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <TactileButton 
            type="button" 
            variant="magic" 
            className="flex-1 text-sm sm:text-base"
            onClick={handleMagicClick}
            disabled={isGenerating}
            icon={isGenerating ? <Loader2 className="animate-spin" /> : <Wand2 strokeWidth={3} />}
          >
            {isGenerating ? t(lang, 'summoning') : (title ? t(lang, 'breakDown') : t(lang, 'inspireMe'))}
          </TactileButton>
          
          <TactileButton 
            type="submit" 
            className="flex-none px-6"
            disabled={!title.trim()}
            icon={<Plus strokeWidth={4} />}
          >
            {/* Icon only on mobile, text on desktop if needed, currently just icon in App */}
          </TactileButton>
        </div>
      </form>
    </div>
  );
};

export default QuestInput;