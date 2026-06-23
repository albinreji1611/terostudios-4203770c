import { useMemo, useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { videos } from "@/data/videos";

/**
 * Anamorphic reel stage (space backdrop).
 *
 *   ACT 1 (scroll 0 → 0.5)
 *     A deck of video cards rises from below and fans into a wide horizontal
 *     band at the center of the viewport (gentle anamorphic tilt).
 *
 *   ACT 2 (scroll 0.5 → 1)
 *     The fan dissolves while a 3-row reel wall settles into the same band.
 *     Rows pan left/right (alternating) with subtle perspective curve.
 *
 *   Heading sits pinned at the top; wall is anchored to the lower middle so
 *   nothing overlaps. Background is deep space with a faint star field.
 */

// ── Fan (Act 1) ──
const FAN_COUNT = 11;
const FAN_SPREAD_X = 720;
const FAN_SPREAD_Y = 70;
const FAN_ROT = 28;

// ── Wall (Act 2) ──
const ROWS = 3;
const TILES_PER_ROW = 7;
const TILE_W = 240;
const TILE_H = 140;
const ROW_GAP = 56;
const COL_GAP = 28;
const CURVE = 18; // gentler wrap so rotated tiles don't bleed into neighbors
const DEPTH = 110;

const FAN = Array.from({ length: FAN_COUNT }, (_, i) => {
  const halfN = (FAN_COUNT - 1) / 2;
  const t = (i - halfN) / halfN; // -1..1
  return {
    t,
    finalX: t * FAN_SPREAD_X,
    finalY: Math.abs(t) * FAN_SPREAD_Y,
    finalRotZ: t * (FAN_ROT * 0.4),
    finalRotY: -t * 14,
    z: -Math.abs(t) * 140,
    w: 280 - Math.abs(t) * 50,
  };
});

export function CylinderGallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const p = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 30,
    mass: 0.45,
  });

  // Smoother handoff: both layers overlap from 0.42 → 0.62.
  const fanOpacity = useTransform(p, [0, 0.42, 0.6], [1, 1, 0]);
  const fanScale = useTransform(p, [0.42, 0.62], [1, 0.96]);
  const wallOpacity = useTransform(p, [0.42, 0.62, 1], [0, 1, 1]);
  const wallScale = useTransform(p, [0.42, 0.62], [0.96, 1]);

  const rows = useMemo(
    () =>
      Array.from({ length: ROWS }, (_, r) => {
        const base = Array.from({ length: TILES_PER_ROW }, (_, c) => {
          const idx = (r * TILES_PER_ROW + c) % videos.length;
          return videos[idx];
        });
        return [...base, ...base];
      }),
    [],
  );

  const halfC = (TILES_PER_ROW - 1) / 2;

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#02030a] text-cream"
      style={{ height: "300vh" }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* ── Space backdrop ── */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(80% 60% at 50% 35%, #0a0d1a 0%, #02030a 70%, #000 100%)",
          }}
        />
        {/* Faint starfield (CSS-only) */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none opacity-60"
          style={{
            backgroundImage: `
              radial-gradient(1px 1px at 12% 18%, rgba(255,255,255,0.9), transparent 60%),
              radial-gradient(1px 1px at 27% 72%, rgba(255,255,255,0.7), transparent 60%),
              radial-gradient(1.5px 1.5px at 41% 34%, rgba(255,255,255,0.85), transparent 60%),
              radial-gradient(1px 1px at 58% 80%, rgba(255,255,255,0.6), transparent 60%),
              radial-gradient(1px 1px at 67% 22%, rgba(255,255,255,0.8), transparent 60%),
              radial-gradient(1.2px 1.2px at 78% 58%, rgba(255,255,255,0.7), transparent 60%),
              radial-gradient(1px 1px at 89% 11%, rgba(255,255,255,0.85), transparent 60%),
              radial-gradient(1px 1px at 8% 88%, rgba(255,255,255,0.65), transparent 60%),
              radial-gradient(1px 1px at 50% 50%, rgba(255,255,255,0.55), transparent 60%)
            `,
          }}
        />

        {/* ── Heading (pinned top, ample headroom) ── */}
        <div className="absolute inset-x-0 top-0 z-40 px-6 pt-8 md:pt-12 text-center">
          <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-cream/55">
            Reel Wall · Anamorphic Theatre
          </span>
          <h2 className="mt-3 font-display text-[clamp(1.8rem,3.6vw,3rem)] leading-[1.04] tracking-[-0.02em] text-cream">
            Stories That Bend Reality
          </h2>
          <p className="mt-2 text-[11px] md:text-[12px] tracking-[0.22em] uppercase text-cream/50">
            Anamorphic worlds, crafted frame by frame
          </p>
        </div>

        {/* ── Stage anchor: vertically centered with top padding so the heading never overlaps ── */}
        <div className="absolute inset-0 flex items-center justify-center pt-[180px] md:pt-[200px] pb-16">
          <div className="relative w-full h-full">
            {/* ACT 1 — fan */}
            <motion.div
              className="absolute inset-0 z-10 flex items-center justify-center"
              style={{
                perspective: "1800px",
                perspectiveOrigin: "50% 50%",
                opacity: fanOpacity,
                scale: fanScale,
              }}
            >
              <div
                className="relative"
                style={{ transformStyle: "preserve-3d", width: 1, height: 1 }}
              >
                {FAN.map((f, i) => (
                  <FanCard
                    key={i}
                    f={f}
                    index={i}
                    total={FAN_COUNT}
                    progress={p}
                    url={videos[i % videos.length].url}
                  />
                ))}
              </div>
            </motion.div>

            {/* ACT 2 — reel wall */}
            <motion.div
              className="absolute inset-0 z-20 flex items-center justify-center"
              style={{
                perspective: "1800px",
                perspectiveOrigin: "50% 50%",
                opacity: wallOpacity,
                scale: wallScale,
              }}
            >
              <div
                className="relative mx-auto"
                style={{
                  transformStyle: "preserve-3d",
                  width: "min(1400px, 96vw)",
                }}
              >
                {rows.map((rowTiles, r) => {
                  const dir = r % 2 === 0 ? "tero-row-left" : "tero-row-right";
                  const duration = 42 + r * 8;
                  return (
                    <div
                      key={r}
                      className="relative mx-auto"
                      style={{
                        marginTop: r === 0 ? 0 : ROW_GAP,
                        height: TILE_H,
                        width: "100%",
                        overflow: "hidden",
                        maskImage:
                          "linear-gradient(90deg, transparent 0%, #000 14%, #000 86%, transparent 100%)",
                      }}
                    >
                      <div
                        className="absolute top-0 left-0 flex"
                        style={{
                          gap: COL_GAP,
                          animation: `${dir} ${duration}s linear infinite`,
                          transformStyle: "preserve-3d",
                        }}
                      >
                        {rowTiles.map((vid, c) => {
                          const cMod = c % TILES_PER_ROW;
                          const t = (cMod - halfC) / halfC;
                          const rotY = -t * (CURVE / 2);
                          const tz = -Math.abs(t) * DEPTH;
                          return (
                            <div
                              key={`${r}-${c}`}
                              className="relative shrink-0 overflow-hidden rounded-[10px] ring-1 ring-cream/10 bg-black"
                              style={{
                                width: TILE_W,
                                height: TILE_H,
                                transform: `rotateY(${rotY}deg) translateZ(${tz}px)`,
                                transformStyle: "preserve-3d",
                                boxShadow:
                                  "0 30px 60px -30px rgba(0,0,0,0.85), inset 0 0 40px rgba(0,0,0,0.35)",
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
                              />
                              <div
                                aria-hidden
                                className="absolute inset-0 pointer-events-none"
                                style={{
                                  background:
                                    "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.35) 100%)",
                                }}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Edge vignettes */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-[16%] z-30"
          style={{
            background:
              "linear-gradient(90deg, #02030a 8%, rgba(2,3,10,0.5) 60%, transparent 100%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-[16%] z-30"
          style={{
            background:
              "linear-gradient(-90deg, #02030a 8%, rgba(2,3,10,0.5) 60%, transparent 100%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[20%] z-30"
          style={{
            background: "linear-gradient(0deg, #02030a 8%, transparent 100%)",
          }}
        />

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 font-mono text-[10px] uppercase tracking-[0.3em] text-cream/40">
          scroll ↓
        </div>
      </div>
    </section>
  );
}

type FanItem = (typeof FAN)[number];

function FanCard({
  f,
  index,
  total,
  progress,
  url,
}: {
  f: FanItem;
  index: number;
  total: number;
  progress: MotionValue<number>;
  url: string;
}) {
  // Stagger emergence from center outward.
  const order = Math.abs(index - (total - 1) / 2);
  const delay = order * 0.022;
  const start = delay;
  const end = delay + 0.38;

  const y = useTransform(progress, [start, end], [780, f.finalY]);
  const x = useTransform(progress, [start, end], [0, f.finalX]);
  const rotZ = useTransform(progress, [start, end], [0, f.finalRotZ]);
  const rotY = useTransform(progress, [start, end], [0, f.finalRotY]);
  const scl = useTransform(progress, [start, end], [0.5, 1]);
  const op = useTransform(
    progress,
    [start, start + 0.05, end, 0.55],
    [0, 1, 1, 0.9],
  );

  return (
    <motion.div
      className="absolute overflow-hidden rounded-[12px] ring-1 ring-cream/15 bg-black"
      style={{
        left: 0,
        top: 0,
        width: f.w,
        height: f.w * 0.6,
        x,
        y,
        z: f.z,
        scale: scl,
        rotateY: rotY,
        rotateZ: rotZ,
        opacity: op,
        transformStyle: "preserve-3d",
        translateX: "-50%",
        translateY: "-50%",
        zIndex: 100 - Math.round(Math.abs(f.t) * 50),
        boxShadow:
          "0 60px 120px -40px rgba(120,140,200,0.18), 0 30px 70px -30px rgba(0,0,0,0.9), inset 0 0 40px rgba(0,0,0,0.4)",
      }}
    >
      <video
        src={url}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className="absolute inset-0 h-full w-full object-cover pointer-events-none select-none"
      />
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.45) 100%)",
        }}
      />
    </motion.div>
  );
}
