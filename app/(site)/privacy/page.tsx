import type { Metadata } from "next";
import LegalPage from "@/components/legal/LegalPage";
import JsonLd from "@/components/seo/JsonLd";
import { legalDoc } from "@/lib/legal";
import { breadcrumbLd, pageLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("/privacy/");

export default function Page() {
  return (
    <>
      <LegalPage doc={legalDoc("privacy")} self="/privacy/" />
      <JsonLd data={[...pageLd("/privacy/"), breadcrumbLd([["Home", "/"], ["Privacy Policy", "/privacy/"]])]} />
    </>
  );
}
