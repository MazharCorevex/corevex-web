import type { Metadata } from "next";
import LegalPage, { LegalBlocks } from "@/components/legal/LegalPage";
import CookieSettingsLink from "@/components/consent/CookieSettingsLink";
import JsonLd from "@/components/seo/JsonLd";
import { legalDoc } from "@/lib/legal";
import { breadcrumbLd, pageLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("/cookies/");

const ROWS = [
  ["cv_consent", "Remembers your cookie choice", "Necessary", "6 months"],
  ["_ga and _ga_*", "Google Analytics visitor statistics", "Analytics", "Up to 14 months"],
  ["Calendly cookies", "Set only when you open the booking window", "Third party", "See Calendly's policy"],
];

export default function Page() {
  const doc = legalDoc("cookies");
  const [intro, ...rest] = doc.blocks;
  return (
    <>
      <LegalPage doc={{ ...doc, blocks: [intro] }} self="/cookies/">
        <h2>Cookies we use</h2>
        <div className="legal-table" role="region" aria-label="Cookies we use" tabIndex={0}>
          <table>
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Purpose</th>
                <th scope="col">Type</th>
                <th scope="col">Duration</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map(([name, purpose, type, time]) => (
                <tr key={name}>
                  <th scope="row">
                    <code>{name}</code>
                  </th>
                  <td>{purpose}</td>
                  <td>{type}</td>
                  <td>{time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <LegalBlocks blocks={rest} self="/cookies/" />
        <p>
          <CookieSettingsLink className="btn btn-ghost">Open cookie settings</CookieSettingsLink>
        </p>
      </LegalPage>
      <JsonLd data={[...pageLd("/cookies/"), breadcrumbLd([["Home", "/"], ["Cookie Policy", "/cookies/"]])]} />
    </>
  );
}
