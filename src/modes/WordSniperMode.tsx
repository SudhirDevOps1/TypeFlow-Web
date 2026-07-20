import { useEffect, useState, useRef, useCallback } from "react";
import { Sound } from "../lib/sound";
import { Particles } from "../components/ParticleCanvas";
import { COMMON_WORDS, MEDIUM_WORDS } from "../data/wordLists";
import type { TypingResult } from "../hooks/useTypingEngine";
import { useGameStore } from "../store/gameStore";
import { TypingKeyboard } from "../components/TypingKeyboard";

type FallingWord = {
  id: number;
  word: string;
  typed: number;
  x: number;
  y: number;
  speed: number;
  hue: number;
};

let idCounter = 1;
const LIVES = 5;

export function WordSniperMode({ onComplete }: { onComplete: (r: TypingResult) => void }) {
  const settings = useGameStore(s => s.settings);
  const [words, setWords] = useState<FallingWord[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(LIVES);
  const [combo, setCombo] = useState(0);
  const [level, setLevel] = useState(1);
  const [destroyed, setDestroyed] = useState(0);
  const [keystrokes, setKeystrokes] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [startedAt] = useState(Date.now());
  const [shake, setShake] = useState(false);
  const [pressedKey, setPressedKey] = useState("");
  const [errorKey, setErrorKey] = useState("");
  const rafRef = useRef<number | null>(null);
  const lastRef = useRef(0);
  const spawnTimer = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({ words, activeId, score, lives, combo, level, destroyed, keystrokes, correct });

  useEffect(() => {
    stateRef.current = { words, activeId, score, lives, combo, level, destroyed, keystrokes, correct };
  });

  const endGame = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const elapsed = (Date.now() - startedAt) / 1000;
    const mins = Math.max(elapsed / 60, 1/60);
    const acc = keystrokes === 0 ? 100 : Math.round((correct / keystrokes) * 100);
    const wpm = Math.round((correct / 5) / mins);
    onComplete({ wpm, rawWpm: wpm, accuracy: acc, errors: keystrokes - correct, correct, timeTaken: elapsed, score, combo });
  }, [score, combo, correct, keystrokes, startedAt, onComplete]);

  const tick = useCallback((now: number) => {
    if (!lastRef.current) lastRef.current = now;
    const dt = Math.min((now - lastRef.current) / 1000, 0.05);
    lastRef.current = now;

    const { level } = stateRef.current;
    spawnTimer.current -= dt;
    const spawnInterval = Math.max(0.6, 1.8 - level * 0.1);
    const maxWords = Math.min(3 + level, 8);

    setWords(prev => {
      let updated = prev.map(w => ({ ...w, y: w.y + w.speed * dt }));

      // spawn
      if (spawnTimer.current <= 0 && updated.length < maxWords) {
        const pool = level < 4 ? COMMON_WORDS : MEDIUM_WORDS;
        const word = pool[Math.floor(Math.random() * pool.length)];
        const existing = new Set(updated.map(w => w.word[0]));
        let attempts = 0, w2 = word;
        while (attempts < 10 && existing.has(w2[0])) {
          w2 = pool[Math.floor(Math.random() * pool.length)];
          attempts++;
        }
        updated.push({
          id: idCounter++, word: w2, typed: 0,
          x: 5 + Math.random() * 88,
          y: 0,
          speed: 6 + level * 1.5 + Math.random() * 3,
          hue: [168,265,45,320,200][Math.floor(Math.random()*5)],
        });
        spawnTimer.current = spawnInterval * (0.7 + Math.random() * 0.6);
      }

      // check hits
      const surviving: FallingWord[] = [];
      for (const w of updated) {
        if (w.y > 92) {
          setLives(prev => {
            const nl = prev - 1;
            if (nl <= 0) setTimeout(endGame, 100);
            return nl;
          });
          setCombo(0);
          setActiveId(null);
          if (settings.soundEnabled) Sound.damage();
          setShake(true);
          setTimeout(() => setShake(false), 350);
          const rect = containerRef.current?.getBoundingClientRect();
          if (rect) Particles.burst(rect.left + w.x / 100 * rect.width, rect.top + 0.9 * rect.height, 0, 20);
        } else {
          surviving.push(w);
        }
      }
      return surviving;
    });

    rafRef.current = requestAnimationFrame(tick);
  }, [endGame, settings.soundEnabled]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [tick]);

  const typeChar = useCallback((ch: string) => {
    const c = ch.toLowerCase();
    if (!/^[a-z]$/.test(c)) return;
    setKeystrokes(k => k + 1);
    setPressedKey(c);
    setTimeout(() => setPressedKey(""), 120);

    setWords(prev => {
      let target = prev.find(w => w.id === stateRef.current.activeId);
      if (!target) {
        target = [...prev].filter(w => w.typed === 0 && w.word[0] === c).sort((a,b) => b.y - a.y)[0];
        if (target) setActiveId(target.id);
      }

      if (target && target.word[target.typed] === c) {
        setCorrect(x => x + 1);
        if (settings.soundEnabled) Sound.keyCorrect();
        const next = prev.map(w => w.id === target!.id ? { ...w, typed: w.typed + 1 } : w);
        const done = next.find(w => w.id === target!.id);
        if (done && done.typed >= done.word.length) {
          const newCombo = stateRef.current.combo + 1;
          setCombo(newCombo);
          setDestroyed(d => d + 1);
          const gained = Math.round((10 + done.word.length * 5) * (1 + Math.floor(newCombo / 5) * 0.5));
          setScore(s => s + gained);
          setActiveId(null);
          if (settings.soundEnabled) Sound.wordComplete(newCombo);
          const rect = containerRef.current?.getBoundingClientRect();
          if (rect) {
            const px = rect.left + done.x / 100 * rect.width;
            const py = rect.top + done.y / 100 * rect.height;
            if (newCombo >= 5) Particles.combo(px, py, newCombo);
            else Particles.wordComplete(px, py, `+${gained}`);
          }
          setLevel(() => Math.min(1 + Math.floor(stateRef.current.score / 500), 12));
          return next.filter(w => w.id !== target!.id);
        }
        return next;
      } else {
        setCombo(0);
        setActiveId(null);
        setErrorKey(c);
        setTimeout(() => setErrorKey(""), 250);
        if (settings.soundEnabled) Sound.keyError();
        return prev;
      }
    });
  }, [settings.soundEnabled]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.altKey || e.metaKey) return;
      e.preventDefault();
      if (e.key.length === 1) typeChar(e.key);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [typeChar]);

  const elapsed = (Date.now() - startedAt) / 1000;

  return (
    <div className="flex flex-col gap-3 h-full">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-orbitron text-base font-bold text-red-400">🎯 WORD SNIPER</div>
          <div className="text-xs text-white/40">Destroy words before they escape!</div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="font-orbitron text-xl font-bold text-[#00f5c4]">{score.toLocaleString()}</div>
            <div className="text-[10px] text-white/40">SCORE</div>
          </div>
          {combo >= 3 && (
            <div className="animate-pop">
              <div className="font-orbitron text-lg font-black text-yellow-400" style={{textShadow:"0 0 12px #f59e0b"}}>×{combo}</div>
            </div>
          )}
          <div className="flex gap-0.5">
            {Array.from({length: LIVES}).map((_,i) => (
              <span key={i} style={{opacity: i < lives ? 1 : 0.2, fontSize:"0.9rem"}}>❤️</span>
            ))}
          </div>
        </div>
      </div>

      {/* playfield */}
      <div
        ref={containerRef}
        className={`relative flex-1 rounded-2xl overflow-hidden ${shake ? "animate-shake" : ""}`}
        style={{ background: "rgba(0,0,0,0.45)", border: "1px solid rgba(255,255,255,0.07)", minHeight: 240 }}
      >
        {/* danger line */}
        <div className="absolute inset-x-0 h-0.5" style={{ bottom: "8%", background: "rgba(239,68,68,0.6)", boxShadow: "0 0 12px rgba(239,68,68,0.8)" }} />

        {/* falling words */}
        {words.map(w => {
          const active = w.id === activeId;
          return (
            <div key={w.id} className="absolute" style={{ left: `${w.x}%`, top: `${w.y}%`, transform: "translateX(-50%)" }}>
              <div className="rounded-xl px-3 py-1.5 font-mono-code text-base font-bold whitespace-nowrap" style={{
                background: active ? `hsla(${w.hue},80%,30%,0.9)` : "rgba(10,20,30,0.85)",
                border: `1.5px solid hsla(${w.hue},90%,${active?70:45}%,${active?0.9:0.5})`,
                boxShadow: active ? `0 0 20px hsla(${w.hue},90%,60%,0.8)` : undefined,
              }}>
                <span style={{ color: `hsl(${w.hue},95%,72%)` }}>{w.word.slice(0, w.typed)}</span>
                <span style={{ color: w.y > 75 ? "#ef4444" : "rgba(255,255,255,0.75)" }}>{w.word.slice(w.typed)}</span>
              </div>
              {/* tail */}
              <div className="absolute left-1/2 -translate-x-1/2 -z-10" style={{
                bottom: "100%", width: 4, height: 28,
                background: `linear-gradient(to top, hsla(${w.hue},90%,60%,0.5), transparent)`,
                filter: "blur(2px)"
              }} />
            </div>
          );
        })}

        <div className="absolute bottom-1 right-2 text-[10px] text-white/20 font-mono-code">
          Lv {level} • {destroyed} destroyed
        </div>
      </div>

      <div className="glass rounded-xl px-4 py-2 flex justify-between text-xs text-white/40 font-mono-code">
        <span>Just type — first letter locks target</span>
        <span>{Math.round(elapsed)}s</span>
      </div>

      {settings.showKeyboard && (
        <TypingKeyboard pressedKey={pressedKey} errorKey={errorKey} compact />
      )}
    </div>
  );
}
