import { Link } from "@tanstack/react-router";
import { useRef, useEffect, useState } from "react";
import p1 from "@/assets/portfolio-1.jpg";
import p2 from "@/assets/portfolio-2.jpg";
import p3 from "@/assets/portfolio-3.jpg";
import p4 from "@/assets/portfolio-4.jpg";
import p5 from "@/assets/portfolio-5.jpg";
import p6 from "@/assets/portfolio-6.jpg";

const IMAGES = [p1, p2, p3, p4, p5, p6];

// Bubble layout in a 3D-ish cluster.
// theta (yaw around vertical axis), phi (vertical offset 0=center), r (radius), size, img.
type B = { theta: number; phi: number; r: number; size: number; img: string; from: "l" | "r" | "t" | "b"; bob: number };

const BUBBLES: B[] = [
  { theta: 0.0,  phi:  0.00, r: 0,   size: 200, img: IMAGES[2], from: "t", bob: 6.5 },
  { theta: 0.6,  phi: -0.12, r: 110, size: 160, img: IMAGES[0], from: "l", bob: 7.0 },
  { theta: 2.6,  phi:  0.10, r: 115, size: 168, img: IMAGES[1], from: "r", bob: 7.4 },
  { theta: 4.0,  phi: -0.14, r: 130, size: 150, img: IMAGES[3], from: "l", bob: 6.8 },
  { theta: 5.5,  phi:  0.16, r: 135, size: 158, img: IMAGES[5], from: "r", bob: 7.2 },
  { theta: 1.3,  phi:  0.22, r: 160, size: 130, img: IMAGES[4], from: "t", bob: 7.8 },
  { theta: 3.8,  phi: -0.24, r: 165, size: 134, img: IMAGES[1], from: "b", bob: 6.6 },
  { theta: 0.9,  phi: -0.30, r: 190, size: 118, img: IMAGES[4], from: "l", bob: 8.2 },
  { theta: 3.1,  phi:  0.28, r: 195, size: 122, img: IMAGES[3], from: "r", bob: 7.5 },
  { theta: 2.0,  phi: -0.04, r: 215, size: 104, img: IMAGES[1], from: "t", bob: 8.5 },
  { theta: 4.7,  phi:  0.04, r: 220, size: 108, img: IMAGES[2], from: "t", bob: 9.0 },
  { theta: 1.8,  phi:  0.34, r: 240, size:  96, img: IMAGES[0], from: "b", bob: 7.9 },
  { theta: 5.0,  phi: -0.36, r: 245, size: 100, img: IMAGES[5], from: "b", bob: 8.1 },
  { theta: 0.3,  phi:  0.06, r: 265, size:  86, img: IMAGES[3], from: "l", bob: 7.1 },
  { theta: 2.3,  phi: -0.08, r: 270, size:  90, img: IMAGES[0], from: "r", bob: 7.6 },
  { theta: 3.5,  phi:  0.20, r: 285, size:  82, img: IMAGES[2], from: "l", bob: 8.0 },
  { theta: 5.8,  phi: -0.20, r: 290, size:  86, img: IMAGES[4], from: "r", bob: 7.0 },
];

const FROM_OFFSET = { l: { x: -1500, y: 100 }, r: { x: 1500, y: -100 }, t: { x: 0, y: -1000 }, b: { x: 0, y: 1000 } };

export function VideoBubbles() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const nodesRef = useRef<HTMLDivElement[]>([]);
  const sideLRef = useRef<HTMLDivElement>(null);
  const sideRRef = useRef<HTMLDivElement>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    }
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return;

    let mx = -9999, my = -9999;
    let smx = -9999, smy = -9999;
    let progress = 0;
    let raf = 0;
    let t0 = performance.now();

    const onMove = (e: MouseEvent) => {
      const r = stage.getBoundingClientRect();
      mx = e.clientX - r.left;
      my = e.clientY - r.top;
    };
    const onLeave = () => { mx = -9999; my = -9999; };

    const computeProgress = () => {
      const r = section.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      const p = Math.min(1, Math.max(0, -r.top / Math.max(1, total)));
      progress = p;
    };

    const tick = () => {
      const now = performance.now();
      const t = (now - t0) / 1000;
      // smooth mouse
      smx += (mx - smx) * 0.15;
      smy += (my - smy) * 0.15;

      // Phases
      // 0.00 - 0.30: fly in
      // 0.30 - 0.55: settle/breathe
      // 0.55 - 1.00: full 360 turntable rotation
      const flyIn = Math.min(1, progress / 0.30);
      const spin = Math.max(0, Math.min(1, (progress - 0.55) / 0.45));
      const yaw = spin * Math.PI * 2; // 0..2π

      // side text reveal
      const sideP = Math.max(0, Math.min(1, (progress - 0.32) / 0.18));
      if (sideLRef.current) {
        sideLRef.current.style.transform = `translate3d(${(1 - sideP) * -80}px, -50%, 0)`;
        sideLRef.current.style.opacity = `${sideP}`;
      }
      if (sideRRef.current) {
        sideRRef.current.style.transform = `translate3d(${(1 - sideP) * 80}px, -50%, 0)`;
        sideRRef.current.style.opacity = `${sideP}`;
      }

      const stageRect = stage.getBoundingClientRect();
      const cx = stageRect.width / 2;
      const cy = stageRect.height / 2;

      for (let i = 0; i < BUBBLES.length; i++) {
        const b = BUBBLES[i];
        const node = nodesRef.current[i];
        if (!node) continue;

        // 3D-ish position: each bubble orbits center on a horizontal-ish ring with vertical offset
        const angle = b.theta + yaw;
        const x3 = Math.cos(angle) * b.r;
        const z3 = Math.sin(angle) * b.r; // depth
        const y3 = b.phi * 220;

        // perspective projection
        const persp = 900;
        const scale = persp / (persp - z3); // closer = larger
        const px = x3 * scale;
        const py = y3 * scale;

        // bob
        const bob = Math.sin(t / b.bob * Math.PI * 2 + b.theta) * 6;
        const bobX = Math.cos(t / b.bob * Math.PI * 2 + b.theta) * 3;

        // fly-in offset
        const off = FROM_OFFSET[b.from];
        const ease = 1 - Math.pow(1 - flyIn, 3);
        const inX = off.x * (1 - ease);
        const inY = off.y * (1 - ease);

        // repel from mouse (only when no fly-in animation pending)
        let rpx = 0, rpy = 0;
        if (smx > -9000) {
          const targetX = cx + px;
          const targetY = cy + py + bob;
          const dx = targetX - smx;
          const dy = targetY - smy;
          const dist = Math.hypot(dx, dy);
          const radius = 200;
          if (dist < radius && dist > 0.1) {
            const f = (1 - dist / radius) * 80;
            rpx = (dx / dist) * f;
            rpy = (dy / dist) * f;
          }
        }

        const finalX = px + inX + bobX + rpx;
        const finalY = py + inY + bob + rpy;
        const finalScale = scale * (0.6 + 0.4 * ease);
        const opacity = 0.25 + 0.75 * Math.min(1, scale); // back bubbles dim slightly
        const z = Math.round(z3 + 1000);

        node.style.transform = `translate3d(${finalX}px, ${finalY}px, 0) scale(${finalScale})`;
        node.style.zIndex = String(z);
        node.style.opacity = String(opacity);
      }

      raf = requestAnimationFrame(tick);
    };

    computeProgress();
    const onScroll = () => computeProgress();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener("mousemove", onMove, { passive: true });
    stage.addEventListener("mouseleave", onLeave);
    if (!reduced) raf = requestAnimationFrame(tick);
    else tick(); // single frame

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("mousemove", onMove);
      stage.removeEventListener("mouseleave", onLeave);
    };
  }, [reduced]);

  return (
    <section ref={sectionRef} data-nav-theme="dark" className="relative w-full bg-[#070707]" style={{ height: "260vh" }}>
      <div ref={stageRef} className="sticky top-0 h-screen w-full overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0" style={{
          background: "radial-gradient(ellipse at 50% 55%, rgba(232,57,14,0.10) 0%, transparent 55%)",
        }} />

        {/* side text */}
        <div ref={sideLRef} className="absolute left-6 md:left-10 top-1/2 z-30 pointer-events-none" style={{ opacity: 0, transform: "translate3d(-80px,-50%,0)", willChange: "transform,opacity" }}>
          <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-white/50 mb-3">(01) Reel</p>
          <h3 className="font-display font-bold text-white text-[clamp(28px,4vw,56px)] leading-[0.95] max-w-[12ch]">Stories<br/>that move.</h3>
        </div>
        <div ref={sideRRef} className="absolute right-6 md:right-10 top-1/2 z-30 pointer-events-none text-right" style={{ opacity: 0, transform: "translate3d(80px,-50%,0)", willChange: "transform,opacity" }}>
          <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-white/50 mb-3">(02) Studio</p>
          <h3 className="font-display font-bold text-white text-[clamp(28px,4vw,56px)] leading-[0.95] max-w-[14ch] ml-auto">Crafted in<br/>motion.</h3>
        </div>

        <div className="absolute inset-0 flex items-end justify-center pb-[6vh] px-6 pointer-events-none">
          <h2 className="font-display font-extrabold uppercase tracking-tighter text-center text-white/[0.06] leading-[0.85] text-[clamp(48px,11vw,200px)] select-none">
            Tero Reel '26
          </h2>
        </div>

        {/* Bubbles — absolutely positioned at center, rAF-driven transforms */}
        <div className="absolute inset-0 z-10" style={{ perspective: 900 }}>
          <div className="absolute left-1/2 top-1/2" style={{ transform: "translate(-50%,-50%)" }}>
            {BUBBLES.map((b, i) => (
              <div
                key={i}
                ref={(el) => { if (el) nodesRef.current[i] = el; }}
                className="absolute"
                style={{
                  width: b.size,
                  height: b.size,
                  left: -b.size / 2,
                  top: -b.size / 2,
                  willChange: "transform, opacity",
                  contain: "layout paint",
                }}
              >
                <BubbleLink img={b.img} />
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
          Scroll ↓
        </div>
      </div>
    </section>
  );
}

function BubbleLink({ img }: { img: string }) {
  return (
    <Link
      to="/portfolio"
      className="group relative block w-full h-full rounded-full"
      style={{
        filter: "drop-shadow(0 20px 28px rgba(0,0,0,0.55)) drop-shadow(0 6px 12px rgba(0,0,0,0.4))",
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
        {/* curvature shading */}
        <div aria-hidden className="absolute inset-0 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle at 50% 50%, transparent 48%, rgba(0,0,0,0.35) 78%, rgba(0,0,0,0.7) 100%)" }} />
        {/* top dark cap */}
        <div aria-hidden className="absolute inset-0 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle at 50% 0%, rgba(0,0,0,0.45) 0%, transparent 38%)" }} />
        {/* caustic crescent */}
        <div aria-hidden className="absolute inset-0 rounded-full pointer-events-none mix-blend-screen"
          style={{ background: "radial-gradient(circle at 78% 82%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.18) 12%, transparent 24%)" }} />
        {/* chromatic tint */}
        <div aria-hidden className="absolute inset-0 rounded-full pointer-events-none mix-blend-screen opacity-60"
          style={{ background: "radial-gradient(circle at 28% 22%, rgba(180,210,255,0.35) 0%, transparent 30%)" }} />
        {/* specular highlight */}
        <div aria-hidden className="absolute pointer-events-none"
          style={{ top: "6%", left: "14%", width: "38%", height: "26%", borderRadius: "50%",
            background: "radial-gradient(ellipse at 35% 30%, rgba(255,255,255,1) 0%, rgba(255,255,255,0.7) 22%, rgba(255,255,255,0.15) 55%, transparent 80%)",
            filter: "blur(0.4px)" }} />
        {/* pinpoint catchlight */}
        <div aria-hidden className="absolute pointer-events-none rounded-full"
          style={{ top: "11%", left: "22%", width: "8%", height: "8%",
            background: "radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,255,255,0.6) 40%, transparent 75%)" }} />
        {/* rim */}
        <div aria-hidden className="absolute inset-0 rounded-full pointer-events-none"
          style={{ boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.55), inset -8px -14px 26px rgba(0,0,0,0.55), inset 6px 10px 22px rgba(255,255,255,0.18)" }} />
      </div>
    </Link>
  );
}
