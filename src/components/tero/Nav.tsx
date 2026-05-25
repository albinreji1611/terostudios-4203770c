import { Link, useLocation } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import logo from "@/assets/tero-mark.png";

const items = [
  { to: "/", label: "Work" },
  { to: "/services", label: "Services" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/about", label: "Studio" },
  { to: "/team", label: "Team" },
  { to: "/blog", label: "Journal" },
];

// Parse rgb/rgba string and determine if it's a "light" color
function isLightColor(rgb: string): boolean {
  const m = rgb.match(/rgba?\(([^)]+)\)/);
  if (!m) return false;
  const parts = m[1].split(",").map((s) => parseFloat(s.trim()));
  const [r, g, b, a = 1] = parts;
  if (a === 0) return false;
  // Perceived luminance
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return lum > 0.6;
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [lightBg, setLightBg] = useState(false);
  const { pathname } = useLocation();
  const logoRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    let ticking = false;
    let lastDetect = 0;
    const detect = () => {
      ticking = false;
      const now = performance.now();
      setScrolled(window.scrollY > 60);

      // Throttle the expensive elementsFromPoint/getComputedStyle work
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

      let light = false;
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

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="fixed left-0 right-0 top-0 z-50 pointer-events-none">
      {/* Bar background — editorial cream bar that slides up on scroll */}
      <div
        className={[
          "absolute inset-0 transition-all duration-500",
          scrolled
            ? "-translate-y-full opacity-0"
            : "translate-y-0 opacity-100 bg-cream/85 backdrop-blur-xl border-b border-ink/8",
        ].join(" ")}
      />

      <div className="relative container-tero flex h-[72px] items-center justify-between pointer-events-auto">
        <Link
          ref={logoRef}
          to="/"
          className="flex items-center group"
          aria-label="Tero Studios home"
        >
          <img
            src={logo}
            alt="Tero Studios"
            width={220}
            height={50}
            className={[
              "h-9 md:h-10 w-auto object-contain transition-[filter] duration-300",
              // Default cream bar = dark logo. When bar gone over dark bg, invert to white.
              scrolled && !lightBg ? "[filter:invert(1)_brightness(2)]" : "[filter:invert(1)_brightness(0)]",
            ].join(" ")}
          />
        </Link>

        <nav className="hidden md:flex items-center gap-9">
          {items.map((it) => {
            const active = pathname === it.to;
            // While bar is visible (not scrolled) → ink text on cream.
            // After bar slides up → adapt to underlying bg.
            const onDark = scrolled && !lightBg;
            return (
              <Link
                key={it.to}
                to={it.to}
                className={[
                  "relative font-mono text-[11px] uppercase tracking-[0.22em] font-medium transition-colors",
                  onDark
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
          className="hidden md:inline-flex items-center gap-2 bg-ink px-5 py-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-cream transition-all hover:bg-vermillion"
        >
          Start a project
        </Link>

        <button
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
          className={[
            "md:hidden inline-flex h-10 w-10 items-center justify-center rounded-md border transition-colors",
            scrolled && !lightBg
              ? "border-white/20 bg-white/5 text-white"
              : "border-ink/15 bg-ink/5 text-ink",
          ].join(" ")}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-parchment bg-cream pointer-events-auto">
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
