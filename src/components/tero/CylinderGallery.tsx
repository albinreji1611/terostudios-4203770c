import { useRef, useMemo } from "react";
import { useScroll, useTransform, useSpring, motion } from "framer-motion";
import { videos } from "@/data/videos";

/**
 * Curved concave video-wall hero (reference: "Your Next Big Idea Starts Here").
 * A grid of video tiles arranged across 4 rows, each row curved horizontally
 * by per-tile rotateY + translateZ so the wall wraps toward the camera on
 * both sides. The center stays flat and readable; the heading floats over
 * the wall. Scroll subtly pushes the wall back and drifts it sideways.
 */

const ROWS = 4;
const COLS = 9; // odd → true center column
const TILE_W = 200;
const TILE_H = 120;
const GAP = 10;
const CURVE = 55; // degrees of total horizontal wrap
const DEPTH = 360; // how far side tiles recede

export function CylinderGallery() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const smooth = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 26,
    mass: 0.5,
  });

  const drift = useTransform(smooth, [0, 1], [-6, 6]);
  const pushZ = useTransform(smooth, [0, 0.5, 1], [-40, 0, -40]);

  // Stable tile assignment
  const tiles = useMemo(() => {
    const out: { row: number; col: number; vid: (typeof videos)[number] }[] = [];
    let k = 0;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        out.push({ row: r, col: c, vid: videos[k % videos.length] });
        k++;
      }
    }
    return out;
  }, []);

  const halfC = (COLS - 1) / 2;
  const halfR = (ROWS - 1) / 2;

  return (
    <section
      ref={ref}
      className="relative bg-ink text-cream overflow-hidden"
      style={{ height: "150vh" }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Backdrop glow */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(70% 55% at 50% 50%, rgba(232,57,14,0.14) 0%, transparent 65%), #0a0b10",
          }}
        />

        {/* Curved video wall stage */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            perspective: "1400px",
            perspectiveOrigin: "50% 50%",
          }}
        >
          <motion.div
            className="relative"
            style={{
              transformStyle: "preserve-3d",
              rotateY: drift,
              z: pushZ,
            }}
          >
            {tiles.map(({ row, col, vid }, i) => {
              const dxFromCenter = col - halfC; // -halfC..+halfC
              const dyFromCenter = row - halfR;
              const t = dxFromCenter / halfC; // -1..1
              const rotY = -t * (CURVE / 2);
              const tz = -Math.abs(t) * DEPTH;
              // Slight vertical recession for top/bottom rows
              const rotX = (dyFromCenter / halfR) * 6;

              const x = dxFromCenter * (TILE_W + GAP);
              const y = dyFromCenter * (TILE_H + GAP);

              // Dim tiles behind center text band
              const nearCenter =
                Math.abs(dxFromCenter) <= 1.5 && Math.abs(dyFromCenter) <= 0.6;

              return (
                <div
                  key={i}
                  className="absolute left-1/2 top-1/2 overflow-hidden rounded-[6px] ring-1 ring-cream/10 bg-black"
                  style={{
                    width: TILE_W,
                    height: TILE_H,
                    transform: `translate(-50%, -50%) translate3d(${x}px, ${y}px, 0) rotateY(${rotY}deg) rotateX(${rotX}deg) translateZ(${tz}px)`,
                    transformStyle: "preserve-3d",
                    boxShadow:
                      "0 30px 60px -30px rgba(0,0,0,0.7), inset 0 0 40px rgba(0,0,0,0.35)",
                  }}
                >
                  <video
                    src={vid.url}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    className="absolute inset-0 h-full w-full object-cover pointer-events-none select-none"
                    style={{
                      filter: nearCenter
                        ? "brightness(0.35) saturate(0.9)"
                        : "brightness(0.85) saturate(1.05)",
                    }}
                  />
                  {/* Per-tile inner darkening for depth */}
                  <div
                    aria-hidden
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.0) 40%, rgba(0,0,0,0.35) 100%)",
                    }}
                  />
                </div>
              );
            })}
          </motion.div>
        </motion.div>

        {/* Edge vignettes to deepen the wrap */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-[28%]"
          style={{
            background:
              "linear-gradient(90deg, #0a0b10 10%, rgba(10,11,16,0.6) 60%, transparent 100%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-[28%]"
          style={{
            background:
              "linear-gradient(-90deg, #0a0b10 10%, rgba(10,11,16,0.6) 60%, transparent 100%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[18%]"
          style={{
            background:
              "linear-gradient(180deg, #0a0b10 0%, transparent 100%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[28%]"
          style={{
            background:
              "linear-gradient(0deg, #0a0b10 10%, transparent 100%)",
          }}
        />

        {/* Center spotlight to make text readable */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(28% 22% at 50% 50%, rgba(10,11,16,0.85) 0%, rgba(10,11,16,0.55) 50%, transparent 80%)",
          }}
        />

        {/* HUD: top center pills */}
        <div className="absolute inset-x-0 top-[80px] md:top-[96px] z-30 flex items-center justify-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em]">
          <span className="rounded-full bg-cream text-ink px-4 py-1.5">
            Reels
          </span>
          <span className="rounded-full bg-cream/10 text-cream/80 px-4 py-1.5 ring-1 ring-cream/15">
            Explore
          </span>
        </div>

        {/* Center heading */}
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center px-6 text-center">
          <h2 className="font-display text-[clamp(2.4rem,5.5vw,4.8rem)] leading-[1.02] tracking-[-0.02em] text-cream">
            Stories That
            <br />
            Bend Reality
          </h2>
          <p className="mt-4 text-[13px] md:text-sm tracking-[0.18em] uppercase text-cream/60">
            Anamorphic worlds, crafted frame by frame
          </p>

          {/* Faux command bar */}
          <div className="mt-10 w-[min(560px,90vw)] rounded-full bg-cream/95 text-ink/70 pl-5 pr-2 py-2 flex items-center justify-between shadow-[0_20px_50px_-10px_rgba(0,0,0,0.6)]">
            <span className="text-[13px] truncate">
              A futuristic anamorphic reel for…
            </span>
            <button className="rounded-full bg-ink text-cream text-[11px] tracking-[0.25em] uppercase px-4 py-2">
              Create ↗
            </button>
          </div>
        </div>

        {/* Bottom corner labels */}
        <div className="absolute bottom-6 left-6 md:left-12 z-30 font-mono text-[10px] uppercase tracking-[0.3em] text-cream/50">
          tero / reel-wall v3
        </div>
        <div className="absolute bottom-6 right-6 md:right-12 z-30 font-mono text-[10px] uppercase tracking-[0.3em] text-cream/50">
          Smart Editing Tools
        </div>
      </div>
    </section>
  );
}
