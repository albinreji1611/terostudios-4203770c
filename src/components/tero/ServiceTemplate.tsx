import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { PageLayout } from "./PageLayout";
import { Reveal } from "./Reveal";
import { LogoStrip } from "./LogoStrip";
import { Testimonials } from "./Testimonials";
import { ArrowUpRight, Check, Play, Sparkles, Clock, Award, Users } from "lucide-react";
import type { ServiceEntry } from "@/data/services";
import { services as allServices } from "@/data/services";

import procScript from "@/assets/process-script.jpg";
import procStoryboard from "@/assets/process-storyboard.jpg";
import procAnimatics from "@/assets/process-animatics.jpg";
import proc3D from "@/assets/process-3dmodel.jpg";
import procLighting from "@/assets/process-lighting.jpg";
import procVfx from "@/assets/process-vfx.jpg";
import procDelivery from "@/assets/process-delivery.jpg";

const processImages = [procScript, procStoryboard, procAnimatics, proc3D, procLighting, procVfx, procDelivery];

function ServiceProcess({ service }: { service: ServiceEntry }) {
  const [active, setActive] = useState(0);
  const steps = service.process;
  return (
    <section className="border-y border-parchment bg-card">
      <div className="container-tero py-20 md:py-28">
        <Reveal>
          <p className="overline">— Production process</p>
          <h2 className="mt-4 hero-headline text-[clamp(32px,5vw,56px)] max-w-4xl">
            How we ship <span className="italic">{service.name}.</span>
          </h2>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-12 md:grid-cols-12 md:items-start">
          <div className="md:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-parchment bg-ink">
              <AnimatePresence mode="wait">
                <motion.img
                  key={active}
                  src={processImages[active % processImages.length]}
                  alt={steps[active]?.title ?? "Process"}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </AnimatePresence>
              <div className="absolute inset-x-5 bottom-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-cream/70">
                  — Step {String(active + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}
                </p>
                <p className="mt-2 font-sans-display text-[22px] font-bold text-cream">{steps[active]?.title}</p>
              </div>
            </div>
          </div>

          <div className="md:col-span-7">
            <ol className="divide-y divide-parchment border-y border-parchment">
              {steps.map((s, i) => {
                const isActive = active === i;
                return (
                  <li key={s.title}>
                    <button
                      type="button"
                      onClick={() => setActive(i)}
                      onMouseEnter={() => setActive(i)}
                      className="group w-full text-left py-6 flex items-start gap-6"
                    >
                      <span
                        className={[
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-[12px] font-mono transition-colors",
                          isActive
                            ? "bg-vermillion border-vermillion text-cream"
                            : "border-parchment text-slate group-hover:border-ink/40",
                        ].join(" ")}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="flex-1">
                        <h3 className={["font-sans-display text-[20px] md:text-[26px] font-bold transition-colors", isActive ? "text-ink" : "text-ink/70"].join(" ")}>
                          {s.title}
                        </h3>
                        <div
                          className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-500 ease-out ${
                            isActive ? "grid-rows-[1fr] opacity-100 mt-2" : "grid-rows-[0fr] opacity-0"
                          }`}
                        >
                          <p className="min-h-0 font-body text-[15px] leading-relaxed text-slate">{s.description}</p>
                        </div>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

const whyPartner = [
  { icon: Award, title: "Senior-led craft", body: "Every project run by a senior director — no juniors learning on your brief." },
  { icon: Clock, title: "Ships on time", body: "Locked treatments and weekly reviews keep delivery predictable from kickoff." },
  { icon: Sparkles, title: "Distinctive look", body: "We design the visual language before a single frame — never templated motion." },
  { icon: Users, title: "Global clients", body: "Trusted by 120+ brands across India, the GCC and the UK." },
];

function buildBrief(service: ServiceEntry) {
  const niche = service.name;
  const inds = service.industries.join(", ");
  return {
    intro: `${service.name} is the craft of turning brand intent into screen language. At Tero Studios we approach ${niche} as a senior-led discipline — every project begins with a written treatment, a locked visual direction and a production plan that protects the work all the way to delivery. That's why brands across ${inds} return to us for their most visible ${service.category.toLowerCase()} work.`,
    more: [
      `Our ${niche} pipeline is built around one principle: the idea is the asset. We invest disproportionately in pre-production — story, references, frame design and motion language — so that when production begins, the team is executing a plan, not searching for one.`,
      `Because we keep design, animation, 3D, VFX, sound and finishing under one roof, we move faster than agencies that broker the work across multiple vendors. A single creative director shepherds every ${niche} engagement from kickoff to master.`,
    ],
  };
}

function ExpandableSEO({
  overline,
  title,
  italic,
  intro,
  more,
}: {
  overline: string;
  title: string;
  italic: string;
  intro: string;
  more: string[];
}) {
  const [open, setOpen] = useState(false);
  return (
    <section className="bg-cream text-ink">
      <div className="container-tero py-24 md:py-32">
        <div className="grid grid-cols-1 gap-14 md:grid-cols-12">
          <div className="md:col-span-4">
            <Reveal>
              <p className="overline">— {overline}</p>
              <h2 className="mt-4 hero-headline text-[clamp(32px,5vw,64px)] text-ink">
                {title} <br />
                <span className="italic">{italic}</span>
              </h2>
            </Reveal>
          </div>
          <div className="md:col-span-8">
            <Reveal>
              <p className="font-body text-[17px] leading-[1.7] text-slate">{intro}</p>
              <div
                className={`grid overflow-hidden transition-[grid-template-rows] duration-500 ease-out ${
                  open ? "grid-rows-[1fr] mt-6" : "grid-rows-[0fr]"
                }`}
              >
                <div className="min-h-0 space-y-5">
                  {more.map((p, i) => (
                    <p key={i} className="font-body text-[16px] leading-[1.75] text-slate">
                      {p}
                    </p>
                  ))}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="group mt-8 inline-flex items-center gap-3 font-mono text-[12px] uppercase tracking-[0.2em] text-ink"
              >
                {open ? "Read less" : "Read more"}
                <span className={`text-vermillion text-lg leading-none transition-transform ${open ? "rotate-45" : ""}`}>+</span>
              </button>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ServiceTemplate({ service }: { service: ServiceEntry }) {

  const relatedServices = allServices
    .filter((s) => s.category === service.category && s.slug !== service.slug)
    .slice(0, 4);

  const headlineMain = service.name.split(" ").slice(0, -1).join(" ");
  const headlineTail = service.name.split(" ").slice(-1);

  const brief = buildBrief(service);

  return (
    <PageLayout>
      {/* ── 01 · HERO ────────────────────────────────────────── */}
      <section className="container-tero py-24 md:py-32">
        <Reveal>
          <p className="overline">— {service.category}</p>
        </Reveal>
        <div className="mt-8 grid grid-cols-1 gap-12 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <Reveal>
              <h1 className="hero-headline text-[clamp(44px,7vw,108px)] leading-[0.95]">
                {headlineMain ? (
                  <>
                    {headlineMain} <br />
                    <span className="italic">{headlineTail}.</span>
                  </>
                ) : (
                  <span className="italic">{service.name}.</span>
                )}
              </h1>
              <p className="mt-6 font-mono text-[12px] uppercase tracking-[0.25em] text-vermillion">
                {service.primaryKeyword}
              </p>
              <p className="mt-6 max-w-xl font-body text-[18px] leading-relaxed text-slate">
                {service.hero} {service.short}
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Link
                  to="/contact"
                  className="group inline-flex items-center gap-3 rounded-[4px] bg-ink px-6 py-4 text-[14px] font-medium text-cream transition-colors hover:bg-vermillion"
                >
                  Start a project
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </Link>
                <Link
                  to="/portfolio"
                  className="inline-flex items-center gap-3 rounded-[4px] border border-ink/20 px-6 py-4 text-[14px] font-medium text-ink transition-colors hover:border-ink"
                >
                  See our work
                </Link>
                {service.badge && (
                  <span className="rounded-full border border-vermillion/30 bg-vermillion/5 px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-vermillion">
                    {service.badge}
                  </span>
                )}
              </div>
            </Reveal>
          </div>
          <div className="md:col-span-5">
            <Reveal delay={1}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-parchment bg-ink">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(229,73,42,0.35),transparent_60%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(255,255,255,0.06),transparent_60%)]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-cream/95 text-ink">
                    <Play className="h-6 w-6 fill-current" />
                  </div>
                </div>
                <p className="absolute bottom-5 left-5 font-mono text-[10px] uppercase tracking-[0.25em] text-cream/70">
                  Showreel — {service.category}
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── 02 · CLIENT LOGO STRIP ──────────────────────────── */}
      <LogoStrip />

      {/* ── 03 · SERVICES BRIEF ─────────────────────────────── */}
      <ExpandableSEO
        overline="Services brief"
        title="What good"
        italic={`${service.name} looks like.`}
        intro={brief.intro}
        more={brief.more}
      />

      {/* ── 04 · USPs ───────────────────────────────────────── */}
      <section className="border-y border-parchment bg-card">
        <div className="container-tero py-20 md:py-28">
          <Reveal>
            <p className="overline">— Why partner with us</p>
          <h2 className="mt-4 hero-headline text-[clamp(32px,5vw,64px)] max-w-3xl">
            Why partner with our <span className="italic">{service.name}</span> team?
          </h2>
            <p className="mt-6 max-w-2xl font-body text-[16px] leading-relaxed text-slate">{service.what}</p>
          </Reveal>
          <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
            {whyPartner.map((w, i) => (
              <Reveal key={w.title} delay={i}>
                <div className="h-full rounded-xl border border-parchment bg-cream p-6">
                  <w.icon className="h-6 w-6 text-vermillion" strokeWidth={1.5} />
                  <h3 className="mt-5 font-sans-display text-[18px] font-bold text-ink">{w.title}</h3>
                  <p className="mt-2 font-body text-[14px] leading-relaxed text-slate">{w.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 05 · PORTFOLIO SHOWCASE ─────────────────────────── */}
      <section className="container-tero py-24 md:py-32">
        <Reveal>
          <p className="overline">— Portfolio showcase</p>
          <h2 className="mt-4 hero-headline text-[clamp(32px,5vw,64px)] max-w-3xl">
            Recent <span className="italic">{service.name}</span> work.
          </h2>
          <p className="mt-6 max-w-2xl font-body text-[16px] leading-relaxed text-slate">
            A selection of recent {service.name} projects — shipped for brands across categories.
          </p>
        </Reveal>
        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <Reveal key={i} delay={i}>
              <div className="group relative aspect-[4/5] overflow-hidden rounded-xl border border-parchment bg-ink">
                <div
                  className="absolute inset-0 opacity-90 transition-transform duration-500 group-hover:scale-105"
                  style={{
                    background:
                      i % 2 === 0
                        ? "linear-gradient(135deg, rgba(229,73,42,0.55), rgba(20,20,20,0.95))"
                        : "linear-gradient(135deg, rgba(60,60,80,0.7), rgba(10,10,12,0.95))",
                  }}
                />
                <div className="absolute inset-x-5 bottom-5">
                  <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-cream/60">— Case {String(i + 1).padStart(2, "0")}</p>
                  <p className="mt-2 font-sans-display text-[18px] font-bold text-cream">
                    {service.category} project {i + 1}
                  </p>
                </div>
                <ArrowUpRight className="absolute right-5 top-5 h-5 w-5 text-cream/60 transition-all group-hover:text-cream group-hover:-translate-y-1 group-hover:translate-x-1" />
              </div>
            </Reveal>
          ))}
        </div>
        <div className="mt-10">
          <Link to="/portfolio" className="group inline-flex items-center gap-3 font-mono text-[12px] uppercase tracking-[0.2em] text-ink">
            View full portfolio
            <ArrowUpRight className="h-4 w-4 text-vermillion transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </Link>
        </div>
      </section>

      {/* ── 06 · PRODUCTION PROCESS ─────────────────────────── */}
      <ServiceProcess service={service} />


      {/* ── 07 · INDUSTRIES SERVED ──────────────────────────── */}
      <section className="container-tero py-24 md:py-32">
        <div className="grid grid-cols-1 gap-14 md:grid-cols-12 md:items-start">
          <div className="md:col-span-5">
            <Reveal>
              <p className="overline">— Industries served</p>
              <h2 className="mt-4 hero-headline text-[clamp(32px,4.5vw,56px)]">
                Built for teams who <span className="italic">need it sharp.</span>
              </h2>
              <p className="mt-6 max-w-md font-body text-[16px] leading-relaxed text-slate">
                Where our {service.name} work most often ships.
              </p>
            </Reveal>
          </div>
          <div className="md:col-span-7">
            <Reveal>
              <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {service.industries.map((ind) => (
                  <li key={ind} className="flex items-start gap-3 rounded-xl border border-parchment bg-cream p-5">
                    <Check className="mt-1 h-5 w-5 flex-shrink-0 text-vermillion" strokeWidth={2} />
                    <span className="font-sans-display text-[16px] font-medium text-ink">{ind}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── 08 · TESTIMONIALS ───────────────────────────────── */}
      <Testimonials />

      {/* ── 09 · FAQ ────────────────────────────────────────── */}
      <section className="container-tero py-24 md:py-32">
        <div className="grid grid-cols-1 gap-14 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="overline">— FAQ</p>
            <h2 className="mt-4 hero-headline text-[clamp(32px,4vw,52px)]">
              Got questions? <br />
              <span className="italic">We have answers.</span>
            </h2>
          </div>
          <div className="md:col-span-8 divide-y divide-parchment border-y border-parchment">
            {service.faqs.map((f, i) => (
              <details key={f.q} className="group py-6" open={i === 0}>
                <summary className="flex cursor-pointer items-center justify-between gap-6 font-sans-display text-[18px] font-bold text-ink">
                  {f.q}
                  <span className="text-vermillion transition-transform group-open:rotate-45 text-2xl leading-none">+</span>
                </summary>
                <p className="mt-4 font-body text-[15px] leading-relaxed text-slate">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── 10 · CTA FOOTER ─────────────────────────────────── */}
      <section data-nav-theme="dark" className="bg-ink text-cream">
        <div className="container-tero py-24 md:py-32">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:items-end">
            <div className="md:col-span-8">
              <Reveal>
              <p className="overline text-vermillion">— Start a {service.name} project</p>
                <h2 className="mt-6 hero-headline text-cream text-[clamp(40px,7vw,96px)]">
                  Ready to ship your <br />
                  <span className="italic">{service.name}?</span>
                </h2>
                <p className="mt-8 max-w-xl font-body text-[18px] leading-relaxed text-cream/70">
                  Tell us about the brief — timelines, scope, references. A senior lead will
                  reply within one working day with a clear next step.
                </p>
              </Reveal>
            </div>
            <div className="md:col-span-4">
              <Reveal>
                <div className="flex flex-col gap-4">
                  <Link
                    to="/contact"
                    className="group inline-flex items-center justify-between gap-3 rounded-[4px] bg-vermillion px-6 py-5 text-[14px] font-medium text-cream transition-colors hover:bg-cream hover:text-ink"
                  >
                    Start a project
                    <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </Link>
                  <Link
                    to="/showreel"
                    className="group inline-flex items-center justify-between gap-3 rounded-[4px] border border-cream/20 px-6 py-5 text-[14px] font-medium text-cream transition-colors hover:border-cream"
                  >
                    Watch the showreel
                    <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </Link>
                </div>
              </Reveal>
            </div>
          </div>

          {relatedServices.length > 0 && (
            <div className="mt-20 border-t border-cream/10 pt-12">
              <p className="overline text-cream/60">— Beyond {service.name.toLowerCase()}</p>
              <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                {relatedServices.map((s) => (
                  <Link
                    key={s.slug}
                    to="/services/$slug"
                    params={{ slug: s.slug }}
                    className="group flex items-start justify-between gap-4 rounded-xl border border-cream/10 bg-cream/[0.03] p-5 transition-all hover:border-vermillion/40"
                  >
                    <div>
                      <p className="font-sans-display text-[16px] font-bold text-cream">{s.name}</p>
                      <p className="mt-1 font-body text-[12px] leading-relaxed text-cream/60">{s.short}</p>
                    </div>
                    <ArrowUpRight className="mt-1 h-4 w-4 flex-shrink-0 text-cream/40 transition-all group-hover:text-vermillion group-hover:-translate-y-1 group-hover:translate-x-1" strokeWidth={1.5} />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
}
