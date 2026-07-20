import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { getKeyboardRows, KEYBOARD_THEMES, type KeyDef } from "../data/keyboardLayouts";
import type { KeyboardLayout, KeyboardModel, KeyboardTheme } from "../store/gameStore";

interface Props {
  layout: KeyboardLayout;
  theme: KeyboardTheme;
  glowWave?: boolean;
  onKeyPress?: (code: string) => void;
  scale?: number;
  /** Listen to physical keyboard globally. Off for decorative instances. */
  captureKeys?: boolean;
  model?: KeyboardModel;
  activeCode?: string;
  hintCode?: string;
  errorCode?: string;
}

type WaveStyle = { color?: string; textColor?: string; textShadow?: string; boxShadow?: string; z: string };

export function InteractiveKeyboard({
  layout,
  theme,
  glowWave = true,
  onKeyPress,
  scale = 1,
  captureKeys = true,
  model = "wave",
  activeCode,
  hintCode,
  errorCode,
}: Props) {
  const rows = useMemo(() => getKeyboardRows(layout), [layout]);
  const themeCfg = KEYBOARD_THEMES[theme];

  // Flat ordered list of key codes for wave propagation
  const flatKeys = useMemo(() => rows.flat().map((k) => k.code), [rows]);

  const [pressed, setPressed] = useState<Set<string>>(new Set());
  const [waves, setWaves] = useState<Record<string, WaveStyle>>({});
  const keyRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  // Ripple wave outward from a pressed key (both directions)
  const triggerWave = useCallback((code: string) => {
    if (!glowWave) return;
    const idx = flatKeys.indexOf(code);
    if (idx === -1) return;

    const hue = themeCfg.hues[Math.floor(Math.random() * themeCfg.hues.length)];
    const color = `hsla(${hue}, 100%, 55%, 0.55)`;
    const textColor = `hsl(${hue}, 100%, 65%)`;
    const textShadow = `0 0 0.6em ${color}, 0 0 1.4em ${color}, 0 0 3em ${color}`;
    const boxShadow = `-2px 2px 6px ${color}, 2px -2px 6px ${color}, 2px 2px 6px ${color}, -2px -2px 6px ${color}, 0 0 14px ${color}`;
    const styleObj: WaveStyle = { color, textColor, textShadow, boxShadow, z: color };

    const right = flatKeys.slice(idx);
    const left = flatKeys.slice(0, idx).reverse();

    const apply = (keys: string[]) => {
      keys.forEach((kc, i) => {
        const t = setTimeout(() => {
          setWaves((prev) => ({ ...prev, [kc]: styleObj }));
          const clear = setTimeout(() => {
            setWaves((prev) => {
              const n = { ...prev };
              delete n[kc];
              return n;
            });
          }, 380);
          timers.current.push(clear);
        }, i * 28);
        timers.current.push(t);
      });
    };
    apply(right);
    apply(left);
  }, [flatKeys, glowWave, themeCfg.hues]);

  const doPress = useCallback((code: string, fromKeyboard = false) => {
    setPressed((p) => new Set(p).add(code));
    triggerWave(code);
    if (!fromKeyboard) onKeyPress?.(code);
  }, [triggerWave, onKeyPress]);

  const doRelease = useCallback((code: string) => {
    setPressed((p) => {
      const n = new Set(p);
      n.delete(code);
      return n;
    });
  }, []);

  // Physical keyboard listeners
  useEffect(() => {
    if (!captureKeys) return;
    const codeFromEvent = (e: KeyboardEvent) => {
      const c = e.code.toLowerCase();
      if (flatKeys.includes(c)) return c;
      const k = e.key.toLowerCase();
      if (flatKeys.includes(k)) return k;
      return null;
    };
    const down = (e: KeyboardEvent) => {
      const c = codeFromEvent(e);
      if (c) { e.preventDefault(); doPress(c, true); onKeyPress?.(c); }
    };
    const up = (e: KeyboardEvent) => {
      const c = codeFromEvent(e);
      if (c) doRelease(c);
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      clearTimers();
    };
  }, [flatKeys, doPress, doRelease, onKeyPress, captureKeys]);

  // Intro wave on mount from the space key
  useEffect(() => {
    const t = setTimeout(() => triggerWave("space"), 400);
    return () => clearTimeout(t);
  }, [triggerWave]);

  // Ambient auto-waves for decorative (non-capturing) instances
  useEffect(() => {
    if (captureKeys || !glowWave) return;
    const interval = setInterval(() => {
      const rnd = flatKeys[Math.floor(Math.random() * flatKeys.length)];
      triggerWave(rnd);
    }, 2200);
    return () => clearInterval(interval);
  }, [captureKeys, glowWave, flatKeys, triggerWave]);

  const unit = 2.55 * scale; // rem per key unit

  const modelStyle = useMemo(() => {
    switch (model) {
      case "purpleCase":
        return {
          caseBg: "#463973",
          caseBorder: "#2e2640",
          keyBg: "linear-gradient(180deg,#463973,#382e59)",
          keyBorder: "#382e59",
          keyText: "#bbadd9",
          keyRadius: 0.12,
          caseRadius: 0.32,
          bottom: 0.5,
          tilt: "none",
          shadow: "0 24px 45px rgba(0,0,0,0.45), inset 0 3px 0 rgba(255,255,255,0.05)",
          caseBorderTop: 0.5,
          caseBorderSide: 0.62,
          caseBorderBottom: 0.95,
          keyBorderTop: 0.18,
          keyBorderSide: 0.3,
          keyBorderBottom: 0.48,
          press: "perspective(1200px) translateZ(-90px)",
        };
      case "rgbMech":
        return {
          caseBg: "#0b1018",
          caseBorder: "#06080d",
          keyBg: "linear-gradient(180deg,#232a36,#10151f 60%,#06080d)",
          keyBorder: "#303948",
          keyText: themeCfg.text,
          keyRadius: 0.34,
          caseRadius: 0.8,
          bottom: 0.42,
          tilt: "none",
          shadow: "0 34px 70px rgba(0,0,0,0.7), inset 0 0 28px rgba(0,245,196,0.04)",
        };
      case "glassMac":
        return {
          caseBg: "rgba(230,240,255,0.12)",
          caseBorder: "rgba(255,255,255,0.22)",
          keyBg: "linear-gradient(180deg,rgba(255,255,255,0.32),rgba(255,255,255,0.12))",
          keyBorder: "rgba(255,255,255,0.35)",
          keyText: "#eef5ff",
          keyRadius: 0.42,
          caseRadius: 1.1,
          bottom: 0.24,
          tilt: "none",
          shadow: "0 25px 60px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.18)",
        };
      case "neumorph":
        return {
          caseBg: "#1a2230",
          caseBorder: "#232f43",
          keyBg: "linear-gradient(145deg,#222d40,#151b28)",
          keyBorder: "#26344a",
          keyText: "#cbd5e1",
          keyRadius: 0.55,
          caseRadius: 1.4,
          bottom: 0.18,
          tilt: "none",
          shadow: "18px 18px 40px rgba(0,0,0,0.45), -10px -10px 28px rgba(255,255,255,0.04)",
        };
      case "isometric":
        return {
          caseBg: "#111827",
          caseBorder: "#05070b",
          keyBg: "linear-gradient(160deg,#2c3445,#111827 72%)",
          keyBorder: "#354052",
          keyText: themeCfg.text,
          keyRadius: 0.28,
          caseRadius: 0.6,
          bottom: 0.48,
          tilt: "perspective(1300px) rotateX(58deg) rotateZ(-7deg)",
          shadow: "-18px 34px 70px rgba(0,0,0,0.65), inset 0 0 30px rgba(255,255,255,0.03)",
        };
      default:
        return {
          caseBg: themeCfg.case,
          caseBorder: themeCfg.case,
          keyBg: themeCfg.keyBg,
          keyBorder: themeCfg.keyBorder,
          keyText: themeCfg.text,
          keyRadius: 0.38,
          caseRadius: 0.9,
          bottom: 0.28,
          tilt: "none",
          shadow: "0 30px 60px rgba(0,0,0,0.55), inset 0 2px 4px rgba(255,255,255,0.05)",
        };
    }
  }, [model, themeCfg]);

  return (
    <div
      className="inline-block rounded-2xl select-none"
      style={{
        background: modelStyle.caseBg,
        padding: `${0.9 * scale}rem`,
        borderStyle: "solid",
        borderColor: modelStyle.caseBorder,
        borderTopWidth: `${((modelStyle as any).caseBorderTop ?? 0.5) * scale}rem`,
        borderRightWidth: `${((modelStyle as any).caseBorderSide ?? 0.5) * scale}rem`,
        borderBottomWidth: `${((modelStyle as any).caseBorderBottom ?? 1.1) * scale}rem`,
        borderLeftWidth: `${((modelStyle as any).caseBorderSide ?? 0.5) * scale}rem`,
        borderRadius: `${modelStyle.caseRadius}rem`,
        boxShadow: modelStyle.shadow,
        transform: modelStyle.tilt,
        transformOrigin: "center",
      }}
    >
      {rows.map((row, ri) => (
        <div key={ri} className="flex" style={{ gap: `${0.4 * scale}rem`, marginBottom: ri < rows.length - 1 ? `${0.4 * scale}rem` : 0 }}>
          {row.map((key: KeyDef) => {
            const isPressed = pressed.has(key.code);
            const wave = waves[key.code];
            const isExternalActive = activeCode === key.code;
            const isHint = hintCode === key.code;
            const isError = errorCode === key.code;
            const w = key.w ?? 1;
            return (
              <div
                key={key.code}
                ref={(el) => { keyRefs.current[key.code] = el; }}
                onPointerDown={(e) => { e.preventDefault(); doPress(key.code); }}
                onPointerUp={() => doRelease(key.code)}
                onPointerLeave={() => isPressed && doRelease(key.code)}
                className="flex items-end justify-start rounded-md font-mono-code font-bold uppercase cursor-pointer"
                style={{
                  width: `${w * unit}rem`,
                  height: `${unit}rem`,
                  fontSize: `${0.62 * scale}rem`,
                  padding: `${0.3 * scale}rem`,
                  background: isError
                    ? "linear-gradient(180deg,rgba(239,68,68,0.55),rgba(127,29,29,0.65))"
                    : isHint
                      ? "linear-gradient(180deg,rgba(0,245,196,0.38),rgba(0,120,95,0.28))"
                      : modelStyle.keyBg,
                  color: isError ? "#fecaca" : wave?.textColor || modelStyle.keyText,
                  borderStyle: "solid",
                  borderColor: isError ? "rgba(239,68,68,0.85)" : isHint ? "rgba(0,245,196,0.85)" : model === "purpleCase" ? `${modelStyle.keyBorder} #2e2640 #2e2640 ${modelStyle.keyBorder}` : modelStyle.keyBorder,
                  borderTopWidth: `${(((modelStyle as any).keyBorderTop ?? 0.06) * scale).toFixed(2)}rem`,
                  borderRightWidth: `${(((modelStyle as any).keyBorderSide ?? 0.06) * scale).toFixed(2)}rem`,
                  borderBottomWidth: `${(((modelStyle as any).keyBorderBottom ?? modelStyle.bottom) * scale).toFixed(2)}rem`,
                  borderLeftWidth: `${(((modelStyle as any).keyBorderSide ?? 0.06) * scale).toFixed(2)}rem`,
                  borderRadius: `${modelStyle.keyRadius}rem`,
                  borderBottomColor: model === "purpleCase" ? "#2e2640" : "rgba(0,0,0,0.55)",
                  textShadow: wave?.textShadow || "0 1px 1px rgba(0,0,0,0.5)",
                  boxShadow: isError
                    ? "0 0 18px rgba(239,68,68,0.65), 0 3px 5px rgba(0,0,0,0.4)"
                    : isHint
                      ? "0 0 18px rgba(0,245,196,0.65), 0 3px 5px rgba(0,0,0,0.4)"
                      : wave?.boxShadow || (model === "neumorph" ? "5px 5px 12px rgba(0,0,0,0.45), -4px -4px 10px rgba(255,255,255,0.035)" : "0 3px 5px rgba(0,0,0,0.4)"),
                  transform: (isPressed || isExternalActive) ? ((modelStyle as any).press ?? "perspective(900px) translateZ(-24px) translateY(2px)") : "perspective(900px) translateZ(0)",
                  transition: "transform 60ms ease-out, box-shadow 120ms ease-out, color 120ms ease-out, text-shadow 120ms ease-out",
                  opacity: 0.98,
                }}
              >
                {key.label}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
