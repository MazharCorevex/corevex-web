import type { Metadata } from "next";
import NotFoundPage from "@/components/generated/NotFoundPage";
import { seoFor } from "@/lib/seo";

export const metadata: Metadata = {
  title: { absolute: seoFor("/404/")?.title || "Page not found" },
  description: seoFor("/404/")?.description,
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return <NotFoundPage />;
}
