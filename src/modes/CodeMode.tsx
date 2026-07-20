import { useEffect, useState } from "react";
import { useTypingEngine } from "../hooks/useTypingEngine";
import { TypingArea } from "../components/TypingArea";
import { StatsBar } from "../components/StatsBar";
import { TypingKeyboard } from "../components/TypingKeyboard";
import { Particles } from "../components/ParticleCanvas";
import { CODE_SNIPPETS } from "../data/wordLists";
import type { TypingResult } from "../hooks/useTypingEngine";
import { useGameStore } from "../store/gameStore";

export function CodeMode({ onComplete }: { onComplete: (r: TypingResult) => void }) {
  const settings = useGameStore((s) => s.settings);
  const customSnippet = settings.testConfig?.customText?.trim();
  const [snippetIdx, setSnippetIdx] = useState(() => Math.floor(Math.random() * CODE_SNIPPETS.length));
  const [text, setText] = useState(() => customSnippet || CODE_SNIPPETS[Math.floor(Math.random() * CODE_SNIPPETS.length)]);
  const [completed, setCompleted] = useState(0);

  const { charStates, stats, typeChar, backspace, reset, lastKey, lastErrorKey, currentExpected, currentIndex } = useTypingEngine({
    text,
    soundEnabled: settings.soundEnabled,
    onComplete: (r) => {
      if (customSnippet) {
        onComplete({ ...r, score: r.score * 2 });
        return;
      }
      const next = completed + 1;
      setCompleted(next);
      Particles.wordComplete(window.innerWidth / 2, window.innerHeight * 0.4, `✓ Line ${next}`);
      if (next >= 5) {
        onComplete({ ...r, score: r.score * next });
      } else {
        const nextIdx = (snippetIdx + 1) % CODE_SNIPPETS.length;
        setSnippetIdx(nextIdx);
        setText(CODE_SNIPPETS[nextIdx]);
        setTimeout(reset, 100);
      }
    },
    onCharTyped: (_, correct) => {
      if (!correct) Particles.error(window.innerWidth / 2, window.innerHeight * 0.45);
    },
  });

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.altKey || e.metaKey) return;
      e.preventDefault();
      if (e.key === "Backspace") {
        backspace();
        return;
      }
      if (e.key.length === 1) typeChar(e.key);
      else if (e.key === "Enter") typeChar("\n");
      else if (e.key === "Tab") typeChar("  ");
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [typeChar, backspace]);

  const s = stats();

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="text-center">
        <div className="font-orbitron text-lg font-bold text-yellow-400">💻 CODE SPRINT</div>
        <div className="text-xs text-white/40">{customSnippet ? "Custom code practice" : `Type 5 code snippets — snippet ${completed + 1}/5`}</div>
      </div>

      {!customSnippet && (
        <div className="flex gap-1.5 justify-center">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-1.5 flex-1 rounded-full max-w-[50px]" style={{ background: i < completed ? "#00f5c4" : i === completed ? "rgba(0,245,196,0.3)" : "rgba(255,255,255,0.08)" }} />
          ))}
        </div>
      )}

      <StatsBar stats={s} showExtras />
      <TypingArea text={text} charStates={charStates} currentIndex={currentIndex} mode="code" fontSize={settings.fontSize} />

      {settings.showKeyboard && (
        <div className="mt-auto">
          <TypingKeyboard pressedKey={lastKey} errorKey={lastErrorKey} hintKey={settings.keyboardHints ? currentExpected : undefined} compact />
        </div>
      )}
    </div>
  );
}
