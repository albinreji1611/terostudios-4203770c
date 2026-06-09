import { createFileRoute, notFound } from "@tanstack/react-router";
import { IndustryTemplate } from "@/components/tero/IndustryTemplate";
import { getIndustry } from "@/data/industries";

export const Route = createFileRoute("/industries/$slug")({
  loader: ({ params }) => {
    const industry = getIndustry(params.slug);
    if (!industry) throw notFound();
    return { industry };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.industry.name} | Tero Studios | India` },
          {
            name: "description",
            content: `${loaderData.industry.hero} ${loaderData.industry.short}`.slice(0, 158),
          },
          { property: "og:title", content: `${loaderData.industry.name} — Tero Studios` },
          { property: "og:description", content: loaderData.industry.short },
        ]
      : [{ title: "Industry — Tero Studios" }],
  }),
  notFoundComponent: () => (
    <div className="container-tero py-40 text-center">
      <h1 className="hero-headline text-[64px]">Industry not found.</h1>
    </div>
  ),
  component: IndustryPage,
});

function IndustryPage() {
  const { industry } = Route.useLoaderData();
  return <IndustryTemplate industry={industry} />;
}
