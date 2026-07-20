import { useEffect, useState, useRef, useMemo } from "react";
import { useTypingEngine } from "../hooks/useTypingEngine";
import { TypingArea } from "../components/TypingArea";
import { StatsBar } from "../components/StatsBar";
import { TypingKeyboard } from "../components/TypingKeyboard";
import { Particles } from "../components/ParticleCanvas";
import { Sound } from "../lib/sound";
import { COMMON_WORDS, MEDIUM_WORDS } from "../data/wordLists";
import type { TypingResult } from "../hooks/useTypingEngine";
import { useGameStore } from "../store/gameStore";

const CHUNK = 40;

export function MarathonMode({ onComplete }: { onComplete: (r: TypingResult) => void }) {
  const settings = useGameStore((s) => s.settings);
  const duration = settings.testConfig?.duration || 60;

  const initialWords = useMemo(() => getRandomWordsWithConfig(CHUNK, settings.testConfig), [settings.testConfig]);
  const [text, setText] = useState(initialWords);
  const [lives, setLives] = useState(5);
  const errorsRef = useRef(0);

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
    timeLeft,
  } = useTypingEngine({
    text,
    timeLimit: duration,
    onComplete,
    soundEnabled: settings.soundEnabled,
    onCharTyped: (ch, correct) => {
      if (!correct) {
        errorsRef.current++;
        if (errorsRef.current % 8 === 0) {
          setLives((l) => {
            if (l <= 1) return l;
            Sound.damage();
            return l - 1;
          });
        }
        Particles.error(window.innerWidth / 2, window.innerHeight * 0.45);
      } else {
        if (ch === " ") {
          Particles.burst(window.innerWidth / 2, window.innerHeight * 0.45, 168, 10);
        }
      }
    },
  });

  // extend text as user nears end
  useEffect(() => {
    if (currentIndex > text.length - 80) {
      setText((t) => t + " " + getRandomWordsWithConfig(CHUNK, settings.testConfig));
    }
  }, [currentIndex, text.length, settings.testConfig]);

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
        <div className="font-orbitron text-lg font-bold text-purple-400">🏃 MARATHON ({duration}s)</div>
        <div className="text-xs text-white/40">{duration} seconds — type as much as possible</div>
      </div>
      <StatsBar stats={s} timeLeft={timeLeft} timeLimit={duration} lives={lives} />
      <TypingArea text={text} charStates={charStates} currentIndex={currentIndex} fontSize={settings.fontSize} />
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

function getRandomWordsWithConfig(count: number, cfg?: any): string {
  const pool = COMMON_WORDS.concat(MEDIUM_WORDS);
  const words: string[] = [];
  for (let i = 0; i < count; i++) {
    let w = pool[Math.floor(Math.random() * pool.length)];
    if (cfg?.includeNumbers && Math.random() < 0.2) {
      w = String(Math.floor(Math.random() * 900) + 10);
    }
    if (cfg?.includePunctuation && Math.random() < 0.25) {
      const p = [",", ".", "!", "?", ";"][Math.floor(Math.random() * 5)];
      w += p;
    }
    words.push(w);
  }
  return words.join(" ");
}
