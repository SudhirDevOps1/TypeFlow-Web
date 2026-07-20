import { useState } from "react";
import { useGameStore, type KeyboardLayout, type KeyboardTheme } from "../store/gameStore";
import { InteractiveKeyboard } from "../components/InteractiveKeyboard";
import { GlowBar } from "../components/GlowBar";
import { LAYOUT_INFO, KEYBOARD_MODELS, KEYBOARD_THEMES } from "../data/keyboardLayouts";
import { Sound } from "../lib/sound";

const LAYOUTS: KeyboardLayout[] = ["qwerty", "dvorak", "colemak", "azerty"];
const THEMES: KeyboardTheme[] = ["aurora", "sunset", "cyber", "mono", "candy"];
const MODELS = ["wave", "purpleCase", "rgbMech", "glassMac", "neumorph", "isometric"] as const;

export function KeyboardStudio() {
  const { setScreen, settings, updateSettings } = useGameStore();
  const [preview, setPreview] = useState("");
  const [keyLog, setKeyLog] = useState<string[]>([]);

  const layout = settings.keyboardLayout;
  const theme = settings.keyboardTheme;
  const model = settings.keyboardModel || "wave";
  const scale = settings.keyboardScale || 0.75;

  const handleKey = (code: string) => {
    if (settings.soundEnabled) Sound.keyCorrect();
    const clean = code.replace(/^key|^digit/, "").replace("space", "␣");
    setKeyLog((l) => [clean, ...l].slice(0, 24));
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-4 sm:px-6 border-b border-white/5">
        <button onClick={() => setScreen("home")} className="text-white/40 hover:text-white transition text-xl">
          ←
        </button>
        <div className="flex-1 min-w-0">
          <div className="font-orbitron text-lg font-bold text-white truncate">⌨️ Keyboard Studio</div>
          <div className="text-xs text-white/40 truncate">Custom layout, models, colors &amp; manual size scaling</div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 space-y-6">
        {/* Layout selector */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-white/40">Keyboard Layout</span>
            <div className="h-px flex-1 bg-white/5" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {LAYOUTS.map((l) => {
              const info = LAYOUT_INFO[l];
              const active = layout === l;
              return (
                <button
                  key={l}
                  onClick={() => updateSettings({ keyboardLayout: l })}
                  className="mode-card glass text-left rounded-2xl p-3 transition-all"
                  style={{
                    border: active ? "1px solid rgba(0,245,196,0.8)" : "1px solid rgba(255,255,255,0.06)",
                    boxShadow: active ? "0 0 26px rgba(0,245,196,0.18)" : undefined,
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{info.flag}</span>
                    <span className="font-orbitron text-sm font-bold text-white">{info.name}</span>
                    {active && <span className="ml-auto text-[#00f5c4] text-xs">●</span>}
                  </div>
                  <p className="text-[11px] text-white/40 leading-snug">{info.desc}</p>
                </button>
              );
            })}
          </div>
        </section>

        {/* Keyboard model selector */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-white/40">Keyboard Model &amp; Style</span>
            <div className="h-px flex-1 bg-white/5" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {MODELS.map((m) => {
              const cfg = KEYBOARD_MODELS[m];
              const active = model === m;
              return (
                <button
                  key={m}
                  onClick={() => updateSettings({ keyboardModel: m })}
                  className="glass rounded-2xl p-3 text-left transition-all hover:scale-[1.02]"
                  style={{
                    border: active ? "1px solid rgba(0,245,196,0.75)" : "1px solid rgba(255,255,255,0.06)",
                    boxShadow: active ? "0 0 24px rgba(0,245,196,0.18)" : undefined,
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{cfg.icon}</span>
                    <span className="font-orbitron text-xs font-bold text-white">{cfg.name}</span>
                    {active && <span className="ml-auto text-[#00f5c4] text-xs">●</span>}
                  </div>
                  <div className="text-[11px] text-white/40 leading-snug">{cfg.desc}</div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Keyboard Size / Scale Controls */}
        <section className="glass rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-bold text-white">Keyboard Size &amp; Scale Control</div>
              <div className="text-[11px] text-white/40">Adjust virtual keyboard dimensions (Bada / Chhota)</div>
            </div>
            <div className="font-orbitron font-bold text-[#00f5c4] text-sm">{Math.round(scale * 100)}%</div>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="0.4"
              max="1.3"
              step="0.05"
              value={scale}
              onChange={(e) => updateSettings({ keyboardScale: parseFloat(e.target.value) })}
              className="flex-1 accent-[#00f5c4] cursor-pointer h-2 bg-white/10 rounded-lg"
            />
          </div>
          <div className="flex gap-2 pt-1">
            {[
              { label: "Compact (50%)", val: 0.5 },
              { label: "Medium (75%)", val: 0.75 },
              { label: "Large (100%)", val: 1.0 },
              { label: "XL (120%)", val: 1.2 },
            ].map((preset) => (
              <button
                key={preset.label}
                onClick={() => updateSettings({ keyboardScale: preset.val })}
                className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  Math.abs(scale - preset.val) < 0.04
                    ? "bg-[#00f5c4] text-[#070b14]"
                    : "glass text-white/60 hover:text-white"
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </section>

        {/* Theme selector */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-white/40">Keycap Color Theme</span>
            <div className="h-px flex-1 bg-white/5" />
          </div>
          <div className="flex flex-wrap gap-3">
            {THEMES.map((t) => {
              const cfg = KEYBOARD_THEMES[t];
              const active = theme === t;
              return (
                <button
                  key={t}
                  onClick={() => updateSettings({ keyboardTheme: t })}
                  className="rounded-xl px-3 py-2.5 flex items-center gap-2.5 transition-all"
                  style={{
                    background: cfg.case,
                    border: active ? "1px solid rgba(0,245,196,0.8)" : "1px solid rgba(255,255,255,0.08)",
                    boxShadow: active ? "0 0 20px rgba(0,245,196,0.2)" : undefined,
                  }}
                >
                  <div className="flex gap-1">
                    {cfg.hues.map((h) => (
                      <span key={h} className="w-3 h-3 rounded-full" style={{ background: `hsl(${h},90%,55%)`, boxShadow: `0 0 6px hsl(${h},90%,55%)` }} />
                    ))}
                  </div>
                  <span className="text-xs font-bold" style={{ color: cfg.text }}>{cfg.name}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Glow toggle + try bar */}
        <section className="flex flex-col sm:flex-row gap-3 items-stretch">
          <button
            onClick={() => updateSettings({ glowWave: !settings.glowWave })}
            className="glass rounded-2xl px-4 py-3 flex items-center gap-3 justify-between sm:w-56"
          >
            <div className="text-left">
              <div className="text-sm font-bold text-white">Glow Wave</div>
              <div className="text-[10px] text-white/40">Ripple animation on keypress</div>
            </div>
            <div className="toggle" data-on={settings.glowWave} />
          </button>
          <div className="flex-1">
            <GlowBar
              value={preview}
              onChange={setPreview}
              placeholder="Type here to test your keyboard…"
              icon="✨"
            />
          </div>
        </section>

        {/* THE interactive keyboard */}
        <section className="flex flex-col items-center">
          <div className="w-full overflow-x-auto pb-2 flex justify-center no-scrollbar">
            <div className="py-4 flex justify-center">
              <InteractiveKeyboard
                layout={layout}
                theme={theme}
                model={model}
                glowWave={settings.glowWave}
                onKeyPress={handleKey}
                scale={scale}
              />
            </div>
          </div>
          <p className="text-[11px] text-white/30 mt-2">
            Press any physical key or tap the keys above — watch the light ripple across the board.
          </p>
        </section>

        {/* Key log */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-white/40">Live Keystrokes</span>
            <div className="h-px flex-1 bg-white/5" />
          </div>
          <div className="glass rounded-2xl p-3 min-h-[52px] flex flex-wrap gap-1.5 items-center">
            {keyLog.length === 0 && <span className="text-xs text-white/25">Your keystrokes will appear here…</span>}
            {keyLog.map((k, i) => (
              <span
                key={i}
                className="key-cap inline-flex items-center justify-center rounded px-2 h-7 min-w-7 text-[11px] font-mono-code font-bold text-white/80"
                style={{ opacity: 1 - i * 0.03 }}
              >
                {k}
              </span>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
