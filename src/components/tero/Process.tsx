import { useState } from "react";
import { Reveal } from "./Reveal";
import { motion, AnimatePresence } from "framer-motion";
import p1 from "@/assets/portfolio-1.jpg";
import p2 from "@/assets/portfolio-2.jpg";
import p3 from "@/assets/portfolio-3.jpg";
import p4 from "@/assets/portfolio-4.jpg";
import p6 from "@/assets/portfolio-6.jpg";

const steps = [
  { n: "01", t: "Discovery", d: "We start with a single conversation. What's the story, who's it for, where does it live, and what does success actually look like.", img: p1 },
  { n: "02", t: "Concept", d: "Mood boards, written treatments and tone references. We commit to a creative direction before a single frame is drawn.", img: p2 },
  { n: "03", t: "Storyboard", d: "Frame-by-frame planning. Every beat, every cut, every transition mapped before production begins.", img: p3 },
  { n: "04", t: "Production", d: "Design, animation, 3D, VFX and sound — built in parallel by senior leads, with weekly reviews shared on Frame.io.", img: p4 },
  { n: "05", t: "Delivery", d: "Final masters in every format you need, plus the source files. We stay available for two weeks of free polish post-launch.", img: p6 },
];

export function Process() {
  const [active, setActive] = useState(0);
  return (
    <section className="border-y border-parchment bg-card">
      <div className="container-tero py-24 md:py-40">
        <Reveal>
          <p className="overline">— How we work</p>
          <h2 className="mt-6 hero-headline text-[clamp(40px,7vw,96px)] max-w-3xl">
            Five steps between brief and broadcast.
          </h2>
        </Reveal>

        <div className="mt-20 grid grid-cols-1 gap-16 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-parchment bg-cream">
              <AnimatePresence mode="wait">
                <motion.img
                  key={steps[active].img}
                  src={steps[active].img}
                  alt={steps[active].t}
                  width={1280}
                  height={800}
                  loading="lazy"
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </AnimatePresence>
            </div>
          </div>

          <div className="md:col-span-7">
            <ol className="space-y-2">
              {steps.map((s, i) => {
                const isActive = active === i;
                return (
                  <li key={s.n}>
                    <button
                      type="button"
                      onClick={() => setActive(i)}
                      onMouseEnter={() => setActive(i)}
                      className="group w-full text-left border-b border-parchment py-6 flex items-start gap-6"
                    >
                      <span
                        className={[
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-[12px] font-medium transition-colors",
                          isActive
                            ? "bg-vermillion border-vermillion text-white"
                            : i < active
                              ? "bg-ink border-ink text-cream"
                              : "border-parchment text-slate",
                        ].join(" ")}
                      >
                        {s.n}
                      </span>
                      <div className="flex-1">
                        <h3
                          className={[
                            "font-sans-display text-[22px] md:text-[28px] font-bold transition-colors",
                            isActive ? "text-ink" : "text-ink/45",
                          ].join(" ")}
                        >
                          {s.t}
                        </h3>
                        <motion.div
                          initial={false}
                          animate={{ opacity: isActive ? 1 : 0, height: isActive ? "auto" : 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <p className="mt-3 max-w-xl font-body text-[15px] leading-relaxed text-slate">
                            {s.d}
                          </p>
                        </motion.div>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
