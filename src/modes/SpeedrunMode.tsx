import { useEffect, useState, useRef, useMemo } from "react";
import { Sound } from "../lib/sound";
import { Particles } from "../components/ParticleCanvas";
import { TypingKeyboard } from "../components/TypingKeyboard";
import { COMMON_WORDS, MEDIUM_WORDS } from "../data/wordLists";
import type { TypingResult } from "../hooks/useTypingEngine";
import { useGameStore } from "../store/gameStore";

export function SpeedrunMode({ onComplete }: { onComplete: (r: TypingResult) => void }) {
  const settings = useGameStore((s) => s.settings);
  const TIME = settings.testConfig?.duration || 30;

  const words = useMemo(() => {
    const arr: string[] = [];
    const pool = COMMON_WORDS.concat(MEDIUM_WORDS);
    for (let i = 0; i < 100; i++) {
      let w = pool[Math.floor(Math.random() * pool.length)];
      if (settings.testConfig?.includeNumbers && Math.random() < 0.2) {
        w = String(Math.floor(Math.random() * 900) + 10);
      }
      if (settings.testConfig?.includePunctuation && Math.random() < 0.25) {
        w += [",", ".", "!", "?"][Math.floor(Math.random() * 4)];
      }
      arr.push(w);
    }
    return arr;
  }, [settings.testConfig]);

  const [current, setCurrent] = useState(0);
  const [typedWord, setTypedWord] = useState("");
  const [timeLeft, setTimeLeft] = useState<number>(TIME);
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [errors, setErrors] = useState(0);
  const [keystrokes, setKeystrokes] = useState(0);
  const [lastKey, setLastKey] = useState("");
  const [errorKey, setErrorKey] = useState("");
  const startedAt = useRef<number>(0);

  useEffect(() => {
    if (!started || done) return;
    const id = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(id);
          setDone(true);
          const elapsed = (Date.now() - startedAt.current) / 1000;
          const wpm = Math.round(correct / 5 / Math.max(elapsed / 60, 0.01));
          const acc = keystrokes === 0 ? 100 : Math.round((correct / keystrokes) * 100);
          setTimeout(
            () =>
              onComplete({
                wpm,
                rawWpm: wpm,
                accuracy: acc,
                errors,
                correct,
                timeTaken: elapsed,
                score: Math.round((wpm * acc) / 10),
                combo: 0,
              }),
            100
          );
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [started, done, correct, errors, keystrokes, onComplete]);

  const handleKey = (ch: string) => {
    if (done) return;
    if (!started) {
      setStarted(true);
      startedAt.current = Date.now();
      if (settings.soundEnabled) Sound.gameStart();
    }

    if (ch === " " || ch === "Enter") {
      const target = words[current];
      if (typedWord === target) {
        setCorrect((c) => c + target.length);
        if (settings.soundEnabled) Sound.wordComplete(1);
        Particles.burst(window.innerWidth / 2, window.innerHeight * 0.3, 168, 12);
      } else {
        setErrors((e) => e + 1);
        if (settings.soundEnabled) Sound.keyError();
      }
      setTypedWord("");
      setCurrent((c) => c + 1);
      return;
    }
    if (ch === "Backspace") {
      setTypedWord((t) => t.slice(0, -1));
      return;
    }
    if (ch.length !== 1) return;

    setKeystrokes((k) => k + 1);
    setLastKey(ch);
    setTimeout(() => setLastKey(""), 120);

    const target = words[current];
    const idx = typedWord.length;
    const isCorrect = target[idx] === ch;
    if (!isCorrect) {
      setErrors((e) => e + 1);
      setErrorKey(ch);
      setTimeout(() => setErrorKey(""), 200);
      if (settings.soundEnabled) Sound.keyError();
    } else {
      setCorrect((c) => c + 1);
      if (settings.soundEnabled) Sound.keyCorrect();
    }
    setTypedWord((t) => t + ch);
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.altKey || e.metaKey) return;
      e.preventDefault();
      if (e.key === "Backspace") {
        handleKey("Backspace");
        return;
      }
      if (e.key === " " || e.key === "Enter") {
        handleKey(e.key);
        return;
      }
      if (e.key.length === 1) handleKey(e.key);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [started, done, typedWord, current, correct, errors, keystrokes]);

  const dangerTime = timeLeft < TIME * 0.25;
  const nextWords = words.slice(current, current + 5);
  const prevWords = words.slice(Math.max(0, current - 2), current);

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="text-center">
        <div className="font-orbitron text-lg font-bold text-orange-400">⏱ SPEEDRUN ({TIME}s)</div>
        <div className="text-xs text-white/40">Space to submit — {TIME} seconds, max words!</div>
      </div>

      <div className="glass rounded-2xl p-4 flex items-center justify-between">
        <div className="text-center">
          <div className="font-orbitron text-2xl font-bold text-[#00f5c4]">{current}</div>
          <div className="text-[10px] text-white/40 uppercase tracking-widest">Words</div>
        </div>
        <div className="text-center">
          <div
            className={`font-orbitron text-4xl font-black ${dangerTime ? "text-red-400 animate-pulse" : "text-white"}`}
            style={dangerTime ? { textShadow: "0 0 20px #ef4444" } : {}}
          >
            {timeLeft}
          </div>
          <div className="text-[10px] text-white/40 uppercase tracking-widest">Seconds</div>
        </div>
        <div className="text-center">
          <div className="font-orbitron text-2xl font-bold text-yellow-400">
            {keystrokes === 0 ? "–" : Math.round((correct / keystrokes) * 100)}%
          </div>
          <div className="text-[10px] text-white/40 uppercase tracking-widest">Accuracy</div>
        </div>
      </div>

      {/* Word display */}
      <div
        className="relative rounded-2xl p-6 sm:p-8 text-center overflow-hidden"
        style={{
          background: "rgba(0,0,0,0.5)",
          border: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        {!started && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/60 rounded-2xl">
            <div className="text-center">
              <div className="text-4xl mb-2">⌨️</div>
              <div className="text-white/60">Start typing to begin!</div>
            </div>
          </div>
        )}
        <div className="flex items-center justify-center gap-3 flex-wrap">
          {prevWords.map((w, i) => (
            <span key={`p${i}`} className="text-white/20 text-lg font-mono-code line-through">
              {w}
            </span>
          ))}
          <div className="flex flex-col items-center">
            <span className="text-2xl sm:text-3xl font-bold font-mono-code text-white mb-1">
              {words[current]}
            </span>
            <div className="h-1 w-full rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-[#00f5c4]"
                style={{
                  width: `${Math.min((typedWord.length / (words[current]?.length || 1)) * 100, 100)}%`,
                }}
              />
            </div>
          </div>
          {nextWords.slice(1).map((w, i) => (
            <span key={`n${i}`} className="text-white/30 text-lg font-mono-code" style={{ opacity: 0.6 - i * 0.15 }}>
              {w}
            </span>
          ))}
        </div>

        {/* typed display */}
        <div className="mt-4 h-10 flex items-center justify-center">
          <span
            className="font-mono-code text-xl font-bold"
            style={{
              color: typedWord === words[current]?.slice(0, typedWord.length) ? "#00f5c4" : "#ef4444",
            }}
          >
            {typedWord || <span className="text-white/20">type here...</span>}
          </span>
          <span className="cursor-blink inline-block w-0.5 h-6 bg-white ml-0.5 rounded-full align-middle" />
        </div>
      </div>

      {settings.showKeyboard && (
        <div className="mt-auto">
          <TypingKeyboard
            pressedKey={lastKey}
            errorKey={errorKey}
            hintKey={settings.keyboardHints && words[current] ? words[current][typedWord.length] : undefined}
            compact
          />
        </div>
      )}
    </div>
  );
}
