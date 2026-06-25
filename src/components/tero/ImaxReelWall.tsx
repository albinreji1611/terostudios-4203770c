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
const TILES_PER_ROW = 9;
const TILE_GAP = "clamp(8px, 0.7vw, 12px)";

const ROW_CURVE = [
  { top: "0%",    angle: 0, z: 0, scale: 1, scaleX: 1, opacity: 1,    duration: 82 },
  { top: "20%",   angle: 0, z: 0, scale: 1, scaleX: 1, opacity: 1,    duration: 67 },
  { top: "40%",   angle: 0, z: 0, scale: 1, scaleX: 1, opacity: 1,    duration: 56 },
  { top: "60%",   angle: 0, z: 0, scale: 1, scaleX: 1, opacity: 0.95, duration: 74 },
  { top: "80%",   angle: 0, z: 0, scale: 1, scaleX: 1, opacity: 0.35, duration: 88 },
];

function getTileCurve(index: number) {
  const position = index % TILES_PER_ROW;
  const center = (TILES_PER_ROW - 1) / 2;
  const normalized = (position - center) / center;
  const edge = Math.abs(normalized);

  return {
    rotateY: normalized * -10,
    translateZ: -Math.pow(edge, 1.6) * 70,
    scale: 1 - edge * 0.02,
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
  const didPrime = useRef(false);
  const [mount, setMount] = useState(false);
  const [ready, setReady] = useState(false);
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
    if (!v || !mount || !ready) return;
    v.play().catch(() => {});
  }, [mount, ready, src]);

  const primeVideoFrame = () => {
    const v = videoRef.current;
    if (!v || didPrime.current) return;
    didPrime.current = true;

    const target = Number.isFinite(v.duration) && v.duration > 0
      ? Math.min(Math.max(v.duration * 0.22, 0.9), 2.8)
      : 1.2;

    try {
      v.currentTime = target;
    } catch {
      setReady(true);
    }
  };

  return (
    <div
      ref={ref}
      className="relative shrink-0 h-full overflow-hidden rounded-[14px] bg-black ring-1 ring-white/5"
      style={{ aspectRatio: "16 / 9" }}
    >
      <img
        src={fallback}
        alt=""
        loading="eager"
        decoding="async"
        className="absolute inset-0 z-10 h-full w-full object-cover select-none pointer-events-none brightness-[0.9] contrast-[1.08]"
      />
      {mount && (
        <video
          ref={videoRef}
          src={src}
          poster={fallback}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onLoadedMetadata={primeVideoFrame}
          onSeeked={() => setReady(true)}
          onCanPlay={() => {
            if (didPrime.current) setReady(true);
          }}
          className={`absolute inset-0 z-20 h-full w-full object-cover select-none pointer-events-none brightness-[1.08] contrast-[1.08] transition-opacity duration-700 ${ready ? "opacity-90" : "opacity-0"}`}
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
            const curve = ROW_CURVE[r] ?? ROW_CURVE[2];
            return (
              <div
                key={r}
                className="absolute w-full overflow-visible"
                style={{
                  top: curve.top,
                  height: "20%",

                  opacity: curve.opacity,
                  transform: `translate3d(0, 0, ${curve.z}px) rotateX(${curve.angle}deg) scale(${curve.scale}) scaleX(${curve.scaleX})`,
                  transformStyle: "preserve-3d",
                  transformOrigin: "50% 48%",
                  zIndex: r === 2 ? 5 : r === 1 || r === 3 ? 4 : 3,
                  maskImage: isLast
                    ? "linear-gradient(180deg, rgba(0,0,0,0.74) 0%, rgba(0,0,0,0.38) 42%, transparent 100%)"
                    : undefined,
                  WebkitMaskImage: isLast
                    ? "linear-gradient(180deg, rgba(0,0,0,0.74) 0%, rgba(0,0,0,0.38) 42%, transparent 100%)"
                    : undefined,
                }}
              >
                <div
                  className="absolute inset-y-0 left-0 flex"
                  style={{
                    gap: TILE_GAP,
                    animation: `${dir} ${curve.duration}s linear infinite`,
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

        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 z-20 h-[15%] opacity-35"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,244,220,0.08) 0%, rgba(255,244,220,0.022) 42%, transparent 100%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-[-12%] top-[1%] z-20 h-[48%] opacity-28 mix-blend-screen"
          style={{
            background:
              "radial-gradient(70% 36% at 50% 0%, rgba(255,235,198,0.13) 0%, rgba(255,235,198,0.035) 54%, transparent 100%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-[-18%] bottom-[-30%] z-20 h-[46%] rounded-[55%_55%_0_0] bg-black/88"
        />
        {/* Bottom immersive fade */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[24%] sm:h-[29%] md:h-[34%] z-30"
          style={{
            background:
              "linear-gradient(0deg, #000 2%, rgba(0,0,0,0.78) 32%, rgba(0,0,0,0.28) 70%, transparent 100%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[16%] z-30 opacity-70"
          style={{
            background:
              "radial-gradient(85% 115% at 50% 100%, #000 0%, rgba(0,0,0,0.78) 40%, transparent 76%)",
          }}
        />
        {/* Center projector bloom */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-30 mix-blend-overlay opacity-18 sm:opacity-22 md:opacity-25"
          style={{
            background:
              "radial-gradient(60% 45% at 50% 50%, rgba(255,235,200,0.2) 0%, rgba(255,200,140,0.055) 45%, transparent 78%)",
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
