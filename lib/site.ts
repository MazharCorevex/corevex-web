// Primary host is www; the bare domain redirects, which breaks link previews
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.corevex-solutions.com")
  .replace(/\/$/, "")
  .replace(/^https?:\/\/corevex-solutions\.com$/, "https://www.corevex-solutions.com");
export const SITE_NAME = "Corevex Solutions";
export const PSEB_NUMBER = process.env.NEXT_PUBLIC_PSEB_NUMBER || "";
export const LINKEDIN_URL = process.env.NEXT_PUBLIC_LINKEDIN_URL || "https://www.linkedin.com/company/corevex-solution/";
export const CLUTCH_URL = process.env.NEXT_PUBLIC_CLUTCH_URL || "";
export const GITHUB_URL = process.env.NEXT_PUBLIC_GITHUB_URL || "";
export const X_URL = process.env.NEXT_PUBLIC_X_URL || "";
export const INSTAGRAM_URL = process.env.NEXT_PUBLIC_INSTAGRAM_URL || "";
export const FACEBOOK_URL = process.env.NEXT_PUBLIC_FACEBOOK_URL || "";

export type NavService = {
  slug: string;
  name: string;
  short: string;
  blurb: string;
  icon: string;
  group: "build" | "intel";
  tile: string;
};

export const SERVICES: NavService[] = [
  { slug: "custom-software-development", tile: "custom-software", name: "Custom Software Development", short: "Custom Software", blurb: "Software shaped around how your business actually works.", icon: "custom-software", group: "build" },
  { slug: "full-stack-development", tile: "pair-programming", name: "Full-Stack Development", short: "Full-Stack", blurb: "Web products built to scale from day one.", icon: "full-stack", group: "build" },
  { slug: "mobile-app-development", tile: "mobile-in-hand", name: "Mobile App Development", short: "Mobile Apps", blurb: "iOS and Android apps people keep using.", icon: "web-mobile", group: "build" },
  { slug: "saas-app-development", tile: "saas-dashboard", name: "SaaS App Development", short: "SaaS", blurb: "Subscription products built to launch, sell and scale.", icon: "saas", group: "build" },
  { slug: "code-rescue", tile: "rescue-health-check", name: "Code Rescue and Takeover", short: "Code Rescue", blurb: "Take over and fix apps built with AI tools.", icon: "rescue", group: "build" },
  { slug: "ai-llm-development", tile: "ai-assistant", name: "AI and LLM Development", short: "AI and LLM", blurb: "AI that does real work inside your product.", icon: "ai-ml", group: "intel" },
  { slug: "ai-automation", tile: "automation", name: "AI Automation and Agents", short: "Automation", blurb: "Remove the manual work from your operations.", icon: "automation", group: "intel" },
  { slug: "ai-agents-as-a-service", tile: "aaas-console", name: "AI Agents as a Service", short: "AI Agents", blurb: "Managed AI agents that do real work for your team.", icon: "aaas", group: "intel" },
];

export const DRAWER_ORDER = [
  "custom-software-development",
  "full-stack-development",
  "mobile-app-development",
  "ai-llm-development",
  "ai-automation",
  "saas-app-development",
  "ai-agents-as-a-service",
  "code-rescue",
];

export const svc = (slug: string) => SERVICES.find((s) => s.slug === slug)!;

export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "business@corevex-solutions.com";
export const CONTACT_PHONE = process.env.NEXT_PUBLIC_CONTACT_PHONE || "+92 333 2031151";
// WhatsApp, international format without "+"
export const WHATSAPP_NUMBER = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "923332031151").replace(/\D/g, "");
export const OFFICE_ADDRESS = process.env.NEXT_PUBLIC_OFFICE_ADDRESS || "Sikander Plaza, Canal Bridge, Vehari Rd, Model Town, Hasilpur";
