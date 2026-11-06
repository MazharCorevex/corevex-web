import type { Metadata } from "next";
import CareersPage from "@/components/generated/CareersPage";
import JsonLd from "@/components/seo/JsonLd";
import { getJobs } from "@/lib/content";
import { pageLd, pageMetadata } from "@/lib/seo";

export const revalidate = 3600;
export const metadata: Metadata = pageMetadata("/careers/");

export default async function Page() {
  const jobs = await getJobs();
  return (
    <>
      <CareersPage jobs={jobs} blob={Boolean(process.env.BLOB_READ_WRITE_TOKEN)} />
      <JsonLd data={pageLd("/careers/")} />
    </>
  );
}
