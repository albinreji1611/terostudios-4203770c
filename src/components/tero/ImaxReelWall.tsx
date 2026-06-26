import { useEffect, useMemo, useRef, useState } from "react";
import { videos } from "@/data/videos";
import { resolveAssetUrl } from "@/lib/asset-url";
import portfolio1 from "@/assets/portfolio-1.jpg";
import portfolio2 from "@/assets/portfolio-2.jpg";
import portfolio3 from "@/assets/portfolio-3.jpg";
import portfolio4 from "@/assets/portfolio-4.jpg";
import portfolio5 from "@/assets/portfolio-5.jpg";
import portfolio6 from "@/assets/portfolio-6.jpg";
import reelA from "@/assets/reel-placeholder-a.jpg";
import reelB from "@/assets/reel-placeholder-b.jpg";
import reelC from "@/assets/reel-placeholder-c.jpg";
import reelD from "@/assets/reel-placeholder-d.jpg";
import reelE from "@/assets/reel-placeholder-e.jpg";
import reelF from "@/assets/reel-placeholder-f.jpg";

const FALLBACKS = [reelF, reelE, reelB, reelA, reelD, reelC, portfolio1, portfolio2, portfolio3, portfolio4, portfolio5, portfolio6];

const ROWS = 5;
const TILES_PER_ROW = 14;
const TILE_GAP = "clamp(6px, 0.6vw, 10px)";
const ROW_HEIGHT = "clamp(86px, 13.5vh, 165px)";
const ROW_STEP = "clamp(92px, 14.2vh, 175px)";

const ROW_OPACITY = [1, 1, 1, 0.92, 0.35];
const ROW_DURATION = [82, 67, 56, 74, 88];

function getTileCurve(_index: number) {
  return { rotateY: 0, translateZ: 0, scale: 1 };
}



function resolveForPlayback(url: string) {
  if (typeof window === "undefined") return resolveAssetUrl(url);
  const isLocal = ["localhost", "127.0.0.1", "0.0.0.0"].includes(window.location.hostname);
  const resolved = resolveAssetUrl(url);
  const parsed = new URL(resolved, window.location.origin);
  if (!isLocal) return resolved;
  return parsed.pathname.startsWith("/__l5e/")
    ? `https://id-preview--12ac4244-7645-4fb2-a900-5ab683320d3c.lovable.app${parsed.pathname}${parsed.search}${parsed.hash}`
    : resolved;
}

function Tile({ url }: { url: string; fallback?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mount, setMount] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [src, setSrc] = useState(url);

  useEffect(() => setSrc(resolveForPlayback(url)), [url]);

  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setMount(true);
          io.disconnect();
        }
      },
      { rootMargin: "600px", threshold: 0.01 },
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="relative shrink-0 h-full overflow-hidden rounded-[14px] bg-black ring-1 ring-white/5"
      style={{ aspectRatio: "16 / 9" }}
    >
      {mount && (
        <video
          ref={videoRef}
          src={src}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onPlaying={() => setPlaying(true)}
          className={`absolute inset-0 z-20 h-full w-full object-cover select-none pointer-events-none brightness-[1.08] contrast-[1.08] transition-opacity duration-500 ${playing ? "opacity-95" : "opacity-0"}`}
        />
      )}
    </div>
  );
}

export function ImaxReelWall() {
  const rows = useMemo(
    () =>
      Array.from({ length: ROWS }, (_, r) => {
        const base = Array.from({ length: TILES_PER_ROW }, (_, c) => {
          const v = videos[(r * 3 + c * 2) % videos.length];
          return { url: v.url, fb: FALLBACKS[(r + c) % FALLBACKS.length] };
        });
        return [...base, ...base];
      }),
    [],
  );

  return (
    <section className="relative w-full bg-black overflow-hidden">
      <div className="container-tero py-20 md:py-28">
        <header className="mb-14 md:mb-20 text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-vermillion/60" />
            <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-vermillion">
              (01) The Reel Wall
            </span>
            <span className="h-px w-8 bg-vermillion/60" />
          </div>
          <h2 className="font-display text-[clamp(34px,5vw,72px)] leading-[1.1] tracking-tight text-[#fdfaf6] pb-2">
            Crafted for the <span className="italic text-vermillion">big screen.</span>
          </h2>
        </header>
      </div>
      <div
        className="relative isolate w-full h-[78vh] sm:h-[88vh] md:h-[92svh] bg-black overflow-hidden"
        style={{
          WebkitMaskImage:
            "linear-gradient(180deg, #000 0%, #000 71%, rgba(0,0,0,0.66) 86%, transparent 100%)",
          maskImage:
            "linear-gradient(180deg, #000 0%, #000 71%, rgba(0,0,0,0.66) 86%, transparent 100%)",
          perspective: "clamp(720px, 82vw, 1120px)",
          perspectiveOrigin: "50% 48%",
        }}
      >
        <div
          className="absolute inset-x-[-4vw] inset-y-0"
          style={{
            transformStyle: "preserve-3d",
            transform: "rotateX(0deg) scale(1.01)",
            transformOrigin: "50% 50%",
          }}
        >
          {rows.map((tiles, r) => {
            const dir = r % 2 === 0 ? "tero-row-left" : "tero-row-right";
            const isLast = r === ROWS - 1;
            const opacity = ROW_OPACITY[r] ?? 1;
            const duration = ROW_DURATION[r] ?? 70;
            return (
              <div
                key={r}
                className="absolute w-full overflow-visible"
                style={{
                  top: `calc(${r} * ${ROW_STEP})`,
                  height: ROW_HEIGHT,
                  opacity,
                  zIndex: 10 - r,
                  maskImage: isLast
                    ? "linear-gradient(180deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.35) 55%, transparent 100%)"
                    : undefined,
                  WebkitMaskImage: isLast
                    ? "linear-gradient(180deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.35) 55%, transparent 100%)"
                    : undefined,
                }}
              >
                <div
                  className="absolute inset-y-0 left-0 flex"
                  style={{
                    gap: TILE_GAP,
                    animation: `${dir} ${duration}s linear infinite`,
                    willChange: "transform",
                  }}
                >
                  {tiles.map((t, c) => (
                    <div
                      key={`${r}-${c}`}
                      className="h-full shrink-0"
                      style={{ aspectRatio: "16 / 9" }}
                    >
                      <Tile url={t.url} fallback={t.fb} />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
}
