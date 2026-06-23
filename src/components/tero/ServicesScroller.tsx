import { useEffect, useRef, useState } from "react";

type MotionDebug = {
  formed: number;
  targetFormed: number;
  fill: number;
  targetFill: number;
  active: number;
  serviceTravel: number;
  targetTravel: number;
  sectionProgress: number;
  scrollVelocity: number;
  fps: number;
};

const motionDebugState: MotionDebug = {
  formed: 0,
  targetFormed: 0,
  fill: 1,
  targetFill: 1,
  active: 0,
  serviceTravel: 0,
  targetTravel: 0,
  sectionProgress: 0,
  scrollVelocity: 0,
  fps: 0,
};

const services = [
  {
    n: "01",
    name: "Brand Storytelling",
    desc: "Editorial films and motion identities that translate brand DNA into stories people remember.",
    tag: "Narrative",
  },
  {
    n: "02",
    name: "Anamorphic & DOOH",
    desc: "Forced-perspective 3D spectacles built for billboards, LED corners and out-of-home moments.",
    tag: "Out of home",
  },
  {
    n: "03",
    name: "Immersive XR Training",
    desc: "VR, AR and mixed-reality modules that turn complex SOPs into hands-on muscle memory.",
    tag: "XR learning",
  },
  {
    n: "04",
    name: "PropViz Experiences",
    desc: "Real-time architectural walkthroughs, CGI films and interactive sales tools for property.",
    tag: "Real estate",
  },
  {
    n: "05",
    name: "Event & Immersive Hardware",
    desc: "Stage visuals, projection mapping and custom hardware that turn venues into experiences.",
    tag: "On ground",
  },
  {
    n: "06",
    name: "AI Content Creation",
    desc: "Generative AI-powered visuals, motion variations and smart production pipelines that scale creativity.",
    tag: "Generative",
  },
];

// Clean line-art SVG re-creations of the reference icons, tuned for particle sampling.
// 0 Brand Storytelling — monitor with play + megaphone
// 1 Anamorphic & DOOH — billboard on pole with lights
// 2 Immersive XR Training — VR headset on head with sparkles + coins
// 3 PropViz — three buildings, one tall
// 4 Event & Immersive Hardware — holographic projector cube with dashed beams
// 5 AI Content Creation — AI chip with pins
const ICONS: string[] = [
  // 0 — monitor + megaphone (ref: screen with play, megaphone top-right)
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="black" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
    <rect x="4" y="12" width="40" height="28" rx="2"/>
    <path d="M18 44h12M22 40v4M20 48h12"/>
    <circle cx="22" cy="26" r="7"/>
    <path d="M20 22.5l5 3.5-5 3.5z" fill="black" stroke="none"/>
    <path d="M44 20l14-6v22l-14-6z"/>
    <path d="M58 16c2.4 2.5 2.4 8 0 11M60 13c3.4 4 3.4 12 0 18"/>
  </svg>`,
  // 1 — billboard on pole with top lights and ladder
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="black" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
    <path d="M6 8l3 4M16 6l2 5M28 6l2 5M40 6l2 5M52 6l2 5"/>
    <rect x="4" y="14" width="56" height="22" rx="1"/>
    <path d="M4 36h56l-3 5H7z"/>
    <path d="M30 41v18M34 41v18"/>
    <path d="M22 60h20"/>
    <path d="M30 44h4M30 48h4M30 52h4M30 56h4"/>
  </svg>`,
  // 2 — VR headset on head, sparkles, coins around
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="black" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
    <path d="M22 18c0-5 4-9 10-9s10 4 10 9"/>
    <path d="M16 30c0-3 2-5 5-5h22c3 0 5 2 5 5v8c0 3-2 5-5 5h-5l-3-4a3 3 0 0 0-6 0l-3 4h-5c-3 0-5-2-5-5z"/>
    <circle cx="24" cy="34" r="3"/>
    <circle cx="40" cy="34" r="3"/>
    <path d="M22 50c2 3 6 5 10 5s8-2 10-5"/>
    <circle cx="8" cy="26" r="5"/>
    <path d="M6 26h4M8 24v4" stroke-width="1.6"/>
    <circle cx="56" cy="32" r="5"/>
    <path d="M54 30l4 4M58 30l-4 4" stroke-width="1.6"/>
    <path d="M10 14l1.5 3 3 1.5-3 1.5L10 23l-1.5-3-3-1.5 3-1.5z" fill="black" stroke="none"/>
    <path d="M54 48l1 2 2 1-2 1-1 2-1-2-2-1 2-1z" fill="black" stroke="none"/>
    <path d="M6 42h8M8 46h6" stroke-width="2"/>
  </svg>`,
  // 3 — three buildings cluster (filled, varied heights)
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="black" stroke="none">
    <path d="M6 30 L6 60 L24 60 L24 30 L18 24 L18 38 L12 38 L12 24 Z"/>
    <path d="M22 14 L22 60 L42 60 L42 14 L32 6 Z M30 18 L30 28 L34 28 L34 18 Z" fill-rule="evenodd"/>
    <path d="M42 22 L42 60 L60 60 L60 22 Z"/>
    <g fill="white">
      <rect x="45" y="26" width="3" height="3"/><rect x="50" y="26" width="3" height="3"/><rect x="55" y="26" width="3" height="3"/>
      <rect x="45" y="32" width="3" height="3"/><rect x="50" y="32" width="3" height="3"/><rect x="55" y="32" width="3" height="3"/>
      <rect x="45" y="38" width="3" height="3"/><rect x="50" y="38" width="3" height="3"/><rect x="55" y="38" width="3" height="3"/>
      <rect x="45" y="44" width="3" height="3"/><rect x="50" y="44" width="3" height="3"/><rect x="55" y="44" width="3" height="3"/>
      <rect x="45" y="50" width="3" height="3"/><rect x="50" y="50" width="3" height="3"/><rect x="55" y="50" width="3" height="3"/>
    </g>
  </svg>`,
  // 4 — holographic projector cube with dashed beams (ref: cube above base with rays)
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="black" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
    <path d="M32 8 L48 16 L48 30 L32 38 L16 30 L16 16 Z"/>
    <path d="M16 16 L32 24 L48 16 M32 24 L32 38"/>
    <path d="M6 60 L26 38 M58 60 L38 38 M18 60 L24 42 M46 60 L40 42 M32 60 L32 42" stroke-dasharray="3 3"/>
    <ellipse cx="32" cy="58" rx="22" ry="3"/>
    <ellipse cx="32" cy="56" rx="18" ry="2.4"/>
  </svg>`,
  // 5 — AI chip with pins, dots, and bold "AI" label
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="black" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
    <rect x="14" y="14" width="36" height="36" rx="4" fill="black"/>
    <rect x="20" y="20" width="24" height="24" rx="2" fill="none" stroke="white" stroke-width="2"/>
    <text x="32" y="38" text-anchor="middle" font-family="Arial, sans-serif" font-weight="900" font-size="16" fill="white" stroke="none">AI</text>
    <path d="M22 8v6M32 8v6M42 8v6 M22 50v6M32 50v6M42 50v6 M8 22h6M8 32h6M8 42h6 M50 22h6M50 32h6M50 42h6"/>
    <circle cx="32" cy="6" r="2.4" fill="black"/>
    <circle cx="32" cy="58" r="2.4" fill="black"/>
    <circle cx="6" cy="32" r="2.4" fill="black"/>
    <circle cx="58" cy="32" r="2.4" fill="black"/>
  </svg>`,
];

// Reference dust palette: warm cream dominant, soft amber embers, sparse cool accent.
const COLORS = [
  "rgba(252,244,228,0.78)", // cream (dominant)
  "rgba(252,244,228,0.78)",
  "rgba(248,232,206,0.72)", // warm bone
  "rgba(248,232,206,0.72)",
  "rgba(255,176,92,0.78)",  // amber ember
  "rgba(238,118,42,0.7)",   // burnt orange
  "rgba(140,178,214,0.55)", // muted cool accent (rare)
];

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const ease = (n: number) => {
  const t = clamp01(n);
  return t * t * t * (t * (t * 6 - 15) + 10);
};

const ramp = (from: number, to: number, value: number) => ease((value - from) / (to - from));
const motionWindow = (value: number) => ramp(0.12, 0.38, value) * (1 - ramp(0.82, 1, value));

type Point = { x: number; y: number };

function ParticleJourney({ hostRef }: { hostRef: React.RefObject<HTMLElement | null> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = hostRef.current;
    if (!canvas || !host) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, reduceMotion ? 1 : 1.25);
    let raf = 0;
    let w = 0;
    let h = 0;
    let formed = 0;
    let targetFormed = 0;
    let fill = 1;
    let targetFill = 1;
    let active = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let mx = -9999;
    let my = -9999;
    let smx = -9999;
    let smy = -9999;
    let serviceTravel = 0;
    let targetTravel = 0;
    let sectionProgress = 0;
    let scrollVelocity = 0;
    let lastScrollY = window.scrollY;
    let visible = false;
    let ready = false;
    let sampleRun = 0;
    let serviceNodes: HTMLElement[] = [];

    type Particle = {
      x: number;
      y: number;
      z: number;
      vx: number;
      vy: number;
      vz: number;
      sx: number;
      sy: number;
      sz: number;
      fx: number;
      fy: number;
      fz: number;
      lane: number;
      idx: number;
      size: number;
      color: string;
      phase: number;
    };

    let particles: Particle[] = [];
    let pointSets: Point[][] = [];

    const sampleIcon = async (src: string, size: number) =>
      new Promise<Point[]>((resolve) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          const sample = document.createElement("canvas");
          const sctx = sample.getContext("2d")!;
          sample.width = size;
          sample.height = size;
          const glyph = size * 0.88;
          // preserve aspect ratio
          const ratio = img.width / img.height;
          const gw = ratio >= 1 ? glyph : glyph * ratio;
          const gh = ratio >= 1 ? glyph / ratio : glyph;
          const ox = (size - gw) / 2;
          const oy = (size - gh) / 2;
          sctx.fillStyle = "#fff";
          sctx.fillRect(0, 0, size, size);
          sctx.drawImage(img, ox, oy, gw, gh);
          const data = sctx.getImageData(0, 0, size, size).data;
          const step = Math.max(2, Math.round(size / 136));
          const pts: Point[] = [];
          for (let y = 0; y < size; y += step) {
            for (let x = 0; x < size; x += step) {
              const i = (y * size + x) * 4;
              // dark pixel = part of glyph (JPEG with white bg)
              const lum = (data[i] + data[i + 1] + data[i + 2]) / 3;
              if (lum < 140) {
                pts.push({ x: x - size / 2, y: y - size / 2 });
              }
            }
          }
          resolve(pts);
        };
        img.onerror = () => resolve([]);
        img.src = src;
      });

    const measure = async () => {
      const run = ++sampleRun;
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const box = Math.round(Math.min(h * 0.74, w * (w < 760 ? 0.82 : 0.56)));
      pointSets = await Promise.all(ICON_URLS.map((url) => sampleIcon(url, box)));
      if (run !== sampleRun) return;
      serviceNodes = Array.from(host.querySelectorAll<HTMLElement>("[data-service-index]"));
      const total = reduceMotion ? 640 : w < 760 ? 1600 : 3200;
      particles = new Array(total).fill(0).map((_, i) => {
        const a = Math.random() * Math.PI * 2;
        const r = Math.min(w, h) * (0.22 + Math.random() * 0.62);
        const sx = Math.cos(a) * r;
        const sy = Math.sin(a) * r;
        const fx = Math.random() * w;
        const fy = Math.random() * h;
        return {
          x: fx,
          y: fy,
          z: (Math.random() - 0.5) * 380,
          vx: 0,
          vy: 0,
          vz: 0,
          sx,
          sy,
          sz: (Math.random() - 0.5) * 520,
          fx,
          fy,
          fz: (Math.random() - 0.5) * 780,
          lane: Math.random() * 2 - 1,
          idx: i,
          size: 0.5 + Math.random() * 1.05,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          phase: Math.random() * Math.PI * 2,
        };
      });
      targetX = currentX = w < 760 ? w / 2 : w * 0.72;
      targetY = currentY = h * 0.52;
      ready = true;
    };

    const update = () => {
      if (!serviceNodes.length) {
        serviceNodes = Array.from(host.querySelectorAll<HTMLElement>("[data-service-index]"));
      }
      const scrollY = window.scrollY;
      scrollVelocity += (scrollY - lastScrollY - scrollVelocity) * 0.18;
      lastScrollY = scrollY;
      const hostRect = host.getBoundingClientRect();
      sectionProgress = clamp01((window.innerHeight * 0.5 - hostRect.top) / Math.max(1, hostRect.height - window.innerHeight));
      const viewportCenter = window.innerHeight / 2;
      let best = -1;
      let bestIndex = active;
      let bestTravel = targetTravel;

      for (const node of serviceNodes) {
        const rect = node.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const score = clamp01(1 - Math.abs(center - viewportCenter) / (window.innerHeight * 0.98));
        const index = Number(node.dataset.serviceIndex || 0);
        if (score > best) {
          best = score;
          bestIndex = index;
          bestTravel = clamp01((viewportCenter - rect.top) / Math.max(1, rect.height));
        }
      }

      active = bestIndex;
      const profile = motionWindow(bestTravel);
      targetFormed = best > 0.05 ? profile : 0;
      targetFill = clamp01(1 - profile * 1.15);
      targetTravel = bestTravel;
      serviceTravel += (targetTravel - serviceTravel) * 0.085;
      const mobile = w < 760;
      const objectOnRight = active % 2 === 0;
      targetX = mobile ? w / 2 : objectOnRight ? w * 0.76 : w * 0.24;
      targetY = mobile ? h * (0.14 + serviceTravel * 0.72) : h * (0.16 + serviceTravel * 0.64);
    };

    const onMove = (event: PointerEvent) => {
      mx = event.clientX;
      my = event.clientY;
    };

    const onLeave = () => {
      mx = -9999;
      my = -9999;
    };

    let lastFrame = performance.now();
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = now - lastFrame;
      lastFrame = now;
      motionDebugState.fps = dt > 0 ? 1000 / dt : 0;
      motionDebugState.formed = formed;
      motionDebugState.targetFormed = targetFormed;
      motionDebugState.fill = fill;
      motionDebugState.targetFill = targetFill;
      motionDebugState.active = active;
      motionDebugState.serviceTravel = serviceTravel;
      motionDebugState.targetTravel = targetTravel;
      motionDebugState.sectionProgress = sectionProgress;
      motionDebugState.scrollVelocity = scrollVelocity;
      if (!visible || !ready) {
        if (ready) ctx.clearRect(0, 0, w, h);
        return;
      }
      update();
      currentX += (targetX - currentX) * 0.18;
      currentY += (targetY - currentY) * 0.13;
      formed += (targetFormed - formed) * 0.12;
      fill += (targetFill - fill) * 0.08;
      if (mx > -9000) {
        if (smx < -9000) {
          smx = mx;
          smy = my;
        }
        smx += (mx - smx) * 0.18;
        smy += (my - smy) * 0.18;
      } else {
        smx = -9999;
        smy = -9999;
      }

      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      const t = now / 1000;
      const objectOnRight = active % 2 === 0;
      const yaw = Math.sin(t * 0.2 + sectionProgress * 2.2) * 0.5 + (objectOnRight ? 0.38 : -0.38);
      const pitch = Math.sin(t * 0.16 + active) * 0.25;
      const cosY = Math.cos(yaw);
      const sinY = Math.sin(yaw);
      const cosP = Math.cos(pitch);
      const sinP = Math.sin(pitch);
      const points = pointSets[active] || pointSets[0] || [];

      for (const p of particles) {
        const pt = points[p.idx % Math.max(1, points.length)] || { x: 0, y: 0 };
        const volume = 6 + (p.idx % 11) * 1.1;
        const px = pt.x * 1.12 + Math.sin(p.phase * 2.1 + t * 0.5) * volume;
        const py = pt.y * 1.12 + Math.cos(p.phase * 1.7 + t * 0.4) * volume;
        const depth = ((p.idx % 37) - 18) * 4 + Math.sin(p.idx * 0.77) * 18 + Math.sin(p.phase + t * 0.3) * 42;
        const rx = px * cosY + depth * sinY;
        const rz = depth * cosY - px * sinY;
        const ry = py * cosP - rz * sinP;
        const rz2 = rz * cosP + py * sinP;
        const driftX = Math.sin(t * 0.16 + p.phase + sectionProgress * 3.8) * (48 + fill * 36);
        const driftY = Math.cos(t * 0.13 + p.phase * 0.8) * (40 + fill * 32);
        const fieldX = (p.fx + p.lane * sectionProgress * w * 0.68 + driftX + w * 2) % w;
        const fieldY = (p.fy + sectionProgress * h * (1.25 + p.lane * 0.22) + driftY + h * 2) % h;
        const streamX = currentX + p.sx * (1.38 + Math.sin(t * 0.12 + p.phase) * 0.07);
        const streamY = currentY + p.sy * (1.22 + Math.cos(t * 0.1 + p.phase) * 0.06);
        const scatterMix = clamp01(1 - formed);
        const cloudX = fieldX * fill + streamX * (1 - fill);
        const cloudY = fieldY * fill + streamY * (1 - fill);
        const tz = (p.fz * fill + p.sz * (1 - fill)) * scatterMix + rz2 * formed;
        const perspectiveScale = 720 / (720 - tz);
        const shapeX = currentX + rx * perspectiveScale;
        const shapeY = currentY + ry * perspectiveScale;

        let screenX = cloudX * scatterMix + shapeX * formed;
        let screenY = cloudY * scatterMix + shapeY * formed + scrollVelocity * (0.34 + fill * 0.18);
        if (smx > -9000) {
          const dx = screenX - smx;
          const dy = screenY - smy;
          const dist = Math.hypot(dx, dy);
          const radius = 132;
          if (dist < radius && dist > 0.1) {
            const push = Math.pow(1 - dist / radius, 2) * 76;
            screenX += (dx / dist) * push;
            screenY += (dy / dist) * push;
          }
        }

        const lock = 0.12 + formed * 0.16;
        p.vx = (p.vx + (screenX - p.x) * 0.012) * 0.72;
        p.vy = (p.vy + (screenY - p.y) * 0.012) * 0.72;
        p.vz = (p.vz + (tz - p.z) * 0.02) * 0.78;
        p.x += (screenX - p.x) * lock + p.vx;
        p.y += (screenY - p.y) * lock + p.vy;
        p.z += (tz - p.z) * 0.14 + p.vz;

        ctx.globalAlpha = Math.min(0.92, 0.12 + fill * 0.26 + formed * 0.48 + Math.max(0, p.z) / 1600);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (0.68 + formed * 0.42) * perspectiveScale, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    };

    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? false;
      },
      { rootMargin: "200px 0px" },
    );
    io.observe(host);

    measure();
    raf = requestAnimationFrame(tick);
    window.addEventListener("resize", measure);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, [hostRef]);

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-[3] block h-screen w-full" />;
}

function SpaceField({ hostRef }: { hostRef: React.RefObject<HTMLElement | null> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = hostRef.current;
    if (!canvas || !host) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let raf = 0;
    let w = 0;
    let h = 0;
    let scroll = 0;
    let visible = false;
    type Star = { x: number; y: number; z: number; r: number; a: number };
    let stars: Star[] = [];

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      stars = new Array(Math.floor((w * h) / 6000)).fill(0).map(() => ({
        x: Math.random() * w,
        y: Math.random() * h,
        z: Math.random() * 1 + 0.2,
        r: Math.random() * 1.05 + 0.12,
        a: Math.random() * 0.48 + 0.12,
      }));
    };

    const update = () => {
      scroll = window.scrollY;
    };

    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visible) return;
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        const y = (s.y + scroll * 0.16 * s.z) % h;
        ctx.globalAlpha = s.a;
        ctx.fillStyle = "#fdfaf6";
        ctx.beginPath();
        ctx.arc(s.x, y, s.r * s.z, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? false;
      },
      { rootMargin: "100px 0px" },
    );
    io.observe(host);

    resize();
    update();
    raf = requestAnimationFrame(tick);
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", update);
    };
  }, [hostRef]);

  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 z-0 block h-full w-full" />;
}

function MotionDebugOverlay({ hostRef }: { hostRef: React.RefObject<HTMLElement | null> }) {
  const [enabled, setEnabled] = useState(false);
  const [, force] = useState(0);
  const [scrub, setScrub] = useState<number | null>(null);

  useEffect(() => {
    const check = () => {
      const q = new URLSearchParams(window.location.search);
      const on =
        q.get("debug") === "motion" ||
        (typeof localStorage !== "undefined" && localStorage.getItem("servicesDebug") === "1");
      setEnabled(on);
    };
    check();
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "d") {
        const next = localStorage.getItem("servicesDebug") === "1" ? "0" : "1";
        localStorage.setItem("servicesDebug", next);
        setEnabled(next === "1");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      force((n) => (n + 1) % 1000000);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [enabled]);

  if (!enabled) return null;

  const s = motionDebugState;
  const host = hostRef.current;
  const rect = host?.getBoundingClientRect();
  const scrollable = rect ? rect.height - window.innerHeight : 0;

  const onScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    setScrub(v);
    if (!host) return;
    const top = window.scrollY + host.getBoundingClientRect().top;
    window.scrollTo({ top: top + scrollable * v, behavior: "auto" });
  };

  const fmt = (n: number) => n.toFixed(3);
  const bar = (v: number, color = "#ff9a00") => (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
      <div className="h-full rounded-full" style={{ width: `${clamp01(v) * 100}%`, background: color }} />
    </div>
  );

  return (
    <div className="pointer-events-auto fixed bottom-4 left-4 right-4 z-[60] mx-auto max-w-[440px] rounded-2xl border border-white/15 bg-black/82 p-3 font-mono text-[11px] text-white/85 shadow-2xl backdrop-blur md:left-auto md:right-4 md:max-w-[360px]">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-[0.24em] text-[#ff9a00]">Motion Debug</span>
        <button
          onClick={() => {
            localStorage.setItem("servicesDebug", "0");
            setEnabled(false);
          }}
          className="rounded border border-white/20 px-2 py-0.5 text-[10px] hover:bg-white/10"
        >
          close
        </button>
      </div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
        <div>active: {s.active}</div>
        <div>fps: {s.fps.toFixed(0)}</div>
        <div>
          formed: {fmt(s.formed)} → {fmt(s.targetFormed)}
        </div>
        <div>
          fill: {fmt(s.fill)} → {fmt(s.targetFill)}
        </div>
        <div>
          travel: {fmt(s.serviceTravel)} / {fmt(s.targetTravel)}
        </div>
        <div>section: {fmt(s.sectionProgress)}</div>
        <div className="col-span-2">vel: {s.scrollVelocity.toFixed(1)}px/f</div>
      </div>
      <div className="mt-2 space-y-1.5">
        <div>{bar(s.formed, "#ff9a00")}</div>
        <div>{bar(s.fill, "#149eff")}</div>
        <div>{bar(s.serviceTravel, "#fdfaf6")}</div>
      </div>
      <div className="mt-3">
        <div className="mb-1 flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-white/55">
          <span>scrub section</span>
          <span>{scrub === null ? "live" : `${(scrub * 100).toFixed(1)}%`}</span>
        </div>
        <input
          type="range"
          min={0}
          max={1}
          step={0.001}
          value={scrub ?? clamp01(s.sectionProgress)}
          onChange={onScrub}
          className="w-full accent-[#ff9a00]"
        />
        <div className="mt-1 flex gap-1">
          {[0, 0.1, 0.25, 0.5, 0.75, 0.9, 1].map((v) => (
            <button
              key={v}
              onClick={() => onScrub({ target: { value: String(v) } } as React.ChangeEvent<HTMLInputElement>)}
              className="flex-1 rounded border border-white/15 px-1 py-0.5 text-[10px] hover:bg-white/10"
            >
              {Math.round(v * 100)}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-2 text-[10px] text-white/45">⌘/Ctrl+Shift+D toggles. ?debug=motion forces on.</div>
    </div>
  );
}

export function ServicesScroller() {
  const sectionRef = useRef<HTMLElement>(null);
  return (
    <section ref={sectionRef} data-nav-theme="dark" className="relative isolate overflow-hidden bg-[#030509] text-[#fdfaf6]">
      <div
        aria-hidden
        className="absolute inset-0 z-0"
        style={{ background: "linear-gradient(180deg, #020309 0%, #07080d 45%, #020309 100%)" }}
      />
      <SpaceField hostRef={sectionRef} />
      <ParticleJourney hostRef={sectionRef} />
      <div className="relative z-10 mx-auto max-w-[1440px] px-6 pb-[18vh] pt-[18vh] md:px-12">
        <header className="mb-[10vh] max-w-[920px]">
          <div className="mb-5 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.32em] text-[#e8390e]">
            <span className="inline-block h-px w-8 bg-[#e8390e]" />
            <span>What we do</span>
          </div>
          <h2 className="font-display text-[clamp(48px,8vw,128px)] font-bold leading-[0.92] text-[#fdfaf6]">
            Our Primary <span className="italic text-[#fdfaf6]/70">Services</span>
          </h2>
          <p className="mt-6 max-w-[56ch] font-body text-[15px] leading-[1.65] text-[#fdfaf6]/62 md:text-[17px]">
            Six disciplines, one studio — scroll through the constellation as each capability forms from dust.
          </p>
        </header>
        {services.map((service, i) => {
          const textLeft = i % 2 === 0;
          return (
            <article
              key={service.n}
              data-service-index={i}
              className="grid min-h-screen items-center gap-10 py-[8vh] md:grid-cols-2 md:gap-16"
            >
              <div className={textLeft ? "md:order-1" : "md:order-2 md:text-right"}>
                <div
                  className="mb-5 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.32em] text-[#e8390e]"
                  style={{ justifyContent: textLeft ? "flex-start" : "flex-end" }}
                >
                  <span className="inline-block h-px w-8 bg-[#e8390e]" />
                  <span>{service.tag}</span>
                </div>
                <p className="font-mono text-[12px] text-[#fdfaf6]/38">({service.n})</p>
                <h3 className="mt-4 font-display text-[clamp(44px,7vw,110px)] font-bold leading-[0.94] text-[#fdfaf6]">
                  {service.name}
                </h3>
                <p
                  className="mt-7 max-w-[44ch] font-body text-[15px] leading-[1.65] text-[#fdfaf6]/62 md:text-[17px]"
                  style={{ marginLeft: textLeft ? 0 : "auto" }}
                >
                  {service.desc}
                </p>
              </div>
              <div aria-hidden className={textLeft ? "min-h-[52vh] md:order-2" : "min-h-[52vh] md:order-1"} />
            </article>
          );
        })}
      </div>
      <MotionDebugOverlay hostRef={sectionRef} />
    </section>
  );
}