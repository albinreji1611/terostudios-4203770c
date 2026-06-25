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
import { useVideoThumbnail } from "@/lib/use-video-thumbnail";
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
  perspective: number;
  rowGap: number;
  wallTop: string;
  wallWidth: string;
  wallTilt: number;
  edgeTilt: number;
};

const WALL_CONFIGS: Record<"mobile" | "tablet" | "desktop", WallConfig> = {
  mobile: {
    rows: 4, tilesPerRow: 4, tileW: 220, tileH: 138, colGap: 6,
    perspective: 1000, rowGap: 0, wallTop: "4vh", wallWidth: "260vw", wallTilt: 12, edgeTilt: 0,
  },
  tablet: {
    rows: 4, tilesPerRow: 5, tileW: 280, tileH: 176, colGap: 8,
    perspective: 1000, rowGap: 0, wallTop: "2vh", wallWidth: "230vw", wallTilt: 12, edgeTilt: 0,
  },
  desktop: {
    rows: 4, tilesPerRow: 6, tileW: 320, tileH: 200, colGap: 8,
    perspective: 1000, rowGap: 0, wallTop: "2vh", wallWidth: "220vw", wallTilt: 12, edgeTilt: 0,
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

  return scrollYProgress;
}

function useResolvedVideoUrl(url: string) {
  const resolveForPlayback = (value: string) => {
    if (typeof window === "undefined") return resolveAssetUrl(value);
    const isLocal = ["localhost", "127.0.0.1", "0.0.0.0"].includes(window.location.hostname);
    const resolved = resolveAssetUrl(value);
    const parsed = new URL(resolved, window.location.origin);
    if (!isLocal) return resolved;
    return parsed.pathname.startsWith("/__l5e/")
      ? `https://id-preview--12ac4244-7645-4fb2-a900-5ab683320d3c.lovable.app${parsed.pathname}${parsed.search}${parsed.hash}`
      : resolved;
  };

  const [resolvedUrl, setResolvedUrl] = useState(url);

  useEffect(() => {
    setResolvedUrl(resolveForPlayback(url));
  }, [url]);

  return resolvedUrl;
}

export function HeroReelStage() {
  const seeds = useCardSeeds();
  const isMobile = useIsMobileViewport();

  if (isMobile) return <MobileHeroReel />;

  return (
    <div className="relative bg-black text-cream">
      <PopOutSection seeds={seeds} />
      <SnakeSection seeds={seeds} />
      <CurvedWallSection />
    </div>
  );
}

function useIsMobileViewport() {
  const [m, setM] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const on = () => setM(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return m;
}

function useViewportMetrics() {
  const [metrics, setMetrics] = useState({ width: 1440, height: 900 });

  useEffect(() => {
    const update = () => setMetrics({ width: window.innerWidth, height: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return metrics;
}

function MobileHeroReel() {
  const tiles = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => {
      const v = videos[i % videos.length];
      return { url: v.url, fallback: WALL_FALLBACKS[i % WALL_FALLBACKS.length] };
    });
  }, []);

  return (
    <section data-hide-site-nav="true" className="relative bg-black text-cream overflow-hidden">
      <Backdrop />
      {/* Headline */}
      <div className="relative z-10 px-6 pt-28 pb-10 text-center">
        <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-cream/55">
          Animation · VFX · CGI
        </span>
        <h1
          className="mt-5 font-display tracking-[-0.04em] leading-[0.9] text-cream"
          style={{ fontSize: "clamp(3.5rem, 18vw, 6rem)" }}
        >
          TERO
        </h1>
        <p className="mt-5 mx-auto max-w-[28ch] font-body text-[14px] leading-relaxed text-cream/70">
          A motion & visual effects studio crafting films, campaigns and immersive brand worlds.
        </p>
        <Link
          to="/portfolio"
          className="mt-7 inline-flex items-center gap-2 rounded-full bg-cream text-ink px-6 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.22em]"
        >
          View the reel →
        </Link>
      </div>

      {/* Vertical reel grid */}
      <div className="relative z-10 grid grid-cols-2 gap-2 px-2 pb-10">
        {tiles.map((t, i) => (
          <MobileReelTile key={i} url={t.url} fallback={t.fallback} />
        ))}
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 z-20"
        style={{ background: "linear-gradient(0deg, #000 20%, transparent 100%)" }}
      />
    </section>
  );
}

function MobileReelTile({ url, fallback }: { url: string; fallback: string }) {
  const videoUrl = useResolvedVideoUrl(url);
  const thumb = useVideoThumbnail(url);
  const ref = useRef<HTMLAnchorElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mount, setMount] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setMount(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px", threshold: 0.05 },
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || !mount) return;
    const play = () => v.play().catch(() => {});
    if (v.readyState >= 2) play();
    else v.addEventListener("loadeddata", play, { once: true });
  }, [mount, videoUrl]);

  const poster = thumb || fallback;

  return (
    <Link
      to="/portfolio"
      ref={ref as never}
      className="relative aspect-[9/14] overflow-hidden rounded-[10px] bg-black block"
      aria-label="View portfolio"
    >
      <img src={poster} alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
      {mount && (
        <video
          ref={videoRef}
          src={videoUrl}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          onCanPlay={() => setReady(true)}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${ready ? "opacity-100" : "opacity-0"}`}
        />
      )}
    </Link>
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
      <span />

      <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-cream/55">
        Animation · VFX · CGI
      </span>

    </div>
  );
}

function PopOutSection({ seeds }: { seeds: CardSeed[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const { width, height } = useViewportMetrics();
  const p = useSectionProgress(sectionRef);
  const popScale = Math.min(1, Math.max(0.58, width / 1440));
  const popYScale = Math.min(1, Math.max(0.62, height / 900));
  const titleScale = useTransform(p, [0, 0.55, 1], [1, 1.05, 1.14]);
  const titleOpacity = useTransform(p, [0, 0.08, 0.92, 1], [1, 0.68, 0.52, 0.25]);
  const captionOpacity = useTransform(p, [0.2, 0.34, 0.9, 1], [0, 1, 1, 0]);

  return (
    <section ref={sectionRef} data-hero-section="pop" className="relative h-[560vh] lg:h-[540vh] xl:h-[520vh] bg-black text-cream">
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden">
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
              perspective: "1400px",
              perspectiveOrigin: "50% 52%",
              width: 1,
              height: 1,
              transformStyle: "preserve-3d",
            }}
          >
            {seeds.map((s) => (
              <PopOutCard key={s.id} seed={s} progress={p} popScale={popScale} popYScale={popYScale} />
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
  const { width } = useViewportMetrics();
  const p = useSectionProgress(sectionRef);
  const snakeTravel = Math.min(820, Math.max(560, width * 0.62));
  const headlineX = useTransform(p, [0, 1], ["8%", "-24%"]);
  const headlineOpacity = useTransform(p, [0, 0.08, 0.92, 1], [0, 1, 1, 0]);
  const microOpacity = useTransform(p, [0.12, 0.24, 0.84, 1], [0, 1, 1, 0]);

  return (
    <section ref={sectionRef} data-hero-section="snake" className="relative h-[500vh] lg:h-[480vh] xl:h-[460vh] bg-black text-cream">
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden">
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
              <SnakeCard key={s.id} seed={s} progress={p} travel={snakeTravel} />
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
  const ROWS = 4;
  const TILES_PER_ROW = 6;
  const CARD_W = 320;
  const GAP = 8;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const p = useSpring(scrollYProgress, {
    stiffness: 55,
    damping: 28,
    mass: 0.6,
    restDelta: 0.0002,
    restSpeed: 0.0002,
  });

  // Symmetric in/out keyframes so reversing scroll mirrors forward easing exactly
  const wallOpacity = useTransform(p, [0.08, 0.26, 0.74, 0.92], [0, 1, 1, 0]);
  const wallScale = useTransform(p, [0.08, 0.26, 0.74, 0.92], [1.22, 1.12, 1.12, 1.22]);
  const wallRotateX = useTransform(p, [0.08, 0.26, 0.74, 0.92], [18, 12, 12, 18]);
  const wallY = useTransform(p, [0.08, 0.26, 0.74, 0.92], ["6%", "0%", "0%", "-6%"]);

  const rows = useMemo(
    () =>
      Array.from({ length: ROWS }, (_, r) => {
        const base = Array.from({ length: TILES_PER_ROW }, (_, c) => {
          const idx = (r * 3 + c * 2) % videos.length;
          return videos[idx];
        });
        return [...base, ...base];
      }),
    [],
  );

  return (
    <section ref={sectionRef} data-hero-section="wall" data-hide-site-nav="true" className="relative h-[220vh] bg-black text-cream">
      <div
        className="sticky top-0 h-[100dvh] w-full overflow-hidden bg-black"
        style={{ perspective: "1200px" }}
      >
        <motion.div
          className="absolute inset-0 flex flex-col"
          style={{
            gap: `${GAP}px`,
            opacity: wallOpacity,
            scale: wallScale,
            rotateX: wallRotateX,
            y: wallY,
            transformOrigin: "center center",
            transformStyle: "preserve-3d",
            willChange: "transform, opacity",
          }}
        >
            {rows.map((rowTiles, r) => {
              const dir = r % 2 === 0 ? "tero-row-left" : "tero-row-right";
              const duration = 38 + r * 6;

              return (
                <div
                  key={r}
                  className="relative w-full overflow-hidden"
                  style={{ height: `calc((100% - ${GAP * (ROWS - 1)}px) / ${ROWS})` }}
                >
                  <div
                    className="absolute inset-y-0 left-0 flex"
                    style={{
                      gap: `${GAP}px`,
                      animation: `${dir} ${duration}s linear infinite`,
                      willChange: "transform",
                    }}
                  >
                    {rowTiles.map((vid, c) => (
                      <WallTile
                        key={`${r}-${c}`}
                        url={vid.url}
                        fallback={WALL_FALLBACKS[(r + c) % WALL_FALLBACKS.length]}
                        w={CARD_W}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
        </motion.div>

        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-[28%] z-30 pointer-events-none"
          style={{
            background:
              "linear-gradient(0deg, #000 18%, rgba(0,0,0,0.85) 55%, transparent 100%)",
          }}
        />
      </div>
    </section>
  );
}

function WallTile({
  url,
  fallback,
  w,
}: {
  url: string;
  fallback: string;
  w: number;
}) {
  const videoUrl = useResolvedVideoUrl(url);
  const thumb = useVideoThumbnail(url);
  const tileRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mount, setMount] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!tileRef.current) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMount(true);
          io.disconnect();
        }
      },
      { rootMargin: "600px", threshold: 0.01 },
    );
    io.observe(tileRef.current);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || !mount) return;
    const play = () => v.play().catch(() => {});
    if (v.readyState >= 2) play();
    else v.addEventListener("loadeddata", play, { once: true });
  }, [mount, videoUrl]);

  const poster = thumb || fallback;

  return (
    <Link
      to="/portfolio"
      ref={tileRef as never}
      className="relative shrink-0 overflow-hidden bg-black rounded-[12px] cursor-pointer block"
      style={{ width: w, height: "100%", contain: "layout paint" }}
      aria-label="View portfolio"
    >
      <img
        src={poster}
        alt=""
        loading="lazy"
        decoding="async"
        className="absolute inset-0 z-10 h-full w-full object-cover pointer-events-none select-none"
      />
      {mount && (
        <video
          ref={videoRef}
          src={videoUrl}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onCanPlay={() => setReady(true)}
          className={`absolute inset-0 z-20 h-full w-full object-cover pointer-events-none select-none transition-opacity duration-300 ${ready ? "opacity-100" : "opacity-0"}`}
        />
      )}
      <div
        aria-hidden
        className="absolute inset-0 z-30 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0) 48%, rgba(0,0,0,0.16) 100%)",
        }}
      />
    </Link>
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
  popScale,
  popYScale,
}: {
  seed: CardSeed;
  progress: MotionValue<number>;
  popScale: number;
  popYScale: number;
}) {
  const fallback = WALL_FALLBACKS[seed.id % WALL_FALLBACKS.length];
  const thumb = useVideoThumbnail(seed.url);
  const poster = thumb || fallback;
  const start = 0.01 + seed.delay * 0.4;
  const hit = 0.2 + seed.delay * 0.28;
  // Hold cards visible across the bulk of the section, only drift slightly
  const restX = seed.popX * popScale;
  const restY = seed.popY * popYScale;
  const driftX = restX * 1.03;
  const driftY = restY * 1.02;

  const x = useTransform(progress, [start, hit, 0.98, 1], [0, restX, driftX, driftX * 1.04]);
  const y = useTransform(progress, [start, hit, 0.98, 1], [0, restY, driftY, driftY * 1.03]);
  const z = useTransform(progress, [start, hit, 0.98, 1], [-820, seed.popZ, seed.popZ + 30, seed.popZ + 70]);
  const scale = useTransform(progress, [start, hit, 0.98, 1], [0.1, 1, 1.02, 1.06]);
  const opacity = useTransform(
    progress,
    [start, start + 0.04, 0.985, 1],
    [0, 1, 1, 0],
  );
  const rotateX = useTransform(progress, [start, hit, 1], [0, seed.popRotX, seed.popRotX * 1.1]);
  const rotateY = useTransform(progress, [start, hit, 1], [0, seed.popRotY, seed.popRotY * 1.1]);
  const rotateZ = useTransform(progress, [start, hit, 1], [0, seed.popRotZ, seed.popRotZ * 1.1]);

  return (
    <motion.div
      data-hero-pop-card="true"
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
      <img
        src={poster}
        alt=""
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover pointer-events-none select-none"
      />
    </motion.div>
  );
}

function SnakeCard({
  seed,
  progress,
  travel,
}: {
  seed: CardSeed;
  progress: MotionValue<number>;
  travel: number;
}) {
  const fallback = WALL_FALLBACKS[seed.id % WALL_FALLBACKS.length];
  const thumb = useVideoThumbnail(seed.url);
  const poster = thumb || fallback;
  // Stagger through the middle of a longer sticky section so the snake remains readable.
  const span = 0.5;
  const startOffset = 0.12 + (seed.id / (CARD_COUNT - 1)) * 0.28;
  const enterAt = startOffset;
  const midAt = startOffset + span * 0.5;
  const exitAt = startOffset + span;

  const x = useTransform(
    progress,
    [enterAt, midAt, exitAt],
    [-travel, seed.id % 2 === 0 ? 30 : -50, travel],
  );
  const y = useTransform(
    progress,
    [enterAt, midAt, exitAt],
    [seed.snakeY - 160, seed.snakeY, seed.snakeY + 110],
  );
  const z = useTransform(progress, [enterAt, midAt, exitAt], [-220, 140, -180]);
  const opacity = useTransform(
    progress,
    [enterAt - 0.02, enterAt + 0.04, exitAt - 0.06, exitAt],
    [0, 1, 1, 0],
  );
  const rotateZ = useTransform(progress, [enterAt, midAt, exitAt], [-16, seed.snakeRot, 14]);
  const rotateY = useTransform(progress, [enterAt, midAt, exitAt], [-28, 0, 26]);

  return (
    <motion.div
      data-hero-snake-card="true"
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
      <img
        src={poster}
        alt=""
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover pointer-events-none select-none"
      />
    </motion.div>
  );
}