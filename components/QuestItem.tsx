
import React, { useState } from 'react';
import { Quest, Language, QuestCategory } from '../types';
import { Check, Trash2, ChevronDown, ChevronUp, Scroll, Sword, Zap, Pencil, Save, X } from 'lucide-react';
import { t } from '../utils/i18n';
import { playSound } from '../utils/soundEffects';

interface QuestItemProps {
  quest: Quest;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Quest>) => void;
  lang?: Language; 
}

const QuestItem: React.FC<QuestItemProps> = ({ quest, onToggle, onDelete, onUpdate, lang = 'en' as Language }) => {
  const [isExiting, setIsExiting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Edit Mode State
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(quest.title);
  const [editDescription, setEditDescription] = useState(quest.description || '');

  const handleDelete = () => {
    playSound('delete');
    setIsExiting(true);
    setTimeout(() => onDelete(quest.id), 300); 
  };

  const handleToggle = () => {
    if (!quest.completed) {
      playSound('success');
    } else {
      playSound('click');
    }
    onToggle(quest.id);
  };

  const handleSave = () => {
    playSound('pop');
    onUpdate(quest.id, {
      title: editTitle,
      description: editDescription.trim() || undefined
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    playSound('click');
    setEditTitle(quest.title);
    setEditDescription(quest.description || '');
    setIsEditing(false);
  };

  const getCategoryColor = (cat: QuestCategory) => {
    switch (cat) {
      case 'epic': return 'text-amber-600 bg-amber-100 border-amber-200';
      case 'side-quest': return 'text-emerald-600 bg-emerald-100 border-emerald-200';
      default: return 'text-blue-600 bg-blue-100 border-blue-200'; // daily
    }
  };

  const getCategoryIcon = (cat: QuestCategory) => {
    switch (cat) {
      case 'epic': return <Sword size={12} strokeWidth={3} />;
      case 'side-quest': return <Zap size={12} strokeWidth={3} />;
      default: return <Scroll size={12} strokeWidth={3} />;
    }
  };

  return (
    <div 
      className={`
        group
        relative
        flex flex-col
        bg-white
        p-0 rounded-2xl
        border-b-[4px]
        border-slate-200
        hover:border-indigo-200
        transition-all duration-300
        ${isExiting ? 'opacity-0 translate-x-10 scale-95' : 'opacity-100 scale-100'}
        ${quest.completed ? 'bg-slate-50 border-slate-100' : ''}
        animate-in slide-in-from-bottom-2 fade-in duration-300
      `}
    >
      <div className="flex items-start gap-3 p-4 pb-2">
        
        {/* Checkbox (Hidden in edit mode) */}
        {!isEditing && (
          <button
            onClick={handleToggle}
            className={`
              flex-shrink-0 mt-1
              w-10 h-10 rounded-xl
              border-[3px]
              flex items-center justify-center
              transition-all duration-200
              ${quest.completed 
                ? 'bg-emerald-500 border-emerald-600 rotate-3 scale-110 shadow-sm' 
                : 'bg-white border-slate-300 hover:border-indigo-400 active:scale-95'}
            `}
            aria-label={quest.completed ? "Mark as incomplete" : "Mark as complete"}
          >
            {quest.completed && <Check className="text-white" size={24} strokeWidth={4} />}
          </button>
        )}

        <div className="flex-grow min-w-0 flex flex-col justify-center">
           
           {/* Category Badge & Controls */}
           <div className="flex items-center justify-between mb-1">
             <div className={`
               self-start flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border-b-[2px]
               ${getCategoryColor(quest.category)}
             `}>
               {getCategoryIcon(quest.category)}
               {t(lang, `cat_${quest.category}` as any)}
             </div>
             
             {/* Edit/Action Buttons */}
             {!quest.completed && !isEditing && (
                <div className="flex opacity-0 group-hover:opacity-100 transition-opacity focus-within:opacity-100">
                  <button
                    onClick={() => { playSound('click'); setIsEditing(true); setIsExpanded(true); }}
                    className="p-1 text-slate-300 hover:text-indigo-500 transition-colors"
                    aria-label={t(lang, 'edit')}
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={handleDelete}
                    className="p-1 text-slate-300 hover:text-rose-500 transition-colors ml-1"
                    aria-label={t(lang, 'delete')}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
             )}
           </div>

          {/* Title Area */}
          {isEditing ? (
            <input 
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="
                w-full text-lg font-bold text-slate-800 
                bg-slate-50 border-2 border-indigo-200 rounded-lg 
                px-2 py-1 outline-none focus:border-indigo-400
              "
              autoFocus
            />
          ) : (
            <span 
              className={`
                block text-lg font-bold truncate transition-all duration-300
                ${quest.completed ? 'text-slate-400 line-through' : 'text-slate-700'}
              `}
            >
              {quest.title}
            </span>
          )}
        </div>
      </div>

      {/* Edit Mode Actions or Footer Info */}
      {isEditing ? (
        <div className="px-4 pb-4">
          <textarea
             value={editDescription}
             onChange={(e) => setEditDescription(e.target.value)}
             placeholder={t(lang, 'descriptionPlaceholder')}
             rows={3}
             className="
               w-full mt-2 bg-slate-50 text-slate-700 font-medium text-sm
               rounded-xl px-3 py-2
               border-2 border-indigo-200 focus:border-indigo-400
               outline-none resize-none mb-3
             "
          />
          <div className="flex gap-2">
            <button 
              onClick={handleSave}
              className="flex-1 bg-indigo-500 hover:bg-indigo-400 text-white font-bold py-2 rounded-lg text-sm border-b-[3px] border-indigo-700 active:border-b-0 active:translate-y-[3px] flex items-center justify-center gap-2"
            >
              <Save size={14} /> {t(lang, 'save')}
            </button>
            <button 
              onClick={handleCancel}
              className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-600 font-bold py-2 rounded-lg text-sm border-b-[3px] border-slate-400 active:border-b-0 active:translate-y-[3px] flex items-center justify-center gap-2"
            >
              <X size={14} /> {t(lang, 'cancel')}
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Footer Info Row */}
          <div className="flex items-center justify-between px-4 pb-3 pl-[3.5rem]">
             <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              +{quest.xpValue} {t(lang, 'xp')}
            </span>

            {quest.description && (
              <button 
                onClick={() => { playSound('click'); setIsExpanded(!isExpanded); }}
                className="flex items-center gap-1 text-xs font-bold text-indigo-400 hover:text-indigo-600 transition-colors uppercase tracking-wider"
              >
                {isExpanded ? t(lang, 'collapse') : t(lang, 'expand')}
                {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            )}
          </div>

          {/* Expandable Description */}
          {quest.description && (
            <div className={`
              overflow-hidden transition-all duration-300 ease-in-out px-4 pl-[3.5rem]
              ${isExpanded ? 'max-h-60 opacity-100 pb-4' : 'max-h-0 opacity-0'}
            `}>
              <div className="bg-slate-50 p-3 rounded-xl border-2 border-slate-100 text-sm text-slate-600 font-medium leading-relaxed">
                {quest.description}
              </div>
            </div>
          )}
        </>
      )}

    </div>
  );
};

export default QuestItem;