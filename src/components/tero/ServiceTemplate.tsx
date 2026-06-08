import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { PageLayout } from "./PageLayout";
import { Reveal } from "./Reveal";
import { LogoStrip } from "./LogoStrip";
import { Process } from "./Process";
import { Testimonials } from "./Testimonials";
import { ArrowUpRight, Check, Play, Sparkles, Clock, Award, Users } from "lucide-react";
import type { ServiceEntry } from "@/data/services";
import { services as allServices } from "@/data/services";
import { industries as allIndustries } from "@/data/industries";

const whyPartner = [
  { icon: Award, title: "Senior-led craft", body: "Every project run by a senior director — no juniors learning on your brief." },
  { icon: Clock, title: "Ships on time", body: "Locked treatments and weekly reviews keep delivery predictable from kickoff." },
  { icon: Sparkles, title: "Distinctive look", body: "We design the visual language before a single frame — never templated motion." },
  { icon: Users, title: "Global clients", body: "Trusted by 120+ brands across India, the GCC, the UK and the US." },
];

function buildSeoOverview(service: ServiceEntry) {
  const niche = service.name.toLowerCase();
  const cat = service.category.toLowerCase();
  const inds = service.industries.join(", ");
  return {
    intro: `${service.name} is the craft of turning brand intent into screen language. At Tero Studios we approach ${niche} as a senior-led discipline — every project begins with a written treatment, a locked visual direction and a production plan that protects the work all the way to delivery. That's why brands across ${inds} return to us for their most visible ${cat} work.`,
    more: [
      `Our ${niche} pipeline is built around one principle: the idea is the asset. We invest disproportionately in pre-production — story, references, frame design and motion language — so that when production begins, the team is executing a plan, not searching for one. The result is work that lands on brief, on time, and almost always sharper than the original ask.`,
      `Because we keep design, animation, 3D, VFX, sound and finishing under one roof, we move faster than agencies that broker the work across multiple vendors. A single creative director shepherds every ${niche} engagement from kickoff to master, and you talk to the people actually making the frames. That continuity is what lets us deliver feature-grade craft on advertising timelines.`,
      `We've shipped ${niche} for fintech launches, automotive reveals, healthcare narratives, retail activations and SaaS go-to-market campaigns. The brief always changes, the standard never does — every frame leaving our studio is colour-accurate, channel-ready, and built to look right on the largest screen it will ever play on.`,
    ],
  };
}

function buildSeoCapabilities(service: ServiceEntry) {
  const niche = service.name.toLowerCase();
  return {
    intro: `When clients hire us for ${niche}, they're buying a stack — not a single deliverable. Behind every film is a full creative and technical pipeline: writing, art direction, look-development, lighting, simulation, compositing, finishing and sound. Each discipline is owned by a senior who has shipped that craft for a decade or more.`,
    more: [
      `Our tooling reflects that depth. We work natively in Houdini, Maya, Cinema 4D, Blender, Unreal Engine, Toon Boom Harmony, After Effects, Nuke, DaVinci Resolve and Pro Tools — chosen per project, not enforced by template. Render is handled across an in-house GPU farm and burst-to-cloud for peak load, so deadlines hold even when the brief expands.`,
      `For ${service.primaryKeyword}, we also offer adjacent services that most studios outsource: scripting, storyboard, voice-over direction, original music composition, sound design and broadcast-spec quality control. That means fewer vendors to coordinate, tighter creative consistency, and a single point of accountability for the final master.`,
      `Every engagement ships with documentation: a brand motion guideline where relevant, source files in editable formats, and two weeks of free polish after delivery. The work is yours, the system around it is yours, and our team stays available if you want to extend the language into the next campaign.`,
    ],
  };
}

function ExpandableSEO({
  overline,
  title,
  italic,
  intro,
  more,
  invert = false,
}: {
  overline: string;
  title: string;
  italic: string;
  intro: string;
  more: string[];
  invert?: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <section className={invert ? "bg-ink text-cream" : "bg-cream text-ink"}>
      <div className="container-tero py-24 md:py-32">
        <div className="grid grid-cols-1 gap-14 md:grid-cols-12">
          <div className="md:col-span-4">
            <Reveal>
              <p className={`overline ${invert ? "text-vermillion" : ""}`}>— {overline}</p>
              <h2 className={`mt-4 hero-headline text-[clamp(32px,5vw,64px)] ${invert ? "text-cream" : "text-ink"}`}>
                {title} <br />
                <span className="italic">{italic}</span>
              </h2>
            </Reveal>
          </div>
          <div className="md:col-span-8">
            <Reveal>
              <p className={`font-body text-[17px] leading-[1.7] ${invert ? "text-cream/80" : "text-slate"}`}>{intro}</p>
              <div
                className={`grid overflow-hidden transition-[grid-template-rows] duration-500 ease-out ${
                  open ? "grid-rows-[1fr] mt-6" : "grid-rows-[0fr]"
                }`}
              >
                <div className="min-h-0 space-y-5">
                  {more.map((p, i) => (
                    <p
                      key={i}
                      className={`font-body text-[16px] leading-[1.75] ${invert ? "text-cream/75" : "text-slate"}`}
                    >
                      {p}
                    </p>
                  ))}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className={`group mt-8 inline-flex items-center gap-3 font-mono text-[12px] uppercase tracking-[0.2em] ${
                  invert ? "text-cream" : "text-ink"
                }`}
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
  const relatedIndustries = allIndustries.filter((i) =>
    service.industries.some((n) => i.name.toLowerCase().includes(n.toLowerCase())),
  );

  const relatedServices = allServices
    .filter((s) => s.category === service.category && s.slug !== service.slug)
    .slice(0, 4);

  const headlineMain = service.name.split(" ").slice(0, -1).join(" ");
  const headlineTail = service.name.split(" ").slice(-1);

  const seoOverview = buildSeoOverview(service);
  const seoCapabilities = buildSeoCapabilities(service);

  return (
    <PageLayout>
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="container-tero py-24 md:py-32">
        <Reveal>
          <p className="overline">— {service.category}</p>
        </Reveal>
        <div className="mt-8 grid grid-cols-1 gap-12 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <Reveal>
              <h1 className="hero-headline text-[clamp(44px,7vw,108px)] leading-[0.95]">
                {headlineMain} <br />
                <span className="italic">{headlineTail}.</span>
              </h1>
              <p className="mt-8 max-w-xl font-body text-[18px] leading-relaxed text-slate">
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

      {/* ── LOGO STRIP (from homepage) ───────────────────────── */}
      <LogoStrip />

      {/* ── WHY PARTNER ──────────────────────────────────────── */}
      <section className="border-y border-parchment bg-card">
        <div className="container-tero py-20 md:py-28">
          <Reveal>
            <p className="overline">— Why partner with us</p>
            <h2 className="mt-4 hero-headline text-[clamp(32px,5vw,64px)] max-w-3xl">
              Why partner with our <span className="italic">{service.name.toLowerCase()}</span> team?
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

      {/* ── SEO #1: Overview with Read more ──────────────────── */}
      <ExpandableSEO
        overline="The craft, in depth"
        title="What good"
        italic={`${service.name.toLowerCase()} looks like.`}
        intro={seoOverview.intro}
        more={seoOverview.more}
      />

      {/* ── OUR WORK ─────────────────────────────────────────── */}
      <section className="container-tero py-24 md:py-32">
        <Reveal>
          <p className="overline">— Our work</p>
          <h2 className="mt-4 hero-headline text-[clamp(32px,5vw,64px)] max-w-3xl">
            High-performance <br />
            <span className="italic">{service.category.toLowerCase()} content.</span>
          </h2>
          <p className="mt-6 max-w-2xl font-body text-[16px] leading-relaxed text-slate">
            A selection of recent {service.name.toLowerCase()} projects — shipped for brands across categories.
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

      {/* ── PROCESS (from homepage) ──────────────────────────── */}
      <Process />

      {/* ── SPECIALIZED SERVICES (accordion of process) ──────── */}
      <section className="border-y border-parchment bg-card">
        <div className="container-tero py-20 md:py-28">
          <Reveal>
            <p className="overline">— Specialized services</p>
            <h2 className="mt-4 hero-headline text-[clamp(32px,5vw,56px)] max-w-4xl">
              Specialized <span className="italic">{service.name.toLowerCase()}</span> capabilities.
            </h2>
          </Reveal>
          <div className="mt-12 divide-y divide-parchment border-y border-parchment">
            {service.process.map((p, i) => (
              <details key={p.title} className="group py-6" open={i === 0}>
                <summary className="flex cursor-pointer items-center justify-between gap-6">
                  <div className="flex items-center gap-6">
                    <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-vermillion">
                      — {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-sans-display text-[20px] md:text-[24px] font-bold text-ink">{p.title}</span>
                  </div>
                  <span className="text-vermillion transition-transform group-open:rotate-45 text-2xl leading-none">+</span>
                </summary>
                <p className="mt-4 max-w-3xl pl-0 md:pl-[88px] font-body text-[15px] leading-relaxed text-slate">{p.description}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── SEO #2: Capabilities with Read more (inverted) ───── */}
      <ExpandableSEO
        invert
        overline="Capabilities stack"
        title="Everything that ships"
        italic="under one roof."
        intro={seoCapabilities.intro}
        more={seoCapabilities.more}
      />

      {/* ── CAPABILITIES + VISUAL ────────────────────────────── */}
      <section className="container-tero py-24 md:py-32">
        <div className="grid grid-cols-1 gap-14 md:grid-cols-12 md:items-center">
          <div className="md:col-span-5">
            <Reveal>
              <div className="relative aspect-square overflow-hidden rounded-2xl border border-parchment bg-ink">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(229,73,42,0.3),transparent_60%)]" />
                <div className="absolute inset-x-10 bottom-10 top-10 rounded-xl border border-cream/15 bg-cream/[0.03]" />
                <p className="absolute left-6 top-6 font-mono text-[10px] uppercase tracking-[0.25em] text-cream/60">
                  — {service.primaryKeyword}
                </p>
              </div>
            </Reveal>
          </div>
          <div className="md:col-span-7">
            <Reveal>
              <p className="overline">— Built for</p>
              <h2 className="mt-4 hero-headline text-[clamp(32px,4.5vw,56px)]">
                Made for teams who <span className="italic">need it sharp.</span>
              </h2>
              <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {service.industries.map((ind) => (
                  <li key={ind} className="flex items-start gap-3">
                    <Check className="mt-1 h-5 w-5 flex-shrink-0 text-vermillion" strokeWidth={2} />
                    <span className="font-sans-display text-[16px] font-medium text-ink">{ind}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS (from homepage) ─────────────────────── */}
      <Testimonials />

      {/* ── FAQ ──────────────────────────────────────────────── */}
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

      {/* ── RELATED / BEYOND ─────────────────────────────────── */}
      {relatedServices.length > 0 && (
        <section className="border-y border-parchment bg-card">
          <div className="container-tero py-20 md:py-28">
            <Reveal>
              <p className="overline">— Beyond {service.name.toLowerCase()}</p>
              <h2 className="mt-4 hero-headline text-[clamp(32px,5vw,56px)] max-w-3xl">
                Comprehensive <span className="italic">{service.category.toLowerCase()}</span> solutions.
              </h2>
            </Reveal>
            <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2">
              {relatedServices.map((s) => (
                <Link
                  key={s.slug}
                  to="/services/$slug"
                  params={{ slug: s.slug }}
                  className="group flex items-start justify-between gap-6 rounded-xl border border-parchment bg-cream p-7 transition-all hover:border-vermillion/40"
                >
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-vermillion">— {s.category}</p>
                    <p className="mt-3 font-sans-display text-[20px] font-bold text-ink">{s.name}</p>
                    <p className="mt-2 font-body text-[14px] leading-relaxed text-slate">{s.short}</p>
                  </div>
                  <ArrowUpRight className="mt-1 h-5 w-5 flex-shrink-0 text-ink/40 transition-all group-hover:text-vermillion group-hover:-translate-y-1 group-hover:translate-x-1" strokeWidth={1.5} />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── RELATED INDUSTRIES ───────────────────────────────── */}
      {relatedIndustries.length > 0 && (
        <section className="container-tero py-20 md:py-24">
          <Reveal>
            <p className="overline">— Industries we serve here</p>
            <h2 className="mt-4 font-sans-display text-[28px] md:text-[40px] font-bold text-ink max-w-3xl">
              Where this service shows up.
            </h2>
          </Reveal>
          <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {relatedIndustries.map((ind) => (
              <Link
                key={ind.slug}
                to="/industries/$slug"
                params={{ slug: ind.slug }}
                className="group flex items-center justify-between rounded-xl border border-parchment bg-card p-6 transition-all hover:border-vermillion/40"
              >
                <div>
                  <p className="font-sans-display text-[18px] font-bold text-ink">{ind.name}</p>
                  <p className="mt-1 font-body text-[13px] text-slate">{ind.short}</p>
                </div>
                <ArrowUpRight className="h-5 w-5 text-ink/40 transition-all group-hover:text-vermillion group-hover:-translate-y-1 group-hover:translate-x-1" strokeWidth={1.5} />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── FINAL CTA ────────────────────────────────────────── */}
      <section className="bg-ink text-cream">
        <div className="container-tero py-24 md:py-32 text-center">
          <Reveal>
            <p className="overline text-vermillion">— Ready when you are</p>
            <h2 className="mt-6 hero-headline text-[clamp(40px,7vw,96px)] text-cream max-w-4xl mx-auto">
              Ready to grow <br />
              <span className="italic">your brand?</span>
            </h2>
            <p className="mt-8 max-w-xl mx-auto font-body text-[16px] leading-relaxed text-cream/70">
              Tell us about your {service.name.toLowerCase()} project. We'll come back within one working day with a senior lead.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/contact"
                className="group inline-flex items-center gap-3 rounded-[4px] bg-vermillion px-7 py-4 text-[14px] font-medium text-cream transition-colors hover:bg-vermillion/90"
              >
                Request a quote
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Link>
              <Link
                to="/portfolio"
                className="inline-flex items-center gap-3 rounded-[4px] border border-cream/30 px-7 py-4 text-[14px] font-medium text-cream transition-colors hover:bg-cream hover:text-ink"
              >
                See more work
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </PageLayout>
  );
}
