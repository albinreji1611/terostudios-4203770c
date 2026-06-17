import { useMemo } from "react";

const logoModules = import.meta.glob<{ default: { url: string } }>(
  "@/assets/client-logos/*.png.asset.json",
  { eager: true },
);

const logoByName = (n: number) => {
  const key = `/src/assets/client-logos/logo-${String(n).padStart(2, "0")}.png.asset.json`;
  return logoModules[key]?.default.url;
};

// Globally / nationally well-known brands from the 67 client logos.
const WELL_KNOWN = [
  2, 5, 7, 8, 9, 10, 11, 14, 16, 17, 18, 19, 21, 22, 23, 32,
  35, 36, 37, 38, 44, 46, 48, 49, 54, 55, 56, 58, 59, 61, 66, 67,
];

// All 67 logos minus the well-known set.
const REST = Array.from({ length: 67 }, (_, i) => i + 1).filter(
  (n) => !WELL_KNOWN.includes(n)
);

const wellKnownUrls = WELL_KNOWN.map(logoByName).filter((u): u is string => Boolean(u));
const restUrls = REST.map(logoByName).filter((u): u is string => Boolean(u));

export function LogoStrip() {
  const { rowA, rowB, durationA, durationB } = useMemo(() => {
    const a = wellKnownUrls;
    const b = restUrls;
    // 2× duplication is enough for a seamless translateX(-50%) loop
    return {
      rowA: [...a, ...a],
      rowB: [...b, ...b],
      // Faster pass, with the track sized to content so the full logo set crosses before looping.
      durationA: a.length * 0.65,
      durationB: b.length * 0.65,
    };
  }, []);


  return (
    <section className="relative border-y border-parchment bg-cream overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-6 md:left-12 w-px h-full bg-ink/[0.06]" />
        <div className="absolute top-0 right-6 md:right-12 w-px h-full bg-ink/[0.06]" />
      </div>

      <div className="container-tero py-20 md:py-28 relative">
        <h2 className="font-display text-2xl md:text-3xl lg:text-4xl text-ink/80 tracking-tight text-center mb-12 md:mb-16">
          Trusted by Industry Leaders
        </h2>

        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 md:w-40 bg-gradient-to-r from-cream to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 md:w-40 bg-gradient-to-l from-cream to-transparent z-10" />

          <div className="space-y-2 md:space-y-4">
            <div className="overflow-hidden border-y border-ink/10 py-6 md:py-8">
              <div
                className="flex w-max items-center gap-16 md:gap-24 animate-marquee whitespace-nowrap will-change-transform"
                style={{ animationDuration: `${durationA}s` }}
              >
                {rowA.map((src, i) => (
                  <LogoCell key={`a-${i}`} src={src} />
                ))}
              </div>
            </div>

            <div className="overflow-hidden border-b border-ink/10 py-6 md:py-8">
              <div
                className="flex w-max items-center gap-16 md:gap-24 animate-marquee-reverse whitespace-nowrap will-change-transform"
                style={{ animationDuration: `${durationB}s` }}
              >
                {rowB.map((src, i) => (
                  <LogoCell key={`b-${i}`} src={src} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function LogoCell({ src }: { src: string }) {
  return (
    <span className="group relative inline-flex shrink-0 items-center justify-center">
      <img
        src={src}
        alt="Client logo"
        loading="eager"
        decoding="async"
        className="h-[56px] md:h-[80px] lg:h-[96px] w-auto object-contain opacity-60 grayscale transition-all duration-300 group-hover:opacity-100 group-hover:grayscale-0"
      />
    </span>
  );
}
