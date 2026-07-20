import { useState } from "react";
import type { GameMode } from "../store/gameStore";
import { useGameStore } from "../store/gameStore";

const MODE_LABELS: Partial<Record<GameMode, string>> = {
  sprint: "⚡ Sprint", marathon: "🏃 Marathon", wordsniper: "🎯 Word Sniper",
  speedrun: "⏱ Speedrun", code: "💻 Code", blindfold: "🙈 Blindfold",
  zen: "🌿 Zen", challenge: "📅 Challenge", arcade: "🎮 Arcade", lessonmode: "📚 Lesson",
};

export function LeaderboardScreen() {
  const { setScreen, highScores } = useGameStore();
  const [filterMode, setFilterMode] = useState<GameMode | "all">("all");

  const filtered = filterMode === "all" ? highScores : highScores.filter(h => h.mode === filterMode);
  const sorted = [...filtered].sort((a, b) => b.score - a.score).slice(0, 20);

  const modes = Array.from(new Set(highScores.map(h => h.mode))) as GameMode[];

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 p-4 sm:px-6">
        <button onClick={() => setScreen("home")} className="text-white/40 hover:text-white transition text-xl">←</button>
        <div>
          <div className="font-orbitron text-lg font-bold text-white">🏆 Leaderboard</div>
          <div className="text-xs text-white/40">{highScores.length} total scores recorded</div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 px-4 pb-3 overflow-x-auto">
        <button
          onClick={() => setFilterMode("all")}
          className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${filterMode === "all" ? "bg-[#00f5c4] text-[#070b14]" : "glass text-white/60"}`}
        >All</button>
        {modes.map(m => (
          <button
            key={m}
            onClick={() => setFilterMode(m)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${filterMode === m ? "bg-[#00f5c4] text-[#070b14]" : "glass text-white/60"}`}
          >{MODE_LABELS[m] || m}</button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-4 sm:px-6 pb-6">
        {sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-white/30">
            <div className="text-5xl mb-3">🏆</div>
            <div className="text-sm">No scores yet. Start playing!</div>
          </div>
        ) : (
          <div className="space-y-2">
            {sorted.map((score, i) => (
              <div key={score.date + i} className={`glass rounded-2xl px-4 py-3 flex items-center gap-4 ${i < 3 ? "border border-yellow-500/20" : ""}`}>
                <div className="w-8 text-center font-orbitron font-black text-lg" style={{
                  color: i === 0 ? "#f59e0b" : i === 1 ? "#9ca3af" : i === 2 ? "#b45309" : "#ffffff44"
                }}>
                  {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i+1}`}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm text-white truncate">{score.name}</div>
                  <div className="text-[10px] text-white/30">{MODE_LABELS[score.mode] || score.mode} • {new Date(score.date).toLocaleDateString()}</div>
                </div>
                <div className="flex gap-3 text-right">
                  <div>
                    <div className="font-orbitron text-sm text-[#00f5c4]">{score.wpm}</div>
                    <div className="text-[9px] text-white/30">WPM</div>
                  </div>
                  <div>
                    <div className="font-orbitron text-sm text-purple-400">{score.accuracy}%</div>
                    <div className="text-[9px] text-white/30">ACC</div>
                  </div>
                  <div>
                    <div className="font-orbitron text-sm text-yellow-400">{score.score.toLocaleString()}</div>
                    <div className="text-[9px] text-white/30">SCORE</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
