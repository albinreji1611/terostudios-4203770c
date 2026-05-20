import { motion, useMotionValue, useSpring, useTransform, useScroll } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { Link } from "@tanstack/react-router";
import { ArrowDown } from "lucide-react";

/* Word that splits into letters and staggers in from below a clipping mask. */
function RevealWord({
  text,
  delay = 0,
  className = "",
  italic = false,
}: {
  text: string;
  delay?: number;
  className?: string;
  italic?: boolean;
}) {
  return (
    <span className={`inline-block overflow-hidden align-baseline ${className}`}>
      {text.split("").map((ch, i) => (
        <motion.span
          key={i}
          initial={{ y: "110%", rotate: 6 }}
          animate={{ y: 0, rotate: 0 }}
          transition={{
            duration: 0.9,
            delay: delay + i * 0.035,
            ease: [0.16, 1, 0.3, 1],
          }}
          className={`inline-block ${italic ? "italic" : ""}`}
          style={{ willChange: "transform" }}
        >
          {ch === " " ? "\u00A0" : ch}
        </motion.span>
      ))}
    </span>
  );
}

export function Hero() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);

  /* Spotlight position over the headline */
  const sx = useMotionValue(50);
  const sy = useMotionValue(50);
  const ssx = useSpring(sx, { stiffness: 120, damping: 20, mass: 0.4 });
  const ssy = useSpring(sy, { stiffness: 120, damping: 20, mass: 0.4 });

  /* Parallax tilt for the hero image */
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), { stiffness: 80, damping: 14 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-8, 8]), { stiffness: 80, damping: 14 });
  const px = useSpring(useTransform(mx, [-0.5, 0.5], [-18, 18]), { stiffness: 60, damping: 16 });
  const py = useSpring(useTransform(my, [-0.5, 0.5], [-14, 14]), { stiffness: 60, damping: 16 });

  const [spotOn, setSpotOn] = useState(false);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const wrap = wrapRef.current;
      if (wrap) {
        const r = wrap.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }
      const h = headlineRef.current;
      if (h) {
        const r = h.getBoundingClientRect();
        const inside =
          e.clientX >= r.left &&
          e.clientX <= r.right &&
          e.clientY >= r.top &&
          e.clientY <= r.bottom;
        setSpotOn(inside);
        sx.set(((e.clientX - r.left) / r.width) * 100);
        sy.set(((e.clientY - r.top) / r.height) * 100);
      }
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mx, my, sx, sy]);

  const maskImage = useTransform(
    [ssx, ssy] as never,
    ([x, y]: number[]) =>
      `radial-gradient(260px circle at ${x}% ${y}%, #000 0%, rgba(0,0,0,0.85) 35%, rgba(0,0,0,0) 70%)`,
  );

  return (
    <section ref={wrapRef} className="relative overflow-hidden bg-cream">
      {/* subtle grid + grain */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #111 1px, transparent 1px), linear-gradient(to bottom, #111 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      <div className="container-tero relative pt-12 pb-24 md:pt-20 md:pb-32">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="overline"
        >
          — Animation Studio · Est. 2014 · Bengaluru
        </motion.p>

        {/* Headline with spotlight reveal */}
        <h1
          ref={headlineRef}
          className="relative mt-8 hero-headline text-[clamp(56px,11vw,160px)] text-ink select-none"
        >
          <span className="block leading-[0.92]">
            <RevealWord text="Stories" delay={0.25} />
          </span>
          <span className="block leading-[0.92]">
            <RevealWord text="that" delay={0.38} />{" "}
            <RevealWord text="move," delay={0.5} />
          </span>
          <span className="block leading-[0.92]">
            <RevealWord text="frames" delay={0.62} />{" "}
            <RevealWord
              text="that stay."
              delay={0.78}
              italic
              className="text-vermillion"
            />
          </span>

          {/* Spotlight overlay — duplicates the headline in vermillion under a soft circular mask */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 mix-blend-multiply"
            style={{
              opacity: spotOn ? 1 : 0,
              transition: "opacity 220ms ease",
              WebkitMaskImage: maskImage as unknown as string,
              maskImage: maskImage as unknown as string,
            }}
          >
            <span className="block leading-[0.92] text-vermillion">Stories</span>
            <span className="block leading-[0.92] text-vermillion">that move,</span>
            <span className="block leading-[0.92]">
              <span className="text-vermillion">frames </span>
              <span className="italic text-ink">that stay.</span>
            </span>
          </motion.div>
        </h1>

        <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-12 md:items-end">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.1 }}
            className="md:col-span-5 max-w-md font-body text-[18px] leading-relaxed text-slate"
          >
            Tero is an independent animation studio crafting films, motion
            design and visual effects for brands with something real to say.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.2 }}
            className="md:col-span-7 flex flex-wrap items-center gap-4 md:justify-end"
          >
            <Link
              to="/portfolio"
              className="group relative inline-flex items-center gap-3 overflow-hidden rounded-[4px] bg-ink px-7 py-4 text-[15px] font-medium text-cream"
            >
              <span className="absolute inset-0 -z-0 translate-y-full bg-gradient-to-br from-[#E8390E] to-[#C42D06] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0" />
              <span className="relative z-10">See selected work</span>
              <span className="relative z-10 inline-block transition-transform duration-500 group-hover:translate-x-1">
                →
              </span>
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-3 rounded-[4px] border-[1.5px] border-ink px-7 py-4 text-[15px] font-medium text-ink transition-colors hover:bg-ink hover:text-cream"
            >
              Start a project
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Floating image with mouse parallax + tilt */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative mx-auto max-w-[1500px] px-6"
        style={{ perspective: 1400 }}
      >
        <motion.div
          style={{ rotateX: rx, rotateY: ry, x: px, y: py, transformStyle: "preserve-3d" }}
          className="relative overflow-hidden rounded-2xl border border-parchment shadow-[0_30px_80px_-30px_rgba(17,19,24,0.35)]"
        >
          <video
            src="/hero-reel.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-auto block aspect-[16/10] object-cover bg-ink"
          />

          {/* Sheen sweep */}
          <motion.div
            aria-hidden
            initial={{ x: "-120%" }}
            animate={{ x: "120%" }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 4, ease: "easeInOut" }}
            className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 rotate-12 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          />
          <div className="absolute left-4 bottom-4 flex items-center gap-3 rounded-full bg-cream/85 px-4 py-2 backdrop-blur-sm">
            <span className="inline-block h-2 w-2 rounded-full bg-vermillion animate-pulse" />
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink">
              Reel 2026 · Now playing
            </span>
          </div>

          {/* Floating chips */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute right-6 top-6 hidden md:flex items-center gap-2 rounded-full bg-ink/85 px-4 py-2 backdrop-blur-sm"
          >
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-cream">
              3D · 2D · VFX
            </span>
          </motion.div>
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute right-6 bottom-20 hidden md:flex items-center gap-2 rounded-full bg-vermillion px-4 py-2"
          >
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white">
              Awwwards · 2025
            </span>
          </motion.div>
        </motion.div>
      </motion.div>

      <div className="container-tero mt-10 flex items-center justify-between text-slate">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em]">
          Scroll to explore
        </p>
        <ArrowDown className="h-4 w-4 animate-bounce" strokeWidth={1.5} />
      </div>
    </section>
  );
}
