import { createFileRoute, Link } from "@tanstack/react-router";
import { PageLayout } from "@/components/tero/PageLayout";
import { Reveal } from "@/components/tero/Reveal";
import { ArrowUpRight, Box, Film, Pencil, Sparkles, Type, Video } from "lucide-react";

export const Route = createFileRoute("/services")({
  component: ServicesPage,
  head: () => ({
    meta: [
      { title: "Services — Tero Studios" },
      { name: "description", content: "Animation, motion design, 3D, VFX, explainer and brand films from Tero Studios." },
    ],
  }),
});

const pillars = [
  { t: "Senior leads only", d: "Every project is run by a director with at least eight years of studio experience. No handoffs to juniors." },
  { t: "Editorial-first thinking", d: "We start every brief with a written treatment. The story is locked before a frame is animated." },
  { t: "On-time, every time", d: "Twelve years and not a single missed launch deadline. We mean it when we commit to a date." },
];

const services = [
  { Icon: Box, name: "3D Animation", d: "Photoreal product, character and environment animation rendered at film quality." },
  { Icon: Type, name: "2D Motion Graphics", d: "Editorial typography, transitions and brand systems with rhythm and restraint." },
  { Icon: Pencil, name: "Character Animation", d: "Stylised characters with performance — rigged, animated and finished in-house." },
  { Icon: Film, name: "Explainer & Product Films", d: "Software stories told with clarity. One-watch films that move pipelines." },
  { Icon: Sparkles, name: "Visual Effects", d: "Live-action compositing, simulations and finishing for ads and short films." },
  { Icon: Video, name: "Brand Films & Reels", d: "Anthemic launch films, founder narratives and sizzle reels with cinematic craft." },
];

function ServicesPage() {
  return (
    <PageLayout>
      <section className="container-tero py-24 md:py-40">
        <Reveal>
          <p className="overline">— Services</p>
          <h1 className="mt-6 hero-headline text-[clamp(56px,10vw,144px)] max-w-5xl">
            Six disciplines. <br />
            <span className="italic">One studio.</span>
          </h1>
          <p className="mt-8 max-w-xl font-body text-[18px] leading-relaxed text-slate">
            We don&apos;t offer everything. We offer what we&apos;re great at —
            and we&apos;re honest when something is outside our lane.
          </p>
        </Reveal>
      </section>

      <section className="border-y border-parchment bg-card">
        <div className="container-tero grid grid-cols-1 gap-10 py-20 md:grid-cols-3 md:py-28">
          {pillars.map((p, i) => (
            <Reveal key={i} delay={i}>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-vermillion">
                — Pillar {String(i + 1).padStart(2, "0")}
              </p>
              <h2 className="mt-4 font-sans-display text-[24px] font-bold text-ink">{p.t}</h2>
              <p className="mt-3 font-body text-[15px] leading-relaxed text-slate max-w-sm">{p.d}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container-tero py-24 md:py-40">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <Reveal key={i} delay={i % 3}>
              <Link
                to="/contact"
                className="group flex h-full flex-col gap-6 rounded-2xl border border-parchment bg-card p-8 transition-all hover:border-vermillion/40 hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)]"
              >
                <div className="flex items-start justify-between">
                  <s.Icon className="h-7 w-7 text-ink" strokeWidth={1.5} />
                  <ArrowUpRight className="h-5 w-5 text-ink/40 transition-all group-hover:text-vermillion group-hover:-translate-y-1 group-hover:translate-x-1" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-sans-display text-[22px] font-bold text-ink">{s.name}</h3>
                  <p className="mt-3 font-body text-[14px] leading-relaxed text-slate">{s.d}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </PageLayout>
  );
}
