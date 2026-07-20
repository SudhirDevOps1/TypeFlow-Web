import { memo } from "react";
import type { TypingStats } from "../hooks/useTypingEngine";

interface Props {
  stats: TypingStats;
  timeLeft?: number;
  timeLimit?: number;
  lives?: number;
  maxLives?: number;
  combo?: number;
  showExtras?: boolean;
}

function StatBox({ label, value, color = "#00f5c4", unit = "" }: { label: string; value: string | number; color?: string; unit?: string }) {
  return (
    <div className="flex flex-col items-center min-w-[64px]">
      <div
        className="font-orbitron text-xl sm:text-2xl font-bold tabular-nums"
        style={{ color, textShadow: `0 0 16px ${color}88` }}
      >
        {value}
        {unit && <span className="text-xs ml-0.5 opacity-70">{unit}</span>}
      </div>
      <div className="text-[10px] sm:text-xs text-white/40 uppercase tracking-widest mt-0.5">{label}</div>
    </div>
  );
}

export const StatsBar = memo(function StatsBar({ stats, timeLeft, timeLimit, lives = 5, maxLives = 5, combo = 0, showExtras = false }: Props) {
  const progressPct = Math.round(stats.progress * 100);
  const dangerTime = timeLeft !== undefined && timeLimit && timeLeft < timeLimit * 0.2;

  return (
    <div className="space-y-3">
      {/* Main stats */}
      <div className="glass rounded-2xl px-4 py-3 flex items-center justify-between flex-wrap gap-3">
        <StatBox label="WPM" value={stats.wpm} color="#00f5c4" />
        <StatBox label="Accuracy" value={stats.accuracy} unit="%" color="#7c3aed" />
        <StatBox label="Errors" value={stats.errors} color={stats.errors > 0 ? "#ef4444" : "#22c55e"} />
        {showExtras && <StatBox label="Correct" value={stats.correct} color="#22c55e" />}
        {combo >= 3 && (
          <div
            className="flex flex-col items-center animate-pop"
            key={combo}
          >
            <div
              className="font-orbitron text-xl sm:text-2xl font-black"
              style={{ color: "#f59e0b", textShadow: "0 0 20px #f59e0baa" }}
            >
              ×{combo}
            </div>
            <div className="text-[10px] text-white/40 uppercase tracking-widest">Combo</div>
          </div>
        )}
        {timeLeft !== undefined && (
          <div className="flex flex-col items-center">
            <div
              className={`font-orbitron text-xl sm:text-2xl font-bold tabular-nums ${dangerTime ? "text-red-400 animate-pulse" : "text-white"}`}
              style={dangerTime ? { textShadow: "0 0 16px #ef444488" } : {}}
            >
              {timeLeft}
            </div>
            <div className="text-[10px] text-white/40 uppercase tracking-widest">Time</div>
          </div>
        )}
        {maxLives > 0 && (
          <div className="flex gap-1">
            {Array.from({ length: maxLives }).map((_, i) => (
              <span key={i} style={{ filter: i < lives ? "drop-shadow(0 0 4px #ef444499)" : "grayscale(1)", opacity: i < lives ? 1 : 0.25, fontSize: "1.1rem" }}>❤️</span>
            ))}
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
        <div
          className="h-full rounded-full progress-bar-inner transition-all duration-150"
          style={{ width: `${progressPct}%` }}
        />
      </div>
    </div>
  );
});
