import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";

const withAnalyzer = bundleAnalyzer({ enabled: process.env.ANALYZE === "true" });

const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://assets.calendly.com https://www.googletagmanager.com",
  "style-src 'self' 'unsafe-inline' https://assets.calendly.com",
  "img-src 'self' data: blob: https://*.googletagmanager.com https://*.google-analytics.com https://assets.calendly.com",
  "font-src 'self' data:",
  "connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://*.public.blob.vercel-storage.com https://vercel.com https://*.vercel-storage.com",
  "frame-src https://calendly.com https://*.calendly.com",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const security = [
  { key: "Content-Security-Policy", value: csp },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

// Public env defaults, always inlined so no process polyfill ships
const PUBLIC_ENV = [
  "NEXT_PUBLIC_SITE_URL",
  "NEXT_PUBLIC_CALENDLY_URL",
  "NEXT_PUBLIC_GA_ID",
  "NEXT_PUBLIC_PSEB_NUMBER",
  "NEXT_PUBLIC_LINKEDIN_URL",
  "NEXT_PUBLIC_CLUTCH_URL",
  "NEXT_PUBLIC_GITHUB_URL",
  "NEXT_PUBLIC_CONTACT_EMAIL",
  "NEXT_PUBLIC_CONTACT_PHONE",
  "NEXT_PUBLIC_OFFICE_ADDRESS",
];

const config: NextConfig = {
  env: Object.fromEntries(PUBLIC_ENV.map((k) => [k, process.env[k] ?? ""])),
  trailingSlash: true,
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 414, 640, 768, 1024, 1280, 1536, 1920],
    imageSizes: [32, 48, 64, 96, 160, 256, 384],
    qualities: [70, 75],
    minimumCacheTTL: 31536000,
  },
  experimental: {
    serverActions: { bodySizeLimit: "6mb" },
    inlineCss: false,
    optimizePackageImports: [],
  },
  async headers() {
    return [
      { source: "/:path*", headers: security },
      { source: "/images/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
    ];
  },
  async redirects() {
    return [
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/:path*/index.html", destination: "/:path*/", permanent: true },
    ];
  },
};

export default withAnalyzer(config);
