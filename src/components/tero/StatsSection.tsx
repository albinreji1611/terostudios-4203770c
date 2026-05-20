import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

function CountUp({ to, suffix = "+" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const dur = 1600;
    let raf = 0;
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(to * eased));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);

  return (
    <span ref={ref} className="tabular-nums">
      {val}
      <span className="text-vermillion">{suffix}</span>
    </span>
  );
}

const stats = [
  { v: 320, s: "+", label: "Projects shipped", bg: "#FDE6DC" },
  { v: 48, s: "+", label: "Global clients", bg: "#E6EFE3" },
  { v: 12, s: "", label: "Years in motion", bg: "#E4E8F5" },
  { v: 27, s: "", label: "Industry awards", bg: "#F6E9CC" },
  { v: 5, s: "", label: "Studios worldwide", bg: "#F1E3EF" },
];

export function StatsSection() {
  return (
    <section className="relative border-y border-parchment bg-cream">
      <div className="container-tero py-24 md:py-32">
        <div className="mb-14 flex items-end justify-between gap-6">
          <div>
            <p className="overline">— By the numbers</p>
            <h2 className="mt-4 hero-headline text-[clamp(36px,5vw,68px)] max-w-2xl">
              A decade of frames, shipped.
            </h2>
          </div>
          <p className="hidden md:block max-w-xs font-body text-[14px] text-slate">
            Numbers we like, but the work is what we&apos;d rather you remember.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-5 md:grid-cols-5 md:gap-6">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.6, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.8,
                delay: i * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
              whileHover={{ y: -8, rotate: i % 2 ? 2 : -2 }}
              className="group relative mx-auto flex aspect-square w-full max-w-[230px] flex-col items-center justify-center rounded-full shadow-[0_18px_40px_-22px_rgba(17,19,24,0.35)] transition-shadow"
              style={{ backgroundColor: s.bg }}
            >
              <p className="font-display text-[clamp(40px,5vw,68px)] leading-none text-ink">
                <CountUp to={s.v} suffix={s.s} />
              </p>
              <p className="mt-2 px-6 text-center font-body text-[12px] leading-tight text-ink/70">
                {s.label}
              </p>
              <span className="absolute -top-2 right-6 font-mono text-[10px] tracking-[0.2em] text-ink/40">
                0{i + 1}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
