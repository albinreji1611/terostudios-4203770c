import { createFileRoute, Link } from "@tanstack/react-router";
import { PageLayout } from "@/components/tero/PageLayout";
import { Reveal } from "@/components/tero/Reveal";
import { ArrowUpRight, MapPin } from "lucide-react";

const roles = [
  { title: "Senior 3D Animator", location: "Chennai · On-site", type: "Full-time" },
  { title: "VFX Compositor (Nuke)", location: "Chennai · On-site", type: "Full-time" },
  { title: "Motion Designer", location: "Remote · India", type: "Full-time" },
  { title: "Producer — Brand Films", location: "Chennai · Hybrid", type: "Full-time" },
  { title: "Real-Time / Unreal Artist", location: "Chennai · On-site", type: "Full-time" },
  { title: "Internship · Animation (2026 cohort)", location: "Chennai · On-site", type: "6 months" },
];

export const Route = createFileRoute("/careers")({
  component: Careers,
  head: () => ({
    meta: [
      { title: "Careers | Tero Studios | India" },
      {
        name: "description",
        content: "Open roles, studio culture and the 2026 internship at Tero Studios in Chennai.",
      },
      { property: "og:title", content: "Careers — Tero Studios" },
      { property: "og:description", content: "Open roles and studio culture." },
    ],
  }),
});

function Careers() {
  return (
    <PageLayout>
      <section className="container-tero py-24 md:py-40">
        <Reveal>
          <p className="overline">— Careers</p>
          <h1 className="mt-6 hero-headline text-[clamp(56px,10vw,144px)] max-w-5xl">
            Make work <br />
            <span className="italic">that earns its screen.</span>
          </h1>
          <p className="mt-8 max-w-xl font-body text-[18px] leading-relaxed text-slate">
            We hire slowly, pay fairly and protect the craft. If that fits,
            we&apos;d love to meet.
          </p>
        </Reveal>
      </section>

      <section className="border-y border-parchment bg-card">
        <div className="container-tero py-16 md:py-24">
          <p className="overline">— Open roles</p>
          <div className="mt-8 divide-y divide-parchment border-y border-parchment">
            {roles.map((r) => (
              <Link
                key={r.title}
                to="/contact"
                className="group flex flex-col gap-4 py-7 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <h3 className="font-sans-display text-[22px] font-bold text-ink group-hover:text-vermillion">
                    {r.title}
                  </h3>
                  <div className="mt-2 flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.2em] text-slate">
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" /> {r.location}
                    </span>
                    <span>{r.type}</span>
                  </div>
                </div>
                <ArrowUpRight className="h-5 w-5 text-ink/40 transition-all group-hover:text-vermillion group-hover:-translate-y-1 group-hover:translate-x-1" strokeWidth={1.5} />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
