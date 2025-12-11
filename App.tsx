import React, { useState, useEffect } from 'react';
import { Quest, UserStats, Language, QuestCategory, SortOption, FilterOption, UserProfile, LeaderboardEntry } from './types';
import { generateQuests } from './services/geminiService';
import { storageService } from './services/storageService';
import StatsHeader from './components/StatsHeader';
import QuestItem from './components/QuestItem';
import LevelUpModal from './components/LevelUpModal';
import AchievementsModal from './components/AchievementsModal';
import AchievementPopup from './components/AchievementPopup';
import LeaderboardModal from './components/LeaderboardModal';
import AuthScreen from './components/AuthScreen';
import QuestInput from './components/QuestInput';
import { Gamepad2, Languages, ArrowUpDown, Filter, Award, Trophy, LogOut } from 'lucide-react';
import { t } from './utils/i18n';
import { playSound } from './utils/soundEffects';

// Simple random ID generator
const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

const App: React.FC = () => {
  // Auth State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  
  // App Data State
  const [quests, setQuests] = useState<Quest[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [lang, setLang] = useState<Language>('en');
  
  // Modals
  const [showLevelUpModal, setShowLevelUpModal] = useState(false);
  const [showAchievementsModal, setShowAchievementsModal] = useState(false);
  const [showLeaderboardModal, setShowLeaderboardModal] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [newlyUnlockedAchievement, setNewlyUnlockedAchievement] = useState<string | null>(null);
  
  // Visual Effects
  const [lastXpGain, setLastXpGain] = useState<{ value: number; id: number } | null>(null);
  
  // UI State for Sorting/Filtering
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [filterOption, setFilterOption] = useState<FilterOption>('active');

  // Default Stats
  const defaultStats: UserStats = {
    level: 1,
    currentXp: 0,
    xpToNextLevel: 100,
    streak: 0,
    lastActiveDate: '',
    totalQuestsCompleted: 0,
    unlockedAchievements: []
  };

  const [stats, setStats] = useState<UserStats>(defaultStats);

  // Initialize Auth from session if needed
  useEffect(() => {
    const lastUserJson = localStorage.getItem('questbox_last_user');
    if (lastUserJson) {
      const user = JSON.parse(lastUserJson);
      handleLogin(user.username, false); // Auto-login
    }
  }, []);

  // Save Data whenever Quests, Stats, or Lang changes (Only if user is logged in)
  useEffect(() => {
    if (currentUser) {
      storageService.saveUserData(currentUser.id, {
        quests,
        stats,
        lang
      });
    }
  }, [quests, stats, lang, currentUser]);

  // Achievement Check Logic
  useEffect(() => {
    if (!currentUser) return;

    const checkAchievements = () => {
      const newUnlocked: string[] = [];
      const { unlockedAchievements, level, streak, totalQuestsCompleted } = stats;

      if (!unlockedAchievements.includes('first_step') && totalQuestsCompleted >= 1) {
        newUnlocked.push('first_step');
      }
      if (!unlockedAchievements.includes('high_five') && level >= 5) {
        newUnlocked.push('high_five');
      }
      if (!unlockedAchievements.includes('streak_master') && streak >= 3) {
        newUnlocked.push('streak_master');
      }
      if (!unlockedAchievements.includes('quest_hunter') && totalQuestsCompleted >= 10) {
        newUnlocked.push('quest_hunter');
      }

      if (newUnlocked.length > 0) {
        // Trigger popup for the first new achievement found
        setNewlyUnlockedAchievement(newUnlocked[0]);
        
        setStats(prev => ({
          ...prev,
          unlockedAchievements: [...prev.unlockedAchievements, ...newUnlocked]
        }));
      }
    };
    
    checkAchievements();
  }, [stats.level, stats.streak, stats.totalQuestsCompleted, currentUser]);

  const handleLogin = (username: string, playEffect = true) => {
    const { user, isNew } = storageService.loginOrRegister(username);
    setCurrentUser(user);
    if (playEffect) playSound('success');
    
    // Load User Data
    const data = storageService.loadUserData(user.id);
    if (data) {
      setQuests(data.quests);
      setStats(data.stats);
      setLang(data.lang);
    } else {
      // Reset for new user
      setQuests([]);
      setStats(defaultStats);
      setLang('en'); 
    }

    // Persist session
    localStorage.setItem('questbox_last_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    playSound('delete');
    setCurrentUser(null);
    setQuests([]);
    setStats(defaultStats);
    localStorage.removeItem('questbox_last_user');
  };

  const openLeaderboard = () => {
    const data = storageService.getLeaderboard();
    setLeaderboardData(data);
    setShowLeaderboardModal(true);
    playSound('click');
  };

  // --- Core Game Logic ---

  const addQuest = (title: string, category: QuestCategory = 'daily', description?: string) => {
    const xpMap: Record<QuestCategory, number> = {
      'daily': 15,
      'side-quest': 10,
      'epic': 50
    };

    const newQuest: Quest = {
      id: generateId(),
      title,
      description,
      completed: false,
      xpValue: xpMap[category],
      category,
      createdAt: Date.now()
    };
    setQuests(prev => [newQuest, ...prev]);
  };

  const toggleQuest = (id: string) => {
    setQuests(prev => prev.map(q => {
      if (q.id === id) {
        const isCompleting = !q.completed;
        if (isCompleting) {
          handleQuestCompletion(q.xpValue);
        } else {
          loseXp(q.xpValue);
        }
        return { ...q, completed: !q.completed };
      }
      return q;
    }));
  };

  const handleQuestCompletion = (xpValue: number) => {
    const today = new Date().toDateString(); 
    let streakBonus = 0;

    setStats(prev => {
      const isNewDay = prev.lastActiveDate !== today;
      let newStreak = prev.streak;

      if (isNewDay) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (prev.lastActiveDate === yesterday.toDateString()) {
           newStreak += 1;
        } else if (prev.lastActiveDate !== today) {
           newStreak = 1; 
        }
      }

      if (newStreak > 1 && isNewDay) {
        streakBonus = 10 * newStreak; 
      }

      return {
        ...prev,
        streak: newStreak,
        lastActiveDate: today,
        totalQuestsCompleted: prev.totalQuestsCompleted + 1
      };
    });

    gainXp(xpValue + streakBonus);
  };

  const updateQuest = (id: string, updates: Partial<Quest>) => {
    setQuests(prev => prev.map(q => q.id === id ? { ...q, ...updates } : q));
  };

  const deleteQuest = (id: string) => {
    setQuests(prev => prev.filter(q => q.id !== id));
  };

  const gainXp = (amount: number) => {
    playSound('xp');
    setLastXpGain({ value: amount, id: Date.now() });
    
    setStats(prev => {
      let newXp = prev.currentXp + amount;
      let newLevel = prev.level;
      let newTarget = prev.xpToNextLevel;
      let leveledUp = false;

      if (newXp >= newTarget) {
        newXp -= newTarget;
        newLevel += 1;
        newTarget = Math.floor(newTarget * 1.5); 
        leveledUp = true;
      }

      if (leveledUp) {
        playSound('levelUp');
        setShowLevelUpModal(true);
      }

      return {
        ...prev,
        level: newLevel,
        currentXp: newXp,
        xpToNextLevel: newTarget
      };
    });
  };

  const loseXp = (amount: number) => {
    setStats(prev => {
       const newXp = Math.max(0, prev.currentXp - amount);
       return { ...prev, currentXp: newXp };
    });
  };

  const handleMagicAssist = async (input: string) => {
    setIsGenerating(true);
    try {
      const suggestions = await generateQuests(input, lang);
      suggestions.forEach(s => addQuest(s, 'side-quest'));
      playSound('magic'); 
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleLanguage = () => {
    playSound('click');
    setLang(prev => prev === 'en' ? 'zh' : 'en');
  };

  // Sorting & Filtering Logic
  const getSortedQuests = (questList: Quest[]) => {
    return [...questList].sort((a, b) => {
      if (sortOption === 'xp') return b.xpValue - a.xpValue;
      if (sortOption === 'category') return a.category.localeCompare(b.category);
      return b.createdAt - a.createdAt; 
    });
  };

  const filteredQuests = quests.filter(q => {
    if (filterOption === 'active') return !q.completed;
    if (filterOption === 'completed') return q.completed;
    return true; 
  });

  const displayQuests = getSortedQuests(filteredQuests);

  // --- Render ---

  if (!currentUser) {
    return <AuthScreen onLogin={handleLogin} lang={lang} />;
  }

  return (
    <div className="min-h-screen pb-20 flex flex-col items-center justify-start pt-20 px-4 md:pt-16">
      
      {/* Modals & Popups */}
      {showLevelUpModal && (
        <LevelUpModal 
          level={stats.level} 
          onClose={() => setShowLevelUpModal(false)} 
          lang={lang}
        />
      )}

      {showAchievementsModal && (
        <AchievementsModal 
          unlockedIds={stats.unlockedAchievements}
          onClose={() => setShowAchievementsModal(false)}
          lang={lang}
        />
      )}

      {showLeaderboardModal && (
        <LeaderboardModal 
          entries={leaderboardData}
          currentUserId={currentUser.id}
          onClose={() => setShowLeaderboardModal(false)}
          lang={lang}
        />
      )}

      {newlyUnlockedAchievement && (
        <AchievementPopup 
          achievementId={newlyUnlockedAchievement}
          onClose={() => setNewlyUnlockedAchievement(null)}
          lang={lang}
        />
      )}

      {/* Top Controls */}
      <div className="absolute top-4 right-4 flex gap-2">
        <button 
          onClick={toggleLanguage}
          className="bg-white/80 p-2 rounded-xl text-slate-600 font-bold border-2 border-slate-200 shadow-sm hover:bg-white active:scale-95 transition-all flex items-center gap-2"
        >
          <Languages size={18} />
          <span className="hidden sm:inline">{lang === 'en' ? 'EN' : '中文'}</span>
        </button>
        <button 
          onClick={handleLogout}
          className="bg-slate-200/80 p-2 rounded-xl text-slate-600 font-bold border-2 border-slate-300 shadow-sm hover:bg-rose-100 hover:text-rose-600 active:scale-95 transition-all"
          title={t(lang, 'logout')}
        >
          <LogOut size={18} />
        </button>
      </div>

      <div className="absolute top-4 left-4 flex gap-2">
        <button 
          onClick={() => { setShowAchievementsModal(true); playSound('click'); }}
          className="bg-white/80 p-2 rounded-xl text-amber-600 font-bold border-2 border-slate-200 shadow-sm hover:bg-white active:scale-95 transition-all"
          title={t(lang, 'achievements')}
        >
          <Award size={18} />
        </button>
        <button 
          onClick={openLeaderboard}
          className="bg-white/80 p-2 rounded-xl text-indigo-600 font-bold border-2 border-slate-200 shadow-sm hover:bg-white active:scale-95 transition-all"
          title={t(lang, 'leaderboard')}
        >
          <Trophy size={18} />
        </button>
      </div>
      
      <main className="w-full max-w-lg animate-in zoom-in duration-300">
        
        {/* App Title */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="bg-indigo-600 text-white p-3 rounded-2xl shadow-lg rotate-[-6deg]">
             <Gamepad2 size={32} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <h1 className="text-4xl font-black text-slate-800 tracking-tight uppercase leading-none">
              {t(lang, 'appTitle')}<span className="text-indigo-600">{t(lang, 'appTitleSuffix')}</span>
            </h1>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1 mt-1">
              {t(lang, 'player')}: {currentUser.username}
            </span>
          </div>
        </div>

        {/* Stats */}
        <StatsHeader stats={stats} lang={lang} lastXpGain={lastXpGain} />

        {/* New Input Component */}
        <QuestInput 
          onAdd={addQuest} 
          onMagicAssist={handleMagicAssist} 
          isGenerating={isGenerating} 
          lang={lang} 
        />

        {/* Controls: Filter & Sort */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4 justify-between items-center bg-slate-100 p-2 rounded-xl">
           
           {/* Filters */}
           <div className="flex bg-white p-1 rounded-lg shadow-sm w-full sm:w-auto">
             {(['active', 'completed', 'all'] as FilterOption[]).map(f => (
               <button
                 key={f}
                 onClick={() => { setFilterOption(f); playSound('click'); }}
                 className={`
                   flex-1 sm:flex-none px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all
                   ${filterOption === f 
                     ? 'bg-indigo-100 text-indigo-700' 
                     : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}
                 `}
               >
                 {t(lang, `filter_${f}` as any)}
               </button>
             ))}
           </div>

           {/* Sorting */}
           <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
             <span className="text-xs font-bold text-slate-400 uppercase hidden sm:inline"><ArrowUpDown size={14} /></span>
             <select
               value={sortOption}
               onChange={(e) => { setSortOption(e.target.value as SortOption); playSound('click'); }}
               className="
                 w-full sm:w-auto
                 bg-white text-slate-600 font-bold text-xs uppercase tracking-wide
                 py-2 px-3 rounded-lg border-2 border-slate-200
                 focus:border-indigo-300 outline-none
                 cursor-pointer hover:bg-slate-50
               "
             >
               <option value="newest">{t(lang, 'sort_newest')}</option>
               <option value="xp">{t(lang, 'sort_xp')}</option>
               <option value="category">{t(lang, 'sort_category')}</option>
             </select>
           </div>
        </div>

        {/* Quest List */}
        <div className="space-y-4">
          <div className="space-y-3 min-h-[100px]">
            {displayQuests.length === 0 && (
              <div className="flex flex-col items-center justify-center py-10 text-slate-400 opacity-60">
                <div className="bg-slate-200 p-4 rounded-full mb-3">
                  <Filter size={40} />
                </div>
                <p className="font-bold">{t(lang, 'noActive')}</p>
              </div>
            )}
            {displayQuests.map(quest => (
              <QuestItem 
                key={quest.id} 
                quest={quest} 
                onToggle={toggleQuest} 
                onDelete={deleteQuest} 
                onUpdate={updateQuest}
                lang={lang}
              />
            ))}
          </div>
        </div>
      </main>
      
      <footer className="mt-12 text-center text-slate-400 font-bold text-sm">
        <p>{t(lang, 'buildLegacy')}</p>
      </footer>

    </div>
  );
};

export default App;
