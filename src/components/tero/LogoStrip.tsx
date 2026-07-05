import { useMemo } from "react";
import { resolveAssetUrl } from "@/lib/asset-url";

const logoModules = import.meta.glob<{ url: string }>(
  "../../assets/client-logos/*.png.asset.json",
  { eager: true, import: "default" },
);

const logoByName = (n: number) => {
  const suffix = `/client-logos/logo-${String(n).padStart(2, "0")}.png.asset.json`;
  const entry = Object.entries(logoModules).find(([k]) => k.endsWith(suffix));
  const url = entry?.[1]?.url;
  return url ? resolveAssetUrl(url) : undefined;
};

// Primary / famous brands (curated indices)
const PRIMARY = [
  2, 5, 7, 8, 9, 10, 11, 14, 16, 17, 18, 19, 21, 22, 23, 32,
  35, 36, 37, 38, 44, 46, 48, 49, 54, 55, 56, 58, 59, 61, 66, 67,
].filter((n) => n !== 65);

const EXCLUDED = [65]; // Aadhya Animatics — removed per request
const ALL = Array.from({ length: 67 }, (_, i) => i + 1).filter(
  (n) => !EXCLUDED.includes(n),
);

const PRIMARY_URLS = PRIMARY.map(logoByName).filter((u): u is string => Boolean(u));
const ALL_URLS = ALL.map(logoByName).filter((u): u is string => Boolean(u));

function Row({ urls, direction, duration }: { urls: string[]; direction: "left" | "right"; duration: number }) {
  const animationName = direction === "left" ? "tero-row-left" : "tero-row-right";
  const loop = [...urls, ...urls];
  return (
    <div className="relative w-full overflow-hidden">
      <div
        className="flex items-center gap-10 md:gap-16 w-max"
        style={{ animation: `${animationName} ${duration}s linear infinite`, willChange: "transform" }}
      >
        {loop.map((src, i) => (
          <div
            key={i}
            className="flex h-[72px] md:h-[96px] w-[140px] md:w-[180px] shrink-0 items-center justify-center"
          >
            <img
              src={src}
              alt="Client logo"
              loading="lazy"
              decoding="async"
              className="max-h-[70%] max-w-[80%] object-contain opacity-60 grayscale transition-all duration-500 hover:opacity-100 hover:grayscale-0"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export function LogoStrip() {
  const primary = useMemo(() => PRIMARY_URLS, []);
  const all = useMemo(() => ALL_URLS, []);

  return (
    <section className="relative border-y border-parchment bg-cream overflow-hidden">
      <div className="container-tero py-20 md:py-28">
        <header className="mb-14 md:mb-20 text-center">
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

        <div className="relative space-y-10 md:space-y-14">
          <Row urls={primary} direction="left" duration={120} />
          <Row urls={all} direction="right" duration={180} />

          {/* Edge fades */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 w-24 md:w-40"
            style={{ background: "linear-gradient(90deg, var(--background) 0%, transparent 100%)" }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 w-24 md:w-40"
            style={{ background: "linear-gradient(-90deg, var(--background) 0%, transparent 100%)" }}
          />
        </div>

        <div className="mt-12 flex items-center justify-center gap-4 font-mono text-[10px] uppercase tracking-[0.3em] text-ink/45">
          <span className="h-px w-10 bg-ink/30" />
          <span>{ALL_URLS.length} brands · Selected archive</span>
          <span className="h-px w-10 bg-ink/30" />
        </div>
      </div>
    </section>
  );
}
