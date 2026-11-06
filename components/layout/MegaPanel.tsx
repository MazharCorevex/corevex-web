import Link from "next/link";
import Img from "@/components/ui/Img";
import { SERVICES } from "@/lib/site";

const ENGAGE = [
  { t: "Dedicated Team", d: "A full team that works as part of yours." },
  { t: "Fixed-Scope Project", d: "An agreed scope delivered in full." },
  { t: "MVP Build", d: "A focused first version to test your idea." },
];

// Mega menu panel
export default function MegaPanel() {
  const group = (g: "build" | "intel") =>
    SERVICES.filter((s) => s.group === g).map((s) => (
      <Link key={s.slug} className="m" href={`/services/${s.slug}/`}>
        <Img src={`/images/icons/${s.icon}.svg`} alt="" />
        <div>
          <b>{s.name}</b>
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
      <div>
        <h2>How we engage</h2>
        {ENGAGE.map((e) => (
          <Link key={e.t} className="m" href="/services/#models">
            <div>
              <b>{e.t}</b>
              <span>{e.d}</span>
            </div>
          </Link>
        ))}
      </div>
      <Link className="feat" href="/work/fleetline-logistics-platform/">
        <Img
          src="/images/portfolio/fleetline-logistics-platform-1600.webp"
          alt="Fleetline logistics dashboard and driver app concept"
          sizes="340px"
        />
        <div>
          <span className="concept">Featured work</span>
          <br />
          <b>Live operations on one custom platform</b>
        </div>
      </Link>
    </div>
  );
}
