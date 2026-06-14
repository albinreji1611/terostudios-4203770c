import { useRef, useEffect, useState } from "react";
import { useScroll, useTransform, useSpring, motion, useMotionValue, useMotionValueEvent } from "framer-motion";
import { videos } from "@/data/videos";

const items = videos.slice(0, 12);

export function CylinderGallery() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // Smooth the scroll for nicer motion
  const smooth = useSpring(scrollYProgress, { stiffness: 80, damping: 22, mass: 0.4 });

  const N = items.length;
  const angleStep = 360 / N;
  // Card sizing caps (px). Cards fit within these while preserving aspect ratio.
  const MAX_W = 260;
  const MAX_H = 260;
  // Radius derived so widest possible card + gap doesn't overlap its neighbour.
  // chord = 2*R*sin(π/N) must be ≥ MAX_W + gap
  const GAP = 28;
  const RADIUS = Math.ceil((MAX_W + GAP) / (2 * Math.sin(Math.PI / N)));

  // Fan-out progress (0 → 1) drives spread + scroll rotation
  const fanOut = useTransform(smooth, [0, 0.18], [0, 1]);
  // Scroll-driven rotation (after fan-out): user steers the cylinder
  const scrollRotate = useTransform(smooth, [0.18, 1], [0, 360]);
  // Subtle X tilt to show depth
  const tiltX = useTransform(fanOut, [0, 1], [0, -12]);

  // Auto-rotation
  const auto = useMotionValue(0);
  useEffect(() => {
    let raf = 0;
    let prev = performance.now();
    const tick = (now: number) => {
      const dt = (now - prev) / 1000;
      prev = now;
      auto.set(auto.get() + dt * 8); // 8deg / sec
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [auto]);

  // Combined Y rotation = scrollRotate + auto
  const rotateY = useTransform([scrollRotate, auto], ([s, a]: number[]) => s + a);

  // Per-card transform (we mount with CSS vars and animate via fanOut)
  const [fanVal, setFanVal] = useState(0);
  useMotionValueEvent(fanOut, "change", (v) => setFanVal(v));

  return (
    <section
      ref={ref}
      className="relative bg-ink text-cream"
      style={{ height: "320vh" }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        {/* Header */}
        <div className="absolute inset-x-0 top-[88px] md:top-[96px] z-20 flex flex-col items-center gap-2 px-8">
          <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-cream/60">
            (01) Reel
          </span>
          <h2 className="font-display font-bold text-[clamp(28px,4vw,56px)] leading-[0.95] text-cream text-center">
            Stories that move.
          </h2>
        </div>

        {/* Ambient glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            background:
              "radial-gradient(60% 50% at 50% 55%, rgba(232,57,14,0.18) 0%, transparent 70%)",
          }}
        />

        {/* 3D stage */}
        <div
          className="relative z-10"
          style={{
            perspective: "1400px",
            perspectiveOrigin: "50% 50%",
            width: "min(60vw, 540px)",
            height: "min(50vh, 380px)",
          }}
        >
          <motion.div
            className="relative h-full w-full"
            style={{
              transformStyle: "preserve-3d",
              rotateX: tiltX,
              rotateY,
            }}
          >
            {items.map((item, i) => {
              const angle = i * angleStep;
              const z = RADIUS * fanVal;
              // Fit within MAX_W x MAX_H while preserving aspect ratio
              const fitByWidth = MAX_W / item.aspect <= MAX_H;
              const w = fitByWidth ? MAX_W : MAX_H * item.aspect;
              const h = fitByWidth ? MAX_W / item.aspect : MAX_H;
              return (
                <div
                  key={i}
                  className="absolute left-1/2 top-1/2 overflow-hidden rounded-[6px] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] ring-1 ring-cream/10 bg-black"
                  style={{
                    width: `${w}px`,
                    height: `${h}px`,
                    marginLeft: `${-w / 2}px`,
                    marginTop: `${-h / 2}px`,
                    transformStyle: "preserve-3d",
                    transform: `rotateY(${angle}deg) translateZ(${z}px)`,
                    backfaceVisibility: "visible",
                    opacity: 0.55 + 0.45 * fanVal,
                  }}
                >
                  <video
                    src={item.url}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    className="absolute inset-0 h-full w-full object-cover"
                  />


                  <div
                    aria-hidden
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(0,0,0,0.55) 100%)",
                    }}
                  />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-cream/90">
                    <span>0{(i + 1).toString().slice(-2)}</span>
                    <span>{item.client}</span>

                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* Scroll hint */}
        <div className="absolute inset-x-0 bottom-8 z-20 flex items-center justify-between px-8 md:px-12 font-mono text-[10px] uppercase tracking-[0.3em] text-cream/50">
          <span>— Scroll to orbit</span>
          <span>3D Cylinder · {N} frames</span>
        </div>
      </div>
    </section>
  );
}
