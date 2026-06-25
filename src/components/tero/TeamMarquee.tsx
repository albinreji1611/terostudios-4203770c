import { useEffect, useRef, type ReactNode } from "react";
import { Linkedin } from "lucide-react";
import { Reveal } from "./Reveal";

type Person = { name: string; role: string; li?: string };

function DualName({ name }: { name: string }) {
  const parts = name.trim().split(/\s+/);
  const first = parts[0];
  const rest = parts.slice(1).join(" ");
  return (
    <span className="inline-flex items-baseline gap-3 md:gap-5 whitespace-nowrap">
      <span className="font-sans-display font-bold uppercase tracking-tight text-ink">
        {first}
      </span>
      {rest && (
        <span
          className="italic lowercase text-ink/85"
          style={{ fontFamily: '"Instrument Serif", "Times New Roman", serif', fontWeight: 400 }}
        >
          {rest}
        </span>
      )}
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
        className="flex w-max items-center gap-12 md:gap-20 will-change-transform"
      >
        {loop.map((p, i) => (
          <div key={i} className="flex items-center gap-12 md:gap-20 shrink-0">
            <div className="group flex flex-col items-center text-center opacity-80 hover:opacity-100 transition-opacity duration-300">
              <h3 className="leading-[0.95] text-[clamp(56px,9vw,140px)]">
                <DualName name={p.name} />
              </h3>
              <div className="mt-3 flex items-center gap-3 font-body text-[12px] md:text-[14px] text-slate">
                <span>{p.role}</span>
                <a
                  href={p.li ?? "#"}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${p.name} on LinkedIn`}
                  className="inline-flex h-6 w-6 items-center justify-center rounded-sm border border-ink/20 text-ink/70 hover:border-vermillion hover:text-vermillion"
                >
                  <Linkedin className="h-3 w-3" strokeWidth={2} />
                </a>
              </div>
            </div>
            <span className="h-2 w-2 shrink-0 rounded-full bg-ink/30" />
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
          <p className="overline">{eyebrow}</p>
          <h2 className="mt-6 hero-headline text-[clamp(40px,6vw,80px)] leading-[1] text-ink">
            {title}
          </h2>
        </Reveal>
      </div>

      <div className="relative z-10 mt-16 md:mt-24">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-32 md:w-64 bg-gradient-to-r from-cream to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-32 md:w-64 bg-gradient-to-l from-cream to-transparent" />

        <div className="flex flex-col gap-2 md:gap-4">
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
