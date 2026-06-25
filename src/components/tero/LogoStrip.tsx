import { useMemo } from "react";

const logoModules = import.meta.glob<{ default: { url: string } }>(
  "@/assets/client-logos/*.png.asset.json",
  { eager: true },
);

const logoByName = (n: number) => {
  const key = `/src/assets/client-logos/logo-${String(n).padStart(2, "0")}.png.asset.json`;
  return logoModules[key]?.default.url;
};

const WELL_KNOWN = [
  2, 5, 7, 8, 9, 10, 11, 14, 16, 17, 18, 19, 21, 22, 23, 32,
  35, 36, 37, 38, 44, 46, 48, 49, 54, 55, 56, 58, 59, 61, 66, 67,
].filter((n) => n !== 65);
const EXCLUDED = [65]; // Aadhya Animatics — removed per request
const REST = Array.from({ length: 67 }, (_, i) => i + 1).filter(
  (n) => !WELL_KNOWN.includes(n) && !EXCLUDED.includes(n),
);

const ALL_URLS = [...WELL_KNOWN, ...REST]
  .map(logoByName)
  .filter((u): u is string => Boolean(u));

const COLS = 6;
const MOBILE_COLS = 3;
// Deterministic per-tile depth offset (px) — gives subtle relief on the floor plane.
const depthAt = (i: number) => {
  const seq = [10, 36, 4, 58, 22, 44, 14, 30, 8, 64, 26, 50, 18, 40, 6, 54];
  return seq[i % seq.length];
};

// Slot tiles into rows of COLS.
function toRows(urls: string[], cols: number): string[][] {
  const rows: string[][] = [];
  for (let i = 0; i < urls.length; i += cols) rows.push(urls.slice(i, i + cols));
  return rows;
}

export function LogoStrip() {
  const rows = useMemo(() => toRows(ALL_URLS, COLS), []);

  return (
    <section className="relative border-y border-parchment bg-cream overflow-hidden">
      {/* Hairline rails */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-6 md:left-12 w-px h-full bg-ink/[0.06]" />
        <div className="absolute top-0 right-6 md:right-12 w-px h-full bg-ink/[0.06]" />
      </div>

      <div className="container-tero py-20 md:py-28 relative">
        {/* Editorial header */}
        <header className="relative z-20 mb-20 md:mb-28 text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-vermillion/60" />
            <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-vermillion">
              (02) Partnerships
            </span>
            <span className="h-px w-8 bg-vermillion/60" />
          </div>
          <h2 className="font-display text-[clamp(34px,5vw,72px)] leading-[0.95] tracking-tight text-ink">
            Trusted by Industry <span className="italic text-vermillion">Leaders</span>
          </h2>
        </header>

        {/* Anamorphic tunnel floor — overflow-hidden clips the tilted plane so it can't bleed up into the heading */}
        <div
          className="relative mx-auto h-[460px] md:h-[560px] lg:h-[620px] w-full max-w-[1280px] overflow-hidden"
          style={{ perspective: "1400px", perspectiveOrigin: "50% 10%" }}
        >
          {/* Tilted floor plane — pushed down inside the clipped frame */}
          <div
            className="absolute inset-x-0 top-[18%] bottom-0 flex items-start justify-center"
            style={{
              transform: "rotateX(58deg) rotateZ(-14deg)",
              transformStyle: "preserve-3d",
              transformOrigin: "50% 0%",
            }}
          >
            {/* Scrolling rail — duplicated for seamless loop */}
            <div
              className="w-[150%] animate-tunnel-drift"
              style={{ transformStyle: "preserve-3d" }}
            >
              <FloorRows rows={rows} />
              <FloorRows rows={rows} ariaHidden />
            </div>
          </div>

          {/* Vignettes — soften the floor edges into cream */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-10"
            style={{
              background:
                "linear-gradient(180deg, var(--background) 0%, transparent 22%, transparent 70%, var(--background) 100%)",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-10"
            style={{
              background:
                "linear-gradient(90deg, var(--background) 0%, transparent 14%, transparent 86%, var(--background) 100%)",
            }}
          />
          {/* Distance glow at the vanishing horizon */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-[18%] z-[5] h-40 mx-auto max-w-[640px]"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(232,57,14,0.12) 0%, transparent 70%)",
              filter: "blur(28px)",
            }}
          />
        </div>

        {/* Footer meta */}
        <div className="relative z-20 mt-10 flex items-center justify-center gap-4 font-mono text-[10px] uppercase tracking-[0.3em] text-ink/45">
          <span className="h-px w-10 bg-ink/30" />
          <span>{ALL_URLS.length} brands · Selected archive</span>
          <span className="h-px w-10 bg-ink/30" />
        </div>
      </div>
    </section>
  );
}

function FloorRows({ rows, ariaHidden = false }: { rows: string[][]; ariaHidden?: boolean }) {
  return (
    <div aria-hidden={ariaHidden || undefined} className="flex flex-col gap-6 md:gap-8">
      {rows.map((row, ri) => (
        <div
          key={`${ariaHidden ? "c" : "o"}-${ri}`}
          className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-5"
        >
          {row.map((src, ci) => {
            const i = ri * COLS + ci;
            return <FloorTile key={i} src={src} z={depthAt(i)} highlight={i % 17 === 0} />;
          })}
        </div>
      ))}
    </div>
  );
}

function FloorTile({ src, z, highlight }: { src: string; z: number; highlight: boolean }) {
  return (
    <div
      className="group relative flex h-[110px] items-center justify-center rounded-sm border border-ink/5 bg-cream/60 p-4 shadow-[0_2px_6px_rgba(26,26,31,0.04)] transition-all duration-700 hover:bg-cream hover:shadow-[0_10px_30px_rgba(26,26,31,0.12)] md:h-[108px]"
      style={{
        transform: `translateZ(${z}px)`,
        backdropFilter: "blur(1px)",
      }}
    >
      <img
        src={src}
        alt="Client logo"
        loading="lazy"
        decoding="async"
        className="max-h-[70%] max-w-[82%] object-contain opacity-70 grayscale transition-all duration-700 group-hover:opacity-100 group-hover:grayscale-0 md:max-h-[64%] md:max-w-[78%] md:opacity-55"
      />
      {highlight && (
        <span
          aria-hidden
          className="pointer-events-none absolute -inset-px rounded-sm"
          style={{ boxShadow: "inset 0 0 0 1px rgba(232,57,14,0.18)" }}
        />
      )}
    </div>
  );
}
