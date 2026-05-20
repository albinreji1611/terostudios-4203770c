import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/* Giant kinetic marquee band that scrolls horizontally while you scroll vertically. */
export function KineticBand() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const x1 = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const x2 = useTransform(scrollYProgress, [0, 1], ["-30%", "0%"]);

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
      className="relative overflow-hidden border-y border-parchment bg-ink py-16 md:py-24"
    >
      <motion.div
        style={{ x: x1 }}
        className="flex items-center gap-10 whitespace-nowrap will-change-transform"
      >
        {[...words, ...words].map((w, i) => (
          <span
            key={`a-${i}`}
            className="hero-headline text-[clamp(56px,12vw,180px)] leading-none text-cream"
          >
            {w}
            <span className="mx-8 inline-block h-3 w-3 -translate-y-4 rounded-full bg-vermillion align-middle" />
          </span>
        ))}
      </motion.div>

      <motion.div
        style={{ x: x2 }}
        className="mt-6 flex items-center gap-10 whitespace-nowrap will-change-transform"
      >
        {[...words, ...words].reverse().map((w, i) => (
          <span
            key={`b-${i}`}
            className="hero-headline text-[clamp(40px,8vw,120px)] leading-none text-cream/30"
            style={{ WebkitTextStroke: "1px rgba(253,250,246,0.4)" }}
          >
            {w}
            <span className="mx-8 inline-block align-middle font-mono text-[14px] tracking-[0.2em] text-vermillion">
              ◆
            </span>
          </span>
        ))}
      </motion.div>
    </section>
  );
}
