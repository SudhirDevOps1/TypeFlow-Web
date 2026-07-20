import { useState, useEffect, useCallback, useRef } from "react";
import { Sound } from "../lib/sound";
import { useGameStore } from "../store/gameStore";

export type CharState = "pending" | "correct" | "error" | "current";

export type TypingStats = {
  wpm: number;
  rawWpm: number;
  accuracy: number;
  errors: number;
  correct: number;
  keystrokes: number;
  combo: number;
  maxCombo: number;
  progress: number; // 0-1
};

export type TypingResult = {
  wpm: number;
  rawWpm: number;
  accuracy: number;
  errors: number;
  correct: number;
  timeTaken: number; // seconds
  score: number;
  combo: number;
};

interface Options {
  text: string;
  onComplete?: (result: TypingResult) => void;
  onCharTyped?: (ch: string, correct: boolean) => void;
  timeLimit?: number; // seconds, 0 = no limit
  soundEnabled?: boolean;
}

export function useTypingEngine({ text, onComplete, onCharTyped, timeLimit = 0, soundEnabled = true }: Options) {
  const [typed, setTyped] = useState<string>("");
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [endedAt, setEndedAt] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(timeLimit);
  const [lastKey, setLastKey] = useState<string>("");
  const [lastErrorKey, setLastErrorKey] = useState<string>("");

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;
  const onCharTypedRef = useRef(onCharTyped);
  onCharTypedRef.current = onCharTyped;

  const charStates = useCallback((): CharState[] => {
    return text.split("").map((ch, i) => {
      if (i >= typed.length) return i === typed.length ? "current" : "pending";
      return typed[i] === ch ? "correct" : "error";
    });
  }, [text, typed]);

  const stats = useCallback((): TypingStats => {
    const elapsed = startedAt ? (endedAt ?? Date.now()) - startedAt : 0;
    const minutes = Math.max(elapsed / 60000, 1 / 600);
    const correctChars = typed.split("").filter((c, i) => c === text[i]).length;
    const errors = typed.split("").filter((c, i) => c !== text[i]).length;
    const wpm = Math.round(correctChars / 5 / minutes);
    const rawWpm = Math.round(typed.length / 5 / minutes);
    const accuracy = typed.length === 0 ? 100 : Math.round((correctChars / typed.length) * 100);
    const combo = (() => {
      let c = 0;
      for (let i = typed.length - 1; i >= 0; i--) {
        if (typed[i] === text[i]) c++;
        else break;
      }
      return c;
    })();

    return {
      wpm: isFinite(wpm) ? wpm : 0,
      rawWpm: isFinite(rawWpm) ? rawWpm : 0,
      accuracy,
      errors,
      correct: correctChars,
      keystrokes: typed.length,
      combo,
      maxCombo: 0, // tracked externally
      progress: Math.min(typed.length / text.length, 1),
    };
  }, [typed, text, startedAt, endedAt]);

  const buildResult = useCallback((): TypingResult => {
    const s = stats();
    const elapsed = startedAt ? (endedAt ?? Date.now()) - startedAt : 1000;
    const timeTaken = elapsed / 1000;
    const score = Math.round(s.wpm * (s.accuracy / 100) * 10 + s.correct * 2);
    return { ...s, timeTaken, score, combo: s.combo };
  }, [stats, startedAt, endedAt]);

  const complete = useCallback(() => {
    if (endedAt) return;
    const now = Date.now();
    setEndedAt(now);
    if (timerRef.current) clearInterval(timerRef.current);
    const result = buildResult();
    setTimeout(() => onCompleteRef.current?.(result), 50);
  }, [endedAt, buildResult]);

  // Timer countdown
  useEffect(() => {
    if (!startedAt || endedAt || !timeLimit) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          complete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [startedAt, endedAt, timeLimit, complete]);

  const typeChar = useCallback((ch: string) => {
    if (endedAt) return;
    if (!startedAt) setStartedAt(Date.now());

    setTyped((prev) => {
      if (prev.length >= text.length) return prev;
      const idx = prev.length;
      const expected = text[idx];
      const correct = ch === expected;
      useGameStore.getState().updateKeyStat(expected, correct);

      if (correct) {
        if (soundEnabled) Sound.keyCorrect();
        setLastKey(ch);
        onCharTypedRef.current?.(ch, true);
      } else {
        if (soundEnabled) Sound.keyError();
        setLastErrorKey(ch);
        onCharTypedRef.current?.(ch, false);
      }

      const next = prev + ch;
      if (next.length >= text.length) {
        setTimeout(complete, 30);
      }
      return next;
    });
  }, [endedAt, startedAt, text, soundEnabled, complete]);

  const backspace = useCallback(() => {
    if (endedAt) return;
    setTyped((prev) => prev.slice(0, -1));
  }, [endedAt]);

  const reset = useCallback(() => {
    setTyped("");
    setStartedAt(null);
    setEndedAt(null);
    setTimeLeft(timeLimit);
    setLastKey("");
    setLastErrorKey("");
    if (timerRef.current) clearInterval(timerRef.current);
  }, [timeLimit]);

  const isFinished = !!endedAt;
  const isStarted = !!startedAt;
  const currentIndex = typed.length;
  const currentExpected = text[currentIndex] || "";

  return {
    typed, charStates, stats, typeChar, backspace, reset,
    isFinished, isStarted, timeLeft, lastKey, lastErrorKey,
    currentExpected, currentIndex, buildResult,
  };
}
