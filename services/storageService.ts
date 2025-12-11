
import { UserProfile, UserData, LeaderboardEntry, UserStats, Quest, Language } from '../types';

const USERS_KEY = 'questbox_users_registry';
const DATA_PREFIX = 'questbox_data_';

// Helper to get all users
const getRegistry = (): LeaderboardEntry[] => {
  const json = localStorage.getItem(USERS_KEY);
  return json ? JSON.parse(json) : [];
};

// Helper to save registry
const saveRegistry = (registry: LeaderboardEntry[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(registry));
};

export const storageService = {
  // --- Auth ---
  loginOrRegister: (username: string): { user: UserProfile; isNew: boolean } => {
    const registry = getRegistry();
    let entry = registry.find(u => u.username.toLowerCase() === username.toLowerCase());
    let isNew = false;

    if (!entry) {
      // Register new user
      isNew = true;
      const newUser: LeaderboardEntry = {
        userId: Date.now().toString(36) + Math.random().toString(36).substr(2),
        username: username,
        level: 1,
        totalXp: 0
      };
      registry.push(newUser);
      saveRegistry(registry);
      entry = newUser;
    }

    return {
      user: { id: entry.userId, username: entry.username },
      isNew
    };
  },

  // --- Data Persistence ---
  saveUserData: (userId: string, data: UserData) => {
    // 1. Save detailed data
    localStorage.setItem(DATA_PREFIX + userId, JSON.stringify(data));

    // 2. Update Registry (Leaderboard) with latest stats
    const registry = getRegistry();
    const index = registry.findIndex(u => u.userId === userId);
    if (index !== -1) {
      // Calculate total accumulated XP (rough estimate based on level + current)
      // Or we could track a cumulativeXP field in stats. 
      // For now, sorting by Level then Current XP is sufficient.
      registry[index].level = data.stats.level;
      registry[index].totalXp = data.stats.currentXp; // This is just current level XP, but we sort by Level first
      saveRegistry(registry);
    }
  },

  loadUserData: (userId: string): UserData | null => {
    const json = localStorage.getItem(DATA_PREFIX + userId);
    return json ? JSON.parse(json) : null;
  },

  // --- Leaderboard ---
  getLeaderboard: (): LeaderboardEntry[] => {
    const registry = getRegistry();
    // Sort by Level (desc), then XP (desc)
    return registry.sort((a, b) => {
      if (b.level !== a.level) return b.level - a.level;
      return b.totalXp - a.totalXp;
    });
  }
};
