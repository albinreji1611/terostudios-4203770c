import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { PageLayout } from "@/components/tero/PageLayout";
import { Reveal } from "@/components/tero/Reveal";
import p1 from "@/assets/portfolio-1.jpg";
import p2 from "@/assets/portfolio-2.jpg";
import p3 from "@/assets/portfolio-3.jpg";
import p4 from "@/assets/portfolio-4.jpg";
import p5 from "@/assets/portfolio-5.jpg";
import p6 from "@/assets/portfolio-6.jpg";

export const Route = createFileRoute("/portfolio")({
  component: PortfolioPage,
  head: () => ({
    meta: [
      { title: "Portfolio — Tero Studios" },
      { name: "description", content: "Selected animation, motion and VFX projects from Tero Studios." },
    ],
  }),
});

type P = { img: string; client: string; title: string; service: string; industry: string };

const projects: P[] = [
  { img: p1, client: "GlassWorks", title: "Refraction", service: "3D Animation", industry: "Design" },
  { img: p2, client: "Kinetic Type Co.", title: "Editorial Set", service: "Motion Graphics", industry: "Publishing" },
  { img: p3, client: "Toy Atelier", title: "Mr. Sprout", service: "Character", industry: "Consumer" },
  { img: p4, client: "Finlytics", title: "Onboarding Reel", service: "Explainer", industry: "Fintech" },
  { img: p5, client: "Mirage Films", title: "Ember", service: "VFX", industry: "Entertainment" },
  { img: p6, client: "Auraware", title: "Quiet Vessels", service: "Product 3D", industry: "Lifestyle" },
  { img: p2, client: "Northwind", title: "Frequency", service: "Motion Graphics", industry: "Tech" },
  { img: p1, client: "Lumen Labs", title: "Refract II", service: "3D Animation", industry: "Tech" },
  { img: p4, client: "Routey", title: "First Mile", service: "Explainer", industry: "Logistics" },
];

const services = ["All", "3D Animation", "Motion Graphics", "Character", "Explainer", "VFX", "Product 3D"];
const industries = ["All", "Design", "Publishing", "Consumer", "Fintech", "Entertainment", "Lifestyle", "Tech", "Logistics"];

function PortfolioPage() {
  const [svc, setSvc] = useState("All");
  const [ind, setInd] = useState("All");

  const filtered = useMemo(
    () => projects.filter((p) => (svc === "All" || p.service === svc) && (ind === "All" || p.industry === ind)),
    [svc, ind]
  );

  return (
    <PageLayout>
      <section className="container-tero pt-24 pb-16 md:pt-40 md:pb-20">
        <Reveal>
          <p className="overline">— Portfolio</p>
          <h1 className="mt-6 hero-headline text-[clamp(56px,10vw,144px)] max-w-5xl">
            Films, frames, <br />
            <span className="italic">favourites.</span>
          </h1>
        </Reveal>

        <div className="mt-16 flex flex-col gap-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate mr-2">Service —</span>
            {services.map((s) => (
              <button
                key={s}
                onClick={() => setSvc(s)}
                className={[
                  "rounded-full border px-4 py-1.5 font-body text-[13px] font-medium transition-all",
                  svc === s
                    ? "bg-ink border-ink text-cream"
                    : "bg-muted border-parchment text-slate hover:border-ink/30",
                ].join(" ")}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate mr-2">Industry —</span>
            {industries.map((s) => (
              <button
                key={s}
                onClick={() => setInd(s)}
                className={[
                  "rounded-full border px-4 py-1.5 font-body text-[13px] font-medium transition-all",
                  ind === s
                    ? "bg-ink border-ink text-cream"
                    : "bg-muted border-parchment text-slate hover:border-ink/30",
                ].join(" ")}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="container-tero pb-32">
        <motion.div layout className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p, i) => (
            <motion.a
              key={p.title + i}
              layout
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.05 }}
              href="#"
              className="group block overflow-hidden rounded-2xl border border-parchment bg-card transition-all hover:border-vermillion/40 hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)]"
            >
              <div className="relative aspect-[5/4] overflow-hidden">
                <img
                  src={p.img}
                  alt={p.title}
                  loading="lazy"
                  width={1280}
                  height={800}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-vermillion">
                  <span>{p.service}</span><span className="text-ink/20">·</span><span className="text-slate">{p.industry}</span>
                </div>
                <h3 className="mt-3 font-display text-[28px] leading-tight text-ink">{p.title}</h3>
                <p className="mt-1 font-body text-[13px] text-slate">{p.client}</p>
              </div>
            </motion.a>
          ))}
        </motion.div>
        {filtered.length === 0 && (
          <p className="py-20 text-center font-body text-slate">No projects match yet — try a different combination.</p>
        )}
      </section>
    </PageLayout>
  );
}
