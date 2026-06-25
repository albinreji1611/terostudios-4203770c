import { useEffect, useRef } from "react";

/**
 * Particle canvas that samples target SVG icons and morphs the same
 * particle pool between them when the `active` index changes.
 */

// Lucide-derived stroke SVGs (24×24 viewBox) — one per service.
// Stroke is filled wide so sampling reliably picks up the shape.
const ICONS: string[] = [
  // 0 — Brand Storytelling: monitor with play + megaphone
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><rect x="1.5" y="5" width="15" height="11" rx="1.2"/><path d="M7 19h4M9 16v3"/><circle cx="8.5" cy="10.5" r="2.6"/><path d="M7.6 9.4l2.4 1.1-2.4 1.1z" fill="black" stroke="none"/><path d="M16.5 8.5l4 -2v8l-4 -2z"/><path d="M21.6 7.5c.6 1 .6 3 0 4M22.6 6.5c1 1.6 1 5 0 6.6"/></svg>`,
  // 1 — Anamorphic & DOOH: billboard on pole
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="4" width="19" height="9" rx="0.6"/><path d="M2.5 13h19l-1 2h-17z"/><path d="M11.4 15v6M12.6 15v6"/><path d="M8 21h8"/><path d="M5 2.5l1.5 1.5M9 2.5l1 1.5M13 2.5l1 1.5M17 2.5l1 1.5"/></svg>`,
  // 2 — Immersive XR Training: VR headset
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M10 3h4v2h-4z"/><path d="M3 9c0-1 .8-2 2-2h14c1.2 0 2 1 2 2v5c0 1.2-1 2-2 2h-3.5l-1.6-2a2 2 0 0 0-3.8 0L8.5 16H5c-1.2 0-2-.8-2-2z"/><circle cx="8.5" cy="12" r="1.8"/><circle cx="15.5" cy="12" r="1.8"/><path d="M2 18l1 1M22 18l-1 1M3.5 5.5l.8.8M20.5 5.5l-.8.8"/></svg>`,
  // 3 — PropViz: a clear house with roof, door, window
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/><path d="M9 11h2v2H9zM13 11h2v2h-2z"/></svg>`,
  // 4 — Event & Immersive Hardware: microphone + speaker
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="4.5" y="2.5" width="4.5" height="9" rx="2.25"/><path d="M3 10.5c0 2.5 1.8 4.5 3.75 4.5s3.75-2 3.75-4.5"/><path d="M6.75 15v3M5 18h3.5"/><rect x="13.5" y="3.5" width="7.5" height="17" rx="1.2"/><circle cx="17.25" cy="8.5" r="1.6"/><circle cx="17.25" cy="15" r="3"/><circle cx="17.25" cy="15" r="1"/></svg>`,
  // 5 — AI Content Creation: AI chip
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="5" width="14" height="14" rx="2"/><rect x="8" y="8" width="8" height="8" rx="1"/><text x="12" y="14.3" text-anchor="middle" font-family="Arial, sans-serif" font-weight="bold" font-size="5.2" fill="black" stroke="none">AI</text><path d="M9 2v3M12 2v3M15 2v3M9 19v3M12 19v3M15 19v3M2 9h3M2 12h3M2 15h3M19 9h3M19 12h3M19 15h3"/><circle cx="12" cy="3" r="0.9" fill="black" stroke="none"/><circle cx="12" cy="21" r="0.9" fill="black" stroke="none"/><circle cx="3" cy="12" r="0.9" fill="black" stroke="none"/><circle cx="21" cy="12" r="0.9" fill="black" stroke="none"/></svg>`,
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
        const bob = Math.sin(t * 0.45 + p.phase) * 1.1;
        const sway = Math.cos(t * 0.35 + p.phase * 0.7) * 1.0;
        const tx = p.hx + sway;
        const ty = p.hy + bob;
        const dx = tx - p.x;
        const dy = ty - p.y;
        p.vx = (p.vx + dx * 0.035) * 0.84;
        p.vy = (p.vy + dy * 0.035) * 0.84;
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
