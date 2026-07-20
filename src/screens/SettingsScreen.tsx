import { useGameStore } from "../store/gameStore";
import { LAYOUT_INFO, KEYBOARD_MODELS, KEYBOARD_THEMES } from "../data/keyboardLayouts";
import { TOTAL_LEVELS } from "../data/levels";

function Toggle({ label, desc, value, onChange }: { label: string; desc: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!value)} className="w-full glass rounded-2xl px-4 py-3.5 flex items-center justify-between transition hover:bg-white/[0.06]">
      <div className="text-left">
        <div className="text-sm font-semibold text-white">{label}</div>
        <div className="text-[11px] text-white/40">{desc}</div>
      </div>
      <div className="toggle shrink-0 ml-4" data-on={value} />
    </button>
  );
}

function Segmented<T extends string>({ label, options, value, onChange }: { label: string; options: { v: T; l: string }[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="glass rounded-2xl px-4 py-3.5">
      <div className="text-sm font-semibold text-white mb-2.5">{label}</div>
      <div className="flex gap-1 rounded-xl bg-black/30 p-1">
        {options.map((o) => (
          <button
            key={o.v}
            onClick={() => onChange(o.v)}
            data-active={value === o.v}
            className="seg flex-1 rounded-lg py-2 text-xs font-bold text-white/50"
          >
            {o.l}
          </button>
        ))}
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <div className="text-[11px] font-bold uppercase tracking-[0.25em] text-white/30 pt-2">{children}</div>;
}

const badges = ["React 19", "TypeScript 5", "Vite 7", "Tailwind 4", "Privacy First", "Offline Local Data"];

const featureRows: [string, string][] = [
  ["🎯 Zen Test Mode", "Minimal UI, live WPM/accuracy, blind typing flow, calm practice"],
  ["🎓 Typing Academy", `${TOTAL_LEVELS}+ structured levels — home row to Hindi, code, expert gates`],
  ["🕹️ 10 Modes", "Sprint, Marathon, Arcade, Word Sniper, Speedrun, Code, Blindfold, Zen, Challenge, Lessons"],
  ["💻 Code Labs", "JS, TS, Python, SQL, HTML/CSS, Bash-like snippets with symbol-heavy drills"],
  ["🇮🇳 Hindi Support", "Hindi + bilingual levels added in the academy expansion"],
  ["🥋 Typing Dojo", "Posture, hand placement, finger-zone guidance, live key explorer"],
  ["📊 Analytics", "WPM trend, weak-key analyzer, XP levels, achievements, streaks"],
  ["🏆 Certificate", "Canvas-generated local PNG certificate, no server upload"],
  ["🎨 Customization", "6 keyboard models, multiple layouts, themes, size scaling, glow wave"],
  ["🔒 Privacy-First", "No accounts, no tracking, no cookies — local-only progress"],
];

export function SettingsScreen() {
  const { setScreen, settings, updateSettings } = useGameStore();

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-4 sm:px-6 border-b border-white/5">
        <button onClick={() => setScreen("home")} className="text-white/40 hover:text-white transition text-xl">←</button>
        <div>
          <div className="font-orbitron text-lg font-bold text-white">⚙️ Settings</div>
          <div className="text-xs text-white/40">Tune the experience to your taste</div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 space-y-4 max-w-xl mx-auto w-full">
        <div className="text-[11px] font-bold uppercase tracking-[0.25em] text-white/30 pt-1">Feedback</div>
        <Toggle label="Sound Effects" desc="Key clicks, combos & fanfares" value={settings.soundEnabled} onChange={(v) => updateSettings({ soundEnabled: v })} />
        <Toggle label="Glow Wave" desc="Ripple light animation on keypress" value={settings.glowWave} onChange={(v) => updateSettings({ glowWave: v })} />
        <Toggle label="Smooth Caret" desc="Animate the typing cursor" value={settings.smoothCaret} onChange={(v) => updateSettings({ smoothCaret: v })} />

        <SectionLabel>Keyboard Helper &amp; Sizing</SectionLabel>
        <Toggle label="Show Keyboard" desc="Display the on-screen keyboard while typing" value={settings.showKeyboard} onChange={(v) => updateSettings({ showKeyboard: v })} />
        <Toggle label="Next-Key Hint" desc="Highlight the key you should press next" value={settings.keyboardHints} onChange={(v) => updateSettings({ keyboardHints: v })} />
        <Toggle label="Finger Colors" desc="Color keys by which finger to use" value={settings.fingerColors} onChange={(v) => updateSettings({ fingerColors: v })} />

        {/* Keyboard Size Control */}
        <div className="glass rounded-2xl px-4 py-3.5 space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-white">Keyboard Manual Scale (Bada/Chhota)</div>
            <div className="font-orbitron font-bold text-[#00f5c4] text-xs">{Math.round((settings.keyboardScale || 0.75) * 100)}%</div>
          </div>
          <input
            type="range"
            min="0.4"
            max="1.3"
            step="0.05"
            value={settings.keyboardScale || 0.75}
            onChange={(e) => updateSettings({ keyboardScale: parseFloat(e.target.value) })}
            className="w-full accent-[#00f5c4] cursor-pointer h-2 bg-white/10 rounded-lg"
          />
        </div>

        <SectionLabel>Typing Text</SectionLabel>
        <Segmented
          label="Font Size"
          value={settings.fontSize}
          onChange={(v) => updateSettings({ fontSize: v })}
          options={[{ v: "sm", l: "Small" }, { v: "md", l: "Medium" }, { v: "lg", l: "Large" }]}
        />

        <SectionLabel>Layout &amp; Look</SectionLabel>
        <button onClick={() => setScreen("keyboard")} className="w-full glass rounded-2xl px-4 py-3.5 flex items-center justify-between hover:bg-white/[0.06] transition">
          <div className="text-left">
            <div className="text-sm font-semibold text-white">Keyboard Layout Studio</div>
            <div className="text-[11px] text-white/40">
              {LAYOUT_INFO[settings.keyboardLayout].name} · {KEYBOARD_THEMES[settings.keyboardTheme].name} · {KEYBOARD_MODELS[settings.keyboardModel || "wave"].name}
            </div>
          </div>
          <span className="text-[#00f5c4] text-xs font-bold">Studio →</span>
        </button>

        <div className="pt-3">
          <button
            onClick={() => {
              if (confirm("Reset all progress, scores & settings? This cannot be undone.")) {
                localStorage.removeItem("typeflow-app-v1");
                location.reload();
              }
            }}
            className="w-full rounded-2xl py-3 text-sm font-bold text-red-400 border border-red-500/30 hover:bg-red-500/10 transition"
          >
            🗑 Reset All Data
          </button>
        </div>

        {/* ─────────────── About TypeFlow ─────────────── */}
        <SectionLabel>About TypeFlow</SectionLabel>

        <div className="glass rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="TypeFlow Logo" className="h-10 w-10 rounded-xl" />
            <div>
              <div className="font-orbitron text-sm font-bold text-white">TypeFlow</div>
              <div className="text-[11px] text-white/40">Ultimate Typing Mastery App</div>
            </div>
          </div>
          <p className="text-sm leading-6 text-white/58">
            Inspired by serious typing tutors and modern minimalist speed tools, TypeFlow blends structured learning, arcade motivation, code practice, bilingual growth, and privacy-first local progress into one polished experience.
          </p>
          <blockquote className="rounded-xl border border-white/8 bg-black/20 p-3 text-xs italic text-white/60">
            "Typing is one of the most underrated digital superpowers — train it like a real skill."
          </blockquote>
        </div>

        <div className="glass rounded-2xl p-4">
          <div className="text-sm font-semibold text-white mb-2.5">Tech Stack</div>
          <div className="flex flex-wrap gap-2">
            {badges.map((badge) => (
              <span key={badge} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-semibold text-white/65">
                {badge}
              </span>
            ))}
          </div>
        </div>

        <div className="glass rounded-2xl p-4">
          <div className="text-sm font-semibold text-white mb-3">Feature Matrix</div>
          <div className="overflow-hidden rounded-xl border border-white/6">
            {featureRows.map(([left, right], i) => (
              <div key={left} className={`px-3 py-3 ${i !== featureRows.length - 1 ? "border-b border-white/6" : ""}`}>
                <div className="font-orbitron text-xs font-bold text-white">{left}</div>
                <div className="mt-0.5 text-[11px] text-white/50 leading-relaxed">{right}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-2xl p-4">
          <div className="text-sm font-semibold text-white mb-2.5">Privacy First</div>
          <ul className="space-y-1.5 text-[13px] text-white/55">
            <li>• No accounts, no servers, no analytics, no cookies</li>
            <li>• Settings and progress stay only on your device</li>
            <li>• Certificate is generated locally via Canvas</li>
            <li>• One-click data reset available above</li>
          </ul>
        </div>

        <div className="pb-4 pt-2 text-center text-[11px] text-white/22">
          Made with ⌨️ and 🎯 — TypeFlow
        </div>
      </div>
    </div>
  );
}
