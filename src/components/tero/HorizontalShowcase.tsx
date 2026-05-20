import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import p1 from "@/assets/portfolio-1.jpg";
import p2 from "@/assets/portfolio-2.jpg";
import p3 from "@/assets/portfolio-3.jpg";
import p4 from "@/assets/portfolio-4.jpg";
import p5 from "@/assets/portfolio-5.jpg";
import p6 from "@/assets/portfolio-6.jpg";

const cards = [
  { img: p1, title: "Night Goggles", subtitle: "Mindchatter" },
  { img: p2, title: "Loss | 逝去", subtitle: "Short Film" },
  { img: p3, title: "Now | 正念", subtitle: "Movement Study" },
  { img: p4, title: "Saigon Souls", subtitle: "A film by Robin Mahieux" },
  { img: p5, title: "Website of the Day", subtitle: "CSSDA · 2026" },
  { img: p6, title: "FWA of the Day", subtitle: "Awarded · 2026" },
  { img: p1, title: "Site of the Day", subtitle: "Awwwards · May 14, 2026" },
];

// Per-card rotation (degrees) to mimic the scattered poster layout
const tilts = [-6, 4, -3, 6, -4, 3, -5];

export function HorizontalShowcase() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // Horizontal travel — tuned so the last card lands flush right
  const x = useTransform(scrollYProgress, [0, 1], ["8vw", "-78%"]);

  // Active index for the numbered list on the left
  const [active, setActive] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const i = Math.min(cards.length - 1, Math.max(0, Math.floor(v * cards.length)));
    if (i !== active) setActive(i);
  });

  return (
    <section
      ref={ref}
      className="relative"
      style={{
        height: `${cards.length * 90}vh`,
        background: "linear-gradient(180deg, #cfdce6 0%, #d9e4ec 50%, #c9d8e3 100%)",
      }}
    >
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden">
        {/* Top bar — wordmark + menu, mimicking the reference */}
        <div className="flex items-center justify-between px-8 pt-8 md:px-12">
          <span className="font-mono text-[12px] uppercase tracking-[0.2em] text-ink/70">— Menu</span>
          <span className="font-display text-[28px] italic leading-none text-ink">
            tero<span className="not-italic font-body font-light tracking-tight">studios</span>
          </span>
          <a href="/contact" className="font-body text-[14px] text-ink/80 hover:text-vermillion transition-colors">
            Let's chat →
          </a>
        </div>

        {/* Numbered index — left rail */}
        <div className="pointer-events-none absolute left-8 top-1/2 -translate-y-1/2 z-10 hidden md:block">
          <ul className="space-y-3 font-mono text-[12px] text-ink/50">
            {cards.map((c, i) => (
              <li key={i} className="flex items-center gap-3">
                <span className={i === active ? "text-ink" : ""}>{i + 1}</span>
                {i === active && (
                  <motion.span
                    layoutId="rail-dash"
                    className="inline-block h-px w-8 bg-ink"
                  />
                )}
                {i === active && (
                  <span className="font-body italic text-ink text-[13px]">{c.title.split(" ")[0]}</span>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Horizontal poster strip */}
        <div className="relative flex-1 flex items-center">
          <motion.div
            style={{ x }}
            className="flex items-center gap-[6vw] pl-[20vw] pr-[10vw] will-change-transform"
          >
            {cards.map((c, i) => (
              <motion.div
                key={i}
                initial={{ rotate: tilts[i % tilts.length], y: 40, opacity: 0 }}
                whileInView={{ rotate: tilts[i % tilts.length], y: 0, opacity: 1 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ rotate: 0, scale: 1.03, y: -10 }}
                className="relative shrink-0 w-[44vh] aspect-[3/4] overflow-hidden rounded-[2px] shadow-[0_40px_80px_-30px_rgba(20,30,50,0.45)] bg-ink"
              >
                <img
                  src={c.img}
                  alt={c.title}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                {/* Poster title overlay */}
                <div className="absolute inset-x-0 top-0 p-6 text-center">
                  <h3 className="font-display text-white text-[clamp(28px,3.5vh,44px)] leading-[0.95] drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]">
                    {c.title}
                  </h3>
                  <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.3em] text-white/90">
                    {c.subtitle}
                  </p>
                </div>
                {/* Award laurels strip at bottom */}
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-center gap-2 p-4">
                  {Array.from({ length: 4 }).map((_, k) => (
                    <svg key={k} viewBox="0 0 40 40" className="h-8 w-8 text-white/80">
                      <path
                        d="M10 30 Q 6 20 10 10 M30 30 Q 34 20 30 10"
                        stroke="currentColor"
                        strokeWidth="1.2"
                        fill="none"
                      />
                      <text x="20" y="22" textAnchor="middle" fontSize="5" fill="currentColor" fontFamily="monospace">
                        2026
                      </text>
                    </svg>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Bottom counter */}
        <div className="flex items-center justify-between px-8 pb-8 md:px-12 font-mono text-[11px] uppercase tracking-[0.25em] text-ink/60">
          <span>Scroll →</span>
          <span>
            {String(active + 1).padStart(2, "0")} / {String(cards.length).padStart(2, "0")} — Selected works
          </span>
        </div>
      </div>
    </section>
  );
}
