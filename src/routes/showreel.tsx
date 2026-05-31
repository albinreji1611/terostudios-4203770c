import { createFileRoute, Link } from "@tanstack/react-router";
import { PageLayout } from "@/components/tero/PageLayout";
import { Reveal } from "@/components/tero/Reveal";
import { Play, ArrowUpRight } from "lucide-react";
import { useState } from "react";

const filters = ["All", "3D", "2D", "Anamorphic", "VFX", "AI", "Brand Films"];

export const Route = createFileRoute("/showreel")({
  component: Showreel,
  head: () => ({
    meta: [
      { title: "Showreel | Tero Studios | India & USA" },
      {
        name: "description",
        content:
          "A full-screen reel of Tero Studios' selected work across animation, CGI and immersive production.",
      },
      { property: "og:title", content: "Showreel — Tero Studios" },
      { property: "og:description", content: "Selected work, on a full screen." },
    ],
  }),
});

function Showreel() {
  const [active, setActive] = useState("All");
  return (
    <PageLayout>
      <section className="container-tero py-24 md:py-36">
        <Reveal>
          <p className="overline">— Showreel 2026</p>
          <h1 className="mt-6 hero-headline text-[clamp(56px,10vw,144px)] max-w-5xl">
            Two minutes <br />
            <span className="italic">that explain us.</span>
          </h1>
        </Reveal>

        <Reveal delay={1}>
          <div className="relative mt-16 aspect-video w-full overflow-hidden rounded-3xl bg-ink">
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-cream">
              <button className="group flex h-24 w-24 items-center justify-center rounded-full border border-cream/30 transition-all hover:border-vermillion hover:bg-vermillion">
                <Play className="h-9 w-9" strokeWidth={1.5} />
              </button>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-cream/60">
                Click to play · 02:14
              </p>
            </div>
          </div>
        </Reveal>

        <div className="mt-12 flex flex-wrap gap-3">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActive(f)}
              className={[
                "rounded-full border px-5 py-2 font-mono text-[11px] uppercase tracking-[0.2em] transition-all",
                active === f
                  ? "border-vermillion bg-vermillion text-cream"
                  : "border-parchment text-ink/60 hover:border-ink",
              ].join(" ")}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="mt-10">
          <Link
            to="/contact"
            className="group inline-flex items-center gap-3 bg-ink px-6 py-4 font-mono text-[12px] font-bold uppercase tracking-[0.2em] text-cream transition-all hover:bg-vermillion"
          >
            Request the full reel
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </Link>
        </div>
      </section>
    </PageLayout>
  );
}
