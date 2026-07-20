export type AchievementDef = {
  id: string;
  icon: string;
  title: string;
  desc: string;
  color: string;
  tier: "bronze" | "silver" | "gold" | "diamond";
};

export const ACHIEVEMENTS: AchievementDef[] = [
  { id: "first_run",   icon: "🌱", title: "First Steps",       desc: "Complete your very first typing session",          color: "#22c55e", tier: "bronze" },
  { id: "wpm_40",      icon: "🚗", title: "Cruising",          desc: "Reach 40 WPM in any mode",                          color: "#3b82f6", tier: "bronze" },
  { id: "wpm_60",      icon: "🏎️", title: "Fast Fingers",     desc: "Reach 60 WPM in any mode",                          color: "#7c3aed", tier: "silver" },
  { id: "wpm_80",      icon: "🚀", title: "Rocket Typist",     desc: "Reach 80 WPM in any mode",                          color: "#00f5c4", tier: "gold" },
  { id: "wpm_100",     icon: "⚡", title: "Lightning Hands",   desc: "Break the 100 WPM barrier",                         color: "#f59e0b", tier: "diamond" },
  { id: "acc_100",     icon: "🎯", title: "Perfectionist",     desc: "Finish a run with 100% accuracy",                   color: "#00f5c4", tier: "gold" },
  { id: "acc_95",      icon: "🔍", title: "Sharp Shooter",     desc: "Finish a run with 95%+ accuracy",                   color: "#7c3aed", tier: "silver" },
  { id: "combo_25",    icon: "🔥", title: "On Fire",           desc: "Hit a 25 character combo streak",                   color: "#ef4444", tier: "silver" },
  { id: "combo_50",    icon: "💥", title: "Unstoppable",       desc: "Hit a 50 character combo streak",                   color: "#f59e0b", tier: "gold" },
  { id: "streak_3",    icon: "📅", title: "Habit Forming",     desc: "Play 3 days in a row",                              color: "#22c55e", tier: "bronze" },
  { id: "streak_7",    icon: "🗓️", title: "Week Warrior",     desc: "Play 7 days in a row",                              color: "#7c3aed", tier: "gold" },
  { id: "words_500",   icon: "📖", title: "Bookworm",          desc: "Type 500 total words",                              color: "#3b82f6", tier: "bronze" },
  { id: "words_5000",  icon: "📚", title: "Novelist",          desc: "Type 5,000 total words",                            color: "#f59e0b", tier: "gold" },
  { id: "lesson_5",    icon: "🎓", title: "Student",           desc: "Complete 5 lessons",                                color: "#00f5c4", tier: "silver" },
  { id: "lesson_all",  icon: "👑", title: "Graduate",          desc: "Complete all 10 lessons",                           color: "#f59e0b", tier: "diamond" },
  { id: "all_modes",   icon: "🎮", title: "Explorer",          desc: "Try all 10 typing modes",                            color: "#a855f7", tier: "gold" },
  { id: "blindfold",   icon: "🙈", title: "Blind Faith",       desc: "Complete a Blindfold mode run",                     color: "#ec4899", tier: "silver" },
  { id: "code_master", icon: "💻", title: "Code Ninja",        desc: "Complete a Code Sprint",                            color: "#f59e0b", tier: "silver" },
];

export const TIER_COLORS = {
  bronze: "#cd7f32",
  silver: "#c0c0c0",
  gold: "#f59e0b",
  diamond: "#00f5c4",
};
