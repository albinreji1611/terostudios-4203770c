import { createFileRoute, Link } from "@tanstack/react-router";
import { PageLayout } from "@/components/tero/PageLayout";
import { Reveal } from "@/components/tero/Reveal";
import { ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/about/")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "About | Tero Studios | India & USA" },
      {
        name: "description",
        content:
          "Tero Studios is an independent animation and motion design studio in Chennai with a presence in the USA, building cinematic films for global brands since 2014.",
      },
      { property: "og:title", content: "About — Tero Studios" },
      { property: "og:description", content: "An independent animation studio, made of senior people." },
    ],
  }),
});

const milestones = [
  { y: "2014", t: "Tero opens its first studio in Adyar, Chennai." },
  { y: "2017", t: "First international launch film for an automotive client." },
  { y: "2020", t: "Real-time and Unreal pipeline integrated into the studio." },
  { y: "2022", t: "Anamorphic and projection-mapping division launched." },
  { y: "2024", t: "USA office opens; team grows past forty senior leads." },
  { y: "2026", t: "Hardware-for-animation practice formalised." },
];

const values = [
  { t: "Senior people, every brief", d: "No juniors fronting client work, ever." },
  { t: "Treatment before pixels", d: "Writing locks the story before a frame is animated." },
  { t: "On-time, every time", d: "Twelve years and no missed launch deadlines." },
];

function AboutPage() {
  return (
    <PageLayout>
      <section className="container-tero py-24 md:py-40">
        <Reveal>
          <p className="overline">— About</p>
          <h1 className="mt-6 hero-headline text-[clamp(56px,10vw,144px)] max-w-5xl">
            An independent <br />
            <span className="italic">animation studio.</span>
          </h1>
          <p className="mt-8 max-w-2xl font-body text-[19px] leading-relaxed text-slate">
            Founded in Chennai in 2014, Tero Studios is a senior team of
            directors, animators, designers and engineers building cinematic
            films and immersive experiences for global brands. We now run two
            studios — Adyar, Chennai and a satellite office in the USA — and
            are deliberately small enough that every brief is led by a
            principal.
          </p>
        </Reveal>
      </section>

      <section className="border-y border-parchment bg-card">
        <div className="container-tero grid grid-cols-1 gap-10 py-20 md:grid-cols-3 md:py-28">
          {values.map((v, i) => (
            <Reveal key={v.t} delay={i}>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-vermillion">
                — Value {String(i + 1).padStart(2, "0")}
              </p>
              <h2 className="mt-4 font-sans-display text-[24px] font-bold text-ink">{v.t}</h2>
              <p className="mt-3 font-body text-[15px] leading-relaxed text-slate max-w-sm">{v.d}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container-tero py-24 md:py-32">
        <Reveal>
          <p className="overline">— Timeline</p>
          <h2 className="mt-4 font-sans-display text-[40px] md:text-[56px] font-bold text-ink max-w-3xl">
            Twelve years, in brief.
          </h2>
        </Reveal>
        <div className="mt-12 divide-y divide-parchment border-y border-parchment">
          {milestones.map((m, i) => (
            <Reveal key={m.y} delay={i % 3}>
              <div className="grid grid-cols-12 gap-6 py-6">
                <p className="col-span-3 font-sans-display text-[28px] font-bold text-vermillion">{m.y}</p>
                <p className="col-span-9 font-body text-[17px] text-ink/80">{m.t}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-y border-parchment bg-card">
        <div className="container-tero grid grid-cols-1 gap-6 py-16 md:grid-cols-3">
          {[
            { to: "/about/studio", t: "Our Studio", d: "Hardware, tech stack, facility." },
            { to: "/about/team", t: "Our Team", d: "Founder and leads." },
            { to: "/clients", t: "Our Clients", d: "Logos and proof points." },
          ].map((c) => (
            <Link
              key={c.to}
              to={c.to}
              className="group flex items-start justify-between gap-6 rounded-2xl border border-parchment bg-cream p-8 transition-all hover:border-vermillion/40"
            >
              <div>
                <h3 className="font-sans-display text-[22px] font-bold text-ink">{c.t}</h3>
                <p className="mt-2 font-body text-[14px] text-slate">{c.d}</p>
              </div>
              <ArrowUpRight className="h-5 w-5 text-ink/40 transition-all group-hover:text-vermillion group-hover:-translate-y-1 group-hover:translate-x-1" strokeWidth={1.5} />
            </Link>
          ))}
        </div>
      </section>
    </PageLayout>
  );
}
