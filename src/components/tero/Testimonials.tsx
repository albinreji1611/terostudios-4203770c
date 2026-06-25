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
      "For our Vara Mahalakshmi 2025 campaign, Tero Studios crafted an anamorphic video that perfectly merged tradition with innovation.",
    name: "Sibi Jacob",
    role: "Brand Manager",
    company: "Bhima Gold",
    logo: bhimaLogo.url,
    project: "Vara Mahalakshmi",
  },
  {
    quote:
      "Fresh ideas, creative execution, and engaging visual experiences that truly connected with our audience — handled with precision.",
    name: "Athira Nampiathiri",
    role: "Sr. Marketing Manager",
    company: "Forum Mall",
    logo: forumLogo.url,
    project: "Mall Campaign",
  },
  {
    quote:
      "An exceptional AR broadcast for our Onam celebrations. Creativity and flawless execution gave visitors a truly immersive experience.",
    name: "Hari Suhas",
    role: "General Manager",
    company: "Lulu Mall Kochi",
    logo: luluLogo.url,
    project: "Onam · AR",
    accent: true,
  },
  {
    quote:
      "The anamorphic content for IMTEX 2025 and ACMEE 2025 helped us stand out with powerful visuals and high-impact brand presence.",
    name: "Ravivarman R",
    role: "Marketing Head",
    company: "S&T Engineers",
    logo: stEngLogo.url,
    project: "IMTEX · ACMEE",
  },
  {
    quote:
      "Working on the Campa Cola TVC and Mumbai launch was seamless. Their frame-by-frame animation elevated the campaign.",
    name: "Neha Gowda",
    role: "Producer",
    company: "Shot Ready",
    logo: shotLogo.url,
    project: "Campa Cola · TVC",
  },
  {
    quote:
      "End-to-end craft — concept, motion, finish. The kind of studio partner you keep on speed dial for every launch window.",
    name: "Studio Partner",
    role: "Creative Director",
    company: "Tero Collaborator",
    logo: bhimaLogo.url,
    project: "Ongoing",
  },
];

export function Testimonials() {
  return (
    <section
      data-nav-theme="dark"
      className="relative overflow-hidden bg-[#101010] text-cream"
    >
      <div className="container-tero relative pt-16 md:pt-24 pb-16 md:pb-24">
        <Reveal>
          <p className="overline text-vermillion">— Portfolio of consensus</p>
          <h2 className="mt-4 hero-headline text-[clamp(28px,4.2vw,52px)] leading-[1.05] text-cream max-w-3xl">
            What clients say after the
            <br />
            <em className="not-italic font-display italic">lights come up.</em>
          </h2>
        </Reveal>

        <div className="mt-10 md:mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {items.map((item, i) => (
            <Card key={`${item.name}-${i}`} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}


function Card({ item, index }: { item: Testimonial; index: number }) {
  const accent = item.accent;
  return (
    <Reveal delay={index * 60}>
      <article
        className={[
          "group relative flex h-full flex-col justify-between",
          "bg-[#1E1E1E] p-6 md:p-7 min-h-[260px]",
          "border-l-2 transition-colors duration-300",
          accent
            ? "border-[#FF4A1C]/70"
            : "border-white/5 hover:border-vermillion/50",
        ].join(" ")}
      >
        <div className="flex items-start justify-between gap-4">
          <img
            src={item.logo}
            alt={`${item.company} logo`}
            loading="lazy"
            className="h-7 md:h-8 w-auto object-contain object-left opacity-90"
          />
          <span
            className={[
              "shrink-0 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.18em]",
              accent
                ? "bg-[#FF4A1C]/10 text-[#FF4A1C]"
                : "bg-white/5 text-cream/45",
            ].join(" ")}
          >
            {item.project}
          </span>
        </div>

        <blockquote className="mt-5 font-display text-[15px] md:text-[16px] leading-[1.5] text-cream/95">
          &ldquo;{item.quote}&rdquo;
        </blockquote>

        <div className="mt-5 border-t border-white/10 pt-3">
          <p className="font-sans-display text-[12px] font-bold uppercase tracking-wider text-cream">
            {item.name}
          </p>
          <p className="mt-0.5 font-body text-[11px] text-cream/55">
            {item.role} · {item.company}
          </p>
        </div>
      </article>
    </Reveal>
  );
}
