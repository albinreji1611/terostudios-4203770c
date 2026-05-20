import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent, AnimatePresence } from "framer-motion";

const services = [
  {
    n: "01",
    name: "3D Animation",
    mark: "3D",
    desc: "Photoreal product, character and environment animation rendered at film quality.",
    tilt: -4,
  },
  {
    n: "02",
    name: "2D Motion",
    mark: "2D",
    desc: "Editorial-grade typography, transitions and brand systems that move with rhythm.",
    tilt: 3,
  },
  {
    n: "03",
    name: "Character",
    mark: "CH",
    desc: "Stylised characters with performance — from rig to final hand-drawn texture.",
    tilt: -2,
  },
  {
    n: "04",
    name: "Explainer",
    mark: "EX",
    desc: "Product films that turn complex software stories into one-watch clarity.",
    tilt: 5,
  },
  {
    n: "05",
    name: "VFX",
    mark: "FX",
    desc: "Live-action compositing, simulations and finishing for ads and short films.",
    tilt: -3,
  },
];

const ITEM_VH = 26; // vertical spacing between names (in vh)

export function ServicesScroller() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const [active, setActive] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const i = Math.min(services.length - 1, Math.max(0, Math.floor(v * services.length)));
    if (i !== active) setActive(i);
  });

  // Column slides from first item centered to last item centered
  const totalShift = -(services.length - 1) * ITEM_VH; // in vh
  const y = useTransform(scrollYProgress, [0, 1], ["0vh", `${totalShift}vh`]);

  return (
    <section
      ref={ref}
      className="relative"
      style={{
        height: `${services.length * 100}vh`,
        background:
          "radial-gradient(120% 80% at 50% 0%, #4a5a4f 0%, #364139 55%, #2a332d 100%)",
        color: "#efe9d8",
      }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Top bar */}
        <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-8 pt-8 md:px-12">
          <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#efe9d8]/70">
            — Menu
          </span>
          <span className="font-display text-[22px] leading-none">
            tero<span className="font-body font-medium tracking-tight italic">studios</span>
          </span>
          <a
            href="/contact"
            className="font-body text-[13px] text-[#efe9d8]/80 hover:text-[#efe9d8] transition-colors"
          >
            Let's chat →
          </a>
        </div>

        {/* Left number rail */}
        <div className="pointer-events-none absolute left-8 top-1/2 -translate-y-1/2 z-20 hidden md:block">
          <ul className="space-y-2 font-mono text-[11px]">
            {services.map((s, i) => (
              <li
                key={s.n}
                className={[
                  "flex items-center gap-3 transition-colors",
                  i === active ? "text-[#efe9d8]" : "text-[#efe9d8]/35",
                ].join(" ")}
              >
                <span>{s.n}</span>
                {i === active && (
                  <>
                    <span className="inline-block h-px w-6 bg-[#efe9d8]" />
                    <span className="font-body italic text-[12px]">They scroll</span>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Right side: mark + description */}
        <div className="absolute right-8 md:right-16 top-1/2 -translate-y-1/2 z-20 w-[42%] md:w-[34%] max-w-md">
          <AnimatePresence mode="wait">
            <motion.div
              key={services[active].n}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-start gap-8"
            >
              <div
                className="font-display text-[clamp(64px,8vw,128px)] leading-none"
                style={{ color: "#efe9d8", letterSpacing: "-0.04em" }}
              >
                {services[active].mark}
                <span className="text-[#efe9d8]/60">↑</span>
              </div>
              <p className="font-body text-[15px] md:text-[16px] leading-relaxed text-[#efe9d8]/85">
                {services[active].desc}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* The vertically scrolling stack of service names (left/center column) */}
        <div className="relative h-full">
          {/* center alignment marker (50vh) */}
          <motion.ul
            style={{ y }}
            className="absolute left-[8%] md:left-[14%] top-1/2 will-change-transform"
          >
            {services.map((s, i) => {
              const isActive = i === active;
              return (
                <li
                  key={s.n}
                  style={{
                    height: `${ITEM_VH}vh`,
                    transform: `rotate(${s.tilt}deg)`,
                  }}
                  className="flex items-center"
                >
                  <motion.span
                    animate={{
                      opacity: isActive ? 1 : 0.18,
                      filter: isActive ? "blur(0px)" : "blur(2px)",
                      scale: isActive ? 1 : 0.92,
                    }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="font-display font-bold leading-[0.85] italic"
                    style={{
                      fontSize: "clamp(64px, 12vw, 180px)",
                      color: "#efe9d8",
                      letterSpacing: "-0.04em",
                      textShadow: isActive
                        ? "0 0 60px rgba(239,233,216,0.25)"
                        : "none",
                      display: "block",
                      transformOrigin: "left center",
                    }}
                  >
                    {s.name}
                  </motion.span>
                </li>
              );
            })}
          </motion.ul>
        </div>

        {/* Bottom counter */}
        <div className="absolute inset-x-0 bottom-0 z-20 flex items-center justify-between px-8 pb-8 md:px-12 font-mono text-[11px] uppercase tracking-[0.25em] text-[#efe9d8]/60">
          <span>— They trust us</span>
          <span>
            {String(active + 1).padStart(2, "0")} / {String(services.length).padStart(2, "0")}
          </span>
        </div>
      </div>
    </section>
  );
}
