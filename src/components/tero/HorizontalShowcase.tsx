import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import p1 from "@/assets/portfolio-1.jpg";
import p2 from "@/assets/portfolio-2.jpg";
import p3 from "@/assets/portfolio-3.jpg";
import p4 from "@/assets/portfolio-4.jpg";
import p5 from "@/assets/portfolio-5.jpg";
import p6 from "@/assets/portfolio-6.jpg";
import { Reveal } from "./Reveal";

const cards = [
  { img: p1, client: "GlassWorks", title: "Refraction", tag: "3D / Brand Film" },
  { img: p2, client: "Kinetic Type Co.", title: "Editorial Set", tag: "Motion Graphics" },
  { img: p3, client: "Toy Atelier", title: "Mr. Sprout", tag: "Character / 3D" },
  { img: p4, client: "Finlytics", title: "Onboarding Reel", tag: "Explainer" },
  { img: p5, client: "Mirage Films", title: "Ember", tag: "VFX / Compositing" },
  { img: p6, client: "Auraware", title: "Quiet Vessels", tag: "Product 3D" },
];

export function HorizontalShowcase() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-72%"]);

  return (
    <section
      ref={ref}
      className="relative bg-cream"
      style={{ height: `${cards.length * 60}vh` }}
    >
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="container-tero mb-10">
          <Reveal>
            <p className="overline">— Selected projects</p>
            <h2 className="mt-4 hero-headline text-[clamp(40px,6vw,80px)] max-w-3xl">
              A cinematic strip of recent work.
            </h2>
          </Reveal>
        </div>

        <motion.div style={{ x }} className="flex gap-8 pl-[8vw] pr-[10vw] will-change-transform" >
          {cards.map((c, i) => {
            const tilt = (i % 2 === 0 ? -1 : 1) * (3 + (i % 3));
            return (
            <motion.a
              key={i}
              href="/portfolio"
              initial={{ rotate: tilt, y: 30 }}
              whileInView={{ rotate: 0, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative w-[68vw] md:w-[44vw] shrink-0 overflow-hidden rounded-2xl border border-parchment bg-card shadow-[0_30px_60px_-40px_rgba(17,19,24,0.45)]"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={c.img}
                  alt={c.title}
                  loading="lazy"
                  width={1280}
                  height={800}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <span className="pointer-events-none absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-vermillion text-white opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-0 translate-x-2">
                  →
                </span>
              </div>
              <div className="flex items-end justify-between gap-4 p-6 md:p-8">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-vermillion">
                    {String(i + 1).padStart(2, "0")} / {cards.length}
                  </p>
                  <h3 className="mt-3 font-display text-[clamp(28px,3vw,44px)] leading-tight text-ink">
                    {c.title}
                  </h3>
                  <p className="mt-1 font-body text-[14px] text-slate">
                    {c.client} · {c.tag}
                  </p>
                </div>
              </div>
            </a>
          ))}
        </motion.div>

        <div className="container-tero mt-10 flex items-center justify-between text-slate">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em]">
            Scroll to advance →
          </p>
          <a
            href="/portfolio"
            className="link-underline font-body text-[14px]"
          >
            Full portfolio
          </a>
        </div>
      </div>
    </section>
  );
}
