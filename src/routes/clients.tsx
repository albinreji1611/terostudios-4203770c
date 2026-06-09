import { createFileRoute } from "@tanstack/react-router";
import { PageLayout } from "@/components/tero/PageLayout";
import { Reveal } from "@/components/tero/Reveal";

const clients = [
  "Ford", "Sanofi", "Campa Cola", "Bang & Olufsen", "Bhima Gold",
  "Clayworks", "Lulu Mall", "NMACC", "IMTEX", "ACMEE", "Forum Mall",
  "CAT / GMMCO", "Mercedes", "Samsung", "Nike", "Tata", "Swiggy",
  "Razorpay", "Adidas", "Flipkart", "Zomato", "ITC", "Unilever", "Netflix",
];

export const Route = createFileRoute("/clients")({
  component: Clients,
  head: () => ({
    meta: [
      { title: "Our Clients | Tero Studios | India" },
      {
        name: "description",
        content:
          "Tero Studios partners with Ford, Sanofi, Campa Cola, Bang & Olufsen, Clayworks and many more across nine industries.",
      },
      { property: "og:title", content: "Clients — Tero Studios" },
      { property: "og:description", content: "Who we make work for." },
    ],
  }),
});

function Clients() {
  return (
    <PageLayout>
      <section className="container-tero py-24 md:py-40">
        <Reveal>
          <p className="overline">— Clients</p>
          <h1 className="mt-6 hero-headline text-[clamp(56px,10vw,144px)] max-w-5xl">
            Who we make <br />
            <span className="italic">work for.</span>
          </h1>
        </Reveal>
      </section>

      <section className="border-y border-parchment bg-card">
        <div className="container-tero py-20">
          <div className="grid grid-cols-2 gap-x-8 gap-y-6 md:grid-cols-4 lg:grid-cols-6">
            {clients.map((c) => (
              <div
                key={c}
                className="flex items-center justify-center border border-parchment bg-cream py-10 font-sans-display text-[16px] font-bold tracking-[0.1em] text-ink/60 transition-colors hover:text-ink"
              >
                {c}
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
