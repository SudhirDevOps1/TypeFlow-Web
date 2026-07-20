import { useEffect, useState, useMemo } from "react";
import { useTypingEngine } from "../hooks/useTypingEngine";
import { TypingArea } from "../components/TypingArea";
import { StatsBar } from "../components/StatsBar";
import { TypingKeyboard } from "../components/TypingKeyboard";
import { Particles } from "../components/ParticleCanvas";
import { Sound } from "../lib/sound";
import { COMMON_WORDS, MEDIUM_WORDS } from "../data/wordLists";
import type { TypingResult } from "../hooks/useTypingEngine";
import { useGameStore } from "../store/gameStore";

export function SprintMode({ onComplete }: { onComplete: (r: TypingResult) => void }) {
  const settings = useGameStore((s) => s.settings);
  const testCfg = settings.testConfig || {
    includePunctuation: false,
    includeNumbers: false,
    wordCount: 50,
  };

  const wordGoal = testCfg.wordCount || 50;

  const text = useMemo(() => {
    let pool = COMMON_WORDS.concat(MEDIUM_WORDS);
    const words: string[] = [];
    for (let i = 0; i < wordGoal; i++) {
      let w = pool[Math.floor(Math.random() * pool.length)];
      if (testCfg.includeNumbers && Math.random() < 0.2) {
        w = String(Math.floor(Math.random() * 900) + 10);
      }
      if (testCfg.includePunctuation && Math.random() < 0.25) {
        const p = [",", ".", "!", "?", ";"][Math.floor(Math.random() * 5)];
        w += p;
      }
      words.push(w);
    }
    return words.join(" ");
  }, [wordGoal, testCfg.includeNumbers, testCfg.includePunctuation]);

  const [shake, setShake] = useState(false);

  const {
    charStates,
    stats,
    typeChar,
    backspace,
    lastKey,
    lastErrorKey,
    currentExpected,
    currentIndex,
    isFinished,
  } = useTypingEngine({
    text,
    onComplete,
    soundEnabled: settings.soundEnabled,
    onCharTyped: (ch, correct) => {
      if (!correct) {
        setShake(true);
        setTimeout(() => setShake(false), 350);
        Particles.error(window.innerWidth / 2, window.innerHeight / 2);
      } else {
        const wordsTyped = text.slice(0, currentIndex + 1).trim().split(/\s+/).length;
        if (ch === " " && wordsTyped > 0) {
          Particles.wordComplete(window.innerWidth / 2, window.innerHeight * 0.45, `+${wordsTyped * 10}`);
          if (settings.soundEnabled) Sound.wordComplete(stats().combo);
        }
      }
    },
  });

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (isFinished) return;
      if (e.ctrlKey || e.altKey || e.metaKey) return;
      e.preventDefault();
      if (e.key === "Backspace") {
        backspace();
        return;
      }
      if (e.key.length === 1) typeChar(e.key);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [typeChar, backspace, isFinished]);

  const s = stats();

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="text-center">
        <div className="font-orbitron text-lg font-bold text-[#00f5c4]">⚡ SPRINT ({wordGoal} WORDS)</div>
        <div className="text-xs text-white/40">Type {wordGoal} words as fast as possible</div>
      </div>
      <StatsBar stats={s} />
      <TypingArea text={text} charStates={charStates} currentIndex={currentIndex} shake={shake} fontSize={settings.fontSize} />
      {settings.showKeyboard && (
        <div className="mt-auto">
          <TypingKeyboard
            pressedKey={lastKey}
            errorKey={lastErrorKey}
            hintKey={settings.keyboardHints ? currentExpected : undefined}
            compact
          />
        </div>
      )}
    </div>
  );
}
