import type { Metadata } from "next";
import AiLabPage from "@/components/generated/AiLabPage";
import JsonLd from "@/components/seo/JsonLd";
import { pageLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("/ai-lab/");

export default function Page() {
  return (
    <>
      <AiLabPage />
      <JsonLd data={pageLd("/ai-lab/")} />
    </>
  );
}
