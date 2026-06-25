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
  const [index, setIndex] = useState(0);
  const [lightbox, setLightbox] = useState<VideoItem | null>(null);

  const filtered = useMemo(
    () =>
      videos.filter(
        (p) =>
          (svc === "All" || p.service === svc) &&
          (ind === "All" || p.industry === ind),
      ),
    [svc, ind],
  );

  useEffect(() => {
    setIndex(0);
  }, [svc, ind]);

  const total = filtered.length;
  const current = filtered[index];

  const go = (dir: 1 | -1) => {
    if (!total) return;
    setIndex((i) => (i + dir + total) % total);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (lightbox) return;
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [total, lightbox]);

  return (
    <PageLayout>
      <div className="-mt-[68px] pt-[68px] w-full min-h-screen bg-ink text-cream">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-16 md:py-24">
          {/* Header */}
          <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 pb-10 md:pb-14 border-b border-cream/10">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-cream/40 mb-5">
                Client Stories
              </p>
              <h1 className="font-display text-[clamp(2.6rem,6vw,5.5rem)] leading-[0.95] font-extrabold tracking-tight">
                Portfolio of <span className="italic font-light text-cream/80">Consensus</span>
              </h1>
            </div>
            <div className="text-right">
              <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-cream/40 mb-2">
                Series
              </p>
              <p className="font-display text-3xl md:text-4xl tabular-nums">
                <span className="text-cream">{String(index + 1).padStart(3, "0")}</span>
                <span className="text-cream/30">, {String(total).padStart(3, "0")}</span>
              </p>
            </div>
          </header>

          {/* Filters */}
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 font-mono text-[10px] uppercase tracking-[0.22em]">
            <FilterRow label="Service" options={services} value={svc} onChange={setSvc} />
            <span className="text-cream/15">/</span>
            <FilterRow label="Industry" options={industries} value={ind} onChange={setInd} />
          </div>

          {/* Slide stage */}
          {!current ? (
            <div className="py-40 text-center text-cream/40 font-display text-3xl">
              No works under this combination.
            </div>
          ) : (
            <section className="relative mt-12 md:mt-16">
              <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] gap-10 md:gap-16 items-center min-h-[60vh]">
                {/* Left: video stage */}
                <div className="relative">
                  <AnimatePresence mode="wait">
                    <motion.button
                      key={current.url}
                      onClick={() => setLightbox(current)}
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -16 }}
                      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                      className="group relative block w-full aspect-video overflow-hidden rounded-sm ring-1 ring-cream/10 bg-black"
                    >
                      <MediaLayer url={current.url} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute bottom-4 right-4 h-12 w-12 rounded-full bg-cream/10 backdrop-blur-md flex items-center justify-center text-cream opacity-0 group-hover:opacity-100 transition-all duration-500">
                        <span className="ml-0.5">▶</span>
                      </div>
                    </motion.button>
                  </AnimatePresence>
                </div>

                {/* Right: copy */}
                <div className="relative">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={current.url + "-copy"}
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -16 }}
                      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
                    >
                      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-vermillion mb-5">
                        {current.service} · {current.industry}
                      </p>
                      <h2 className="font-display text-[clamp(2rem,4.4vw,4rem)] leading-[1.02] font-extrabold tracking-tight">
                        {current.title}
                      </h2>
                      <div className="mt-6 h-px w-16 bg-cream/30" />
                      <p className="mt-6 font-body text-base md:text-lg text-cream/70 max-w-lg leading-relaxed">
                        A {current.service.toLowerCase()} project crafted for {current.client},
                        designed to elevate the {current.industry.toLowerCase()} brand narrative
                        through cinematic motion and considered visual systems.
                      </p>
                      <p className="mt-8 font-sans-display text-lg font-bold tracking-wide">
                        {current.client}
                      </p>
                      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-cream/45 mt-1">
                        File {String(index + 1).padStart(2, "0")} of {String(total).padStart(2, "0")}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* Controls */}
              <div className="mt-10 md:mt-14 flex items-center justify-between gap-6">
                <button
                  onClick={() => go(-1)}
                  aria-label="Previous"
                  className="h-12 w-12 md:h-14 md:w-14 rounded-full border border-cream/25 flex items-center justify-center text-cream hover:bg-cream hover:text-ink transition-colors"
                >
                  ←
                </button>

                <div className="flex items-center gap-3 flex-1 justify-center flex-wrap">
                  {filtered.slice(0, 12).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setIndex(i)}
                      aria-label={`Go to slide ${i + 1}`}
                      className={`h-1.5 transition-all duration-500 rounded-full ${
                        i === index ? "w-10 bg-vermillion" : "w-2 bg-cream/20 hover:bg-cream/40"
                      }`}
                    />
                  ))}
                  {total > 12 && (
                    <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-cream/40 ml-2">
                      +{total - 12}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => go(1)}
                  aria-label="Next"
                  className="h-12 w-12 md:h-14 md:w-14 rounded-full border border-cream/25 flex items-center justify-center text-cream hover:bg-cream hover:text-ink transition-colors"
                >
                  →
                </button>
              </div>
            </section>
          )}

          {/* Also trusted by */}
          <footer className="mt-28 md:mt-36 border-t border-cream/10 pt-10 flex flex-wrap items-baseline gap-x-10 gap-y-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-cream/40">
              Also trusted by
            </span>
            <div className="flex flex-wrap gap-x-8 gap-y-3 font-sans-display text-sm uppercase tracking-[0.25em] text-cream/55">
              {Array.from(new Set(videos.map((v) => v.client)))
                .filter((c) => c !== current?.client)
                .slice(0, 8)
                .map((c) => (
                  <span key={c}>{c}</span>
                ))}
            </div>
          </footer>

          {/* CTA */}
          <div className="mt-24 md:mt-32 border-t border-cream/10 pt-16 text-center">
            <a
              href="/contact"
              className="inline-block font-display text-[clamp(40px,7vw,108px)] leading-[0.9] font-extrabold tracking-tight hover:text-vermillion transition-colors duration-500"
            >
              Start a Project →
            </a>
          </div>
        </div>
      </div>

      <Lightbox project={lightbox} onClose={() => setLightbox(null)} />
    </PageLayout>
  );
}

function FilterRow({
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
    <div className="flex items-center gap-3 flex-wrap">
      <span className="text-cream/30">{label}:</span>
      {options.map((o) => {
        const active = o === value;
        return (
          <button
            key={o}
            onClick={() => onChange(o)}
            className={`transition-colors ${
              active ? "text-vermillion" : "text-cream/45 hover:text-cream"
            }`}
          >
            {o}
          </button>
        );
      })}
    </div>
  );
}

function MediaLayer({ url }: { url: string }) {
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
    <div ref={ref} className="absolute inset-0">
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

function Lightbox({
  project,
  onClose,
}: {
  project: VideoItem | null;
  onClose: () => void;
}) {
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
              src={project.url}
              autoPlay
              controls
              playsInline
              {...protectedVideoProps}
              className="absolute inset-0 h-full w-full object-contain select-none"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
