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
const TILES_PER_ROW = 7;
const GAP = 10;

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
      {/* Curved cinema-screen container — barrel curve via border-radius */}
      <div
        className="relative w-full h-[100vh] overflow-hidden bg-black"
        style={{
          borderBottomLeftRadius: "50% 14%",
          borderBottomRightRadius: "50% 14%",
          borderTopLeftRadius: "50% 8%",
          borderTopRightRadius: "50% 8%",
          perspective: "1600px",
          perspectiveOrigin: "50% 50%",
        }}
      >
        <div
          className="absolute inset-0 flex flex-col justify-center"
          style={{
            gap: `${GAP}px`,
            transformStyle: "preserve-3d",
            transform: "rotateX(3deg) scale(1.04)",
          }}
        >
          {rows.map((tiles, r) => {
            const dir = r % 2 === 0 ? "tero-row-left" : "tero-row-right";
            const duration = 55 + r * 7;
            const isLast = r === ROWS - 1;
            return (
              <div
                key={r}
                className="relative w-full overflow-hidden"
                style={{
                  height: `calc((100% - ${GAP * (ROWS - 1)}px) / ${ROWS})`,
                  opacity: isLast ? 0.35 : 1,
                }}
              >
                <div
                  className="absolute inset-y-0 left-0 flex"
                  style={{
                    gap: `${GAP}px`,
                    animation: `${dir} ${duration}s linear infinite`,
                    willChange: "transform",
                  }}
                >
                  {tiles.map((t, c) => (
                    <Tile key={`${r}-${c}`} url={t.url} fallback={t.fb} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom immersive fade only */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[28%] z-30"
          style={{ background: "linear-gradient(0deg, #000 5%, rgba(0,0,0,0.6) 55%, transparent 100%)" }}
        />
      </div>
    </section>
  );
}
