import { Link } from "@tanstack/react-router";
import { useRef, useEffect, useState } from "react";
import p1 from "@/assets/portfolio-1.jpg";
import p2 from "@/assets/portfolio-2.jpg";
import p3 from "@/assets/portfolio-3.jpg";
import p4 from "@/assets/portfolio-4.jpg";
import p5 from "@/assets/portfolio-5.jpg";
import p6 from "@/assets/portfolio-6.jpg";

const IMAGES = [p1, p2, p3, p4, p5, p6];

// Tight 3D cluster: local x/y/z coordinates rotate together like one stuck object.
type B = { x: number; y: number; z: number; size: number; img: string; from: "l" | "r" | "t" | "b"; bob: number; phase: number };

const BUBBLES: B[] = [
  { x:   0, y:   0, z:   35, size: 224, img: IMAGES[2], from: "t", bob: 7.1, phase: 0.0 },
  { x: -132, y: -38, z:   10, size: 174, img: IMAGES[0], from: "l", bob: 7.7, phase: 0.8 },
  { x:  126, y:  28, z:  -18, size: 180, img: IMAGES[1], from: "r", bob: 7.3, phase: 1.7 },
  { x:  -78, y: 118, z:  -42, size: 156, img: IMAGES[3], from: "b", bob: 8.2, phase: 2.5 },
  { x:   88, y:-116, z:   50, size: 162, img: IMAGES[5], from: "t", bob: 7.9, phase: 3.2 },
  { x: -210, y:  58, z:  -34, size: 134, img: IMAGES[4], from: "l", bob: 8.7, phase: 4.0 },
  { x:  206, y: -62, z:   28, size: 138, img: IMAGES[1], from: "r", bob: 8.4, phase: 4.7 },
  { x: -172, y:-150, z:   22, size: 120, img: IMAGES[4], from: "l", bob: 9.1, phase: 5.3 },
  { x:  166, y: 146, z:  -28, size: 126, img: IMAGES[3], from: "r", bob: 8.8, phase: 6.0 },
  { x:  -22, y:-214, z:  -52, size: 116, img: IMAGES[1], from: "t", bob: 9.4, phase: 1.2 },
  { x:   34, y: 220, z:   42, size: 112, img: IMAGES[2], from: "b", bob: 9.0, phase: 2.1 },
  { x: -268, y: -34, z:  -70, size:  96, img: IMAGES[0], from: "l", bob: 9.6, phase: 2.8 },
  { x:  264, y:  42, z:   76, size: 100, img: IMAGES[5], from: "r", bob: 9.3, phase: 3.6 },
  { x: -106, y: 230, z:   10, size:  90, img: IMAGES[3], from: "b", bob: 9.8, phase: 4.4 },
  { x:  118, y:-238, z:  -16, size:  92, img: IMAGES[0], from: "t", bob: 9.5, phase: 5.1 },
  { x: -238, y: 150, z:   60, size:  86, img: IMAGES[2], from: "l", bob: 9.9, phase: 5.8 },
  { x:  236, y:-154, z:  -58, size:  88, img: IMAGES[4], from: "r", bob: 9.7, phase: 0.4 },
];

const FROM_OFFSET = { l: { x: -1200, y: 80 }, r: { x: 1200, y: -80 }, t: { x: 0, y: -850 }, b: { x: 0, y: 850 } };
const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const easeOutCubic = (n: number) => 1 - Math.pow(1 - clamp01(n), 3);
const easeInOut = (n: number) => {
  const p = clamp01(n);
  return p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
};

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
    let active = true;
    let stageW = stage.clientWidth;
    let stageH = stage.clientHeight;
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
      const p = clamp01(-r.top / Math.max(1, total));
      progress = p;
    };
    const measure = () => {
      stageW = stage.clientWidth;
      stageH = stage.clientHeight;
      computeProgress();
    };

    const tick = () => {
      if (!active && !reduced) {
        raf = requestAnimationFrame(tick);
        return;
      }
      const now = performance.now();
      const t = (now - t0) / 1000;
      // smooth mouse
      smx += (mx - smx) * 0.15;
      smy += (my - smy) * 0.15;

      // Phases
      // 0.00 - 0.34: bubbles enter from screen edges and lock into the clump
      // 0.34 - 0.52: breathe/hold while side copy appears
      // 0.52 - 1.00: the stuck clump turns through a full 360°
      const flyIn = easeOutCubic(progress / 0.34);
      const spin = easeInOut((progress - 0.52) / 0.48);
      const yaw = spin * Math.PI * 2; // full 360° turn
      const pitch = Math.sin(spin * Math.PI * 2) * 0.16;
      const clusterBob = Math.sin(t * 0.9) * 7;

      // side text reveal
      const sideP = easeOutCubic((progress - 0.30) / 0.18);
      if (sideLRef.current) {
        sideLRef.current.style.transform = `translate3d(${(1 - sideP) * -80}px, -50%, 0)`;
        sideLRef.current.style.opacity = `${sideP}`;
      }
      if (sideRRef.current) {
        sideRRef.current.style.transform = `translate3d(${(1 - sideP) * 80}px, -50%, 0)`;
        sideRRef.current.style.opacity = `${sideP}`;
      }

      const cx = stageW / 2;
      const cy = stageH / 2;

      for (let i = 0; i < BUBBLES.length; i++) {
        const b = BUBBLES[i];
        const node = nodesRef.current[i];
        if (!node) continue;

        // Rigid 3D cluster rotation: every bubble keeps its local position,
        // so the group reads as stuck together while turning around.
        const cyaw = Math.cos(yaw);
        const syaw = Math.sin(yaw);
        const cp = Math.cos(pitch);
        const sp = Math.sin(pitch);
        const x1 = b.x * cyaw + b.z * syaw;
        const z1 = b.z * cyaw - b.x * syaw;
        const y1 = b.y * cp - z1 * sp;
        const z3 = z1 * cp + b.y * sp;

        // perspective projection
        const persp = 1100;
        const scale = persp / (persp - z3); // closer = larger
        const px = x1 * scale;
        const py = y1 * scale;

        // Micro-movement only; the large motion remains a single stuck cluster.
        const bob = clusterBob + Math.sin(t / b.bob * Math.PI * 2 + b.phase) * 2.5;
        const bobX = Math.cos(t / b.bob * Math.PI * 2 + b.phase) * 1.5;

        // fly-in offset
        const off = FROM_OFFSET[b.from];
        const inX = off.x * (1 - flyIn);
        const inY = off.y * (1 - flyIn);

        // repel from mouse (only when no fly-in animation pending)
        let rpx = 0, rpy = 0;
        if (smx > -9000) {
          const targetX = cx + px;
          const targetY = cy + py + bob;
          const dx = targetX - smx;
          const dy = targetY - smy;
          const dist = Math.hypot(dx, dy);
          const radius = 190;
          if (dist < radius && dist > 0.1) {
            const f = (1 - dist / radius) * 58;
            rpx = (dx / dist) * f;
            rpy = (dy / dist) * f;
          }
        }

        const finalX = px + inX + bobX + rpx;
        const finalY = py + inY + bob + rpy;
        const finalScale = scale * (0.62 + 0.38 * flyIn);
        const opacity = flyIn * (0.52 + 0.48 * clamp01(scale)); // back bubbles dim slightly
        const z = Math.round(z3 + 1000);

        node.style.transform = `translate3d(${finalX}px, ${finalY}px, 0) scale(${finalScale})`;
        node.style.zIndex = String(z);
        node.style.opacity = String(opacity);
      }

      raf = requestAnimationFrame(tick);
    };

    measure();
    const onScroll = () => computeProgress();
    const observer = new IntersectionObserver(([entry]) => { active = entry.isIntersecting; }, { rootMargin: "120px" });
    observer.observe(section);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    window.addEventListener("mousemove", onMove, { passive: true });
    stage.addEventListener("mouseleave", onLeave);
    if (!reduced) raf = requestAnimationFrame(tick);
    else tick(); // single frame

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      window.removeEventListener("mousemove", onMove);
      stage.removeEventListener("mouseleave", onLeave);
    };
  }, [reduced]);

  return (
    <section ref={sectionRef} data-nav-theme="dark" className="relative w-full bg-[#070707]" style={{ height: "260vh" }}>
      <div ref={stageRef} className="sticky top-0 h-screen w-full overflow-hidden [transform-style:preserve-3d]">
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
        <div className="absolute inset-0 z-10" style={{ perspective: 1100 }}>
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
                  transformOrigin: "50% 50%",
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
