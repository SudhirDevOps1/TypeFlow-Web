import { useEffect, useState, useCallback } from "react";
import { useGameStore } from "./store/gameStore";
import { HomeScreen } from "./screens/HomeScreen";
import { ModeSelectScreen } from "./screens/ModeSelectScreen";
import { GameScreen } from "./screens/GameScreen";
import { LeaderboardScreen } from "./screens/LeaderboardScreen";
import { LessonBrowser } from "./screens/LessonBrowser";
import { KeyboardStudio } from "./screens/KeyboardStudio";
import { SettingsScreen } from "./screens/SettingsScreen";
import { StatsScreen } from "./screens/StatsScreen";
import { AchievementsScreen } from "./screens/AchievementsScreen";
import { CodeLabScreen } from "./screens/CodeLabScreen";
import { DojoScreen } from "./screens/DojoScreen";
import { CertificateScreen } from "./screens/CertificateScreen";
import { ParticleCanvas } from "./components/ParticleCanvas";
import { AchievementToast } from "./components/AchievementToast";
import { Sound } from "./lib/sound";

export default function App() {
  const { screen, setScreen, setMode, settings } = useGameStore();
  const [lessonId, setLessonId] = useState<number>(1);

  useEffect(() => {
    Sound.setMuted(!settings.soundEnabled);
  }, [settings.soundEnabled]);

  // NOTE (production-grade): We intentionally do NOT auto-navigate to any
  // screen based on ambient key presses or clicks on the Home screen.
  // Implicit navigation surprises users and was causing the typing test
  // to open unexpectedly. All navigation on Home is now 100% explicit —
  // it only happens when the user deliberately taps a button/tile.

  const selectLesson = useCallback((id: number) => {
    setLessonId(id);
    setMode("lessonmode");
    setScreen("game");
  }, [setMode, setScreen]);

  return (
    <div className="h-full w-full overflow-hidden bg-[#070b14]">
      <ParticleCanvas />
      <AchievementToast />

      <div className="h-full overflow-hidden">
        {screen === "home" && <HomeScreen />}
        {screen === "modeSelect" && <ModeSelectScreen />}
        {screen === "game" && <GameScreen lessonId={lessonId} />}
        {screen === "leaderboard" && <LeaderboardScreen />}
        {screen === "lessons" && <LessonBrowser onSelectLesson={selectLesson} />}
        {screen === "keyboard" && <KeyboardStudio />}
        {screen === "settings" && <SettingsScreen />}
        {screen === "stats" && <StatsScreen />}
        {screen === "achievements" && <AchievementsScreen />}
        {screen === "codeLab" && <CodeLabScreen />}
        {screen === "dojo" && <DojoScreen />}
        {screen === "certificate" && <CertificateScreen />}
      </div>
    </div>
  );
}
