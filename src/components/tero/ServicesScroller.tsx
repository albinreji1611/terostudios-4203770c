import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import p1 from "@/assets/portfolio-1.jpg";
import p2 from "@/assets/portfolio-2.jpg";
import p3 from "@/assets/portfolio-3.jpg";
import p4 from "@/assets/portfolio-4.jpg";
import p5 from "@/assets/portfolio-5.jpg";
import { Reveal } from "./Reveal";
import { ArrowUpRight } from "lucide-react";

const services = [
  {
    n: "01",
    name: "3D Animation",
    img: p1,
    desc: "Photoreal product, character and environment animation rendered at film quality.",
  },
  {
    n: "02",
    name: "2D Motion Graphics",
    img: p2,
    desc: "Editorial-grade typography, transitions and brand systems that move with rhythm.",
  },
  {
    n: "03",
    name: "Character Animation",
    img: p3,
    desc: "Stylised characters with performance — from rig to final hand-drawn texture.",
  },
  {
    n: "04",
    name: "Explainer & UI",
    img: p4,
    desc: "Product films that turn complex software stories into one-watch clarity.",
  },
  {
    n: "05",
    name: "Visual Effects",
    img: p5,
    desc: "Live-action compositing, simulations and finishing for ads and short films.",
  },
];

export function ServicesScroller() {
  const [active, setActive] = useState(0);

  return (
    <section className="bg-cream">
      <div className="container-tero py-24 md:py-40">
        <Reveal>
          <p className="overline">— What we make</p>
          <h2 className="mt-6 hero-headline text-[clamp(40px,7vw,96px)] max-w-3xl">
            A studio built around five quiet disciplines.
          </h2>
        </Reveal>

        <div className="mt-20 grid grid-cols-1 gap-16 md:grid-cols-12">
          {/* Visual side */}
          <div className="md:col-span-6 md:sticky md:top-32 self-start">
            <div className="relative aspect-[5/4] overflow-hidden rounded-2xl border border-parchment bg-card">
              <AnimatePresence mode="wait">
                <motion.img
                  key={services[active].img}
                  src={services[active].img}
                  alt={services[active].name}
                  width={1280}
                  height={800}
                  loading="lazy"
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </AnimatePresence>
              <div className="absolute left-5 top-5 rounded-full bg-cream/90 px-3 py-1.5 backdrop-blur-sm">
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink">
                  {services[active].n} / 05
                </span>
              </div>
            </div>
          </div>

          {/* List side */}
          <div className="md:col-span-6">
            <ul>
              {services.map((s, i) => {
                const isActive = active === i;
                return (
                  <li
                    key={s.n}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => setActive(i)}
                    className="group cursor-pointer border-b border-parchment py-8 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-6">
                      <div className="flex-1">
                        <p
                          className={[
                            "font-mono text-[11px] uppercase tracking-[0.2em] transition-colors",
                            isActive ? "text-vermillion" : "text-slate",
                          ].join(" ")}
                        >
                          — Service {s.n}
                        </p>
                        <h3
                          className={[
                            "mt-3 font-display text-[clamp(36px,5.5vw,72px)] leading-[0.95] transition-colors",
                            isActive ? "text-ink" : "text-ink/35",
                          ].join(" ")}
                        >
                          {s.name}
                        </h3>
                        <motion.p
                          initial={false}
                          animate={{
                            opacity: isActive ? 1 : 0,
                            height: isActive ? "auto" : 0,
                          }}
                          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden font-body text-[15px] leading-relaxed text-slate max-w-md"
                        >
                          <span className="block pt-4">{s.desc}</span>
                        </motion.p>
                      </div>
                      <ArrowUpRight
                        className={[
                          "h-6 w-6 mt-3 transition-all",
                          isActive
                            ? "text-vermillion translate-x-0 -translate-y-0"
                            : "text-ink/30",
                        ].join(" ")}
                        strokeWidth={1.5}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
