import { useEffect, useRef, useState } from "react";

const stats = [
  { n: 320, suffix: "+", label: "Projects", meta: "Shipped" },
  { n: 48, suffix: "+", label: "Clients", meta: "Worldwide" },
  { n: 12, suffix: "", label: "Years", meta: "Independent" },
  { n: 27, suffix: "", label: "Awards", meta: "& features" },
  { n: 5, suffix: "", label: "Studios", meta: "Across cities" },
];

function useCountUp(target: number, duration = 1800) {
  const [value, setValue] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasStarted) {
            setHasStarted(true);
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;
    let raf = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [hasStarted, target, duration]);

  return { value, ref };
}

function StatCard({
  n,
  suffix,
  label,
  meta,
  index,
}: {
  n: number;
  suffix: string;
  label: string;
  meta: string;
  index: number;
}) {
  const { value, ref } = useCountUp(n, 1800 + index * 150);

  return (
    <div
      ref={ref}
      className="group/item relative flex flex-col justify-between gap-8 p-6 md:p-8 lg:p-10 min-h-[220px] md:min-h-[280px] transition-colors duration-500 hover:bg-ink/[0.03]"
    >
      <span className="font-mono text-[10px] tracking-[0.25em] text-vermillion uppercase">
        / 0{index + 1}
      </span>
      <div className="flex flex-col gap-2">
        <h3 className="font-display font-extrabold tracking-tight text-ink leading-none text-[clamp(44px,5.5vw,84px)] pt-2 transition-colors duration-500 group-hover/item:text-vermillion">
          {value}
          {suffix}
        </h3>
        <div className="flex items-baseline justify-between gap-3 pt-3 border-t border-parchment">
          <p className="font-body text-sm md:text-base font-medium text-ink uppercase tracking-wide">
            {label}
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/50">
            {meta}
          </p>
        </div>
      </div>
    </div>
  );
}

export function StatsSection() {
  return (
    <section className="relative overflow-hidden bg-cream">
      {/* Editorial header */}
      <div className="container-tero pt-24 md:pt-32">
        <div className="flex items-end justify-between gap-6 border-b border-parchment pb-8">
          <div>
            <p className="overline">— By the numbers</p>
            <h2 className="mt-5 hero-headline text-[clamp(36px,5vw,72px)] max-w-3xl text-ink leading-[1.05]">
              A decade of frames,
              <br />
              <span className="text-vermillion">shipped</span> with intent.
            </h2>
          </div>
          <p className="hidden md:block max-w-xs font-body text-[14px] leading-relaxed text-slate">
            Numbers we like, but the work is what we&apos;d rather you remember.
          </p>
        </div>
      </div>

      {/* Static editorial grid */}
      <div className="relative border-y border-parchment mt-10 md:mt-14">
        {/* corner meta */}
        <div className="container-tero relative">
          <div className="absolute top-3 left-4 md:left-6 z-20 font-mono text-[10px] uppercase tracking-[0.3em] text-ink/40">
            ▸ Reel · Stats 2024
          </div>
          <div className="absolute bottom-3 right-4 md:right-6 z-20 font-mono text-[10px] uppercase tracking-[0.3em] text-ink/40">
            Independent ●
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 divide-x divide-y md:divide-y-0 divide-parchment border-x border-parchment">
            {stats.map((s, i) => (
              <StatCard key={i} index={i} {...s} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
