import { createFileRoute } from "@tanstack/react-router";
import { PageLayout } from "@/components/tero/PageLayout";
import { Hero } from "@/components/tero/Hero";
import { LogoStrip } from "@/components/tero/LogoStrip";
import { ServicesScroller } from "@/components/tero/ServicesScroller";
import { VideoBubbles } from "@/components/tero/VideoBubbles";
import { HorizontalShowcase } from "@/components/tero/HorizontalShowcase";
import { CylinderGallery } from "@/components/tero/CylinderGallery";


import { StatsSection } from "@/components/tero/StatsSection";
import { Testimonials } from "@/components/tero/Testimonials";
import { Awards } from "@/components/tero/Awards";
import { FAQ } from "@/components/tero/FAQ";
import { KineticBand } from "@/components/tero/KineticBand";


export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Tero Studios — Animation studio crafting stories that move" },
      {
        name: "description",
        content:
          "Tero Studios is an independent animation and motion design studio in Chennai, building films, motion graphics and visual effects for global brands.",
      },
    ],
  }),
});

function Index() {
  return (
    <PageLayout>
      <Hero />
      <VideoBubbles />
      <LogoStrip />
      <ServicesScroller />
      <KineticBand />
      <StatsSection />
      
      <HorizontalShowcase />
      <CylinderGallery />
      
      
      <Testimonials />
      <Awards />
      <FAQ />
    </PageLayout>
  );
}
