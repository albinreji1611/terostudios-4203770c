import { Reveal } from "./Reveal";

const items = [
  { y: "2024", t: "Webby Honoree" },
  { y: "2023", t: "Adobe MAX Feature" },
  { y: "2023", t: "Vimeo Staff Pick" },
  { y: "2022", t: "FWA of the Day" },
  { y: "2022", t: "Motion Awards Finalist" },
  { y: "2021", t: "Awwwards SOTM" },
];

export function Awards() {
  return (
    <section className="border-y border-parchment bg-cream">
      <div className="container-tero py-20 md:py-28">
        <Reveal>
          <p className="overline">— Press &amp; recognition</p>
        </Reveal>
        <div className="mt-10 grid grid-cols-2 gap-y-8 md:grid-cols-6">
          {items.map((a, i) => (
            <div key={i} className="flex flex-col gap-2">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-vermillion">
                {a.y}
              </p>
              <p className="font-sans-display text-[16px] font-bold text-ink">
                {a.t}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
