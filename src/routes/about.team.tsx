import { createFileRoute } from "@tanstack/react-router";
import { PageLayout } from "@/components/tero/PageLayout";
import { Reveal } from "@/components/tero/Reveal";
import { TeamMarquee } from "@/components/tero/TeamMarquee";

const team = [
  { name: "Arvind Subramanian", role: "Founder & Creative Director", li: "#" },
  { name: "Priya Nair", role: "Head of Production", li: "#" },
  { name: "Karthik Iyer", role: "Director — 3D & Look-dev", li: "#" },
  { name: "Meera Raghav", role: "Director — 2D & Motion", li: "#" },
  { name: "Rohan D'Souza", role: "VFX Supervisor", li: "#" },
  { name: "Aisha Khan", role: "Head of Immersive (XR & Anamorphic)", li: "#" },
  { name: "Vivek Rao", role: "Head of Hardware & Pipeline", li: "#" },
  { name: "Sneha Pillai", role: "Executive Producer", li: "#" },
];

export const Route = createFileRoute("/about/team")({
  component: Team,
  head: () => ({
    meta: [
      { title: "Our Team | Tero Studios | India" },
      {
        name: "description",
        content:
          "Meet the founder and leads at Tero Studios — direction, production, VFX, immersive and hardware.",
      },
      { property: "og:title", content: "Team — Tero Studios" },
      { property: "og:description", content: "The senior people who run the work." },
    ],
  }),
});

function Team() {
  return (
    <PageLayout>
      <section className="container-tero pt-24 md:pt-36 pb-8">
        <Reveal>
          <p className="overline">— Team</p>
          <h1 className="mt-6 hero-headline text-[clamp(48px,8vw,120px)] max-w-5xl">
            Senior people, <br />
            <span className="italic">every brief.</span>
          </h1>
        </Reveal>
      </section>

      <TeamMarquee
        eyebrow="— Leadership"
        title={<>Meet the founder <br /><span className="italic">& CEO.</span></>}
        people={[
          { name: "Arvind", role: "Founder & Creative Director", li: "#" },
          { name: "Sneha", role: "CEO & Executive Producer", li: "#" },
        ]}
        featured
      />

      <TeamMarquee
        eyebrow="— The team"
        title={<>Our team of <br /><span className="italic">strategists.</span></>}
        people={team.map((t) => ({ name: t.name.split(" ")[0], role: t.role, li: t.li }))}
      />
    </PageLayout>
  );
}
