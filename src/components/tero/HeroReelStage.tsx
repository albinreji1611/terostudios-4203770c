import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { Link } from "@tanstack/react-router";
import { videos } from "@/data/videos";
import { resolveAssetUrl } from "@/lib/asset-url";
import portfolio1 from "@/assets/portfolio-1.jpg";
import portfolio2 from "@/assets/portfolio-2.jpg";
import portfolio3 from "@/assets/portfolio-3.jpg";
import portfolio4 from "@/assets/portfolio-4.jpg";
import portfolio5 from "@/assets/portfolio-5.jpg";
import portfolio6 from "@/assets/portfolio-6.jpg";

/**
 * Three separate scroll sections:
 * 1. cards punch out through the screen
 * 2. cards race in a snake path over the headline
 * 3. a curved wall of playing reels appears
 */

const CARD_COUNT = 16;
const WALL_FALLBACKS = [portfolio1, portfolio2, portfolio3, portfolio4, portfolio5, portfolio6];

type CardSeed = {
  id: number;
  url: string;
  popX: number;
  popY: number;
  popZ: number;
  popRotX: number;
  popRotY: number;
  popRotZ: number;
  snakeY: number;
  snakeRot: number;
  w: number;
  h: number;
  delay: number;
};

type WallConfig = {
  rows: number;
  tilesPerRow: number;
  tileW: number;
  tileH: number;
  colGap: number;
  curve: number;
  depth: number;
  perspective: number;
  rowSpacingPct: number;
  rowTopStartPct: number;
};

const WALL_CONFIGS: Record<"mobile" | "tablet" | "desktop", WallConfig> = {
  mobile: {
    rows: 5,
    tilesPerRow: 8,
    tileW: 174,
    tileH: 82,
    colGap: 12,
    curve: 0,
    depth: 0,
    perspective: 950,
    rowSpacingPct: 14.5,
    rowTopStartPct: 5,
  },
  tablet: {
    rows: 5,
    tilesPerRow: 10,
    tileW: 254,
    tileH: 112,
    colGap: 14,
    curve: 0,
    depth: 0,
    perspective: 1050,
    rowSpacingPct: 15,
    rowTopStartPct: 5,
  },
  desktop: {
    rows: 5,
    tilesPerRow: 11,
    tileW: 316,
    tileH: 132,
    colGap: 14,
    curve: 0,
    depth: 0,
    perspective: 1100,
    rowSpacingPct: 15,
    rowTopStartPct: 5,
  },
};

function useWallConfig(): WallConfig {
  const [cfg, setCfg] = useState<WallConfig>(WALL_CONFIGS.desktop);

  useEffect(() => {
    const pick = () => {
      const w = window.innerWidth;
      if (w < 640) return WALL_CONFIGS.mobile;
      if (w < 1024) return WALL_CONFIGS.tablet;
      return WALL_CONFIGS.desktop;
    };
    const update = () => setCfg(pick());
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return cfg;
}

function useCardSeeds(): CardSeed[] {
  return useMemo(() => {
    return Array.from({ length: CARD_COUNT }, (_, i) => {
      const u = (i - (CARD_COUNT - 1) / 2) / ((CARD_COUNT - 1) / 2);
      const angle = (i / CARD_COUNT) * Math.PI * 2 + 0.4;
      const radius = 290 + (i % 4) * 95;
      const portrait = i % 3 === 0;

      return {
        id: i,
        url: videos[i % videos.length].url,
        popX: Math.cos(angle) * radius * 1.45,
        popY: Math.sin(angle) * radius * 0.78,
        popZ: 120 + (i % 5) * 80,
        popRotX: -18 + (i % 5) * 9,
        popRotY: -34 + (i % 7) * 11,
        popRotZ: -12 + (i % 6) * 5,
        snakeY: Math.sin(u * Math.PI * 1.35) * 170,
        snakeRot: u * 12,
        w: portrait ? 128 : 184 - Math.abs(u) * 18,
        h: portrait ? 178 : 118,
        delay: (i % 8) * 0.018,
      };
    });
  }, []);
}

function useSectionProgress(ref: RefObject<HTMLElement | null>) {
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  return useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 26,
    mass: 0.42,
  });
}

function useResolvedVideoUrl(url: string) {
  const resolveForPlayback = (value: string) => {
    const resolved = resolveAssetUrl(value);
    if (typeof window === "undefined") return resolved;
    const isLocal = ["localhost", "127.0.0.1", "0.0.0.0"].includes(window.location.hostname);
    if (!isLocal) return resolved;
    const parsed = new URL(resolved, window.location.origin);
    return parsed.pathname.startsWith("/__l5e/")
      ? `https://id-preview--12ac4244-7645-4fb2-a900-5ab683320d3c.lovable.app${parsed.pathname}${parsed.search}${parsed.hash}`
      : resolved;
  };

  const [resolvedUrl, setResolvedUrl] = useState(() => resolveForPlayback(url));

  useEffect(() => {
    setResolvedUrl(resolveForPlayback(url));
  }, [url]);

  return resolvedUrl;
}

export function HeroReelStage() {
  const seeds = useCardSeeds();

  return (
    <div className="relative bg-black text-cream">
      <PopOutSection seeds={seeds} />
      <SnakeSection seeds={seeds} />
      <CurvedWallSection />
    </div>
  );
}

function Backdrop() {
  return (
    <>
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(78% 58% at 50% 48%, #0b0c12 0%, #04050a 58%, #000 100%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-45"
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
    </>
  );
}

function TopChrome() {
  return (
    <div className="absolute inset-x-0 top-0 z-50 flex items-center justify-between px-6 md:px-10 pt-6 md:pt-7 pointer-events-none">
      <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-cream/70 flex items-center gap-2.5">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-vermillion animate-pulse" />
        Tero Studios
      </span>
      <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-cream/55">
        Animation · VFX · CGI
      </span>

    </div>
  );
}

function PopOutSection({ seeds }: { seeds: CardSeed[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const p = useSectionProgress(sectionRef);
  const titleScale = useTransform(p, [0, 0.35, 0.82, 1], [0.82, 1, 1.08, 1.18]);
  const titleOpacity = useTransform(p, [0, 0.22, 0.82, 1], [0, 1, 1, 0]);
  const captionOpacity = useTransform(p, [0.28, 0.45, 0.82, 1], [0, 1, 1, 0]);

  return (
    <section ref={sectionRef} className="relative h-[260vh] bg-black text-cream">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <Backdrop />
        <TopChrome />

        <motion.div
          style={{ opacity: titleOpacity, scale: titleScale }}
          className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
        >
          <h1
            className="font-display tracking-[-0.04em] leading-none text-cream/95 select-none"
            style={{ fontSize: "clamp(7rem, 18vw, 16rem)" }}
          >
            TERO
          </h1>
        </motion.div>

        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div
            className="relative"
            style={{
              perspective: "1200px",
              perspectiveOrigin: "50% 52%",
              width: 1,
              height: 1,
              transformStyle: "preserve-3d",
            }}
          >
            {seeds.map((s) => (
              <PopOutCard key={s.id} seed={s} progress={p} />
            ))}
          </div>
        </div>

        <motion.div
          style={{ opacity: captionOpacity }}
          className="absolute inset-0 z-30 pointer-events-none"
        >
          <div className="absolute left-6 md:left-10 bottom-10 flex flex-wrap gap-1.5">
            {["3D Animation", "VFX", "CGI Films"].map((label) => (
              <span
                key={label}
                className="rounded-full bg-cream/8 ring-1 ring-cream/15 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.22em] text-cream/70"
              >
                {label}
              </span>
            ))}
          </div>
          <div className="absolute right-6 md:right-10 bottom-10 text-[10px] font-mono uppercase tracking-[0.22em] text-cream/55">
            Chennai · Est. 2015
          </div>
        </motion.div>

        <SectionFade />
      </div>
    </section>
  );
}

function SnakeSection({ seeds }: { seeds: CardSeed[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const p = useSectionProgress(sectionRef);
  const headlineX = useTransform(p, [0, 1], ["10%", "-38%"]);
  const headlineOpacity = useTransform(p, [0, 0.12, 0.88, 1], [0, 1, 1, 0]);
  const microOpacity = useTransform(p, [0.15, 0.28, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section ref={sectionRef} className="relative h-[240vh] bg-black text-cream">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <Backdrop />
        <TopChrome />

        <motion.div
          style={{ opacity: headlineOpacity, x: headlineX }}
          className="absolute inset-0 z-10 flex items-center pointer-events-none"
        >
          <h2
            className="font-display tracking-[-0.035em] text-cream/95 leading-[0.95] pl-6 md:pl-14 whitespace-nowrap"
            style={{ fontSize: "clamp(3.5rem, 11vw, 10rem)" }}
          >
            Visualization, <span className="italic font-light text-cream/85">revolutionized.</span>
          </h2>
        </motion.div>

        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div
            className="relative"
            style={{
              perspective: "1700px",
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
        </div>

        <motion.div
          style={{ opacity: microOpacity }}
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

        <SectionFade />
      </div>
    </section>
  );
}

function CurvedWallSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const p = useSectionProgress(sectionRef);
  const wallOpacity = useTransform(p, [0, 1], [1, 1]);
  const wallScale = useTransform(p, [0, 0.28, 1], [1.01, 1, 1]);
  const wallY = useTransform(p, [0, 1], ["0vh", "0vh"]);
  const cfg = useWallConfig();

  const rows = useMemo(
    () =>
      Array.from({ length: cfg.rows }, (_, r) => {
        const base = Array.from({ length: cfg.tilesPerRow }, (_, c) => {
          const idx = (r * 4 + c * 2) % videos.length;
          return videos[idx];
        });
        return [...base, ...base];
      }),
    [cfg.rows, cfg.tilesPerRow],
  );

  return (
    <section ref={sectionRef} data-hide-site-nav="true" className="relative h-[260vh] bg-black text-cream">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <Backdrop />

        <motion.div
          style={{ opacity: wallOpacity, scale: wallScale, y: wallY }}
          className="absolute inset-0 z-10 overflow-hidden"
        >
          <div
            className="absolute left-1/2 top-[6vh] h-[68vh] w-[232vw] sm:w-[204vw] lg:w-[196vw]"
            style={{ transform: "translateX(-50%)" }}
          >
            {rows.map((rowTiles, r) => {
              const dir = r % 2 === 0 ? "tero-row-left" : "tero-row-right";
              const duration = 34 + r * 6;
              const rowTop = cfg.rowTopStartPct + r * cfg.rowSpacingPct;

              return (
                <div
                  key={r}
                  className="absolute left-1/2 overflow-visible"
                  style={{
                    top: `${rowTop}%`,
                    height: cfg.tileH,
                    width: "100%",
                    transform: "translateX(-50%)",
                  }}
                >
                  <div
                    className="absolute top-0 left-0 flex"
                    style={{
                      left: r % 2 === 0 ? "-8%" : "-27%",
                      gap: cfg.colGap,
                      animation: `${dir} ${duration}s linear infinite`,
                    }}
                  >
                    {rowTiles.map((vid, c) => {
                      return (
                        <WallTile
                          key={`${r}-${c}`}
                          url={vid.url}
                          fallback={WALL_FALLBACKS[(r + c) % WALL_FALLBACKS.length]}
                          w={cfg.tileW}
                          h={cfg.tileH}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>


        <div
          aria-hidden
          className="absolute inset-0 z-20 pointer-events-none"
          style={{
            background:
              "radial-gradient(100% 68% at 50% 28%, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 62%, rgba(0,0,0,0.26) 100%)",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-[38%] z-30 pointer-events-none"
          style={{
            background:
              "linear-gradient(0deg, #000 12%, rgba(0,0,0,0.92) 38%, rgba(0,0,0,0.46) 68%, transparent 100%)",
          }}
        />

      </div>
    </section>
  );
}

function WallTile({ url, fallback, w, h }: { url: string; fallback: string; w: number; h: number }) {
  const videoUrl = useResolvedVideoUrl(url);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    setVideoReady(false);
  }, [videoUrl]);

  return (
    <div
      className="relative shrink-0 overflow-hidden rounded-[18px] ring-1 ring-cream/10 bg-black"
      style={{
        width: w,
        height: h,
        boxShadow:
          "0 18px 42px -30px rgba(0,0,0,0.82)",
      }}
    >
      <img
        src={fallback}
        alt=""
        loading="lazy"
        className="absolute inset-0 z-10 h-full w-full object-cover pointer-events-none select-none"
      />
      <video
        src={videoUrl}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        onCanPlay={() => setVideoReady(true)}
        onError={() => setVideoReady(false)}
        className={`absolute inset-0 z-20 h-full w-full object-cover pointer-events-none select-none transition-opacity duration-300 ${videoReady ? "opacity-100" : "opacity-0"}`}
      />
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0) 48%, rgba(0,0,0,0.16) 100%)",
        }}
      />
    </div>
  );
}

function SectionFade() {
  return (
    <>
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
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[16%] z-40"
        style={{ background: "linear-gradient(0deg, #000 8%, transparent 100%)" }}
      />
    </>
  );
}

function PopOutCard({
  seed,
  progress,
}: {
  seed: CardSeed;
  progress: MotionValue<number>;
}) {
  const videoUrl = useResolvedVideoUrl(seed.url);
  const start = 0.04 + seed.delay;
  const hit = 0.35 + seed.delay * 0.35;
  const hold = 0.8;

  const x = useTransform(progress, [start, hit, hold, 1], [0, seed.popX, seed.popX * 1.08, seed.popX * 1.22]);
  const y = useTransform(progress, [start, hit, hold, 1], [0, seed.popY, seed.popY * 1.05, seed.popY * 1.16]);
  const z = useTransform(progress, [start, hit, 1], [-980, seed.popZ, seed.popZ + 160]);
  const scale = useTransform(progress, [start, hit, 1], [0.08, 1, 1.12]);
  const opacity = useTransform(progress, [start, start + 0.05, 0.86, 1], [0, 1, 1, 0]);
  const rotateX = useTransform(progress, [start, hit], [0, seed.popRotX]);
  const rotateY = useTransform(progress, [start, hit], [0, seed.popRotY]);
  const rotateZ = useTransform(progress, [start, hit], [0, seed.popRotZ]);

  return (
    <motion.div
      className="absolute overflow-hidden rounded-[14px] ring-1 ring-cream/12 bg-black"
      style={{
        left: 0,
        top: 0,
        width: seed.w + 28,
        height: seed.h,
        x,
        y,
        z,
        scale,
        opacity,
        rotateX,
        rotateY,
        rotateZ,
        transformStyle: "preserve-3d",
        translateX: "-50%",
        translateY: "-50%",
        boxShadow:
          "0 40px 80px -30px rgba(0,0,0,0.9), inset 0 0 25px rgba(0,0,0,0.3)",
      }}
    >
      <video
        src={videoUrl}
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

function SnakeCard({
  seed,
  progress,
}: {
  seed: CardSeed;
  progress: MotionValue<number>;
}) {
  const videoUrl = useResolvedVideoUrl(seed.url);
  const shift = (seed.id / CARD_COUNT) * 0.34;
  const enterAt = 0.02 + shift;
  const midAt = 0.36 + shift * 0.45;
  const exitAt = 0.74 + shift * 0.25;

  const x = useTransform(
    progress,
    [enterAt, midAt, exitAt],
    [-980, seed.id % 2 === 0 ? 40 : -60, 980],
  );
  const y = useTransform(
    progress,
    [enterAt, midAt, exitAt],
    [seed.snakeY - 180, seed.snakeY, seed.snakeY + 120],
  );
  const z = useTransform(progress, [enterAt, midAt, exitAt], [-240, 150, -180]);
  const opacity = useTransform(
    progress,
    [enterAt - 0.03, enterAt + 0.04, exitAt - 0.08, exitAt],
    [0, 1, 1, 0],
  );
  const rotateZ = useTransform(progress, [enterAt, midAt, exitAt], [-18, seed.snakeRot, 16]);
  const rotateY = useTransform(progress, [enterAt, midAt, exitAt], [-30, 0, 28]);

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
        z,
        rotateZ,
        rotateY,
        opacity,
        transformStyle: "preserve-3d",
        translateX: "-50%",
        translateY: "-50%",
        boxShadow:
          "0 50px 100px -30px rgba(0,0,0,0.9), inset 0 0 30px rgba(0,0,0,0.35)",
      }}
    >
      <video
        src={videoUrl}
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