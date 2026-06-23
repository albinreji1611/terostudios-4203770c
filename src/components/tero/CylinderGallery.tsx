import { useRef, useEffect, useState } from "react";
import {
  useScroll,
  useTransform,
  useSpring,
  motion,
  useMotionValue,
  useMotionValueEvent,
} from "framer-motion";
import { videos } from "@/data/videos";

const items = videos.slice(0, 10);

/**
 * Anamorphic curved video wall.
 * Cards sit on a wide ~160° arc. As you scroll the arc rotates so each card
 * sweeps through a central "spotlight" where it scales up, brightens and
 * stretches into a cinematic 2.39:1 frame. Side cards skew on rotateY to
 * read as anamorphic edges receding into the cream vignette.
 */
export function CylinderGallery() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const smooth = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 24,
    mass: 0.5,
  });

  const N = items.length;
  // Arc, not full cylinder
  const ARC_DEG = 160;
  const angleStep = ARC_DEG / (N - 1);
  const startAngle = -ARC_DEG / 2;

  // Bigger, cinematic anamorphic cards (2.39:1)
  const CARD_W = 520;
  const CARD_H = Math.round(CARD_W / 2.39);
  const RADIUS = 880;

  // Build-in: cards rise from a flat stack into the arc
  const buildIn = useTransform(smooth, [0, 0.18], [0, 1]);
  // Scroll steers the wall left/right through the arc
  const steer = useTransform(smooth, [0.18, 1], [ARC_DEG / 2, -ARC_DEG / 2]);
  // Slight downward tilt for the anamorphic horizon
  const tiltX = useTransform(buildIn, [0, 1], [10, -6]);

  // Idle drift
  const drift = useMotionValue(0);
  useEffect(() => {
    let raf = 0;
    let prev = performance.now();
    const tick = (now: number) => {
      const dt = (now - prev) / 1000;
      prev = now;
      drift.set(drift.get() + dt * 3.2);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [drift]);

  const rotateY = useTransform(
    [steer, drift],
    ([s, d]: number[]) => s + d * 0.35,
  );

  const [build, setBuild] = useState(0);
  useMotionValueEvent(buildIn, "change", (v) => setBuild(v));
  const [yawDeg, setYawDeg] = useState(0);
  useMotionValueEvent(rotateY, "change", (v) => setYawDeg(v));

  return (
    <section
      ref={ref}
      className="relative bg-ink text-cream"
      style={{ height: "340vh" }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Header */}
        <div className="absolute inset-x-0 top-[88px] md:top-[104px] z-30 flex flex-col items-center gap-3 px-8">
          <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-cream/55">
            (01) Reel · Anamorphic 2.39
          </span>
          <h2 className="font-display font-bold text-[clamp(30px,4.4vw,64px)] leading-[0.95] text-cream text-center">
            Stories that move.
          </h2>
          <div className="h-px w-24 bg-cream/20" />
        </div>

        {/* Cinematic floor gradient */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            background:
              "radial-gradient(80% 50% at 50% 62%, rgba(232,57,14,0.22) 0%, rgba(232,57,14,0.05) 38%, transparent 70%)",
          }}
        />
        {/* Horizontal scan line */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-0 right-0 z-[1] top-[58%] h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(247,231,204,0.18) 20%, rgba(232,57,14,0.55) 50%, rgba(247,231,204,0.18) 80%, transparent 100%)",
          }}
        />
        {/* Side vignettes */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[2]"
          style={{
            background:
              "linear-gradient(90deg, hsl(var(--ink)) 0%, transparent 14%, transparent 86%, hsl(var(--ink)) 100%)",
          }}
        />

        {/* 3D anamorphic stage */}
        <div
          className="absolute inset-0 z-10 flex items-center justify-center"
          style={{
            perspective: "1600px",
            perspectiveOrigin: "50% 55%",
          }}
        >
          <motion.div
            className="relative"
            style={{
              width: `${CARD_W}px`,
              height: `${CARD_H}px`,
              transformStyle: "preserve-3d",
              rotateX: tiltX,
              rotateY,
            }}
          >
            {items.map((item, i) => {
              const angle = startAngle + i * angleStep;
              // How close this card is to the spotlight (yaw=−angle puts it center)
              const delta = ((angle + yawDeg + 540) % 360) - 180;
              const proximity = Math.max(0, 1 - Math.abs(delta) / 60);
              const z = RADIUS * build;
              const featured = proximity > 0.85;

              return (
                <div
                  key={i}
                  className="absolute left-0 top-0 overflow-hidden rounded-[4px] bg-black ring-1 ring-cream/10"
                  style={{
                    width: `${CARD_W}px`,
                    height: `${CARD_H}px`,
                    transformStyle: "preserve-3d",
                    transform: `rotateY(${angle}deg) translateZ(${z}px) scale(${
                      0.78 + 0.32 * proximity * build
                    })`,
                    opacity: 0.35 + 0.65 * (0.25 + 0.75 * proximity) * (0.4 + 0.6 * build),
                    boxShadow: featured
                      ? "0 50px 120px -30px rgba(232,57,14,0.55), 0 30px 80px -20px rgba(0,0,0,0.7)"
                      : "0 30px 80px -20px rgba(0,0,0,0.6)",
                    filter: `saturate(${0.75 + 0.45 * proximity}) brightness(${
                      0.7 + 0.4 * proximity
                    })`,
                    transition:
                      "box-shadow 400ms ease, filter 400ms ease",
                  }}
                >
                  <video
                    src={item.url}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    controlsList="nodownload noremoteplayback"
                    disablePictureInPicture
                    onContextMenu={(e) => e.preventDefault()}
                    className="absolute inset-0 h-full w-full object-cover pointer-events-none select-none"
                  />

                  {/* Anamorphic letterbox bars */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 top-0 h-[6%] bg-black"
                  />
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-[6%] bg-black"
                  />

                  {/* Lens flare on featured */}
                  {featured && (
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0"
                      style={{
                        background:
                          "radial-gradient(60% 90% at 20% 30%, rgba(247,231,204,0.18) 0%, transparent 55%), radial-gradient(40% 70% at 85% 70%, rgba(232,57,14,0.22) 0%, transparent 60%)",
                        mixBlendMode: "screen",
                      }}
                    />
                  )}

                  {/* Bottom gradient + meta */}
                  <div
                    aria-hidden
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)",
                    }}
                  />
                  <div className="absolute bottom-[10%] left-4 right-4 flex items-end justify-between font-mono text-[10px] uppercase tracking-[0.28em] text-cream/90">
                    <span className="opacity-80">
                      {(i + 1).toString().padStart(2, "0")} / {N.toString().padStart(2, "0")}
                    </span>
                    <span className="text-cream">{item.client}</span>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* Footer rail */}
        <div className="absolute inset-x-0 bottom-8 z-30 flex items-center justify-between px-8 md:px-12 font-mono text-[10px] uppercase tracking-[0.3em] text-cream/55">
          <span>— Scroll to pan the wall</span>
          <span className="hidden md:inline">Anamorphic · 2.39:1 · {N} frames</span>
          <span>Tero · Reel</span>
        </div>
      </div>
    </section>
  );
}
