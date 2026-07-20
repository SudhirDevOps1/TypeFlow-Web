import { useEffect, useState } from "react";
import { ACHIEVEMENTS, TIER_COLORS } from "../data/achievements";

let pushToast: ((id: string) => void) | null = null;

export function showAchievement(id: string) {
  pushToast?.(id);
}

export function AchievementToast() {
  const [queue, setQueue] = useState<string[]>([]);

  useEffect(() => {
    pushToast = (id: string) => setQueue((q) => [...q, id]);
    return () => { pushToast = null; };
  }, []);

  useEffect(() => {
    if (queue.length === 0) return;
    const t = setTimeout(() => setQueue((q) => q.slice(1)), 4000);
    return () => clearTimeout(t);
  }, [queue]);

  const current = queue[0];
  if (!current) return null;
  const def = ACHIEVEMENTS.find((a) => a.id === current);
  if (!def) return null;

  return (
    <div className="fixed top-4 right-4 z-[1000] achievement-toast" key={current}>
      <div
        className="glass-dark rounded-2xl px-4 py-3 flex items-center gap-3 shadow-2xl"
        style={{ border: `1px solid ${def.color}66`, boxShadow: `0 0 30px ${def.color}44` }}
      >
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
          style={{ background: `${def.color}22`, border: `1px solid ${def.color}55` }}
        >
          {def.icon}
        </div>
        <div>
          <div className="text-[10px] font-bold uppercase tracking-widest" style={{ color: def.color }}>
            Achievement Unlocked · <span style={{ color: TIER_COLORS[def.tier] }}>{def.tier}</span>
          </div>
          <div className="font-orbitron text-sm font-bold text-white">{def.title}</div>
          <div className="text-[11px] text-white/50">{def.desc}</div>
        </div>
      </div>
    </div>
  );
}
