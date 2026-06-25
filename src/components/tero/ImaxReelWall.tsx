import { useEffect, useMemo, useRef, useState } from "react";
import { videos } from "@/data/videos";
import { resolveAssetUrl } from "@/lib/asset-url";
import portfolio3 from "@/assets/portfolio-3.jpg";
import portfolio6 from "@/assets/portfolio-6.jpg";
import reelB from "@/assets/reel-placeholder-b.jpg";
import reelF from "@/assets/reel-placeholder-f.jpg";
import imax1 from "@/assets/imax-reference-style-1.jpg";
import imax2 from "@/assets/imax-reference-style-2.jpg";
import imax3 from "@/assets/imax-reference-style-3.jpg";
import imax4 from "@/assets/imax-reference-style-4.jpg";
import imax5 from "@/assets/imax-reference-style-5.jpg";
import imax6 from "@/assets/imax-reference-style-6.jpg";
import imax7 from "@/assets/imax-reference-style-7.jpg";
import imax8 from "@/assets/imax-reference-style-8.jpg";

const FALLBACKS = [imax1, imax2, imax3, imax4, imax5, imax6, imax7, imax8, reelF, reelB, portfolio3, portfolio6];
const GENERATED_FALLBACKS = [imax1, imax2, imax3, imax4, imax5, imax6, imax7, imax8];

const ROWS = 5;
const TILES_PER_ROW = 7;

const ROW_DURATION = [30, 26, 23, 28, 34];

const ROW_LAYOUT = [
  { top: "-4%", height: "22%", opacity: 0.88, z: -330, rotateX: -12, scale: 0.9 },
  { top: "15.2%", height: "22%", opacity: 1, z: -125, rotateX: -5.8, scale: 0.97 },
  { top: "34.4%", height: "22%", opacity: 1, z: 84, rotateX: 0, scale: 1.045 },
  { top: "53.4%", height: "22%", opacity: 0.86, z: -130, rotateX: 6.6, scale: 0.97 },
  { top: "72.2%", height: "22%", opacity: 0.22, z: -360, rotateX: 13, scale: 0.9 },
];

const TILE_LEFT = [-15, 4, 23, 42, 61, 80, 99];

function getTileCurve(index: number) {
  const center = (TILES_PER_ROW - 1) / 2;
  const normalized = (index - center) / center;
  const distance = Math.abs(normalized);
  return {
    rotateY: normalized * -68,
    translateZ: -Math.pow(distance, 1.22) * 980,
    translateY: Math.pow(distance, 1.35) * 34,
    scale: 1 - distance * 0.34,
    brightness: 1 - distance * 0.58,
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

function Tile({ url, fallback, generated }: { url: string; fallback: string; generated?: boolean }) {
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
      className="relative shrink-0 h-full overflow-hidden rounded-[24px] bg-black ring-1 ring-white/10 shadow-[0_18px_70px_rgba(0,0,0,0.55)]"
      style={{ aspectRatio: "16 / 9" }}
    >
      <img
        src={fallback}
        alt=""
        loading="eager"
        decoding="async"
        className="absolute inset-0 z-10 h-full w-full object-cover select-none pointer-events-none"
        style={{ filter: generated ? "brightness(0.96) contrast(1.2)" : "grayscale(1) saturate(0) brightness(0.62) contrast(1.18)" }}
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
          className={`absolute inset-0 z-20 h-full w-full object-cover select-none pointer-events-none transition-opacity duration-700 ${ready && !generated ? "opacity-80" : "opacity-0"}`}
          style={{ filter: "grayscale(1) saturate(0) brightness(0.58) contrast(1.2)" }}
        />
      )}
    </div>
  );
}

export function ImaxReelWall() {
  const rows = useMemo(
    () =>
      Array.from({ length: ROWS }, (_, r) => {
        return Array.from({ length: TILES_PER_ROW }, (_, c) => {
          const v = videos[(r * 4 + c * 2) % videos.length];
          const fb = FALLBACKS[(r * 2 + c) % FALLBACKS.length];
          return { url: v.url, fb, generated: GENERATED_FALLBACKS.includes(fb) };
        });
      }),
    [],
  );

  return (
    <section className="relative w-full bg-black overflow-hidden">
      <div
        className="relative isolate w-full h-[82vh] sm:h-[92vh] md:h-[100svh] bg-black overflow-hidden"
        style={{
          WebkitMaskImage:
            "linear-gradient(180deg, #000 0%, #000 65%, rgba(0,0,0,0.56) 82%, transparent 100%)",
          maskImage:
            "linear-gradient(180deg, #000 0%, #000 65%, rgba(0,0,0,0.56) 82%, transparent 100%)",
          perspective: "clamp(280px, 33vw, 520px)",
          perspectiveOrigin: "50% 43%",
        }}
      >
        <div
          className="absolute inset-x-[-4vw] top-0 h-full"
          style={{
            transformStyle: "preserve-3d",
            transform: "rotateX(8deg) scale(1.08)",
            transformOrigin: "50% 44%",
          }}
        >
          {rows.map((tiles, r) => {
            const dir = r % 2 === 0 ? "tero-row-left" : "tero-row-right";
            const isLast = r === ROWS - 1;
            const layout = ROW_LAYOUT[r] ?? ROW_LAYOUT[2];
            const duration = ROW_DURATION[r] ?? 70;
            return (
              <div
                key={r}
                className="absolute w-full overflow-visible"
                style={{
                  top: layout.top,
                  height: layout.height,
                  opacity: layout.opacity,
                  zIndex: 10 - r,
                  transform: `translateZ(${layout.z}px) rotateX(${layout.rotateX}deg) scale(${layout.scale})`,
                  transformStyle: "preserve-3d",
                  transformOrigin: "50% 50%",
                  maskImage: isLast
                    ? "linear-gradient(180deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.32) 52%, transparent 100%)"
                    : undefined,
                  WebkitMaskImage: isLast
                    ? "linear-gradient(180deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.32) 52%, transparent 100%)"
                    : undefined,
                }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    animation: `${dir === "tero-row-left" ? "tero-row-drift-left" : "tero-row-drift-right"} ${duration}s cubic-bezier(0.45,0,0.55,1) infinite alternate`,
                    willChange: "transform",
                    transformStyle: "preserve-3d",
                  }}
                >
                  {tiles.map((t, c) => {
                    const curve = getTileCurve(c);
                    return (
                      <div
                        key={`${r}-${c}`}
                        className="absolute top-0 h-full"
                        style={{
                          left: `${TILE_LEFT[c] ?? 0}%`,
                          aspectRatio: "16 / 9",
                          transform: `translateY(${curve.translateY}px) translateZ(${curve.translateZ}px) rotateY(${curve.rotateY}deg) scale(${curve.scale})`,
                          transformStyle: "preserve-3d",
                          transformOrigin: c < TILES_PER_ROW / 2 ? "100% 50%" : "0% 50%",
                          filter: `brightness(${curve.brightness})`,
                        }}
                      >
                        <Tile url={t.url} fallback={t.fb} generated={t.generated} />
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
          className="pointer-events-none absolute inset-x-0 top-0 z-20 h-[11%] opacity-24"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,244,220,0.055) 0%, rgba(255,244,220,0.014) 48%, transparent 100%)",
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
          className="pointer-events-none absolute inset-x-[-16%] bottom-[-31%] z-20 h-[48%] rounded-[55%_55%_0_0] bg-black/92"
        />
        {/* Bottom immersive fade */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[36%] sm:h-[40%] md:h-[44%] z-30"
          style={{
            background:
              "linear-gradient(0deg, #000 0%, rgba(0,0,0,0.86) 28%, rgba(0,0,0,0.46) 66%, transparent 100%)",
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
