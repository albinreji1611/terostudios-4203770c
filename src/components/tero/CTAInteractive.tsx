import { useRef, useState, useEffect, type MouseEvent } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight, Box, Layers, Sparkles, Film } from "lucide-react";

const scenes = [
  {
    key: "brand-film",
    label: "Brand Film",
    headline: "a cinematic brand film",
    desc: "Story-led films that make your brand feel alive on screen.",
    meta: "4–8 wks",
    icon: Film,
    hue: "from-vermillion/40 to-transparent",
  },
  {
    key: "explainer",
    label: "3D Explainer",
    headline: "a 3D product explainer",
    desc: "Crystal-clear motion that turns complex products into instant clarity.",
    meta: "3–6 wks",
    icon: Box,
    hue: "from-amber-500/35 to-transparent",
  },
  {
    key: "ad",
    label: "Ad Campaign",
    headline: "an ad campaign that lands",
    desc: "Short-form work tuned for social, OTT and broadcast.",
    meta: "2–5 wks",
    icon: Sparkles,
    hue: "from-rose-400/35 to-transparent",
  },
  {
    key: "title",
    label: "Title Sequence",
    headline: "an unforgettable title sequence",
    desc: "Opening credits and identity systems with editorial intent.",
    meta: "3–7 wks",
    icon: Layers,
    hue: "from-sky-400/30 to-transparent",
  },
];

export function CTAInteractive() {
  const stageRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  // 3D tilt
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [10, -10]), { stiffness: 120, damping: 14 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-14, 14]), { stiffness: 120, damping: 14 });
  const px = useSpring(useTransform(mx, [-0.5, 0.5], [-20, 20]), { stiffness: 80, damping: 18 });
  const py = useSpring(useTransform(my, [-0.5, 0.5], [-20, 20]), { stiffness: 80, damping: 18 });

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const r = stageRef.current?.getBoundingClientRect();
    if (!r) return;
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  // auto-cycle
  useEffect(() => {
    const t = setInterval(() => setActive((a) => (a + 1) % scenes.length), 4200);
    return () => clearInterval(t);
  }, []);

  const current = scenes[active];
  const Icon = current.icon;

  return (
    <section className="relative overflow-hidden bg-ink text-cream py-20 md:py-28">
      {/* ambient grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #fdfaf6 1px, transparent 1px), linear-gradient(to bottom, #fdfaf6 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)",
        }}
      />
      {/* glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 h-[480px] w-[680px] -translate-x-1/2 rounded-full blur-[120px] opacity-40"
        style={{ background: "radial-gradient(circle, rgba(232,57,14,0.55), transparent 60%)" }}
      />

      <div className="container-tero relative z-10">
        {/* header */}
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-cream/55">
              ◐ Step into the studio / 2026
            </p>
            <h2 className="mt-4 font-display font-extrabold leading-[0.95] tracking-tight text-[clamp(34px,5vw,64px)]">
              Let's build{" "}
              <span className="inline-block align-baseline">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={current.key}
                    initial={{ y: 18, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -18, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="text-vermillion italic"
                  >
                    {current.headline}
                  </motion.span>
                </AnimatePresence>
              </span>
            </h2>
          </div>
          <p className="max-w-xs font-body text-[14px] text-cream/65">
            Move your cursor over the headset — pick a project type and we'll take it from there.
          </p>
        </div>

        {/* main interactive grid */}
        <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-12 items-stretch">
          {/* LEFT — VR stage */}
          <div
            ref={stageRef}
            onMouseMove={onMove}
            onMouseLeave={onLeave}
            className="relative rounded-[6px] border border-cream/10 bg-gradient-to-b from-white/[0.04] to-transparent p-6 md:p-10 overflow-hidden"
            style={{ perspective: 1200 }}
          >
            {/* scanlines */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-overlay"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg, #fdfaf6 0 1px, transparent 1px 4px)",
              }}
            />

            <div className="relative flex flex-col items-center justify-center min-h-[360px] md:min-h-[420px]">
              {/* halo */}
              <motion.div
                aria-hidden
                className={`absolute inset-0 rounded-full blur-3xl bg-gradient-radial ${current.hue}`}
                style={{
                  background: `radial-gradient(circle at 50% 50%, var(--tw-gradient-stops))`,
                  x: px,
                  y: py,
                }}
              />

              {/* VR headset SVG */}
              <motion.div
                style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
                className="relative"
              >
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <svg
                    viewBox="0 0 320 200"
                    className="w-[260px] md:w-[340px] h-auto drop-shadow-[0_30px_60px_rgba(232,57,14,0.35)]"
                  >
                    <defs>
                      <linearGradient id="vrBody" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#1a1a1f" />
                        <stop offset="100%" stopColor="#0a0a0d" />
                      </linearGradient>
                      <linearGradient id="vrLens" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#e8390e" />
                        <stop offset="60%" stopColor="#7a1e08" />
                        <stop offset="100%" stopColor="#1a1a1f" />
                      </linearGradient>
                    </defs>
                    {/* strap */}
                    <path
                      d="M20 100 Q 20 40 160 40 Q 300 40 300 100"
                      stroke="#fdfaf6"
                      strokeOpacity="0.15"
                      strokeWidth="2"
                      fill="none"
                    />
                    {/* body */}
                    <rect
                      x="40"
                      y="60"
                      width="240"
                      height="110"
                      rx="28"
                      fill="url(#vrBody)"
                      stroke="#fdfaf6"
                      strokeOpacity="0.18"
                    />
                    {/* face padding */}
                    <rect
                      x="50"
                      y="160"
                      width="220"
                      height="14"
                      rx="6"
                      fill="#fdfaf6"
                      fillOpacity="0.06"
                    />
                    {/* lenses */}
                    <g>
                      <circle cx="115" cy="115" r="34" fill="url(#vrLens)" />
                      <circle cx="205" cy="115" r="34" fill="url(#vrLens)" />
                      <circle cx="115" cy="115" r="34" fill="none" stroke="#fdfaf6" strokeOpacity="0.25" />
                      <circle cx="205" cy="115" r="34" fill="none" stroke="#fdfaf6" strokeOpacity="0.25" />
                      {/* sheen */}
                      <ellipse cx="105" cy="105" rx="10" ry="6" fill="#fdfaf6" fillOpacity="0.35" />
                      <ellipse cx="195" cy="105" rx="10" ry="6" fill="#fdfaf6" fillOpacity="0.35" />
                    </g>
                    {/* led */}
                    <circle cx="160" cy="78" r="2.5" fill="#e8390e">
                      <animate attributeName="opacity" values="0.3;1;0.3" dur="1.8s" repeatCount="indefinite" />
                    </circle>
                    {/* brand */}
                    <text
                      x="160"
                      y="195"
                      textAnchor="middle"
                      fontFamily="monospace"
                      fontSize="8"
                      fill="#fdfaf6"
                      fillOpacity="0.4"
                      letterSpacing="3"
                    >
                      TERO · OS
                    </text>
                  </svg>
                </motion.div>

                {/* floating scene chip on the headset */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current.key}
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.9 }}
                    transition={{ duration: 0.35 }}
                    className="absolute -top-6 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full border border-cream/20 bg-ink/80 backdrop-blur px-4 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-cream/80"
                    style={{ transform: "translateZ(40px) translateX(-50%)" }}
                  >
                    <Icon className="h-3.5 w-3.5 text-vermillion" />
                    Now rendering · {current.label}
                  </motion.div>
                </AnimatePresence>
              </motion.div>

              {/* orbiting dots */}
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  aria-hidden
                  className="absolute inset-0 flex items-center justify-center"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 14 + i * 6, repeat: Infinity, ease: "linear" }}
                >
                  <div
                    className="absolute rounded-full border border-cream/10"
                    style={{
                      width: `${280 + i * 60}px`,
                      height: `${280 + i * 60}px`,
                    }}
                  >
                    <span className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-vermillion shadow-[0_0_12px_rgba(232,57,14,0.8)]" />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* HUD strip */}
            <div className="relative mt-6 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-cream/45">
              <span>▸ Live preview</span>
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-vermillion animate-pulse" />
                Signal locked
              </span>
            </div>
          </div>

          {/* RIGHT — picker + CTA */}
          <div className="flex flex-col justify-between gap-8 rounded-[6px] border border-cream/10 bg-gradient-to-b from-white/[0.03] to-transparent p-6 md:p-10">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-cream/45">
                ▸ Choose your scene
              </p>
              <ul className="mt-5 flex flex-col">
                {scenes.map((it, i) => {
                  const isActive = i === active;
                  return (
                    <li key={it.key}>
                      <button
                        type="button"
                        onMouseEnter={() => setActive(i)}
                        onFocus={() => setActive(i)}
                        onClick={() => setActive(i)}
                        className={`group relative flex w-full items-center justify-between gap-4 border-b border-cream/10 py-4 text-left transition-colors ${
                          isActive ? "text-cream" : "text-cream/55 hover:text-cream"
                        }`}
                      >
                        <span className="flex items-center gap-4">
                          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-vermillion w-8">
                            0{i + 1}
                          </span>
                          <span className="font-display text-[clamp(18px,2vw,24px)] leading-none">
                            {it.label}
                          </span>
                        </span>
                        <span className="flex items-center gap-3">
                          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-cream/40">
                            {it.meta}
                          </span>
                          <span
                            className={`relative h-px overflow-hidden bg-cream/15 transition-all duration-300 ${
                              isActive ? "w-14" : "w-6"
                            }`}
                          >
                            {isActive && (
                              <motion.span
                                layoutId="cta-indicator"
                                className="absolute inset-0 bg-vermillion"
                              />
                            )}
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>

              <AnimatePresence mode="wait">
                <motion.p
                  key={current.key + "-desc"}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="mt-6 font-body text-[14px] leading-relaxed text-cream/70"
                >
                  {current.desc}
                </motion.p>
              </AnimatePresence>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="/contact"
                  className="group/btn inline-flex items-center gap-3 rounded-full bg-vermillion px-6 py-3.5 font-mono text-[12px] uppercase tracking-[0.25em] text-white transition-all hover:gap-5"
                >
                  Start the brief
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:rotate-45" />
                </a>
                <a
                  href="/portfolio"
                  className="inline-flex items-center gap-3 rounded-full border border-cream/30 px-6 py-3.5 font-mono text-[12px] uppercase tracking-[0.25em] text-cream transition-colors hover:bg-cream hover:text-ink"
                >
                  See the reel
                </a>
              </div>
              <div className="flex items-center justify-between border-t border-cream/10 pt-4 font-mono text-[10px] uppercase tracking-[0.3em] text-cream/45">
                <span>● Replies in 24 hrs</span>
                <span>hello@terostudios.in</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
