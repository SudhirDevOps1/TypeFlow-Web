import { useGameStore } from "../store/gameStore";
import { ACHIEVEMENTS, TIER_COLORS } from "../data/achievements";

export function AchievementsScreen() {
  const { setScreen, achievements } = useGameStore();
  const unlockedIds = new Set(achievements.map((a) => a.id));
  const unlockedCount = ACHIEVEMENTS.filter((a) => unlockedIds.has(a.id)).length;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-4 sm:px-6 border-b border-white/5">
        <button onClick={() => setScreen("home")} className="text-white/40 hover:text-white transition text-xl">←</button>
        <div className="flex-1">
          <div className="font-orbitron text-lg font-bold text-white">🏅 Achievements</div>
          <div className="text-xs text-white/40">{unlockedCount} / {ACHIEVEMENTS.length} unlocked</div>
        </div>
        <div className="font-orbitron text-2xl font-black text-[#00f5c4]">
          {Math.round((unlockedCount / ACHIEVEMENTS.length) * 100)}%
        </div>
      </div>

      {/* progress */}
      <div className="px-4 sm:px-6 pt-3">
        <div className="h-2 rounded-full bg-white/5 overflow-hidden">
          <div className="h-full progress-bar-inner rounded-full transition-all" style={{ width: `${(unlockedCount / ACHIEVEMENTS.length) * 100}%` }} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {ACHIEVEMENTS.map((a, i) => {
            const unlocked = unlockedIds.has(a.id);
            return (
              <div
                key={a.id}
                className="glass rounded-2xl p-4 flex items-center gap-4 animate-fadeInUp transition-all"
                style={{
                  animationDelay: `${i * 0.03}s`,
                  border: unlocked ? `1px solid ${a.color}55` : "1px solid rgba(255,255,255,0.05)",
                  opacity: unlocked ? 1 : 0.55,
                }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0"
                  style={{
                    background: unlocked ? `${a.color}22` : "rgba(255,255,255,0.03)",
                    border: `1px solid ${unlocked ? a.color + "66" : "rgba(255,255,255,0.06)"}`,
                    filter: unlocked ? "none" : "grayscale(1)",
                  }}
                >
                  {unlocked ? a.icon : "🔒"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-orbitron text-sm font-bold text-white">{a.title}</span>
                    <span
                      className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded tier-shine"
                      style={{
                        color: "#0a0a0a",
                        background: `linear-gradient(90deg, ${TIER_COLORS[a.tier]}, #fff8, ${TIER_COLORS[a.tier]})`,
                      }}
                    >
                      {a.tier}
                    </span>
                  </div>
                  <div className="text-[11px] text-white/45 mt-0.5 leading-snug">{a.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
