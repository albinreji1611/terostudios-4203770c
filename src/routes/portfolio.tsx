import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageLayout } from "@/components/tero/PageLayout";
import { Reveal } from "@/components/tero/Reveal";
import { videos } from "@/data/videos";

export const Route = createFileRoute("/portfolio")({
  component: PortfolioPage,
  head: () => ({
    meta: [
      { title: "Portfolio — Tero Studios" },
      { name: "description", content: "Selected animation, motion and VFX projects from Tero Studios." },
    ],
  }),
});

const projects = videos;
const services = ["All", ...Array.from(new Set(videos.map((v) => v.service)))];
const industries = ["All", ...Array.from(new Set(videos.map((v) => v.industry)))];

function PortfolioPage() {
  const [svc, setSvc] = useState("All");
  const [ind, setInd] = useState("All");
  const [view, setView] = useState<"editorial" | "grid">("editorial");

  const filtered = useMemo(
    () =>
      projects.filter(
        (p) => (svc === "All" || p.service === svc) && (ind === "All" || p.industry === ind),
      ),
    [svc, ind],
  );

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <PageLayout>
      {/* ─────────────── HERO ─────────────── */}
      <section className="relative overflow-hidden">
        <div className="container-tero pt-28 pb-12 md:pt-40 md:pb-20">
          <div className="grid grid-cols-12 gap-6 items-end">
            <div className="col-span-12 lg:col-span-8">
              <Reveal>
                <p className="overline">— Portfolio / Index 2015–2026</p>
                <h1 className="mt-6 hero-headline text-[clamp(56px,11vw,168px)] leading-[0.88] tracking-[-0.04em]">
                  Films, frames,
                  <br />
                  <span className="italic font-light">favourites.</span>
                </h1>
              </Reveal>
            </div>

            <div className="col-span-12 lg:col-span-4 flex lg:justify-end">
              <Reveal>
                <div className="flex items-end gap-6 border-l border-ink/15 pl-6">
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate">
                      Projects shown
                    </div>
                    <div className="mt-2 font-display text-[64px] leading-none text-ink tabular-nums">
                      {String(filtered.length).padStart(2, "0")}
                    </div>
                  </div>
                  <div className="hidden md:block pb-2">
                    <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-vermillion">
                      / of {projects.length}
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>

          {/* ticker strip */}
          <div className="mt-14 flex items-center gap-4 border-y border-ink/10 py-3 overflow-hidden">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-vermillion shrink-0">
              ● Now playing
            </span>
            <div className="overflow-hidden flex-1">
              <div className="flex gap-10 animate-marquee whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.2em] text-slate" style={{ animationDuration: "60s" }}>
                {[...projects, ...projects].map((p, i) => (
                  <span key={i} className="shrink-0">
                    {p.client} — {p.title}
                    <span className="ml-10 text-ink/20">/</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────── STICKY FILTER BAR ─────────────── */}
      <section className="sticky top-0 z-30 bg-cream/85 backdrop-blur-md border-b border-ink/10">
        <div className="container-tero py-4 flex flex-wrap items-center gap-x-6 gap-y-3">
          <FilterRow label="Service" value={svc} setValue={setSvc} options={services} />
          <div className="hidden md:block h-5 w-px bg-ink/15" />
          <FilterRow label="Industry" value={ind} setValue={setInd} options={industries} />
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => setView("editorial")}
              className={`font-mono text-[10px] uppercase tracking-[0.22em] px-3 py-1.5 rounded-full border transition ${
                view === "editorial"
                  ? "border-ink bg-ink text-cream"
                  : "border-ink/15 text-slate hover:border-ink/40"
              }`}
            >
              Editorial
            </button>
            <button
              onClick={() => setView("grid")}
              className={`font-mono text-[10px] uppercase tracking-[0.22em] px-3 py-1.5 rounded-full border transition ${
                view === "grid"
                  ? "border-ink bg-ink text-cream"
                  : "border-ink/15 text-slate hover:border-ink/40"
              }`}
            >
              Grid
            </button>
          </div>
        </div>
      </section>

      {/* ─────────────── PROJECTS ─────────────── */}
      <section className="container-tero py-16 md:py-24">
        {filtered.length === 0 ? (
          <div className="py-32 text-center">
            <p className="font-display text-[40px] text-ink">Nothing here — yet.</p>
            <p className="mt-3 font-body text-slate">Try a different combination.</p>
          </div>
        ) : view === "editorial" ? (
          <EditorialView featured={featured} rest={rest} />
        ) : (
          <GridView items={filtered} />
        )}
      </section>

      {/* ─────────────── CTA ─────────────── */}
      <section className="container-tero pb-32">
        <div className="relative overflow-hidden rounded-3xl bg-ink text-cream px-8 py-16 md:px-16 md:py-24">
          <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-vermillion/40 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-violet/40 blur-3xl" />
          <div className="relative grid md:grid-cols-12 gap-10 items-end">
            <div className="md:col-span-8">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-vermillion">
                — Have a brief?
              </p>
              <h2 className="mt-5 font-display text-[clamp(40px,6vw,84px)] leading-[0.95]">
                Your project, <span className="italic font-light">next on this page.</span>
              </h2>
            </div>
            <div className="md:col-span-4 flex md:justify-end">
              <Link
                to="/contact"
                className="group inline-flex items-center gap-3 rounded-full bg-cream text-ink px-6 py-3 font-body text-[14px] font-medium hover:bg-vermillion hover:text-cream transition-colors"
              >
                Start a project
                <span className="transition-transform group-hover:translate-x-1">↗</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}

function FilterRow({
  label,
  value,
  setValue,
  options,
}: {
  label: string;
  value: string;
  setValue: (v: string) => void;
  options: string[];
}) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate mr-1">
        {label} /
      </span>
      {options.map((o) => {
        const active = value === o;
        return (
          <button
            key={o}
            onClick={() => setValue(o)}
            className={`font-body text-[12px] px-3 py-1 rounded-full transition ${
              active
                ? "bg-ink text-cream"
                : "text-slate hover:text-ink"
            }`}
          >
            {o}
          </button>
        );
      })}
    </div>
  );
}

/* ───────── Editorial: featured + asymmetric masonry ───────── */
function EditorialView({
  featured,
  rest,
}: {
  featured: (typeof videos)[number];
  rest: typeof videos;
}) {
  return (
    <div className="flex flex-col gap-16 md:gap-24">
      {featured && <FeaturedCard project={featured} />}

      {rest.length > 0 && (
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 [column-fill:_balance]">
          <AnimatePresence>
            {rest.map((p, i) => (
              <ProjectCard key={p.title + i} project={p} index={i + 2} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

function FeaturedCard({ project }: { project: (typeof videos)[number] }) {
  return (
    <motion.a
      href={project.url}
      target="_blank"
      rel="noreferrer"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="group block"
    >
      <div className="flex items-center justify-between mb-4">
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-vermillion">
          ★ Featured / 01
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate">
          {project.service} · {project.industry}
        </span>
      </div>
      <div className="relative overflow-hidden rounded-2xl bg-ink aspect-[16/9]">
        <video
          src={project.url}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/0 to-ink/0" />
        <div className="absolute inset-0 p-6 md:p-10 flex flex-col justify-end text-cream">
          <h2 className="font-display text-[clamp(40px,6vw,88px)] leading-[0.95]">
            {project.title}
          </h2>
          <p className="mt-2 font-body text-[14px] text-cream/70">{project.client}</p>
        </div>
        <div className="absolute top-6 right-6 h-10 w-10 rounded-full bg-cream/15 backdrop-blur-md flex items-center justify-center text-cream transition group-hover:bg-vermillion">
          ↗
        </div>
      </div>
    </motion.a>
  );
}

function ProjectCard({
  project,
  index,
}: {
  project: (typeof videos)[number];
  index: number;
}) {
  // Use real aspect ratio so the masonry feels alive
  const ratio = Math.max(0.5, Math.min(2.2, project.aspect));

  return (
    <motion.a
      layout
      href={project.url}
      target="_blank"
      rel="noreferrer"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="group mb-6 break-inside-avoid block"
    >
      <div
        className="relative overflow-hidden rounded-xl bg-ink"
        style={{ aspectRatio: ratio }}
      >
        <video
          src={project.url}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
        {/* hover overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute top-3 left-3 font-mono text-[10px] uppercase tracking-[0.25em] text-cream/80 bg-ink/40 backdrop-blur-sm rounded-full px-2.5 py-1">
          {String(index).padStart(2, "0")}
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 text-cream">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-vermillion">
            {project.service}
          </p>
          <h3 className="mt-1 font-display text-[22px] leading-tight">{project.title}</h3>
        </div>
      </div>
      <div className="mt-3 flex items-baseline justify-between gap-4">
        <h3 className="font-display text-[18px] text-ink leading-tight">
          {project.title}
        </h3>
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate shrink-0">
          {project.client}
        </span>
      </div>
    </motion.a>
  );
}

/* ───────── Grid: dense uniform fallback ───────── */
function GridView({ items }: { items: typeof videos }) {
  return (
    <motion.div
      layout
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
    >
      <AnimatePresence>
        {items.map((p, i) => (
          <motion.a
            key={p.title + i}
            layout
            href={p.url}
            target="_blank"
            rel="noreferrer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, delay: (i % 6) * 0.04 }}
            className="group block"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-ink">
              <video
                src={p.url}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-ink/85 to-transparent text-cream">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-vermillion">
                  {p.service}
                </p>
                <h3 className="mt-1 font-display text-[20px] leading-tight">{p.title}</h3>
                <p className="font-body text-[12px] text-cream/70">{p.client}</p>
              </div>
            </div>
          </motion.a>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
