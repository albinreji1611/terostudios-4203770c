import { Link } from "@tanstack/react-router";
import { PageLayout } from "./PageLayout";
import { Reveal } from "./Reveal";
import { ArrowUpRight, Check } from "lucide-react";
import type { ServiceEntry } from "@/data/services";
import { industries as allIndustries } from "@/data/industries";

export function ServiceTemplate({ service }: { service: ServiceEntry }) {
  const relatedIndustries = allIndustries.filter((i) =>
    service.industries.some((n) =>
      i.name.toLowerCase().includes(n.toLowerCase()),
    ),
  );

  return (
    <PageLayout>
      <section className="container-tero py-24 md:py-36">
        <Reveal>
          <p className="overline">— {service.category}</p>
          <h1 className="mt-6 hero-headline text-[clamp(48px,8vw,120px)] max-w-5xl">
            {service.name.split(" ").slice(0, -1).join(" ")} <br />
            <span className="italic">
              {service.name.split(" ").slice(-1)}.
            </span>
          </h1>
          <p className="mt-8 max-w-2xl font-body text-[19px] leading-relaxed text-slate">
            {service.hero}
          </p>
          {service.badge && (
            <span className="mt-6 inline-block rounded-full border border-vermillion/30 bg-vermillion/5 px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-vermillion">
              {service.badge}
            </span>
          )}
        </Reveal>
      </section>

      <section className="border-y border-parchment bg-card">
        <div className="container-tero grid grid-cols-1 gap-12 py-20 md:grid-cols-12 md:py-28">
          <div className="md:col-span-5">
            <p className="overline">— What we do</p>
            <h2 className="mt-4 font-sans-display text-[32px] font-bold text-ink">
              The discipline, end to end.
            </h2>
          </div>
          <p className="md:col-span-7 font-body text-[18px] leading-relaxed text-slate">
            {service.what}
          </p>
        </div>
      </section>

      <section className="container-tero py-24 md:py-32">
        <Reveal>
          <p className="overline">— Our process</p>
          <h2 className="mt-4 font-sans-display text-[40px] md:text-[56px] font-bold text-ink max-w-3xl">
            A senior-led process that ships on time.
          </h2>
        </Reveal>
        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {service.process.map((p, i) => (
            <Reveal key={p.title} delay={i}>
              <div className="h-full rounded-2xl border border-parchment bg-card p-7">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-vermillion">
                  — {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-4 font-sans-display text-[20px] font-bold text-ink">
                  {p.title}
                </h3>
                <p className="mt-3 font-body text-[14px] leading-relaxed text-slate">
                  {p.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {relatedIndustries.length > 0 && (
        <section className="border-y border-parchment bg-card">
          <div className="container-tero py-20 md:py-28">
            <p className="overline">— Industries we serve here</p>
            <h2 className="mt-4 font-sans-display text-[32px] md:text-[44px] font-bold text-ink max-w-3xl">
              Where this service shows up.
            </h2>
            <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {relatedIndustries.map((ind) => (
                <Link
                  key={ind.slug}
                  to="/industries/$slug"
                  params={{ slug: ind.slug }}
                  className="group flex items-center justify-between rounded-xl border border-parchment bg-cream p-6 transition-all hover:border-vermillion/40"
                >
                  <div>
                    <p className="font-sans-display text-[18px] font-bold text-ink">{ind.name}</p>
                    <p className="mt-1 font-body text-[13px] text-slate">{ind.short}</p>
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-ink/40 transition-all group-hover:text-vermillion group-hover:-translate-y-1 group-hover:translate-x-1" strokeWidth={1.5} />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="container-tero py-24 md:py-32">
        <div className="grid grid-cols-1 gap-14 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="overline">— FAQ</p>
            <h2 className="mt-4 font-sans-display text-[32px] md:text-[44px] font-bold text-ink">
              Common questions.
            </h2>
          </div>
          <div className="md:col-span-8 divide-y divide-parchment border-y border-parchment">
            {service.faqs.map((f) => (
              <details key={f.q} className="group py-6">
                <summary className="flex cursor-pointer items-center justify-between gap-6 font-sans-display text-[18px] font-bold text-ink">
                  {f.q}
                  <span className="text-vermillion transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-4 font-body text-[15px] leading-relaxed text-slate">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ink text-cream">
        <div className="container-tero grid grid-cols-1 gap-10 py-20 md:grid-cols-12 md:py-28">
          <div className="md:col-span-8">
            <p className="overline text-vermillion">— Ready when you are</p>
            <h2 className="mt-4 hero-headline text-[clamp(36px,6vw,72px)] text-cream">
              Brief us on your {service.name.toLowerCase()} project.
            </h2>
          </div>
          <div className="md:col-span-4 flex items-end">
            <Link
              to="/contact"
              className="group inline-flex items-center justify-between gap-4 rounded-[4px] border border-cream/30 px-6 py-5 text-[15px] font-medium text-cream transition-colors hover:bg-cream hover:text-ink w-full"
            >
              Request a quote
              <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
