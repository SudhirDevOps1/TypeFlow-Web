import { memo, useEffect, useRef } from "react";
import type { CharState } from "../hooks/useTypingEngine";

interface Props {
  text: string;
  charStates: () => CharState[];
  currentIndex: number;
  fontSize?: "sm" | "md" | "lg";
  shake?: boolean;
  mode?: "paragraph" | "word" | "code";
}

export const TypingArea = memo(function TypingArea({ text, charStates, currentIndex, fontSize = "md", shake, mode = "paragraph" }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const states = charStates();

  const sizeClass = { sm: "text-base sm:text-lg", md: "text-lg sm:text-xl", lg: "text-xl sm:text-2xl" }[fontSize];
  const fontClass = mode === "code" ? "font-mono-code" : "font-sans";

  // Auto-scroll cursor into view
  useEffect(() => {
    cursorRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [currentIndex]);

  return (
    <div
      ref={containerRef}
      className={`relative rounded-2xl p-5 sm:p-8 ${shake ? "animate-shake" : ""}`}
      style={{
        background: "rgba(0,0,0,0.4)",
        border: "1px solid rgba(255,255,255,0.07)",
        boxShadow: "inset 0 2px 20px rgba(0,0,0,0.3)",
        maxHeight: mode === "paragraph" ? "12rem" : "auto",
        overflowY: "auto",
      }}
    >
      <p className={`${sizeClass} ${fontClass} leading-relaxed tracking-wide`} style={{ wordBreak: "break-word" }}>
        {text.split("").map((ch, i) => {
          const state = states[i] || "pending";
          const isCurrent = i === currentIndex;

          let colorClass = "";
          if (state === "correct") colorClass = "text-[#00f5c4]";
          else if (state === "error") colorClass = ch === " " ? "bg-red-500/40 text-white" : "text-red-400 bg-red-500/20 rounded";
          else if (state === "current") colorClass = "text-white";
          else colorClass = "text-white/25";

          return (
            <span key={i} className={`relative ${colorClass} transition-colors duration-75`}>
              {isCurrent && (
                <span
                  ref={cursorRef}
                  className="cursor-blink absolute -left-0.5 bottom-0 top-0 w-0.5 rounded-full bg-white"
                  style={{ boxShadow: "0 0 8px rgba(255,255,255,0.8)" }}
                />
              )}
              {ch === " " ? "\u00a0" : ch}
            </span>
          );
        })}
        {currentIndex >= text.length && (
          <span className="cursor-blink inline-block w-0.5 h-5 bg-[#00f5c4] rounded-full ml-0.5 align-middle" />
        )}
      </p>
    </div>
  );
});
