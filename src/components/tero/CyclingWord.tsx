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
    <span className="relative inline-flex items-center h-8 md:h-10 min-w-[90px] md:min-w-[110px] overflow-hidden leading-none ml-2 md:ml-3">
      <span className="relative block h-full w-full" style={{ paddingTop: "1px" }}>
        <AnimatePresence mode="wait">
          <motion.span
            key={cyclingWords[i]}
            initial={{ y: "100%", opacity: 0, filter: "blur(6px)" }}
            animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
            exit={{ y: "-100%", opacity: 0, filter: "blur(4px)" }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className={[
              "absolute inset-0 flex items-center whitespace-nowrap transition-colors",
              onDark ? "text-white" : "text-ink",
            ].join(" ")}
          >
            <span className="tero-logo-cycle-text text-[15px] md:text-[18px]">{cyclingWords[i]}</span>
          </motion.span>
        </AnimatePresence>
      </span>
    </span>
  );
}
