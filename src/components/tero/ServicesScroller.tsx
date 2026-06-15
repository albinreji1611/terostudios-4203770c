import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { GrainMorph } from "./GrainMorph";

const services = [
  {
    n: "01",
    name: "Brand Storytelling",
    mark: "BS",
    desc: "Editorial films and motion identities that translate brand DNA into stories people remember.",
    tag: "Narrative",
    tilt: 0,
  },
  {
    n: "02",
    name: "Anamorphic & DOOH",
    mark: "AN",
    desc: "Forced-perspective 3D spectacles built for billboards, LED corners and out-of-home moments.",
    tag: "Out of home",
    tilt: 0,
  },
  {
    n: "03",
    name: "Immersive XR Training",
    mark: "XR",
    desc: "VR, AR and mixed-reality modules that turn complex SOPs into hands-on muscle memory.",
    tag: "XR learning",
    tilt: 0,
  },
  {
    n: "04",
    name: "PropViz Experiences",
    mark: "PV",
    desc: "Real-time architectural walkthroughs, CGI films and interactive sales tools for property.",
    tag: "Real estate",
    tilt: 0,
  },
  {
    n: "05",
    name: "Event & Immersive Hardware",
    mark: "EV",
    desc: "Stage visuals, projection mapping and custom hardware that turn venues into experiences.",
    tag: "On ground",
    tilt: 0,
  },
  {
    n: "06",
    name: "AI Content Creation",
    mark: "AI",
    desc: "Generative AI-powered visuals, motion variations and smart production pipelines that scale creativity.",
    tag: "Generative",
    tilt: 0,
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
          "radial-gradient(120% 80% at 50% 0%, #fdfaf6 0%, #f4ece0 60%, #ead9c2 100%)",
        color: "#1a1a1f",
      }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Section-scoped ambient glow — warm cream/amber/vermillion */}
        <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden" style={{ mixBlendMode: "multiply" }}>
          {[
            { color: "rgba(232,57,14,0.18)", size: 560, from: { x: "-8vw", y: "8vh" }, to: { x: "55vw", y: "65vh" }, duration: 26 },
            { color: "rgba(196,154,60,0.30)", size: 680, from: { x: "65vw", y: "-5vh" }, to: { x: "8vw", y: "70vh" }, duration: 34 },
            { color: "rgba(218,160,110,0.28)", size: 520, from: { x: "35vw", y: "75vh" }, to: { x: "78vw", y: "15vh" }, duration: 30 },
            { color: "rgba(232,57,14,0.14)", size: 440, from: { x: "5vw", y: "55vh" }, to: { x: "60vw", y: "5vh" }, duration: 38 },
          ].map((b, i) => (
            <motion.div
              key={i}
              initial={{ x: b.from.x, y: b.from.y }}
              animate={{ x: [b.from.x, b.to.x, b.from.x], y: [b.from.y, b.to.y, b.from.y] }}
              transition={{ duration: b.duration, ease: "easeInOut", repeat: Infinity }}
              style={{
                width: b.size,
                height: b.size,
                background: `radial-gradient(circle at center, ${b.color} 0%, transparent 65%)`,
                filter: "blur(70px)",
                position: "absolute",
                left: 0,
                top: 0,
                borderRadius: "9999px",
                willChange: "transform",
              }}
            />
          ))}
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage: "radial-gradient(rgba(80,50,20,0.5) 1px, transparent 1px)",
              backgroundSize: "3px 3px",
            }}
          />
        </div>

        {/* Top bar — section label, offset below the fixed nav */}
        <div className="absolute inset-x-0 top-[88px] md:top-[96px] z-20 flex flex-col items-center gap-2 px-8 md:px-12">
          <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-ink/55">
            What we craft
          </span>
          <h2 className="font-display text-[clamp(20px,2.2vw,28px)] leading-none text-ink">
            Our Primary Services
          </h2>
        </div>

        {/* Left number rail */}
        <div className="pointer-events-none absolute left-8 top-1/2 -translate-y-1/2 z-20 hidden md:block">
          <ul className="space-y-2 font-mono text-[11px]">
            {services.map((s, i) => (
              <li
                key={s.n}
                className={[
                  "flex items-center gap-3 transition-colors",
                  i === active ? "text-ink" : "text-ink/30",
                ].join(" ")}
              >
                <span>{s.n}</span>
                {i === active && (
                  <>
                    <span className="inline-block h-px w-6 bg-vermillion" />
                    <span className="font-body text-[12px] text-ink/70">{s.tag}</span>
                  </>
                )}

              </li>
            ))}
          </ul>
        </div>

        {/* Right side: mark + description */}
        <div className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 z-10 w-[32%] md:w-[26%] max-w-[340px] opacity-70 pointer-events-none">
          <GrainMorph active={active} />
        </div>

        {/* The vertically scrolling stack of service names (left/center column) */}
        <div className="relative h-full">
          <motion.ul
            style={{ y }}
            className="absolute left-[6%] md:left-[10%] right-[34%] md:right-[30%] top-1/2 will-change-transform z-20"
          >
            {services.map((s, i) => {
              const isActive = i === active;
              return (
                <li
                  key={s.n}
                  style={{ height: `${ITEM_VH}vh` }}
                  className="flex items-center"
                >
                  <motion.span
                    animate={{
                      opacity: isActive ? 1 : 0.15,
                      filter: isActive ? "blur(0px)" : "blur(2px)",
                      scale: isActive ? 1 : 0.92,
                    }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="font-display font-bold leading-[0.9]"
                    style={{
                      fontSize: "clamp(32px, 5.6vw, 96px)",
                      color: "#1a1a1f",
                      letterSpacing: "-0.03em",
                      textShadow: isActive
                        ? "0 0 60px rgba(232,57,14,0.15)"
                        : "none",
                      display: "block",
                      transformOrigin: "left center",
                      wordBreak: "break-word",
                      hyphens: "auto",
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
        <div className="absolute inset-x-0 bottom-0 z-20 flex items-center justify-between px-8 pb-8 md:px-12 font-mono text-[11px] uppercase tracking-[0.25em] text-ink/55">
          <span>— What we do</span>
          <span>
            {String(active + 1).padStart(2, "0")} / {String(services.length).padStart(2, "0")}
          </span>
        </div>
      </div>
    </section>
  );
}
