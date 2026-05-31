import { createFileRoute } from "@tanstack/react-router";
import { PageLayout } from "@/components/tero/PageLayout";
import { Reveal } from "@/components/tero/Reveal";

export const Route = createFileRoute("/privacy-policy")({
  component: Privacy,
  head: () => ({
    meta: [
      { title: "Privacy Policy | Tero Studios" },
      { name: "description", content: "How Tero Studios handles personal data and project information." },
    ],
  }),
});

function Privacy() {
  return (
    <PageLayout>
      <section className="container-tero py-24 md:py-32 max-w-3xl">
        <Reveal>
          <p className="overline">— Legal</p>
          <h1 className="mt-6 hero-headline text-[clamp(48px,8vw,96px)]">Privacy Policy</h1>
        </Reveal>
        <div className="prose mt-12 space-y-6 font-body text-[16px] leading-relaxed text-slate">
          <p>Last updated: 31 May 2026.</p>
          <p>
            Tero Studios collects only the personal information you provide
            when contacting us, briefing a project or applying for a role.
            We do not sell data and we do not use third-party advertising
            trackers on this site.
          </p>
          <h2 className="font-sans-display text-[24px] font-bold text-ink mt-10">What we collect</h2>
          <p>
            Names, work emails, company details and the contents of any
            brief or message you submit through the website or by email.
          </p>
          <h2 className="font-sans-display text-[24px] font-bold text-ink mt-10">How we use it</h2>
          <p>
            To respond to enquiries, deliver projects under contract, and
            comply with our legal and accounting obligations.
          </p>
          <h2 className="font-sans-display text-[24px] font-bold text-ink mt-10">Your rights</h2>
          <p>
            You can request a copy of, or deletion of, your personal
            information at any time by writing to hello@terostudios.com.
          </p>
        </div>
      </section>
    </PageLayout>
  );
}
