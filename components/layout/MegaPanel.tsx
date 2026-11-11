import Link from "next/link";
import Img from "@/components/ui/Img";
import { SERVICES } from "@/lib/site";
import { PriceChip } from "@/components/offers/PriceTags";

// Starting prices shown in the menu
const FROM: Record<string, [string, string]> = {
  "full-stack-development": ["landing-page", "from $199"],
  "saas-app-development": ["saas-platform", "from $5,000"],
  "ai-agents-as-a-service": ["ai-agent", "from $1,000"],
};

const LABEL: Record<string, string> = {
  "ai-automation": "AI Automation",
  "ai-agents-as-a-service": "AI Agents as a Service",
};

// Mega menu panel
export default function MegaPanel() {
  const group = (g: "build" | "intel") =>
    SERVICES.filter((s) => s.group === g).map((s) => (
      <Link key={s.slug} className="m" href={`/services/${s.slug}/`}>
        <Img src={`/images/icons/${s.icon}.svg`} alt="" />
        <div>
          <b>
            {LABEL[s.slug] ?? s.short}
            {FROM[s.slug] && <PriceChip slug={FROM[s.slug][0]} text={FROM[s.slug][1]} />}
          </b>
          <span>{s.blurb}</span>
        </div>
      </Link>
    ));
  return (
    <div className="wrap">
      <div>
        <h2>Build</h2>
        {group("build")}
      </div>
      <div>
        <h2>Intelligence</h2>
        {group("intel")}
      </div>
      <div className="mega-foot">
        <Link className="all" href="/services/">
          View all services <span className="chev">»</span>
        </Link>
        <Link className="mega-team" href="/contact/?offer=dedicated-developer">
          Dedicated team <PriceChip slug="dedicated-developer" text="$2,000/mo" />
        </Link>
      </div>
    </div>
  );
}
