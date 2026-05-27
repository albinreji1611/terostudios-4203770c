import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  MotionValue,
} from "framer-motion";
import { Link } from "@tanstack/react-router";
import { useRef, useEffect, useState } from "react";
import p1 from "@/assets/portfolio-1.jpg";
import p2 from "@/assets/portfolio-2.jpg";
import p3 from "@/assets/portfolio-3.jpg";
import p4 from "@/assets/portfolio-4.jpg";
import p5 from "@/assets/portfolio-5.jpg";
import p6 from "@/assets/portfolio-6.jpg";

const IMAGES = [p1, p2, p3, p4, p5, p6];

type Bubble = {
  x: number; // % cluster position
  y: number;
  size: number;
  img: string;
  from: "left" | "right" | "top" | "bottom";
  order: number;
  bob: number;
  drift: number;
  depth: number; // 0..1, used for swirl radius
  angle: number; // base swirl angle in radians
};

// Cluster — center-packed, similar to reference
const bubbles: Bubble[] = [
  { x: 50, y: 50, size: 168, from: "top",    order: 0.00, bob: 7.0, drift: 4, depth: 0.0,  angle: 0,        img: IMAGES[2] },
  { x: 44, y: 44, size: 132, from: "left",   order: 0.06, bob: 7.5, drift: 4, depth: 0.45, angle: 2.4,      img: IMAGES[0] },
  { x: 57, y: 43, size: 140, from: "right",  order: 0.05, bob: 6.8, drift: 4, depth: 0.5,  angle: 0.9,      img: IMAGES[1] },
  { x: 41, y: 56, size: 124, from: "left",   order: 0.10, bob: 7.8, drift: 4, depth: 0.55, angle: 3.6,      img: IMAGES[3] },
  { x: 59, y: 56, size: 134, from: "right",  order: 0.08, bob: 7.1, drift: 4, depth: 0.5,  angle: 5.2,      img: IMAGES[5] },
  { x: 50, y: 38, size: 108, from: "top",    order: 0.12, bob: 8.0, drift: 4, depth: 0.6,  angle: 1.6,      img: IMAGES[4] },
  { x: 50, y: 62, size: 116, from: "bottom", order: 0.11, bob: 7.4, drift: 4, depth: 0.6,  angle: 4.5,      img: IMAGES[1] },
  { x: 36, y: 49, size: 100, from: "left",   order: 0.16, bob: 7.6, drift: 4, depth: 0.75, angle: 3.1,      img: IMAGES[4] },
  { x: 64, y: 49, size: 104, from: "right",  order: 0.15, bob: 7.9, drift: 4, depth: 0.75, angle: 0.0,      img: IMAGES[3] },
  { x: 42, y: 36, size:  88, from: "top",    order: 0.20, bob: 8.5, drift: 4, depth: 0.85, angle: 2.0,      img: IMAGES[1] },
  { x: 58, y: 36, size:  92, from: "top",    order: 0.18, bob: 9.0, drift: 4, depth: 0.85, angle: 1.1,      img: IMAGES[2] },
  { x: 42, y: 64, size:  86, from: "bottom", order: 0.22, bob: 7.8, drift: 4, depth: 0.9,  angle: 3.9,      img: IMAGES[0] },
  { x: 58, y: 64, size:  90, from: "bottom", order: 0.21, bob: 8.2, drift: 4, depth: 0.9,  angle: 5.0,      img: IMAGES[5] },
  { x: 32, y: 41, size:  72, from: "left",   order: 0.26, bob: 7.0, drift: 4, depth: 1.0,  angle: 2.7,      img: IMAGES[3] },
  { x: 68, y: 41, size:  76, from: "right",  order: 0.24, bob: 7.5, drift: 4, depth: 1.0,  angle: 0.4,      img: IMAGES[0] },
  { x: 32, y: 58, size:  70, from: "left",   order: 0.28, bob: 8.1, drift: 4, depth: 1.0,  angle: 3.4,      img: IMAGES[2] },
  { x: 68, y: 58, size:  74, from: "right",  order: 0.27, bob: 6.9, drift: 4, depth: 1.0,  angle: 5.6,      img: IMAGES[4] },
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
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Mouse position relative to stage (for repel)
  const mx = useMotionValue(-9999);
  const my = useMotionValue(-9999);
  const smx = useSpring(mx, { stiffness: 120, damping: 18, mass: 0.4 });
  const smy = useSpring(my, { stiffness: 120, damping: 18, mass: 0.4 });

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const move = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      mx.set(e.clientX - r.left);
      my.set(e.clientY - r.top);
    };
    const leave = () => {
      mx.set(-9999);
      my.set(-9999);
    };
    window.addEventListener("mousemove", move, { passive: true });
    el.addEventListener("mouseleave", leave);
    return () => {
      window.removeEventListener("mousemove", move);
      el.removeEventListener("mouseleave", leave);
    };
  }, [mx, my]);

  // Swirl progress (0..1) starts after cluster has assembled
  const swirl = useTransform(scrollYProgress, [0.55, 0.95], [0, 1], { clamp: true });
  // Headline reveal pieces
  const leftX = useTransform(scrollYProgress, [0.35, 0.6], [-80, 0]);
  const rightX = useTransform(scrollYProgress, [0.35, 0.6], [80, 0]);
  const sideOpacity = useTransform(scrollYProgress, [0.35, 0.55], [0, 1]);

  return (
    <section
      ref={sectionRef}
      data-nav-theme="dark"
      className="relative w-full bg-[#070707]"
      style={{ height: "260vh" }}
    >
      <div ref={stageRef} className="sticky top-0 h-screen w-full overflow-hidden">
        {/* vermillion ambient */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 55%, rgba(232,57,14,0.10) 0%, transparent 55%)",
          }}
        />

        {/* Side editorial text */}
        <motion.div
          style={{ x: leftX, opacity: sideOpacity }}
          className="absolute left-6 md:left-10 top-1/2 -translate-y-1/2 z-20 pointer-events-none"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-white/50 mb-3">
            (01) Reel
          </p>
          <h3 className="font-display font-bold text-white text-[clamp(28px,4vw,56px)] leading-[0.95] max-w-[12ch]">
            Stories<br/>that move.
          </h3>
        </motion.div>

        <motion.div
          style={{ x: rightX, opacity: sideOpacity }}
          className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 z-20 pointer-events-none text-right"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-white/50 mb-3">
            (02) Studio
          </p>
          <h3 className="font-display font-bold text-white text-[clamp(28px,4vw,56px)] leading-[0.95] max-w-[14ch] ml-auto">
            Crafted in<br/>motion.
          </h3>
        </motion.div>

        {/* Background mega-headline */}
        <div className="absolute inset-0 flex items-end justify-center pb-[6vh] px-6 pointer-events-none">
          <h2 className="font-display font-extrabold uppercase tracking-tighter text-center text-white/[0.06] leading-[0.85] text-[clamp(48px,11vw,200px)] select-none">
            Tero Reel ’26
          </h2>
        </div>

        {/* Bubbles cluster */}
        <motion.div
          className="absolute inset-0 z-10"
          animate={{ y: [0, -6, 0, 5, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          style={{ willChange: "transform" }}
        >
          {bubbles.map((b, i) => (
            <BubbleNode
              key={i}
              b={b}
              progress={scrollYProgress}
              swirl={swirl}
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
  swirl,
  mx,
  my,
}: {
  b: Bubble;
  progress: MotionValue<number>;
  swirl: MotionValue<number>;
  mx: MotionValue<number>;
  my: MotionValue<number>;
}) {
  const { ox, oy } = offscreenOffset(b.from);
  const nodeRef = useRef<HTMLDivElement>(null);

  const start = b.order * 0.45;
  const end = Math.min(start + 0.4, 0.6);

  // Fly-in
  const inX = useTransform(progress, [start, end], [ox, 0], { clamp: true });
  const inY = useTransform(progress, [start, end], [oy, 0], { clamp: true });

  // Swirl orbit radius scaled by depth — outer bubbles travel farther
  const swirlRadius = 60 + b.depth * 140;

  // Per-bubble swirl x/y derived from swirl progress
  const swirlX = useTransform(swirl, (s) => {
    const a = b.angle + s * Math.PI * 2; // full 360
    return Math.cos(a) * swirlRadius * s;
  });
  const swirlY = useTransform(swirl, (s) => {
    const a = b.angle + s * Math.PI * 2;
    return Math.sin(a) * swirlRadius * s * 0.65;
  });

  // Rotation + depth swap (going "behind")
  const rotateY = useTransform(swirl, [0, 1], [0, 360]);
  const zIndex = useTransform(swirl, (s) => {
    // Bubbles in back half of swirl drop behind
    const a = b.angle + s * Math.PI * 2;
    return Math.sin(a) > 0 ? 20 : 5;
  });
  const scaleSwirl = useTransform(swirl, (s) => {
    const a = b.angle + s * Math.PI * 2;
    return 1 + Math.sin(a) * 0.12 * s;
  });

  // Repel from mouse
  const repelX = useMotionValue(0);
  const repelY = useMotionValue(0);
  const sRepelX = useSpring(repelX, { stiffness: 160, damping: 20, mass: 0.5 });
  const sRepelY = useSpring(repelY, { stiffness: 160, damping: 20, mass: 0.5 });

  useEffect(() => {
    const update = () => {
      const node = nodeRef.current;
      if (!node) return;
      const parent = node.offsetParent as HTMLElement | null;
      if (!parent) return;
      const pr = parent.getBoundingClientRect();
      const nr = node.getBoundingClientRect();
      const cx = nr.left - pr.left + nr.width / 2;
      const cy = nr.top - pr.top + nr.height / 2;
      const dx = cx - mx.get();
      const dy = cy - my.get();
      const dist = Math.hypot(dx, dy);
      const radius = 180;
      if (dist < radius && dist > 0.01) {
        const force = (1 - dist / radius) * 70;
        repelX.set((dx / dist) * force);
        repelY.set((dy / dist) * force);
      } else {
        repelX.set(0);
        repelY.set(0);
      }
    };
    const unsubX = mx.on("change", update);
    const unsubY = my.on("change", update);
    return () => {
      unsubX();
      unsubY();
    };
  }, [mx, my, repelX, repelY]);

  // Combined x/y
  const x = useTransform(
    [inX, swirlX, sRepelX] as any,
    ([a, c, d]: number[]) => a + c + d
  );
  const y = useTransform(
    [inY, swirlY, sRepelY] as any,
    ([a, c, d]: number[]) => a + c + d
  );

  return (
    <motion.div
      ref={nodeRef}
      className="absolute"
      style={{
        left: `${b.x}%`,
        top: `${b.y}%`,
        width: `${b.size}px`,
        height: `${b.size}px`,
        translateX: "-50%",
        translateY: "-50%",
        x,
        y,
        zIndex,
        willChange: "transform",
        perspective: 800,
      }}
    >
      <motion.div
        animate={{
          y: [0, -b.drift, 0, b.drift * 0.45, 0],
          x: [0, b.drift * 0.22, 0, -b.drift * 0.18, 0],
        }}
        transition={{ duration: b.bob, repeat: Infinity, ease: "easeInOut" }}
        className="w-full h-full"
        style={{ willChange: "transform" }}
      >
        <motion.div
          className="w-full h-full"
          style={{
            rotateY,
            scale: scaleSwirl,
            transformStyle: "preserve-3d",
          }}
        >
          <BubbleLink img={b.img} />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function BubbleLink({ img }: { img: string }) {
  return (
    <Link
      to="/portfolio"
      className="group relative block w-full h-full rounded-full transition-transform duration-500 ease-out hover:scale-[1.08]"
      style={{
        filter:
          "drop-shadow(0 22px 28px rgba(0,0,0,0.55)) drop-shadow(0 8px 14px rgba(0,0,0,0.4))",
        transform: "translateZ(0)",
      }}
    >
      <div className="relative w-full h-full rounded-full overflow-hidden">
        <img
          src={img}
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ transform: "scale(1.08)", filter: "saturate(1.05) contrast(1.05)" }}
        />
        <div aria-hidden className="absolute inset-0 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle at 50% 50%, transparent 48%, rgba(0,0,0,0.35) 78%, rgba(0,0,0,0.7) 100%)" }} />
        <div aria-hidden className="absolute inset-0 rounded-full pointer-events-none mix-blend-screen"
          style={{ background: "radial-gradient(circle at 78% 82%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.18) 12%, transparent 24%)" }} />
        <div aria-hidden className="absolute inset-0 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle at 50% 0%, rgba(0,0,0,0.45) 0%, transparent 38%)" }} />
        <div aria-hidden className="absolute inset-0 rounded-full pointer-events-none mix-blend-screen opacity-60"
          style={{ background: "radial-gradient(circle at 28% 22%, rgba(180,210,255,0.35) 0%, transparent 30%)" }} />
        <div aria-hidden className="absolute pointer-events-none"
          style={{ top: "6%", left: "14%", width: "38%", height: "26%", borderRadius: "50%",
            background: "radial-gradient(ellipse at 35% 30%, rgba(255,255,255,1) 0%, rgba(255,255,255,0.7) 22%, rgba(255,255,255,0.15) 55%, transparent 80%)",
            filter: "blur(0.4px)" }} />
        <div aria-hidden className="absolute pointer-events-none rounded-full"
          style={{ top: "11%", left: "22%", width: "8%", height: "8%",
            background: "radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,255,255,0.6) 40%, transparent 75%)" }} />
        <div aria-hidden className="absolute pointer-events-none"
          style={{ bottom: "10%", left: "20%", width: "32%", height: "10%", borderRadius: "50%",
            background: "radial-gradient(ellipse at center, rgba(255,255,255,0.45) 0%, transparent 70%)",
            filter: "blur(1px)" }} />
        <div aria-hidden className="absolute inset-0 rounded-full pointer-events-none"
          style={{ boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.55), inset -8px -14px 26px rgba(0,0,0,0.55), inset 6px 10px 22px rgba(255,255,255,0.18)" }} />
      </div>
    </Link>
  );
}
