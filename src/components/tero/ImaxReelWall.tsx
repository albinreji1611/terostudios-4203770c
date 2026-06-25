import { useEffect, useMemo, useRef, useState } from "react";
import { videos } from "@/data/videos";
import { resolveAssetUrl } from "@/lib/asset-url";
import { useVideoThumbnail } from "@/lib/use-video-thumbnail";
import portfolio1 from "@/assets/portfolio-1.jpg";
import portfolio2 from "@/assets/portfolio-2.jpg";
import portfolio3 from "@/assets/portfolio-3.jpg";
import portfolio4 from "@/assets/portfolio-4.jpg";
import portfolio5 from "@/assets/portfolio-5.jpg";
import portfolio6 from "@/assets/portfolio-6.jpg";

const FALLBACKS = [portfolio1, portfolio2, portfolio3, portfolio4, portfolio5, portfolio6];

const ROWS = 5;
const TILES_PER_ROW = 8;
const GAP = -42;

const ROW_CURVE = [
  { angle: -14, z: -90, scale: 0.97, y: 10, opacity: 0.98 },
  { angle: -6, z: -22, scale: 1.02, y: 4, opacity: 1 },
  { angle: 0, z: 120, scale: 1.1, y: 0, opacity: 1 },
  { angle: 7, z: -28, scale: 1.02, y: -4, opacity: 0.92 },
  { angle: 16, z: -160, scale: 0.96, y: -10, opacity: 0.16 },
];

function getTileCurve(index: number) {
  const position = index % TILES_PER_ROW;
  const center = (TILES_PER_ROW - 1) / 2;
  const normalized = (position - center) / center;
  const edge = Math.abs(normalized);

  return {
    rotateY: normalized * -18,
    translateZ: -Math.pow(edge, 1.35) * 135,
    scale: 1 - edge * 0.055,
  };
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

function Tile({ url, fallback }: { url: string; fallback: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mount, setMount] = useState(false);
  const [ready, setReady] = useState(false);
  const thumb = useVideoThumbnail(url);
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
      { rootMargin: "400px", threshold: 0.01 },
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
  }, [mount, src]);

  return (
    <div
      ref={ref}
      className="relative shrink-0 h-full overflow-hidden rounded-[14px] bg-black ring-1 ring-white/5"
      style={{ aspectRatio: "16 / 9" }}
    >
      <img
        src={thumb || fallback}
        alt=""
        loading="lazy"
        decoding="async"
        className="absolute inset-0 z-10 h-full w-full object-cover select-none pointer-events-none"
      />
      {mount && (
        <video
          ref={videoRef}
          src={src}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onCanPlay={() => setReady(true)}
          className={`absolute inset-0 z-20 h-full w-full object-cover select-none pointer-events-none transition-opacity duration-500 ${ready ? "opacity-100" : "opacity-0"}`}
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
      {/* Deep perspective stage: rows recede above and below the center like an IMAX screen */}
      <div
        className="relative w-full h-[78vh] sm:h-[88vh] md:h-[96vh] lg:h-[104vh] bg-black overflow-hidden"
        style={{
          WebkitMaskImage:
            "linear-gradient(180deg, #000 0%, #000 70%, rgba(0,0,0,0.72) 84%, transparent 100%)",
          maskImage:
            "linear-gradient(180deg, #000 0%, #000 70%, rgba(0,0,0,0.72) 84%, transparent 100%)",
          perspective: "760px",
          perspectiveOrigin: "50% 50%",
        }}
      >
        {/* Concave screen silhouette and depth shadow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-[-8%] top-[-8%] z-20 h-[9%] rounded-[0_0_50%_50%] bg-black/70"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-[-10%] bottom-[-22%] z-20 h-[44%] rounded-[50%_50%_0_0] bg-black/95"
        />

        <div
          className="absolute inset-x-[-10vw] top-0 bottom-[-8%] flex flex-col"
          style={{
            gap: `${GAP}px`,
            transformStyle: "preserve-3d",
            transform: "rotateX(0deg) scaleX(1.1)",
            transformOrigin: "50% 50%",
          }}
        >
          {rows.map((tiles, r) => {
            // Alternate direction; vary speeds so rows feel parallax-like
            const dir = r % 2 === 0 ? "tero-row-left" : "tero-row-right";
            const durations = [62, 78, 54, 86, 70];
            const duration = durations[r] ?? 60 + r * 6;

            const isLast = r === ROWS - 1;
            const curve = ROW_CURVE[r] ?? ROW_CURVE[2];
            return (
              <div
                key={r}
                className="relative w-full overflow-visible"
                style={{
                  height: `calc((100% - ${GAP * (ROWS - 1)}px) / ${ROWS})`,
                  opacity: curve.opacity,
                  transform: `translateY(${curve.y}px) translateZ(${curve.z}px) rotateX(${curve.angle}deg) scale(${curve.scale})`,
                  transformStyle: "preserve-3d",
                  transformOrigin: "50% 50%",
                  maskImage: isLast
                    ? "linear-gradient(180deg, #000 0%, rgba(0,0,0,0.6) 52%, transparent 100%)"
                    : undefined,
                  WebkitMaskImage: isLast
                    ? "linear-gradient(180deg, #000 0%, rgba(0,0,0,0.6) 52%, transparent 100%)"
                    : undefined,
                }}
              >

                <div
                  className="absolute inset-y-0 left-0 flex"
                  style={{
                    gap: `${GAP}px`,
                    animation: `${dir} ${duration}s linear infinite`,
                    willChange: "transform",
                    transformStyle: "preserve-3d",
                  }}
                >
                  {tiles.map((t, c) => {
                    const tileCurve = getTileCurve(c);
                    return (
                      <div
                        key={`${r}-${c}`}
                        className="h-full shrink-0"
                        style={{
                          aspectRatio: "16 / 9",
                          transform: `translateZ(${tileCurve.translateZ}px) rotateY(${tileCurve.rotateY}deg) scale(${tileCurve.scale})`,
                          transformStyle: "preserve-3d",
                          transformOrigin: "50% 50%",
                        }}
                      >
                        <Tile url={t.url} fallback={t.fb} />
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Top soft glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[12%] sm:h-[14%] md:h-[16%] z-30"
          style={{
            background:
              "linear-gradient(180deg, #000 0%, rgba(0,0,0,0.45) 50%, transparent 100%)",
          }}
        />
        {/* Bottom immersive fade */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[26%] sm:h-[30%] md:h-[34%] z-30"
          style={{
            background:
              "linear-gradient(0deg, #000 6%, rgba(0,0,0,0.55) 55%, transparent 100%)",
          }}
        />
        {/* Center projector bloom */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-30 mix-blend-overlay opacity-25 sm:opacity-30 md:opacity-35"
          style={{
            background:
              "radial-gradient(60% 45% at 50% 50%, rgba(255,235,200,0.28) 0%, rgba(255,200,140,0.08) 45%, transparent 78%)",
          }}
        />
        {/* Subtle scanlines */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-30 opacity-[0.05] sm:opacity-[0.06] md:opacity-[0.07] mix-blend-overlay"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, rgba(255,255,255,0.55) 0px, rgba(255,255,255,0.55) 1px, transparent 1px, transparent 3px)",
          }}
        />
        {/* Film grain */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-30 opacity-[0.04] sm:opacity-[0.05] md:opacity-[0.06] mix-blend-overlay"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.55) 1px, transparent 1px)",
            backgroundSize: "3px 3px",
          }}
        />
      </div>
    </section>
  );
}
