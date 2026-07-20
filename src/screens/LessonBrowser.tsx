import { useState, useMemo } from "react";
import { ALL_LEVELS, CATEGORIES, TOTAL_LEVELS, type LessonCategory } from "../data/levels";
import { useGameStore } from "../store/gameStore";
import { GlowBar } from "../components/GlowBar";

export function LessonBrowser({ onSelectLesson }: { onSelectLesson: (id: number) => void }) {
  const { setScreen, lessonProgress } = useGameStore();
  const [activeCategory, setActiveCategory] = useState<LessonCategory | "All">("All");
  const [search, setSearch] = useState("");

  const completedCount = useMemo(() => Object.values(lessonProgress).filter((p) => p.completed).length, [lessonProgress]);
  const totalStars = useMemo(() => Object.values(lessonProgress).reduce((acc, p) => acc + (p.stars || 0), 0), [lessonProgress]);

  const filteredLevels = useMemo(() => {
    return ALL_LEVELS.filter((lvl) => {
      const matchCat = activeCategory === "All" || lvl.category === activeCategory;
      const q = search.toLowerCase();
      const matchSearch = !q || lvl.title.toLowerCase().includes(q) || lvl.keys.toLowerCase().includes(q) || lvl.description.toLowerCase().includes(q) || lvl.subtitle.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [activeCategory, search]);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex items-center gap-3 border-b border-white/5 p-4 sm:px-6">
        <button onClick={() => setScreen("home")} className="text-xl text-white/40 transition hover:text-white">←</button>
        <div className="flex-1 min-w-0">
          <div className="font-orbitron text-lg font-bold text-white truncate">📚 Typing Academy ({TOTAL_LEVELS} Levels)</div>
          <div className="text-xs text-white/40">Home row → symbols → code → Hindi → expert speed gates</div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right">
            <div className="font-orbitron text-sm font-bold text-[#00f5c4]">{completedCount}/{TOTAL_LEVELS}</div>
            <div className="text-[9px] text-white/30">Levels</div>
          </div>
          <div className="text-right">
            <div className="font-orbitron text-sm font-bold text-yellow-400">⭐ {totalStars}</div>
            <div className="text-[9px] text-white/30">Stars</div>
          </div>
        </div>
      </div>

      <div className="space-y-3 p-4 sm:px-6">
        <GlowBar value={search} onChange={setSearch} placeholder={`Search ${TOTAL_LEVELS} levels by key, Hindi, code, or topic...`} icon="🔍" />

        <div className="glass rounded-2xl px-4 py-2.5 flex items-center justify-between gap-3 text-xs">
          <div className="text-white/50">Academy Mastery</div>
          <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
            <div className="h-full rounded-full progress-bar-inner" style={{ width: `${(completedCount / TOTAL_LEVELS) * 100}%` }} />
          </div>
          <div className="font-orbitron font-bold text-[#00f5c4]">{Math.round((completedCount / TOTAL_LEVELS) * 100)}%</div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setActiveCategory("All")}
            className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${activeCategory === "All" ? "bg-[#00f5c4] text-[#070b14]" : "glass text-white/60 hover:text-white"}`}
          >
            All ({TOTAL_LEVELS})
          </button>
          {CATEGORIES.map((cat) => {
            const active = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${active ? "bg-[#00f5c4] text-[#070b14]" : "glass text-white/60 hover:text-white"}`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-6 sm:px-6 space-y-2.5">
        {filteredLevels.length === 0 ? (
          <div className="py-12 text-center text-sm text-white/30">No levels match your search “{search}”.</div>
        ) : (
          filteredLevels.map((lvl) => {
            const prog = lessonProgress[lvl.id];
            const unlocked = lvl.id === 1 || lessonProgress[lvl.id - 1]?.completed || lvl.id <= 5;
            const stars = prog?.stars || 0;
            return (
              <button
                key={lvl.id}
                onClick={() => unlocked && onSelectLesson(lvl.id)}
                disabled={!unlocked}
                className={`w-full glass rounded-2xl p-3.5 sm:p-4 text-left transition-all ${unlocked ? "hover:scale-[1.008] cursor-pointer hover:border-[#00f5c4]/40" : "opacity-40 cursor-not-allowed"}`}
                style={{ border: prog?.completed ? `1px solid ${lvl.color}55` : "1px solid rgba(255,255,255,0.06)" }}
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl shrink-0" style={{ background: `${lvl.color}22`, border: `1px solid ${lvl.color}44` }}>
                    {!unlocked ? "🔒" : lvl.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-orbitron text-sm font-bold text-white truncate">{lvl.title}</span>
                      {prog?.completed && (
                        <div className="flex gap-0.5 shrink-0">
                          {[1, 2, 3].map((s) => <span key={s} className="text-xs" style={{ opacity: s <= stars ? 1 : 0.2 }}>⭐</span>)}
                        </div>
                      )}
                    </div>
                    <div className="text-[11px] text-white/45 truncate">{lvl.description}</div>
                    {prog?.bestWpm ? <div className="text-[10px] mt-1 font-mono-code" style={{ color: lvl.color }}>Best: {prog.bestWpm} WPM</div> : null}
                  </div>
                  <div className="text-white/30 text-lg shrink-0">{unlocked ? "▶" : "🔒"}</div>
                </div>

                <div className="mt-2.5 flex gap-1 flex-wrap items-center">
                  <span className="text-[10px] text-white/30 mr-1 uppercase tracking-wider">Practice:</span>
                  {lvl.keys.slice(0, 15).split("").map((k, ki) => (
                    <span key={ki} className="key-cap inline-flex h-5 min-w-5 px-1.5 items-center justify-center rounded text-[10px] font-mono-code font-bold text-white/70">
                      {k === " " ? "SPACE" : k}
                    </span>
                  ))}
                  {lvl.keys.length > 15 && <span className="text-[10px] text-white/30 self-center">+{lvl.keys.length - 15}</span>}
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
