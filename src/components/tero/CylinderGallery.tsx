import { useMemo } from "react";
import { videos } from "@/data/videos";

/**
 * Anamorphic reel wall:
 * 1) Top: heading + Vimeo anamorphic intro video
 * 2) Below: curved video wall — rows scroll left/right (alternating)
 *    with per-tile rotateY/translateZ for an anamorphic concave wrap.
 */

const ROWS = 4;
const TILES_PER_ROW = 7;
const TILE_W = 220;
const TILE_H = 130;
const GAP = 14;
const CURVE = 60; // degrees of horizontal wrap
const DEPTH = 380;

export function CylinderGallery() {
  // Stable tile assignment per row, duplicated for seamless marquee.
  const rows = useMemo(() => {
    return Array.from({ length: ROWS }, (_, r) => {
      const base = Array.from({ length: TILES_PER_ROW }, (_, c) => {
        const idx = (r * TILES_PER_ROW + c) % videos.length;
        return videos[idx];
      });
      return [...base, ...base]; // duplicate for infinite loop
    });
  }, []);

  const halfC = (TILES_PER_ROW - 1) / 2;

  return (
    <section className="relative bg-ink text-cream overflow-hidden">
      {/* Backdrop glow */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(70% 55% at 50% 30%, rgba(232,57,14,0.14) 0%, transparent 65%), #0a0b10",
        }}
      />

      {/* ── Heading ── */}
      <div className="relative z-10 px-6 pt-24 md:pt-32 text-center">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-cream/60">
          Reel Wall · Anamorphic Theatre
        </span>
        <h2 className="mt-4 font-display text-[clamp(2.4rem,5.5vw,4.8rem)] leading-[1.02] tracking-[-0.02em] text-cream">
          Stories That
          <br />
          Bend Reality
        </h2>
        <p className="mt-4 text-[13px] md:text-sm tracking-[0.18em] uppercase text-cream/60">
          Anamorphic worlds, crafted frame by frame
        </p>
      </div>

      {/* ── Vimeo anamorphic intro ── */}
      <div className="relative z-10 mx-auto mt-12 md:mt-16 w-[min(1120px,92vw)]">
        <div
          className="relative w-full overflow-hidden rounded-[14px] ring-1 ring-cream/15 bg-black"
          style={{
            aspectRatio: "16 / 9",
            boxShadow:
              "0 50px 120px -40px rgba(232,57,14,0.35), 0 30px 80px -30px rgba(0,0,0,0.8)",
          }}
        >
          <iframe
            title="Anamorphic Reel"
            src="https://player.vimeo.com/video/1089815889?h=07c835bf8a&autoplay=1&muted=1&loop=1&background=1"
            className="absolute inset-0 h-full w-full"
            frameBorder={0}
            allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
            allowFullScreen
          />
        </div>
      </div>

      {/* ── Curved marquee video wall ── */}
      <div
        className="relative z-10 mt-20 md:mt-28 pb-28"
        style={{
          perspective: "1500px",
          perspectiveOrigin: "50% 50%",
        }}
      >
        <div
          className="relative mx-auto"
          style={{
            transformStyle: "preserve-3d",
            width: "min(1400px, 96vw)",
          }}
        >
          {rows.map((rowTiles, r) => {
            const dir = r % 2 === 0 ? "tero-row-left" : "tero-row-right";
            const duration = 38 + r * 6;
            return (
              <div
                key={r}
                className="relative mx-auto"
                style={{
                  marginTop: r === 0 ? 0 : GAP,
                  height: TILE_H,
                  width: "100%",
                  overflow: "hidden",
                  maskImage:
                    "linear-gradient(90deg, transparent 0%, #000 12%, #000 88%, transparent 100%)",
                }}
              >
                <div
                  className="absolute top-0 left-0 flex"
                  style={{
                    gap: GAP,
                    animation: `${dir} ${duration}s linear infinite`,
                    transformStyle: "preserve-3d",
                  }}
                >
                  {rowTiles.map((vid, c) => {
                    const cMod = c % TILES_PER_ROW;
                    const t = (cMod - halfC) / halfC; // -1..1
                    const rotY = -t * (CURVE / 2);
                    const tz = -Math.abs(t) * DEPTH;
                    return (
                      <div
                        key={`${r}-${c}`}
                        className="relative shrink-0 overflow-hidden rounded-[8px] ring-1 ring-cream/10 bg-black"
                        style={{
                          width: TILE_W,
                          height: TILE_H,
                          transform: `rotateY(${rotY}deg) translateZ(${tz}px)`,
                          transformStyle: "preserve-3d",
                          boxShadow:
                            "0 30px 60px -30px rgba(0,0,0,0.7), inset 0 0 40px rgba(0,0,0,0.35)",
                        }}
                      >
                        <video
                          src={vid.url}
                          autoPlay
                          muted
                          loop
                          playsInline
                          preload="metadata"
                          className="absolute inset-0 h-full w-full object-cover pointer-events-none select-none"
                        />
                        <div
                          aria-hidden
                          className="absolute inset-0 pointer-events-none"
                          style={{
                            background:
                              "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.35) 100%)",
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Edge vignettes for the wall */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-[18%]"
          style={{
            background:
              "linear-gradient(90deg, #0a0b10 10%, rgba(10,11,16,0.5) 60%, transparent 100%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-[18%]"
          style={{
            background:
              "linear-gradient(-90deg, #0a0b10 10%, rgba(10,11,16,0.5) 60%, transparent 100%)",
          }}
        />
      </div>
    </section>
  );
}
