import { useGameStore } from "../store/gameStore";
import { showAchievement } from "../components/AchievementToast";
import type { TypingResult } from "../hooks/useTypingEngine";
import type { GameMode } from "../store/gameStore";

const ALL_MODES: GameMode[] = ["arcade","sprint","marathon","code","blindfold","wordsniper","speedrun","zen","challenge","lessonmode"];

export function checkResultAchievements(result: TypingResult, mode: GameMode) {
  const store = useGameStore.getState();
  const unlock = (id: string) => { if (store.unlockAchievement(id)) showAchievement(id); };

  unlock("first_run");
  if (result.wpm >= 40) unlock("wpm_40");
  if (result.wpm >= 60) unlock("wpm_60");
  if (result.wpm >= 80) unlock("wpm_80");
  if (result.wpm >= 100) unlock("wpm_100");
  if (result.accuracy >= 100 && result.correct > 20) unlock("acc_100");
  if (result.accuracy >= 95 && result.correct > 20) unlock("acc_95");
  if (result.combo >= 25) unlock("combo_25");
  if (result.combo >= 50) unlock("combo_50");
  if (mode === "blindfold") unlock("blindfold");
  if (mode === "code") unlock("code_master");

  // aggregate stats (read fresh after addStats ran)
  const fresh = useGameStore.getState();
  if (fresh.totalWordsTyped >= 500) unlock("words_500");
  if (fresh.totalWordsTyped >= 5000) unlock("words_5000");
  if (fresh.dailyStreak >= 3) unlock("streak_3");
  if (fresh.dailyStreak >= 7) unlock("streak_7");

  const lessonsDone = Object.values(fresh.lessonProgress).filter((p) => p.completed).length;
  if (lessonsDone >= 5) unlock("lesson_5");
  if (lessonsDone >= 10) unlock("lesson_all");

  // all modes tried — track via high scores
  const modesTried = new Set(fresh.highScores.map((h) => h.mode));
  modesTried.add(mode);
  if (ALL_MODES.every((m) => modesTried.has(m))) unlock("all_modes");
}
