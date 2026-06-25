import { useEffect, useRef, type ReactNode } from "react";
import { Linkedin } from "lucide-react";
import { Reveal } from "./Reveal";

type Person = { name: string; role: string; li?: string };

function OutlineName({ name, filled }: { name: string; filled?: boolean }) {
  const first = name.trim().split(/\s+/)[0];
  return (
    <span
      className="font-sans-display font-bold whitespace-nowrap"
      style={{
        WebkitTextStroke: filled ? "0" : "1.5px rgba(15,15,15,0.95)",
        color: filled ? "rgba(15,15,15,0.95)" : "transparent",
        letterSpacing: "-0.01em",
      }}
    >
      {first}
    </span>
  );
}

function MarqueeRow({
  people,
  speed,
  direction = "left",
}: {
  people: Person[];
  speed: number;
  direction?: "left" | "right";
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const offsetRef = useRef(0);
  const pausedRef = useRef(false);

  const loop = [...people, ...people, ...people];

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    if (direction === "right") {
      offsetRef.current = -track.scrollWidth / 3;
    }
    const tick = () => {
      if (!pausedRef.current) {
        const delta = direction === "left" ? -speed : speed;
        offsetRef.current += delta;
        const third = track.scrollWidth / 3;
        if (direction === "left" && -offsetRef.current >= third) offsetRef.current += third;
        if (direction === "right" && offsetRef.current >= 0) offsetRef.current -= third;
        track.style.transform = `translate3d(${offsetRef.current}px,0,0)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [speed, direction]);

  return (
    <div
      className="overflow-hidden py-6 md:py-10"
      onMouseEnter={() => (pausedRef.current = true)}
      onMouseLeave={() => (pausedRef.current = false)}
    >
      <div
        ref={trackRef}
        className="flex w-max items-center gap-16 md:gap-28 will-change-transform"
      >
        {loop.map((p, i) => (
          <div key={i} className="flex items-center gap-16 md:gap-28 shrink-0">
            <div className="group flex flex-col items-center text-center">
              <h3 className="leading-[0.9] text-[clamp(64px,11vw,180px)]">
                <OutlineName name={p.name} filled={i % 2 === 1} />
              </h3>
              <div className="mt-4 flex items-center gap-3 font-body text-[13px] md:text-[15px] text-ink/80">
                <span>{p.role}</span>
                <span className="text-ink/40">—</span>
                <a
                  href={p.li ?? "#"}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${p.name} on LinkedIn`}
                  className="inline-flex items-center justify-center text-ink/85 hover:text-vermillion transition-colors"
                >
                  <Linkedin className="h-5 w-5" strokeWidth={2} />
                </a>
              </div>
            </div>
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-ink/50" />

          </div>
        ))}
      </div>

    </div>
  );
}

function chunk<T>(arr: T[], rows: number): T[][] {
  const out: T[][] = Array.from({ length: rows }, () => []);
  arr.forEach((item, i) => out[i % rows].push(item));
  return out;
}

export function TeamMarquee({
  eyebrow,
  title,
  people,
  rows = 3,
}: {
  eyebrow: string;
  title: ReactNode;
  people: Person[];
  rows?: number;
  /** legacy prop, ignored */
  featured?: boolean;
}) {
  const rowCount = Math.min(rows, Math.max(1, Math.ceil(people.length / 2)));
  const grouped = chunk(people, rowCount);
  const speeds = [0.55, 0.45, 0.65, 0.5];

  return (
    <section className="relative overflow-hidden bg-cream text-ink py-24 md:py-36">
      <div className="container-tero relative z-10">
        <Reveal>
          <p className="overline text-ink/60">{eyebrow}</p>
          <h2 className="mt-6 hero-headline text-[clamp(40px,6vw,80px)] leading-[1] text-ink">
            {title}
          </h2>
        </Reveal>
      </div>

      <div className="relative z-10 mt-16 md:mt-24">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-32 md:w-64 bg-gradient-to-r from-cream to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-32 md:w-64 bg-gradient-to-l from-cream to-transparent" />

        <div className="flex flex-col gap-4 md:gap-8">
          {grouped.map((row, i) => (
            <MarqueeRow
              key={i}
              people={row}
              speed={speeds[i % speeds.length]}
              direction={i % 2 === 0 ? "left" : "right"}
            />
          ))}
        </div>
      </div>
    </section>

  );
}
