import { useGameStore } from "../store/gameStore";
import { TOTAL_LEVELS } from "../data/levels";

function fmtTime(sec: number) {
  if (sec < 60) return `${Math.round(sec)}s`;
  const m = Math.floor(sec / 60);
  if (m < 60) return `${m}m`;
  return `${Math.floor(m / 60)}h ${m % 60}m`;
}

export function StatsScreen() {
  const { setScreen, totalWordsTyped, totalTimeTyped, totalSessions, highScores, dailyStreak, lessonProgress, achievements, keyStats } = useGameStore();

  const avgWpm = highScores.length ? Math.round(highScores.reduce((a, h) => a + h.wpm, 0) / highScores.length) : 0;
  const bestWpm = highScores.length ? Math.max(...highScores.map((h) => h.wpm)) : 0;
  const avgAcc = highScores.length ? Math.round(highScores.reduce((a, h) => a + h.accuracy, 0) / highScores.length) : 0;
  const lessonsDone = Object.values(lessonProgress).filter((p) => p.completed).length;
  const xp = totalWordsTyped * 2 + totalSessions * 50 + achievements.length * 120 + lessonsDone * 200;
  const level = Math.max(1, Math.floor(Math.sqrt(xp / 140)) + 1);
  const levelBase = Math.pow(level - 1, 2) * 140;
  const nextBase = Math.pow(level, 2) * 140;
  const levelPct = Math.min(100, ((xp - levelBase) / Math.max(1, nextBase - levelBase)) * 100);
  const weakKeys = Object.entries(keyStats)
    .map(([key, v]) => ({ key, total: v.hit + v.miss, miss: v.miss, rate: v.miss / Math.max(1, v.hit + v.miss) }))
    .filter((k) => k.total >= 3)
    .sort((a, b) => b.rate - a.rate || b.miss - a.miss)
    .slice(0, 10);

  const history = [...highScores].sort((a, b) => a.date - b.date).slice(-15);
  const maxW = Math.max(60, ...history.map((h) => h.wpm));

  const cards = [
    { icon: "⚡", label: "Best WPM", value: bestWpm, color: "#00f5c4" },
    { icon: "📊", label: "Avg WPM", value: avgWpm, color: "#7c3aed" },
    { icon: "🎯", label: "Avg Accuracy", value: `${avgAcc}%`, color: "#f59e0b" },
    { icon: "🔥", label: "Day Streak", value: dailyStreak, color: "#ef4444" },
    { icon: "📖", label: "Words Typed", value: totalWordsTyped.toLocaleString(), color: "#3b82f6" },
    { icon: "⏱", label: "Time Typing", value: fmtTime(totalTimeTyped), color: "#22c55e" },
    { icon: "🎮", label: "Sessions", value: totalSessions, color: "#a855f7" },
    { icon: "🎓", label: "Levels Done", value: `${lessonsDone}/${TOTAL_LEVELS}`, color: "#06b6d4" },
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-4 sm:px-6 border-b border-white/5">
        <button onClick={() => setScreen("home")} className="text-white/40 hover:text-white transition text-xl">←</button>
        <div>
          <div className="font-orbitron text-lg font-bold text-white">📈 Your Stats</div>
          <div className="text-xs text-white/40">Track your typing journey</div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 space-y-5 max-w-2xl mx-auto w-full">
        <div className="glass rounded-2xl p-4 overflow-hidden relative">
          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#00f5c4]/10 blur-2xl" />
          <div className="flex items-center justify-between gap-4 relative">
            <div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-white/35">Player Level</div>
              <div className="font-orbitron text-4xl font-black text-[#00f5c4]" style={{ textShadow: "0 0 24px rgba(0,245,196,0.45)" }}>Lv {level}</div>
              <div className="text-xs text-white/40">{xp.toLocaleString()} XP · practice more to unlock higher ranks</div>
            </div>
            <div className="text-5xl">🚀</div>
          </div>
          <div className="h-2 rounded-full bg-white/5 overflow-hidden mt-4">
            <div className="h-full progress-bar-inner rounded-full" style={{ width: `${levelPct}%` }} />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {cards.map((c, i) => (
            <div key={c.label} className="glass rounded-2xl p-4 text-center animate-fadeInUp" style={{ animationDelay: `${i * 0.04}s` }}>
              <div className="text-xl mb-1">{c.icon}</div>
              <div className="font-orbitron text-xl font-black" style={{ color: c.color, textShadow: `0 0 16px ${c.color}55` }}>{c.value}</div>
              <div className="text-[10px] text-white/40 uppercase tracking-widest mt-1">{c.label}</div>
            </div>
          ))}
        </div>

        <div className="glass rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-sm font-semibold text-white">Weak-Key Analyzer</div>
              <div className="text-[11px] text-white/35">Keys with the highest error rate get priority in practice.</div>
            </div>
            <span className="text-xl">🔍</span>
          </div>
          {weakKeys.length === 0 ? (
            <div className="text-center text-white/30 text-sm py-7">Type more lessons to unlock your weak-key heatmap.</div>
          ) : (
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
              {weakKeys.map((k) => (
                <div key={k.key} className="rounded-xl p-2 text-center" style={{ background: `rgba(239,68,68,${0.08 + k.rate * 0.35})`, border: "1px solid rgba(239,68,68,0.25)" }}>
                  <div className="font-mono-code text-sm font-black text-white">{k.key}</div>
                  <div className="text-[9px] text-red-200/70">{Math.round(k.rate * 100)}%</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="glass rounded-2xl p-4">
          <div className="text-sm font-semibold text-white mb-3">WPM Progression</div>
          {history.length === 0 ? (
            <div className="text-center text-white/30 text-sm py-8">Play some games to see your progress chart 📊</div>
          ) : (
            <div className="flex items-end gap-1.5 h-32">
              {history.map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                  <div className="text-[9px] text-white/40 opacity-0 group-hover:opacity-100 transition">{h.wpm}</div>
                  <div className="w-full rounded-t-md transition-all" style={{ height: `${(h.wpm / maxW) * 100}%`, background: "linear-gradient(to top, #00f5c4, #7c3aed)", minHeight: 4, boxShadow: "0 0 8px rgba(0,245,196,0.3)" }} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="glass rounded-2xl p-4">
          <div className="text-sm font-semibold text-white mb-3">Best Score Per Mode</div>
          <div className="space-y-2">
            {Array.from(new Set(highScores.map((h) => h.mode))).map((mode) => {
              const best = highScores.filter((h) => h.mode === mode).sort((a, b) => b.wpm - a.wpm)[0];
              return (
                <div key={mode} className="flex items-center justify-between text-sm">
                  <span className="text-white/60 capitalize">{mode}</span>
                  <div className="flex items-center gap-2 flex-1 mx-3">
                    <div className="h-1.5 flex-1 rounded-full bg-white/5 overflow-hidden">
                      <div className="h-full rounded-full bg-[#00f5c4]" style={{ width: `${Math.min((best.wpm / 120) * 100, 100)}%` }} />
                    </div>
                  </div>
                  <span className="font-orbitron text-[#00f5c4] text-sm w-16 text-right">{best.wpm} WPM</span>
                </div>
              );
            })}
            {highScores.length === 0 && <div className="text-center text-white/30 text-sm py-4">No records yet.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
