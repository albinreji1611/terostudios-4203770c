import { motion, useScroll, useTransform, useMotionValue, useSpring, MotionValue } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { useRef } from "react";
import p1 from "@/assets/portfolio-1.jpg";
import p2 from "@/assets/portfolio-2.jpg";
import p3 from "@/assets/portfolio-3.jpg";
import p4 from "@/assets/portfolio-4.jpg";
import p5 from "@/assets/portfolio-5.jpg";
import p6 from "@/assets/portfolio-6.jpg";

const IMAGES = [p1, p2, p3, p4, p5, p6];

type Bubble = {
  /** final cluster position, % of stage */
  x: number;
  y: number;
  size: number;
  img: string;
  /** entry direction */
  from: "left" | "right" | "top" | "bottom";
  /** entry order 0..1 — staggers convergence across scroll */
  order: number;
  bob: number;
  drift: number;
};

const bubbles: Bubble[] = [
  // Tight grape-like cluster — all bubbles overlap into one mass.
  { x: 50, y: 34, size: 150, from: "top",    order: 0.00, bob: 7.0, drift: 4.0, img: IMAGES[2] },
  { x: 44, y: 40, size: 128, from: "left",   order: 0.08, bob: 7.5, drift: 4.0, img: IMAGES[0] },
  { x: 56, y: 40, size: 140, from: "right",  order: 0.06, bob: 6.8, drift: 4.0, img: IMAGES[1] },
  { x: 41, y: 49, size: 122, from: "left",   order: 0.12, bob: 7.8, drift: 4.0, img: IMAGES[3] },
  { x: 50, y: 51, size: 172, from: "bottom", order: 0.04, bob: 8.4, drift: 3.5, img: IMAGES[4] },
  { x: 59, y: 50, size: 134, from: "right",  order: 0.10, bob: 7.1, drift: 4.0, img: IMAGES[5] },
  { x: 44, y: 60, size: 128, from: "bottom", order: 0.14, bob: 7.0, drift: 4.0, img: IMAGES[2] },
  { x: 55, y: 61, size: 144, from: "bottom", order: 0.05, bob: 8.0, drift: 3.8, img: IMAGES[0] },
  { x: 50, y: 70, size: 118, from: "bottom", order: 0.16, bob: 7.4, drift: 4.0, img: IMAGES[1] },
  { x: 62, y: 43, size: 104, from: "right",  order: 0.14, bob: 7.9, drift: 4.0, img: IMAGES[3] },
  { x: 38, y: 58, size: 108, from: "left",   order: 0.18, bob: 7.6, drift: 4.0, img: IMAGES[4] },
  { x: 58, y: 67, size:  98, from: "bottom", order: 0.20, bob: 6.9, drift: 4.0, img: IMAGES[5] },

  // Small accent bubbles tucked into the cluster.
  { x: 42, y: 33, size:  84, from: "left",   order: 0.30, bob: 8.5, drift: 4.0, img: IMAGES[1] },
  { x: 58, y: 33, size:  92, from: "right",  order: 0.26, bob: 9.0, drift: 4.0, img: IMAGES[2] },
  { x: 63, y: 58, size:  86, from: "right",  order: 0.34, bob: 7.8, drift: 4.0, img: IMAGES[4] },
  { x: 37, y: 68, size:  78, from: "left",   order: 0.36, bob: 8.2, drift: 4.0, img: IMAGES[0] },
  { x: 63, y: 72, size:  76, from: "bottom", order: 0.40, bob: 7.0, drift: 4.0, img: IMAGES[3] },
];

const offscreenOffset = (from: Bubble["from"]) => {
  switch (from) {
    case "left":   return { ox: -1400, oy:  120 };
    case "right":  return { ox:  1400, oy: -100 };
    case "top":    return { ox:    0,  oy: -900 };
    case "bottom": return { ox:    0,  oy:  900 };
  }
};

export function VideoBubbles() {
  // Pin section ~ 2.5 viewports tall — first 40% = bubbles converge, then hold.
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Track cursor inside the sticky stage (for glossy highlight follow)
  const stageRef = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.3);
  const smx = useSpring(mx, { stiffness: 120, damping: 20, mass: 0.5 });
  const smy = useSpring(my, { stiffness: 120, damping: 20, mass: 0.5 });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-[#070707]"
      style={{ height: "260vh" }}
    >
      {/* Sticky stage */}
      <div
        ref={stageRef}
        onMouseMove={onMove}
        className="sticky top-0 h-screen w-full overflow-hidden"
      >
        {/* grain */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-screen"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.6'/></svg>\")",
          }}
        />
        {/* vermillion ambient */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 55%, rgba(232,57,14,0.10) 0%, transparent 55%)",
          }}
        />

        {/* Background headline */}
        <div className="absolute inset-0 flex items-end justify-center pb-[10vh] px-6 pointer-events-none">
          <h2 className="font-display font-extrabold uppercase tracking-tighter text-center text-white/[0.07] leading-[0.85] text-[clamp(48px,11vw,200px)] select-none">
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

        {/* Bubbles converge based on scroll, then breathe as one locked cluster */}
        <motion.div
          className="absolute inset-0 z-10"
          animate={{ y: [0, -10, 0, 8, 0], x: [0, 5, 0, -4, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        >
          {bubbles.map((b, i) => (
            <BubbleNode
              key={i}
              b={b}
              progress={scrollYProgress}
              mx={smx}
              my={smy}
            />
          ))}
        </motion.div>

        {/* scroll hint */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
          Scroll ↓
        </div>
      </div>
    </section>
  );
}

function BubbleNode({
  b,
  progress,
  mx,
  my,
}: {
  b: Bubble;
  progress: MotionValue<number>;
  mx: MotionValue<number>;
  my: MotionValue<number>;
}) {
  const { ox, oy } = offscreenOffset(b.from);

  // Slower convergence: each bubble takes longer to travel from offscreen to its
  // cluster slot, and the cluster locks in by ~70% of scroll. After that, all
  // bubbles stay fully visible (no fade-out) for the remainder of the pin.
  const start = b.order * 0.55;
  const end = Math.min(start + 0.45, 0.78);

  const scrollX = useTransform(progress, [start, end], [ox, 0], { clamp: true });
  const scrollY = useTransform(progress, [start, end], [oy, 0], { clamp: true });

  // Cursor-reactive repulsion: bubbles push AWAY from the cursor.
  // Only active once the cluster is fully assembled (progress >= 0.78).
  const reach = 28; // px max nudge
  const hoverX = useTransform([mx, my, progress] as unknown as MotionValue<number>[], (v) => {
    const [vx, vy, pr] = v as unknown as number[];
    if (pr < 0.78) return 0;
    const dx = vx - b.x / 100;
    const dy = vy - b.y / 100;
    const d = Math.hypot(dx, dy);
    const falloff = Math.max(0, 1 - d / 0.3);
    return -dx * reach * falloff;
  });
  const hoverY = useTransform([mx, my, progress] as unknown as MotionValue<number>[], (v) => {
    const [vx, vy, pr] = v as unknown as number[];
    if (pr < 0.78) return 0;
    const dx = vx - b.x / 100;
    const dy = vy - b.y / 100;
    const d = Math.hypot(dx, dy);
    const falloff = Math.max(0, 1 - d / 0.3);
    return -dy * reach * falloff;
  });

  const x = useTransform([scrollX, hoverX] as MotionValue<number>[], (v) => (v as number[])[0] + (v as number[])[1]);
  const y = useTransform([scrollY, hoverY] as MotionValue<number>[], (v) => (v as number[])[0] + (v as number[])[1]);

  return (
    <motion.div
      className="absolute z-10"
      whileHover={{ scale: 1.18, zIndex: 50 }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
      style={{
        left: `${b.x}%`,
        top: `${b.y}%`,
        width: `${b.size}px`,
        height: `${b.size}px`,
        translateX: "-50%",
        translateY: "-50%",
        x,
        y,
        opacity: 1,
      }}
    >

      {/* subtle individual shimmer, while the parent keeps the cluster locked */}
      <motion.div
        animate={{
          y: [0, -b.drift, 0, b.drift * 0.45, 0],
          x: [0, b.drift * 0.22, 0, -b.drift * 0.18, 0],
        }}
        transition={{ duration: b.bob, repeat: Infinity, ease: "easeInOut" }}
        className="w-full h-full"
      >
        <BubbleLink img={b.img} bx={b.x} by={b.y} mx={mx} my={my} />
      </motion.div>
    </motion.div>
  );
}

function BubbleLink({
  img,
  bx,
  by,
  mx,
  my,
}: {
  img: string;
  bx: number;
  by: number;
  mx: MotionValue<number>;
  my: MotionValue<number>;
}) {
  // Move the specular highlight based on cursor distance to this bubble.
  const hlX = useTransform([mx, my] as unknown as MotionValue<number>[], (v) => {
    const [vx] = v as unknown as number[];
    // map cursor x (0..1) -> highlight x (10..70 %), biased by bubble's own x
    const offset = (vx - bx / 100) * 60;
    return `${Math.max(8, Math.min(78, 30 + offset))}%`;
  });
  const hlY = useTransform([mx, my] as unknown as MotionValue<number>[], (v) => {
    const [, vy] = v as unknown as number[];
    const offset = (vy - by / 100) * 60;
    return `${Math.max(8, Math.min(78, 22 + offset))}%`;
  });

  const glossBackground = useTransform(
    [hlX, hlY] as unknown as MotionValue<string>[],
    (v) => {
      const [x, y] = v as unknown as string[];
      return `radial-gradient(circle at ${x} ${y}, rgba(255,255,255,0.82) 0%, rgba(255,255,255,0.34) 13%, rgba(255,255,255,0.08) 27%, transparent 42%), radial-gradient(circle at ${100 - parseFloat(x)}% ${100 - parseFloat(y)}%, rgba(255,255,255,0.25) 0%, transparent 28%)`;
    }
  );

  return (
    <Link
      to="/portfolio"
      className="group relative block w-full h-full rounded-full overflow-hidden will-change-transform transition-transform duration-500 ease-out hover:scale-[1.16] hover:z-30"
      style={{
        boxShadow:
          // outer drop, soft contact shadow, rim light, inner glass tint
          "0 36px 70px -22px rgba(0,0,0,0.95), 0 14px 28px -18px rgba(0,0,0,0.6), 0 4px 10px -2px rgba(255,255,255,0.18), inset 0 0 0 1px rgba(255,255,255,0.28)",
      }}
    >
      {/* Photo content — slightly distorted via scale for refraction feel */}
      <img
        src={img}
        alt=""
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover scale-[1.08] saturate-[1.18] contrast-[1.10] transition-transform duration-700 ease-out group-hover:scale-[1.18]"
      />

      {/* Chromatic edge tint — bluish refraction ring like real glass */}
      <div
        aria-hidden
        className="absolute inset-0 rounded-full pointer-events-none mix-blend-screen"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, transparent 58%, rgba(120,180,255,0.18) 78%, rgba(255,180,210,0.12) 92%, transparent 100%)",
        }}
      />

      {/* Deep glass depth — top-left light, bottom-right shadow */}
      <div
        aria-hidden
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 30% 22%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.18) 14%, transparent 32%), radial-gradient(circle at 72% 80%, rgba(0,0,0,0.55) 0%, transparent 52%), linear-gradient(150deg, rgba(255,255,255,0.14) 0%, transparent 38%, rgba(0,0,0,0.30) 100%)",
        }}
      />

      {/* Cursor-following specular highlight (large soft) */}
      <motion.div
        aria-hidden
        className="absolute inset-0 rounded-full pointer-events-none opacity-90"
        style={{ background: glossBackground }}
      />

      {/* Crisp pin-prick specular — fixed top-left, simulates point light */}
      <div
        aria-hidden
        className="absolute pointer-events-none rounded-full"
        style={{
          top: "10%",
          left: "16%",
          width: "22%",
          height: "14%",
          background:
            "radial-gradient(ellipse at center, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.55) 35%, transparent 70%)",
          filter: "blur(1px)",
        }}
      />

      {/* Secondary small highlight */}
      <div
        aria-hidden
        className="absolute pointer-events-none rounded-full"
        style={{
          top: "22%",
          left: "30%",
          width: "8%",
          height: "5%",
          background: "rgba(255,255,255,0.85)",
          filter: "blur(0.5px)",
        }}
      />

      {/* hover sweep */}
      <div className="absolute inset-y-[-25%] left-[-80%] w-1/2 rotate-[24deg] bg-gradient-to-r from-transparent via-white/45 to-transparent blur-[2px] opacity-0 transition-all duration-700 ease-out group-hover:left-[130%] group-hover:opacity-100" />

      {/* Rim shading — dark vignette + bright thin rim */}
      <div
        aria-hidden
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          boxShadow:
            "inset 6px 10px 22px rgba(255,255,255,0.22), inset -14px -22px 40px rgba(0,0,0,0.72), inset 0 0 0 1.5px rgba(255,255,255,0.18), inset 0 -2px 6px rgba(255,255,255,0.10)",
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

