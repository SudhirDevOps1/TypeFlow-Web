import { useMemo, useState } from "react";
import { useGameStore } from "../store/gameStore";
import { AmbientBg } from "../components/AmbientBg";
import { GlowBar } from "../components/GlowBar";
import { CODE_SNIPPETS } from "../data/wordLists";

const LANGS = [
  { id: "ts", label: "TypeScript", color: "#3178C6" },
  { id: "py", label: "Python", color: "#f59e0b" },
  { id: "sql", label: "SQL", color: "#22c55e" },
  { id: "html", label: "HTML/CSS", color: "#ef4444" },
  { id: "bash", label: "Bash", color: "#8b5cf6" },
];

export function CodeLabScreen() {
  const { setScreen, setMode, updateSettings, settings } = useGameStore();
  const [query, setQuery] = useState("");
  const [lang, setLang] = useState("ts");

  const snippets = useMemo(() => CODE_SNIPPETS.filter((s) => s.toLowerCase().includes(query.toLowerCase())), [query]);

  const launchPractice = (snippet: string) => {
    updateSettings({ testConfig: { ...settings.testConfig, customText: snippet, includePunctuation: true, includeNumbers: true } });
    setMode("code");
    setScreen("game");
  };

  return (
    <div className="relative h-full overflow-hidden">
      <AmbientBg />
      <div className="relative z-10 flex h-full flex-col overflow-hidden">
        <div className="flex items-center gap-3 border-b border-white/5 px-4 py-4 sm:px-6">
          <button onClick={() => setScreen("home")} className="text-xl text-white/40 transition hover:text-white">←</button>
          <div className="flex-1">
            <div className="font-orbitron text-lg font-bold text-white">💻 Code Practice Lab</div>
            <div className="text-xs text-white/40">TypeScript · Python · SQL · HTML · Bash style drills</div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6">
          <div className="mx-auto max-w-5xl space-y-5">
            <GlowBar value={query} onChange={setQuery} placeholder="Search code snippets or topics…" icon="🧠" />

            <div className="flex flex-wrap gap-2">
              {LANGS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setLang(item.id)}
                  className="rounded-xl px-3 py-1.5 text-xs font-bold transition-all"
                  style={{
                    background: lang === item.id ? item.color : "rgba(255,255,255,0.05)",
                    color: lang === item.id ? "#081018" : "rgba(255,255,255,0.72)",
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="glass rounded-3xl p-5">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <div className="font-orbitron text-base font-bold text-white">Featured Snippets</div>
                    <div className="text-xs text-white/35">Click any snippet to launch instant code typing practice.</div>
                  </div>
                  <span className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] text-white/40">{snippets.length} items</span>
                </div>

                <div className="space-y-3">
                  {snippets.slice(0, 10).map((snippet, idx) => (
                    <button
                      key={idx}
                      onClick={() => launchPractice(snippet)}
                      className="w-full rounded-2xl border border-white/6 bg-black/25 p-4 text-left transition hover:border-[#00f5c4]/35 hover:bg-black/35"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <span className="font-orbitron text-xs font-bold text-[#00f5c4]">Snippet {idx + 1}</span>
                        <span className="text-[10px] text-white/30">Launch Practice ▶</span>
                      </div>
                      <pre className="overflow-x-auto whitespace-pre-wrap font-mono-code text-xs leading-6 text-white/75">{snippet}</pre>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="glass rounded-3xl p-5">
                  <div className="font-orbitron text-base font-bold text-white">Lab Benefits</div>
                  <div className="mt-3 grid gap-3 text-sm text-white/60">
                    <div className="rounded-2xl bg-black/20 p-3">• Real-world punctuation, brackets, quotes, and symbol muscle memory</div>
                    <div className="rounded-2xl bg-black/20 p-3">• Developer-focused syntax fluency for JS, TS, Python, SQL, Bash</div>
                    <div className="rounded-2xl bg-black/20 p-3">• Great for practicing coding interviews, pair-programming speed, and precision</div>
                  </div>
                </div>

                <div className="glass rounded-3xl p-5">
                  <div className="font-orbitron text-base font-bold text-white">Suggested Flows</div>
                  <div className="mt-3 space-y-2 text-sm text-white/55">
                    <div>1. Warm up in Sprint mode</div>
                    <div>2. Practice symbols in Academy levels 61-80</div>
                    <div>3. Use Code Lab for syntax-specific fluency</div>
                    <div>4. Review weak-key analyzer in Stats</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
