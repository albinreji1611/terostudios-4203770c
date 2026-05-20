import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Instagram, Linkedin, Youtube } from "lucide-react";
import logo from "@/assets/tero-mark.png";

const services = [
  "3D Animation",
  "2D Animation",
  "Motion Graphics",
  "Explainer Videos",
  "Visual Effects",
  "Character Animation",
  "Product Animation",
  "Brand Films",
  "Title Sequences",
  "AR / VR Content",
];

export function Footer() {
  return (
    <footer className="bg-ink text-cream">
      {/* Final CTA strip */}
      <section className="border-b border-white/10">
        <div className="container-tero grid grid-cols-1 gap-10 py-24 md:grid-cols-12 md:py-32">
          <div className="md:col-span-8">
            <p className="overline text-vermillion">— Let&apos;s make something</p>
            <h2 className="mt-6 hero-headline text-[clamp(48px,8vw,112px)] text-cream">
              Have a story <br />
              <span className="italic">worth moving?</span>
            </h2>
          </div>
          <div className="md:col-span-4 flex flex-col justify-end gap-6">
            <p className="font-body text-[16px] leading-relaxed text-cream/70 max-w-sm">
              From a back-of-napkin idea to a finished film, we&apos;d love to
              hear what you&apos;re building.
            </p>
            <Link
              to="/contact"
              className="group inline-flex items-center justify-between gap-4 rounded-[4px] border border-cream/30 px-6 py-5 text-[15px] font-medium text-cream transition-colors hover:bg-cream hover:text-ink"
            >
              Start the conversation
              <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>
          </div>
        </div>
      </section>

      <div className="container-tero grid grid-cols-2 gap-12 py-20 md:grid-cols-12">
        <div className="col-span-2 md:col-span-4">
          <div className="flex items-center gap-3">
            <img src={logo} alt="" width={36} height={36} className="h-9 w-9 object-contain" />
            <span className="font-sans-display text-[16px] font-bold tracking-wider">
              TERO<span className="text-vermillion">/</span>STUDIOS
            </span>
          </div>
          <p className="mt-6 max-w-xs font-body text-[14px] leading-relaxed text-cream/60">
            An animation and motion design studio building films, frames and
            stories that move.
          </p>
          <div className="mt-8 flex items-center gap-3">
            {[
              { Icon: Instagram, href: "https://instagram.com" },
              { Icon: Linkedin, href: "https://linkedin.com" },
              { Icon: Youtube, href: "https://youtube.com" },
            ].map(({ Icon, href }, i) => (
              <a
                key={i}
                href={href}
                aria-label="Social"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-cream/20 text-cream/80 transition-colors hover:border-vermillion hover:text-vermillion"
              >
                <Icon className="h-4 w-4" strokeWidth={1.5} />
              </a>
            ))}
          </div>
        </div>

        <div className="col-span-1 md:col-span-3">
          <p className="overline mb-5 text-cream/50">Services</p>
          <ul className="space-y-3">
            {services.slice(0, 5).map((s) => (
              <li key={s}>
                <Link
                  to="/services"
                  className="font-body text-[14px] text-cream/80 hover:text-vermillion transition-colors"
                >
                  {s}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="col-span-1 md:col-span-3">
          <p className="overline mb-5 text-cream/50">More services</p>
          <ul className="space-y-3">
            {services.slice(5).map((s) => (
              <li key={s}>
                <Link
                  to="/services"
                  className="font-body text-[14px] text-cream/80 hover:text-vermillion transition-colors"
                >
                  {s}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="col-span-2 md:col-span-2">
          <p className="overline mb-5 text-cream/50">Studio</p>
          <ul className="space-y-3">
            {[
              { to: "/about", label: "About" },
              { to: "/team", label: "Team" },
              { to: "/portfolio", label: "Portfolio" },
              { to: "/blog", label: "Journal" },
              { to: "/contact", label: "Contact" },
            ].map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="font-body text-[14px] text-cream/80 hover:text-vermillion transition-colors"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-tero flex flex-col gap-3 py-6 md:flex-row md:items-center md:justify-between">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-cream/40">
            © {new Date().getFullYear()} Tero Studios — Crafted with care
          </p>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-cream/40">
            Bengaluru · India
          </p>
        </div>
      </div>
    </footer>
  );
}
