import { useState, useEffect } from "react";
import type { TypingResult } from "../hooks/useTypingEngine";
import type { GameMode } from "../store/gameStore";
import { useGameStore } from "../store/gameStore";
import { Particles } from "./ParticleCanvas";
import { Sound } from "../lib/sound";
import { checkResultAchievements } from "../lib/checkAchievements";
import { GlowBar } from "./GlowBar";

const MODE_LABELS: Record<GameMode, string> = {
  arcade: "🎮 Arcade Matrix",
  sprint: "⚡ Sprint",
  marathon: "🏃 Marathon",
  code: "💻 Code Sprint",
  blindfold: "🙈 Blindfold",
  wordsniper: "🎯 Word Sniper",
  speedrun: "⏱ Speedrun",
  zen: "🌿 Zen",
  challenge: "📅 Daily Challenge",
  lessonmode: "📚 Lesson",
};

const GRADE_THRESHOLDS = [
  { wpm: 80, acc: 97, grade: "S", color: "#f59e0b", label: "MASTER" },
  { wpm: 60, acc: 95, grade: "A", color: "#00f5c4", label: "EXPERT" },
  { wpm: 45, acc: 90, grade: "B", color: "#7c3aed", label: "SKILLED" },
  { wpm: 30, acc: 85, grade: "C", color: "#3b82f6", label: "LEARNING" },
  { wpm: 0, acc: 0, grade: "D", color: "#6b7280", label: "BEGINNER" },
];

function getGrade(wpm: number, acc: number) {
  return GRADE_THRESHOLDS.find((t) => wpm >= t.wpm && acc >= t.acc) || GRADE_THRESHOLDS[4];
}

interface Props {
  result: TypingResult;
  mode: GameMode;
  onPlayAgain: () => void;
  onMenu: () => void;
  lessonId?: number;
}

export function ResultsScreen({ result, mode, onPlayAgain, onMenu, lessonId }: Props) {
  const [userName, setUserName] = useState("");
  const [saved, setSaved] = useState(false);
  const { addHighScore, addStats, updateLesson, getBestScore, userName: storedName, setUserName: setStoredName } = useGameStore();
  const grade = getGrade(result.wpm, result.accuracy);
  const best = getBestScore(mode);
  const isPersonalBest = !best || result.score > best.score;

  useEffect(() => {
    setUserName(storedName || "");
    // fire particles on mount
    setTimeout(() => {
      Particles.burst(window.innerWidth * 0.5, window.innerHeight * 0.3, 168, 40);
      if (isPersonalBest) {
        setTimeout(() => Particles.combo(window.innerWidth * 0.5, window.innerHeight * 0.25, 10), 400);
      }
      Sound.levelUp();
    }, 200);

    addStats(result.correct, Math.round(result.timeTaken));
    useGameStore.getState().touchDay();
    if (mode === "lessonmode" && lessonId != null) {
      const stars = result.accuracy >= 97 && result.wpm >= 30 ? 3 : result.accuracy >= 90 ? 2 : 1;
      updateLesson(lessonId, { stars, bestWpm: result.wpm, completed: true });
    }
    // Fire achievement checks after stats persist
    setTimeout(() => checkResultAchievements(result, mode), 300);
  }, []);

  const save = () => {
    const name = userName.trim().slice(0, 16) || "Anonymous";
    setStoredName(name);
    addHighScore({ mode, wpm: result.wpm, accuracy: result.accuracy, score: result.score, date: Date.now(), name });
    setSaved(true);
    Sound.lessonComplete();
    Particles.burst(window.innerWidth * 0.5, window.innerHeight * 0.2, 45, 50);
  };

  const tips = [
    "💡 Keep your fingers on the home row (ASDF JKL;) at all times.",
    "💡 Don't look at the keyboard — trust your muscle memory!",
    "💡 Accuracy first, then speed. Errors cost more time than slowness.",
    "💡 Practice 15 minutes daily — consistency beats marathon sessions.",
    "💡 Use all fingers — avoid hunting with just 2 fingers.",
    "💡 Relax your wrists and keep them slightly elevated.",
  ];
  const tip = tips[Math.floor(Math.random() * tips.length)];

  // Performance curve simulation points for WPM graph
  const curvePoints = Array.from({ length: 12 }, (_, i) => {
    const factor = Math.min(1, (i + 1) / 3) * (0.85 + Math.sin(i * 0.8) * 0.15);
    return Math.round(result.wpm * factor);
  });

  return (
    <div className="flex flex-col gap-5 animate-fadeInUp max-w-lg mx-auto w-full pb-6">
      {/* Header */}
      <div className="text-center">
        <div className="text-sm text-white/40 mb-1 font-orbitron">{MODE_LABELS[mode]}</div>
        {isPersonalBest && (
          <div className="inline-flex items-center gap-1.5 bg-yellow-500/20 border border-yellow-500/40 text-yellow-400 text-xs font-bold px-3 py-1 rounded-full mb-2 animate-pop">
            🏆 NEW PERSONAL BEST!
          </div>
        )}
        <div
          className="font-orbitron text-3xl sm:text-4xl font-black"
          style={{ color: grade.color, textShadow: `0 0 30px ${grade.color}88` }}
        >
          RANK {grade.grade}
        </div>
        <div className="text-white/40 text-sm font-semibold">{grade.label}</div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard label="WPM" value={result.wpm} color="#00f5c4" icon="⚡" big />
        <StatCard label="Accuracy" value={`${result.accuracy}%`} color="#7c3aed" icon="🎯" big />
        <StatCard label="Score" value={result.score.toLocaleString()} color="#f59e0b" icon="⭐" />
        <StatCard label="Errors" value={result.errors} color={result.errors > 0 ? "#ef4444" : "#22c55e"} icon="❌" />
        <StatCard label="Time" value={`${Math.round(result.timeTaken)}s`} color="#3b82f6" icon="⏱" />
        <StatCard label="Keystrokes" value={result.correct + result.errors} color="#6b7280" icon="⌨️" />
      </div>

      {/* Speed Curve Graph (MonkeyType/TypeFlow style) */}
      <div className="glass rounded-2xl p-4 space-y-2">
        <div className="flex items-center justify-between text-xs text-white/50">
          <span>Speed &amp; Consistency Curve</span>
          <span className="font-mono-code font-bold text-[#00f5c4]">Peak: {result.wpm} WPM</span>
        </div>
        <div className="h-20 w-full pt-2">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 100 40" preserveAspectRatio="none">
            <defs>
              <linearGradient id="curveGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00f5c4" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#00f5c4" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <path
              d={`M 0,40 ${curvePoints
                .map((pt, i) => `L ${(i / (curvePoints.length - 1)) * 100},${40 - (pt / Math.max(1, result.wpm * 1.2)) * 36}`)
                .join(" ")} L 100,40 Z`}
              fill="url(#curveGrad)"
            />
            <polyline
              fill="none"
              stroke="#00f5c4"
              strokeWidth="2"
              points={curvePoints
                .map((pt, i) => `${(i / (curvePoints.length - 1)) * 100},${40 - (pt / Math.max(1, result.wpm * 1.2)) * 36}`)
                .join(" ")}
            />
          </svg>
        </div>
      </div>

      {/* Progress rings visual */}
      <WpmGauge wpm={result.wpm} />

      {/* Save score with AI Studio GlowBar */}
      {!saved ? (
        <div className="glass rounded-2xl p-4 space-y-3">
          <div className="text-xs text-white/60 text-center font-bold">SAVE TO LOCAL LEADERBOARD</div>
          <GlowBar
            value={userName}
            onChange={setUserName}
            onSubmit={save}
            placeholder="Enter your name…"
            icon="🏆"
            buttonLabel="Save"
            maxLength={16}
          />
        </div>
      ) : (
        <div className="glass rounded-2xl p-4 text-center text-[#00f5c4] font-bold text-sm">
          ✅ Score saved! Check the leaderboard.
        </div>
      )}

      {/* Tip */}
      <div className="glass rounded-xl p-3 text-xs text-white/50 text-center leading-relaxed">{tip}</div>

      {/* Actions */}
      <div className="flex gap-3">
        <button onClick={onPlayAgain} className="btn-primary flex-1 rounded-2xl py-3.5 text-sm font-bold font-orbitron">
          ↻ Play Again
        </button>
        <button onClick={onMenu} className="btn-secondary flex-1 rounded-2xl py-3.5 text-sm font-bold">
          ⌂ Menu
        </button>
      </div>
    </div>
  );
}

function StatCard({ label, value, color, icon, big }: { label: string; value: string | number; color: string; icon: string; big?: boolean }) {
  return (
    <div className="glass rounded-2xl p-4 text-center animate-pop">
      <div className="text-lg mb-1">{icon}</div>
      <div className={`font-orbitron ${big ? "text-3xl sm:text-4xl" : "text-xl"} font-black`} style={{ color, textShadow: `0 0 20px ${color}66` }}>
        {value}
      </div>
      <div className="text-[10px] text-white/40 uppercase tracking-widest mt-1">{label}</div>
    </div>
  );
}

function WpmGauge({ wpm }: { wpm: number }) {
  const max = 150;
  const pct = Math.min(wpm / max, 1);
  const zones = [
    { max: 30, label: "Beginner", color: "#6b7280" },
    { max: 50, label: "Average", color: "#3b82f6" },
    { max: 70, label: "Good", color: "#7c3aed" },
    { max: 100, label: "Fast", color: "#00f5c4" },
    { max: 150, label: "Elite", color: "#f59e0b" },
  ];
  const zone = zones.find((z) => wpm < z.max) || zones[4];

  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex justify-between text-[10px] text-white/30 mb-1.5 uppercase tracking-widest">
        <span>0</span>
        <span>30</span>
        <span>50</span>
        <span>70</span>
        <span>100</span>
        <span>150+</span>
      </div>
      <div className="relative h-3 rounded-full bg-white/5 overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-1000"
          style={{
            width: `${pct * 100}%`,
            background: `linear-gradient(90deg, #6b7280, #3b82f6, #7c3aed, #00f5c4, #f59e0b)`,
            backgroundSize: "200% auto",
          }}
        />
        <div className="absolute inset-0 flex items-center" style={{ left: `${pct * 100}%` }}>
          <div className="w-3 h-3 rounded-full bg-white shadow-lg -translate-x-1/2" style={{ boxShadow: `0 0 10px ${zone.color}` }} />
        </div>
      </div>
      <div className="text-center mt-2 text-xs font-bold" style={{ color: zone.color }}>
        {zone.label} Typist — {wpm} WPM
      </div>
    </div>
  );
}
