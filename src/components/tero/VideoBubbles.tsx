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
type B = { x: number; y: number; z: number; size: number; img: string; from: "l" | "r" | "t" | "b"; bob: number; phase: number; spin: number };

const BUBBLES: B[] = [
  { x:    0, y:    0, z:  118, size: 226, img: IMAGES[2], from: "t", bob: 7.1, phase: 0.0, spin: 0.0 },
  { x: -100, y:  -46, z:   82, size: 182, img: IMAGES[0], from: "l", bob: 7.7, phase: 0.8, spin: 0.6 },
  { x:  104, y:  -34, z:   44, size: 186, img: IMAGES[1], from: "r", bob: 7.3, phase: 1.7, spin: 1.3 },
  { x:  -72, y:   92, z:  -54, size: 166, img: IMAGES[3], from: "b", bob: 8.2, phase: 2.5, spin: 2.0 },
  { x:   82, y:   88, z:   70, size: 164, img: IMAGES[5], from: "r", bob: 7.9, phase: 3.2, spin: 2.7 },
  { x:   -6, y: -128, z:  -68, size: 158, img: IMAGES[4], from: "t", bob: 8.7, phase: 4.0, spin: 3.4 },
  { x: -154, y:   28, z:   12, size: 148, img: IMAGES[1], from: "l", bob: 8.4, phase: 4.7, spin: 4.1 },
  { x:  154, y:   26, z:  -16, size: 146, img: IMAGES[4], from: "r", bob: 9.1, phase: 5.3, spin: 4.8 },
  { x:  -42, y:  148, z:   54, size: 132, img: IMAGES[3], from: "b", bob: 8.8, phase: 6.0, spin: 5.5 },
  { x:   56, y:  144, z:  -62, size: 126, img: IMAGES[1], from: "b", bob: 9.4, phase: 1.2, spin: 0.9 },
  { x: -142, y: -112, z:   56, size: 118, img: IMAGES[2], from: "l", bob: 9.0, phase: 2.1, spin: 1.8 },
  { x:  142, y: -106, z:  -58, size: 118, img: IMAGES[0], from: "r", bob: 9.6, phase: 2.8, spin: 2.6 },
  { x: -192, y:   86, z:  -34, size: 102, img: IMAGES[5], from: "l", bob: 9.3, phase: 3.6, spin: 3.5 },
  { x:  190, y:   82, z:   42, size: 104, img: IMAGES[3], from: "r", bob: 9.8, phase: 4.4, spin: 4.4 },
  { x:  -84, y: -184, z:  -38, size: 100, img: IMAGES[0], from: "t", bob: 9.5, phase: 5.1, spin: 5.2 },
  { x:   86, y: -182, z:   48, size:  98, img: IMAGES[2], from: "t", bob: 9.9, phase: 5.8, spin: 6.0 },
  { x: -182, y:  -36, z:  100, size:  92, img: IMAGES[4], from: "l", bob: 9.7, phase: 0.4, spin: 1.1 },
  { x:  180, y:  -40, z:  -98, size:  92, img: IMAGES[5], from: "r", bob: 10.1, phase: 1.0, spin: 3.1 },
  { x:    2, y:  202, z:   18, size:  90, img: IMAGES[0], from: "b", bob: 10.0, phase: 2.0, spin: 5.0 },
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
    let pmx = -9999, pmy = -9999; // previous smoothed pointer (for velocity)
    let pvx = 0, pvy = 0;         // smoothed pointer velocity (px/sec)
    let pspeed = 0;                // smoothed pointer speed magnitude
    let progress = 0;
    let raf = 0;
    let active = true;
    let stageW = stage.clientWidth;
    let stageH = stage.clientHeight;
    let t0 = performance.now();
    let lastT = t0;

    // Spring state per bubble — current rendered position + velocity in screen space.
    // The "target" is the rigid 3D cluster projection; springs lag toward it, and
    // pairwise cohesion forces pull overlapping bubbles together so they stick.
    const N = BUBBLES.length;
    const cur = new Float32Array(N * 2);
    const vel = new Float32Array(N * 2);
    const tgt = new Float32Array(N * 2);
    const rad = new Float32Array(N); // projected radius for cohesion
    let seeded = false;

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
      const dtMs = now - lastT;
      lastT = now;
      // clamp dt so a tab-switch doesn't explode the spring integration
      const dt = Math.min(0.033, Math.max(0.001, dtMs / 1000));
      const t = (now - t0) / 1000;
      // smooth mouse + derive pointer velocity for inertia-driven repel
      const prevSmx = smx, prevSmy = smy;
      smx += (mx - smx) * 0.18;
      smy += (my - smy) * 0.18;
      if (mx > -9000 && prevSmx > -9000) {
        const ivx = (smx - prevSmx) / dt;
        const ivy = (smy - prevSmy) / dt;
        // low-pass the velocity so it has inertia (ramps up, decays gently)
        pvx += (ivx - pvx) * Math.min(1, dt * 9);
        pvy += (ivy - pvy) * Math.min(1, dt * 9);
      } else {
        pvx *= Math.max(0, 1 - dt * 3.5);
        pvy *= Math.max(0, 1 - dt * 3.5);
      }
      pmx = prevSmx; pmy = prevSmy;
      pspeed = Math.hypot(pvx, pvy);

      // Timing tuned to the reference video:
      //   0.00 – 0.22  fly-in from edges → lock into clump
      //   0.22 – 0.34  brief settle + side copy reveal
      //   0.34 – 0.95  scroll-scrubbed full 360° turn of the stuck cluster
      //   0.95 – 1.00  hold final orientation
      const flyIn = easeOutCubic(progress / 0.22);
      const sRaw = clamp01((progress - 0.34) / (0.95 - 0.34));
      // ease-in-out-quint: slow start, decisive middle, soft landing — matches
      // the reference's deliberate turntable motion better than cubic.
      const spin = sRaw < 0.5
        ? 16 * sRaw * sRaw * sRaw * sRaw * sRaw
        : 1 - Math.pow(-2 * sRaw + 2, 5) / 2;
      const yaw = spin * Math.PI * 2;
      const roll = Math.sin(spin * Math.PI * 2) * 0.10;
      const pitch = Math.sin(spin * Math.PI * 2 + 0.6) * 0.09;
      const clusterBob = Math.sin(t * 0.8) * 4;

      const sideP = easeOutCubic((progress - 0.20) / 0.14);
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

      // Cached per-bubble values for the render pass.
      const projX = new Float32Array(N);
      const projY = new Float32Array(N);
      const projZ = new Float32Array(N);
      const projS = new Float32Array(N);

      // 1) Compute rigid target positions (cluster projection).
      for (let i = 0; i < N; i++) {
        const b = BUBBLES[i];
        const locked = 0.78 + 0.22 * flyIn;
        const lx = b.x * locked;
        const ly = b.y * locked;
        const lz = b.z * locked;
        const cyaw = Math.cos(yaw), syaw = Math.sin(yaw);
        const cp = Math.cos(pitch), sp = Math.sin(pitch);
        const cr = Math.cos(roll), sr = Math.sin(roll);
        const xYaw = lx * cyaw + lz * syaw;
        const zYaw = lz * cyaw - lx * syaw;
        const yPitch = ly * cp - zYaw * sp;
        const zPitch = zYaw * cp + ly * sp;
        const x1 = xYaw * cr - yPitch * sr;
        const y1 = yPitch * cr + xYaw * sr;
        const z3 = zPitch;
        const persp = 980;
        const scale = persp / (persp - z3);
        const px = x1 * scale;
        const py = y1 * scale;

        // micro-bob keeps the cluster alive
        const bob = clusterBob + Math.sin(t / b.bob * Math.PI * 2 + b.phase) * 1.4;
        const bobX = Math.cos(t / b.bob * Math.PI * 2 + b.phase) * 0.8;

        const off = FROM_OFFSET[b.from];
        const inX = off.x * (1 - flyIn);
        const inY = off.y * (1 - flyIn);

        tgt[i * 2]     = px + inX + bobX;
        tgt[i * 2 + 1] = py + inY + bob;
        projX[i] = px;
        projY[i] = py;
        projZ[i] = z3;
        projS[i] = scale;
        rad[i]   = (BUBBLES[i].size * 0.5) * scale * (0.66 + 0.34 * flyIn);
      }

      if (!seeded) {
        for (let i = 0; i < N * 2; i++) cur[i] = tgt[i];
        seeded = true;
      }

      // 2) Integrate springs with cohesion + mouse repulsion.
      // Spring toward target = adhesion to rigid cluster.
      // Pairwise attraction when overlapping = bubbles "stick" to each other.
      const stiffness = 180;   // pull toward rigid target
      const damping   = 18;    // critical-ish damping
      const cohesion  = 320;   // overlap pull strength
      const sep       = 220;   // soft separation so they don't fully merge

      for (let i = 0; i < N; i++) {
        const ix = i * 2, iy = ix + 1;
        let ax = (tgt[ix] - cur[ix]) * stiffness - vel[ix] * damping;
        let ay = (tgt[iy] - cur[iy]) * stiffness - vel[iy] * damping;

        // pairwise sticking — only neighbors whose targets are close enough to be "stuck"
        for (let j = 0; j < N; j++) {
          if (j === i) continue;
          const jx = j * 2, jy = jx + 1;
          const dx = cur[jx] - cur[ix];
          const dy = cur[jy] - cur[iy];
          const d2 = dx * dx + dy * dy;
          const want = (rad[i] + rad[j]) * 0.88; // desired contact distance
          const reach = want * 1.35;
          if (d2 < reach * reach && d2 > 0.01) {
            const d = Math.sqrt(d2);
            const nx = dx / d, ny = dy / d;
            // cohesion: pull together if farther than `want`
            if (d > want) {
              const k = (d - want) * cohesion * 0.5;
              ax += nx * k;
              ay += ny * k;
            } else {
              // gentle separation so they kiss instead of overlap fully
              const k = (want - d) * sep * 0.5;
              ax -= nx * k;
              ay -= ny * k;
            }
          }
        }

        // Mouse repulsion — matched to the reference: bubbles begin reacting
        // at the very edge of the influence ring (cubic ease-in onset) and fully
        // recover to rest at the same boundary (no lingering tail). Strength is
        // modulated by pointer inertia: a still pointer barely nudges, a fast
        // swipe carves a clean channel through the cluster.
        if (smx > -9000) {
          const targetX = cx + cur[ix];
          const targetY = cy + cur[iy];
          const dx = targetX - smx;
          const dy = targetY - smy;
          const dist = Math.hypot(dx, dy);
          // Radius grows slightly with pointer speed so fast swipes feel
          // weightier without bloating the static hover footprint.
          const speedBoost = Math.min(1, pspeed / 1600); // 0..1
          const radius = rad[i] * 1.55 + 70 + speedBoost * 60;
          if (dist < radius && dist > 0.1) {
            // Onset+recovery easing matched to the reference:
            //   u = 1 - dist/radius  (0 at edge → 1 at center)
            //   ease = u^2 * (3 - 2u)  smoothstep, then * u for cubic onset
            // This delays the kick-in near the edge and lets bubbles fully
            // recover at the same point with no jitter.
            const u = 1 - dist / radius;
            const fall = u * u * u * (3 - 2 * u); // smootherstep-ish, edge-aware
            // Inertia: still pointer = 0.55x, fast swipe up to 1.85x.
            const inertia = 0.55 + Math.min(1.3, pspeed / 1200);
            // Directional bias — push slightly along pointer travel so the
            // cluster parts ahead of the cursor and closes behind it.
            const nx = dx / dist, ny = dy / dist;
            const vmag = Math.max(1, pspeed);
            const dirBias = (nx * pvx + ny * pvy) / vmag; // -1..1
            const align = 1 + 0.35 * Math.max(0, dirBias);
            const strength = 480 * inertia * align;
            const f = fall * strength;
            ax += nx * f;
            ay += ny * f;
          }
        }


        vel[ix] += ax * dt;
        vel[iy] += ay * dt;
        cur[ix] += vel[ix] * dt;
        cur[iy] += vel[iy] * dt;
      }

      // 3) Render.
      for (let i = 0; i < N; i++) {
        const node = nodesRef.current[i];
        if (!node) continue;
        const finalX = cur[i * 2];
        const finalY = cur[i * 2 + 1];
        const z3 = projZ[i];
        const scale = projS[i];
        const finalScale = scale * (0.66 + 0.34 * flyIn);
        const opacity = flyIn * (0.50 + 0.50 * clamp01(scale));
        const z = Math.round(z3 + 1000 + i * 0.01);
        node.style.transform = `translate3d(${finalX}px, ${finalY}px, ${z3 * 0.18}px) rotate(${yaw * 10 + BUBBLES[i].spin}deg) scale(${finalScale})`;
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
    else tick();

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
    <section ref={sectionRef} data-nav-theme="dark" className="relative w-full bg-[#070707]" style={{ height: "440vh" }}>
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
        <div className="absolute inset-0 z-10" style={{ perspective: 980 }}>
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
                <BubbleLink img={b.img} index={i} />
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

function BubbleLink({ img, index }: { img: string; index: number }) {
  const hex = "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)";
  return (
    <Link
      to="/portfolio"
      data-cursor-hover
      className="group relative block w-full h-full"
      style={{
        filter: "drop-shadow(0 26px 30px rgba(0,0,0,0.46)) drop-shadow(0 8px 14px rgba(0,0,0,0.35))",
        transform: "translateZ(0)",
        backfaceVisibility: "hidden",
      }}
    >
      <div
        className="relative w-full h-full overflow-hidden bg-black"
        style={{ clipPath: hex, isolation: "isolate" }}
      >
        <img
          src={img}
          alt=""
          loading={index < 5 ? "eager" : "lazy"}
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ transform: `scale(1.18) rotate(${index % 2 ? -4 : 4}deg)`, filter: "saturate(1.2) contrast(1.12) brightness(0.9)" }}
        />
        {/* curvature shading */}
        <div aria-hidden className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(circle at 44% 38%, transparent 32%, rgba(0,0,0,0.30) 68%, rgba(0,0,0,0.86) 100%)" }} />
        {/* top dark cap */}
        <div aria-hidden className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(circle at 50% -4%, rgba(0,0,0,0.50) 0%, rgba(0,0,0,0.14) 28%, transparent 46%)" }} />
        {/* glass refraction wash */}
        <div aria-hidden className="absolute inset-0 pointer-events-none mix-blend-screen opacity-70"
          style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.55) 0%, transparent 22%, transparent 54%, rgba(255,120,64,0.20) 78%, rgba(255,255,255,0.34) 100%)" }} />
        {/* caustic crescent */}
        <div aria-hidden className="absolute inset-0 pointer-events-none mix-blend-screen"
          style={{ background: "radial-gradient(circle at 76% 80%, rgba(255,255,255,0.82) 0%, rgba(255,255,255,0.25) 12%, transparent 27%)" }} />
        {/* chromatic tint */}
        <div aria-hidden className="absolute inset-0 pointer-events-none mix-blend-screen opacity-70"
          style={{ background: "radial-gradient(circle at 27% 20%, rgba(210,230,255,0.48) 0%, rgba(120,170,255,0.18) 22%, transparent 36%)" }} />
        {/* specular highlight */}
        <div aria-hidden className="absolute pointer-events-none"
          style={{ top: "8%", left: "20%", width: "38%", height: "24%", borderRadius: "50%",
            background: "radial-gradient(ellipse at 35% 30%, rgba(255,255,255,1) 0%, rgba(255,255,255,0.78) 18%, rgba(255,255,255,0.18) 55%, transparent 82%)",
            filter: "blur(0.25px)" }} />
        {/* pinpoint catchlight */}
        <div aria-hidden className="absolute pointer-events-none rounded-full"
          style={{ top: "14%", left: "28%", width: "7%", height: "7%",
            background: "radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,255,255,0.6) 40%, transparent 75%)" }} />
        {/* hex rim */}
        <div aria-hidden className="absolute inset-0 pointer-events-none"
          style={{
            clipPath: hex,
            background: "linear-gradient(135deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 35%, rgba(0,0,0,0) 65%, rgba(0,0,0,0.45) 100%)",
            mixBlendMode: "overlay",
          }} />
      </div>
    </Link>
  );
}
