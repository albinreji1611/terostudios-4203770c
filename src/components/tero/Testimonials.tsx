import { Reveal, RevealGroup, RevealItem } from "./Reveal";
import bhima from "@/assets/Bhima_Gold.png.asset.json";
import forum from "@/assets/Fourm_mall.png.asset.json";
import lulu from "@/assets/Lulu_Mall.png.asset.json";
import stEng from "@/assets/S_T_Engineering.png.asset.json";
import shot from "@/assets/Shot_ready.png.asset.json";
// White brand logos for dark background
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
  avatar: string;
  logo: string;
  project: string;
};

const items: Testimonial[] = [
  {
    quote:
      "For our Vara Mahalakshmi 2025 campaign, Tero Studios crafted an anamorphic video that perfectly merged tradition with innovation, making a strong impact on our audience.",
    name: "Sibi Jacob",
    role: "Brand Manager",
    company: "Bhima Gold",
    avatar: bhima.url,
    logo: bhimaLogo.url,
    project: "Vara Mahalakshmi · Anamorphic",
  },
  {
    quote:
      "Their team brought fresh ideas, creative execution, and engaging visual experiences that truly connected with our audience. From concept to delivery, everything was handled with professionalism and precision.",
    name: "Athira Nampiathiri",
    role: "Senior Marketing Manager",
    company: "Forum Mall",
    avatar: forum.url,
    logo: forumLogo.url,
    project: "Mall Experience · Campaign",
  },
  {
    quote:
      "Tero Studios delivered an exceptional AR broadcast for our Onam celebrations. Their creativity and flawless execution gave visitors a truly immersive festive experience.",
    name: "Hari Suhas",
    role: "General Manager",
    company: "Lulu Mall Kochi",
    avatar: lulu.url,
    logo: luluLogo.url,
    project: "Onam · AR Broadcast",
  },
  {
    quote:
      "The anamorphic video content created by Tero Studios for IMTEX 2025 and ACMEE 2025 helped us stand out with powerful visuals and high-impact brand presence.",
    name: "Ravivarman R",
    role: "Marketing Head",
    company: "S&T Engineers",
    avatar: stEng.url,
    logo: stEngLogo.url,
    project: "IMTEX · ACMEE 2025",
  },
  {
    quote:
      "Working with Tero Studios on the Campa Cola TVC and Mumbai launch video was seamless. Their frame-by-frame animation and creative approach elevated the campaign.",
    name: "Neha Gowda",
    role: "Producer",
    company: "Shot Ready",
    avatar: shot.url,
    logo: shotLogo.url,
    project: "Campa Cola · TVC",
  },
];

export function Testimonials() {
  const [featured, ...rest] = items;

  return (
    <section data-nav-theme="dark" className="relative bg-ink text-cream overflow-hidden">
      {/* Ambient backdrop */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full bg-vermillion/[0.07] blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[420px] w-[420px] rounded-full bg-cream/[0.04] blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      <div className="container-tero relative py-24 md:py-40">
        {/* Header */}
        <Reveal>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <p className="overline text-vermillion">— Portfolio of consensus</p>
              <h2 className="mt-6 hero-headline text-[clamp(40px,7vw,96px)] text-cream">
                What clients say <br /> after the lights come up.
              </h2>
            </div>
            <p className="max-w-xs font-body text-[14px] leading-relaxed text-cream/60 md:text-right">
              Words from the brand, marketing and production leads who shipped the
              work alongside our studio.
            </p>
          </div>
        </Reveal>

        {/* Featured + grid */}
        <div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Featured large card */}
          <RevealItem className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-8 md:p-12 lg:col-span-7">
            <div
              aria-hidden
              className="absolute -top-10 -right-6 select-none font-display text-[260px] leading-none text-vermillion/15"
            >
              &ldquo;
            </div>

            <div className="relative flex h-full flex-col">
              <div className="flex items-center justify-between gap-6">
                <BrandMark logo={featured.logo} company={featured.company} large />
                <span className="hidden font-sans-display text-[11px] uppercase tracking-[0.2em] text-cream/40 md:inline">
                  {featured.project}
                </span>
              </div>

              <blockquote className="mt-12 font-display text-[clamp(22px,2.4vw,34px)] leading-[1.25] text-cream">
                &ldquo;{featured.quote}&rdquo;
              </blockquote>

              <div className="mt-12 flex items-center gap-4 border-t border-white/10 pt-6">
                <Avatar src={featured.avatar} alt={featured.name} />
                <div>
                  <p className="font-sans-display text-[14px] font-bold uppercase tracking-wider text-cream">
                    {featured.name}
                  </p>
                  <p className="mt-0.5 font-body text-[12px] text-cream/60">
                    {featured.role} · {featured.company}
                  </p>
                </div>
              </div>
            </div>
          </RevealItem>

          {/* Stacked small cards */}
          <RevealGroup className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
            {rest.slice(0, 2).map((q) => (
              <SmallCard key={q.name} item={q} />
            ))}
          </RevealGroup>
        </div>

        {/* Remaining row */}
        <RevealGroup className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          {rest.slice(2).map((q) => (
            <SmallCard key={q.name} item={q} />
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

function SmallCard({ item }: { item: Testimonial }) {
  return (
    <RevealItem className="group relative flex h-full flex-col rounded-3xl border border-white/10 bg-white/[0.03] p-8 transition-colors duration-500 hover:bg-white/[0.05]">
      <div className="flex items-start justify-between gap-4">
        <BrandMark logo={item.logo} company={item.company} />
        <span className="font-sans-display text-[10px] uppercase tracking-[0.2em] text-cream/40">
          {item.project}
        </span>
      </div>

      <blockquote className="mt-8 font-display text-[clamp(16px,1.4vw,19px)] leading-snug text-cream/90">
        &ldquo;{item.quote}&rdquo;
      </blockquote>

      <div className="mt-8 flex items-center gap-3 border-t border-white/10 pt-5">
        <Avatar src={item.avatar} alt={item.name} small />
        <div>
          <p className="font-sans-display text-[12px] font-bold uppercase tracking-wider text-cream">
            {item.name}
          </p>
          <p className="mt-0.5 font-body text-[11px] text-cream/60">
            {item.role} · {item.company}
          </p>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-8 bottom-0 h-px scale-x-0 bg-gradient-to-r from-transparent via-vermillion to-transparent transition-transform duration-500 group-hover:scale-x-100" />
    </RevealItem>
  );
}

function BrandMark({
  logo,
  company,
  large = false,
}: {
  logo: string;
  company: string;
  large?: boolean;
}) {
  return (
    <div className="flex items-center">
      <img
        src={logo}
        alt={`${company} logo`}
        loading="lazy"
        className={`w-auto object-contain ${
          large ? "h-14 md:h-20" : "h-12 md:h-14"
        }`}
      />
    </div>
  );
}

function Avatar({
  src,
  alt,
  small = false,
}: {
  src: string;
  alt: string;
  small?: boolean;
}) {
  return (
    <div
      className={`overflow-hidden rounded-full border border-cream/20 bg-ink ${
        small ? "h-10 w-10" : "h-14 w-14"
      }`}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="h-full w-full object-cover"
      />
    </div>
  );
}
