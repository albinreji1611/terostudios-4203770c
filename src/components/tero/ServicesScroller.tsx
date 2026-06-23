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
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><rect x="1.5" y="5" width="15" height="11" rx="1.2"/><path d="M7 19h4M9 16v3"/><circle cx="8.5" cy="10.5" r="2.6"/><path d="M7.6 9.4l2.4 1.1-2.4 1.1z" fill="black" stroke="none"/><path d="M16.5 8.5l4 -2v8l-4 -2z"/><path d="M21.6 7.5c.6 1 .6 3 0 4M22.6 6.5c1 1.6 1 5 0 6.6"/></svg>`,
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="4" width="19" height="9" rx="0.6"/><path d="M2.5 13h19l-1 2h-17z"/><path d="M11.4 15v6M12.6 15v6"/><path d="M8 21h8"/><path d="M5 2.5l1.5 1.5M9 2.5l1 1.5M13 2.5l1 1.5M17 2.5l1 1.5"/></svg>`,
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M10 3h4v2h-4z"/><path d="M3 9c0-1 .8-2 2-2h14c1.2 0 2 1 2 2v5c0 1.2-1 2-2 2h-3.5l-1.6-2a2 2 0 0 0-3.8 0L8.5 16H5c-1.2 0-2-.8-2-2z"/><circle cx="8.5" cy="12" r="1.8"/><circle cx="15.5" cy="12" r="1.8"/><path d="M2 18l1 1M22 18l-1 1M3.5 5.5l.8.8M20.5 5.5l-.8.8"/></svg>`,
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21V10l-5 3v8z"/><path d="M20 21V5l-7-3v19z"/><path d="M13 2v19"/><rect x="15" y="11" width="6" height="10"/><path d="M16.5 13h1M19 13h1M16.5 15.5h1M19 15.5h1M16.5 18h1M19 18h1"/></svg>`,
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4l5 2.5v5L12 14 7 11.5v-5z"/><path d="M7 6.5l5 2.5 5-2.5M12 9v5"/><path d="M4 21h16M5 19h14a1 1 0 0 0 0-2H5a1 1 0 0 0 0 2z"/><path d="M3 21l3-4M21 21l-3-4M8 17l1-3M16 17l-1-3M12 17v-3" stroke-dasharray="1.6 1.6"/></svg>`,
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="5" width="14" height="14" rx="2"/><rect x="8" y="8" width="8" height="8" rx="1"/><text x="12" y="14.3" text-anchor="middle" font-family="Arial, sans-serif" font-weight="bold" font-size="5.2" fill="black" stroke="none">AI</text><path d="M9 2v3M12 2v3M15 2v3M9 19v3M12 19v3M15 19v3M2 9h3M2 12h3M2 15h3M19 9h3M19 12h3M19 15h3"/><circle cx="12" cy="3" r="0.9" fill="black" stroke="none"/><circle cx="12" cy="21" r="0.9" fill="black" stroke="none"/><circle cx="3" cy="12" r="0.9" fill="black" stroke="none"/><circle cx="21" cy="12" r="0.9" fill="black" stroke="none"/></svg>`,
];

const COLORS = [
  "rgba(255,154,0,0.95)",
  "rgba(232,57,14,0.82)",
  "rgba(20,158,255,0.9)",
  "rgba(253,250,246,0.82)",
];

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const ease = (n: number) => {
  const t = clamp01(n);
  return t * t * t * (t * (t * 6 - 15) + 10);
};

const ramp = (from: number, to: number, value: number) => ease((value - from) / (to - from));
const motionWindow = (value: number) => ramp(0.18, 0.46, value) * (1 - ramp(0.74, 0.96, value));

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
          const glyph = size * 0.9;
          const off = (size - glyph) / 2;
          sctx.drawImage(img, off, off, glyph, glyph);
          const data = sctx.getImageData(0, 0, size, size).data;
          const step = Math.max(2, Math.round(size / 136));
          const pts: Point[] = [];
          for (let y = 0; y < size; y += step) {
            for (let x = 0; x < size; x += step) {
              const i = (y * size + x) * 4;
              if (data[i + 3] > 52) {
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
      const run = ++sampleRun;
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const box = Math.round(Math.min(h * 0.74, w * (w < 760 ? 0.82 : 0.56)));
      pointSets = await Promise.all(ICONS.map((icon) => sampleIcon(icon, box)));
      if (run !== sampleRun) return;
      serviceNodes = Array.from(host.querySelectorAll<HTMLElement>("[data-service-index]"));
      const total = reduceMotion ? 520 : w < 760 ? 1280 : 2600;
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
          size: 0.62 + Math.random() * 1.28,
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
      targetFormed = best > 0.08 ? 0.06 + profile * 0.94 : 0;
      targetFill = clamp01(1 - profile);
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

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
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
        const volume = 14 + (p.idx % 11) * 2.4;
        const px = pt.x * 1.18 + Math.sin(p.phase * 2.1) * volume;
        const py = pt.y * 1.18 + Math.cos(p.phase * 1.7) * volume;
        const depth = ((p.idx % 37) - 18) * 7 + Math.sin(p.idx * 0.77) * 24 + Math.sin(p.phase) * 72;
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

        ctx.globalAlpha = Math.min(1, 0.18 + fill * 0.34 + formed * 0.56 + Math.max(0, p.z) / 1250);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (0.76 + formed * 0.46) * perspectiveScale, 0, Math.PI * 2);
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
    </section>
  );
}