import { useRef, useState, useEffect } from "react";
import {
  useScroll,
  useTransform,
  useSpring,
  motion,
  useMotionValueEvent,
} from "framer-motion";
import { videos } from "@/data/videos";

const items = videos.slice(0, 8);

/**
 * Anamorphic DOOH billboard stage.
 * A massive corner-wrapped LED screen (two faces meeting at a 90° edge)
 * sits center-stage. The active reel "breaks out" of the corner with a
 * 3D forced-perspective illusion — content appears to leap forward off
 * the screen. Scroll cycles through reels; a vertical filmstrip on the
 * right tracks position; a holographic data HUD frames the stage.
 */
export function CylinderGallery() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const smooth = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 26,
    mass: 0.5,
  });

  const N = items.length;
  const [active, setActive] = useState(0);
  useMotionValueEvent(smooth, "change", (v) => {
    const i = Math.min(N - 1, Math.max(0, Math.floor(v * N * 0.999)));
    if (i !== active) setActive(i);
  });

  // Build-in: corner unfolds from a flat plane into a 90° edge
  const fold = useTransform(smooth, [0, 0.12], [0, 1]);
  // Slight parallax of the whole rig
  const rigY = useTransform(smooth, [0, 1], [0, -40]);

  const [foldVal, setFoldVal] = useState(0);
  useMotionValueEvent(fold, "change", (v) => setFoldVal(v));

  // Clock for HUD
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const current = items[active];

  return (
    <section
      ref={ref}
      className="relative bg-ink text-cream"
      style={{ height: `${100 + N * 60}vh` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* === Backdrop: grid + scanlines + vignette === */}
        <div
          aria-hidden
          className="absolute inset-0 z-0"
          style={{
            background:
              "radial-gradient(60% 50% at 50% 45%, rgba(232,57,14,0.18) 0%, transparent 65%), #0b0c10",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 z-[1] opacity-[0.18]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(247,231,204,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(247,231,204,0.18) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage:
              "radial-gradient(70% 60% at 50% 55%, black 30%, transparent 80%)",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 z-[1] pointer-events-none mix-blend-overlay opacity-30"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, rgba(247,231,204,0.08) 0px, rgba(247,231,204,0.08) 1px, transparent 1px, transparent 3px)",
          }}
        />

        {/* === Header HUD === */}
        <div className="absolute inset-x-0 top-[80px] md:top-[96px] z-30 flex items-start justify-between px-6 md:px-12 font-mono text-[10px] uppercase tracking-[0.3em] text-cream/55">
          <div className="flex flex-col gap-1">
            <span className="text-vermillion">● LIVE FEED</span>
            <span>tero / dooh-stage v2.39</span>
          </div>
          <div className="hidden md:flex flex-col items-center gap-1">
            <span className="font-display text-[11px] tracking-[0.4em] text-cream">
              ANAMORPHIC THEATRE
            </span>
            <span>Stories that move.</span>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span>
              {String(active + 1).padStart(2, "0")} / {String(N).padStart(2, "0")}
            </span>
            <span>{new Date().toLocaleTimeString([], { hour12: false })}</span>
          </div>
        </div>

        {/* === Center stage: corner-wrap LED billboard === */}
        <motion.div
          className="absolute inset-0 z-10 flex items-center justify-center"
          style={{
            y: rigY,
            perspective: "1800px",
            perspectiveOrigin: "50% 50%",
          }}
        >
          <div
            className="relative"
            style={{
              width: "min(78vw, 1100px)",
              height: "min(56vh, 560px)",
              transformStyle: "preserve-3d",
              transform: `rotateX(${(1 - foldVal) * 8 - 4}deg)`,
            }}
          >
            {/* LEFT FACE of the corner */}
            <div
              className="absolute left-0 top-0 h-full w-1/2 origin-right overflow-hidden bg-black ring-1 ring-cream/15"
              style={{
                transform: `rotateY(${foldVal * 35}deg) translateZ(0px)`,
                transformStyle: "preserve-3d",
                boxShadow:
                  "inset 0 0 80px rgba(0,0,0,0.6), 0 60px 120px -40px rgba(0,0,0,0.8)",
              }}
            >
              <video
                key={`L-${active}`}
                src={current.url}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                className="absolute inset-0 h-full w-full object-cover pointer-events-none select-none"
                style={{ filter: "saturate(1.1) brightness(0.95)" }}
              />
              {/* Anamorphic break-out: left half of the image is shifted/scaled to feel like it leaves the screen */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(0,0,0,0) 60%, rgba(0,0,0,0.55) 100%)",
                }}
              />
              {/* LED pixel mask */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 mix-blend-multiply opacity-40"
                style={{
                  backgroundImage:
                    "radial-gradient(rgba(0,0,0,0.55) 1px, transparent 1.6px)",
                  backgroundSize: "5px 5px",
                }}
              />
            </div>

            {/* RIGHT FACE of the corner */}
            <div
              className="absolute right-0 top-0 h-full w-1/2 origin-left overflow-hidden bg-black ring-1 ring-cream/15"
              style={{
                transform: `rotateY(${-foldVal * 35}deg) translateZ(0px)`,
                transformStyle: "preserve-3d",
                boxShadow:
                  "inset 0 0 80px rgba(0,0,0,0.6), 0 60px 120px -40px rgba(0,0,0,0.8)",
              }}
            >
              <video
                key={`R-${active}`}
                src={current.url}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                className="absolute inset-0 h-full w-full object-cover pointer-events-none select-none"
                style={{
                  filter: "saturate(1.1) brightness(0.95)",
                  transform: "scaleX(-1)",
                }}
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(-90deg, rgba(0,0,0,0) 60%, rgba(0,0,0,0.55) 100%)",
                }}
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 mix-blend-multiply opacity-40"
                style={{
                  backgroundImage:
                    "radial-gradient(rgba(0,0,0,0.55) 1px, transparent 1.6px)",
                  backgroundSize: "5px 5px",
                }}
              />
            </div>

            {/* Bright corner seam */}
            <div
              aria-hidden
              className="pointer-events-none absolute top-0 bottom-0 left-1/2 w-px"
              style={{
                background:
                  "linear-gradient(180deg, transparent 0%, rgba(247,231,204,0.7) 50%, transparent 100%)",
                boxShadow: "0 0 24px rgba(232,57,14,0.55)",
                transform: `translateX(-0.5px) scaleY(${0.6 + 0.4 * foldVal})`,
              }}
            />

            {/* Break-out element: a tilted floating "leap" frame */}
            <motion.div
              key={`leap-${active}`}
              initial={{ opacity: 0, y: 20, rotateX: -20 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="absolute left-1/2 top-1/2 overflow-hidden rounded-[2px] bg-black ring-1 ring-vermillion/60"
              style={{
                width: "min(36vw, 460px)",
                aspectRatio: "2.39 / 1",
                transform:
                  "translate(-50%, -40%) translateZ(220px) rotateX(8deg)",
                transformStyle: "preserve-3d",
                boxShadow:
                  "0 60px 140px -30px rgba(232,57,14,0.55), 0 30px 80px -20px rgba(0,0,0,0.9)",
              }}
            >
              <video
                key={`F-${active}`}
                src={current.url}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                className="absolute inset-0 h-full w-full object-cover pointer-events-none select-none"
              />
              {/* Letterbox */}
              <div aria-hidden className="absolute inset-x-0 top-0 h-[5%] bg-black" />
              <div aria-hidden className="absolute inset-x-0 bottom-0 h-[5%] bg-black" />
              {/* Lens flare */}
              <div
                aria-hidden
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(50% 80% at 25% 30%, rgba(247,231,204,0.22) 0%, transparent 55%)",
                  mixBlendMode: "screen",
                }}
              />
              {/* Caption */}
              <div className="absolute bottom-[7%] left-3 right-3 flex items-end justify-between font-mono text-[10px] uppercase tracking-[0.28em] text-cream/90">
                <span>{String(active + 1).padStart(2, "0")}</span>
                <span className="font-display tracking-[0.2em]">
                  {current.client}
                </span>
              </div>
            </motion.div>

            {/* Stage floor reflection */}
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-full h-32 w-[120%] -translate-x-1/2"
              style={{
                background:
                  "linear-gradient(180deg, rgba(232,57,14,0.25), transparent 70%)",
                filter: "blur(20px)",
              }}
            />
          </div>
        </motion.div>

        {/* === Left meta panel === */}
        <div className="absolute left-6 md:left-12 top-1/2 z-20 -translate-y-1/2 hidden md:flex flex-col gap-6 font-mono text-[10px] uppercase tracking-[0.28em] text-cream/65">
          <div className="flex flex-col gap-1 border-l border-cream/20 pl-3">
            <span className="text-cream/40">Client</span>
            <span className="text-cream font-display text-[15px] tracking-[0.05em] normal-case">
              {current.client}
            </span>
          </div>
          <div className="flex flex-col gap-1 border-l border-cream/20 pl-3">
            <span className="text-cream/40">Title</span>
            <span className="text-cream/90 normal-case tracking-normal">
              {current.title}
            </span>
          </div>
          <div className="flex flex-col gap-1 border-l border-vermillion/70 pl-3">
            <span className="text-cream/40">Service</span>
            <span className="text-vermillion">{current.service}</span>
          </div>
          <div className="flex flex-col gap-1 border-l border-cream/20 pl-3">
            <span className="text-cream/40">Industry</span>
            <span>{current.industry}</span>
          </div>
        </div>

        {/* === Right filmstrip === */}
        <div className="absolute right-6 md:right-12 top-1/2 z-20 -translate-y-1/2 flex flex-col gap-2">
          {items.map((it, i) => {
            const isActive = i === active;
            return (
              <div
                key={i}
                className="relative overflow-hidden ring-1 transition-all duration-500"
                style={{
                  width: isActive ? 96 : 56,
                  height: isActive ? 40 : 22,
                  borderColor: isActive
                    ? "rgba(232,57,14,0.9)"
                    : "rgba(247,231,204,0.18)",
                  boxShadow: isActive
                    ? "0 0 30px rgba(232,57,14,0.4)"
                    : "none",
                  opacity: isActive ? 1 : 0.45,
                }}
              >
                <video
                  src={it.url}
                  muted
                  loop
                  playsInline
                  autoPlay={isActive}
                  preload="metadata"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                {!isActive && (
                  <div className="absolute inset-0 bg-ink/40 mix-blend-multiply" />
                )}
              </div>
            );
          })}
        </div>

        {/* === Bottom HUD rail === */}
        <div className="absolute inset-x-0 bottom-6 z-30 flex items-center justify-between px-6 md:px-12 font-mono text-[10px] uppercase tracking-[0.3em] text-cream/55">
          <div className="flex items-center gap-3">
            <span className="text-vermillion">REC</span>
            <span className="h-1.5 w-1.5 rounded-full bg-vermillion animate-pulse" />
            <span>00:{String(tick % 60).padStart(2, "0")}</span>
          </div>
          <div className="flex-1 mx-6 h-px bg-cream/15 relative">
            <motion.div
              className="absolute top-0 left-0 h-px bg-vermillion"
              style={{ width: `${((active + 1) / N) * 100}%` }}
            />
          </div>
          <span>Scroll to cycle ↓</span>
        </div>
      </div>
    </section>
  );
}
