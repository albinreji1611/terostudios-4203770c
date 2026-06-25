import { Link } from "@tanstack/react-router";
import { videos } from "@/data/videos";
import { resolveAssetUrl } from "@/lib/asset-url";
import { useEffect, useRef, useState } from "react";
import { useVideoThumbnail } from "@/lib/use-video-thumbnail";
import portfolio1 from "@/assets/portfolio-1.jpg";
import portfolio2 from "@/assets/portfolio-2.jpg";
import portfolio3 from "@/assets/portfolio-3.jpg";
import portfolio4 from "@/assets/portfolio-4.jpg";
import portfolio5 from "@/assets/portfolio-5.jpg";
import portfolio6 from "@/assets/portfolio-6.jpg";

const FALLBACKS = [portfolio1, portfolio2, portfolio3, portfolio4, portfolio5, portfolio6];

/**
 * Mobile-only hero: no sticky scroll, no 3D, no heavy motion.
 * A clean wordmark + CTAs, followed by two auto-marquee rows of
 * cinema-ratio reel thumbnails so the mobile experience stays fast.
 */
export function MobileHero() {
  const rows = [
    videos.slice(0, 6),
    videos.slice(6, 12).length ? videos.slice(6, 12) : videos.slice(0, 6),
  ];

  return (
    <section className="relative overflow-hidden bg-black text-cream">
      {/* starfield-ish backdrop */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(80% 60% at 50% 38%, #0b0c12 0%, #04050a 60%, #000 100%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: `
            radial-gradient(1px 1px at 14% 22%, rgba(255,255,255,0.7), transparent 60%),
            radial-gradient(1px 1px at 72% 28%, rgba(255,255,255,0.55), transparent 60%),
            radial-gradient(1.2px 1.2px at 38% 64%, rgba(255,255,255,0.7), transparent 60%),
            radial-gradient(1px 1px at 84% 78%, rgba(255,255,255,0.5), transparent 60%)
          `,
        }}
      />

      <div className="relative z-10 flex flex-col items-center px-5 pt-28 pb-10 text-center">
        <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-cream/55">
          Animation · VFX · CGI
        </span>

        <h1
          className="mt-6 font-display tracking-[-0.04em] leading-none text-cream/95 select-none"
          style={{ fontSize: "clamp(3.5rem, 22vw, 6rem)" }}
        >
          TERO
        </h1>

        <p className="mt-5 max-w-[22ch] text-[14px] leading-[1.55] text-cream/70">
          A motion &amp; visual effects studio crafting films, campaigns and immersive brand worlds.
        </p>

        <div className="mt-7 flex flex-col items-stretch gap-3 w-full max-w-[260px]">
          <Link
            to="/portfolio"
            className="rounded-full bg-cream text-ink px-6 py-3 font-mono text-[11px] uppercase tracking-[0.22em] hover:bg-vermillion hover:text-cream transition-colors"
          >
            View Showreel
          </Link>
          <Link
            to="/contact"
            className="rounded-full ring-1 ring-cream/30 text-cream px-6 py-3 font-mono text-[11px] uppercase tracking-[0.22em] hover:bg-cream/10 transition-colors"
          >
            Start a Project
          </Link>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-1.5">
          {["3D Animation", "VFX", "CGI Films"].map((label) => (
            <span
              key={label}
              className="rounded-full bg-cream/8 ring-1 ring-cream/15 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.22em] text-cream/70"
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* Two marquee rows of reels */}
      <div className="relative z-10 pb-12 space-y-3">
        {rows.map((row, r) => {
          const tiles = [...row, ...row];
          const dir = r % 2 === 0 ? "tero-row-left" : "tero-row-right";
          const duration = 10 + r * 2;
          return (
            <div key={r} className="relative w-full overflow-hidden">
              <div
                className="flex gap-2"
                style={{ animation: `${dir} ${duration}s linear infinite`, willChange: "transform" }}
              >
                {tiles.map((vid, i) => (
                  <MobileTile
                    key={`${r}-${i}`}
                    url={vid.url}
                    fallback={FALLBACKS[(r + i) % FALLBACKS.length]}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* bottom fade into next section */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-24 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, rgba(0,0,0,0) 0%, #000 100%)",
        }}
      />
    </section>
  );
}

function MobileTile({ url, fallback }: { url: string; fallback: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const resolved = resolveAssetUrl(url);
  const thumb = useVideoThumbnail(resolved) ?? fallback;

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setInView(true);
            io.disconnect();
            break;
          }
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Link
      to="/portfolio"
      ref={ref as never}
      className="relative shrink-0 overflow-hidden rounded-[3px] bg-ink"
      style={{ width: 200, height: 118 }}
    >
      <img
        src={thumb}
        alt=""
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
      />
      {inView && (
        <video
          src={resolved}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
    </Link>
  );
}
