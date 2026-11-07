import type { Metadata } from "next";
import TermsPage from "@/components/generated/TermsPage";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbLd, pageLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("/terms/");

export default function Page() {
  return (
    <>
      <TermsPage />
      <JsonLd data={[...pageLd("/terms/"), breadcrumbLd([["Home", "/"], ["Terms of Service", "/terms/"]])]} />
    </>
  );
}
