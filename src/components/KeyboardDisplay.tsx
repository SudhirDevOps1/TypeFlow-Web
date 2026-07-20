import { memo, useEffect, useState } from "react";

const ROWS = [
  ["1","2","3","4","5","6","7","8","9","0","-","="],
  ["q","w","e","r","t","y","u","i","o","p","[","]"],
  ["a","s","d","f","g","h","j","k","l",";","'"],
  ["z","x","c","v","b","n","m",",",".","/"],
];

const FINGER_COLORS: Record<string, string> = {
  // Left pinky
  "1":"#ef4444","q":"#ef4444","a":"#ef4444","z":"#ef4444",
  // Left ring
  "2":"#f97316","w":"#f97316","s":"#f97316","x":"#f97316",
  // Left middle
  "3":"#eab308","e":"#eab308","d":"#eab308","c":"#eab308",
  // Left index
  "4":"#22c55e","r":"#22c55e","f":"#22c55e","v":"#22c55e",
  "5":"#22c55e","t":"#22c55e","g":"#22c55e","b":"#22c55e",
  // Right index
  "6":"#3b82f6","y":"#3b82f6","h":"#3b82f6","n":"#3b82f6",
  "7":"#3b82f6","u":"#3b82f6","j":"#3b82f6","m":"#3b82f6",
  // Right middle
  "8":"#8b5cf6","i":"#8b5cf6","k":"#8b5cf6",",":"#8b5cf6",
  // Right ring
  "9":"#ec4899","o":"#ec4899","l":"#ec4899",".":"#ec4899",
  // Right pinky
  "0":"#14b8a6","p":"#14b8a6",";":"#14b8a6","/":"#14b8a6",
  "-":"#14b8a6","[":"#14b8a6","'":"#14b8a6",
  "=":"#06b6d4","]":"#06b6d4",
};

type KeyState = "idle" | "pressed" | "correct" | "error" | "hint";

interface Props {
  pressedKey?: string;
  errorKey?: string;
  hintKey?: string;
  showFingerColors?: boolean;
  compact?: boolean;
}

export const KeyboardDisplay = memo(function KeyboardDisplay({
  pressedKey, errorKey, hintKey, showFingerColors = true, compact = false
}: Props) {
  const [activeKeys, setActiveKeys] = useState<Record<string, KeyState>>({});

  useEffect(() => {
    if (pressedKey) {
      setActiveKeys(p => ({ ...p, [pressedKey]: "pressed" }));
      const t = setTimeout(() => setActiveKeys(p => {
        const n = { ...p };
        delete n[pressedKey!];
        return n;
      }), 150);
      return () => clearTimeout(t);
    }
  }, [pressedKey]);

  useEffect(() => {
    if (errorKey) {
      setActiveKeys(p => ({ ...p, [errorKey]: "error" }));
      const t = setTimeout(() => setActiveKeys(p => {
        const n = { ...p };
        delete n[errorKey!];
        return n;
      }), 300);
      return () => clearTimeout(t);
    }
  }, [errorKey]);

  const getKeyState = (k: string): KeyState => {
    if (activeKeys[k]) return activeKeys[k];
    if (hintKey === k) return "hint";
    return "idle";
  };

  const keyStyle = (k: string) => {
    const state = getKeyState(k);
    const color = showFingerColors ? FINGER_COLORS[k] || "#888" : "#555";
    const base = `${compact ? "h-7 text-[10px]" : "h-9 sm:h-10 text-[11px] sm:text-xs"} flex items-center justify-center rounded select-none transition-all duration-75 font-mono-code font-bold uppercase cursor-default`;
    const stateStyles = {
      idle: `key-cap`,
      pressed: `key-cap pressed`,
      correct: `key-cap pressed`,
      error: `key-cap error`,
      hint: `key-cap correct-hint`,
    }[state];

    return {
      className: `${base} ${stateStyles}`,
      style: state === "idle" && showFingerColors ? {
        borderTopColor: `${color}55`,
        boxShadow: `0 3px 8px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08), 0 0 0 1px ${color}22`,
      } : state === "hint" ? {
        boxShadow: `0 0 14px rgba(0,245,196,0.7), 0 0 4px rgba(0,245,196,0.9)`,
        borderColor: "rgba(0,245,196,0.9)",
      } : {}
    };
  };

  const WIDTHS = [
    [1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1],
  ];

  return (
    <div className={`w-full ${compact ? "max-w-xs" : "max-w-2xl"} mx-auto select-none`}>
      {ROWS.map((row, ri) => (
        <div key={ri} className={`flex gap-0.5 sm:gap-1 mb-0.5 sm:mb-1 ${ri===1?"ml-3 sm:ml-6":ri===2?"ml-6 sm:ml-12":ri===3?"ml-9 sm:ml-20":""}`}>
          {ri===2&&<div className={`${compact?"w-8":"w-10 sm:w-16"} h-9 sm:h-10 rounded key-cap flex items-center justify-center text-[9px] text-white/40`}>{compact?"":"Caps"}</div>}
          {row.map((k,ki)=>{
            const {className, style} = keyStyle(k);
            const w = WIDTHS[ri][ki];
            return (
              <div key={k} className={className} style={{
                ...style,
                flex: w,
                minWidth: compact ? 22 : 28,
              }}>{k}</div>
            );
          })}
          {ri===0&&<div className={`${compact?"w-12":"w-16 sm:w-20"} key-cap h-9 sm:h-10 rounded flex items-center justify-center text-[9px] text-white/40`}>{compact?"⌫":"Backspace"}</div>}
          {ri===2&&<div className={`${compact?"w-12":"w-14 sm:w-20"} key-cap h-9 sm:h-10 rounded flex items-center justify-center text-[9px] text-white/40`}>{compact?"↵":"Enter"}</div>}
          {ri===3&&<div className={`${compact?"w-10":"w-16 sm:w-24"} key-cap h-9 sm:h-10 rounded flex items-center justify-center text-[9px] text-white/40`}>{compact?"⇧":"Shift"}</div>}
        </div>
      ))}
      <div className={`flex gap-0.5 sm:gap-1`}>
        <div className={`${compact?"w-8 h-7":"w-12 h-9 sm:h-10"} key-cap rounded`}/>
        <div className={`${compact?"w-8 h-7":"w-12 h-9 sm:h-10"} key-cap rounded`}/>
        <div className={`flex-1 ${compact?"h-7":"h-9 sm:h-10"} key-cap rounded`}/>
        <div className={`${compact?"w-8 h-7":"w-12 h-9 sm:h-10"} key-cap rounded`}/>
        <div className={`${compact?"w-8 h-7":"w-12 h-9 sm:h-10"} key-cap rounded`}/>
      </div>

      {showFingerColors && !compact && (
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          {[
            {label:"Left Pinky",c:"#ef4444"},
            {label:"Left Ring",c:"#f97316"},
            {label:"Left Middle",c:"#eab308"},
            {label:"Left Index",c:"#22c55e"},
            {label:"Right Index",c:"#3b82f6"},
            {label:"Right Middle",c:"#8b5cf6"},
            {label:"Right Ring",c:"#ec4899"},
            {label:"Right Pinky",c:"#14b8a6"},
          ].map(({label,c})=>(
            <div key={label} className="flex items-center gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full" style={{background:c,boxShadow:`0 0 6px ${c}99`}}/>
              <span className="text-[10px] text-white/50">{label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});
