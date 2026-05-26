import { useEffect, useRef } from "react";

/**
 * Particle canvas that samples target SVG icons and morphs the same
 * particle pool between them when the `active` index changes.
 */

// Lucide-derived stroke SVGs (24×24 viewBox) — one per service.
// Stroke is filled wide so sampling reliably picks up the shape.
const ICONS: string[] = [
  // 0 — 3D: cube
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>`,
  // 1 — 2D: play / film strip
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="18" rx="2"/><path d="M7 3v18M17 3v18M2 8h5M2 16h5M17 8h5M17 16h5M7 12h10"/></svg>`,
  // 2 — Character: smiley face
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><circle cx="9" cy="9" r="0.8" fill="black"/><circle cx="15" cy="9" r="0.8" fill="black"/></svg>`,
  // 3 — Explainer: lightbulb
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7c.8.7 1 1.4 1 2.3v1h6v-1c0-.9.2-1.6 1-2.3A7 7 0 0 0 12 2z"/></svg>`,
  // 4 — VFX: sparkles
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 14 9l7 2-7 2-2 7-2-7-7-2 7-2z"/><path d="M19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z"/><path d="M5 3l.6 1.7L7.3 5.3l-1.7.6L5 7.6l-.6-1.7L2.7 5.3l1.7-.6z"/></svg>`,
];

const PALETTE = [
  "rgba(232, 57, 14, 0.95)",
  "rgba(255, 95, 40, 0.85)",
  "rgba(196, 154, 60, 0.92)",
  "rgba(218, 160, 110, 0.85)",
  "rgba(26, 26, 31, 0.92)",
  "rgba(60, 40, 30, 0.8)",
];

export function GrainMorph({ active }: { active: number }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef(active);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const DPR = Math.min(window.devicePixelRatio || 1, 2);

    type P = {
      hx: number;
      hy: number;
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      phase: number;
    };

    let particles: P[] = [];
    const shapes: { x: number; y: number }[][] = [];
    let raf = 0;
    let lastActive = -1;
    const start = performance.now();

    async function sampleIcon(svg: string, w: number, h: number) {
      return new Promise<{ x: number; y: number }[]>((resolve) => {
        const blob = new Blob([svg], { type: "image/svg+xml" });
        const url = URL.createObjectURL(blob);
        const img = new Image();
        img.onload = () => {
          const sample = document.createElement("canvas");
          const sctx = sample.getContext("2d")!;
          const target = Math.min(w, h) * 0.78;
          const scale = target / 24;
          const sw = Math.round(24 * scale);
          const sh = Math.round(24 * scale);
          sample.width = sw;
          sample.height = sh;
          sctx.drawImage(img, 0, 0, sw, sh);
          const data = sctx.getImageData(0, 0, sw, sh).data;
          const step = Math.max(2, Math.round(Math.min(sw, sh) / 90));
          const offX = (w - sw) / 2;
          const offY = (h - sh) / 2;
          const pts: { x: number; y: number }[] = [];
          for (let y = 0; y < sh; y += step) {
            for (let x = 0; x < sw; x += step) {
              const i = (y * sw + x) * 4;
              if (data[i + 3] > 60) {
                pts.push({
                  x: x + offX + (Math.random() - 0.5) * step * 0.6,
                  y: y + offY + (Math.random() - 0.5) * step * 0.6,
                });
              }
            }
          }
          URL.revokeObjectURL(url);
          resolve(pts);
        };
        img.src = url;
      });
    }

    async function buildShapes(w: number, h: number) {
      shapes.length = 0;
      for (const svg of ICONS) {
        // eslint-disable-next-line no-await-in-loop
        shapes.push(await sampleIcon(svg, w, h));
      }
      const maxLen = shapes.reduce((m, s) => Math.max(m, s.length), 0);
      // Build particle pool sized to longest shape
      particles = new Array(maxLen).fill(0).map(() => {
        const sx = Math.random() * w;
        const sy = Math.random() * h;
        return {
          hx: sx,
          hy: sy,
          x: sx + (Math.random() - 0.5) * 200,
          y: sy + (Math.random() - 0.5) * 200,
          vx: 0,
          vy: 0,
          size: 0.9 + Math.random() * 1.4,
          color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
          phase: Math.random() * Math.PI * 2,
        };
      });
      retarget(activeRef.current);
    }

    function retarget(idx: number) {
      const shape = shapes[idx];
      if (!shape || !particles.length) return;
      const w = canvas!.clientWidth;
      const h = canvas!.clientHeight;
      for (let i = 0; i < particles.length; i++) {
        if (i < shape.length) {
          particles[i].hx = shape[i].x;
          particles[i].hy = shape[i].y;
        } else {
          // Extra particles scatter off-shape
          const a = Math.random() * Math.PI * 2;
          const r = Math.min(w, h) * (0.4 + Math.random() * 0.5);
          particles[i].hx = w / 2 + Math.cos(a) * r;
          particles[i].hy = h / 2 + Math.sin(a) * r;
        }
      }
    }

    function resize() {
      const w = wrap!.clientWidth;
      const h = wrap!.clientHeight;
      canvas!.width = w * DPR;
      canvas!.height = h * DPR;
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;
      ctx!.setTransform(DPR, 0, 0, DPR, 0, 0);
      buildShapes(w, h);
    }

    function tick(now: number) {
      const w = canvas!.clientWidth;
      const h = canvas!.clientHeight;
      ctx!.clearRect(0, 0, w, h);

      if (activeRef.current !== lastActive) {
        retarget(activeRef.current);
        lastActive = activeRef.current;
      }

      const t = (now - start) / 1000;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const bob = Math.sin(t * 0.9 + p.phase) * 2.2;
        const sway = Math.cos(t * 0.7 + p.phase * 0.7) * 2;
        const tx = p.hx + sway;
        const ty = p.hy + bob;
        const dx = tx - p.x;
        const dy = ty - p.y;
        p.vx = (p.vx + dx * 0.06) * 0.78;
        p.vy = (p.vy + dy * 0.06) * 0.78;
        p.x += p.vx;
        p.y += p.vy;
        ctx!.beginPath();
        ctx!.fillStyle = p.color;
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx!.fill();
      }
      raf = requestAnimationFrame(tick);
    }

    resize();
    raf = requestAnimationFrame(tick);
    const onResize = () => resize();
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className="relative w-full aspect-square max-w-[420px] ml-auto"
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
