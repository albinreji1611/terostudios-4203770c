import { Reveal } from "./Reveal";

const logos = [
  "NETFLIX", "SAMSUNG", "NIKE", "TATA", "SWIGGY", "RAZORPAY",
  "ADIDAS", "FLIPKART", "ZOMATO", "MERCEDES", "UNILEVER", "ITC",
];

export function LogoStrip() {
  const rowA = [...logos, ...logos];
  const rowB = [...logos.slice().reverse(), ...logos.slice().reverse()];

  return (
    <section className="relative border-y border-parchment bg-cream overflow-hidden">
      {/* hairline grid accents */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-6 md:left-12 w-px h-full bg-ink/[0.06]" />
        <div className="absolute top-0 right-6 md:right-12 w-px h-full bg-ink/[0.06]" />
      </div>

      <div className="container-tero py-20 md:py-28 relative">
        {/* Header */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 mb-14 md:mb-20">
          <div className="md:col-span-5">
            <Reveal>
              <div className="flex items-center gap-3">
                <span className="h-px w-10 bg-vermillion" />
                <p className="overline text-vermillion">— In good company</p>
              </div>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-6 hero-headline text-[clamp(40px,5.5vw,76px)] leading-[0.95] text-ink">
                Trusted by teams <br />
                <span className="italic font-light">that move fast.</span>
              </h2>
            </Reveal>
          </div>
          <div className="md:col-span-5 md:col-start-8 flex md:items-end">
            <Reveal delay={0.1}>
              <p className="font-body text-[16px] md:text-[18px] leading-relaxed text-ink/70 max-w-md">
                A decade of collaborations with global brands, ambitious
                challengers and the studios behind them — shipping films,
                frames and stories that earn attention.
              </p>
            </Reveal>
          </div>
        </div>

        {/* Marquee rows */}
        <div className="relative">
          {/* edge fades */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 md:w-40 bg-gradient-to-r from-cream to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 md:w-40 bg-gradient-to-l from-cream to-transparent z-10" />

          <div className="space-y-2 md:space-y-4">
            {/* Row 1 — left */}
            <div className="overflow-hidden border-y border-ink/10 py-6 md:py-8">
              <div className="flex gap-16 md:gap-24 animate-marquee whitespace-nowrap will-change-transform">
                {rowA.map((l, i) => (
                  <LogoCell key={`a-${i}`} label={l} />
                ))}
              </div>
            </div>

            {/* Row 2 — right (reverse) */}
            <div className="overflow-hidden border-b border-ink/10 py-6 md:py-8">
              <div className="flex gap-16 md:gap-24 animate-marquee-reverse whitespace-nowrap will-change-transform">
                {rowB.map((l, i) => (
                  <LogoCell key={`b-${i}`} label={l} variant="muted" />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer stat row */}
        <div className="mt-14 md:mt-20 grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-8">
          {[
            { k: "120+", v: "Brands shipped" },
            { k: "32", v: "Countries reached" },
            { k: "10 yrs", v: "Crafting motion" },
            { k: "18", v: "Award honors" },
          ].map((s, i) => (
            <Reveal key={i} delay={i * 0.05}>
              <div className="flex flex-col gap-2">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-vermillion">
                  — {String(i + 1).padStart(2, "0")}
                </p>
                <p className="hero-headline text-[clamp(32px,3.4vw,52px)] leading-none text-ink">
                  {s.k}
                </p>
                <p className="font-body text-[13px] text-ink/60">{s.v}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function LogoCell({
  label,
  variant = "default",
}: {
  label: string;
  variant?: "default" | "muted";
}) {
  return (
    <span
      className={`group relative inline-flex items-center gap-5 font-sans-display text-[28px] md:text-[44px] lg:text-[56px] font-bold tracking-[0.06em] leading-none transition-colors duration-300 ${
        variant === "muted"
          ? "text-ink/25 hover:text-ink"
          : "text-ink/40 hover:text-vermillion"
      }`}
    >
      {label}
      <span
        aria-hidden
        className="inline-block w-2.5 h-2.5 rounded-full bg-vermillion/70 group-hover:scale-150 transition-transform duration-300"
      />
    </span>
  );
}
