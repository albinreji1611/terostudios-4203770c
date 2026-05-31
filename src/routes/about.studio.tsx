import { createFileRoute } from "@tanstack/react-router";
import { PageLayout } from "@/components/tero/PageLayout";
import { Reveal } from "@/components/tero/Reveal";

const hardware = [
  { t: "Workstation floor", d: "32 senior workstations on Threadripper PRO and RTX 6000 Ada." },
  { t: "Render farm", d: "On-premise farm of 240 cores, hybrid burst to cloud for peak loads." },
  { t: "Review suite", d: "Calibrated 4K HDR review with reference monitors and acoustic treatment." },
  { t: "Motion capture", d: "16-camera Vicon volume for full-body and facial capture." },
  { t: "Real-time stage", d: "LED volume for previs and in-camera VFX." },
];

const stack = [
  "Maya", "Houdini", "Cinema 4D", "Blender", "Unreal Engine 5",
  "Nuke", "After Effects", "Toon Boom Harmony", "Substance",
  "DaVinci Resolve", "Pro Tools",
];

export const Route = createFileRoute("/about/studio")({
  component: Studio,
  head: () => ({
    meta: [
      { title: "Our Studio | Tero Studios | India & USA" },
      {
        name: "description",
        content:
          "Inside the Tero Studios facility in Chennai — workstations, render farm, motion-capture volume, LED stage and full review suite.",
      },
      { property: "og:title", content: "Our Studio — Tero Studios" },
      { property: "og:description", content: "Facility, hardware, tech stack and capability reel." },
    ],
  }),
});

function Studio() {
  return (
    <PageLayout>
      <section className="container-tero py-24 md:py-36">
        <Reveal>
          <p className="overline">— Our studio</p>
          <h1 className="mt-6 hero-headline text-[clamp(48px,8vw,120px)] max-w-5xl">
            The room the <br />
            <span className="italic">work is made in.</span>
          </h1>
          <p className="mt-8 max-w-2xl font-body text-[19px] leading-relaxed text-slate">
            12,000 sq ft of purpose-built animation facility in Adyar,
            Chennai — designed, built and run by the same people who use it.
          </p>
        </Reveal>
      </section>

      <section className="border-y border-parchment bg-card">
        <div className="container-tero py-20 md:py-28">
          <p className="overline">— Hardware</p>
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {hardware.map((h, i) => (
              <Reveal key={h.t} delay={i % 3}>
                <div className="rounded-2xl border border-parchment bg-cream p-7">
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-vermillion">
                    — {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-4 font-sans-display text-[20px] font-bold text-ink">{h.t}</h3>
                  <p className="mt-3 font-body text-[14px] leading-relaxed text-slate">{h.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="container-tero py-24 md:py-32">
        <p className="overline">— Tech stack</p>
        <h2 className="mt-4 font-sans-display text-[32px] md:text-[44px] font-bold text-ink">
          The tools we use, daily.
        </h2>
        <div className="mt-10 flex flex-wrap gap-3">
          {stack.map((s) => (
            <span
              key={s}
              className="rounded-full border border-parchment bg-card px-5 py-2.5 font-sans-display text-[14px] font-bold tracking-[0.1em] text-ink/70"
            >
              {s}
            </span>
          ))}
        </div>
      </section>
    </PageLayout>
  );
}
