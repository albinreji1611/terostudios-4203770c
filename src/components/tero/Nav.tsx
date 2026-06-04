import { Link, useLocation } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import teroWordmark from "@/assets/tero-wordmark.png";
import { servicesByCategory } from "@/data/services";
import { industries } from "@/data/industries";

const cyclingWords = ["Studios", "Create.", "Visualize.", "Immerse."];


function CyclingWord({ onDark }: { onDark: boolean }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % cyclingWords.length), 2200);
    return () => clearInterval(t);
  }, []);
  return (
    <span className="relative inline-flex h-7 md:h-8 min-w-[116px] md:min-w-[132px] overflow-visible leading-none ml-1.5 translate-y-[5px] md:translate-y-[5px]">
      <AnimatePresence mode="wait">
        <motion.span
          key={cyclingWords[i]}
          initial={{ y: "100%", opacity: 0, filter: "blur(6px)" }}
          animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
          exit={{ y: "-100%", opacity: 0, filter: "blur(4px)" }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className={[
            "absolute left-0 bottom-0 whitespace-nowrap transition-colors",
            onDark ? "text-white" : "text-ink",
          ].join(" ")}
        >
          <span className="tero-logo-cycle-text text-[25px] md:text-[28px]">{cyclingWords[i]}</span>
        </motion.span>
      </AnimatePresence>
    </span>
  );
}





type Item =
  | { to: string; label: string; mega?: never }
  | { to: string; label: string; mega: "services" | "industries" };

const items: Item[] = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services", mega: "services" },
  { to: "/industries", label: "Industries", mega: "industries" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/about", label: "About" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact" },
];

function isLightColor(rgb: string): boolean {
  const m = rgb.match(/rgba?\(([^)]+)\)/);
  if (!m) return false;
  const parts = m[1].split(",").map((s) => parseFloat(s.trim()));
  const [r, g, b, a = 1] = parts;
  if (a === 0) return false;
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return lum > 0.6;
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [lightBg, setLightBg] = useState(false);
  const [openMega, setOpenMega] = useState<"services" | "industries" | null>(null);
  const { pathname } = useLocation();
  const logoRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    let ticking = false;
    let lastDetect = 0;
    const detect = () => {
      ticking = false;
      const now = performance.now();
      setScrolled(window.scrollY > 60);
      if (now - lastDetect < 180) return;
      lastDetect = now;
      const el = logoRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const x = r.left + r.width / 2;
      const y = r.top + r.height / 2;
      const prev = el.style.pointerEvents;
      el.style.pointerEvents = "none";
      const stack = document.elementsFromPoint(x, y);
      el.style.pointerEvents = prev;
      let light: boolean | null = null;
      for (const node of stack) {
        if (!(node instanceof HTMLElement)) continue;
        if (node.closest("header")) continue;
        const themed = node.closest<HTMLElement>("[data-nav-theme]");
        if (themed) {
          light = themed.dataset.navTheme === "light";
          break;
        }
      }
      if (light === null) {
        light = false;
        for (const node of stack) {
          if (!(node instanceof HTMLElement)) continue;
          if (node.closest("header")) continue;
          const bg = getComputedStyle(node).backgroundColor;
          const m = bg.match(/rgba?\(([^)]+)\)/);
          if (!m) continue;
          const parts = m[1].split(",").map((s) => parseFloat(s.trim()));
          const a = parts[3] ?? 1;
          if (a === 0) continue;
          light = isLightColor(bg);
          break;
        }
      }
      setLightBg(light);
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(detect);
    };
    detect();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    setOpen(false);
    setOpenMega(null);
  }, [pathname]);

  const onDark = !lightBg;
  const grouped = servicesByCategory();

  return (
    <header
      className="fixed left-0 right-0 top-0 z-50 pointer-events-none"
      onMouseLeave={() => setOpenMega(null)}
    >
      <div
        className={[
          "absolute inset-0 transition-all duration-500",
          openMega
            ? "opacity-100 bg-cream/95 backdrop-blur-xl border-b border-ink/8"
            : "opacity-0",
        ].join(" ")}
      />

      <div className="relative container-tero flex h-[72px] items-center justify-between pointer-events-auto">
        <Link
          ref={logoRef}
          to="/"
          className="flex items-center gap-0 group"
          aria-label="Tero Studios home"
        >
          <img
            src={teroWordmark}
            alt="Tero"
            width={1317}
            height={480}
            className={[
              "h-7 md:h-8 w-auto object-contain transition-[filter] duration-300",
              openMega || lightBg ? "[filter:brightness(0)]" : "[filter:brightness(0)_invert(1)]",
            ].join(" ")}
          />
          <CyclingWord onDark={!openMega && !lightBg} />
        </Link>



        <nav className="hidden lg:flex items-center gap-8">
          {items.map((it) => {
            const active = pathname === it.to || pathname.startsWith(it.to + "/");
            const isLightText = !openMega && onDark;
            if (it.mega) {
              return (
                <div key={it.to} onMouseEnter={() => setOpenMega(it.mega!)}>
                  <Link
                    to={it.to}
                    className={[
                      "relative inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-[0.22em] font-medium transition-colors",
                      isLightText
                        ? active ? "text-white" : "text-white/70 hover:text-white"
                        : active ? "text-ink" : "text-ink/60 hover:text-ink",
                    ].join(" ")}
                  >
                    {it.label}
                    <ChevronDown className="h-3 w-3" strokeWidth={2} />
                    <span
                      className={[
                        "absolute -bottom-1.5 left-0 h-px bg-vermillion transition-transform duration-300 origin-left",
                        active ? "w-full scale-x-100" : "w-full scale-x-0",
                      ].join(" ")}
                    />
                  </Link>
                </div>
              );
            }
            return (
              <Link
                key={it.to}
                to={it.to}
                onMouseEnter={() => setOpenMega(null)}
                className={[
                  "relative font-mono text-[11px] uppercase tracking-[0.22em] font-medium transition-colors",
                  isLightText
                    ? active ? "text-white" : "text-white/70 hover:text-white"
                    : active ? "text-ink" : "text-ink/60 hover:text-ink",
                ].join(" ")}
              >
                {it.label}
                <span
                  className={[
                    "absolute -bottom-1.5 left-0 h-px bg-vermillion transition-transform duration-300 origin-left",
                    active ? "w-full scale-x-100" : "w-full scale-x-0",
                  ].join(" ")}
                />
              </Link>
            );
          })}
        </nav>

        <Link
          to="/contact"
          className="hidden lg:inline-flex items-center gap-2 bg-ink px-5 py-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-cream transition-all hover:bg-vermillion"
        >
          Start a project
        </Link>

        <button
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
          className={[
            "lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-md border transition-colors",
            !lightBg
              ? "border-white/20 bg-white/5 text-white"
              : "border-ink/15 bg-ink/5 text-ink",
          ].join(" ")}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mega menu — services */}
      {openMega === "services" && (
        <div className="relative pointer-events-auto border-t border-ink/8 bg-cream/95 backdrop-blur-xl">
          <div className="container-tero grid grid-cols-4 gap-8 py-10">
            {Object.entries(grouped).map(([cat, list]) => (
              <div key={cat}>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-vermillion">— {cat}</p>
                <ul className="mt-4 space-y-2.5">
                  {list.map((s) => (
                    <li key={s.slug}>
                      <Link
                        to="/services/$slug"
                        params={{ slug: s.slug }}
                        className="font-body text-[14px] text-ink/80 hover:text-vermillion"
                      >
                        {s.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mega menu — industries */}
      {openMega === "industries" && (
        <div className="relative pointer-events-auto border-t border-ink/8 bg-cream/95 backdrop-blur-xl">
          <div className="container-tero grid grid-cols-3 gap-x-8 gap-y-3 py-10">
            {industries.map((i) => (
              <Link
                key={i.slug}
                to="/industries/$slug"
                params={{ slug: i.slug }}
                className="flex items-baseline justify-between gap-4 border-b border-parchment py-2 font-body text-[14px] text-ink/80 hover:text-vermillion"
              >
                <span>{i.name}</span>
                {i.badge && (
                  <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-vermillion">
                    {i.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}

      {open && (
        <div className="lg:hidden border-t border-parchment bg-cream pointer-events-auto max-h-[80vh] overflow-y-auto">
          <div className="container-tero flex flex-col gap-1 py-4">
            {items.map((it) => (
              <Link
                key={it.to}
                to={it.to}
                className="rounded-md px-3 py-3 text-[15px] font-medium text-ink hover:bg-muted"
              >
                {it.label}
              </Link>
            ))}
            <Link
              to="/contact"
              className="mt-2 inline-flex items-center justify-center rounded-[4px] bg-gradient-to-br from-[#E8390E] to-[#C42D06] px-5 py-3 text-[14px] font-medium text-white"
            >
              Start a project
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
