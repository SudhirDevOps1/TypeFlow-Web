import { useEffect, useState, useRef, useCallback } from "react";
import { Sound } from "../lib/sound";
import { Particles } from "../components/ParticleCanvas";
import { TypingKeyboard } from "../components/TypingKeyboard";
import { COMMON_WORDS, MEDIUM_WORDS } from "../data/wordLists";
import type { TypingResult } from "../hooks/useTypingEngine";
import { useGameStore } from "../store/gameStore";

type MatrixWord = {
  id: number;
  word: string;
  typed: number;
  x: number;
  y: number;
  speed: number;
  hue: number;
  isBonus?: boolean;
};

let idAcc = 1000;

export function ArcadeMode({ onComplete }: { onComplete: (r: TypingResult) => void }) {
  const settings = useGameStore((s) => s.settings);
  const [words, setWords] = useState<MatrixWord[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(5);
  const [combo, setCombo] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [destroyed, setDestroyed] = useState(0);
  const [keystrokes, setKeystrokes] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [pressedKey, setPressedKey] = useState("");
  const [errorKey, setErrorKey] = useState("");
  const [startedAt] = useState(Date.now());
  const [shake, setShake] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const lastRef = useRef(0);
  const spawnTimer = useRef(0);
  const stateRef = useRef({ words, activeId, score, lives, combo, multiplier, destroyed, keystrokes, correct });

  useEffect(() => {
    stateRef.current = { words, activeId, score, lives, combo, multiplier, destroyed, keystrokes, correct };
  });

  const finishGame = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const elapsed = (Date.now() - startedAt) / 1000;
    const mins = Math.max(elapsed / 60, 1 / 60);
    const acc = keystrokes === 0 ? 100 : Math.round((correct / keystrokes) * 100);
    const wpm = Math.round(correct / 5 / mins);
    onComplete({
      wpm,
      rawWpm: wpm,
      accuracy: acc,
      errors: keystrokes - correct,
      correct,
      timeTaken: elapsed,
      score: score + combo * 50,
      combo,
    });
  }, [score, combo, correct, keystrokes, startedAt, onComplete]);

  const tick = useCallback(
    (now: number) => {
      if (!lastRef.current) lastRef.current = now;
      const dt = Math.min((now - lastRef.current) / 1000, 0.05);
      lastRef.current = now;

      spawnTimer.current -= dt;

      setWords((prev) => {
        const updated = prev.map((w) => ({ ...w, y: w.y + w.speed * dt }));

        // spawn logic
        if (spawnTimer.current <= 0 && updated.length < 7) {
          const pool = Math.random() > 0.4 ? COMMON_WORDS : MEDIUM_WORDS;
          const word = pool[Math.floor(Math.random() * pool.length)];
          const isBonus = Math.random() < 0.15;
          updated.push({
            id: idAcc++,
            word,
            typed: 0,
            x: 8 + Math.random() * 84,
            y: 0,
            speed: isBonus ? 14 : 7 + Math.random() * 6,
            hue: isBonus ? 45 : Math.random() < 0.5 ? 168 : 320,
            isBonus,
          });
          spawnTimer.current = 1.1 + Math.random() * 0.8;
        }

        // check shield impact at y > 90
        const survivors: MatrixWord[] = [];
        for (const w of updated) {
          if (w.y > 90) {
            setLives((l) => {
              const nl = l - 1;
              if (nl <= 0) setTimeout(finishGame, 80);
              return nl;
            });
            setCombo(0);
            setMultiplier(1);
            setActiveId(null);
            setShake(true);
            setTimeout(() => setShake(false), 300);
            if (settings.soundEnabled) Sound.damage();
            const rect = containerRef.current?.getBoundingClientRect();
            if (rect) Particles.burst(rect.left + (w.x / 100) * rect.width, rect.top + 0.9 * rect.height, 0, 24);
          } else {
            survivors.push(w);
          }
        }
        return survivors;
      });

      rafRef.current = requestAnimationFrame(tick);
    },
    [finishGame, settings.soundEnabled]
  );

  useEffect(() => {
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [tick]);

  const typeChar = useCallback(
    (ch: string) => {
      const c = ch.toLowerCase();
      if (!/^[a-z]$/.test(c)) return;
      setKeystrokes((k) => k + 1);
      setPressedKey(c);
      setTimeout(() => setPressedKey(""), 120);

      setWords((prev) => {
        let target = prev.find((w) => w.id === stateRef.current.activeId);
        if (!target) {
          target = [...prev].filter((w) => w.typed === 0 && w.word[0] === c).sort((a, b) => b.y - a.y)[0];
          if (target) setActiveId(target.id);
        }

        if (target && target.word[target.typed] === c) {
          setCorrect((x) => x + 1);
          if (settings.soundEnabled) Sound.keyCorrect();

          const next = prev.map((w) => (w.id === target!.id ? { ...w, typed: w.typed + 1 } : w));
          const done = next.find((w) => w.id === target!.id);

          if (done && done.typed >= done.word.length) {
            const newCombo = stateRef.current.combo + 1;
            const newMult = Math.min(5, 1 + Math.floor(newCombo / 4));
            setCombo(newCombo);
            setMultiplier(newMult);
            setDestroyed((d) => d + 1);

            const baseGain = (15 + done.word.length * 6) * (done.isBonus ? 3 : 1);
            const gained = Math.round(baseGain * newMult);
            setScore((s) => s + gained);
            setActiveId(null);

            if (settings.soundEnabled) Sound.wordComplete(newCombo);

            const rect = containerRef.current?.getBoundingClientRect();
            if (rect) {
              const px = rect.left + (done.x / 100) * rect.width;
              const py = rect.top + (done.y / 100) * rect.height;
              if (done.isBonus) Particles.combo(px, py, 10);
              else Particles.wordComplete(px, py, `+${gained}`);
            }

            return next.filter((w) => w.id !== target!.id);
          }
          return next;
        } else {
          setCombo(0);
          setMultiplier(1);
          setActiveId(null);
          setErrorKey(c);
          setTimeout(() => setErrorKey(""), 220);
          if (settings.soundEnabled) Sound.keyError();
          return prev;
        }
      });
    },
    [settings.soundEnabled]
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.altKey || e.metaKey) return;
      e.preventDefault();
      if (e.key.length === 1) typeChar(e.key);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [typeChar]);

  return (
    <div className="flex flex-col gap-3 h-full">
      {/* Top HUD */}
      <div className="flex items-center justify-between">
        <div>
          <div className="font-orbitron text-base font-bold text-purple-400">🎮 ARCADE MATRIX</div>
          <div className="text-xs text-white/40">Bonus yellow words yield 3x score multipliers!</div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="font-orbitron text-xl font-bold text-[#00f5c4]">{score.toLocaleString()}</div>
            <div className="text-[10px] text-white/40 uppercase tracking-widest">Score</div>
          </div>
          {multiplier > 1 && (
            <div className="animate-pop glass px-2.5 py-1 rounded-xl">
              <div className="font-orbitron text-sm font-black text-yellow-400">×{multiplier} MULT</div>
            </div>
          )}
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} style={{ opacity: i < lives ? 1 : 0.2, fontSize: "0.9rem" }}>
                ❤️
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Arcade playfield */}
      <div
        ref={containerRef}
        className={`relative flex-1 rounded-2xl overflow-hidden ${shake ? "animate-shake" : ""}`}
        style={{
          background: "rgba(7,11,20,0.75)",
          border: "1px solid rgba(255,255,255,0.08)",
          minHeight: 240,
        }}
      >
        {/* Shield danger line */}
        <div
          className="absolute inset-x-0 h-1"
          style={{
            bottom: "10%",
            background: "linear-gradient(90deg, #ef4444, #f59e0b, #ef4444)",
            boxShadow: "0 0 16px rgba(239,68,68,0.9)",
          }}
        />

        {/* Falling words */}
        {words.map((w) => {
          const active = w.id === activeId;
          return (
            <div
              key={w.id}
              className="absolute"
              style={{ left: `${w.x}%`, top: `${w.y}%`, transform: "translateX(-50%)" }}
            >
              <div
                className="rounded-xl px-3 py-1 font-mono-code text-base font-bold whitespace-nowrap shadow-xl"
                style={{
                  background: active
                    ? `hsla(${w.hue},90%,32%,0.95)`
                    : w.isBonus
                      ? "rgba(245,158,11,0.25)"
                      : "rgba(15,23,42,0.9)",
                  border: `1.5px solid ${
                    active
                      ? "#00f5c4"
                      : w.isBonus
                        ? "#f59e0b"
                        : `hsla(${w.hue},80%,55%,0.6)`
                  }`,
                  boxShadow: active
                    ? "0 0 24px rgba(0,245,196,0.8)"
                    : w.isBonus
                      ? "0 0 20px rgba(245,158,11,0.6)"
                      : "0 4px 12px rgba(0,0,0,0.5)",
                }}
              >
                <span style={{ color: "#00f5c4" }}>{w.word.slice(0, w.typed)}</span>
                <span style={{ color: w.y > 72 ? "#ef4444" : "rgba(255,255,255,0.85)" }}>
                  {w.word.slice(w.typed)}
                </span>
              </div>
            </div>
          );
        })}

        <div className="absolute bottom-2 right-3 text-[10px] text-white/30 font-mono-code">
          {destroyed} words eliminated · {combo} combo
        </div>
      </div>

      {settings.showKeyboard && (
        <TypingKeyboard pressedKey={pressedKey} errorKey={errorKey} compact />
      )}
    </div>
  );
}
