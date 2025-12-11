
export type QuestCategory = 'daily' | 'epic' | 'side-quest';

export interface Quest {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  xpValue: number;
  category: QuestCategory;
  createdAt: number;
}

export interface UserStats {
  level: number;
  currentXp: number;
  xpToNextLevel: number;
  // New features
  streak: number;
  lastActiveDate: string; // YYYY-MM-DD
  totalQuestsCompleted: number;
  unlockedAchievements: string[];
}

export interface Achievement {
  id: string;
  icon: string; 
  titleKey: string;
  descKey: string;
}

// User System Types
export interface UserProfile {
  id: string;
  username: string;
  avatarId?: number; // For future avatar feature
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  level: number;
  totalXp: number; // Cumulative XP for ranking
}

export interface UserData {
  quests: Quest[];
  stats: UserStats;
  lang: Language;
}

export type ButtonVariant = 'primary' | 'success' | 'destructive' | 'magic' | 'neutral';

export type Language = 'en' | 'zh';

export type SortOption = 'newest' | 'xp' | 'category';
export type FilterOption = 'all' | 'active' | 'completed';
