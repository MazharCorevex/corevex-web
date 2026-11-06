import type { Metadata } from "next";
import PrivacyPage from "@/components/generated/PrivacyPage";
import JsonLd from "@/components/seo/JsonLd";
import { pageLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("/privacy/");

export default function Page() {
  return (
    <>
      <PrivacyPage />
      <JsonLd data={pageLd("/privacy/")} />
    </>
  );
}
