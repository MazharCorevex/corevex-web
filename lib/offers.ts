// Approved starting prices (CLAUDE.md); never add prices here without approval
export type Offer = {
  slug: string;
  title: string;
  label: string;
  price: number;
  maxPrice?: number;
  per?: string;
  from?: boolean;
  promise: string;
  points: [string, string, string, string];
  service: string;
};

export const OFFERS: Offer[] = [
  {
    slug: "landing-page",
    title: "Landing page",
    label: "Landing page $199",
    price: 199,
    promise: "A focused one-page site that turns visitors into enquiries.",
    points: ["One page, designed around a single goal", "Mobile-first and quick to load", "Contact form wired to your inbox", "Basic SEO and analytics set up"],
    service: "full-stack-development",
  },
  {
    slug: "website",
    title: "Website, up to 3 pages",
    label: "Website $599",
    price: 599,
    promise: "A small business website you can be proud to share.",
    points: ["Up to 3 custom-designed pages", "Mobile-first and quick to load", "Contact form wired to your inbox", "Basic SEO and analytics set up"],
    service: "full-stack-development",
  },
  {
    slug: "dedicated-developer",
    title: "Dedicated developer",
    label: "Dedicated developer $2,000 to $2,500 per month",
    price: 2000,
    maxPrice: 2500,
    per: "per month",
    promise: "An experienced developer working only on your product.",
    points: ["Full-time on your project", "Joins your standups and tools", "Weekly demos of working software", "Code and access stay yours"],
    service: "full-stack-development",
  },
  {
    slug: "saas-platform",
    title: "SaaS platform",
    label: "SaaS platform from $5,000",
    price: 5000,
    from: true,
    promise: "A subscription product ready for its first paying customers.",
    points: ["User accounts and roles", "Subscriptions and billing", "Admin panel to run the business", "Full code ownership"],
    service: "saas-app-development",
  },
  {
    slug: "ai-agent",
    title: "AI agent",
    label: "AI agent from $1,000",
    price: 1000,
    per: "per agent",
    from: true,
    promise: "An agent that handles one real task in your business.",
    points: ["Trained on your documents and process", "Connected to the tools you use", "Hands over to a person when needed", "Monitored and improved after launch"],
    service: "ai-agents-as-a-service",
  },
];

export const offer = (slug?: string | null) => OFFERS.find((o) => o.slug === slug);

const usd = (n: number) => `$${n.toLocaleString("en-US")}`;
export const priceText = (o: Offer) => (o.maxPrice ? `${usd(o.price)} to ${usd(o.maxPrice)}` : usd(o.price));
export const fromText = (o: Offer) => `From ${usd(o.price)}`;
export const startingText = (o: Offer) => `Starting at ${usd(o.price)}${o.per === "per agent" ? " per agent" : ""}`;
