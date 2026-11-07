import Link from "next/link";
import { DRAWER_ORDER, svc } from "@/lib/site";
import MegaPanel from "./MegaPanel";
import { Drawer, HeaderBar, HeaderState, MenuButton, NavLink, ServicesMenu } from "./HeaderClient";

const NAV = [
  { href: "/work/", label: "Work" },
  { href: "/ai-lab/", label: "AI Lab" },
  { href: "/about/", label: "About" },
  { href: "/careers/", label: "Careers" },
  { href: "/insights/", label: "Insights" },
  { href: "/contact/", label: "Contact" },
];

// Header
export default function Header() {
  return (
    <HeaderState>
      <HeaderBar>
        <Link className="brand" href="/" aria-label="Corevex Solutions home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo/corevex-logo-primary.svg" alt="Corevex Solutions" width={945} height={213} fetchPriority="high" />
        </Link>
        <nav aria-label="Main">
          <ul className="nav">
            <ServicesMenu>
              <MegaPanel />
            </ServicesMenu>
            {NAV.map((n) => (
              <li key={n.href}>
                <NavLink href={n.href}>{n.label}</NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <Link className="btn btn-sm nav-cta" href="/contact/">
          Start a project <span className="chev">»</span>
        </Link>
        <MenuButton />
      </HeaderBar>
      <Drawer>
        <details className="drawer-acc">
          <summary>Services</summary>
          <Link href="/services/">All services</Link>
          {DRAWER_ORDER.map((slug) => (
            <Link key={slug} href={`/services/${slug}/`}>
              {svc(slug).name}
            </Link>
          ))}
        </details>
        <Link href="/work/">Work</Link>
        <Link href="/ai-lab/">AI Lab</Link>
        <Link href="/about/">About</Link>
        <Link href="/careers/">Careers</Link>
        <Link href="/insights/">Insights</Link>
        <Link href="/faq/">FAQ</Link>
        <Link href="/contact/">Contact</Link>
        <Link className="btn" href="/contact/">
          Start a project <span className="chev">»</span>
        </Link>
      </Drawer>
    </HeaderState>
  );
}
