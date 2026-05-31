import { createFileRoute, Link } from "@tanstack/react-router";
import { PageLayout } from "@/components/tero/PageLayout";
import { Reveal } from "@/components/tero/Reveal";
import { services } from "@/data/services";
import { industries } from "@/data/industries";

const tier1 = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services Hub" },
  { to: "/industries", label: "Industries Hub" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/case-studies", label: "Case Studies" },
  { to: "/showreel", label: "Showreel" },
  { to: "/about", label: "About" },
  { to: "/about/studio", label: "Our Studio" },
  { to: "/about/team", label: "Our Team" },
  { to: "/clients", label: "Our Clients" },
  { to: "/blog", label: "Blog" },
  { to: "/careers", label: "Careers" },
  { to: "/contact", label: "Contact" },
  { to: "/privacy-policy", label: "Privacy Policy" },
] as const;

export const Route = createFileRoute("/sitemap")({
  component: Sitemap,
  head: () => ({
    meta: [
      { title: "Sitemap | Tero Studios" },
      { name: "description", content: "HTML sitemap of every page on terostudios.com." },
    ],
  }),
});

function Sitemap() {
  return (
    <PageLayout>
      <section className="container-tero py-24 md:py-32">
        <Reveal>
          <p className="overline">— Sitemap</p>
          <h1 className="mt-6 hero-headline text-[clamp(48px,8vw,96px)]">
            Every page, <span className="italic">in one place.</span>
          </h1>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-12 md:grid-cols-3">
          <div>
            <p className="overline">— Core</p>
            <ul className="mt-5 space-y-3">
              {tier1.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="link-underline">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="overline">— Services</p>
            <ul className="mt-5 space-y-3">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link to="/services/$slug" params={{ slug: s.slug }} className="link-underline">
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="overline">— Industries</p>
            <ul className="mt-5 space-y-3">
              {industries.map((i) => (
                <li key={i.slug}>
                  <Link to="/industries/$slug" params={{ slug: i.slug }} className="link-underline">
                    {i.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
