import { createFileRoute, Link } from "@tanstack/react-router";
import { PageLayout } from "@/components/tero/PageLayout";
import { Reveal } from "@/components/tero/Reveal";
import { ArrowUpRight } from "lucide-react";
import { servicesByCategory } from "@/data/services";

export const Route = createFileRoute("/services/")({
  component: ServicesHub,
  head: () => ({
    meta: [
      { title: "Services | Tero Studios | India & USA" },
      {
        name: "description",
        content:
          "Five practices spanning content & visual storytelling, real estate & spatial experiences, immersive learning, brand & event experiences and immersive hardware.",
      },
      { property: "og:title", content: "Services — Tero Studios" },
      { property: "og:description", content: "Five practices. One studio." },
    ],
  }),
});

function ServicesHub() {
  const grouped = servicesByCategory();
  return (
    <PageLayout>
      <section className="container-tero py-24 md:py-40">
        <Reveal>
          <p className="overline">— Services</p>
          <h1 className="mt-6 hero-headline text-[clamp(56px,10vw,144px)] max-w-5xl">
            Five practices. <br />
            <span className="italic">One studio.</span>
          </h1>
          <p className="mt-8 max-w-xl font-body text-[18px] leading-relaxed text-slate">
            From content and visual storytelling to immersive hardware — every
            discipline Tero Studios ships, organised under one editorial roof.
          </p>
        </Reveal>
      </section>

      {Object.entries(grouped).map(([category, list], idx) => (
        <section
          key={category}
          className={idx % 2 === 0 ? "border-y border-parchment bg-card" : ""}
        >
          <div className="container-tero py-20 md:py-28">
            <Reveal>
              <p className="overline">— {String(idx + 1).padStart(2, "0")} · Discipline</p>
              <h2 className="mt-4 font-sans-display text-[36px] md:text-[52px] font-bold text-ink">
                {category}
              </h2>
            </Reveal>
            <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {list.map((s, i) => (
                <Reveal key={s.slug} delay={i % 3}>
                  <Link
                    to="/services/$slug"
                    params={{ slug: s.slug }}
                    className="group flex h-full flex-col gap-6 rounded-2xl border border-parchment bg-cream p-8 transition-all hover:border-vermillion/40 hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)]"
                  >
                    <div className="flex items-start justify-between">
                      {s.badge ? (
                        <span className="rounded-full border border-vermillion/30 bg-vermillion/5 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-vermillion">
                          {s.badge}
                        </span>
                      ) : (
                        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink/40">
                          — {String(i + 1).padStart(2, "0")}
                        </span>
                      )}
                      <ArrowUpRight className="h-5 w-5 text-ink/40 transition-all group-hover:text-vermillion group-hover:-translate-y-1 group-hover:translate-x-1" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h3 className="font-sans-display text-[22px] font-bold text-ink">{s.name}</h3>
                      <p className="mt-3 font-body text-[14px] leading-relaxed text-slate">{s.short}</p>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ))}
    </PageLayout>
  );
}
