import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
          "Selected animation, motion design, CGI and immersive projects from Tero Studios.",
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

  const filtered = useMemo(
    () =>
      videos.filter(
        (p) =>
          (svc === "All" || p.service === svc) &&
          (ind === "All" || p.industry === ind),
      ),
    [svc, ind],
  );

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <PageLayout>
      <div className="-mt-[68px] pt-[68px] w-full min-h-screen bg-ink text-cream selection:bg-cream/20">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-20 md:py-28">
          {/* ───────── Header & Filter Navigation ───────── */}
          <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 mb-20 md:mb-28 border-b border-cream/10 pb-12 md:pb-16">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-cream/40 mb-6">
                Portfolio / Index 2024
              </p>
              <h1 className="font-display text-[clamp(4rem,11vw,11rem)] leading-[0.82] font-extrabold uppercase tracking-tighter">
                Selected<br />Works<span className="text-cream/20">.</span>
              </h1>
            </div>

            <nav className="grid grid-cols-2 gap-x-10 md:gap-x-14 gap-y-6 font-mono text-[11px] uppercase tracking-[0.18em]">
              <FilterColumn
                label="By Service"
                options={services}
                value={svc}
                onChange={setSvc}
              />
              <FilterColumn
                label="By Industry"
                options={industries}
                value={ind}
                onChange={setInd}
              />
            </nav>
          </header>

          {/* ───────── Filter summary ───────── */}
          <div className="mb-14 md:mb-20 flex flex-wrap items-baseline justify-between gap-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-cream/40">
              {filtered.length.toString().padStart(2, "0")} {filtered.length === 1 ? "Project" : "Projects"} · {svc} / {ind}
            </p>
            {(svc !== "All" || ind !== "All") && (
              <button
                onClick={() => {
                  setSvc("All");
                  setInd("All");
                }}
                className="font-mono text-[10px] uppercase tracking-[0.25em] text-cream/50 hover:text-cream transition border-b border-cream/20 hover:border-cream pb-0.5"
              >
                Reset filters
              </button>
            )}
          </div>

          {filtered.length === 0 ? (
            <div className="py-32 text-center">
              <p className="font-display text-[clamp(40px,5vw,72px)] text-cream/40">
                No works under that combination.
              </p>
            </div>
          ) : (
            <>
              {/* ───────── Featured Hero Project ───────── */}
              {featured && (
                <FeaturedHero project={featured} onOpen={() => setActive(featured)} />
              )}

              {/* ───────── Editorial Asymmetric Grid ───────── */}
              <div className="mt-20 md:mt-28 grid grid-cols-1 md:grid-cols-12 gap-y-24 md:gap-y-32 md:gap-x-12">
                {rest.map((p, i) => {
                  const layout = LAYOUTS[i % LAYOUTS.length];
                  return (
                    <ProjectCard
                      key={p.title + i}
                      project={p}
                      index={i + 2}
                      layout={layout}
                      onOpen={() => setActive(p)}
                    />
                  );
                })}
              </div>
            </>
          )}

          {/* ───────── Footer Marquee ───────── */}
          <footer className="mt-40 md:mt-56 border-t border-cream/10 pt-20 md:pt-28 text-center">
            <span className="font-mono text-[10px] uppercase tracking-[0.5em] text-cream/30 mb-8 block">
              End of Selection
            </span>
            <a
              href="/contact"
              className="inline-block font-display text-[clamp(48px,9vw,144px)] leading-[0.85] font-extrabold uppercase tracking-tighter text-cream hover:text-vermillion transition-colors duration-500"
            >
              Start a Project →
            </a>
          </footer>
        </div>
      </div>

      <Lightbox project={active} onClose={() => setActive(null)} />
    </PageLayout>
  );
}

/* ───────── Filter column ───────── */
function FilterColumn({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-3">
      <span className="block text-cream/30">{label}</span>
      <ul className="flex flex-col gap-1.5">
        {options.map((o) => {
          const active = o === value;
          return (
            <li key={o}>
              <button
                onClick={() => onChange(o)}
                className={`text-left transition-all ${
                  active
                    ? "text-cream"
                    : "text-cream/40 hover:text-cream/90"
                }`}
              >
                <span className="inline-flex items-center gap-2">
                  <span
                    className={`h-px transition-all ${
                      active ? "w-5 bg-vermillion" : "w-0 bg-cream/0"
                    }`}
                  />
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

/* ───────── Featured hero ───────── */
function FeaturedHero({
  project,
  onOpen,
}: {
  project: VideoItem;
  onOpen: () => void;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="group relative w-full cursor-pointer"
      onClick={onOpen}
    >
      <div className="relative aspect-[21/9] w-full overflow-hidden rounded-sm ring-1 ring-cream/10 bg-black">
        <MediaLayer url={project.url} className="opacity-80 group-hover:scale-[1.04] transition-transform duration-[1400ms] ease-out" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent opacity-90" />
        <div className="absolute inset-x-0 bottom-0 p-6 md:p-14">
          <div className="flex items-center gap-4 mb-4">
            <span className="px-2.5 py-1 border border-cream/25 text-[9px] uppercase tracking-[0.25em] bg-black/40 backdrop-blur-sm font-mono">
              Featured
            </span>
            <span className="h-px w-8 bg-cream/30" />
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-cream/70">
              {project.client} / {project.service}
            </span>
          </div>
          <h2 className="font-display text-[clamp(48px,9vw,144px)] font-extrabold uppercase leading-[0.85] tracking-tighter">
            {project.title}
          </h2>
        </div>
        <div className="absolute top-6 right-6 md:top-10 md:right-10 h-14 w-14 md:h-16 md:w-16 rounded-full border border-cream/30 backdrop-blur-md flex items-center justify-center text-cream group-hover:bg-cream group-hover:text-ink transition-all duration-500">
          <span className="ml-0.5">▶</span>
        </div>
      </div>
    </motion.section>
  );
}

/* ───────── Uniform anamorphic layout ───────── */
type Layout = {
  col: string;
  offset: string;
  size: "lg" | "md" | "wide";
};

// All cards share a 2.39:1 cinema aspect; we only vary column width + offset.
const ANAMORPHIC = "aspect-[2.39/1]";

const LAYOUTS: Layout[] = [
  { col: "md:col-span-7", offset: "", size: "lg" },
  { col: "md:col-span-5", offset: "md:mt-32", size: "md" },
  { col: "md:col-span-12", offset: "", size: "wide" },
  { col: "md:col-span-5", offset: "", size: "md" },
  { col: "md:col-span-7", offset: "md:mt-32", size: "lg" },
];

function ProjectCard({
  project,
  index,
  layout,
  onOpen,
}: {
  project: VideoItem;
  index: number;
  layout: Layout;
  onOpen: () => void;
}) {
  const titleSize =
    layout.size === "wide"
      ? "text-[clamp(40px,7vw,112px)]"
      : layout.size === "lg"
      ? "text-[clamp(32px,4vw,60px)]"
      : "text-[clamp(26px,3vw,44px)]";

  return (
    <motion.article
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`${layout.col} ${layout.offset} group cursor-pointer`}
      onClick={onOpen}
    >
      <div
        className={`relative ${ANAMORPHIC} bg-black overflow-hidden rounded-sm ring-1 ring-cream/5 group-hover:ring-cream/25 transition-all duration-700`}
      >
        <MediaLayer
          url={project.url}
          className="opacity-85 group-hover:opacity-100 scale-x-[1.06] group-hover:scale-x-[1.12] transition-all duration-1000 ease-out"
        />
        {/* cinematic letterbox vignette */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[8%] bg-gradient-to-b from-black/80 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[10%] bg-gradient-to-t from-black/80 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 left-0 w-[5%] bg-gradient-to-r from-black/40 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-[5%] bg-gradient-to-l from-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute top-4 right-4 h-10 w-10 rounded-full bg-cream/10 backdrop-blur-md flex items-center justify-center text-cream opacity-0 group-hover:opacity-100 transition-all duration-500">
          ▶
        </div>


      </div>

      {layout.size === "wide" ? (
        <div className="mt-8 md:mt-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="max-w-3xl">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-cream/40 block mb-3">
              {String(index).padStart(3, "0")} · {project.service} · {project.industry}
            </span>
            <h3 className={`font-display ${titleSize} uppercase font-extrabold leading-[0.9] tracking-tighter`}>
              {project.title}
            </h3>
          </div>
          <span className="px-7 py-3 rounded-full border border-cream/20 font-mono text-[10px] uppercase tracking-[0.25em] group-hover:bg-cream group-hover:text-ink transition-all duration-500">
            Explore Project
          </span>
        </div>
      ) : (
        <div className="mt-6 md:mt-8">
          <div className="flex justify-between items-baseline mb-2 gap-4">
            <h3 className={`font-display ${titleSize} uppercase font-bold leading-[0.95] tracking-tight`}>
              {project.title}
            </h3>
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-cream/40 shrink-0">
              {String(index).padStart(3, "0")} / {project.service.split(" ")[0]}
            </span>
          </div>
          <p className="font-body text-sm text-cream/55 max-w-md leading-relaxed">
            {project.client} · {project.industry}
          </p>
        </div>
      )}
    </motion.article>
  );
}

/* ───────── Media: thumbnail poster + lazy video ───────── */
function MediaLayer({
  url,
  className = "",
}: {
  url: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mount, setMount] = useState(false);
  const [ready, setReady] = useState(false);
  const thumb = useVideoThumbnail(url);

  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMount(true);
          io.disconnect();
        }
      },
      { rootMargin: "400px", threshold: 0.01 },
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
    <div ref={ref} className={`absolute inset-0 ${className}`}>
      {thumb && (
        <img
          src={thumb}
          alt=""
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover pointer-events-none select-none"
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
          className={`absolute inset-0 h-full w-full object-cover pointer-events-none select-none transition-opacity duration-500 ${
            ready ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
    </div>
  );
}

/* ───────── Lightbox modal ───────── */
function Lightbox({
  project,
  onClose,
}: {
  project: VideoItem | null;
  onClose: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!project) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/95 backdrop-blur-xl p-4 md:p-10"
        >
          <button
            onClick={onClose}
            className="absolute top-5 right-5 z-10 h-11 w-11 rounded-full bg-cream/10 hover:bg-vermillion text-cream flex items-center justify-center transition"
            aria-label="Close"
          >
            ✕
          </button>

          <div className="absolute top-6 left-6 text-cream">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-vermillion">
              {project.service} · {project.industry}
            </p>
            <p className="mt-1 font-display text-[18px] md:text-[22px]">
              {project.title}{" "}
              <span className="text-cream/50 font-body text-[13px]">
                — {project.client}
              </span>
            </p>
          </div>

          <motion.div
            initial={{ scale: 0.96, y: 12 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, y: 12 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-6xl rounded-2xl overflow-hidden bg-black shadow-2xl"
            style={{ aspectRatio: Math.max(0.6, Math.min(2.4, project.aspect)) }}
          >
            <video
              ref={videoRef}
              src={project.url}
              autoPlay
              controls
              playsInline
              {...protectedVideoProps}
              onContextMenu={(e) => e.preventDefault()}
              className="absolute inset-0 h-full w-full object-contain select-none"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
