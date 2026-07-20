import { useMemo } from "react";
import { useGameStore } from "../store/gameStore";
import { InteractiveKeyboard } from "./InteractiveKeyboard";
import { getCodeForChar } from "../data/keyboardLayouts";

type Props = {
  pressedKey?: string;
  errorKey?: string;
  hintKey?: string;
  compact?: boolean;
};

export function TypingKeyboard({ pressedKey, errorKey, hintKey, compact = true }: Props) {
  const settings = useGameStore((s) => s.settings);
  const layout = settings.keyboardLayout || "qwerty";
  const theme = settings.keyboardTheme || "aurora";
  const model = settings.keyboardModel || "wave";
  const scaleMult = settings.keyboardScale || 0.75;

  const activeCode = useMemo(() => getCodeForChar(layout, pressedKey || ""), [layout, pressedKey]);
  const errorCode = useMemo(() => getCodeForChar(layout, errorKey || ""), [layout, errorKey]);
  const hintCode = useMemo(
    () => (settings.keyboardHints ? getCodeForChar(layout, hintKey || "") : undefined),
    [layout, hintKey, settings.keyboardHints]
  );

  const baseScale = compact ? 0.65 : 0.85;
  const finalScale = Number((baseScale * scaleMult).toFixed(2));

  return (
    <div className="w-full overflow-x-auto pb-1 no-scrollbar">
      <div className="mx-auto flex justify-center py-1">
        <InteractiveKeyboard
          layout={layout}
          theme={theme}
          model={model}
          glowWave={settings.glowWave}
          captureKeys={false}
          activeCode={activeCode}
          errorCode={errorCode}
          hintCode={hintCode}
          scale={finalScale}
        />
      </div>
    </div>
  );
}
