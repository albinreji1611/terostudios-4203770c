import type { ReactNode } from "react";
import { Nav } from "./Nav";
import { Footer } from "./Footer";
import { ScrollProgress } from "./ScrollProgress";
import { TeroCursor } from "./Cursor";
import { LoadingScreen } from "./LoadingScreen";
import { AmbientGlow } from "./AmbientGlow";
import { motion } from "framer-motion";

export function PageLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-cream text-ink min-h-screen relative">
      <LoadingScreen />
      <AmbientGlow />
      <ScrollProgress />
      <Nav />
      <TeroCursor />
      <motion.main
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="pt-[68px] relative z-10"
      >
        {children}
      </motion.main>
      <Footer />
    </div>
  );
}
