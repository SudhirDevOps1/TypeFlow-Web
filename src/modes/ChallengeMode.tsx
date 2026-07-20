import { useEffect, useState } from "react";
import { useTypingEngine } from "../hooks/useTypingEngine";
import { TypingArea } from "../components/TypingArea";
import { StatsBar } from "../components/StatsBar";
import { TypingKeyboard } from "../components/TypingKeyboard";
import { Particles } from "../components/ParticleCanvas";
import { getDailyChallenge } from "../data/wordLists";
import type { TypingResult } from "../hooks/useTypingEngine";
import { useGameStore } from "../store/gameStore";

export function ChallengeMode({ onComplete }: { onComplete: (r: TypingResult) => void }) {
  const settings = useGameStore(s => s.settings);
  const [text] = useState(() => getDailyChallenge());
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  const { charStates, stats, typeChar, backspace, lastKey, lastErrorKey, currentExpected, currentIndex, isFinished } = useTypingEngine({
    text,
    onComplete,
    soundEnabled: settings.soundEnabled,
    onCharTyped: (_, correct) => {
      if (!correct) Particles.error(window.innerWidth / 2, window.innerHeight * 0.45);
    },
  });

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (isFinished) return;
      if (e.ctrlKey || e.altKey || e.metaKey) return;
      e.preventDefault();
      if (e.key === "Backspace") { backspace(); return; }
      if (e.key.length === 1) typeChar(e.key);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [typeChar, backspace, isFinished]);

  const s = stats();

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="text-center">
        <div className="font-orbitron text-lg font-bold text-amber-400">📅 DAILY CHALLENGE</div>
        <div className="text-xs text-white/40">{today}</div>
      </div>

      <StatsBar stats={s} />

      <div className="glass rounded-xl p-3 text-center text-xs text-white/40">
        💬 Today's quote — same for everyone, everywhere
      </div>

      <TypingArea text={text} charStates={charStates} currentIndex={currentIndex} fontSize={settings.fontSize} />

      {settings.showKeyboard && (
        <div className="mt-auto">
          <TypingKeyboard pressedKey={lastKey} errorKey={lastErrorKey}
            hintKey={settings.keyboardHints ? currentExpected : undefined} compact />
        </div>
      )}
    </div>
  );
}
