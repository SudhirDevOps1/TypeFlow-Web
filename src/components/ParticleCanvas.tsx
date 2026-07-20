import { useEffect, useRef, useCallback } from "react";

type Particle = {
  x: number; y: number;
  vx: number; vy: number;
  life: number; maxLife: number;
  size: number;
  hue: number; sat: number; lit: number;
  type: "spark" | "ring" | "text";
  text?: string;
};

let particles: Particle[] = [];
let animFrame: number | null = null;

function addParticles(x: number, y: number, hue: number, count: number) {
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 60 + Math.random() * 200;
    particles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 80,
      life: 0.5 + Math.random() * 0.6,
      maxLife: 1.1,
      size: 2 + Math.random() * 5,
      hue, sat: 90, lit: 60 + Math.random() * 20,
      type: "spark",
    });
  }
}

function addRing(x: number, y: number, hue: number) {
  particles.push({
    x, y, vx: 0, vy: 0,
    life: 0.5, maxLife: 0.5,
    size: 10, hue, sat: 90, lit: 65,
    type: "ring",
  });
}

function addFloat(x: number, y: number, text: string, hue: number) {
  particles.push({
    x, y, vx: (Math.random() - 0.5) * 30, vy: -90 - Math.random() * 60,
    life: 1.2, maxLife: 1.2,
    size: 18, hue, sat: 90, lit: 65,
    type: "text", text,
  });
}

export const Particles = {
  burst: (x: number, y: number, hue = 168, count = 20) => {
    addParticles(x, y, hue, count);
    addRing(x, y, hue);
  },
  float: (x: number, y: number, text: string, hue = 168) => {
    addFloat(x, y, text, hue);
  },
  wordComplete: (x: number, y: number, score: string) => {
    addParticles(x, y, 168, 25);
    addRing(x, y, 168);
    addFloat(x, y - 20, score, 45);
  },
  combo: (x: number, y: number, combo: number) => {
    const hue = [168, 265, 45, 320][Math.floor(combo / 5) % 4];
    addParticles(x, y, hue, 35);
    addRing(x, y, hue);
    addFloat(x, y - 30, `COMBO ×${combo}!`, hue);
  },
  error: (x: number, y: number) => {
    addParticles(x, y, 0, 8);
  },
};

export function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastTime = useRef<number>(0);

  const render = useCallback((now: number) => {
    const canvas = canvasRef.current;
    if (!canvas) { animFrame = requestAnimationFrame(render); return; }
    const ctx = canvas.getContext("2d");
    if (!ctx) { animFrame = requestAnimationFrame(render); return; }

    const dt = Math.min((now - lastTime.current) / 1000, 0.05);
    lastTime.current = now;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles = particles.filter((p) => {
      p.life -= dt;
      if (p.life <= 0) return false;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 200 * dt; // gravity

      const alpha = p.life / p.maxLife;

      if (p.type === "spark") {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue},${p.sat}%,${p.lit}%,${alpha})`;
        ctx.shadowColor = `hsla(${p.hue},${p.sat}%,${p.lit}%,0.9)`;
        ctx.shadowBlur = p.size * 3;
        ctx.fill();
        ctx.shadowBlur = 0;
      } else if (p.type === "ring") {
        const radius = p.size + (1 - alpha) * 80;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(${p.hue},${p.sat}%,${p.lit}%,${alpha * 0.7})`;
        ctx.lineWidth = 2;
        ctx.shadowColor = `hsla(${p.hue},${p.sat}%,${p.lit}%,0.8)`;
        ctx.shadowBlur = 10;
        ctx.stroke();
        ctx.shadowBlur = 0;
      } else if (p.type === "text" && p.text) {
        ctx.font = `bold ${p.size}px 'Orbitron', sans-serif`;
        ctx.fillStyle = `hsla(${p.hue},${p.sat}%,${p.lit}%,${alpha})`;
        ctx.shadowColor = `hsla(${p.hue},${p.sat}%,${p.lit}%,0.9)`;
        ctx.shadowBlur = 12;
        ctx.textAlign = "center";
        ctx.fillText(p.text, p.x, p.y);
        ctx.shadowBlur = 0;
      }
      return true;
    });

    animFrame = requestAnimationFrame(render);
  }, []);

  useEffect(() => {
    // store ref
    const resize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    resize();
    window.addEventListener("resize", resize);
    animFrame = requestAnimationFrame(render);
    return () => {
      window.removeEventListener("resize", resize);
      if (animFrame) cancelAnimationFrame(animFrame);
    };
  }, [render]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[999]"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
