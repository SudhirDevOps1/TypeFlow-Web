import { useGameStore } from "../store/gameStore";
import { AmbientBg } from "../components/AmbientBg";
import { InteractiveKeyboard } from "../components/InteractiveKeyboard";

const tips = [
  { title: "Posture", points: ["Sit upright with shoulders relaxed", "Elbows close to body", "Wrists floating lightly above desk"] },
  { title: "Eyes", points: ["Keep eyes on the screen, not the keyboard", "Preview the next word chunk", "Blink and breathe between lines"] },
  { title: "Finger Zones", points: ["Each finger owns a lane", "Return to home row after every reach", "Use both shift keys properly"] },
  { title: "Speed Philosophy", points: ["Accuracy first, speed later", "Smooth rhythm beats sudden bursts", "Practice small daily sessions consistently"] },
];

export function DojoScreen() {
  const { setScreen, settings } = useGameStore();

  return (
    <div className="relative h-full overflow-hidden">
      <AmbientBg />
      <div className="relative z-10 flex h-full flex-col overflow-hidden">
        <div className="flex items-center gap-3 border-b border-white/5 px-4 py-4 sm:px-6">
          <button onClick={() => setScreen("home")} className="text-xl text-white/40 transition hover:text-white">←</button>
          <div className="flex-1">
            <div className="font-orbitron text-lg font-bold text-white">🥋 Typing Dojo</div>
            <div className="text-xs text-white/40">Posture · Hand placement · Finger zones · Live key explorer</div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6">
          <div className="mx-auto max-w-6xl space-y-5">
            <div className="grid gap-4 lg:grid-cols-[1fr_1.1fr]">
              <div className="space-y-4">
                {tips.map((tip) => (
                  <div key={tip.title} className="glass rounded-3xl p-5">
                    <div className="font-orbitron text-base font-bold text-white">{tip.title}</div>
                    <ul className="mt-3 space-y-2 text-sm text-white/60">
                      {tip.points.map((p) => (
                        <li key={p}>• {p}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="glass rounded-3xl p-5">
                <div className="mb-3">
                  <div className="font-orbitron text-base font-bold text-white">Live Key Explorer</div>
                  <div className="text-xs text-white/35">Use your selected layout, model, theme, and scale to build muscle memory visually.</div>
                </div>
                <div className="overflow-x-auto pb-2">
                  <div className="mx-auto flex justify-center py-3">
                    <InteractiveKeyboard
                      layout={settings.keyboardLayout}
                      theme={settings.keyboardTheme}
                      model={settings.keyboardModel}
                      glowWave={settings.glowWave}
                      scale={Math.max(0.65, settings.keyboardScale)}
                    />
                  </div>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2 text-sm text-white/60">
                  <div className="rounded-2xl bg-black/20 p-4">🟢 <strong className="text-white">Green keys</strong> and colored zones help finger mapping and reduce hunting.</div>
                  <div className="rounded-2xl bg-black/20 p-4">🔁 <strong className="text-white">Return to home row</strong> after each reach — this resets hand position and improves consistency.</div>
                  <div className="rounded-2xl bg-black/20 p-4">⚡ <strong className="text-white">Glide, don’t slam</strong> — light keystrokes reduce fatigue over long sessions.</div>
                  <div className="rounded-2xl bg-black/20 p-4">🎯 <strong className="text-white">Chunk words</strong> into groups, not letters. Your eyes should lead your hands.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
