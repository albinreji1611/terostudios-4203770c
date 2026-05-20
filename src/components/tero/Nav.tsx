import { Link, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
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

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={[
        "fixed left-0 right-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-cream/95 backdrop-blur-lg border-b border-parchment"
          : "bg-transparent",
      ].join(" ")}
    >
      <div className="container-tero flex h-[68px] items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group" aria-label="Tero Studios home">
          <img src={logo} alt="" width={32} height={32} className="h-8 w-8 object-contain" />
          <span className="font-sans-display text-[15px] font-bold tracking-wider text-ink">
            TERO<span className="text-vermillion">/</span>STUDIOS
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {items.map((it) => {
            const active = pathname === it.to;
            return (
              <Link
                key={it.to}
                to={it.to}
                className={[
                  "relative font-body text-[14px] font-medium transition-colors",
                  active ? "text-ink" : "text-ink/80 hover:text-ink",
                ].join(" ")}
              >
                {it.label}
                <span
                  className={[
                    "absolute -bottom-1 left-0 h-[2px] bg-vermillion transition-transform duration-300",
                    active ? "w-full scale-x-100" : "w-full scale-x-0",
                  ].join(" ")}
                />
              </Link>
            );
          })}
        </nav>

        <Link
          to="/contact"
          className="hidden md:inline-flex items-center gap-2 rounded-[4px] bg-gradient-to-br from-[#E8390E] to-[#C42D06] px-5 py-2.5 text-[13px] font-medium text-white shadow-[0_6px_20px_rgba(232,57,14,0.25)] transition-transform hover:scale-[1.03] active:scale-[0.98]"
        >
          Start a project
        </Link>

        <button
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
          className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-md border border-parchment bg-card"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-parchment bg-cream">
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
