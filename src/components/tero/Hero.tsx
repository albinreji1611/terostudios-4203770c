import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import logoSrc from "@/assets/tero-mark.png";

/**
 * Particle/grain hero — thousands of warm grains fly in from random
 * positions and settle into the shape of the Tero Studios logo,
 * then breathe gently and react to the cursor. Inspired by propvr.ai.
 */
export function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [formed, setFormed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const DPR = Math.min(window.devicePixelRatio || 1, 2);

    type P = {
      // home (target) position in CSS px relative to canvas
      hx: number;
      hy: number;
      // current
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      // per-particle breathing offset
      phase: number;
    };

    let particles: P[] = [];
    let mouseX = -9999;
    let mouseY = -9999;
    let raf = 0;
    let formedAt = 0;
    const start = performance.now();

    const palette = [
      "rgba(232, 57, 14, 0.95)",   // vermillion
      "rgba(232, 57, 14, 0.7)",
      "rgba(196, 154, 60, 0.85)",  // amber
      "rgba(26, 26, 31, 0.9)",     // ink
      "rgba(26, 26, 31, 0.6)",
      "rgba(218, 160, 110, 0.75)", // sand
    ];

    function resize() {
      const w = wrap!.clientWidth;
      const h = wrap!.clientHeight;
      canvas!.width = w * DPR;
      canvas!.height = h * DPR;
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;
      ctx!.setTransform(DPR, 0, 0, DPR, 0, 0);
      buildParticles(w, h);
    }

    function buildParticles(w: number, h: number) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = logoSrc;
      img.onload = () => {
        // Off-screen sample canvas
        const sample = document.createElement("canvas");
        const sctx = sample.getContext("2d")!;

        // Fit the logo into ~62% of the smallest dimension
        const target = Math.min(w, h) * 0.62;
        const scale = target / Math.max(img.width, img.height);
        const sw = Math.round(img.width * scale);
        const sh = Math.round(img.height * scale);
        sample.width = sw;
        sample.height = sh;
        sctx.drawImage(img, 0, 0, sw, sh);
        const data = sctx.getImageData(0, 0, sw, sh).data;

        // Sample every Nth pixel for grain density
        const step = Math.max(2, Math.round(Math.min(sw, sh) / 180));
        const offsetX = (w - sw) / 2;
        const offsetY = (h - sh) / 2;

        const pts: { x: number; y: number; a: number }[] = [];
        for (let y = 0; y < sh; y += step) {
          for (let x = 0; x < sw; x += step) {
            const i = (y * sw + x) * 4;
            const a = data[i + 3];
            if (a > 80) {
              pts.push({ x: x + offsetX, y: y + offsetY, a });
            }
          }
        }

        particles = pts.map((pt) => {
          // Spawn from random outside-edge
          const side = Math.floor(Math.random() * 4);
          let sx = 0;
          let sy = 0;
          if (side === 0) { sx = Math.random() * w; sy = -40 - Math.random() * 200; }
          else if (side === 1) { sx = w + 40 + Math.random() * 200; sy = Math.random() * h; }
          else if (side === 2) { sx = Math.random() * w; sy = h + 40 + Math.random() * 200; }
          else { sx = -40 - Math.random() * 200; sy = Math.random() * h; }

          return {
            hx: pt.x,
            hy: pt.y,
            x: sx,
            y: sy,
            vx: 0,
            vy: 0,
            size: 0.6 + Math.random() * 1.8,
            color: palette[Math.floor(Math.random() * palette.length)],
            phase: Math.random() * Math.PI * 2,
          };
        });
      };
    }

    function tick(now: number) {
      const w = canvas!.clientWidth;
      const h = canvas!.clientHeight;
      ctx!.clearRect(0, 0, w, h);

      const t = (now - start) / 1000;
      const formProgress = Math.min(1, t / 2.2);

      let avgDist = 0;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Gentle breathing offset around home
        const bob = Math.sin(t * 0.9 + p.phase) * 2.4;
        const sway = Math.cos(t * 0.7 + p.phase * 0.7) * 2.0;
        const tx = p.hx + sway;
        const ty = p.hy + bob;

        // Spring toward target
        const dx = tx - p.x;
        const dy = ty - p.y;
        const stiffness = 0.055 + formProgress * 0.04;
        const damping = 0.78;
        p.vx = (p.vx + dx * stiffness) * damping;
        p.vy = (p.vy + dy * stiffness) * damping;

        // Cursor repulsion
        const mdx = p.x - mouseX;
        const mdy = p.y - mouseY;
        const md2 = mdx * mdx + mdy * mdy;
        const R = 110;
        if (md2 < R * R) {
          const d = Math.sqrt(md2) || 1;
          const force = (1 - d / R) * 6;
          p.vx += (mdx / d) * force;
          p.vy += (mdy / d) * force;
        }

        p.x += p.vx;
        p.y += p.vy;

        avgDist += Math.abs(dx) + Math.abs(dy);

        ctx!.beginPath();
        ctx!.fillStyle = p.color;
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx!.fill();
      }

      if (!formed && particles.length > 0) {
        const a = avgDist / particles.length;
        if (a < 3) {
          if (!formedAt) formedAt = now;
          if (now - formedAt > 400) setFormed(true);
        } else {
          formedAt = 0;
        }
      }

      raf = requestAnimationFrame(tick);
    }

    function onMove(e: MouseEvent) {
      const r = canvas!.getBoundingClientRect();
      mouseX = e.clientX - r.left;
      mouseY = e.clientY - r.top;
    }
    function onLeave() {
      mouseX = -9999;
      mouseY = -9999;
    }

    resize();
    raf = requestAnimationFrame(tick);
    window.addEventListener("resize", resize);
    wrap.addEventListener("mousemove", onMove);
    wrap.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      wrap.removeEventListener("mousemove", onMove);
      wrap.removeEventListener("mouseleave", onLeave);
    };
  }, [formed]);

  return (
    <section
      className="relative w-full overflow-hidden bg-cream"
      style={{ minHeight: "100vh" }}
    >
      {/* Editorial hairline grid */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute top-0 left-6 md:left-12 w-px h-full bg-ink/[0.06]" />
        <div className="absolute top-0 right-6 md:right-12 w-px h-full bg-ink/[0.06]" />
        <div className="absolute top-1/2 left-0 w-full h-px bg-ink/[0.06]" />
      </div>

      {/* Warm ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 55%, rgba(232,57,14,0.10) 0%, rgba(196,154,60,0.06) 35%, transparent 70%)",
        }}
      />

      {/* Particle stage */}
      <div ref={wrapRef} className="absolute inset-0 z-10">
        <canvas ref={canvasRef} className="block w-full h-full" />
      </div>

      {/* Foreground content */}
      <div className="relative z-20 mx-auto flex h-screen max-w-[1500px] flex-col px-6 md:px-12 pointer-events-none">
        {/* Top meta */}
        <div className="flex items-center justify-between pt-28">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink/55">
            Tero Studios — Est. 2014
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink/55">
            Bengaluru / IN
          </span>
        </div>

        {/* Center spacer (logo forms here in canvas) */}
        <div className="flex-1" />

        {/* Caption that appears once the grains have formed */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: formed ? 1 : 0, y: formed ? 0 : 12 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10 text-center"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-ink/55 mb-3">
            — A studio of moving things
          </p>
          <h1 className="font-display font-extrabold uppercase tracking-tighter leading-[0.9] text-ink text-[clamp(22px,3.4vw,46px)]">
            Stories{" "}
            <span className="italic font-normal lowercase font-body text-[0.7em] text-vermillion">
              that
            </span>{" "}
            move, frames{" "}
            <span className="italic font-normal lowercase font-body text-[0.7em] text-ink/70">
              that stay.
            </span>
          </h1>
        </motion.div>

        {/* Bottom actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: formed ? 1 : 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="flex items-center justify-between pb-10 pointer-events-auto"
        >
          <div className="flex gap-3">
            <Link
              to="/contact"
              className="px-7 py-3.5 bg-vermillion text-cream font-mono text-[11px] font-bold uppercase tracking-[0.2em] transition-colors hover:bg-ink"
            >
              Start a project
            </Link>
            <Link
              to="/portfolio"
              className="px-7 py-3.5 border border-ink/20 text-ink font-mono text-[11px] font-bold uppercase tracking-[0.2em] transition-all hover:bg-ink hover:text-cream"
            >
              See work
            </Link>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink/40">
            Scroll ↓
          </span>
        </motion.div>
      </div>
    </section>
  );
}
