import { NextStudio } from "next-sanity/studio";
import config from "@/sanity.config";

export const dynamic = "force-static";
export { metadata, viewport } from "next-sanity/studio";

// Embedded Studio
export default function StudioPage() {
  return <NextStudio config={config} />;
}
