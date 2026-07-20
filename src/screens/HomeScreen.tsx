import { useGameStore } from "../store/gameStore";
import { AmbientBg } from "../components/AmbientBg";
import { InteractiveKeyboard } from "../components/InteractiveKeyboard";
import { TOTAL_LEVELS } from "../data/levels";

export function HomeScreen() {
  const { setScreen, totalWordsTyped, totalSessions, getBestScore, settings, dailyStreak, achievements, lessonProgress } = useGameStore();
  const sprintBest = getBestScore("sprint");
  const lessonsDone = Object.values(lessonProgress).filter((p) => p.completed).length;
  const xp = totalWordsTyped * 2 + totalSessions * 50 + achievements.length * 120 + lessonsDone * 200;
  const level = Math.max(1, Math.floor(Math.sqrt(xp / 140)) + 1);

  const navTiles: { icon: string; label: string; sub: string; go: () => void; color: string }[] = [
    { icon: "📚", label: "Academy", sub: `${TOTAL_LEVELS}+ levels`, go: () => setScreen("lessons"), color: "#06b6d4" },
    { icon: "🎮", label: "Game Arena", sub: "10 typing modes", go: () => setScreen("modeSelect"), color: "#ef4444" },
    { icon: "💻", label: "Code Lab", sub: "Syntax practice", go: () => setScreen("codeLab"), color: "#f59e0b" },
    { icon: "🥋", label: "Typing Dojo", sub: "Posture & hands", go: () => setScreen("dojo"), color: "#22c55e" },
    { icon: "⌨️", label: "Keyboard Studio", sub: "Layouts & themes", go: () => setScreen("keyboard"), color: "#00f5c4" },
    { icon: "🏆", label: "Certificate", sub: "Local PNG", go: () => setScreen("certificate"), color: "#eab308" },
    { icon: "📈", label: "Stats", sub: "Track progress", go: () => setScreen("stats"), color: "#7c3aed" },
    { icon: "🏅", label: "Achievements", sub: `${achievements.length} unlocked`, go: () => setScreen("achievements"), color: "#f59e0b" },
    { icon: "🏁", label: "Leaderboard", sub: "Top scores", go: () => setScreen("leaderboard"), color: "#fb7185" },
    { icon: "⚙️", label: "Settings", sub: "Customize & about", go: () => setScreen("settings"), color: "#a855f7" },
  ];

  return (
    <div className="relative h-full overflow-y-auto">
      <AmbientBg />

      <div className="relative z-10 mx-auto flex min-h-full max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        {dailyStreak > 0 && (
          <div className="absolute right-4 top-4 glass rounded-full px-3 py-1.5 flex items-center gap-1.5 animate-fadeIn">
            <span className="text-sm">🔥</span>
            <span className="font-orbitron text-sm font-bold text-orange-400">{dailyStreak}</span>
            <span className="text-[10px] text-white/40">day streak</span>
          </div>
        )}

        {/* Hero */}
        <section className="pt-4 sm:pt-8 text-center">
          <div className="mx-auto flex max-w-4xl flex-col items-center gap-5">
            <img src="/logo.png" alt="TypeFlow Logo" className="h-20 w-20 rounded-[22px] shadow-2xl shadow-cyan-500/20 sm:h-24 sm:w-24" />

            <div>
              <h1 className="font-orbitron text-4xl font-black leading-none text-white sm:text-6xl">
                <span className="bg-gradient-to-r from-cyan-300 via-cyan-400 to-violet-400 bg-clip-text text-transparent">TYPE</span>
                <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-amber-300 bg-clip-text text-transparent">FLOW</span>
              </h1>
              <div className="mt-2 font-orbitron text-sm font-bold uppercase tracking-[0.35em] text-white/35 sm:text-base">
                Ultimate Typing Mastery App
              </div>
            </div>

            <p className="max-w-3xl text-sm leading-relaxed text-white/55 sm:text-base">
              <strong className="text-white">{TOTAL_LEVELS}+ Levels</strong> · <strong className="text-white">10 Games</strong> · <strong className="text-white">Code Labs</strong> · <strong className="text-white">Hindi + English</strong> · <strong className="text-white">Certificate</strong> · <strong className="text-white">100% Offline</strong>
            </p>

            <div className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
              <button onClick={() => setScreen("modeSelect")} className="btn-primary flex-1 rounded-2xl py-4 text-sm font-bold font-orbitron tracking-wide animate-pulse-glow">
                ▶ START TYPING
              </button>
              <button onClick={() => setScreen("lessons")} className="glass neon-border flex-1 rounded-2xl py-4 text-sm font-bold text-white/80 transition hover:text-white">
                📚 Open Academy
              </button>
            </div>
          </div>
        </section>

        {/* Keyboard preview — purely decorative, cannot be clicked/tapped */}
        <section className="my-6 flex justify-center sm:my-8 pointer-events-none select-none" aria-hidden="true">
          <div className="origin-center scale-[0.52] sm:scale-[0.74] lg:scale-[0.88]">
            <InteractiveKeyboard
              layout={settings.keyboardLayout}
              theme={settings.keyboardTheme}
              model={settings.keyboardModel || "wave"}
              glowWave={settings.glowWave}
              scale={Math.max(0.95, settings.keyboardScale)}
              captureKeys={false}
            />
          </div>
        </section>

        {/* Stats strip */}
        <section className="mx-auto mb-6 grid w-full max-w-4xl grid-cols-2 gap-3 sm:grid-cols-5">
          {[
            { label: "Level", value: `Lv ${level}`, color: "#00f5c4" },
            { label: "Words", value: totalWordsTyped.toLocaleString(), color: "#38bdf8" },
            { label: "Sessions", value: totalSessions, color: "#a78bfa" },
            { label: "Academy", value: `${lessonsDone}/${TOTAL_LEVELS}`, color: "#eab308" },
            { label: "Best WPM", value: sprintBest?.wpm ?? "—", color: "#fb7185" },
          ].map((card) => (
            <div key={card.label} className="glass rounded-2xl p-4 text-center">
              <div className="font-orbitron text-xl font-black" style={{ color: card.color, textShadow: `0 0 16px ${card.color}55` }}>{card.value}</div>
              <div className="mt-1 text-[10px] uppercase tracking-[0.25em] text-white/35">{card.label}</div>
            </div>
          ))}
        </section>

        {/* Navigation grid */}
        <section className="mx-auto w-full max-w-6xl pb-8">
          <div className="mb-3 font-orbitron text-sm font-bold uppercase tracking-[0.3em] text-white/30">Explore TypeFlow</div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {navTiles.map((t) => (
              <button key={t.label} onClick={t.go} className="mode-card glass rounded-2xl border border-white/5 p-4 text-left transition-all hover:border-white/15">
                <div className="mb-2 text-2xl">{t.icon}</div>
                <div className="font-orbitron text-xs font-bold text-white">{t.label}</div>
                <div className="mt-1 text-[10px] text-white/40">{t.sub}</div>
                <div className="mt-3 h-0.5 w-10 rounded-full" style={{ background: t.color }} />
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
