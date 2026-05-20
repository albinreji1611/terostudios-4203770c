import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { Reveal } from "./Reveal";

const faqs = [
  {
    q: "What kinds of projects do you take on?",
    a: "Brand films, explainers, ad campaigns, character work, product animation, motion design systems and visual effects for live action. If it moves on a screen and tells a story, we&apos;re probably the right fit.",
  },
  {
    q: "How long does a typical project take?",
    a: "Anywhere from three weeks for a focused motion piece to twelve weeks for a 90-second 3D film. We&apos;ll share a realistic timeline within 48 hours of receiving your brief.",
  },
  {
    q: "Do you work with agencies as a white-label partner?",
    a: "Yes — about 30% of our work is white-label production for agencies in the US, UK and India. We&apos;ll deliver under NDA and integrate into your existing creative workflow.",
  },
  {
    q: "What does pricing look like?",
    a: "Projects start at around $6,000 for a short motion film and scale up based on scope, duration and animation style. We share a fixed quote after a 30-minute scoping call.",
  },
  {
    q: "Where is the studio based?",
    a: "Our home studio is in Bengaluru, India, with collaborators in Mumbai, Berlin and Toronto. We work asynchronously with clients across every timezone.",
  },
  {
    q: "Do you handle scripting and storyboarding?",
    a: "Always. Most of our work begins with a written treatment and a frame-by-frame board — that&apos;s where the film is actually made.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState(0);
  return (
    <section className="bg-cream">
      <div className="container-tero py-24 md:py-40">
        <div className="grid grid-cols-1 gap-16 md:grid-cols-12">
          <div className="md:col-span-5">
            <Reveal>
              <p className="overline">— Frequently asked</p>
              <h2 className="mt-6 hero-headline text-[clamp(48px,8vw,128px)] leading-[0.9]">
                Honest <br /> answers.
              </h2>
              <p className="mt-8 max-w-sm font-body text-[15px] leading-relaxed text-slate">
                The questions clients ask us most often, answered without
                marketing speak.
              </p>
            </Reveal>
          </div>

          <div className="md:col-span-7">
            <ul>
              {faqs.map((f, i) => {
                const isOpen = open === i;
                return (
                  <li key={i} className="border-b border-parchment">
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? -1 : i)}
                      className="group flex w-full items-start justify-between gap-6 py-6 text-left"
                    >
                      <div className="flex items-start gap-6">
                        <span className="font-mono text-[11px] mt-1.5 uppercase tracking-[0.2em] text-vermillion">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <h3 className="font-sans-display text-[20px] md:text-[24px] font-bold text-ink">
                          {f.q}
                        </h3>
                      </div>
                      <Plus
                        strokeWidth={1.5}
                        className={[
                          "h-6 w-6 mt-1 shrink-0 text-ink transition-transform duration-300",
                          isOpen ? "rotate-45 text-vermillion" : "",
                        ].join(" ")}
                      />
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: [0.45, 0, 0.55, 1] }}
                          className="overflow-hidden"
                        >
                          <p
                            className="pb-7 pl-[64px] pr-4 font-body text-[15px] leading-relaxed text-slate max-w-xl"
                            dangerouslySetInnerHTML={{ __html: f.a }}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
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
