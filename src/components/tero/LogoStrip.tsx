import { useMemo } from "react";

const logoModules = import.meta.glob<{ default: { url: string } }>(
  "@/assets/client-logos/*.png.asset.json",
  { eager: true },
);

const logoByName = (n: number) => {
  const key = `/src/assets/client-logos/logo-${String(n).padStart(2, "0")}.png.asset.json`;
  return logoModules[key]?.default.url;
};

// Globally / nationally well-known brands from the 67 client logos — surface first.
const WELL_KNOWN = [
  2, 5, 7, 8, 9, 10, 11, 14, 16, 17, 18, 19, 21, 22, 23, 32,
  35, 36, 37, 38, 44, 46, 48, 49, 54, 55, 56, 58, 59, 61, 66, 67,
];

const REST = Array.from({ length: 67 }, (_, i) => i + 1).filter(
  (n) => !WELL_KNOWN.includes(n)
);

const ALL_URLS = [...WELL_KNOWN, ...REST]
  .map(logoByName)
  .filter((u): u is string => Boolean(u));

// Distribute logos round-robin across N columns so the grid feels mixed.
function splitColumns(urls: string[], cols: number): string[][] {
  const out: string[][] = Array.from({ length: cols }, () => []);
  urls.forEach((u, i) => out[i % cols].push(u));
  return out;
}

// Per-column drift config: direction + duration (seconds). Staggered, very slow.
const COLUMN_CONFIG: Array<{ dir: "up" | "down"; duration: number; offset: number }> = [
  { dir: "up",   duration: 140, offset: 0 },
  { dir: "down", duration: 170, offset: -40 },
  { dir: "up",   duration: 200, offset: -20 },
  { dir: "down", duration: 160, offset: -60 },
  { dir: "up",   duration: 185, offset: -10 },
];

export function LogoStrip() {
  const columns = useMemo(() => splitColumns(ALL_URLS, COLUMN_CONFIG.length), []);

  return (
    <section className="relative border-y border-parchment bg-cream overflow-hidden">
      {/* Hairline rails */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-6 md:left-12 w-px h-full bg-ink/[0.06]" />
        <div className="absolute top-0 right-6 md:right-12 w-px h-full bg-ink/[0.06]" />
      </div>

      <div className="container-tero py-20 md:py-28 relative">
        {/* Editorial header */}
        <header className="mb-14 md:mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b border-ink/10 pb-8">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="h-1.5 w-1.5 rounded-full bg-vermillion" />
              <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-ink/60">
                (02) Partnerships / Index
              </span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-ink tracking-tight leading-[1.05]">
              Trusted by Industry Leaders
            </h2>
          </div>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink/45 max-w-[260px] leading-relaxed">
            {ALL_URLS.length} brands across film, fashion, technology and culture.
          </p>
        </header>

        {/* Drifting columns */}
        <div
          className="relative h-[520px] md:h-[600px] overflow-hidden border border-ink/10 bg-cream"
          style={{ maskImage: "linear-gradient(to bottom, transparent, #000 14%, #000 86%, transparent)", WebkitMaskImage: "linear-gradient(to bottom, transparent, #000 14%, #000 86%, transparent)" }}
        >
          <div className="grid h-full grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {columns.map((col, ci) => {
              const cfg = COLUMN_CONFIG[ci];
              const hiddenClass =
                ci === 2 ? "hidden md:block" : ci >= 3 ? "hidden lg:block" : "";
              return (
                <div
                  key={ci}
                  className={`relative overflow-hidden border-l border-ink/[0.06] first:border-l-0 ${hiddenClass}`}
                >
                  <div
                    className={cfg.dir === "up" ? "animate-drift-up" : "animate-drift-down"}
                    style={{
                      animationDuration: `${cfg.duration}s`,
                      transform: `translateY(${cfg.offset}px)`,
                    }}
                  >
                    <LogoColumn logos={col} />
                    <LogoColumn logos={col} ariaHidden />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer meta */}
        <div className="mt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.3em] text-ink/40">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-ink/30" />
            <span>Selected clients — drifting archive</span>
          </div>
          <span>Vol. 02 / {new Date().getFullYear()}</span>
        </div>
      </div>
    </section>
  );
}

function LogoColumn({ logos, ariaHidden = false }: { logos: string[]; ariaHidden?: boolean }) {
  return (
    <div aria-hidden={ariaHidden || undefined} className="flex flex-col">
      {logos.map((src, i) => (
        <LogoCell key={`${i}-${ariaHidden ? "c" : "o"}`} src={src} />
      ))}
    </div>
  );
}

function LogoCell({ src }: { src: string }) {
  return (
    <div className="group relative aspect-[5/3] border-b border-ink/[0.06] flex items-center justify-center px-6 py-8 transition-colors duration-700 hover:bg-ink/[0.02]">
      <img
        src={src}
        alt="Client logo"
        loading="lazy"
        decoding="async"
        className="max-h-[58%] max-w-[78%] w-auto object-contain opacity-50 grayscale transition-all duration-[900ms] ease-out group-hover:opacity-100 group-hover:grayscale-0 group-hover:scale-[1.04]"
      />
    </div>
  );
}
