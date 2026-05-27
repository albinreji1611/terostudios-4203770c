import { useRef, useEffect, useState } from "react";
import { useScroll, useTransform, useSpring, motion, useMotionValue, useMotionValueEvent } from "framer-motion";
import p1 from "@/assets/portfolio-1.jpg";
import p2 from "@/assets/portfolio-2.jpg";
import p3 from "@/assets/portfolio-3.jpg";
import p4 from "@/assets/portfolio-4.jpg";
import p5 from "@/assets/portfolio-5.jpg";
import p6 from "@/assets/portfolio-6.jpg";
import p7 from "@/assets/process-3dmodel.jpg";
import p8 from "@/assets/process-lighting.jpg";
import p9 from "@/assets/process-vfx.jpg";
import p10 from "@/assets/process-storyboard.jpg";
import p11 from "@/assets/process-animatics.jpg";
import p12 from "@/assets/process-delivery.jpg";

const images = [p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12];

export function CylinderGallery() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // Smooth the scroll for nicer motion
  const smooth = useSpring(scrollYProgress, { stiffness: 80, damping: 22, mass: 0.4 });

  const N = images.length;
  const angleStep = 360 / N;
  const RADIUS = 520; // translateZ in px

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
            Selected work
          </span>
          <h2 className="font-display text-[clamp(22px,2.4vw,32px)] leading-none text-cream">
            Cylinder Reel
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
            perspective: "1600px",
            perspectiveOrigin: "50% 50%",
            width: "min(70vw, 720px)",
            height: "min(60vh, 520px)",
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
            {images.map((src, i) => {
              const angle = i * angleStep;
              // Translate Z grows from 0 to RADIUS as fanOut goes 0 → 1
              const z = RADIUS * fanVal;
              return (
                <div
                  key={i}
                  className="absolute left-1/2 top-1/2 overflow-hidden rounded-[6px] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] ring-1 ring-cream/10"
                  style={{
                    width: "min(36vw, 320px)",
                    height: "min(44vh, 420px)",
                    marginLeft: "min(-18vw, -160px)",
                    marginTop: "min(-22vh, -210px)",
                    transformStyle: "preserve-3d",
                    transform: `rotateY(${angle}deg) translateZ(${z}px)`,
                    backfaceVisibility: "hidden",
                  }}
                >
                  <img
                    src={src}
                    alt=""
                    loading="lazy"
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
                    <span>Tero · Reel</span>
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
