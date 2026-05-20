import { createFileRoute } from "@tanstack/react-router";
import { PageLayout } from "@/components/tero/PageLayout";
import { Reveal } from "@/components/tero/Reveal";

export const Route = createFileRoute("/team")({
  component: TeamPage,
  head: () => ({
    meta: [
      { title: "Team — Tero Studios" },
      { name: "description", content: "Meet the directors, animators and artists behind Tero Studios." },
    ],
  }),
});

const departments = [
  {
    name: "Direction & Creative",
    people: [
      { n: "Aarav Bhatia", r: "Co-Founder, Creative Director" },
      { n: "Leela Iyer", r: "Director, Brand Films" },
    ],
  },
  {
    name: "Animation",
    people: [
      { n: "Karan Patil", r: "Lead 2D Animator" },
      { n: "Ishita Roy", r: "Senior Motion Designer" },
      { n: "Devansh Mehta", r: "Character Animator" },
    ],
  },
  {
    name: "3D & VFX",
    people: [
      { n: "Maya Krishnan", r: "Head of 3D" },
      { n: "Rohit Sharma", r: "VFX Supervisor" },
      { n: "Tanvi Joshi", r: "Lookdev & Lighting" },
    ],
  },
  {
    name: "Producers & Strategy",
    people: [
      { n: "Sana Qureshi", r: "Executive Producer" },
      { n: "Vikram Nair", r: "Strategy Lead" },
    ],
  },
];

function colorFor(name: string) {
  const palette = ["#E8390E", "#2D1B6E", "#C49A3C", "#111318"];
  return palette[name.length % palette.length];
}

function TeamPage() {
  return (
    <PageLayout>
      <section className="container-tero py-24 md:py-40">
        <Reveal>
          <p className="overline">— The team</p>
          <h1 className="mt-6 hero-headline text-[clamp(56px,10vw,144px)] max-w-5xl">
            Twenty-three <br />
            <span className="italic">hands. <br /> One studio.</span>
          </h1>
          <p className="mt-8 max-w-xl font-body text-[18px] leading-relaxed text-slate">
            We hire slowly and stay small on purpose. Every name on this page
            touches every project we ship.
          </p>
        </Reveal>
      </section>

      <section className="border-t border-parchment">
        <div className="container-tero py-24 md:py-32 space-y-24">
          {departments.map((dept, i) => (
            <div key={dept.name}>
              <Reveal>
                <div className="flex items-end justify-between border-b border-parchment pb-6">
                  <h2 className="font-sans-display text-[clamp(28px,4vw,48px)] font-bold text-ink">{dept.name}</h2>
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-vermillion">
                    {String(i + 1).padStart(2, "0")} / {departments.length}
                  </p>
                </div>
              </Reveal>
              <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
                {dept.people.map((p, j) => (
                  <Reveal key={p.n} delay={j % 4}>
                    <article className="group rounded-2xl border border-parchment bg-card p-6 transition-all hover:border-vermillion/40 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
                      <div
                        className="flex aspect-[4/5] items-center justify-center rounded-xl text-center"
                        style={{ backgroundColor: colorFor(p.n) + "1A" }}
                      >
                        <span
                          className="font-display text-[clamp(64px,8vw,128px)] leading-none"
                          style={{ color: colorFor(p.n) }}
                        >
                          {p.n.split(" ").map((s) => s[0]).join("")}
                        </span>
                      </div>
                      <h3 className="mt-5 font-sans-display text-[18px] font-bold text-ink">{p.n}</h3>
                      <p className="mt-1 font-body text-[13px] text-slate">{p.r}</p>
                    </article>
                  </Reveal>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </PageLayout>
  );
}
