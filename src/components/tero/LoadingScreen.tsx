import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import logo from "@/assets/tero-mark.png";

export function LoadingScreen() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("tero-loaded") === "1") return;
    setShow(true);
    sessionStorage.setItem("tero-loaded", "1");
    const t = setTimeout(() => setShow(false), 1600);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-cream overflow-hidden"
        >
          {/* Vermillion sweep */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            exit={{ scaleX: 0, originX: 1 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            style={{ originX: 0 }}
            className="absolute top-0 left-0 h-[2px] w-full bg-vermillion"
          />

          {/* Logo reveal */}
          <div className="relative overflow-hidden">
            <motion.img
              src={logo}
              alt="Tero Studios"
              width={260}
              height={60}
              className="h-12 md:h-14 w-auto object-contain [filter:brightness(0)]"
              initial={{ y: "110%" }}
              animate={{ y: "0%" }}
              exit={{ y: "-110%" }}
              transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>

          {/* Overline tag */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mt-5 font-mono text-[10px] uppercase tracking-[0.32em] text-ink/60"
          >
            <span className="text-vermillion">—</span> Tero Studios
          </motion.p>

          {/* Bottom vermillion sweep */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            exit={{ scaleX: 0, originX: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            style={{ originX: 1 }}
            className="absolute bottom-0 left-0 h-[2px] w-full bg-vermillion"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
