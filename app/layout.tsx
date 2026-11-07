import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Montserrat } from "next/font/google";
import Script from "next/script";
import Header from "@/components/layout/Header";
import MegaPanel from "@/components/layout/MegaPanel";
import Footer from "@/components/layout/Footer";
import Motion from "@/components/layout/Motion";
import Analytics from "@/components/layout/Analytics";
import JsonLd from "@/components/seo/JsonLd";
import { organizationLd } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";
import "@/styles/tokens.css";
import "@/styles/site.css";
import "@/styles/overrides.css";

const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });
const montserrat = Montserrat({ subsets: ["latin"], weight: ["600"], display: "swap", variable: "--font-montserrat" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["500"], display: "swap", variable: "--font-mono", preload: false });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Corevex Solutions: Custom Software, AI and Mobile Apps", template: "%s" },
  description:
    "PSEB registered software company with 50+ engineers building custom software, full stack web apps, mobile apps, AI, LLM and automation solutions.",
  applicationName: "Corevex Solutions",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  openGraph: { type: "website", siteName: "Corevex Solutions", images: ["/images/social/og-image-1200x630.png"] },
  twitter: { card: "summary_large_image", images: ["/images/social/og-image-1200x630.png"] },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#0D1022",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${montserrat.variable} ${mono.variable}`}>
      <head>
        <noscript>
          <style>{`[data-reveal],.words .w{opacity:1!important;transform:none!important}.split-img img,.svc-photo img,.art-img img,.ed-photo img{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        <JsonLd data={organizationLd()} />
      </head>
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>
        <Header megaPanel={<MegaPanel />} />
        <main id="main">{children}</main>
        <Footer />
        <Motion />
        <Analytics />
        {process.env.NEXT_PUBLIC_GA_ID ? (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`} strategy="lazyOnload" />
            <Script id="ga" strategy="lazyOnload">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;gtag('js',new Date());gtag('config','${process.env.NEXT_PUBLIC_GA_ID}',{anonymize_ip:true});`}
            </Script>
          </>
        ) : null}
      </body>
    </html>
  );
}
