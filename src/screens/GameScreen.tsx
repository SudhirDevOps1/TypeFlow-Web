import { useState, useEffect } from "react";
import { useGameStore, type GameMode } from "../store/gameStore";
import { ResultsScreen } from "../components/ResultsScreen";
import { AmbientBg } from "../components/AmbientBg";
import { Sound } from "../lib/sound";
import { SprintMode } from "../modes/SprintMode";
import { MarathonMode } from "../modes/MarathonMode";
import { CodeMode } from "../modes/CodeMode";
import { BlindfoldMode } from "../modes/BlindfoldMode";
import { WordSniperMode } from "../modes/WordSniperMode";
import { SpeedrunMode } from "../modes/SpeedrunMode";
import { ZenMode } from "../modes/ZenMode";
import { ChallengeMode } from "../modes/ChallengeMode";
import { LessonMode } from "../modes/LessonMode";
import type { TypingResult } from "../hooks/useTypingEngine";

interface Props {
  lessonId?: number;
}

export function GameScreen({ lessonId }: Props) {
  const { currentMode, setScreen, settings, updateSettings } = useGameStore();
  const [phase, setPhase] = useState<"countdown" | "playing" | "results">("countdown");
  const [countdown, setCountdown] = useState(3);
  const [result, setResult] = useState<TypingResult | null>(null);
  const [paused, setPaused] = useState(false);
  const [key, setKey] = useState(0); // remount key for restart

  const testCfg = settings.testConfig || {
    includePunctuation: false,
    includeNumbers: false,
    duration: 30,
    wordCount: 50,
    customText: "",
  };

  useEffect(() => {
    if (phase !== "countdown") return;
    Sound.countdown(countdown);
    if (countdown === 0) {
      setTimeout(() => { setPhase("playing"); Sound.gameStart(); }, 600);
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown, phase]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (phase === "playing") setPaused((p) => !p);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [phase]);

  const handleComplete = (r: TypingResult) => {
    setResult(r);
    setPhase("results");
    Sound.levelUp();
  };

  const handleRestart = () => {
    setPhase("countdown");
    setCountdown(3);
    setResult(null);
    setPaused(false);
    setKey((k) => k + 1);
  };

  const currentScale = settings.keyboardScale || 0.75;

  const renderMode = () => {
    const props = { onComplete: handleComplete, key };
    switch (currentMode as GameMode) {
      case "sprint":     return <SprintMode {...props} />;
      case "marathon":   return <MarathonMode {...props} />;
      case "code":       return <CodeMode {...props} />;
      case "blindfold":  return <BlindfoldMode {...props} />;
      case "wordsniper": return <WordSniperMode {...props} />;
      case "arcade":     return <WordSniperMode {...props} />;
      case "speedrun":   return <SpeedrunMode {...props} />;
      case "zen":        return <ZenMode {...props} />;
      case "challenge":  return <ChallengeMode {...props} />;
      case "lessonmode": return <LessonMode {...props} lessonId={lessonId} />;
      default:           return <SprintMode {...props} />;
    }
  };

  return (
    <div className="relative h-full flex flex-col overflow-hidden">
      <AmbientBg />

      {/* Top bar with quick test controls & scale selector */}
      <div className="relative z-10 flex items-center justify-between px-3 py-2.5 sm:px-6 border-b border-white/5 glass-dark flex-wrap gap-2">
        <button
          onClick={() => setScreen("modeSelect")}
          className="text-white/40 hover:text-white transition flex items-center gap-1 text-xs sm:text-sm font-bold shrink-0"
        >
          ← Back
        </button>

        {/* Quick Test Toggles (TypeFlow/MonkeyType style) */}
        {currentMode !== "lessonmode" && (
          <div className="flex items-center gap-1.5 glass rounded-xl px-2.5 py-1 text-xs shrink-0">
            <button
              onClick={() =>
                updateSettings({
                  testConfig: { ...testCfg, includePunctuation: !testCfg.includePunctuation },
                })
              }
              className={`px-2 py-0.5 rounded-lg font-bold transition-all ${
                testCfg.includePunctuation ? "bg-[#00f5c4] text-[#070b14]" : "text-white/40 hover:text-white"
              }`}
              title="Toggle punctuation"
            >
              @#
            </button>
            <button
              onClick={() =>
                updateSettings({
                  testConfig: { ...testCfg, includeNumbers: !testCfg.includeNumbers },
                })
              }
              className={`px-2 py-0.5 rounded-lg font-bold transition-all ${
                testCfg.includeNumbers ? "bg-[#00f5c4] text-[#070b14]" : "text-white/40 hover:text-white"
              }`}
              title="Toggle numbers"
            >
              123
            </button>
            <div className="w-px h-3 bg-white/10 mx-1" />
            <span className="text-[10px] text-white/30 uppercase tracking-wider hidden sm:inline">Size:</span>
            {[0.5, 0.75, 1.0, 1.2].map((s) => (
              <button
                key={s}
                onClick={() => updateSettings({ keyboardScale: s })}
                className={`px-1.5 py-0.5 rounded text-[11px] font-mono-code transition-all ${
                  Math.abs(currentScale - s) < 0.04 ? "bg-[#7c3aed] text-white font-bold" : "text-white/40 hover:text-white"
                }`}
                title={`Keyboard Scale: ${s * 100}%`}
              >
                {s * 100}%
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center gap-3 shrink-0 ml-auto">
          <button
            onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
            className="text-base text-white/40 hover:text-white transition"
            title="Toggle sound"
          >
            {settings.soundEnabled ? "🔊" : "🔇"}
          </button>
          <button
            onClick={() => updateSettings({ showKeyboard: !settings.showKeyboard })}
            className="text-sm text-white/40 hover:text-white transition"
            title="Toggle virtual keyboard"
          >
            ⌨️
          </button>
          <button
            onClick={() => setPaused((p) => !p)}
            className="text-sm text-white/40 hover:text-white transition font-bold"
            title="Pause (Esc)"
          >
            {paused ? "▶" : "⏸"}
          </button>
        </div>
      </div>

      {/* Game content */}
      <div className="relative z-10 flex-1 overflow-hidden px-4 py-3 sm:px-6">
        {phase === "results" && result ? (
          <div className="h-full overflow-y-auto">
            <ResultsScreen
              result={result}
              mode={currentMode}
              lessonId={lessonId}
              onPlayAgain={handleRestart}
              onMenu={() => setScreen("modeSelect")}
            />
          </div>
        ) : (
          <div className="h-full flex flex-col">{renderMode()}</div>
        )}
      </div>

      {/* Countdown overlay */}
      {phase === "countdown" && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm">
          <div key={countdown} style={{ animation: "countdown 0.9s ease-out forwards" }}>
            <div
              className="font-orbitron text-8xl sm:text-[10rem] font-black"
              style={{
                color: countdown === 0 ? "#00f5c4" : "white",
                textShadow: countdown === 0 ? "0 0 60px #00f5c4" : "0 0 40px rgba(255,255,255,0.5)",
              }}
            >
              {countdown === 0 ? "GO!" : countdown}
            </div>
          </div>
        </div>
      )}

      {/* Pause overlay */}
      {paused && phase === "playing" && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
          <div className="glass-dark rounded-3xl p-8 text-center max-w-sm w-full mx-4 animate-pop border border-white/10">
            <div className="font-orbitron text-3xl font-black text-white mb-2">PAUSED</div>
            <p className="text-white/40 text-sm mb-6">Take a breath. You got this.</p>
            <div className="space-y-3">
              <button
                onClick={() => setPaused(false)}
                className="btn-primary w-full rounded-2xl py-3.5 font-orbitron font-bold"
              >
                ▶ Resume (Esc)
              </button>
              <button onClick={handleRestart} className="btn-secondary w-full rounded-2xl py-3 text-sm">
                ↻ Restart
              </button>
              <button
                onClick={() => setScreen("modeSelect")}
                className="glass w-full rounded-2xl py-3 text-sm text-white/50 hover:text-white transition"
              >
                ⌂ Back to Menu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
