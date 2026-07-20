import { useEffect, useState } from "react";
import { useTypingEngine } from "../hooks/useTypingEngine";
import { TypingArea } from "../components/TypingArea";
import { TypingKeyboard } from "../components/TypingKeyboard";
import { Particles } from "../components/ParticleCanvas";
import { Sound } from "../lib/sound";
import { QUOTES } from "../data/wordLists";
import type { TypingResult } from "../hooks/useTypingEngine";
import { useGameStore } from "../store/gameStore";

export function ZenMode({ onComplete }: { onComplete: (r: TypingResult) => void }) {
  const settings = useGameStore(s => s.settings);

  const [text] = useState(() => QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  const [streak, setStreak] = useState(0);

  const { charStates, stats, typeChar, backspace, lastKey, lastErrorKey, currentExpected, currentIndex, isFinished } = useTypingEngine({
    text,
    onComplete,
    soundEnabled: settings.soundEnabled,
    onCharTyped: (_ch, correct) => {
      if (correct) {
        setStreak(s => s + 1);
        if ((streak + 1) % 15 === 0) {
          Particles.burst(window.innerWidth * 0.5, window.innerHeight * 0.4, 168, 18);
          if (settings.soundEnabled) Sound.wordComplete(Math.floor(streak / 15));
        }
      } else {
        setStreak(0);
        Particles.error(window.innerWidth * 0.5, window.innerHeight * 0.45);
      }
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
        <div className="font-orbitron text-lg font-bold text-emerald-400">🌿 ZEN MODE</div>
        <div className="text-xs text-white/40">No pressure. Just flow. Type the quote below.</div>
      </div>

      {/* Ambient stats */}
      <div className="flex justify-center gap-6">
        <div className="text-center">
          <div className="font-orbitron text-2xl text-[#00f5c4]">{s.wpm}</div>
          <div className="text-[10px] text-white/40">WPM</div>
        </div>
        <div className="text-center">
          <div className="font-orbitron text-2xl text-purple-400">{s.accuracy}%</div>
          <div className="text-[10px] text-white/40">ACCURACY</div>
        </div>
        <div className="text-center">
          <div className="font-orbitron text-2xl text-yellow-400">{streak}</div>
          <div className="text-[10px] text-white/40">STREAK</div>
        </div>
        <div className="text-center">
          <div className="font-orbitron text-2xl text-white/70">{Math.round(s.progress * 100)}%</div>
          <div className="text-[10px] text-white/40">DONE</div>
        </div>
      </div>

      {/* Progress */}
      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
        <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-[#00f5c4] transition-all duration-300" style={{width:`${s.progress*100}%`}} />
      </div>

      <TypingArea text={text} charStates={charStates} currentIndex={currentIndex} fontSize="lg" />

      <div className="glass rounded-xl p-3 text-center text-sm text-white/40 italic">
        {streak >= 10 ? `🔥 ${streak} char streak — you're on fire!` : "Take your time. Accuracy over speed."}
      </div>

      {settings.showKeyboard && (
        <div className="mt-auto">
          <TypingKeyboard pressedKey={lastKey} errorKey={lastErrorKey}
            hintKey={settings.keyboardHints ? currentExpected : undefined} compact />
        </div>
      )}
    </div>
  );
}
