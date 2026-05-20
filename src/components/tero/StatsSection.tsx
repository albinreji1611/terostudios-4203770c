import { useEffect, useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";

function CountUp({ to, suffix = "+" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const dur = 1800;
    let raf = 0;
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 4);
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
  { v: 320, s: "+", label: "Projects shipped", note: "Films, spots, loops & explainers", since: "since 2014" },
  { v: 48, s: "+", label: "Global clients", note: "Bengaluru → New York → Berlin", since: "across 14 countries" },
  { v: 12, s: "", label: "Years in motion", note: "Independent, founder-led studio", since: "est. 2014" },
  { v: 27, s: "", label: "Industry awards", note: "FWA · Awwwards · Vimeo Staff Picks", since: "and counting" },
  { v: 5, s: "", label: "Studios worldwide", note: "Collaborating across timezones", since: "one craft, many rooms" },
];

export function StatsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const tickerX = useTransform(scrollYProgress, [0, 1], ["10%", "-40%"]);

  return (
    <section ref={sectionRef} className="relative overflow-hidden border-y border-parchment bg-cream">
      {/* Editorial header */}
      <div className="container-tero pt-20 md:pt-28">
        <div className="flex items-end justify-between gap-6 border-b border-parchment pb-8">
          <div>
            <p className="overline">— By the numbers / 2014–2026</p>
            <h2 className="mt-5 hero-headline text-[clamp(40px,6vw,84px)] max-w-3xl text-ink">
              A decade of frames,
              <br />
              <span className="text-vermillion">shipped</span> with intent.
            </h2>
          </div>
          <p className="hidden md:block max-w-xs font-body text-[14px] leading-relaxed text-slate">
            Numbers we like, but the work is what we&apos;d rather you remember.
            <span className="block mt-3 font-mono text-[11px] uppercase tracking-[0.25em] text-ink/50">
              Vol. 12 · Issue 05
            </span>
          </p>
        </div>
      </div>

      {/* Stat rows — newspaper-style ledger */}
      <div className="container-tero">
        {stats.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="group relative grid grid-cols-12 items-end gap-4 border-b border-parchment py-8 md:py-10"
          >
            {/* Index */}
            <div className="col-span-2 md:col-span-1">
              <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ink/50">
                / 0{i + 1}
              </p>
            </div>

            {/* Big number */}
            <div className="col-span-10 md:col-span-4">
              <p className="hero-headline text-[clamp(56px,9vw,140px)] leading-[0.85] text-ink">
                <CountUp to={s.v} suffix={s.s} />
              </p>
            </div>

            {/* Label */}
            <div className="col-span-7 md:col-span-3">
              <p className="font-sans-display text-[18px] md:text-[22px] font-bold uppercase tracking-tight text-ink leading-tight">
                {s.label}
              </p>
              <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.25em] text-vermillion">
                {s.since}
              </p>
            </div>

            {/* Note */}
            <div className="col-span-5 md:col-span-3">
              <p className="font-display italic text-[16px] md:text-[20px] leading-snug text-ink/70">
                &ldquo;{s.note}.&rdquo;
              </p>
            </div>

            {/* Animated progress rule */}
            <div className="col-span-12 md:col-span-1 flex justify-end">
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.4, delay: i * 0.08 + 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="h-px w-full md:w-16 origin-left bg-vermillion"
              />
            </div>

            {/* Hover sweep */}
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-full origin-left bg-vermillion/[0.04]"
              initial={{ scaleX: 0 }}
              whileHover={{ scaleX: 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            />
          </motion.div>
        ))}
      </div>

      {/* Scroll-tied bottom ticker */}
      <div className="mt-2 overflow-hidden py-8">
        <motion.div
          style={{ x: tickerX }}
          className="flex items-center gap-10 whitespace-nowrap will-change-transform"
        >
          {Array.from({ length: 2 }).flatMap((_, k) =>
            [
              "Crafted in Bengaluru",
              "Independent since 2014",
              "Animation · Motion · CGI",
              "Selected works, shipped worldwide",
              "Numbers update on scroll",
            ].map((w, i) => (
              <span
                key={`${k}-${i}`}
                className="flex items-center gap-10 font-mono text-[12px] uppercase tracking-[0.35em] text-ink/60"
              >
                {w}
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-vermillion" />
              </span>
            )),
          )}
        </motion.div>
      </div>
    </section>
  );
}
