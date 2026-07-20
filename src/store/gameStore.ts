import { create } from "zustand";
import { persist } from "zustand/middleware";

export type GameMode =
  | "arcade"       // 1. Falling words
  | "sprint"       // 2. Type 50 words as fast as possible
  | "marathon"     // 3. Endless typing with stamina
  | "code"         // 4. Type code snippets
  | "blindfold"    // 5. Type without seeing what you type
  | "wordsniper"   // 6. Snipe specific words from chaos
  | "speedrun"     // 7. Beat the clock - letters appear one by one
  | "zen"          // 8. Calm practice mode no timer
  | "challenge"    // 9. Daily challenge quote
  | "lessonmode";  // 10. Structured keyboard lessons

export type GameScreen =
  | "home" | "modeSelect" | "game" | "results" | "leaderboard" | "lessons"
  | "keyboard" | "settings" | "stats" | "achievements"
  | "codeLab" | "dojo" | "certificate";

export type KeyboardLayout = "qwerty" | "dvorak" | "colemak" | "azerty";
export type KeyboardTheme = "aurora" | "sunset" | "cyber" | "mono" | "candy";
export type KeyboardModel = "wave" | "purpleCase" | "rgbMech" | "glassMac" | "neumorph" | "isometric";

export type HighScore = {
  mode: GameMode;
  wpm: number;
  accuracy: number;
  score: number;
  date: number;
  name: string;
};

export type LessonProgress = {
  lessonId: number;
  stars: number;
  bestWpm: number;
  completed: boolean;
};

export type TestConfig = {
  includePunctuation: boolean;
  includeNumbers: boolean;
  duration: 15 | 30 | 60 | 120;
  wordCount: 10 | 25 | 50 | 100;
  customText: string;
};

export type UserSettings = {
  soundEnabled: boolean;
  showKeyboard: boolean;
  keyboardHints: boolean;
  fingerColors: boolean;
  smoothCaret: boolean;
  glowWave: boolean;
  keySound: "click" | "typewriter" | "soft" | "off";
  theme: "neon" | "matrix" | "sunset" | "ocean";
  keyboardLayout: KeyboardLayout;
  keyboardTheme: KeyboardTheme;
  keyboardModel: KeyboardModel;
  keyboardScale: number; // 0.4 to 1.3
  fontSize: "sm" | "md" | "lg";
  testConfig: TestConfig;
};

export type Achievement = {
  id: string;
  unlockedAt: number;
};

export type KeyStat = { hit: number; miss: number };

interface GameStore {
  screen: GameScreen;
  currentMode: GameMode;
  userName: string;
  highScores: HighScore[];
  lessonProgress: Record<number, LessonProgress>;
  settings: UserSettings;
  totalWordsTyped: number;
  totalTimeTyped: number; // seconds
  totalSessions: number;
  achievements: Achievement[];
  dailyStreak: number;
  lastPlayDate: string;
  keyStats: Record<string, KeyStat>;

  setScreen: (s: GameScreen) => void;
  setMode: (m: GameMode) => void;
  setUserName: (n: string) => void;
  addHighScore: (hs: HighScore) => void;
  updateLesson: (id: number, p: Partial<LessonProgress>) => void;
  updateSettings: (s: Partial<UserSettings>) => void;
  addStats: (words: number, time: number) => void;
  getBestScore: (mode: GameMode) => HighScore | null;
  unlockAchievement: (id: string) => boolean;
  touchDay: () => void;
  updateKeyStat: (key: string, correct: boolean) => void;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      screen: "home",
      currentMode: "sprint",
      userName: "",
      highScores: [],
      lessonProgress: {},
      settings: {
        soundEnabled: true,
        showKeyboard: true,
        keyboardHints: true,
        fingerColors: true,
        smoothCaret: true,
        glowWave: true,
        keySound: "click",
        theme: "neon",
        keyboardLayout: "qwerty",
        keyboardTheme: "aurora",
        keyboardModel: "wave",
        keyboardScale: 0.75,
        fontSize: "md",
        testConfig: {
          includePunctuation: false,
          includeNumbers: false,
          duration: 30,
          wordCount: 50,
          customText: "",
        },
      },
      totalWordsTyped: 0,
      totalTimeTyped: 0,
      totalSessions: 0,
      achievements: [],
      dailyStreak: 0,
      lastPlayDate: "",
      keyStats: {},

      setScreen: (screen) => set({ screen }),
      setMode: (currentMode) => set({ currentMode }),
      setUserName: (userName) => set({ userName }),

      addHighScore: (hs) =>
        set((s) => ({
          highScores: [...s.highScores, hs]
            .sort((a, b) => b.score - a.score)
            .slice(0, 100),
        })),

      updateLesson: (id, p) =>
        set((s) => ({
          lessonProgress: {
            ...s.lessonProgress,
            [id]: { ...(s.lessonProgress[id] || { lessonId: id, stars: 0, bestWpm: 0, completed: false }), ...p },
          },
        })),

      updateSettings: (s) =>
        set((prev) => ({ settings: { ...prev.settings, ...s } })),

      addStats: (words, time) =>
        set((s) => ({
          totalWordsTyped: s.totalWordsTyped + words,
          totalTimeTyped: s.totalTimeTyped + time,
          totalSessions: s.totalSessions + 1,
        })),

      getBestScore: (mode) => {
        const scores = get().highScores.filter((h) => h.mode === mode);
        return scores.length ? scores.sort((a, b) => b.score - a.score)[0] : null;
      },

      unlockAchievement: (id) => {
        const existing = get().achievements.find((a) => a.id === id);
        if (existing) return false;
        set((s) => ({ achievements: [...s.achievements, { id, unlockedAt: Date.now() }] }));
        return true;
      },

      touchDay: () => {
        const today = new Date().toDateString();
        const { lastPlayDate, dailyStreak } = get();
        if (lastPlayDate === today) return;
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        set({
          dailyStreak: lastPlayDate === yesterday ? dailyStreak + 1 : 1,
          lastPlayDate: today,
        });
      },

      updateKeyStat: (key, correct) => {
        if (!key) return;
        const k = key === " " ? "space" : key.toLowerCase();
        set((s) => {
          const prev = s.keyStats[k] || { hit: 0, miss: 0 };
          return {
            keyStats: {
              ...s.keyStats,
              [k]: correct ? { ...prev, hit: prev.hit + 1 } : { ...prev, miss: prev.miss + 1 },
            },
          };
        });
      },
    }),
    { name: "typeflow-app-v1" }
  )
);
