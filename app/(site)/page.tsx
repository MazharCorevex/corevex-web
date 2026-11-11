import type { Metadata } from "next";
import Hero from "@/components/home/sections/Hero";
import ClientLogos from "@/components/sections/ClientLogos";
import ProjectLogos from "@/components/sections/ProjectLogos";
import ServicesBento from "@/components/home/sections/ServicesBento";
import CodeRescue from "@/components/home/sections/CodeRescue";
import Numbers from "@/components/home/sections/Numbers";
import CoreSection from "@/components/home/CoreSection";
import Img from "@/components/ui/Img";
import WorkRail from "@/components/home/sections/WorkRail";
import TechStack from "@/components/home/sections/TechStack";
import Process from "@/components/home/sections/Process";
import WhyCorevex from "@/components/home/sections/WhyCorevex";
import Industries from "@/components/home/sections/Industries";
import TrustCards from "@/components/home/sections/TrustCards";
import ClientQuotes from "@/components/home/sections/ClientQuotes";
import InsightsBlock from "@/components/home/sections/InsightsBlock";
import ContactFinale from "@/components/home/sections/ContactFinale";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("/");

export default function Home() {
  return (
    <>
      <Hero />
      <ClientLogos variant="marquee" fallback={<ProjectLogos />} />
      <ServicesBento />
      <CodeRescue />
      <Numbers />
      <CoreSection
        fallback={
          <Img
            src="/images/hero/hero-core-desktop.webp"
            alt=""
            aria-hidden="true"
            fill
            sizes="100vw"
            className="core-fallback"
            style={{ opacity: 0.9 }}
          />
        }
      />
      <WorkRail />
      <TechStack />
      <Process />
      <WhyCorevex />
      <Industries />
      <TrustCards />
      <ClientQuotes />
      <InsightsBlock />
      <ContactFinale />
    </>
  );
}
