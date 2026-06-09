import { createFileRoute } from "@tanstack/react-router";
import { PageLayout } from "@/components/tero/PageLayout";
import { Reveal } from "@/components/tero/Reveal";
import { Linkedin } from "lucide-react";

const team = [
  { name: "Arvind Subramanian", role: "Founder & Creative Director", li: "#" },
  { name: "Priya Nair", role: "Head of Production", li: "#" },
  { name: "Karthik Iyer", role: "Director — 3D & Look-dev", li: "#" },
  { name: "Meera Raghav", role: "Director — 2D & Motion", li: "#" },
  { name: "Rohan D'Souza", role: "VFX Supervisor", li: "#" },
  { name: "Aisha Khan", role: "Head of Immersive (XR & Anamorphic)", li: "#" },
  { name: "Vivek Rao", role: "Head of Hardware & Pipeline", li: "#" },
  { name: "Sneha Pillai", role: "Executive Producer", li: "#" },
];

export const Route = createFileRoute("/about/team")({
  component: Team,
  head: () => ({
    meta: [
      { title: "Our Team | Tero Studios | India" },
      {
        name: "description",
        content:
          "Meet the founder and leads at Tero Studios — direction, production, VFX, immersive and hardware.",
      },
      { property: "og:title", content: "Team — Tero Studios" },
      { property: "og:description", content: "The senior people who run the work." },
    ],
  }),
});

function Team() {
  return (
    <PageLayout>
      <section className="container-tero py-24 md:py-36">
        <Reveal>
          <p className="overline">— Team</p>
          <h1 className="mt-6 hero-headline text-[clamp(48px,8vw,120px)] max-w-5xl">
            Senior people, <br />
            <span className="italic">every brief.</span>
          </h1>
        </Reveal>
      </section>

      <section className="border-y border-parchment bg-card">
        <div className="container-tero py-20">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {team.map((p, i) => (
              <Reveal key={p.name} delay={i % 4}>
                <div className="rounded-2xl border border-parchment bg-cream p-7">
                  <div className="aspect-square w-full rounded-xl bg-gradient-to-br from-ink/10 to-vermillion/10" />
                  <h3 className="mt-5 font-sans-display text-[18px] font-bold text-ink">{p.name}</h3>
                  <p className="mt-1 font-body text-[13px] text-slate">{p.role}</p>
                  <a
                    href={p.li}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ink/60 hover:text-vermillion"
                  >
                    <Linkedin className="h-3.5 w-3.5" /> LinkedIn
                  </a>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
