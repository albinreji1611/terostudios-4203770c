import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";
import { Link } from "@tanstack/react-router";

export function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);

  // Scroll-tied progress across the tall sticky section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 });

  // Editorial frame expansion: inset clip shrinks from 18% padding to 0
  const insetY = useTransform(p, [0, 0.7], ["18%", "0%"]);
  const insetX = useTransform(p, [0, 0.7], ["18%", "0%"]);
  const radius = useTransform(p, [0, 0.7], ["14px", "0px"]);
  const clipPath = useTransform(
    [insetY, insetX, radius] as never,
    ([y, x, r]: string[]) => `inset(${y} ${x} ${y} ${x} round ${r})`,
  );

  // Headline splits apart and fades as frame expands
  const headTopY = useTransform(p, [0, 0.5], [0, -180]);
  const headBotY = useTransform(p, [0, 0.5], [0, 180]);
  const headOpacity = useTransform(p, [0, 0.45], [1, 0]);
  const metaOpacity = useTransform(p, [0, 0.3], [1, 0]);

  // Video scale: starts slightly zoomed inside the small frame, settles to 1
  const videoScale = useTransform(p, [0, 0.7], [1.15, 1]);
  const overlayOpacity = useTransform(p, [0.4, 0.85], [0, 1]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-cream"
      style={{ height: "260vh" }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Hairline magazine grid */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 left-6 md:left-12 w-px h-full bg-ink/[0.06]" />
          <div className="absolute top-0 right-6 md:right-12 w-px h-full bg-ink/[0.06]" />
          <div className="absolute top-1/2 left-0 w-full h-px bg-ink/[0.06]" />
        </div>

        {/* Central showreel frame — expands to FULL viewport on scroll */}
        <motion.div
          style={{ clipPath, WebkitClipPath: clipPath as never }}
          className="absolute inset-0 z-20 overflow-hidden bg-ink shadow-[0_30px_80px_-30px_rgba(17,19,24,0.45)] pointer-events-none"
        >
          <motion.video
            src="/hero-reel.mp4"
            autoPlay
            loop
            muted
            playsInline
            style={{ scale: videoScale }}
            className="absolute inset-0 w-full h-full object-cover will-change-transform"
          />
          {/* Tint for editorial cohesion */}
          <div className="absolute inset-0 bg-ink/20 mix-blend-multiply" />

          {/* Editorial corner labels */}
          <div className="absolute top-6 left-6 text-cream/70 font-mono text-[10px] uppercase tracking-[0.25em]">
            Studio Reel // 001
          </div>
          <div className="absolute top-6 right-6 flex items-center gap-2 text-cream/70 font-mono text-[10px] uppercase tracking-[0.25em]">
            <span className="h-1.5 w-1.5 rounded-full bg-vermillion animate-pulse" />
            REC · 24 FPS · 4K
          </div>
          <div className="absolute bottom-6 left-6 text-cream/70 font-mono text-[10px] uppercase tracking-[0.25em]">
            Selected Works · 2024
          </div>
          <div className="absolute bottom-6 right-6 text-cream/70 font-mono text-[10px] uppercase tracking-[0.25em]">
            Tero Studios ©
          </div>

          {/* Fullscreen overlay (appears when frame fully expanded) */}
          <motion.div
            style={{ opacity: overlayOpacity }}
            className="absolute inset-0 flex flex-col items-center justify-center text-cream pointer-events-none"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-cream/60 mb-6">
              Showreel 2024
            </span>
            <h2 className="font-display font-extrabold uppercase tracking-tighter text-[clamp(40px,7vw,110px)] leading-[0.9] text-center">
              Now <span className="italic text-vermillion">playing.</span>
            </h2>
          </motion.div>
        </motion.div>


        <div className="relative h-full w-full max-w-[1500px] mx-auto px-6 md:px-12 flex flex-col">
          {/* Overline meta */}
          <motion.div
            style={{ opacity: metaOpacity }}
            className="w-full flex justify-between items-end border-b border-ink/10 pb-4 pt-24"
          >
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] font-bold text-ink/40">
                Capabilities
              </span>
              <span className="text-xs font-semibold text-ink">
                Motion · 3D · Narrative
              </span>
            </div>
            <div className="text-right">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] font-bold text-ink/40 block mb-1">
                Origin
              </span>
              <span className="text-xs font-semibold text-ink">
                Animation Studio · Est. 2014 · Bengaluru
              </span>
            </div>
          </motion.div>

          {/* Stage */}
          <div className="relative flex-1 w-full flex items-center justify-center">
            {/* Headline (top half) */}
            <motion.h1
              style={{ y: headTopY, opacity: headOpacity }}
              className="absolute top-[6%] left-0 right-0 text-center font-display font-extrabold uppercase tracking-tighter leading-[0.85] text-ink text-[clamp(56px,10vw,160px)] z-30 pointer-events-none"
            >
              Stories{" "}
              <span className="italic font-normal lowercase font-body text-[0.38em] align-middle text-vermillion px-3">
                that
              </span>{" "}
              move,
            </motion.h1>

            {/* Headline (bottom half) */}
            <motion.h1
              style={{ y: headBotY, opacity: headOpacity }}
              className="absolute bottom-[14%] left-0 right-0 text-center font-display font-extrabold uppercase tracking-tighter leading-[0.85] text-ink text-[clamp(56px,10vw,160px)] z-30 pointer-events-none"
            >
              frames{" "}
              <span className="italic font-normal lowercase font-body text-[0.38em] align-middle text-ink/70">
                stay.
              </span>
            </motion.h1>

            {/* Video frame moved to sticky stage so it expands full-viewport */}

          </div>

          {/* Bottom actions */}
          <motion.div
            style={{ opacity: metaOpacity }}
            className="w-full flex flex-col md:flex-row justify-between items-center gap-8 pb-10 pt-8 border-t border-ink/10"
          >
            <div className="flex gap-4">
              <Link
                to="/contact"
                className="group relative px-8 py-4 bg-vermillion text-cream font-mono text-[11px] font-bold uppercase tracking-[0.2em] overflow-hidden transition-colors hover:bg-ink"
              >
                Start a project
              </Link>
              <Link
                to="/portfolio"
                className="px-8 py-4 border border-ink/20 text-ink font-mono text-[11px] font-bold uppercase tracking-[0.2em] transition-all hover:bg-ink hover:text-cream"
              >
                See selected work
              </Link>
            </div>

            <div className="flex items-center gap-10">
              <p className="hidden lg:block max-w-[300px] text-[12px] leading-relaxed text-ink/60 italic font-body">
                Independent motion studio crafting digital narratives through
                high-fidelity animation and sound design.
              </p>
              <div className="flex flex-col items-end gap-2">
                <div className="w-12 h-px bg-ink/20" />
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] font-bold text-ink/40">
                  Scroll
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
