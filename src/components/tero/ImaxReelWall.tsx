import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { videos } from "@/data/videos";
import { resolveAssetUrl } from "@/lib/asset-url";

/**
 * Dome Reel Wall — a hemispherical wall of reels arranged on a sphere.
 * The dome only rotates while the user scrolls through the pinned section
 * (no autoplay marquee). Tiles are positioned via spherical coordinates so
 * they wrap a true 3D dome that the viewer looks up into.
 */

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

// Dome geometry — tiles distributed across latitude rings.
// Rings go from near the horizon (top of dome) toward the zenith.
const RINGS = [
  { lat: 78, count: 14 }, // outer ring — horizon, most tiles
  { lat: 60, count: 12 },
  { lat: 42, count: 10 },
  { lat: 24, count: 7 },
  { lat: 8,  count: 1 },  // zenith cap
];
const RADIUS = 640; // px — sphere radius
const TILE_W = 200;
const TILE_H = 112; // 16:9

type DomeTile = {
  url: string;
  x: number; y: number; z: number;
  rotY: number; rotX: number;
};

function buildDome(pool: { url: string }[]): DomeTile[] {
  const tiles: DomeTile[] = [];
  let i = 0;
  RINGS.forEach(({ lat, count }) => {
    const phi = (lat * Math.PI) / 180; // from zenith
    for (let k = 0; k < count; k++) {
      const theta = (k / count) * Math.PI * 2;
      const x = RADIUS * Math.sin(phi) * Math.cos(theta);
      const z = RADIUS * Math.sin(phi) * Math.sin(theta);
      const y = -RADIUS * Math.cos(phi); // negative = up (dome above viewer)
      const rotY = (theta * 180) / Math.PI + 90; // face center
      const rotX = -(90 - lat); // tilt down toward viewer
      tiles.push({
        url: pool[i % pool.length].url,
        x, y, z, rotY, rotX,
      });
      i++;
    }
  });
  return tiles;
}

function Tile({ url, active }: { url: string; active: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
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
      { rootMargin: "400px", threshold: 0.01 },
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="absolute inset-0 overflow-hidden rounded-[12px] bg-black ring-1 ring-white/10"
      style={{
        boxShadow: active
          ? "0 30px 80px -30px rgba(255,90,40,0.35), inset 0 0 30px rgba(0,0,0,0.5)"
          : "0 20px 60px -30px rgba(0,0,0,0.9), inset 0 0 30px rgba(0,0,0,0.55)",
      }}
    >
      {mount && (
        <video
          src={src}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onPlaying={() => setPlaying(true)}
          className={`absolute inset-0 h-full w-full object-cover pointer-events-none select-none brightness-[1.08] contrast-[1.08] transition-opacity duration-500 ${playing ? "opacity-95" : "opacity-0"}`}
        />
      )}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.5) 100%)",
        }}
      />
    </div>
  );
}

export function ImaxReelWall() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 28, mass: 0.5 });

  // Scroll drives the dome's rotation. We sweep ~360° on Y and tilt X slightly.
  const rotY = useTransform(p, [0, 1], [-30, 330]);
  const rotX = useTransform(p, [0, 0.5, 1], [-8, 4, -2]);
  const scale = useTransform(p, [0, 0.15, 1], [0.92, 1, 1]);

  const tiles = useMemo(() => {
    const wide = videos.filter((v) => v.aspect >= 1.6 && v.aspect <= 2.1);
    const pool = wide.length > 0 ? wide : videos;
    return buildDome(pool);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-black"
      style={{ height: "320vh" }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Cosmic backdrop */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(70% 55% at 50% 25%, #11131c 0%, #06070d 60%, #000 100%)",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none opacity-50"
          style={{
            backgroundImage: `
              radial-gradient(1px 1px at 14% 22%, rgba(255,255,255,0.85), transparent 60%),
              radial-gradient(1px 1px at 32% 68%, rgba(255,255,255,0.6), transparent 60%),
              radial-gradient(1.3px 1.3px at 49% 30%, rgba(255,255,255,0.8), transparent 60%),
              radial-gradient(1px 1px at 63% 78%, rgba(255,255,255,0.55), transparent 60%),
              radial-gradient(1px 1px at 81% 18%, rgba(255,255,255,0.85), transparent 60%),
              radial-gradient(1.2px 1.2px at 92% 60%, rgba(255,255,255,0.65), transparent 60%)
            `,
          }}
        />

        {/* Heading */}
        <div className="absolute inset-x-0 top-0 z-40 container-tero pt-10 md:pt-14">
          <header className="text-center">
            <div className="mb-3 flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-vermillion/60" />
              <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-vermillion">
                (01) The Dome Reel
              </span>
              <span className="h-px w-8 bg-vermillion/60" />
            </div>
            <h2 className="font-display text-[clamp(30px,4.6vw,64px)] leading-[1.1] tracking-tight text-[#fdfaf6] pb-1">
              Step inside the <span className="italic text-vermillion">dome.</span>
            </h2>
            <p className="mt-2 text-[11px] tracking-[0.28em] uppercase text-cream/45">
              Scroll to rotate the wall
            </p>
          </header>
        </div>

        {/* Stage */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ perspective: "1500px", perspectiveOrigin: "50% 58%" }}
        >
          <motion.div
            className="relative"
            style={{
              width: 1,
              height: 1,
              transformStyle: "preserve-3d",
              rotateY: rotY,
              rotateX: rotX,
              scale,
              translateY: 120,
            }}
          >
            {tiles.map((t, i) => (
              <div
                key={i}
                className="absolute"
                style={{
                  width: TILE_W,
                  height: TILE_H,
                  left: -TILE_W / 2,
                  top: -TILE_H / 2,
                  transform: `translate3d(${t.x}px, ${t.y}px, ${t.z}px) rotateY(${t.rotY}deg) rotateX(${t.rotX}deg)`,
                  transformStyle: "preserve-3d",
                  backfaceVisibility: "hidden",
                }}
              >
                <Tile url={t.url} active={false} />
              </div>
            ))}
          </motion.div>
        </div>

        {/* Vignettes */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[26%] z-30"
          style={{ background: "linear-gradient(0deg, #000 10%, transparent 100%)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[18%] z-20"
          style={{ background: "linear-gradient(180deg, #000 20%, transparent 100%)" }}
        />

        {/* Scroll hint */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-40 font-mono text-[10px] uppercase tracking-[0.3em] text-cream/40">
          scroll ↓
        </div>
      </div>
    </section>
  );
}
