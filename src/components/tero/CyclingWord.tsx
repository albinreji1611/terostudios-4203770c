import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const cyclingWords = ["Studio", "Create", "Visualize", "Immerse"];

export function CyclingWord({ onDark }: { onDark: boolean }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % cyclingWords.length), 2200);
    return () => clearInterval(t);
  }, []);
  return (
    <span className="relative inline-flex items-center h-10 md:h-12 min-w-[120px] md:min-w-[150px] overflow-hidden leading-none ml-2 md:ml-3">
      <span className="relative block h-full w-full" style={{ paddingTop: "1px" }}>
        <AnimatePresence mode="wait">
          <motion.span
            key={cyclingWords[i]}
            initial={{ y: "100%", opacity: 0, filter: "blur(6px)", scale: cyclingWords[i] === "Studio" ? 0.5 : 1 }}
            animate={{
              y: "0%",
              opacity: 1,
              filter: "blur(0px)",
              scale: cyclingWords[i] === "Studio" ? [0.5, 1.2, 1] : 1,
            }}
            exit={{ y: "-100%", opacity: 0, filter: "blur(4px)" }}
            transition={{
              duration: cyclingWords[i] === "Studio" ? 0.95 : 0.55,
              ease: [0.16, 1, 0.3, 1],
              scale: { duration: 1.1, ease: [0.16, 1, 0.3, 1], times: [0, 0.6, 1] },
            }}
            style={{ transformOrigin: "left center" }}
            className={[
              "absolute inset-0 flex items-center whitespace-nowrap transition-colors",
              onDark ? "text-white" : "text-ink",
            ].join(" ")}
          >
            <span className="tero-logo-cycle-text text-[20px] md:text-[26px]">{cyclingWords[i]}</span>
          </motion.span>
        </AnimatePresence>
      </span>
    </span>
  );
}
