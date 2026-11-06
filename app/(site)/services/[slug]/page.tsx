import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ServiceTemplate, { type ServiceData } from "@/components/services/ServiceTemplate";
import JsonLd from "@/components/seo/JsonLd";
import services from "@/content/services.json";
import { pageLd, pageMetadata } from "@/lib/seo";
import AiAgentsAsAServiceBody from "@/components/services/bodies/AiAgentsAsAServiceBody";
import AiAutomationBody from "@/components/services/bodies/AiAutomationBody";
import AiLlmDevelopmentBody from "@/components/services/bodies/AiLlmDevelopmentBody";
import CodeRescueBody from "@/components/services/bodies/CodeRescueBody";
import CustomSoftwareDevelopmentBody from "@/components/services/bodies/CustomSoftwareDevelopmentBody";
import FullStackDevelopmentBody from "@/components/services/bodies/FullStackDevelopmentBody";
import MobileAppDevelopmentBody from "@/components/services/bodies/MobileAppDevelopmentBody";
import SaasAppDevelopmentBody from "@/components/services/bodies/SaasAppDevelopmentBody";

const BODIES: Record<string, () => React.JSX.Element> = {
  "ai-agents-as-a-service": AiAgentsAsAServiceBody,
  "ai-automation": AiAutomationBody,
  "ai-llm-development": AiLlmDevelopmentBody,
  "code-rescue": CodeRescueBody,
  "custom-software-development": CustomSoftwareDevelopmentBody,
  "full-stack-development": FullStackDevelopmentBody,
  "mobile-app-development": MobileAppDevelopmentBody,
  "saas-app-development": SaasAppDevelopmentBody,
};

const all = services as ServiceData[];

export const dynamicParams = false;

export function generateStaticParams() {
  return all.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return pageMetadata(`/services/${slug}/`, { image: `/og/services/${slug}.png` });
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = all.find((s) => s.slug === slug);
  const Body = BODIES[slug];
  if (!data || !Body) notFound();
  return (
    <>
      <ServiceTemplate data={data}>
        <Body />
      </ServiceTemplate>
      <JsonLd data={pageLd(`/services/${slug}/`)} />
    </>
  );
}
