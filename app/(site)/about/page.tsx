import type { Metadata } from "next";
import AboutPage from "@/components/generated/AboutPage";
import JsonLd from "@/components/seo/JsonLd";
import { getTeam } from "@/lib/content";
import { pageLd, pageMetadata } from "@/lib/seo";

export const revalidate = 3600;
export const metadata: Metadata = pageMetadata("/about/");

export default async function Page() {
  const team = (await getTeam()).filter((m) => m.leadership);
  return (
    <>
      <AboutPage team={team} />
      <JsonLd data={pageLd("/about/")} />
    </>
  );
}
