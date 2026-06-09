import { createFileRoute, notFound } from "@tanstack/react-router";
import { ServiceTemplate } from "@/components/tero/ServiceTemplate";
import { getService } from "@/data/services";

export const Route = createFileRoute("/services/$slug")({
  loader: ({ params }) => {
    const service = getService(params.slug);
    if (!service) throw notFound();
    return { service };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.service.name} | Tero Studios | India` },
          {
            name: "description",
            content: `${loaderData.service.hero} ${loaderData.service.short}`.slice(0, 158),
          },
          { property: "og:title", content: `${loaderData.service.name} — Tero Studios` },
          { property: "og:description", content: loaderData.service.short },
        ]
      : [{ title: "Service — Tero Studios" }],
  }),
  notFoundComponent: () => (
    <div className="container-tero py-40 text-center">
      <h1 className="hero-headline text-[64px]">Service not found.</h1>
    </div>
  ),
  component: ServicePage,
});

function ServicePage() {
  const { service } = Route.useLoaderData();
  return <ServiceTemplate service={service} />;
}
