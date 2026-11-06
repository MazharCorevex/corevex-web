import type { Metadata } from "next";
import ContactPage from "@/components/generated/ContactPage";
import JsonLd from "@/components/seo/JsonLd";
import { pageLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("/contact/");

export default function Page() {
  return (
    <>
      <ContactPage />
      <JsonLd data={pageLd("/contact/")} />
    </>
  );
}
