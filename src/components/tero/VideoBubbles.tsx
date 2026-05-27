import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
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
  x: number;
  y: number;
  size: number;
  img: string;
  from: "left" | "right" | "top" | "bottom";
  order: number;
  bob: number;
  drift: number;
};

const bubbles: Bubble[] = [
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
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  return (
    <section
      ref={sectionRef}
      data-nav-theme="dark"
      className="relative w-full bg-[#070707]"
      style={{ height: "200vh" }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
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


        {/* Bubbles cluster — gentle parent breathing */}
        <motion.div
          className="absolute inset-0 z-10"
          animate={{ y: [0, -8, 0, 6, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          style={{ willChange: "transform" }}
        >
          {bubbles.map((b, i) => (
            <BubbleNode key={i} b={b} progress={scrollYProgress} />
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
}: {
  b: Bubble;
  progress: MotionValue<number>;
}) {
  const { ox, oy } = offscreenOffset(b.from);

  const start = b.order * 0.55;
  const end = Math.min(start + 0.45, 0.78);

  const x = useTransform(progress, [start, end], [ox, 0], { clamp: true });
  const y = useTransform(progress, [start, end], [oy, 0], { clamp: true });

  return (
    <motion.div
      className="absolute z-10"
      style={{
        left: `${b.x}%`,
        top: `${b.y}%`,
        width: `${b.size}px`,
        height: `${b.size}px`,
        translateX: "-50%",
        translateY: "-50%",
        x,
        y,
        willChange: "transform",
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
        <BubbleLink img={b.img} />
      </motion.div>
    </motion.div>
  );
}

function BubbleLink({ img }: { img: string }) {
  return (
    <Link
      to="/portfolio"
      className="group relative block w-full h-full rounded-full overflow-hidden transition-transform duration-500 ease-out hover:scale-[1.12] hover:z-30"
      style={{
        boxShadow:
          "0 28px 50px -22px rgba(0,0,0,0.85), inset 0 0 0 1px rgba(255,255,255,0.22)",
        transform: "translateZ(0)",
      }}
    >
      <img
        src={img}
        alt=""
        loading="lazy"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover scale-[1.05]"
      />

      {/* Glass depth — single static layer (cheap) */}
      <div
        aria-hidden
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 30% 22%, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.15) 14%, transparent 32%), radial-gradient(circle at 72% 80%, rgba(0,0,0,0.5) 0%, transparent 52%)",
        }}
      />

      {/* Fixed highlight */}
      <div
        aria-hidden
        className="absolute pointer-events-none rounded-full"
        style={{
          top: "10%",
          left: "16%",
          width: "22%",
          height: "14%",
          background:
            "radial-gradient(ellipse at center, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.5) 35%, transparent 70%)",
        }}
      />

      {/* Rim — single inset shadow */}
      <div
        aria-hidden
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          boxShadow:
            "inset -10px -16px 30px rgba(0,0,0,0.55), inset 0 0 0 1px rgba(255,255,255,0.16)",
        }}
      />
    </Link>
  );
}
