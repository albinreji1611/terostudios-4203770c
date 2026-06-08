import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageLayout } from "@/components/tero/PageLayout";
import { Reveal, RevealGroup, RevealItem } from "@/components/tero/Reveal";
import { StatsSection } from "@/components/tero/StatsSection";
import { KineticBand } from "@/components/tero/KineticBand";
import { Testimonials } from "@/components/tero/Testimonials";
import { FAQ } from "@/components/tero/FAQ";
import { ArrowUpRight, Linkedin, Sparkles, Compass, Zap, Layers, Film, Cpu } from "lucide-react";

export const Route = createFileRoute("/about/")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "About Tero Studios | Independent Animation Studio · Chennai & USA" },
      {
        name: "description",
        content:
          "Tero Studios is an independent animation and motion design studio founded in 2014. Senior people, cinematic craft, on-time delivery — for brands across India, the US and beyond.",
      },
      { property: "og:title", content: "About — Tero Studios" },
      { property: "og:description", content: "Senior people. Cinematic craft. An independent animation studio." },
      { property: "og:url", content: "https://terodemo.bigstoneagency.in/about" },
    ],
    links: [{ rel: "canonical", href: "https://terodemo.bigstoneagency.in/about" }],
  }),
});

const differentiators = [
  {
    icon: Sparkles,
    t: "Treatment-led",
    d: "Every project starts with a written treatment — story locked before a single frame is animated.",
  },
  {
    icon: Compass,
    t: "Principal-led",
    d: "A director or lead is on every call. No juniors fronting client work, ever.",
  },
  {
    icon: Zap,
    t: "On-time, every time",
    d: "Twelve years, zero missed launch deadlines. Production rigor baked into the craft.",
  },
  {
    icon: Layers,
    t: "One roof, full stack",
    d: "Script, design, 3D, 2D, VFX, sound — handed off internally, not across vendors.",
  },
];

const capabilities = [
  {
    k: "Story & Direction",
    d: "Treatments, storyboards and direction that turn briefs into films worth forwarding.",
    items: ["Concept & treatment", "Storyboards", "Voiceover & casting", "Direction"],
  },
  {
    k: "Design & 2D",
    d: "Frame design, illustration and motion design with a point of view.",
    items: ["Frame design", "Illustration systems", "Motion design", "Cel animation"],
  },
  {
    k: "3D & CGI",
    d: "Hero product, character and stylised 3D — built for launch films and brand campaigns.",
    items: ["Product CGI", "Character animation", "Look-dev & lighting", "Houdini FX"],
  },
  {
    k: "Immersive & VFX",
    d: "Anamorphic, projection, XR and live-action VFX for screens that don't sit on a desk.",
    items: ["Anamorphic 3D", "Projection mapping", "AR / WebXR", "Compositing"],
  },
  {
    k: "Hardware & Pipeline",
    d: "An in-house engineering team that builds the rigs, render and tools the studio runs on.",
    items: ["Render farm", "Real-time stage", "Motion capture", "Pipeline tooling"],
  },
];

const team = [
  { name: "Priya Nair", role: "Head of Production" },
  { name: "Karthik Iyer", role: "Director — 3D" },
  { name: "Meera Raghav", role: "Director — 2D" },
  { name: "Rohan D'Souza", role: "VFX Supervisor" },
  { name: "Aisha Khan", role: "Head of Immersive" },
  { name: "Vivek Rao", role: "Pipeline Lead" },
  { name: "Sneha Pillai", role: "EP — USA" },
  { name: "Aravind Menon", role: "Senior Animator" },
];

function AboutPage() {
  const [active, setActive] = useState(0);

  return (
    <PageLayout>
      {/* 1 — Hero */}
      <section className="border-b border-parchment">
        <div className="container-tero grid grid-cols-1 gap-12 py-24 md:grid-cols-12 md:gap-10 md:py-36">
          <div className="md:col-span-8">
            <Reveal>
              <p className="overline">— About Tero</p>
              <h1 className="mt-6 hero-headline text-[clamp(56px,10vw,144px)] leading-[0.95]">
                We are <br />
                <span className="italic text-vermillion">Tero Studios.</span>
              </h1>
              <p className="mt-8 max-w-xl font-body text-[19px] leading-relaxed text-slate">
                An independent animation and motion design studio founded in Chennai in 2014. We
                build cinematic films, motion design systems and immersive work for brands that
                care about how their story moves.
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
                  className="group inline-flex items-center gap-3 rounded-[4px] border border-ink/20 px-6 py-4 text-[14px] font-medium text-ink transition-colors hover:border-vermillion hover:text-vermillion"
                >
                  See the work
                </Link>
              </div>
            </Reveal>
          </div>

          <div className="md:col-span-4">
            <Reveal delay={1}>
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-parchment bg-gradient-to-br from-ink via-ink/95 to-vermillion/40">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.08),transparent_60%)]" />
                <div className="absolute left-5 top-5 font-mono text-[10px] uppercase tracking-[0.3em] text-cream/60">
                  ▸ Reel · 2026
                </div>
                <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-cream/60">Est.</p>
                    <p className="font-sans-display text-[36px] font-bold text-cream leading-none">2014</p>
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-cream/60">
                    Chennai · USA
                  </span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 2 — Creative Powerhouse */}
      <section className="bg-card border-b border-parchment">
        <div className="container-tero grid grid-cols-1 gap-12 py-24 md:grid-cols-12 md:py-32">
          <div className="md:col-span-5">
            <Reveal>
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-gradient-to-br from-ink to-ink/70">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(218,87,55,0.25),transparent_60%)]" />
                <div className="absolute bottom-6 left-6 right-6">
                  <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-cream/60">— Founder</p>
                  <p className="mt-2 font-sans-display text-[22px] font-bold text-cream">Arvind Subramanian</p>
                  <p className="font-body text-[13px] text-cream/60">Creative Director</p>
                </div>
              </div>
            </Reveal>
          </div>
          <div className="md:col-span-7 md:pl-8">
            <Reveal>
              <p className="overline">— A creative powerhouse</p>
              <h2 className="mt-6 hero-headline text-[clamp(40px,6vw,80px)] leading-[1]">
                A studio built on <br />
                <span className="italic">craft, not scale.</span>
              </h2>
              <div className="mt-8 space-y-5 font-body text-[16px] leading-relaxed text-slate max-w-xl">
                <p>
                  Tero began as a two-person room in Adyar with a borrowed Cintiq and one
                  unreasonable belief — that an Indian studio could ship work the world would
                  forward without footnotes.
                </p>
                <p>
                  Twelve years on, we&apos;re a team of forty senior animators, directors,
                  engineers and producers across Chennai and the USA. Still small enough that the
                  founder reviews every frame. Still picky about the briefs we take.
                </p>
              </div>
              <div className="mt-10 grid grid-cols-3 gap-6 border-t border-parchment pt-6">
                {[
                  { k: "12+", v: "Years independent" },
                  { k: "40", v: "Senior team" },
                  { k: "2", v: "Studios" },
                ].map((s) => (
                  <div key={s.v}>
                    <p className="font-sans-display text-[28px] font-bold text-vermillion">{s.k}</p>
                    <p className="font-body text-[12px] uppercase tracking-[0.15em] text-slate">{s.v}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 3 — What Makes Us Different */}
      <section className="container-tero py-24 md:py-32">
        <Reveal>
          <p className="overline">— What makes us different</p>
          <h2 className="mt-6 hero-headline text-[clamp(40px,6vw,80px)] leading-[1] max-w-4xl">
            Four things we refuse <br />
            <span className="italic">to compromise on.</span>
          </h2>
        </Reveal>
        <RevealGroup className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {differentiators.map((d, i) => (
            <RevealItem
              key={d.t}
              className="group relative flex flex-col gap-6 rounded-2xl border border-parchment bg-card p-8 transition-colors hover:border-vermillion/40"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-ink text-cream transition-colors group-hover:bg-vermillion">
                  <d.icon className="h-5 w-5" strokeWidth={1.5} />
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink/40">
                  / 0{i + 1}
                </span>
              </div>
              <div>
                <h3 className="font-sans-display text-[20px] font-bold text-ink">{d.t}</h3>
                <p className="mt-3 font-body text-[14px] leading-relaxed text-slate">{d.d}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* 4 — Stats */}
      <StatsSection />

      {/* 5 — Capabilities (tabbed list + visual) */}
      <section className="border-y border-parchment bg-card">
        <div className="container-tero py-24 md:py-32">
          <Reveal>
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="overline">— Capabilities</p>
                <h2 className="mt-6 hero-headline text-[clamp(36px,5vw,68px)] leading-[1.05] max-w-3xl">
                  Everything we make, <br />
                  <span className="italic">under one roof.</span>
                </h2>
              </div>
              <p className="max-w-sm font-body text-[14px] leading-relaxed text-slate">
                Five practices, one production floor. Briefs move between them without a single
                vendor hand-off.
              </p>
            </div>
          </Reveal>

          <div className="mt-14 grid grid-cols-1 gap-10 md:grid-cols-12">
            {/* Visual */}
            <div className="md:col-span-5">
              <div className="sticky top-28 aspect-[4/5] overflow-hidden rounded-2xl border border-parchment bg-gradient-to-br from-ink via-ink/90 to-vermillion/30">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(255,255,255,0.08),transparent_60%)]" />
                <div className="relative flex h-full flex-col justify-between p-8">
                  <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-cream/60">
                    <Film className="h-3.5 w-3.5" strokeWidth={1.5} />
                    Practice · {String(active + 1).padStart(2, "0")} / 0{capabilities.length}
                  </div>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-cream/50">— Now showing</p>
                    <h3 className="mt-3 font-sans-display text-[36px] md:text-[44px] font-bold text-cream leading-[1]">
                      {capabilities[active].k}
                    </h3>
                    <p className="mt-4 max-w-xs font-body text-[14px] leading-relaxed text-cream/70">
                      {capabilities[active].d}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* List */}
            <div className="md:col-span-7">
              <ul className="divide-y divide-parchment border-y border-parchment">
                {capabilities.map((c, i) => (
                  <li key={c.k}>
                    <button
                      type="button"
                      onMouseEnter={() => setActive(i)}
                      onFocus={() => setActive(i)}
                      onClick={() => setActive(i)}
                      className={`group flex w-full items-center justify-between gap-6 py-7 text-left transition-colors ${
                        active === i ? "text-vermillion" : "text-ink hover:text-vermillion"
                      }`}
                    >
                      <div className="flex items-baseline gap-6">
                        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink/40">
                          0{i + 1}
                        </span>
                        <h3 className="font-sans-display text-[22px] md:text-[28px] font-bold">
                          {c.k}
                        </h3>
                      </div>
                      <div className="hidden md:flex flex-wrap items-center gap-2">
                        {c.items.slice(0, 3).map((it) => (
                          <span
                            key={it}
                            className="rounded-full border border-parchment bg-cream px-3 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-ink/60"
                          >
                            {it}
                          </span>
                        ))}
                      </div>
                      <ArrowUpRight
                        className={`h-5 w-5 shrink-0 transition-transform ${
                          active === i ? "translate-x-1 -translate-y-1" : ""
                        }`}
                        strokeWidth={1.5}
                      />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 6 — Kinetic band (homepage reuse) */}
      <KineticBand />

      {/* 7 — Founder & CEO */}
      <section className="container-tero py-24 md:py-32">
        <Reveal>
          <p className="overline text-center">— Leadership</p>
          <h2 className="mt-6 hero-headline text-center text-[clamp(40px,6vw,80px)] leading-[1]">
            Meet the founder <br />
            <span className="italic">& CEO.</span>
          </h2>
        </Reveal>

        <RevealGroup className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2">
          {[
            {
              name: "Arvind Subramanian",
              role: "Founder & Creative Director",
              bio: "Twenty years across film, motion and design. Started Tero in 2014 after directing brand films for Apple, Nike and Tata.",
            },
            {
              name: "Sneha Pillai",
              role: "CEO & Executive Producer",
              bio: "Built Tero's production engine and US presence. Previously led delivery at one of Mumbai's largest VFX houses.",
            },
          ].map((p) => (
            <RevealItem
              key={p.name}
              className="group flex flex-col overflow-hidden rounded-2xl border border-parchment bg-card transition-colors hover:border-vermillion/40"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-ink via-ink/90 to-vermillion/30">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.08),transparent_60%)]" />
                <div className="absolute left-5 top-5 font-mono text-[10px] uppercase tracking-[0.3em] text-cream/60">
                  Portrait · 2026
                </div>
              </div>
              <div className="p-8">
                <h3 className="font-sans-display text-[24px] font-bold text-ink">{p.name}</h3>
                <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.2em] text-vermillion">
                  {p.role}
                </p>
                <p className="mt-5 font-body text-[15px] leading-relaxed text-slate">{p.bio}</p>
                <a
                  href="#"
                  className="mt-6 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ink/60 hover:text-vermillion"
                >
                  <Linkedin className="h-3.5 w-3.5" /> LinkedIn
                </a>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* 8 — Team of Strategists */}
      <section className="border-y border-parchment bg-card">
        <div className="container-tero py-24 md:py-32">
          <Reveal>
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="overline">— The team</p>
                <h2 className="mt-6 hero-headline text-[clamp(40px,6vw,80px)] leading-[1]">
                  Our team of <br />
                  <span className="italic">strategists.</span>
                </h2>
              </div>
              <Link
                to="/about/team"
                className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-ink hover:text-vermillion"
              >
                Full team
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Link>
            </div>
          </Reveal>

          <RevealGroup className="mt-14 grid grid-cols-2 gap-5 md:grid-cols-4">
            {team.map((p, i) => (
              <RevealItem
                key={p.name}
                className="group flex flex-col overflow-hidden rounded-2xl border border-parchment bg-cream transition-colors hover:border-vermillion/40"
              >
                <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-ink/90 to-vermillion/20">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_30%,rgba(255,255,255,0.1),transparent_60%)]" />
                  <div className="absolute left-3 top-3 font-mono text-[9px] uppercase tracking-[0.25em] text-cream/60">
                    0{i + 1}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-sans-display text-[15px] font-bold text-ink">{p.name}</h3>
                  <p className="mt-1 font-body text-[12px] text-slate">{p.role}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* 9 — Testimonials (homepage reuse) */}
      <Testimonials />

      {/* 10 — FAQ (homepage reuse) */}
      <FAQ />

      {/* 11 — CTA */}
      <section data-nav-theme="dark" className="bg-ink text-cream">
        <div className="container-tero grid grid-cols-1 items-end gap-10 py-24 md:grid-cols-12 md:py-32">
          <div className="md:col-span-8">
            <p className="overline text-vermillion">— Ready when you are</p>
            <h2 className="mt-6 hero-headline text-[clamp(48px,8vw,120px)] text-cream leading-[0.95]">
              Ready to bring your <br />
              <span className="italic">story to life?</span>
            </h2>
          </div>
          <div className="md:col-span-4 flex flex-col gap-5">
            <p className="font-body text-[15px] leading-relaxed text-cream/70 max-w-sm">
              Send a brief, an idea, or a half-formed thought. We&apos;ll come back within 48 hours
              with a realistic plan.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/contact"
                className="group inline-flex items-center gap-3 rounded-[4px] bg-vermillion px-6 py-4 text-[14px] font-medium text-cream transition-colors hover:bg-cream hover:text-ink"
              >
                Start a project
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Link>
              <Link
                to="/showreel"
                className="group inline-flex items-center gap-3 rounded-[4px] border border-cream/30 px-6 py-4 text-[14px] font-medium text-cream transition-colors hover:bg-cream hover:text-ink"
              >
                <Cpu className="h-4 w-4" strokeWidth={1.5} /> Watch showreel
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
