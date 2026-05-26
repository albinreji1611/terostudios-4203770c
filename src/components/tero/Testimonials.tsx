import { Reveal, RevealGroup, RevealItem } from "./Reveal";
import { Quote } from "lucide-react";

const t = [
  {
    n: "I",
    quote:
      "Tero handed us a 60-second film that the entire leadership team forwarded the moment it landed. Rare studio. Even rarer craft.",
    name: "Anika Mehra",
    role: "Head of Brand, Finlytics",
  },
  {
    n: "II",
    quote:
      "Working with Tero feels less like commissioning a vendor and more like adding a senior creative team for the duration of the project.",
    name: "Rohan Krishnan",
    role: "Founder, GlassWorks",
  },
  {
    n: "III",
    quote:
      "Every revision came back sharper than the last. Their taste is the reason we keep coming back.",
    name: "Priya Subramaniam",
    role: "Creative Director, Mirage Films",
  },
];

export function Testimonials() {
  return (
    <section data-nav-theme="dark" className="bg-ink text-cream">
      <div className="container-tero py-24 md:py-40">
        <Reveal>
          <p className="overline text-vermillion">— Portfolio of consensus</p>
          <h2 className="mt-6 hero-headline text-[clamp(40px,7vw,96px)] text-cream max-w-4xl">
            What clients have to say <br /> after the lights come up.
          </h2>
        </Reveal>

        <RevealGroup className="mt-20 grid grid-cols-1 gap-6 md:grid-cols-3">
          {t.map((q, i) => (
            <RevealItem
              key={i}
              className="relative flex flex-col gap-8 rounded-2xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-sm"
            >
              <div className="flex items-center justify-between">
                <Quote className="h-6 w-6 text-vermillion" strokeWidth={1.5} />
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-cream/40">
                  Series — {q.n}
                </span>
              </div>
              <p className="font-display text-[clamp(22px,2vw,30px)] leading-snug text-cream not-italic">
                &ldquo;{q.quote}&rdquo;
              </p>
              <div className="mt-auto flex items-center gap-3 border-t border-white/10 pt-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-vermillion/20 font-sans-display text-[14px] font-bold text-vermillion">
                  {q.name[0]}
                </div>
                <div>
                  <p className="font-body text-[14px] font-medium text-cream">{q.name}</p>
                  <p className="font-body text-[12px] text-cream/50">{q.role}</p>
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
