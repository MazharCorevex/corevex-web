import Link from "next/link";
import Img from "@/components/ui/Img";
import Newsletter from "@/components/forms/Newsletter";
import { CLUTCH_URL, DRAWER_ORDER, GITHUB_URL, LINKEDIN_URL, PSEB_NUMBER, svc } from "@/lib/site";

const COLS = [
  {
    h: "Company",
    links: [
      ["/about/", "About"],
      ["/about/#leadership", "Leadership"],
      ["/careers/", "Careers"],
      ["/contact/", "Contact"],
    ],
  },
  {
    h: "Work",
    links: [
      ["/work/", "Case studies"],
      ["/ai-lab/", "AI Lab"],
    ],
  },
  {
    h: "Resources",
    links: [
      ["/insights/", "Insights"],
      ["/faq/", "FAQ"],
    ],
  },
  {
    h: "Legal",
    links: [
      ["/privacy/", "Privacy Policy"],
      ["/terms/", "Terms of Service"],
    ],
  },
];

export default function Footer() {
  const social = [
    ["LinkedIn", LINKEDIN_URL],
    ["Clutch", CLUTCH_URL],
    ["GitHub", GITHUB_URL],
  ].filter(([, u]) => u);
  return (
    <footer className="footer">
      <div className="wrap">
        <Newsletter />
        <div className="foot-top">
          <div className="foot-brand">
            <Img src="/images/logo/corevex-logo-primary-white.svg" alt="Corevex Solutions" />
            <p className="slogan">Engineered at the Core.</p>
            <p>Corevex Solutions is a PSEB registered software company building custom software, apps and AI since 2022.</p>
          </div>
          <div>
            <h2>Services</h2>
            <ul>
              {DRAWER_ORDER.map((s) => (
                <li key={s}>
                  <Link href={`/services/${s}/`}>{svc(s).name}</Link>
                </li>
              ))}
            </ul>
          </div>
          {COLS.map((c) => (
            <div key={c.h}>
              <h2>{c.h}</h2>
              <ul>
                {c.links.map(([href, label]) => (
                  <li key={label}>
                    <Link href={href}>{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="legal">
          <span>
            © {new Date().getFullYear()} Corevex Solutions. All rights reserved.
            {PSEB_NUMBER ? ` · PSEB Reg. ${PSEB_NUMBER}` : ""}
          </span>
          {social.length > 0 && (
            <span className="soc">
              {social.map(([name, url]) => (
                <a key={name} href={url} target="_blank" rel="noopener noreferrer">
                  {name}
                </a>
              ))}
            </span>
          )}
        </div>
      </div>
    </footer>
  );
}
