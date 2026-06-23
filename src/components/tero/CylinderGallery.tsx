import { useMemo, useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { videos } from "@/data/videos";

/**
 * Two-act anamorphic stage:
 *   Act 1 (scroll 0 → 0.55): a swarm of video cards bursts toward the camera
 *     in 3D space — anamorphic pop-in. Cards orbit, tilt, and rush forward.
 *   Act 2 (scroll 0.55 → 1): the swarm settles into a curved 4-row reel wall
 *     where each row scrolls left/right (alternating).
 * Heading is fixed at the top of the sticky viewport throughout.
 */

const SWARM_COUNT = 14;

// Wall config
const ROWS = 4;
const TILES_PER_ROW = 7;
const TILE_W = 220;
const TILE_H = 130;
const GAP = 14;
const CURVE = 60;
const DEPTH = 380;

// Pre-computed scatter positions for the swarm (deterministic, looks random)
const SCATTER = Array.from({ length: SWARM_COUNT }, (_, i) => {
  const a = (i * 137.508) % 360; // golden-angle spread
  const rad = (a * Math.PI) / 180;
  const radius = 280 + ((i * 53) % 220); // 280..500
  const x = Math.cos(rad) * radius;
  const y = Math.sin(rad) * radius * 0.55; // flatter ellipse
  const z = -800 - ((i * 71) % 600); // start far away
  const rotY = ((i * 47) % 60) - 30; // -30..30
  const rotX = ((i * 31) % 24) - 12; // -12..12
  const rotZ = ((i * 19) % 18) - 9;
  return { x, y, z, rotY, rotX, rotZ, w: 280 + ((i * 23) % 120) };
});

export function CylinderGallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 28, mass: 0.5 });

  // Act split — 0..0.55 swarm, 0.55..1 wall
  const swarmOpacity = useTransform(p, [0, 0.45, 0.6], [1, 1, 0]);
  const wallOpacity = useTransform(p, [0.45, 0.6, 1], [0, 1, 1]);
  const wallScale = useTransform(p, [0.45, 0.7], [0.9, 1]);

  // Stable per-row tiles for the wall, duplicated for marquee.
  const rows = useMemo(() => {
    return Array.from({ length: ROWS }, (_, r) => {
      const base = Array.from({ length: TILES_PER_ROW }, (_, c) => {
        const idx = (r * TILES_PER_ROW + c) % videos.length;
        return videos[idx];
      });
      return [...base, ...base];
    });
  }, []);

  const halfC = (TILES_PER_ROW - 1) / 2;

  return (
    <section
      ref={sectionRef}
      className="relative bg-ink text-cream"
      style={{ height: "320vh" }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Backdrop glow */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(70% 55% at 50% 50%, rgba(232,57,14,0.16) 0%, transparent 65%), #0a0b10",
          }}
        />

        {/* ── Fixed heading on top ── */}
        <div className="absolute inset-x-0 top-0 z-40 px-6 pt-10 md:pt-14 text-center">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-cream/60">
            Reel Wall · Anamorphic Theatre
          </span>
          <h2 className="mt-3 font-display text-[clamp(2rem,4.6vw,4rem)] leading-[1.02] tracking-[-0.02em] text-cream">
            Stories That Bend Reality
          </h2>
          <p className="mt-2 text-[12px] md:text-[13px] tracking-[0.18em] uppercase text-cream/55">
            Anamorphic worlds, crafted frame by frame
          </p>
        </div>

        {/* ── ACT 1: Swarm of anamorphic cards bursting toward viewer ── */}
        <motion.div
          className="absolute inset-0 z-10 flex items-center justify-center"
          style={{
            perspective: "1400px",
            perspectiveOrigin: "50% 55%",
            opacity: swarmOpacity,
          }}
        >
          <div
            className="relative"
            style={{ transformStyle: "preserve-3d", width: 1, height: 1 }}
          >
            {SCATTER.map((s, i) => {
              const vid = videos[i % videos.length];
              // Each card flies from z=s.z (far) → z=120 (in front of viewer)
              const z = useTransform(p, [0, 0.5], [s.z, 120]);
              const scl = useTransform(p, [0, 0.5], [0.6, 1.05]);
              const op = useTransform(p, [0, 0.08, 0.5, 0.55], [0, 1, 1, 0.85]);
              // Slight orbital drift as they approach
              const driftX = useTransform(p, [0, 0.5], [s.x * 0.4, s.x]);
              const driftY = useTransform(p, [0, 0.5], [s.y * 0.4, s.y]);
              const rotYv = useTransform(p, [0, 0.5], [s.rotY * 0.4, s.rotY]);
              return (
                <motion.div
                  key={i}
                  className="absolute overflow-hidden rounded-[10px] ring-1 ring-cream/15 bg-black"
                  style={{
                    left: 0,
                    top: 0,
                    width: s.w,
                    height: s.w * 0.56,
                    x: driftX,
                    y: driftY,
                    z,
                    scale: scl,
                    rotateY: rotYv,
                    rotateX: s.rotX,
                    rotateZ: s.rotZ,
                    opacity: op,
                    transformStyle: "preserve-3d",
                    translateX: "-50%",
                    translateY: "-50%",
                    boxShadow:
                      "0 50px 100px -40px rgba(232,57,14,0.35), 0 30px 60px -30px rgba(0,0,0,0.8), inset 0 0 40px rgba(0,0,0,0.4)",
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
                        "linear-gradient(180deg, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.4) 100%)",
                    }}
                  />
                </motion.div>
              );
            })}
          </div>

          {/* Center scan-line shimmer */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-1/2 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(232,57,14,0.55), transparent)",
              transform: "translateY(-0.5px)",
            }}
          />
        </motion.div>

        {/* ── ACT 2: Curved 4-row reel wall (rows scroll left/right) ── */}
        <motion.div
          className="absolute inset-0 z-20 flex items-center justify-center"
          style={{
            perspective: "1500px",
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
              const duration = 38 + r * 6;
              return (
                <div
                  key={r}
                  className="relative mx-auto"
                  style={{
                    marginTop: r === 0 ? 0 : GAP,
                    height: TILE_H,
                    width: "100%",
                    overflow: "hidden",
                    maskImage:
                      "linear-gradient(90deg, transparent 0%, #000 12%, #000 88%, transparent 100%)",
                  }}
                >
                  <div
                    className="absolute top-0 left-0 flex"
                    style={{
                      gap: GAP,
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
                          className="relative shrink-0 overflow-hidden rounded-[8px] ring-1 ring-cream/10 bg-black"
                          style={{
                            width: TILE_W,
                            height: TILE_H,
                            transform: `rotateY(${rotY}deg) translateZ(${tz}px)`,
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

        {/* Edge vignettes */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-[18%] z-30"
          style={{
            background:
              "linear-gradient(90deg, #0a0b10 10%, rgba(10,11,16,0.5) 60%, transparent 100%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-[18%] z-30"
          style={{
            background:
              "linear-gradient(-90deg, #0a0b10 10%, rgba(10,11,16,0.5) 60%, transparent 100%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[18%] z-30"
          style={{
            background: "linear-gradient(0deg, #0a0b10 10%, transparent 100%)",
          }}
        />

        {/* Scroll hint */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 font-mono text-[10px] uppercase tracking-[0.3em] text-cream/40">
          scroll ↓
        </div>
      </div>
    </section>
  );
}
