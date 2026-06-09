import { useMemo } from "react";

// Auto-import every uploaded client logo asset pointer.
const logoModules = import.meta.glob<{ default: { url: string } }>(
  "@/assets/client-logos/*.png.asset.json",
  { eager: true },
);

const logoUrls = Object.entries(logoModules)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([, mod]) => mod.default.url);

export function LogoStrip() {
  const { rowA, rowB } = useMemo(() => {
    const half = Math.ceil(logoUrls.length / 2);
    const a = logoUrls.slice(0, half);
    const b = logoUrls.slice(half);
    return {
      rowA: [...a, ...a],
      rowB: [...b.slice().reverse(), ...b.slice().reverse()],
    };
  }, []);

  return (
    <section className="relative border-y border-parchment bg-cream overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-6 md:left-12 w-px h-full bg-ink/[0.06]" />
        <div className="absolute top-0 right-6 md:right-12 w-px h-full bg-ink/[0.06]" />
      </div>

      <div className="container-tero py-20 md:py-28 relative">
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 md:w-40 bg-gradient-to-r from-cream to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 md:w-40 bg-gradient-to-l from-cream to-transparent z-10" />

          <div className="space-y-2 md:space-y-4">
            <div className="overflow-hidden border-y border-ink/10 py-6 md:py-8">
              <div className="flex items-center gap-16 md:gap-24 animate-marquee whitespace-nowrap will-change-transform">
                {rowA.map((src, i) => (
                  <LogoCell key={`a-${i}`} src={src} />
                ))}
              </div>
            </div>

            <div className="overflow-hidden border-b border-ink/10 py-6 md:py-8">
              <div className="flex items-center gap-16 md:gap-24 animate-marquee-reverse whitespace-nowrap will-change-transform">
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
        loading="lazy"
        className="h-[56px] md:h-[80px] lg:h-[96px] w-auto object-contain opacity-60 grayscale transition-all duration-300 group-hover:opacity-100 group-hover:grayscale-0"
      />
    </span>
  );
}
