import Link from "next/link";
import Img from "@/components/ui/Img";
import { SERVICES } from "@/lib/site";

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
          <b>{LABEL[s.slug] ?? s.short}</b>
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
      <Link className="all" href="/services/">
        View all services <span className="chev">»</span>
      </Link>
    </div>
  );
}
