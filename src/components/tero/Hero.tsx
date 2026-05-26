import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import logoSrc from "@/assets/tero-mark.png";

/**
 * Particle/grain hero — chunky warm grains fly in from random
 * positions and settle into the shape of the Tero Studios logo,
 * then breathe gently and react to the cursor.
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
      hx: number;
      hy: number;
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      baseSize: number;
      color: string;
      phase: number;
      glow: number;
    };

    let particles: P[] = [];
    let mouseX = -9999;
    let mouseY = -9999;
    let raf = 0;
    let formedAt = 0;
    const start = performance.now();

    const palette = [
      "rgba(232, 57, 14, 0.95)",   // vermillion
      "rgba(255, 95, 40, 0.85)",   // bright vermillion
      "rgba(196, 154, 60, 0.9)",   // amber
      "rgba(218, 160, 110, 0.85)", // sand
      "rgba(26, 26, 31, 0.92)",    // ink
      "rgba(60, 40, 30, 0.8)",     // espresso
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
        const sample = document.createElement("canvas");
        const sctx = sample.getContext("2d")!;

        // Crop source to the "TERO" portion only (omit "STUDIOS")
        const cropW = Math.round(img.width * 0.62);
        const cropH = img.height;

        const target = Math.min(w * 0.7, h * 0.55);
        const scale = target / Math.max(cropW, cropH);
        const sw = Math.round(cropW * scale);
        const sh = Math.round(cropH * scale);
        sample.width = sw;
        sample.height = sh;
        sctx.drawImage(img, 0, 0, cropW, cropH, 0, 0, sw, sh);
        const data = sctx.getImageData(0, 0, sw, sh).data;

        const step = Math.max(2, Math.round(Math.min(sw, sh) / 180));
        const offsetX = (w - sw) / 2;
        const offsetY = (h - sh) / 2;

        const pts: { x: number; y: number }[] = [];
        for (let y = 0; y < sh; y += step) {
          for (let x = 0; x < sw; x += step) {
            const i = (y * sw + x) * 4;
            const a = data[i + 3];
            if (a > 40) {
              pts.push({
                x: x + offsetX + (Math.random() - 0.5) * step * 0.5,
                y: y + offsetY + (Math.random() - 0.5) * step * 0.5,
              });
            }
          }
        }

        particles = pts.map((pt) => {
          const side = Math.floor(Math.random() * 4);
          let sx = 0;
          let sy = 0;
          if (side === 0) { sx = Math.random() * w; sy = -60 - Math.random() * 300; }
          else if (side === 1) { sx = w + 60 + Math.random() * 300; sy = Math.random() * h; }
          else if (side === 2) { sx = Math.random() * w; sy = h + 60 + Math.random() * 300; }
          else { sx = -60 - Math.random() * 300; sy = Math.random() * h; }

          const baseSize = 0.8 + Math.random() * 1.6;
          return {
            hx: pt.x,
            hy: pt.y,
            x: sx,
            y: sy,
            vx: 0,
            vy: 0,
            size: baseSize,
            baseSize,
            color: palette[Math.floor(Math.random() * palette.length)],
            phase: Math.random() * Math.PI * 2,
            glow: 0,
          };
        });
      };
    }

    function tick(now: number) {
      const w = canvas!.clientWidth;
      const h = canvas!.clientHeight;
      // Clear fully (no per-frame translucent fill — much cheaper)
      ctx!.clearRect(0, 0, w, h);

      const t = (now - start) / 1000;
      const formProgress = Math.min(1, t / 2.2);

      let avgDist = 0;
      const mouseActive = mouseX > -9000;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        const bob = Math.sin(t * 0.9 + p.phase) * 2.8;
        const sway = Math.cos(t * 0.7 + p.phase * 0.7) * 2.4;
        const tx = p.hx + sway;
        const ty = p.hy + bob;

        const dx = tx - p.x;
        const dy = ty - p.y;
        const stiffness = 0.055 + formProgress * 0.04;
        const damping = 0.8;
        p.vx = (p.vx + dx * stiffness) * damping;
        p.vy = (p.vy + dy * stiffness) * damping;

        if (mouseActive) {
          const mdx = p.x - mouseX;
          const mdy = p.y - mouseY;
          const md2 = mdx * mdx + mdy * mdy;
          const R = 140;
          if (md2 < R * R) {
            const d = Math.sqrt(md2) || 1;
            const force = (1 - d / R) * 8;
            p.vx += (mdx / d) * force;
            p.vy += (mdy / d) * force;
          }
        }

        p.x += p.vx;
        p.y += p.vy;

        avgDist += Math.abs(dx) + Math.abs(dy);

        const r = p.baseSize;
        ctx!.beginPath();
        ctx!.fillStyle = p.color;
        ctx!.arc(p.x, p.y, r, 0, Math.PI * 2);
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
        <div className="absolute top-[18%] left-0 w-full h-px bg-ink/[0.05]" />
        <div className="absolute bottom-[18%] left-0 w-full h-px bg-ink/[0.05]" />
      </div>

      {/* Layered ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 52%, rgba(232,57,14,0.14) 0%, rgba(196,154,60,0.08) 35%, transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(circle 320px at 30% 70%, rgba(196,154,60,0.16), transparent 60%), radial-gradient(circle 280px at 75% 30%, rgba(232,57,14,0.12), transparent 60%)",
        }}
      />

      {/* Particle stage */}
      <div ref={wrapRef} className="absolute inset-0 z-10">
        <canvas ref={canvasRef} className="block w-full h-full" />
      </div>

      {/* Foreground content */}
      <div className="relative z-20 mx-auto flex h-screen max-w-[1500px] flex-col px-6 md:px-12 pointer-events-none">
        {/* Top meta */}
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex items-center justify-between pt-6 md:pt-8"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-ink/55 flex items-center gap-2.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-vermillion animate-pulse" />
            Tero Studios — Est. 2014
          </span>
          <span className="hidden sm:inline font-mono text-[10px] uppercase tracking-[0.32em] text-ink/55">
            Bengaluru · 12.97° N
          </span>
        </motion.div>

        <div className="flex-1" />

        {/* Caption + CTA grouped near bottom so they don't overlap the logo */}
        <div className="pb-10 md:pb-14">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: formed ? 1 : 0, y: formed ? 0 : 18 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="mb-6 md:mb-8 text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="h-px w-10 bg-vermillion/60" />
              <p className="font-mono text-[10px] uppercase tracking-[0.45em] text-vermillion">
                A studio of moving things
              </p>
              <span className="h-px w-10 bg-vermillion/60" />
            </div>
            <h1 className="hero-headline text-ink text-[clamp(20px,2.6vw,38px)] max-w-[20ch] mx-auto">
              Stories{" "}
              <span className="italic font-light lowercase font-body text-[0.65em] text-vermillion align-baseline">
                that
              </span>{" "}
              move,{" "}
              <span className="whitespace-nowrap">
                frames{" "}
                <span className="italic font-light lowercase font-body text-[0.65em] text-ink/55 align-baseline">
                  that
                </span>{" "}
                stay.
              </span>
            </h1>
          </motion.div>

          {/* Bottom actions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: formed ? 1 : 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="flex items-end justify-between pointer-events-auto"
        >
          <div className="flex gap-3">
            <Link
              to="/contact"
              className="group relative overflow-hidden px-7 md:px-9 py-3.5 md:py-4 bg-vermillion text-cream font-mono text-[11px] font-bold uppercase tracking-[0.22em] transition-all hover:bg-ink"
            >
              <span className="relative z-10">Start a project →</span>
              <span className="absolute inset-0 bg-ink translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" />
            </Link>
            <Link
              to="/portfolio"
              className="px-7 md:px-9 py-3.5 md:py-4 border border-ink/25 text-ink font-mono text-[11px] font-bold uppercase tracking-[0.22em] transition-all hover:bg-ink hover:text-cream hover:border-ink"
            >
              See the reel
            </Link>
          </div>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-end gap-2"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-ink/50">
              Scroll
            </span>
            <span className="block w-px h-10 bg-gradient-to-b from-ink/40 to-transparent" />
          </motion.div>
        </motion.div>
        </div>
      </div>
    </section>
  );
}
