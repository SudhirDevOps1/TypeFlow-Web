import { useState } from "react";
import type { GameMode } from "../store/gameStore";
import { useGameStore } from "../store/gameStore";

const MODES: {
  id: GameMode;
  icon: string;
  title: string;
  desc: string;
  color: string;
  badge?: string;
  difficulty: "Easy" | "Medium" | "Hard" | "Chill";
  group: "games" | "training" | "daily";
}[] = [
  { id: "wordsniper", icon: "🎯", title: "Word Sniper",   desc: "Destroy falling words before they hit the base.", color: "#ef4444", badge: "HOT", difficulty: "Hard", group: "games" },
  { id: "arcade",     icon: "🎮", title: "Arcade",        desc: "Falling words chaos. Combo multipliers. Leaderboard glory.", color: "#a855f7", badge: "NEW", difficulty: "Hard", group: "games" },
  { id: "speedrun",   icon: "⏱", title: "Speedrun",      desc: "Space to submit words. 30 seconds. Max throughput.", color: "#f97316", difficulty: "Medium", group: "games" },
  { id: "blindfold",  icon: "🙈", title: "Blindfold",    desc: "Type without seeing output. Ultimate trust exercise.", color: "#ec4899", badge: "HARD", difficulty: "Hard", group: "games" },
  { id: "sprint",     icon: "⚡", title: "Sprint",        desc: "Type 50 words as fast as you can. Pure speed test.", color: "#00f5c4", difficulty: "Easy", group: "training" },
  { id: "marathon",   icon: "🏃", title: "Marathon",      desc: "60 seconds, type as much as possible. Endurance wins.", color: "#7c3aed", difficulty: "Medium", group: "training" },
  { id: "code",       icon: "💻", title: "Code Sprint",   desc: "Type real code snippets. Programmers' choice.", color: "#f59e0b", difficulty: "Hard", group: "training" },
  { id: "lessonmode", icon: "📚", title: "Lesson Mode",  desc: "Guided lessons from home row to mastery. Learn properly.", color: "#06b6d4", badge: "LEARN", difficulty: "Easy", group: "training" },
  { id: "zen",        icon: "🌿", title: "Zen Mode",      desc: "Quotes. No timer. No pressure. Just flow.", color: "#22c55e", difficulty: "Chill", group: "daily" },
  { id: "challenge",  icon: "📅", title: "Daily Challenge", desc: "One quote, same for everyone today. Global competition.", color: "#eab308", badge: "DAILY", difficulty: "Medium", group: "daily" },
];

const DIFF_COLORS = { Easy: "#22c55e", Medium: "#f59e0b", Hard: "#ef4444", Chill: "#7c3aed" };

export function ModeSelectScreen() {
  const { setMode, setScreen, getBestScore } = useGameStore();

  const [hovered, setHovered] = useState<GameMode | null>(null);

  const launch = (id: GameMode) => {
    setMode(id === "lessonmode" ? "lessonmode" : id);
    setScreen(id === "lessonmode" ? "lessons" : "game");
  };

  const renderMode = (mode: (typeof MODES)[number], i: number) => {
    const best = getBestScore(mode.id);
    return (
      <button
        key={mode.id}
        onClick={() => launch(mode.id)}
        onMouseEnter={() => setHovered(mode.id)}
        onMouseLeave={() => setHovered(null)}
        className="mode-card glass text-left rounded-2xl p-4 sm:p-5 border border-white/5 hover:border-white/20 transition-all"
        style={{
          animationDelay: `${i * 0.04}s`,
          boxShadow: hovered === mode.id ? `0 20px 40px rgba(0,0,0,0.4), 0 0 0 1px ${mode.color}44` : undefined,
        }}
      >
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{mode.icon}</span>
            <div>
              <div className="font-orbitron text-sm font-bold text-white">{mode.title}</div>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: `${DIFF_COLORS[mode.difficulty]}22`, color: DIFF_COLORS[mode.difficulty] }}>{mode.difficulty}</span>
            </div>
          </div>
          {mode.badge && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: `${mode.color}22`, color: mode.color, border: `1px solid ${mode.color}44` }}>{mode.badge}</span>
          )}
        </div>
        <p className="text-xs text-white/50 leading-relaxed mb-3">{mode.desc}</p>
        {best ? (
          <div className="flex gap-3 text-[10px]">
            <span style={{ color: mode.color }}>⚡ {best.wpm} WPM</span>
            <span className="text-white/30">🎯 {best.accuracy}%</span>
            <span className="text-white/30">⭐ {best.score.toLocaleString()}</span>
          </div>
        ) : (
          <div className="text-[10px] text-white/20">No attempts yet</div>
        )}
        <div className="h-0.5 w-8 rounded-full mt-3 transition-all duration-300" style={{ background: mode.color }} />
      </button>
    );
  };

  const renderSection = (title: string, sub: string, group: (typeof MODES)[number]["group"]) => {
    const list = MODES.filter((m) => m.group === group);
    return (
      <section className="mb-6">
        <div className="flex items-end justify-between mb-3">
          <div>
            <div className="font-orbitron text-sm font-bold text-white">{title}</div>
            <div className="text-xs text-white/35">{sub}</div>
          </div>
          <span className="text-[10px] text-white/25">{list.length} modes</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {list.map(renderMode)}
        </div>
      </section>
    );
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center gap-3 p-4 sm:px-6">
        <button onClick={() => setScreen("home")} className="text-white/40 hover:text-white transition text-xl">←</button>
        <div>
          <div className="font-orbitron text-lg font-bold text-white">Choose Mode</div>
          <div className="text-xs text-white/40">10 unique typing challenges</div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 sm:px-6 pb-6">
        {renderSection("Game Arena", "Fast feedback, pressure, combo scoring and replayability", "games")}
        {renderSection("Skill Training", "Build speed, accuracy, code typing and finger memory", "training")}
        {renderSection("Daily & Focus", "Calm practice and daily benchmark quote", "daily")}
      </div>
    </div>
  );
}
