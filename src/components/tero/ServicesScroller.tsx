import { useEffect, useRef } from "react";

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

const ICONS: string[] = [
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="1.5" y="5" width="15" height="11" rx="1.2"/><path d="M7 19h4M9 16v3"/><circle cx="8.5" cy="10.5" r="2.6"/><path d="M7.6 9.4l2.4 1.1-2.4 1.1z" fill="black" stroke="none"/><path d="M16.5 8.5l4 -2v8l-4 -2z"/><path d="M21.6 7.5c.6 1 .6 3 0 4M22.6 6.5c1 1.6 1 5 0 6.6"/></svg>`,
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="4" width="19" height="9" rx="0.6"/><path d="M2.5 13h19l-1 2h-17z"/><path d="M11.4 15v6M12.6 15v6"/><path d="M8 21h8"/><path d="M5 2.5l1.5 1.5M9 2.5l1 1.5M13 2.5l1 1.5M17 2.5l1 1.5"/></svg>`,
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M10 3h4v2h-4z"/><path d="M3 9c0-1 .8-2 2-2h14c1.2 0 2 1 2 2v5c0 1.2-1 2-2 2h-3.5l-1.6-2a2 2 0 0 0-3.8 0L8.5 16H5c-1.2 0-2-.8-2-2z"/><circle cx="8.5" cy="12" r="1.8"/><circle cx="15.5" cy="12" r="1.8"/></svg>`,
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21V10l-5 3v8z"/><path d="M20 21V5l-7-3v19z"/><path d="M13 2v19"/><rect x="15" y="11" width="6" height="10"/><path d="M16.5 13h1M19 13h1M16.5 15.5h1M19 15.5h1M16.5 18h1M19 18h1"/></svg>`,
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4l5 2.5v5L12 14 7 11.5v-5z"/><path d="M7 6.5l5 2.5 5-2.5M12 9v5"/><path d="M4 21h16M5 19h14a1 1 0 0 0 0-2H5a1 1 0 0 0 0 2z"/></svg>`,
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="5" width="14" height="14" rx="2"/><rect x="8" y="8" width="8" height="8" rx="1"/><text x="12" y="14.3" text-anchor="middle" font-family="Arial, sans-serif" font-weight="bold" font-size="5.2" fill="black" stroke="none">AI</text><path d="M9 2v3M12 2v3M15 2v3M9 19v3M12 19v3M15 19v3M2 9h3M2 12h3M2 15h3M19 9h3M19 12h3M19 15h3"/></svg>`,
];

const COLORS = [
  "rgba(232,57,14,0.95)",
  "rgba(232,57,14,0.72)",
  "rgba(196,154,60,0.78)",
  "rgba(253,250,246,0.76)",
];

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const ease = (n: number) => {
  const t = clamp01(n);
  return t * t * t * (t * (t * 6 - 15) + 10);
};

type Point = { x: number; y: number };

function ParticleObject({ icon, align }: { icon: string; align: "left" | "right" }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let raf = 0;
    let w = 0;
    let h = 0;
    let progress = 0;
    let points: Point[] = [];
    let mx = -9999;
    let my = -9999;
    let smx = -9999;
    let smy = -9999;

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
      idx: number;
      size: number;
      color: string;
      phase: number;
    };

    let particles: Particle[] = [];

    const sampleIcon = async (svg: string, size: number) =>
      new Promise<Point[]>((resolve) => {
        const blob = new Blob([svg], { type: "image/svg+xml" });
        const url = URL.createObjectURL(blob);
        const img = new Image();
        img.onload = () => {
          const sample = document.createElement("canvas");
          const sctx = sample.getContext("2d")!;
          sample.width = size;
          sample.height = size;
          const glyph = size * 0.82;
          const off = (size - glyph) / 2;
          sctx.drawImage(img, off, off, glyph, glyph);
          const data = sctx.getImageData(0, 0, size, size).data;
          const step = Math.max(3, Math.round(size / 92));
          const pts: Point[] = [];
          for (let y = 0; y < size; y += step) {
            for (let x = 0; x < size; x += step) {
              const i = (y * size + x) * 4;
              if (data[i + 3] > 70) {
                pts.push({ x: x - size / 2, y: y - size / 2 });
              }
            }
          }
          URL.revokeObjectURL(url);
          resolve(pts);
        };
        img.src = url;
      });

    const measure = async () => {
      w = wrap.clientWidth;
      h = wrap.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const box = Math.round(Math.min(w, h) * 0.68);
      points = await sampleIcon(icon, box);
      const total = Math.min(820, Math.max(520, points.length));
      particles = new Array(total).fill(0).map((_, i) => {
        const a = Math.random() * Math.PI * 2;
        const r = Math.min(w, h) * (0.28 + Math.random() * 0.42);
        const sx = Math.cos(a) * r;
        const sy = Math.sin(a) * r;
        return {
          x: sx,
          y: sy,
          z: (Math.random() - 0.5) * 380,
          vx: 0,
          vy: 0,
          vz: 0,
          sx,
          sy,
          sz: (Math.random() - 0.5) * 520,
          idx: i,
          size: 0.8 + Math.random() * 1.35,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          phase: Math.random() * Math.PI * 2,
        };
      });
    };

    const update = () => {
      const rect = wrap.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const viewportCenter = window.innerHeight / 2;
      progress = clamp01(1 - Math.abs(center - viewportCenter) / (window.innerHeight * 0.72));
    };

    const onMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mx = event.clientX - rect.left;
      my = event.clientY - rect.top;
    };

    const onLeave = () => {
      mx = -9999;
      my = -9999;
    };

    const tick = (now: number) => {
      update();
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
      const formed = ease(progress);
      const cx = w / 2;
      const cy = h / 2;
      const t = now / 1000;
      const yaw = (align === "left" ? -1 : 1) * (t * 0.16 + formed * 1.55);
      const pitch = Math.sin(t * 0.28) * 0.24;
      const cosY = Math.cos(yaw);
      const sinY = Math.sin(yaw);
      const cosP = Math.cos(pitch);
      const sinP = Math.sin(pitch);

      for (const p of particles) {
        const pt = points[p.idx % Math.max(1, points.length)] || { x: 0, y: 0 };
        const depth = ((p.idx % 23) - 11) * 5 + Math.sin(p.idx * 0.77) * 18;
        const rx = pt.x * cosY + depth * sinY;
        const rz = depth * cosY - pt.x * sinY;
        const ry = pt.y * cosP - rz * sinP;
        const rz2 = rz * cosP + pt.y * sinP;
        const dust = 1 + Math.sin(t * 0.2 + p.phase) * 0.018;
        let tx = p.sx * dust * (1 - formed) + rx * formed;
        let ty = p.sy * dust * (1 - formed) + ry * formed;
        const tz = p.sz * (1 - formed) + rz2 * formed;

        const screenX = cx + tx;
        const screenY = cy + ty;
        if (smx > -9000) {
          const dx = screenX - smx;
          const dy = screenY - smy;
          const dist = Math.hypot(dx, dy);
          const radius = 105;
          if (dist < radius && dist > 0.1) {
            const push = Math.pow(1 - dist / radius, 2) * 58;
            tx += (dx / dist) * push;
            ty += (dy / dist) * push;
          }
        }

        p.vx = (p.vx + (tx - p.x) * 0.026) * 0.86;
        p.vy = (p.vy + (ty - p.y) * 0.026) * 0.86;
        p.vz = (p.vz + (tz - p.z) * 0.02) * 0.88;
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;

        const perspective = 720 / (720 - p.z);
        const x = cx + p.x * perspective;
        const y = cy + p.y * perspective;
        ctx.globalAlpha = Math.min(1, 0.18 + formed * 0.76 + Math.max(0, p.z) / 1100);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(x, y, p.size * perspective * (0.8 + formed * 0.42), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
      raf = requestAnimationFrame(tick);
    };

    measure();
    raf = requestAnimationFrame(tick);
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", update, { passive: true });
    canvas.addEventListener("pointermove", onMove, { passive: true });
    canvas.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", update);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, [align, icon]);

  return (
    <div ref={wrapRef} className="relative h-[min(64vw,640px)] min-h-[360px] w-full">
      <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" />
    </div>
  );
}

function SpaceField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let raf = 0;
    let w = 0;
    let h = 0;
    let scroll = 0;
    type Star = { x: number; y: number; z: number; r: number; a: number };
    let stars: Star[] = [];

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      stars = new Array(Math.floor((w * h) / 2500)).fill(0).map(() => ({
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
      raf = requestAnimationFrame(tick);
    };

    resize();
    update();
    raf = requestAnimationFrame(tick);
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", update);
    };
  }, []);

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-0 block h-full w-full" />;
}

export function ServicesScroller() {
  return (
    <section data-nav-theme="dark" className="relative isolate overflow-hidden bg-[#030509] text-[#fdfaf6]">
      <div
        aria-hidden
        className="absolute inset-0 z-0"
        style={{ background: "linear-gradient(180deg, #020309 0%, #07080d 45%, #020309 100%)" }}
      />
      <SpaceField />
      <div className="relative z-10 mx-auto max-w-[1440px] px-6 pb-[18vh] pt-0 md:px-12">
        {services.map((service, i) => {
          const textLeft = i % 2 === 0;
          return (
            <article
              key={service.n}
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
              <div className={textLeft ? "md:order-2" : "md:order-1"}>
                <ParticleObject icon={ICONS[i]} align={textLeft ? "right" : "left"} />
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}