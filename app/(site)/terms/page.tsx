import type { Metadata } from "next";
import LegalPage from "@/components/legal/LegalPage";
import JsonLd from "@/components/seo/JsonLd";
import { legalDoc } from "@/lib/legal";
import { breadcrumbLd, pageLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("/terms/");

export default function Page() {
  return (
    <>
      <LegalPage doc={legalDoc("terms")} self="/terms/" />
      <JsonLd data={[...pageLd("/terms/"), breadcrumbLd([["Home", "/"], ["Terms of Use", "/terms/"]])]} />
    </>
  );
}
