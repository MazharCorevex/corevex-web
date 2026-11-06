import type { Metadata } from "next";
import ServicesHub from "@/components/generated/ServicesHub";
import JsonLd from "@/components/seo/JsonLd";
import { pageLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("/services/");

export default function Page() {
  return (
    <>
      <ServicesHub />
      <JsonLd data={pageLd("/services/")} />
    </>
  );
}
