import { useState, type ReactNode } from "react";

interface Props {
  value: string;
  onChange: (v: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  icon?: ReactNode;
  buttonLabel?: string;
  maxLength?: number;
}

/**
 * Animated glowing prompt bar — rotating conic-gradient border
 * that intensifies on focus (AI-studio style).
 */
export function GlowBar({ value, onChange, onSubmit, placeholder, icon, buttonLabel, maxLength = 40 }: Props) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="relative w-full glow-bar-wrap" data-focused={focused}>
      {/* animated gradient ring */}
      <div className="glow-bar-ring" aria-hidden />
      <div
        className="relative flex items-center gap-3 rounded-2xl px-4 py-3"
        style={{
          background: "rgba(9,14,24,0.92)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {icon && <span className="text-lg text-white/50 shrink-0">{icon}</span>}
        <input
          value={value}
          maxLength={maxLength}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={(e) => e.key === "Enter" && onSubmit?.()}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-white placeholder-white/30 outline-none font-mono-code text-sm"
        />
        {buttonLabel && (
          <button
            onClick={onSubmit}
            className="shrink-0 rounded-xl px-4 py-1.5 text-xs font-bold"
            style={{ background: "linear-gradient(135deg,#00f5c4,#00c4a0)", color: "#070b14" }}
          >
            {buttonLabel}
          </button>
        )}
      </div>
    </div>
  );
}
