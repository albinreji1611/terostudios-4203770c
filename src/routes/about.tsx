import { createFileRoute } from "@tanstack/react-router";
import { PageLayout } from "@/components/tero/PageLayout";
import { Reveal } from "@/components/tero/Reveal";
import studio from "@/assets/about-studio.jpg";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "About — Tero Studios" },
      { name: "description", content: "Tero is an independent animation studio building films and motion design for global brands since 2014." },
    ],
  }),
});

const timeline = [
  { y: "2014", t: "Studio founded", d: "Two animators, one rented room in Adyar, Chennai." },
  { y: "2017", t: "First international client", d: "A Brooklyn-based fintech ships its launch film with us." },
  { y: "2019", t: "Vimeo Staff Pick", d: "Our short film 'Soft Atlas' is featured on the Vimeo homepage." },
  { y: "2022", t: "Studio of ten", d: "We grow into a fully-staffed studio with directors, animators and 3D artists." },
  { y: "2024", t: "Webby honoree", d: "Our work for Northwind earns its first global craft recognition." },
  { y: "2026", t: "Today", d: "Twelve years in, still independent, still curious." },
];

const values = [
  { t: "Craft over volume", d: "We turn down more briefs than we accept. The work is the marketing." },
  { t: "Senior hands on everything", d: "No project leaves the building without a director's eye on every frame." },
  { t: "Honesty over hype", d: "We tell you what something will actually cost, take and look like — upfront." },
  { t: "Curious by default", d: "Side projects, R&D, weekend short films. The studio keeps moving even when work is quiet." },
];

function AboutPage() {
  return (
    <PageLayout>
      <section className="container-tero py-24 md:py-40">
        <Reveal>
          <p className="overline">— Studio statement</p>
          <h1 className="mt-6 hero-headline text-[clamp(56px,10vw,144px)] max-w-5xl">
            We make films <br />
            for brands <br />
            <span className="italic">with something <br />real to say.</span>
          </h1>
        </Reveal>
      </section>

      <section className="border-y border-parchment">
        <div className="relative aspect-[16/9] overflow-hidden md:aspect-[21/9]">
          <img src={studio} alt="Inside the Tero Studios space" loading="lazy" width={1600} height={1024} className="absolute inset-0 h-full w-full object-cover" />
        </div>
      </section>

      <section className="container-tero py-24 md:py-32">
        <div className="grid grid-cols-1 gap-16 md:grid-cols-12">
          <div className="md:col-span-5">
            <Reveal>
              <p className="overline">— Philosophy</p>
              <h2 className="mt-6 hero-headline text-[clamp(40px,6vw,72px)]">
                A small studio with a long memory.
              </h2>
            </Reveal>
          </div>
          <div className="md:col-span-7 space-y-6">
            <Reveal>
              <p className="font-body text-[17px] leading-relaxed text-slate">
                Tero was founded in 2014 by two animators who wanted to make
                fewer, better films. Twelve years later the studio is bigger
                but the rule still holds — we work on a small number of projects
                at any time so every one gets the senior attention it deserves.
              </p>
            </Reveal>
            <Reveal delay={1}>
              <p className="font-body text-[17px] leading-relaxed text-slate">
                We&apos;re not chasing a trend. We&apos;re building a body of
                work — film by film, frame by frame — that we&apos;re proud to
                put our name on a decade from now.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="border-y border-parchment bg-card">
        <div className="container-tero py-24 md:py-32">
          <Reveal>
            <p className="overline">— Timeline</p>
            <h2 className="mt-6 hero-headline text-[clamp(40px,6vw,72px)]">
              A few moments that shaped us.
            </h2>
          </Reveal>
          <ol className="mt-16 space-y-0">
            {timeline.map((m, i) => (
              <Reveal key={i} delay={i % 3}>
                <li className="grid grid-cols-1 gap-4 border-b border-parchment py-8 md:grid-cols-12">
                  <p className="md:col-span-2 font-mono text-[12px] uppercase tracking-[0.2em] text-vermillion">{m.y}</p>
                  <h3 className="md:col-span-4 font-sans-display text-[22px] font-bold text-ink">{m.t}</h3>
                  <p className="md:col-span-6 font-body text-[15px] leading-relaxed text-slate">{m.d}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="container-tero py-24 md:py-32">
        <Reveal>
          <p className="overline">— What we stand for</p>
          <h2 className="mt-6 hero-headline text-[clamp(40px,6vw,72px)] max-w-3xl">
            Four rules we don&apos;t break.
          </h2>
        </Reveal>
        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2">
          {values.map((v, i) => (
            <Reveal key={i} delay={i % 2}>
              <div className="rounded-2xl border border-parchment bg-card p-8">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-vermillion">
                  — Rule {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-4 font-sans-display text-[22px] font-bold text-ink">{v.t}</h3>
                <p className="mt-3 font-body text-[15px] leading-relaxed text-slate">{v.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </PageLayout>
  );
}
