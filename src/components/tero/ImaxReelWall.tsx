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

// Dome geometry — viewer sits inside the dome looking outward.
// Tiles tile the inside surface of a hemisphere (upper half) packed tightly
// in latitude rings sized by circumference so they read as one continuous shell.
const RADIUS = 360;             // sphere radius (px) — sized to fit viewport
const TILE_W = 132;             // 16:9
const TILE_H = 74;
const GAP_FACTOR = 1.06;        // tile spacing vs tile width

type DomeTile = {
  url: string;
  x: number; y: number; z: number;
  rotY: number; rotX: number;
};

function buildDome(pool: { url: string }[]): DomeTile[] {
  const tiles: DomeTile[] = [];
  // Rings from horizon (phi=90°) up to near the zenith.
  // Ring spacing chosen so tile heights tile the surface vertically.
  const ringStep = (TILE_H * GAP_FACTOR) / RADIUS; // radians
  const phis: number[] = [];
  for (let phi = Math.PI / 2 - 0.05; phi > 0.18; phi -= ringStep) phis.push(phi);
  phis.push(0); // zenith cap

  let i = 0;
  phis.forEach((phi) => {
    const ringRadius = RADIUS * Math.sin(phi);
    const circumference = 2 * Math.PI * ringRadius;
    const count = Math.max(1, Math.floor(circumference / (TILE_W * GAP_FACTOR)));
    for (let k = 0; k < count; k++) {
      const theta = (k / count) * Math.PI * 2;
      const x = RADIUS * Math.sin(phi) * Math.cos(theta);
      const z = RADIUS * Math.sin(phi) * Math.sin(theta);
      const y = -RADIUS * Math.cos(phi); // up
      // Face outward (away from origin) so viewer outside the dome sees screens.
      const rotY = (Math.atan2(x, z) * 180) / Math.PI;
      const rotX = -(Math.asin(y / RADIUS) * 180) / Math.PI;
      tiles.push({ url: pool[i % pool.length].url, x, y, z, rotY, rotX });
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

        {/* Drifting nebula orbs (matches site ambient glow) */}
        <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden" style={{ mixBlendMode: "screen" }}>
          <div className="dome-orb dome-orb-1" />
          <div className="dome-orb dome-orb-2" />
          <div className="dome-orb dome-orb-3" />
        </div>

        {/* Dense starfield — two parallax layers */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none dome-stars dome-stars-far"
        />
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none dome-stars dome-stars-near"
        />

        {/* Film grain */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none opacity-[0.07] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.55'/></svg>\")",
            backgroundSize: "160px 160px",
          }}
        />

        <style>{`
          .dome-orb { position: absolute; border-radius: 9999px; filter: blur(80px); will-change: transform; }
          .dome-orb-1 { width: 560px; height: 560px; left: -8vw; top: 8vh; background: radial-gradient(circle, rgba(232,57,14,0.22) 0%, transparent 65%); animation: dome-drift-1 42s ease-in-out infinite alternate; }
          .dome-orb-2 { width: 640px; height: 640px; right: -10vw; top: 40vh; background: radial-gradient(circle, rgba(45,27,110,0.30) 0%, transparent 65%); animation: dome-drift-2 50s ease-in-out infinite alternate; }
          .dome-orb-3 { width: 480px; height: 480px; left: 35vw; top: 55vh; background: radial-gradient(circle, rgba(30,60,140,0.20) 0%, transparent 65%); animation: dome-drift-3 60s ease-in-out infinite alternate; }
          @keyframes dome-drift-1 { to { transform: translate3d(30vw, 20vh, 0); } }
          @keyframes dome-drift-2 { to { transform: translate3d(-25vw, -15vh, 0); } }
          @keyframes dome-drift-3 { to { transform: translate3d(-15vw, -25vh, 0); } }

          .dome-stars { background-repeat: repeat; opacity: 0.85; }
          .dome-stars-far {
            background-image:
              radial-gradient(1px 1px at 7% 12%, rgba(255,255,255,0.55), transparent 60%),
              radial-gradient(1px 1px at 19% 47%, rgba(255,255,255,0.4), transparent 60%),
              radial-gradient(1px 1px at 31% 78%, rgba(255,255,255,0.5), transparent 60%),
              radial-gradient(1px 1px at 44% 22%, rgba(255,255,255,0.45), transparent 60%),
              radial-gradient(1px 1px at 56% 64%, rgba(255,255,255,0.5), transparent 60%),
              radial-gradient(1px 1px at 68% 9%, rgba(255,255,255,0.4), transparent 60%),
              radial-gradient(1px 1px at 79% 53%, rgba(255,255,255,0.55), transparent 60%),
              radial-gradient(1px 1px at 88% 86%, rgba(255,255,255,0.45), transparent 60%),
              radial-gradient(1px 1px at 95% 30%, rgba(255,255,255,0.5), transparent 60%);
            background-size: 320px 320px;
            animation: dome-twinkle 6s ease-in-out infinite alternate;
          }
          .dome-stars-near {
            background-image:
              radial-gradient(1.6px 1.6px at 13% 32%, rgba(255,255,255,0.95), transparent 60%),
              radial-gradient(1.4px 1.4px at 27% 71%, rgba(220,230,255,0.85), transparent 60%),
              radial-gradient(1.8px 1.8px at 41% 18%, rgba(255,240,220,0.9), transparent 60%),
              radial-gradient(1.3px 1.3px at 58% 82%, rgba(255,255,255,0.7), transparent 60%),
              radial-gradient(1.6px 1.6px at 72% 38%, rgba(220,230,255,0.95), transparent 60%),
              radial-gradient(1.4px 1.4px at 84% 11%, rgba(255,255,255,0.85), transparent 60%),
              radial-gradient(1.8px 1.8px at 92% 67%, rgba(255,240,220,0.85), transparent 60%);
            background-size: 540px 540px;
            animation: dome-twinkle 4.5s ease-in-out infinite alternate-reverse;
          }
          @keyframes dome-twinkle { 0% { opacity: 0.55; } 100% { opacity: 1; } }
          @media (prefers-reduced-motion: reduce) {
            .dome-orb, .dome-stars { animation: none !important; }
          }
        `}</style>

        {/* Heading */}
        <div className="absolute inset-x-0 top-0 z-40 container-tero pt-8 md:pt-10">
          <header className="text-center">
            <div className="mb-2 flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-vermillion/60" />
              <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-vermillion">
                (01) The Dome Reel
              </span>
              <span className="h-px w-8 bg-vermillion/60" />
            </div>
            <h2 className="font-display text-[clamp(26px,3.8vw,52px)] leading-[1.1] tracking-tight text-[#fdfaf6] pb-1">
              Step inside the <span className="italic text-vermillion">dome.</span>
            </h2>
            <p className="mt-1 text-[10px] tracking-[0.28em] uppercase text-cream/45">
              Scroll to rotate the wall
            </p>
          </header>
        </div>

        {/* Stage — pushed below heading via top padding */}
        <div
          className="absolute inset-x-0 bottom-0 flex items-end justify-center overflow-hidden"
          style={{
            top: "26vh",
            perspective: "1200px",
            perspectiveOrigin: "50% 65%",
          }}
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
              translateY: "-8vh",
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
