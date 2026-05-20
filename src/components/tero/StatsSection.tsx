import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

function CountUp({ to, suffix = "+" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const dur = 1400;
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
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: val === to ? 1 : 0 }}
        className="text-vermillion"
      >
        {suffix}
      </motion.span>
    </span>
  );
}

const stats = [
  { v: 320, s: "+", label: "Projects shipped" },
  { v: 48, s: "+", label: "Global clients" },
  { v: 12, s: "", label: "Years in motion" },
  { v: 27, s: "", label: "Industry awards" },
];

export function StatsSection() {
  return (
    <section className="border-y border-parchment bg-card">
      <div className="container-tero grid grid-cols-2 gap-y-12 py-24 md:grid-cols-4 md:py-32">
        {stats.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-start gap-3 px-2"
          >
            <p className="overline">— {String(i + 1).padStart(2, "0")}</p>
            <p className="font-display text-[clamp(56px,8vw,96px)] leading-none text-ink">
              <CountUp to={s.v} suffix={s.s} />
            </p>
            <p className="font-body text-[14px] text-slate">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
