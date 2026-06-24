import { useMemo, useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { Link } from "@tanstack/react-router";
import { videos } from "@/data/videos";

/**
 * HeroReelStage — single scroll-driven sticky stage that replaces the old
 * hero + cylinder gallery. Four acts unfold over ~500vh of scroll:
 *
 *   ACT 1 (0.00 → 0.18)   Black void. Top chrome + tiny brand pulse fade in.
 *   ACT 2 (0.10 → 0.42)   Thumbnail cards burst forward from the center,
 *                         scatter across the screen in 3D (anamorphic pop-out).
 *   ACT 3 (0.36 → 0.62)   Cards reorganize into a floating "snake" arc that
 *                         drifts across the viewport; centered headline
 *                         "Stories that move." rises with brand caption.
 *   ACT 4 (0.58 → 1.00)   Cards dissolve. A curved cylindrical wall of
 *                         *playing* videos settles in, with a center
 *                         glass headline + prompt-style search bar.
 *
 * Background is pitch black with a soft starfield wash, matching the
 * reference video aesthetic.
 */

// ── Pop-out cards (Act 2 + Act 3) ──
const CARD_COUNT = 14;

type CardSeed = {
  id: number;
  url: string;
  // Final scattered position (Act 2 end)
  sx: number; // px from center
  sy: number;
  srot: number; // deg
  sscale: number;
  sz: number;
  // Final snake position (Act 3 end) — arc across viewport
  nx: number;
  ny: number;
  nrot: number;
  nscale: number;
  // Visual size
  w: number;
  h: number;
  delay: number;
};

function useCardSeeds(): CardSeed[] {
  return useMemo(() => {
    const seeds: CardSeed[] = [];
    for (let i = 0; i < CARD_COUNT; i++) {
      const t = (i + 0.5) / CARD_COUNT; // 0..1
      const v = videos[i % videos.length];
      // Scatter ring
      const ang = t * Math.PI * 2 + (i % 2 ? 0.3 : -0.3);
      const radius = 240 + (i % 3) * 110;
      const sx = Math.cos(ang) * radius * (1.1 + (i % 4) * 0.18);
      const sy = Math.sin(ang) * radius * (0.55 + (i % 3) * 0.18);
      // Snake arc — sinusoidal band across screen
      const u = (i - (CARD_COUNT - 1) / 2) / ((CARD_COUNT - 1) / 2); // -1..1
      const nx = u * 720;
      const ny = Math.sin(u * Math.PI * 1.1) * 120 - 20;
      const w = 220 - Math.abs(u) * 40 + (i % 3) * 8;
      const h = w * (i % 2 ? 0.62 : 1.35); // mix landscape + portrait like reference
      seeds.push({
        id: i,
        url: v.url,
        sx,
        sy,
        srot: (Math.random() - 0.5) * 18,
        sscale: 0.85 + (i % 3) * 0.12,
        sz: (Math.random() - 0.5) * 240,
        nx,
        ny,
        nrot: u * 8,
        nscale: 0.9,
        w,
        h,
        delay: (i % 7) * 0.018,
      });
    }
    return seeds;
  }, []);
}

// ── Curved wall (Act 4) ──
const WALL_ROWS = 3;
const TILES_PER_ROW = 7;
const TILE_W = 260;
const TILE_H = 150;
const ROW_GAP = 22;
const COL_GAP = 18;
const WALL_CURVE = 26; // deg per tile from center
const WALL_DEPTH = 140;

export function HeroReelStage() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const p = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.5,
  });

  const seeds = useCardSeeds();

  // Act opacities/scales
  const headerOpacity = useTransform(p, [0, 0.04, 0.92, 1], [0, 1, 1, 0.6]);
  const cardsOpacity = useTransform(
    p,
    [0.08, 0.16, 0.6, 0.66],
    [0, 1, 1, 0],
  );
  const headlineOpacity = useTransform(
    p,
    [0.34, 0.44, 0.6, 0.66],
    [0, 1, 1, 0],
  );
  const wallOpacity = useTransform(p, [0.58, 0.7, 1], [0, 1, 1]);
  const wallScale = useTransform(p, [0.58, 0.78], [0.92, 1]);
  const finalHeroOpacity = useTransform(p, [0.7, 0.82], [0, 1]);

  // Rows for wall
  const rows = useMemo(
    () =>
      Array.from({ length: WALL_ROWS }, (_, r) => {
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
      className="relative bg-black text-cream"
      style={{ height: "520vh" }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* ── Backdrop: deep black + soft star wash ── */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(75% 55% at 50% 50%, #0b0c10 0%, #04050a 60%, #000 100%)",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none opacity-50"
          style={{
            backgroundImage: `
              radial-gradient(1px 1px at 12% 18%, rgba(255,255,255,0.9), transparent 60%),
              radial-gradient(1px 1px at 27% 72%, rgba(255,255,255,0.6), transparent 60%),
              radial-gradient(1.5px 1.5px at 41% 34%, rgba(255,255,255,0.85), transparent 60%),
              radial-gradient(1px 1px at 58% 80%, rgba(255,255,255,0.55), transparent 60%),
              radial-gradient(1px 1px at 67% 22%, rgba(255,255,255,0.8), transparent 60%),
              radial-gradient(1.2px 1.2px at 78% 58%, rgba(255,255,255,0.65), transparent 60%),
              radial-gradient(1px 1px at 89% 11%, rgba(255,255,255,0.8), transparent 60%),
              radial-gradient(1px 1px at 8% 88%, rgba(255,255,255,0.6), transparent 60%)
            `,
          }}
        />

        {/* ── Top chrome (always present) ── */}
        <motion.div
          style={{ opacity: headerOpacity }}
          className="absolute inset-x-0 top-0 z-50 flex items-center justify-between px-6 md:px-10 pt-6 md:pt-7 pointer-events-none"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-cream/70 flex items-center gap-2.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-vermillion animate-pulse" />
            Tero Studios
          </span>
          <div className="hidden md:flex items-center gap-1 rounded-full bg-cream/10 backdrop-blur-md ring-1 ring-cream/15 p-1">
            <span className="px-4 py-1.5 rounded-full bg-cream text-black text-[10px] font-mono uppercase tracking-[0.22em]">
              Create
            </span>
            <span className="px-4 py-1.5 rounded-full text-cream/70 text-[10px] font-mono uppercase tracking-[0.22em]">
              Explore
            </span>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-cream/55">
            Reels · Chennai 13.08°N
          </span>
        </motion.div>

        {/* ── ACT 2/3 — Pop-out + snake cards ── */}
        <motion.div
          style={{ opacity: cardsOpacity }}
          className="absolute inset-0 z-20 flex items-center justify-center"
        >
          <div
            className="relative"
            style={{
              perspective: "1600px",
              perspectiveOrigin: "50% 50%",
              width: 1,
              height: 1,
              transformStyle: "preserve-3d",
            }}
          >
            {seeds.map((s) => (
              <PopCard key={s.id} seed={s} progress={p} />
            ))}
          </div>
        </motion.div>

        {/* ── ACT 3 — Centered headline above snake ── */}
        <motion.div
          style={{ opacity: headlineOpacity }}
          className="absolute inset-0 z-30 flex flex-col items-center justify-center px-6 text-center pointer-events-none"
        >
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="h-px w-10 bg-vermillion/70" />
            <p className="font-mono text-[10px] uppercase tracking-[0.45em] text-vermillion">
              A studio of moving things
            </p>
            <span className="h-px w-10 bg-vermillion/70" />
          </div>
          <h1 className="font-display text-[clamp(2.4rem,7vw,6.5rem)] leading-[0.95] tracking-[-0.03em] text-cream">
            Stories that <span className="italic font-light text-cream/70">move.</span>
          </h1>
          <p className="mt-5 max-w-xl text-[12px] md:text-[13px] tracking-[0.18em] uppercase text-cream/55">
            Frames that stay. Anamorphic worlds, crafted in Chennai.
          </p>
        </motion.div>

        {/* ── ACT 4 — Curved playing-video wall ── */}
        <motion.div
          style={{ opacity: wallOpacity, scale: wallScale }}
          className="absolute inset-0 z-10 flex items-center justify-center"
        >
          <div
            className="relative mx-auto"
            style={{
              perspective: "1400px",
              perspectiveOrigin: "50% 50%",
              width: "min(1500px, 100vw)",
              transformStyle: "preserve-3d",
            }}
          >
            {rows.map((rowTiles, r) => {
              const dir = r % 2 === 0 ? "tero-row-left" : "tero-row-right";
              const duration = 48 + r * 10;
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
                      "linear-gradient(90deg, transparent 0%, #000 10%, #000 90%, transparent 100%)",
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
                      const rotY = -t * (WALL_CURVE / 1.5);
                      const tz = -Math.abs(t) * WALL_DEPTH;
                      return (
                        <div
                          key={`${r}-${c}`}
                          className="relative shrink-0 overflow-hidden rounded-[12px] ring-1 ring-cream/10 bg-black"
                          style={{
                            width: TILE_W,
                            height: TILE_H,
                            transform: `rotateY(${rotY}deg) translateZ(${tz}px)`,
                            transformStyle: "preserve-3d",
                            boxShadow:
                              "0 30px 60px -30px rgba(0,0,0,0.9), inset 0 0 50px rgba(0,0,0,0.45)",
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
                                "linear-gradient(180deg, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.45) 100%)",
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

          {/* Center glass headline + prompt bar (over the wall) */}
          <motion.div
            style={{ opacity: finalHeroOpacity }}
            className="absolute inset-x-0 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center justify-center px-6 text-center"
          >
            <div className="rounded-[28px] bg-black/35 backdrop-blur-md ring-1 ring-cream/10 px-8 md:px-14 py-7 md:py-9 max-w-[680px]">
              <h2 className="font-display text-[clamp(1.9rem,4.6vw,3.6rem)] leading-[1] tracking-[-0.025em] text-cream">
                Your Next Big
                <br />
                Idea Starts Here
              </h2>
              <p className="mt-3 text-[11px] md:text-[12px] tracking-[0.22em] uppercase text-cream/60">
                Imagination is the first step to creation
              </p>
            </div>

            <div className="mt-6 w-full max-w-[640px] pointer-events-auto">
              <div className="flex items-center gap-2 rounded-full bg-cream/8 backdrop-blur-md ring-1 ring-cream/15 pl-5 pr-1.5 py-1.5">
                <input
                  type="text"
                  placeholder="A cinematic 3D anamorphic spot for our brand…"
                  className="flex-1 bg-transparent text-cream placeholder:text-cream/50 text-[13px] md:text-[14px] py-2.5 outline-none"
                />
                <Link
                  to="/contact"
                  className="rounded-full bg-vermillion text-cream px-5 py-2.5 text-[11px] font-mono font-bold uppercase tracking-[0.22em] hover:bg-cream hover:text-black transition-colors"
                >
                  Create →
                </Link>
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                {["3D", "Anamorphic", "VFX", "AI", "Brand"].map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-cream/8 ring-1 ring-cream/15 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.22em] text-cream/70"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Edge vignettes */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-[14%] z-40"
          style={{
            background:
              "linear-gradient(90deg, #000 8%, rgba(0,0,0,0.5) 60%, transparent 100%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-[14%] z-40"
          style={{
            background:
              "linear-gradient(-90deg, #000 8%, rgba(0,0,0,0.5) 60%, transparent 100%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[18%] z-40"
          style={{
            background: "linear-gradient(0deg, #000 6%, transparent 100%)",
          }}
        />

        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-50 font-mono text-[10px] uppercase tracking-[0.3em] text-cream/40">
          scroll ↓
        </div>
      </div>
    </section>
  );
}

function PopCard({
  seed,
  progress,
}: {
  seed: CardSeed;
  progress: MotionValue<number>;
}) {
  // Three-stage motion mapped to scroll:
  //   start (0.10 + delay) → scattered (0.34)
  //   scattered (0.34) → snake (0.5)
  //   snake (0.5) → fade out (0.62)
  const a = 0.1 + seed.delay;
  const b = 0.34;
  const c = 0.5;
  const d = 0.62;

  const x = useTransform(progress, [a, b, c, d], [0, seed.sx, seed.nx, seed.nx]);
  const y = useTransform(
    progress,
    [a, b, c, d],
    [0, seed.sy, seed.ny, seed.ny - 40],
  );
  const z = useTransform(progress, [a, b, c, d], [-600, seed.sz, 0, 60]);
  const rot = useTransform(
    progress,
    [a, b, c, d],
    [0, seed.srot, seed.nrot, seed.nrot],
  );
  const rotY = useTransform(
    progress,
    [a, b, c, d],
    [0, seed.srot * 0.6, seed.nrot * 2, seed.nrot * 2],
  );
  const scale = useTransform(
    progress,
    [a, a + 0.04, b, c, d],
    [0.2, seed.sscale, seed.sscale, seed.nscale, seed.nscale * 0.9],
  );
  const op = useTransform(
    progress,
    [a, a + 0.05, c, d],
    [0, 1, 1, 0],
  );

  return (
    <motion.div
      className="absolute overflow-hidden rounded-[18px] ring-1 ring-cream/15 bg-black"
      style={{
        left: 0,
        top: 0,
        width: seed.w,
        height: seed.h,
        x,
        y,
        z,
        rotateZ: rot,
        rotateY: rotY,
        scale,
        opacity: op,
        transformStyle: "preserve-3d",
        translateX: "-50%",
        translateY: "-50%",
        zIndex: 100 - Math.abs(seed.sz | 0),
        boxShadow:
          "0 60px 120px -40px rgba(120,140,200,0.18), 0 30px 70px -30px rgba(0,0,0,0.9), inset 0 0 40px rgba(0,0,0,0.45)",
      }}
    >
      <video
        src={seed.url}
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
