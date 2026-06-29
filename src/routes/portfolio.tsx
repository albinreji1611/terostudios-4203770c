import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { PageLayout } from "@/components/tero/PageLayout";
import { videos, type VideoItem } from "@/data/videos";
import { useVideoThumbnail } from "@/lib/use-video-thumbnail";

export const Route = createFileRoute("/portfolio")({
  component: PortfolioPage,
  head: () => ({
    meta: [
      { title: "Portfolio — Tero Studios" },
      {
        name: "description",
        content:
          "Selected animation, motion design, CGI and immersive projects from Tero Studios — shown in their native resolution and aspect ratio.",
      },
    ],
  }),
});

const services = ["All", ...Array.from(new Set(videos.map((v) => v.service)))];
const industries = ["All", ...Array.from(new Set(videos.map((v) => v.industry)))];

const protectedVideoProps = {
  controlsList: "nodownload noremoteplayback nofullscreen",
  disablePictureInPicture: true,
  onContextMenu: (e: React.MouseEvent) => e.preventDefault(),
} as const;

function PortfolioPage() {
  const [svc, setSvc] = useState("All");
  const [ind, setInd] = useState("All");
  const [active, setActive] = useState<VideoItem | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const filtered = useMemo(
    () =>
      videos.filter(
        (p) =>
          (svc === "All" || p.service === svc) &&
          (ind === "All" || p.industry === ind),
      ),
    [svc, ind],
  );

  return (
    <PageLayout>
      <div className="-mt-[68px] pt-[68px] w-full bg-ink text-cream selection:bg-vermillion/40">
        {/* HEADER */}
        <header className="container-tero pt-16 md:pt-24 pb-10 md:pb-14">
          <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-5 flex items-center gap-3">
                <span className="h-px w-8 bg-vermillion/70" />
                <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-vermillion">
                  (Index) Selected Works
                </span>
              </div>
              <h1 className="font-display text-[clamp(3rem,8vw,8.5rem)] leading-[0.86] tracking-tight">
                Stories at <span className="italic text-vermillion">native scale.</span>
              </h1>
              <p className="mt-6 max-w-xl font-body text-[15px] leading-relaxed text-cream/55">
                Every reel below plays in its original aspect ratio and resolution — exactly as it was mastered, no crop, no fill, no compromise.
              </p>
            </div>

            <nav className="grid grid-cols-2 gap-x-10 gap-y-6 font-mono text-[11px] uppercase tracking-[0.18em] md:gap-x-14">
              <FilterColumn label="By Service" options={services} value={svc} onChange={setSvc} />
              <FilterColumn label="By Industry" options={industries} value={ind} onChange={setInd} />
            </nav>
          </div>

          <div className="mt-12 flex flex-wrap items-baseline justify-between gap-6 border-t border-cream/10 pt-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-cream/40">
              {filtered.length.toString().padStart(2, "0")} {filtered.length === 1 ? "Reel" : "Reels"} · {svc} / {ind}
            </p>
            {(svc !== "All" || ind !== "All") && (
              <button
                onClick={() => { setSvc("All"); setInd("All"); }}
                className="font-mono text-[10px] uppercase tracking-[0.25em] text-cream/50 transition hover:text-cream"
              >
                ✕ Reset filters
              </button>
            )}
          </div>
        </header>

        {/* CINEMATIC STACK */}
        {filtered.length === 0 ? (
          <div className="container-tero py-40 text-center">
            <p className="font-display text-[clamp(40px,5vw,72px)] text-cream/30">
              No works under that combination.
            </p>
          </div>
        ) : (
          <div className="relative">
            {/* Sticky progress index */}
            <div className="pointer-events-none sticky top-1/2 z-20 hidden h-0 -translate-y-1/2 md:block">
              <div className="container-tero">
                <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-cream/40">
                  <span className="text-vermillion">
                    {String(Math.min(currentIndex + 1, filtered.length)).padStart(2, "0")}
                  </span>
                  <span className="h-px w-10 bg-cream/20" />
                  <span>{String(filtered.length).padStart(2, "0")}</span>
                </div>
              </div>
            </div>

            <div>
              {filtered.map((p, i) => (
                <CinematicReel
                  key={`${p.title}-${i}`}
                  project={p}
                  index={i + 1}
                  total={filtered.length}
                  onOpen={() => setActive(p)}
                  onEnter={() => setCurrentIndex(i)}
                />
              ))}
            </div>
          </div>
        )}

        {/* FOOTER CTA */}
        <footer className="container-tero mt-32 border-t border-cream/10 pt-20 pb-28 text-center md:mt-48 md:pt-28">
          <span className="mb-8 block font-mono text-[10px] uppercase tracking-[0.5em] text-cream/30">
            End of Selection
          </span>
          <a
            href="/contact"
            className="inline-block font-display text-[clamp(48px,9vw,144px)] leading-[0.85] tracking-tight transition-colors duration-500 hover:text-vermillion"
          >
            Start a project <span className="italic text-vermillion">→</span>
          </a>
        </footer>
      </div>

      <Lightbox project={active} onClose={() => setActive(null)} />
    </PageLayout>
  );
}

function FilterColumn({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (v: string) => void; }) {
  return (
    <div className="space-y-3">
      <span className="block text-cream/30">{label}</span>
      <ul className="flex flex-col gap-1.5">
        {options.map((o) => {
          const isActive = o === value;
          return (
            <li key={o}>
              <button
                onClick={() => onChange(o)}
                className={`text-left transition-all ${isActive ? "text-cream" : "text-cream/40 hover:text-cream/90"}`}
              >
                <span className="inline-flex items-center gap-2">
                  <span className={`h-px transition-all ${isActive ? "w-5 bg-vermillion" : "w-0 bg-cream/0"}`} />
                  {o}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/**
 * CinematicReel — one full viewport stage per project.
 * The video sits in a centered frame sized to its NATIVE aspect ratio
 * (object-contain on pure black), guaranteeing the original composition
 * is preserved. A scroll-bound parallax slides meta info beside it.
 */
function CinematicReel({
  project,
  index,
  total,
  onOpen,
  onEnter,
}: {
  project: VideoItem;
  index: number;
  total: number;
  onOpen: () => void;
  onEnter: () => void;
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const frameY = useTransform(scrollYProgress, [0, 1], ["6%", "-6%"]);
  const frameScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.96, 1, 0.96]);
  const metaY = useTransform(scrollYProgress, [0, 1], ["20%", "-20%"]);
  const indexY = useTransform(scrollYProgress, [0, 1], ["40%", "-40%"]);

  // Clamp displayed aspect so very tall or very wide originals still fit.
  const aspect = Math.max(0.45, Math.min(3.0, project.aspect));
  const isPortrait = aspect < 1;
  const isUltrawide = aspect > 2.2;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && e.intersectionRatio > 0.5) onEnter();
      },
      { threshold: [0.5, 0.75] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [onEnter]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100svh] w-full items-center justify-center overflow-hidden border-t border-cream/5 py-20 md:py-28"
    >
      {/* Ambient glow — derived from theme, never harsh */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 50%, rgba(229,84,46,0.06) 0%, transparent 70%)",
        }}
      />

      {/* Huge background index numeral */}
      <motion.div
        aria-hidden
        style={{ y: indexY }}
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <span className="select-none font-display text-[clamp(20rem,55vw,55rem)] leading-none tracking-tighter text-cream/[0.025]">
          {String(index).padStart(2, "0")}
        </span>
      </motion.div>

      <div className="container-tero relative z-10 grid w-full grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
        {/* LEFT — Meta */}
        <motion.div
          style={{ y: metaY }}
          className={`order-2 lg:order-1 ${isPortrait ? "lg:col-span-5" : isUltrawide ? "lg:col-span-12 lg:order-2" : "lg:col-span-4"}`}
        >
          <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.35em] text-vermillion">
            <span>{String(index).padStart(2, "0")}</span>
            <span className="h-px w-6 bg-vermillion/60" />
            <span className="text-cream/50">{String(total).padStart(2, "0")}</span>
          </div>

          <h2 className="mt-5 font-display text-[clamp(2.4rem,4.6vw,4.4rem)] leading-[0.92] tracking-tight">
            {project.title}
          </h2>

          <p className="mt-4 font-body text-[15px] leading-relaxed text-cream/55">
            For <span className="text-cream/90">{project.client}</span> — a {project.service.toLowerCase()} piece crafted for the {project.industry.toLowerCase()} world.
          </p>

          <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-cream/10 pt-6 font-mono text-[10px] uppercase tracking-[0.22em]">
            <div>
              <dt className="text-cream/35">Client</dt>
              <dd className="mt-1 text-cream/90">{project.client}</dd>
            </div>
            <div>
              <dt className="text-cream/35">Service</dt>
              <dd className="mt-1 text-cream/90">{project.service}</dd>
            </div>
            <div>
              <dt className="text-cream/35">Industry</dt>
              <dd className="mt-1 text-cream/90">{project.industry}</dd>
            </div>
            <div>
              <dt className="text-cream/35">Format</dt>
              <dd className="mt-1 text-cream/90">
                {isPortrait ? "Vertical" : isUltrawide ? "Anamorphic" : "Widescreen"} · {project.aspect.toFixed(2)}:1
              </dd>
            </div>
          </dl>

          <button
            onClick={onOpen}
            className="group/cta mt-10 inline-flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-cream/80 transition hover:text-vermillion"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-cream/30 transition group-hover/cta:border-vermillion group-hover/cta:bg-vermillion/10">
              <span className="ml-0.5 text-[11px]">▶</span>
            </span>
            Play in full
          </button>
        </motion.div>

        {/* RIGHT — Native frame */}
        <motion.div
          style={{ y: frameY, scale: frameScale }}
          className={`order-1 lg:order-2 ${isPortrait ? "lg:col-span-7" : isUltrawide ? "lg:col-span-12 lg:order-1" : "lg:col-span-8"}`}
        >
          <button
            type="button"
            onClick={onOpen}
            className="group/frame relative block w-full"
            aria-label={`Play ${project.title}`}
          >
            <div
              className="relative mx-auto w-full overflow-hidden rounded-[6px] bg-black shadow-[0_60px_120px_-40px_rgba(0,0,0,0.9)] ring-1 ring-cream/10 transition-all duration-700 group-hover/frame:ring-cream/30"
              style={{
                aspectRatio: aspect,
                maxHeight: isPortrait ? "78svh" : "82svh",
                maxWidth: isPortrait ? `calc(78svh * ${aspect})` : "100%",
              }}
            >
              <NativeMedia url={project.url} />

              {/* Corner ticks — cinema framing marks */}
              <CornerTicks />

              {/* Play affordance */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-500 group-hover/frame:opacity-100">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-cream/10 text-cream backdrop-blur-md">
                  <span className="ml-1">▶</span>
                </span>
              </div>
            </div>

            {/* Filmstrip footer */}
            <div className="mt-3 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.3em] text-cream/35">
              <span>Native {project.aspect.toFixed(2)}:1</span>
              <span className="h-px flex-1 mx-4 bg-cream/10" />
              <span>R-{String(index).padStart(3, "0")} · {project.service.split(" ")[0]}</span>
            </div>
          </button>
        </motion.div>
      </div>
    </section>
  );
}

function CornerTicks() {
  const cls = "absolute h-3 w-3 border-cream/40";
  return (
    <>
      <span className={`${cls} top-2 left-2 border-t border-l`} />
      <span className={`${cls} top-2 right-2 border-t border-r`} />
      <span className={`${cls} bottom-2 left-2 border-b border-l`} />
      <span className={`${cls} bottom-2 right-2 border-b border-r`} />
    </>
  );
}

/**
 * NativeMedia — fills its parent (which is already sized to the video's
 * native aspect ratio) using object-contain so no cropping ever occurs.
 */
function NativeMedia({ url }: { url: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mount, setMount] = useState(false);
  const [ready, setReady] = useState(false);
  const thumb = useVideoThumbnail(url);

  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setMount(true); io.disconnect(); }
      },
      { rootMargin: "500px", threshold: 0.01 },
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || !mount) return;
    const play = () => v.play().catch(() => {});
    if (v.readyState >= 2) play();
    else v.addEventListener("loadeddata", play, { once: true });
  }, [mount]);

  return (
    <div ref={ref} className="absolute inset-0">
      {thumb && (
        <img
          src={thumb}
          alt=""
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover opacity-60 select-none pointer-events-none"
        />
      )}
      {mount && (
        <video
          ref={videoRef}
          src={url}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onCanPlay={() => setReady(true)}
          {...protectedVideoProps}
          className={`absolute inset-0 h-full w-full object-contain select-none pointer-events-none transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"}`}
        />
      )}
    </div>
  );
}

function Lightbox({ project, onClose }: { project: VideoItem | null; onClose: () => void; }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (!project) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [project, onClose]);

  const aspect = project ? Math.max(0.45, Math.min(3.0, project.aspect)) : 16 / 9;

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/95 backdrop-blur-xl p-4 md:p-10"
        >
          <button onClick={onClose} className="absolute top-5 right-5 z-10 h-11 w-11 rounded-full bg-cream/10 hover:bg-vermillion text-cream flex items-center justify-center transition" aria-label="Close">✕</button>
          <div className="absolute top-6 left-6 text-cream">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-vermillion">{project.service} · {project.industry}</p>
            <p className="mt-1 font-display text-[18px] md:text-[22px]">
              {project.title} <span className="text-cream/50 font-body text-[13px]">— {project.client}</span>
            </p>
          </div>
          <motion.div
            initial={{ scale: 0.96, y: 12 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96, y: 12 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-6xl rounded-2xl overflow-hidden bg-black shadow-2xl"
            style={{ aspectRatio: aspect }}
          >
            <video
              ref={videoRef} src={project.url} autoPlay controls playsInline
              {...protectedVideoProps} onContextMenu={(e) => e.preventDefault()}
              className="absolute inset-0 h-full w-full object-contain select-none"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
