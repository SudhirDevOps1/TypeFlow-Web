let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext || (window as any).webkitAudioContext;
    if (AC) ctx = new AC();
  }
  if (ctx?.state === "suspended") ctx.resume();
  return ctx;
}

function tone(freq: number, type: OscillatorType, vol: number, dur: number, slide = 0, delay = 0) {
  const c = getCtx();
  if (!c) return;
  const now = c.currentTime + delay;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);
  if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(30, freq + slide), now + dur);
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(vol, now + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);
  osc.connect(gain).connect(c.destination);
  osc.start(now);
  osc.stop(now + dur + 0.01);
}

let _muted = false;
export const Sound = {
  setMuted: (v: boolean) => { _muted = v; },
  isMuted: () => _muted,
  keyCorrect: () => {
    if (_muted) return;
    tone(600 + Math.random() * 200, "sine", 0.06, 0.04);
  },
  keyError: () => {
    if (_muted) return;
    tone(150, "sawtooth", 0.12, 0.1, -40);
  },
  wordComplete: (combo = 1) => {
    if (_muted) return;
    const base = 440 + Math.min(combo, 10) * 55;
    tone(base, "triangle", 0.1, 0.1, 200);
    tone(base * 1.5, "sine", 0.06, 0.08, 0, 0.05);
  },
  levelUp: () => {
    if (_muted) return;
    [523, 659, 784, 1047].forEach((f, i) => tone(f, "triangle", 0.1, 0.15, 0, i * 0.1));
  },
  gameStart: () => {
    if (_muted) return;
    [330, 440, 550, 660].forEach((f, i) => tone(f, "sine", 0.08, 0.1, 0, i * 0.07));
  },
  gameOver: () => {
    if (_muted) return;
    [523, 415, 330, 261].forEach((f, i) => tone(f, "triangle", 0.1, 0.25, -20, i * 0.18));
  },
  countdown: (n: number) => {
    if (_muted) return;
    tone(n === 0 ? 880 : 440, "sine", 0.12, 0.15, n === 0 ? 200 : 0);
  },
  damage: () => {
    if (_muted) return;
    tone(80, "sawtooth", 0.18, 0.3, -30);
  },
  lessonComplete: () => {
    if (_muted) return;
    [523,659,784,1047,1319].forEach((f,i)=>tone(f,"triangle",0.09,0.18,0,i*0.09));
  },
};
