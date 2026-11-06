import type { Metadata } from "next";
import FaqPage from "@/components/generated/FaqPage";
import JsonLd from "@/components/seo/JsonLd";
import { pageLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("/faq/");

export default function Page() {
  return (
    <>
      <FaqPage />
      <JsonLd data={pageLd("/faq/")} />
    </>
  );
}
