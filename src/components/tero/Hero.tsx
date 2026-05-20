import { motion } from "framer-motion";
import hero from "@/assets/hero-fluid.jpg";
import { Link } from "@tanstack/react-router";
import { ArrowDown } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-cream">
      <div className="container-tero relative pt-12 pb-24 md:pt-20 md:pb-32">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="overline"
        >
          — Animation Studio · Est. 2014 · Bengaluru
        </motion.p>

        <h1 className="mt-8 hero-headline text-[clamp(56px,11vw,160px)] text-ink">
          {["Stories", "that move,"].map((w, i) => (
            <motion.span
              key={i}
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{
                duration: 0.9,
                delay: 0.3 + i * 0.12,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="block overflow-hidden"
            >
              <span className="block">{w}</span>
            </motion.span>
          ))}
          <motion.span
            initial={{ y: "110%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.9, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="block overflow-hidden"
          >
            <span className="block">
              frames <span className="text-vermillion">that stay.</span>
            </span>
          </motion.span>
        </h1>

        <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-12 md:items-end">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.9 }}
            className="md:col-span-5 max-w-md font-body text-[18px] leading-relaxed text-slate"
          >
            Tero is an independent animation studio crafting films, motion
            design and visual effects for brands with something real to say.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.0 }}
            className="md:col-span-7 flex flex-wrap items-center gap-4 md:justify-end"
          >
            <Link
              to="/portfolio"
              className="inline-flex items-center gap-3 rounded-[4px] bg-gradient-to-br from-[#E8390E] to-[#C42D06] px-7 py-4 text-[15px] font-medium text-white shadow-[0_8px_24px_rgba(232,57,14,0.25)] transition-transform hover:scale-[1.03] active:scale-[0.98]"
            >
              See selected work
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-3 rounded-[4px] border-[1.5px] border-ink px-7 py-4 text-[15px] font-medium text-ink transition-colors hover:bg-ink hover:text-cream"
            >
              Start a project
            </Link>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 1.04 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="relative mx-auto max-w-[1500px] px-6"
      >
        <div className="relative overflow-hidden rounded-2xl border border-parchment">
          <img
            src={hero}
            alt="Abstract 3D fluid form animation still"
            width={1600}
            height={1024}
            className="w-full h-auto block"
          />
          <div className="absolute left-4 bottom-4 flex items-center gap-3 rounded-full bg-cream/85 px-4 py-2 backdrop-blur-sm">
            <span className="inline-block h-2 w-2 rounded-full bg-vermillion animate-pulse" />
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink">
              Reel 2026 · Now playing
            </span>
          </div>
        </div>
      </motion.div>

      <div className="container-tero mt-10 flex items-center justify-between text-slate">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em]">
          Scroll to explore
        </p>
        <ArrowDown className="h-4 w-4 animate-bounce" strokeWidth={1.5} />
      </div>
    </section>
  );
}
