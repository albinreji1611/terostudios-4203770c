import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/* Editorial kinetic band — light cream, vermillion accents, dual-direction marquee tied to scroll. */
export function KineticBand() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const x1 = useTransform(scrollYProgress, [0, 1], ["5%", "-35%"]);
  const x2 = useTransform(scrollYProgress, [0, 1], ["-35%", "5%"]);

  const words = [
    "Animation",
    "Motion Design",
    "3D · CGI",
    "VFX",
    "Storytelling",
    "Crafted in Bengaluru",
  ];

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-cream py-20 md:py-32"
    >
      {/* Top hairline + label */}
      <div className="container-tero mb-10 flex items-end justify-between">
        <span className="overline">— In motion</span>
        <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-slate">
          Est. Bengaluru · Worldwide
        </span>
      </div>
      <div className="mx-6 md:mx-12 h-px bg-parchment mb-10" />

      {/* Row 1 — italic display, ink, fills */}
      <motion.div
        style={{ x: x1 }}
        className="flex items-center gap-12 whitespace-nowrap will-change-transform"
      >
        {[...words, ...words].map((w, i) => (
          <span
            key={`a-${i}`}
            className="hero-headline text-[clamp(56px,12vw,180px)] leading-[0.9] text-ink flex items-center"
          >
            {w}
            <span className="mx-10 inline-block h-3 w-3 rounded-full bg-vermillion" />
          </span>
        ))}
      </motion.div>

      {/* Row 2 — Syne uppercase, outlined */}
      <motion.div
        style={{ x: x2 }}
        className="mt-8 flex items-center gap-12 whitespace-nowrap will-change-transform"
      >
        {[...words, ...words].reverse().map((w, i) => (
          <span
            key={`b-${i}`}
            className="font-sans-display font-extrabold uppercase tracking-tight text-[clamp(40px,9vw,140px)] leading-[0.9] flex items-center"
            style={{
              color: "transparent",
              WebkitTextStroke: "1.2px #111318",
            }}
          >
            {w}
            <span className="mx-10 font-mono text-[14px] tracking-[0.2em] text-vermillion" style={{ WebkitTextStroke: "0" }}>
              ✦
            </span>
          </span>
        ))}
      </motion.div>

      {/* Bottom hairline + caption */}
      <div className="mx-6 md:mx-12 h-px bg-parchment mt-12" />
      <div className="container-tero mt-6 flex items-center justify-between">
        <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-slate">
          (Scroll to play)
        </span>
        <span className="font-display text-[20px] italic text-ink/70">
          a studio in perpetual motion
        </span>
      </div>
    </section>
  );
}
