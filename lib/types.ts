import type { PortableTextBlock } from "@portabletext/react";

export type Article = {
  slug: string;
  title: string;
  seoTitle?: string;
  description?: string;
  summary?: string;
  homeTeaser?: string;
  category: string;
  categoryKey: string;
  readTime: number;
  author: string;
  authorRole?: string;
  authorImage?: string;
  image: string;
  imageAlt?: string;
  cardAlt?: string;
  keywords?: string;
  publishedAt: string;
  takeaways: string[];
  toc: { label: string; anchor: string }[];
  body: PortableTextBlock[];
  faq: { q: string; a: string }[];
  ctas: { label: string; href: string; primary: boolean }[];
  related: string[];
  featured?: boolean;
  order?: number;
  homeOrder?: number;
};

export type CaseStudy = {
  slug: string;
  order: number;
  name: string;
  title: string;
  seoTitle?: string;
  description?: string;
  summary: string;
  industry: string;
  categories: string[];
  image: string;
  imageAlt?: string;
  railAlt?: string;
  heroAlt?: string;
  snapshot: { label: string; value: string }[];
  challenge: string;
  approach: string[];
  delivered: { title: string; text: string }[];
  results: { value: string; label: string }[];
  next: string | null;
  isDesignStudy: boolean;
};

export type TeamMember = {
  slug: string;
  order: number;
  name: string;
  role: string;
  short: string;
  bio: string[];
  image: string;
  linkedin?: string;
  leadership: boolean;
};

export type Job = { slug: string; order: number; title: string; type: string; location: string };

export type Testimonial = { quote: string; name: string; role?: string; company?: string; caseStudy?: string };

export type ClientLogo = { name: string; logo: string; width?: number; height?: number };
