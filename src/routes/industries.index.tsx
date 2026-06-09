import { createFileRoute, Link } from "@tanstack/react-router";
import { PageLayout } from "@/components/tero/PageLayout";
import { Reveal } from "@/components/tero/Reveal";
import { ArrowUpRight } from "lucide-react";
import { industries } from "@/data/industries";

export const Route = createFileRoute("/industries/")({
  component: IndustriesHub,
  head: () => ({
    meta: [
      { title: "Industries | Tero Studios | India" },
      {
        name: "description",
        content:
          "Animation, CGI and immersive content for real estate, advertising, healthcare, automotive and seven more sectors.",
      },
      { property: "og:title", content: "Industries — Tero Studios" },
      { property: "og:description", content: "Animation and immersive content for nine high-intent sectors." },
    ],
  }),
});

function IndustriesHub() {
  return (
    <PageLayout>
      <section className="container-tero py-24 md:py-40">
        <Reveal>
          <p className="overline">— Industries</p>
          <h1 className="mt-6 hero-headline text-[clamp(56px,10vw,144px)] max-w-5xl">
            Nine sectors. <br />
            <span className="italic">One studio.</span>
          </h1>
          <p className="mt-8 max-w-xl font-body text-[18px] leading-relaxed text-slate">
            Highest-intent work happens where industry meets craft. Pick the
            sector that fits your brief.
          </p>
        </Reveal>
      </section>

      <section className="container-tero pb-24 md:pb-40">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {industries.map((ind, i) => (
            <Reveal key={ind.slug} delay={i % 3}>
              <Link
                to="/industries/$slug"
                params={{ slug: ind.slug }}
                className="group flex h-full flex-col gap-6 rounded-2xl border border-parchment bg-card p-8 transition-all hover:border-vermillion/40 hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)]"
              >
                <div className="flex items-start justify-between">
                  {ind.badge ? (
                    <span className="rounded-full border border-vermillion/30 bg-vermillion/5 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-vermillion">
                      {ind.badge}
                    </span>
                  ) : (
                    <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink/40">
                      — {String(i + 1).padStart(2, "0")}
                    </span>
                  )}
                  <ArrowUpRight className="h-5 w-5 text-ink/40 transition-all group-hover:text-vermillion group-hover:-translate-y-1 group-hover:translate-x-1" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-sans-display text-[22px] font-bold text-ink">{ind.name}</h3>
                  <p className="mt-3 font-body text-[14px] leading-relaxed text-slate">{ind.short}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </PageLayout>
  );
}
