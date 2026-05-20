import { createFileRoute } from "@tanstack/react-router";
import { PageLayout } from "@/components/tero/PageLayout";
import { Reveal } from "@/components/tero/Reveal";
import { ArrowUpRight } from "lucide-react";
import p1 from "@/assets/portfolio-1.jpg";
import p2 from "@/assets/portfolio-2.jpg";
import p3 from "@/assets/portfolio-3.jpg";
import p4 from "@/assets/portfolio-4.jpg";
import p5 from "@/assets/portfolio-5.jpg";
import p6 from "@/assets/portfolio-6.jpg";

export const Route = createFileRoute("/blog")({
  component: BlogPage,
  head: () => ({
    meta: [
      { title: "Journal — Tero Studios" },
      { name: "description", content: "Essays, behind-the-scenes notes and craft writing from Tero Studios." },
    ],
  }),
});

const featured = {
  img: p1,
  cat: "Studio Notes",
  date: "May 12, 2026",
  title: "Why we still storyboard on paper before every project.",
  read: "8 min read",
};

const posts = [
  { img: p2, cat: "Craft", date: "Apr 30 · 6 min", title: "Designing motion systems that survive the brand handoff." },
  { img: p3, cat: "Direction", date: "Apr 18 · 5 min", title: "How we approach character performance in 12 frames or less." },
  { img: p4, cat: "Process", date: "Apr 02 · 9 min", title: "A practical workflow for client reviews on Frame.io." },
  { img: p5, cat: "Craft", date: "Mar 21 · 4 min", title: "Three rules for shooting plates that actually composite." },
  { img: p6, cat: "Studio Notes", date: "Mar 09 · 7 min", title: "What twelve years of small studio life has taught us." },
  { img: p1, cat: "Direction", date: "Feb 25 · 6 min", title: "Writing treatments clients actually want to read." },
];

function BlogPage() {
  return (
    <PageLayout>
      <section className="container-tero pt-24 md:pt-40 pb-12">
        <Reveal>
          <p className="overline">— Journal</p>
          <h1 className="mt-6 hero-headline text-[clamp(56px,10vw,144px)] max-w-5xl">
            Notes from <br />
            <span className="italic">the studio.</span>
          </h1>
        </Reveal>
      </section>

      <section className="container-tero pb-24">
        <Reveal>
          <a href="#" className="group grid grid-cols-1 gap-10 rounded-2xl border border-parchment bg-card p-6 md:grid-cols-12 md:p-10 transition-all hover:border-vermillion/40">
            <div className="md:col-span-7 relative aspect-[16/10] overflow-hidden rounded-xl">
              <img src={featured.img} alt={featured.title} loading="lazy" width={1280} height={800} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
            <div className="md:col-span-5 flex flex-col justify-center gap-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-vermillion">— Featured · {featured.cat}</p>
              <h2 className="font-display text-[clamp(32px,4vw,56px)] leading-tight text-ink">{featured.title}</h2>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate">{featured.date} · {featured.read}</p>
              <span className="link-underline mt-4 text-ink">Read essay <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} /></span>
            </div>
          </a>
        </Reveal>
      </section>

      <section className="container-tero pb-32">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((p, i) => (
            <Reveal key={i} delay={i % 3}>
              <a href="#" className="group block">
                <div className="aspect-[4/3] overflow-hidden rounded-2xl border border-parchment bg-card">
                  <img src={p.img} alt={p.title} loading="lazy" width={1280} height={800} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.2em] text-vermillion">{p.cat}</p>
                <h3 className="mt-2 font-sans-display text-[20px] font-bold text-ink leading-snug">{p.title}</h3>
                <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-slate">{p.date}</p>
              </a>
            </Reveal>
          ))}
        </div>
      </section>
    </PageLayout>
  );
}
