import { createFileRoute, Link } from "@tanstack/react-router";
import { PageLayout } from "@/components/tero/PageLayout";
import { Reveal } from "@/components/tero/Reveal";
import { ArrowUpRight } from "lucide-react";

const studies = [
  {
    client: "Campa Cola",
    title: "Reviving a national icon with CGI cinema",
    sector: "Advertising",
    metric: "+312% recall lift",
  },
  {
    client: "Sanofi",
    title: "Mechanism of action film for cardiology launch",
    sector: "Healthcare",
    metric: "8 markets, 11 languages",
  },
  {
    client: "Clayworks",
    title: "Pre-launch property visualisation across two cities",
    sector: "Real Estate",
    metric: "62% off-plan sales",
  },
  {
    client: "Ford",
    title: "Launch reveal under embargo from CAD-only files",
    sector: "Automotive",
    metric: "Global day-one master",
  },
  {
    client: "Lulu Mall",
    title: "Projection-mapped festive takeover",
    sector: "Events",
    metric: "3-week install · 41 nights live",
  },
  {
    client: "Bang & Olufsen",
    title: "Anamorphic launch loop for flagship store",
    sector: "Retail",
    metric: "Pixel-mapped to LED corner",
  },
];

export const Route = createFileRoute("/case-studies")({
  component: CaseStudies,
  head: () => ({
    meta: [
      { title: "Case Studies | Tero Studios | India & USA" },
      {
        name: "description",
        content:
          "Deep-dive case studies on Tero Studios' work for Campa Cola, Sanofi, Ford, Clayworks and more.",
      },
      { property: "og:title", content: "Case Studies — Tero Studios" },
      { property: "og:description", content: "How the work was made, and what it moved." },
    ],
  }),
});

function CaseStudies() {
  return (
    <PageLayout>
      <section className="container-tero py-24 md:py-40">
        <Reveal>
          <p className="overline">— Case studies</p>
          <h1 className="mt-6 hero-headline text-[clamp(56px,10vw,144px)] max-w-5xl">
            How the work <br />
            <span className="italic">actually got made.</span>
          </h1>
          <p className="mt-8 max-w-xl font-body text-[18px] leading-relaxed text-slate">
            Selected projects, with the brief, the constraints and the
            outcome on the table.
          </p>
        </Reveal>
      </section>

      <section className="container-tero pb-24 md:pb-40">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {studies.map((c, i) => (
            <Reveal key={c.title} delay={i % 2}>
              <Link
                to="/contact"
                className="group flex h-full flex-col justify-between gap-12 rounded-2xl border border-parchment bg-card p-10 transition-all hover:border-vermillion/40 hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)]"
              >
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-vermillion">
                    — {c.sector}
                  </p>
                  <h3 className="mt-5 font-sans-display text-[28px] font-bold text-ink leading-tight">
                    {c.title}
                  </h3>
                  <p className="mt-3 font-body text-[14px] text-slate">{c.client}</p>
                </div>
                <div className="flex items-end justify-between">
                  <p className="font-sans-display text-[18px] font-bold text-ink/70">{c.metric}</p>
                  <ArrowUpRight className="h-5 w-5 text-ink/40 transition-all group-hover:text-vermillion group-hover:-translate-y-1 group-hover:translate-x-1" strokeWidth={1.5} />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </PageLayout>
  );
}
