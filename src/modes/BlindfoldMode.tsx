import { useEffect, useState } from "react";
import { useTypingEngine } from "../hooks/useTypingEngine";
import { StatsBar } from "../components/StatsBar";
import { TypingKeyboard } from "../components/TypingKeyboard";
import { Particles } from "../components/ParticleCanvas";
import { getRandomWords } from "../data/wordLists";
import type { TypingResult } from "../hooks/useTypingEngine";
import { useGameStore } from "../store/gameStore";

export function BlindfoldMode({ onComplete }: { onComplete: (r: TypingResult) => void }) {
  const settings = useGameStore(s => s.settings);
  const [text] = useState(() => getRandomWords(30, "easy"));
  const [reveal, setReveal] = useState(false);

  const { charStates, stats, typeChar, backspace, lastKey, lastErrorKey, currentIndex, isFinished } = useTypingEngine({
    text,
    onComplete,
    soundEnabled: settings.soundEnabled,
    onCharTyped: (_, correct) => {
      if (!correct) Particles.error(window.innerWidth / 2, window.innerHeight * 0.4);
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

  // Split text into typed and remaining
  const words = text.split(" ");
  let charCount = 0;
  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="text-center">
        <div className="font-orbitron text-lg font-bold text-pink-400">🙈 BLINDFOLD</div>
        <div className="text-xs text-white/40">Type without seeing — trust your fingers!</div>
      </div>

      <StatsBar stats={s} />

      <div className="relative rounded-2xl p-6 sm:p-8" style={{
        background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.07)"
      }}>
        {!reveal ? (
          <div className="text-center space-y-4">
            <div className="text-5xl">🙈</div>
            <div className="text-white/50 text-sm">Your typing is hidden — feel the keys!</div>
            <div className="flex justify-center gap-1 flex-wrap">
              {words.map((w, wi) => {
                const start = charCount;
                charCount += w.length + 1;
                const typed = currentIndex >= start + w.length;
                const current = currentIndex >= start && currentIndex < start + w.length;
                return (
                  <span key={wi} className={`px-2 py-1 rounded-lg text-sm font-mono-code ${
                    typed ? "bg-[#00f5c4]/20 text-[#00f5c4]" :
                    current ? "bg-white/10 text-white border border-white/30" :
                    "bg-white/5 text-white/10"
                  }`}>
                    {typed ? "✓" : current ? "..." : "?"}
                  </span>
                );
              })}
            </div>
            <button
              className="text-xs text-white/30 hover:text-white/60 transition"
              onClick={() => setReveal(true)}
            >
              👁 Peek (cheating!)
            </button>
          </div>
        ) : (
          <p className="font-mono-code text-lg leading-loose">
            {text.split("").map((ch, i) => {
              const state = charStates()[i];
              const color = state === "correct" ? "#00f5c4" : state === "error" ? "#ef4444" : "rgba(255,255,255,0.3)";
              return <span key={i} style={{ color }}>{ch}</span>;
            })}
          </p>
        )}
      </div>

      <div className="glass rounded-xl p-3 text-center text-sm font-mono-code text-white/60">
        {currentIndex > 0 && (
          <>Last typed: <span className="text-[#00f5c4] font-bold">{text.slice(Math.max(0, currentIndex - 10), currentIndex)}</span><span className="animate-pulse text-white">|</span></>
        )}
        {currentIndex === 0 && "Start typing..."}
      </div>

      {settings.showKeyboard && (
        <div className="mt-auto">
          <TypingKeyboard pressedKey={lastKey} errorKey={lastErrorKey} compact />
        </div>
      )}
    </div>
  );
}
