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
 * HeroReelStage — 3 clearly separated acts over ~700vh of sticky scroll.
 * Modeled directly after the reference recording.
 *
 *   ACT 1 (0.00 → 0.30)  Black void. Small thumbnails pop forward and
 *                        cluster around the center where the brand
 *                        wordmark "TERO" reveals between them. Corner
 *                        captions fade in.
 *
 *   ACT 2 (0.28 → 0.62)  Thumbnails break formation and drift across
 *                        the screen in a flowing snake while a massive
 *                        headline "Revolutionizing motion." passes
 *                        BEHIND them.
 *
 *   ACT 3 (0.60 → 1.00)  Snake dissolves into a FLAT full-bleed grid
 *                        wall of playing reels. Sidebar nav, center
 *                        glass headline, prompt bar with chip filters.
 */

const CARD_COUNT = 12;

type CardSeed = {
  id: number;
  url: string;
  // cluster (act 1) — small ring around wordmark
  cx: number;
  cy: number;
  cscale: number;
  // snake (act 2) — across the screen
  nx: number;
  ny: number;
  nrot: number;
  // size
  w: number;
  h: number;
  delay: number;
};

function useCardSeeds(): CardSeed[] {
  return useMemo(() => {
    const seeds: CardSeed[] = [];
    for (let i = 0; i < CARD_COUNT; i++) {
      const t = i / CARD_COUNT;
      const v = videos[i % videos.length];
      // cluster: small ring of thumbnails close to center, varying radii
      const ang = t * Math.PI * 2 + 0.25;
      const r = 170 + (i % 3) * 70;
      const cx = Math.cos(ang) * r * 1.3;
      const cy = Math.sin(ang) * r * 0.55;
      // snake: long arc across viewport
      const u = (i - (CARD_COUNT - 1) / 2) / ((CARD_COUNT - 1) / 2);
      const nx = u * 760;
      const ny = Math.sin(u * Math.PI * 1.2) * 130;
      const portrait = i % 3 === 0;
      const w = portrait ? 130 : 180 - Math.abs(u) * 20;
      const h = portrait ? 180 : 120;
      seeds.push({
        id: i,
        url: v.url,
        cx,
        cy,
        cscale: 0.85 + (i % 3) * 0.08,
        nx,
        ny,
        nrot: u * 6,
        w,
        h,
        delay: (i % 6) * 0.012,
      });
    }
    return seeds;
  }, []);
}

// Flat grid wall
const WALL_ROWS = 4;
const TILES_PER_ROW = 7;
const TILE_W = 230;
const TILE_H = 145;
const ROW_GAP = 14;
const COL_GAP = 14;

export function HeroReelStage() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const p = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 28,
    mass: 0.45,
  });

  const seeds = useCardSeeds();

  // Top chrome always on
  const chromeOpacity = useTransform(p, [0, 0.03, 0.97, 1], [0, 1, 1, 0.7]);

  // ── ACT 1 — cluster + wordmark
  const cardsClusterOpacity = useTransform(
    p,
    [0.04, 0.12, 0.28, 0.34],
    [0, 1, 1, 0],
  );
  const wordmarkOpacity = useTransform(
    p,
    [0.08, 0.16, 0.28, 0.34],
    [0, 1, 1, 0],
  );
  const captionsOpacity = useTransform(
    p,
    [0.14, 0.2, 0.28, 0.34],
    [0, 1, 1, 0],
  );

  // ── ACT 2 — snake + massive headline
  const cardsSnakeOpacity = useTransform(
    p,
    [0.3, 0.4, 0.58, 0.66],
    [0, 1, 1, 0],
  );
  // Headline scrolls horizontally behind the snake
  const headlineX = useTransform(p, [0.28, 0.62], ["20%", "-30%"]);
  const headlineOpacity = useTransform(
    p,
    [0.3, 0.4, 0.58, 0.66],
    [0, 1, 1, 0],
  );

  // ── ACT 3 — flat grid wall + hero panel
  const wallOpacity = useTransform(p, [0.6, 0.72, 1], [0, 1, 1]);
  const wallScale = useTransform(p, [0.6, 0.78], [1.08, 1]);
  const heroPanelOpacity = useTransform(p, [0.72, 0.84], [0, 1]);
  const sidebarOpacity = useTransform(p, [0.7, 0.82], [0, 1]);

  const rows = useMemo(
    () =>
      Array.from({ length: WALL_ROWS }, (_, r) => {
        const base = Array.from({ length: TILES_PER_ROW }, (_, c) => {
          const idx = (r * 3 + c * 2) % videos.length;
          return videos[idx];
        });
        return [...base, ...base];
      }),
    [],
  );

  return (
    <section
      ref={sectionRef}
      className="relative bg-black text-cream"
      style={{ height: "700vh" }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Deep space backdrop */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(80% 60% at 50% 50%, #0a0b10 0%, #04050a 60%, #000 100%)",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            backgroundImage: `
              radial-gradient(1px 1px at 12% 18%, rgba(255,255,255,0.8), transparent 60%),
              radial-gradient(1px 1px at 27% 72%, rgba(255,255,255,0.55), transparent 60%),
              radial-gradient(1.5px 1.5px at 41% 34%, rgba(255,255,255,0.8), transparent 60%),
              radial-gradient(1px 1px at 58% 80%, rgba(255,255,255,0.5), transparent 60%),
              radial-gradient(1px 1px at 67% 22%, rgba(255,255,255,0.75), transparent 60%),
              radial-gradient(1.2px 1.2px at 78% 58%, rgba(255,255,255,0.6), transparent 60%),
              radial-gradient(1px 1px at 89% 11%, rgba(255,255,255,0.75), transparent 60%),
              radial-gradient(1px 1px at 8% 88%, rgba(255,255,255,0.55), transparent 60%)
            `,
          }}
        />

        {/* Top chrome */}
        <motion.div
          style={{ opacity: chromeOpacity }}
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
            Smart Editing Tools
          </span>
        </motion.div>

        {/* ─────────── ACT 1 — cluster + wordmark ─────────── */}
        <motion.div
          style={{ opacity: wordmarkOpacity }}
          className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
        >
          <h1
            className="font-display tracking-[-0.04em] leading-none text-cream/95 select-none"
            style={{ fontSize: "clamp(7rem, 18vw, 16rem)" }}
          >
            TERO
          </h1>
        </motion.div>

        <motion.div
          style={{ opacity: cardsClusterOpacity }}
          className="absolute inset-0 z-20 flex items-center justify-center"
        >
          <div
            className="relative"
            style={{
              perspective: "1500px",
              perspectiveOrigin: "50% 50%",
              width: 1,
              height: 1,
              transformStyle: "preserve-3d",
            }}
          >
            {seeds.map((s) => (
              <ClusterCard key={s.id} seed={s} progress={p} />
            ))}
          </div>
        </motion.div>

        {/* Act 1 corner captions */}
        <motion.div
          style={{ opacity: captionsOpacity }}
          className="absolute inset-0 z-30 pointer-events-none"
        >
          <div className="absolute left-6 md:left-10 top-1/3 text-cream/85">
            <p className="text-[13px] md:text-[14px] leading-tight">
              Instant
              <br />
              Visual
              <br />
              Stories
            </p>
          </div>
          <div className="absolute right-1/2 translate-x-[180px] top-1/3 text-cream/85 hidden md:block">
            <p className="text-[13px] md:text-[14px] leading-tight">
              Cinematic
              <br />
              brand
              <br />
              worlds
            </p>
          </div>
          <div className="absolute right-6 md:right-10 top-1/3">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-cream/10 ring-1 ring-cream/20 backdrop-blur-md px-4 py-2 text-[10px] font-mono uppercase tracking-[0.22em] text-cream hover:bg-cream hover:text-black transition-colors pointer-events-auto"
            >
              Get started with Tero ↗
            </Link>
          </div>
          <div className="absolute left-6 md:left-10 bottom-10 flex flex-wrap gap-1.5">
            <span className="rounded-full bg-cream/8 ring-1 ring-cream/15 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.22em] text-cream/70">
              + Creativity
            </span>
            <span className="rounded-full bg-cream/8 ring-1 ring-cream/15 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.22em] text-cream/70">
              Quality
            </span>
            <span className="rounded-full bg-cream/8 ring-1 ring-cream/15 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.22em] text-cream/70">
              Endless Customization
            </span>
          </div>
        </motion.div>

        {/* ─────────── ACT 2 — snake + huge headline ─────────── */}
        <motion.div
          style={{ opacity: headlineOpacity, x: headlineX }}
          className="absolute inset-0 z-10 flex items-center pointer-events-none"
        >
          <h2
            className="font-display whitespace-nowrap tracking-[-0.04em] text-cream/95 leading-[0.85]"
            style={{ fontSize: "clamp(6rem, 16vw, 14rem)" }}
          >
            Revolutionizing <span className="italic font-light text-cream/80">motion.</span>
          </h2>
        </motion.div>

        <motion.div
          style={{ opacity: cardsSnakeOpacity }}
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
              <SnakeCard key={s.id} seed={s} progress={p} />
            ))}
          </div>
        </motion.div>

        {/* Act 2 corner micro labels */}
        <motion.div
          style={{ opacity: cardsSnakeOpacity }}
          className="absolute inset-0 z-30 pointer-events-none"
        >
          <p className="absolute left-6 md:left-10 top-24 text-[11px] tracking-[0.18em] uppercase text-cream/55 max-w-[160px] leading-snug">
            Create
            <br />
            compelling
            <br />
            visuals
          </p>
          <p className="absolute right-6 md:right-10 bottom-10 text-[11px] tracking-[0.18em] uppercase text-cream/55 max-w-[220px] text-right leading-snug">
            Join the next generation
            <br />
            of moving stories.
          </p>
        </motion.div>

        {/* ─────────── ACT 3 — FLAT grid wall + hero panel ─────────── */}
        <motion.div
          style={{ opacity: wallOpacity, scale: wallScale }}
          className="absolute inset-0 z-10"
        >
          <div className="absolute inset-0 flex flex-col items-stretch justify-center gap-3 px-2">
            {rows.map((rowTiles, r) => {
              const dir = r % 2 === 0 ? "tero-row-left" : "tero-row-right";
              const duration = 70 + r * 12;
              return (
                <div
                  key={r}
                  className="relative w-full overflow-hidden"
                  style={{
                    height: TILE_H,
                    maskImage:
                      "linear-gradient(90deg, transparent 0%, #000 6%, #000 94%, transparent 100%)",
                  }}
                >
                  <div
                    className="absolute top-0 left-0 flex"
                    style={{
                      gap: COL_GAP,
                      animation: `${dir} ${duration}s linear infinite`,
                    }}
                  >
                    {rowTiles.map((vid, c) => (
                      <div
                        key={`${r}-${c}`}
                        className="relative shrink-0 overflow-hidden rounded-[10px] ring-1 ring-cream/10 bg-black"
                        style={{
                          width: TILE_W,
                          height: TILE_H,
                          boxShadow:
                            "0 18px 40px -20px rgba(0,0,0,0.8), inset 0 0 30px rgba(0,0,0,0.35)",
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
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Center dim for legibility */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(45% 40% at 50% 50%, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.25) 60%, transparent 100%)",
            }}
          />

          {/* Sidebar nav */}
          <motion.aside
            style={{ opacity: sidebarOpacity }}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-2"
          >
            {[
              { label: "Home", icon: "◐" },
              { label: "Creations", icon: "✦" },
              { label: "Canvas", icon: "◇" },
              { label: "Plans", icon: "◎" },
            ].map((it) => (
              <button
                key={it.label}
                className="flex items-center gap-3 rounded-full bg-black/45 backdrop-blur-md ring-1 ring-cream/12 pl-2.5 pr-5 py-2 text-[11px] font-mono uppercase tracking-[0.18em] text-cream/85 hover:text-cream hover:bg-black/65 transition-colors"
              >
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-cream/10 ring-1 ring-cream/15 text-cream">
                  {it.icon}
                </span>
                {it.label}
              </button>
            ))}
          </motion.aside>

          {/* Center glass headline + prompt bar */}
          <motion.div
            style={{ opacity: heroPanelOpacity }}
            className="absolute inset-x-0 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center justify-center px-6 text-center"
          >
            <h2 className="font-display text-[clamp(2rem,5vw,4rem)] leading-[1] tracking-[-0.025em] text-cream drop-shadow-[0_4px_30px_rgba(0,0,0,0.8)]">
              Your Next Big
              <br />
              Idea Starts Here
            </h2>
            <p className="mt-3 text-[11px] md:text-[12px] tracking-[0.22em] uppercase text-cream/70">
              Imagination is the first step to creation
            </p>

            <div className="mt-7 w-full max-w-[640px] pointer-events-auto">
              <div className="flex items-center gap-2 rounded-full bg-black/55 backdrop-blur-md ring-1 ring-cream/15 pl-5 pr-1.5 py-1.5">
                <input
                  type="text"
                  placeholder="A cinematic anamorphic spot for our brand…"
                  className="flex-1 bg-transparent text-cream placeholder:text-cream/55 text-[13px] md:text-[14px] py-2.5 outline-none"
                />
                <Link
                  to="/contact"
                  className="rounded-full bg-cream text-black px-5 py-2.5 text-[11px] font-mono font-bold uppercase tracking-[0.22em] hover:bg-vermillion hover:text-cream transition-colors"
                >
                  Create →
                </Link>
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                {["3D", "Quality", "Style", "Color"].map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-black/50 backdrop-blur-md ring-1 ring-cream/15 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.22em] text-cream/80"
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
          className="pointer-events-none absolute inset-y-0 left-0 w-[10%] z-40"
          style={{
            background:
              "linear-gradient(90deg, #000 8%, rgba(0,0,0,0.4) 60%, transparent 100%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-[10%] z-40"
          style={{
            background:
              "linear-gradient(-90deg, #000 8%, rgba(0,0,0,0.4) 60%, transparent 100%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[14%] z-40"
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

// ACT 1 cluster card — pops forward from far Z, lands at cx/cy near center
function ClusterCard({
  seed,
  progress,
}: {
  seed: CardSeed;
  progress: MotionValue<number>;
}) {
  const a = 0.04 + seed.delay;
  const b = 0.18;
  const c = 0.28;

  const x = useTransform(progress, [a, b, c], [0, seed.cx, seed.cx]);
  const y = useTransform(progress, [a, b, c], [0, seed.cy, seed.cy]);
  const z = useTransform(progress, [a, b, c], [-700, 0, 0]);
  const scale = useTransform(
    progress,
    [a, b, c],
    [0.2, seed.cscale, seed.cscale],
  );
  const op = useTransform(progress, [a, a + 0.04, c, c + 0.04], [0, 1, 1, 0]);

  return (
    <motion.div
      className="absolute overflow-hidden rounded-[14px] ring-1 ring-cream/12 bg-black"
      style={{
        left: 0,
        top: 0,
        width: 130,
        height: 90,
        x,
        y,
        z,
        scale,
        opacity: op,
        transformStyle: "preserve-3d",
        translateX: "-50%",
        translateY: "-50%",
        boxShadow:
          "0 40px 80px -30px rgba(0,0,0,0.9), inset 0 0 25px rgba(0,0,0,0.3)",
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
    </motion.div>
  );
}

// ACT 2 snake card — flows across viewport along arc
function SnakeCard({
  seed,
  progress,
}: {
  seed: CardSeed;
  progress: MotionValue<number>;
}) {
  // Each card enters from left, follows snake path, exits right
  const enterAt = 0.3 + (seed.id / CARD_COUNT) * 0.18;
  const exitAt = 0.5 + (seed.id / CARD_COUNT) * 0.16;

  const x = useTransform(
    progress,
    [enterAt, exitAt],
    [-900, 900],
  );
  // y oscillates as a wave
  const y = useTransform(progress, [enterAt, exitAt], [seed.ny - 30, seed.ny + 30]);
  const op = useTransform(
    progress,
    [enterAt - 0.02, enterAt + 0.04, exitAt - 0.04, exitAt],
    [0, 1, 1, 0],
  );
  const rot = useTransform(progress, [enterAt, exitAt], [-seed.nrot, seed.nrot]);

  return (
    <motion.div
      className="absolute overflow-hidden rounded-[14px] ring-1 ring-cream/12 bg-black"
      style={{
        left: 0,
        top: 0,
        width: seed.w,
        height: seed.h,
        x,
        y,
        rotateZ: rot,
        opacity: op,
        translateX: "-50%",
        translateY: "-50%",
        boxShadow:
          "0 50px 100px -30px rgba(0,0,0,0.9), inset 0 0 30px rgba(0,0,0,0.35)",
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
    </motion.div>
  );
}
