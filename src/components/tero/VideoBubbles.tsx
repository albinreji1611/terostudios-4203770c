import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import p1 from "@/assets/portfolio-1.jpg";
import p2 from "@/assets/portfolio-2.jpg";
import p3 from "@/assets/portfolio-3.jpg";
import p4 from "@/assets/portfolio-4.jpg";
import p5 from "@/assets/portfolio-5.jpg";
import p6 from "@/assets/portfolio-6.jpg";

const IMAGES = [p1, p2, p3, p4, p5, p6];

type Bubble = {
  /** center x in % of stage */
  x: number;
  /** center y in % of stage */
  y: number;
  /** diameter in px (will be scaled by stage) */
  size: number;
  img: string;
  from: "left" | "right" | "top" | "bottom";
  delay: number;
  bob: number;
  drift: number;
  cluster?: boolean;
};

/**
 * Densely-packed organic cluster around the center, plus a handful of
 * free-floating outliers — modeled after the elva-labs hero composition.
 * Positions are tuned by hand so spheres overlap and form a "grape" mass.
 */
const bubbles: Bubble[] = [
  // ---- Dense central cluster ----
  { x: 47, y: 28, size: 150, from: "top",    delay: 0.05, bob: 6.5, drift: 8, cluster: true, img: IMAGES[2] },
  { x: 41, y: 38, size: 130, from: "left",   delay: 0.12, bob: 7.2, drift: 6, cluster: true, img: IMAGES[0] },
  { x: 53, y: 38, size: 140, from: "right",  delay: 0.10, bob: 6.8, drift: 7, cluster: true, img: IMAGES[1] },
  { x: 36, y: 50, size: 120, from: "left",   delay: 0.18, bob: 7.8, drift: 9, cluster: true, img: IMAGES[3] },
  { x: 48, y: 50, size: 170, from: "bottom", delay: 0.0,  bob: 8.4, drift: 5, cluster: true, img: IMAGES[4] },
  { x: 60, y: 50, size: 135, from: "right",  delay: 0.15, bob: 6.4, drift: 8, cluster: true, img: IMAGES[5] },
  { x: 42, y: 62, size: 125, from: "bottom", delay: 0.20, bob: 7.0, drift: 7, cluster: true, img: IMAGES[2] },
  { x: 54, y: 63, size: 145, from: "bottom", delay: 0.08, bob: 8.0, drift: 6, cluster: true, img: IMAGES[0] },
  { x: 47, y: 74, size: 115, from: "bottom", delay: 0.24, bob: 6.6, drift: 9, cluster: true, img: IMAGES[1] },
  { x: 65, y: 38, size: 100, from: "right",  delay: 0.22, bob: 7.4, drift: 8, cluster: true, img: IMAGES[3] },
  { x: 33, y: 64, size: 105, from: "left",   delay: 0.26, bob: 7.6, drift: 8, cluster: true, img: IMAGES[4] },
  { x: 60, y: 72, size:  95, from: "bottom", delay: 0.28, bob: 6.2, drift: 9, cluster: true, img: IMAGES[5] },

  // ---- Free-floating outliers ----
  { x: 12, y: 22, size:  80, from: "left",   delay: 0.35, bob: 8.5, drift: 14, img: IMAGES[1] },
  { x: 88, y: 18, size:  95, from: "right",  delay: 0.30, bob: 9.0, drift: 16, img: IMAGES[2] },
  { x: 90, y: 70, size:  85, from: "right",  delay: 0.40, bob: 7.8, drift: 12, img: IMAGES[4] },
  { x:  8, y: 78, size:  75, from: "left",   delay: 0.45, bob: 8.2, drift: 13, img: IMAGES[0] },
  { x: 78, y: 88, size:  70, from: "bottom", delay: 0.50, bob: 7.0, drift: 11, img: IMAGES[3] },
];

const offscreen = (b: Bubble) => {
  switch (b.from) {
    case "left":   return { x: -900, y: 80,   opacity: 0 };
    case "right":  return { x: 900,  y: -60,  opacity: 0 };
    case "top":    return { x: 0,    y: -700, opacity: 0 };
    case "bottom": return { x: 0,    y: 700,  opacity: 0 };
  }
};

export function VideoBubbles() {
  return (
    <section className="relative w-full bg-[#070707] overflow-hidden">
      {/* subtle grain / vignette */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-screen"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.6'/></svg>\")",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 55%, rgba(232,57,14,0.10) 0%, transparent 55%)",
        }}
      />

      {/* Stage */}
      <div className="relative w-full h-[100vh] min-h-[720px]">
        {/* Giant background headline behind the cluster */}
        <div className="absolute inset-0 flex items-end justify-center pb-[12vh] px-6">
          <h2 className="font-display font-extrabold uppercase tracking-tighter text-center text-white/[0.08] leading-[0.85] text-[clamp(48px,11vw,200px)] select-none">
            Stories that <br className="hidden md:block" />
            move you.
          </h2>
        </div>

        {/* Top-left caption */}
        <div className="absolute top-8 left-8 z-20">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
            — Selected work
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/30 mt-1">
            Reel · v1.0
          </p>
        </div>

        {/* Top-right CTA */}
        <Link
          to="/portfolio"
          className="absolute top-8 right-8 z-20 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.04] backdrop-blur px-4 py-2 font-mono text-[11px] uppercase tracking-[0.25em] text-white/90 hover:bg-white/10 transition-colors"
        >
          View all <span className="inline-block w-1.5 h-1.5 rounded-full bg-vermillion" />
        </Link>

        {/* Bubbles */}
        {bubbles.map((b, i) => (
          <motion.div
            key={i}
            initial={offscreen(b)}
            animate={{ x: 0, y: 0, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 55,
              damping: 13,
              mass: 1.1,
              delay: 0.3 + b.delay,
            }}
            className="absolute z-10"
            style={{
              left: `${b.x}%`,
              top: `${b.y}%`,
              width: `${b.size}px`,
              height: `${b.size}px`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <motion.div
              animate={{
                y: [0, -b.drift, 0, b.drift * 0.6, 0],
                x: [0, b.drift * 0.4, 0, -b.drift * 0.3, 0],
              }}
              transition={{ duration: b.bob, repeat: Infinity, ease: "easeInOut" }}
              className="w-full h-full"
            >
              <BubbleLink img={b.img} />
            </motion.div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function BubbleLink({ img }: { img: string }) {
  return (
    <Link
      to="/portfolio"
      className="group relative block w-full h-full rounded-full overflow-hidden will-change-transform transition-transform duration-500 ease-out hover:scale-[1.12]"
      style={{
        boxShadow:
          "0 25px 60px -20px rgba(0,0,0,0.7), inset 0 0 0 1px rgba(255,255,255,0.08)",
      }}
    >
      {/* When you have video files, swap <img> for <video src=... autoPlay loop muted playsInline /> */}
      <img
        src={img}
        alt=""
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Glass tint */}
      <div className="absolute inset-0 bg-black/10" />
      {/* Top specular highlight — glossy sphere */}
      <div
        aria-hidden
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 30% 22%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.15) 12%, transparent 30%), radial-gradient(circle at 70% 78%, rgba(255,255,255,0.25) 0%, transparent 25%)",
        }}
      />
      {/* Rim light */}
      <div
        aria-hidden
        className="absolute inset-0 rounded-full"
        style={{
          boxShadow:
            "inset 0 -8px 20px rgba(255,255,255,0.15), inset 0 8px 18px rgba(0,0,0,0.35)",
        }}
      />
      {/* Hover play icon */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="w-10 h-10 rounded-full border border-white/70 backdrop-blur-sm flex items-center justify-center bg-black/40">
          <span className="block w-0 h-0 border-t-[6px] border-t-transparent border-l-[9px] border-l-white border-b-[6px] border-b-transparent ml-1" />
        </div>
      </div>
    </Link>
  );
}
