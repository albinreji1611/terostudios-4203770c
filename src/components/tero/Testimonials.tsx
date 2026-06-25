import { Reveal } from "./Reveal";
import bhimaLogo from "@/assets/client-logos-white/bhima.png.asset.json";
import forumLogo from "@/assets/client-logos-white/forum.png.asset.json";
import luluLogo from "@/assets/client-logos-white/lulu.png.asset.json";
import stEngLogo from "@/assets/client-logos-white/steng.png.asset.json";
import shotLogo from "@/assets/client-logos-white/shot.png.asset.json";

type Testimonial = {
  quote: string;
  name: string;
  role: string;
  company: string;
  logo: string;
  project: string;
  accent?: boolean;
};

const items: Testimonial[] = [
  {
    quote:
      "For our Vara Mahalakshmi 2025 campaign, Tero Studios crafted an anamorphic video that perfectly merged tradition with innovation, making a strong impact on our audience.",
    name: "Sibi Jacob",
    role: "Brand Manager",
    company: "Bhima Gold",
    logo: bhimaLogo.url,
    project: "Vara Mahalakshmi · Anamorphic",
  },
  {
    quote:
      "Their team brought fresh ideas, creative execution, and engaging visual experiences that truly connected with our audience. From concept to delivery, everything was handled with professionalism and precision.",
    name: "Athira Nampiathiri",
    role: "Senior Marketing Manager",
    company: "Forum Mall",
    logo: forumLogo.url,
    project: "Mall Experience · Campaign",
  },
  {
    quote:
      "Tero Studios delivered an exceptional AR broadcast for our Onam celebrations. Their creativity and flawless execution gave visitors a truly immersive festive experience.",
    name: "Hari Suhas",
    role: "General Manager",
    company: "Lulu Mall Kochi",
    logo: luluLogo.url,
    project: "Onam · AR Broadcast",
  },
  {
    quote:
      "The anamorphic video content created by Tero Studios for IMTEX 2025 and ACMEE 2025 helped us stand out with powerful visuals and high-impact brand presence.",
    name: "Ravivarman R",
    role: "Marketing Head",
    company: "S&T Engineers",
    logo: stEngLogo.url,
    project: "IMTEX · ACMEE 2025",
  },
  {
    quote:
      "Working with Tero Studios on the Campa Cola TVC and Mumbai launch video was seamless. Their frame-by-frame animation and creative approach elevated the campaign.",
    name: "Neha Gowda",
    role: "Producer",
    company: "Shot Ready",
    logo: shotLogo.url,
    project: "Campa Cola · TVC",
    accent: true,
  },
];

export function Testimonials() {
  // Duplicate the track for a seamless -50% marquee loop.
  const track = [...items, ...items];

  return (
    <section
      data-nav-theme="dark"
      className="relative overflow-hidden bg-[#101010] text-cream"
    >
      <style>{`
        @keyframes tero-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .tero-marquee-track {
          display: flex;
          width: max-content;
          animation: tero-marquee 60s linear infinite;
        }
        .tero-marquee-track:hover { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) {
          .tero-marquee-track { animation: none; }
        }
      `}</style>

      {/* Header */}
      <div className="container-tero relative pt-24 md:pt-40 pb-16 md:pb-20">
        <Reveal>
          <p className="overline text-vermillion">— Portfolio of consensus</p>
          <h2 className="mt-6 hero-headline text-[clamp(40px,7vw,96px)] leading-[1.05] text-cream max-w-4xl">
            What clients say after the
            <br />
            <em className="not-italic font-display italic">lights come up.</em>
          </h2>
        </Reveal>
      </div>

      {/* Marquee */}
      <div className="relative w-full overflow-hidden pb-24 md:pb-40">
        {/* Edge fade masks */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 md:w-40 bg-gradient-to-r from-[#101010] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 md:w-40 bg-gradient-to-l from-[#101010] to-transparent" />

        <div className="tero-marquee-track gap-6">
          {track.map((item, i) => (
            <Card key={`${item.name}-${i}`} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Card({ item }: { item: Testimonial }) {
  const accent = item.accent;
  return (
    <article
      className={[
        "flex w-[88vw] sm:w-[520px] md:w-[560px] shrink-0 flex-col justify-between",
        "bg-[#1E1E1E] p-8 md:p-10 min-h-[440px]",
        "border-l-2",
        accent ? "border-[#FF4A1C]/70" : "border-white/5",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-6">
        <img
          src={item.logo}
          alt={`${item.company} logo`}
          loading="lazy"
          className="h-10 md:h-12 w-auto object-contain object-left"
        />
        <span
          className={[
            "shrink-0 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em]",
            accent
              ? "bg-[#FF4A1C]/10 text-[#FF4A1C]"
              : "bg-white/5 text-cream/45",
          ].join(" ")}
        >
          {item.project}
        </span>
      </div>

      <blockquote className="mt-10 font-display text-[clamp(20px,2vw,28px)] leading-[1.35] text-cream">
        &ldquo;{item.quote}&rdquo;
      </blockquote>

      <div className="mt-10 border-t border-white/10 pt-5">
        <p className="font-sans-display text-[13px] font-bold uppercase tracking-wider text-cream">
          {item.name}
        </p>
        <p className="mt-1 font-body text-[12px] text-cream/55">
          {item.role} · {item.company}
        </p>
      </div>
    </article>
  );
}
