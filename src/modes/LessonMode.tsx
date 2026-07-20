import { useEffect, useState } from "react";
import { useTypingEngine } from "../hooks/useTypingEngine";
import { TypingArea } from "../components/TypingArea";
import { TypingKeyboard } from "../components/TypingKeyboard";
import { Particles } from "../components/ParticleCanvas";
import { Sound } from "../lib/sound";
import { ALL_LEVELS, type LevelDef } from "../data/levels";
import type { TypingResult } from "../hooks/useTypingEngine";
import { useGameStore } from "../store/gameStore";

interface Props {
  lessonId?: number;
  onComplete: (r: TypingResult) => void;
  onBack?: () => void;
}

export function LessonMode({ lessonId = 1, onComplete, onBack }: Props) {
  const settings = useGameStore((s) => s.settings);
  const lesson: LevelDef = ALL_LEVELS.find((l) => l.id === lessonId) || ALL_LEVELS[0];
  const [lineIdx, setLineIdx] = useState(0);
  const [allDone, setAllDone] = useState(false);
  const [results, setResults] = useState<TypingResult[]>([]);
  const text = lesson.text[lineIdx] || lesson.text[0];

  const { charStates, stats, typeChar, backspace, reset, lastKey, lastErrorKey, currentExpected, currentIndex } = useTypingEngine({
    text,
    soundEnabled: settings.soundEnabled,
    onComplete: (r) => {
      const newResults = [...results, r];
      setResults(newResults);
      Particles.wordComplete(window.innerWidth / 2, window.innerHeight * 0.4, "✓ Line done!");
      if (settings.soundEnabled) Sound.wordComplete(1);

      if (lineIdx + 1 >= lesson.text.length) {
        setAllDone(true);
        if (settings.soundEnabled) Sound.lessonComplete();
        const avgWpm = Math.round(newResults.reduce((a, res) => a + res.wpm, 0) / newResults.length);
        const avgAcc = Math.round(newResults.reduce((a, res) => a + res.accuracy, 0) / newResults.length);
        setTimeout(() => onComplete({ ...r, wpm: avgWpm, accuracy: avgAcc, score: Math.round(avgWpm * avgAcc / 5 + lesson.id * 10) }), 800);
      } else {
        setTimeout(() => {
          setLineIdx((i) => i + 1);
          reset();
        }, 500);
      }
    },
    onCharTyped: (_, correct) => {
      if (!correct) Particles.error(window.innerWidth / 2, window.innerHeight * 0.45);
    },
  });

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (allDone) return;
      if (e.ctrlKey || e.altKey || e.metaKey) return;
      e.preventDefault();
      if (e.key === "Backspace") { backspace(); return; }
      if (e.key.length === 1) typeChar(e.key);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [typeChar, backspace, allDone]);

  const s = stats();

  return (
    <div className="flex flex-col gap-3 h-full">
      <div className="flex items-center gap-3">
        {onBack && (
          <button onClick={onBack} className="text-white/40 hover:text-white transition text-lg">←</button>
        )}
        <div className="flex-1 text-center min-w-0">
          <div className="font-orbitron text-base font-bold truncate" style={{ color: lesson.color }}>
            {lesson.icon} {lesson.title}
          </div>
          <div className="text-xs text-white/40 truncate">{lesson.subtitle}</div>
        </div>
      </div>

      {/* Line progress */}
      <div className="flex gap-1.5">
        {lesson.text.map((_, i) => (
          <div
            key={i}
            className="flex-1 h-1.5 rounded-full transition-all"
            style={{
              background: i < lineIdx ? lesson.color : i === lineIdx ? `${lesson.color}88` : "rgba(255,255,255,0.08)",
            }}
          />
        ))}
      </div>

      {/* Keys to practice */}
      <div className="glass rounded-xl px-4 py-2 text-center">
        <div className="text-[10px] text-white/40 mb-1 uppercase tracking-widest">Focus Keys</div>
        <div className="flex justify-center gap-1.5 flex-wrap">
          {lesson.keys.split("").slice(0, 16).map((k, ki) => (
            <span
              key={ki}
              className="key-cap inline-flex h-6 min-w-6 px-1.5 items-center justify-center rounded text-xs font-mono-code font-bold text-white/80"
            >
              {k === " " ? "SPACE" : k}
            </span>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="flex gap-4 justify-center text-sm">
        <div className="text-center">
          <div className="font-orbitron text-base font-bold" style={{ color: lesson.color }}>{s.wpm}</div>
          <div className="text-[10px] text-white/40 uppercase">WPM</div>
        </div>
        <div className="text-center">
          <div className="font-orbitron text-base font-bold text-purple-400">{s.accuracy}%</div>
          <div className="text-[10px] text-white/40 uppercase">Accuracy</div>
        </div>
        <div className="text-center">
          <div className="font-orbitron text-base font-bold text-white/70">{lineIdx + 1}/{lesson.text.length}</div>
          <div className="text-[10px] text-white/40 uppercase">Line</div>
        </div>
      </div>

      {allDone ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center animate-levelup">
            <div className="text-6xl mb-3">{lesson.icon}</div>
            <div className="font-orbitron text-2xl font-bold text-[#00f5c4]">LEVEL COMPLETE!</div>
            <div className="text-white/50 mt-2">Saving progress &amp; results...</div>
          </div>
        </div>
      ) : (
        <TypingArea text={text} charStates={charStates} currentIndex={currentIndex} fontSize={settings.fontSize} />
      )}

      {!allDone && settings.showKeyboard && (
        <div className="mt-auto">
          <TypingKeyboard
            pressedKey={lastKey}
            errorKey={lastErrorKey}
            hintKey={settings.keyboardHints ? currentExpected : undefined}
            compact={false}
          />
        </div>
      )}
    </div>
  );
}
