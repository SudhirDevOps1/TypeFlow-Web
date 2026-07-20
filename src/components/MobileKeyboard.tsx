import { useState, useCallback } from "react";

const ROWS = [
  ["q","w","e","r","t","y","u","i","o","p"],
  ["a","s","d","f","g","h","j","k","l"],
  ["⇧","z","x","c","v","b","n","m","⌫"],
  ["123","space","↵"],
];

interface Props {
  onKey: (ch: string) => void;
  onBackspace: () => void;
}

export function MobileKeyboard({ onKey, onBackspace }: Props) {
  const [upper, setUpper] = useState(false);
  const [numMode, setNumMode] = useState(false);

  const press = useCallback((key: string) => {
    if (key === "⇧") { setUpper(u => !u); return; }
    if (key === "⌫") { onBackspace(); return; }
    if (key === "123") { setNumMode(n => !n); return; }
    if (key === "space") { onKey(" "); setUpper(false); return; }
    if (key === "↵") { onKey("\n"); return; }
    const ch = upper ? key.toUpperCase() : key;
    onKey(ch);
    if (upper) setUpper(false);
  }, [onKey, onBackspace, upper]);

  const NUM_ROWS = [
    ["1","2","3","4","5","6","7","8","9","0"],
    ["-","/",":",";","(",")","$","&","@","\""],
    [".",",","?","!","'","⌫"],
    ["ABC","space","↵"],
  ];

  const rows = numMode ? NUM_ROWS : ROWS;

  return (
    <div className="w-full px-1 pb-2 pt-1 space-y-1.5 select-none">
      {rows.map((row, ri) => (
        <div key={ri} className={`flex gap-1 justify-center ${ri === 1 ? "mx-3" : ""}`}>
          {row.map((key) => {
            const isSpecial = ["⇧","⌫","123","ABC","space","↵"].includes(key);
            const isSpace = key === "space";
            const isShiftActive = key === "⇧" && upper;
            return (
              <button
                key={key}
                onPointerDown={(e) => {
                  e.preventDefault();
                  press(key === "ABC" ? "123" : key);
                }}
                className={`
                  key-cap rounded-lg flex items-center justify-center font-mono-code font-bold
                  text-sm text-white/90 transition-all
                  ${isSpace ? "flex-[4]" : isSpecial ? "flex-[1.5]" : "flex-1"}
                  ${ri === 3 ? "py-3.5" : "py-3"}
                  ${isShiftActive ? "bg-[#00f5c4]/30 border-[#00f5c4]/60" : ""}
                `}
                style={{ touchAction: "manipulation", minWidth: isSpace ? 80 : 28 }}
              >
                {isSpace ? "SPACE" : key === "⇧" ? (upper ? "⬆" : "⇧") : key}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
