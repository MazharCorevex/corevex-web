// Content rules check on rendered pages
import { readFileSync } from "node:fs";

const BASE = process.argv[2] || "http://localhost:3100";
const seo = JSON.parse(readFileSync(new URL("../lib/seo-data.json", import.meta.url), "utf8"));
const routes = Object.keys(seo).filter((r) => r !== "/404/");
const extra = ["/llms.txt", "/sitemap.xml", "/robots.txt"];

const RULES = [
  ["em dash", /\u2014/],
  ["bracket placeholder", /\[[A-Za-z][^\]\n]{0,60}\](?!\()/],
  ["unapproved price", /\$(?!(?:199|599|1,000|2,000|2,500|5,000)\b)\d|(?:USD|EUR|GBP|PKR|£|€)\s?\d|\d+\s?(?:per hour|\/hr)\b/i],
  ["rate or timeline promise", /\b(in|within) \d+\s?(days?|weeks?|months?)\b|\bstarting (at|from)\b(?! \$(?:199|599|1,000|2,000|5,000)\b)|\bhourly rate\b/i],
  ["availability promise", /\bbusiness days?\b|\bsame[- ]day\b|\b24\/7\b|\bwithin (a|an|one|two|three|a few|\d+) (hours?|days?|weeks?|months?)\b|\b(reply|replies|respond|response|turnaround) (in|within)\b/i],
  ["free offer", /free (audit|blueprint|consultation|estimate)/i],
  ["20-minute call", /20[- ]minute/i],
];

function text(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ");
}

let bad = 0;
for (const r of [...routes, ...extra]) {
  const raw = await (await fetch(BASE + r)).text();
  const meta = [...raw.matchAll(/<(?:title|meta[^>]+content=)"?([^"<]*)/g)].map((m) => m[1]).join(" ");
  const ld = [...raw.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]).join(" ");
  // AI Lab extraction demo shows a sample supplier invoice, not Corevex pricing
  const scrub = (t) => (r === "/ai-lab/" ? t.replace(/\$[\d,]+\.\d{2}/g, "") : t);
  const body0 = r.endsWith(".txt") || r.endsWith(".xml") ? raw : `${text(raw)} ${meta} ${ld}`;
  const body = scrub(body0);
  // Client quotes describe what happened; promises are checked in Corevex's own copy
  const ownCopy = scrub(r.endsWith(".txt") || r.endsWith(".xml") ? raw : `${text(raw.replace(/<blockquote[\s\S]*?<\/blockquote>/gi, " "))} ${meta} ${ld}`)
    // The one approved promise: a reply within one business day
    .replace(/\b(?:replies|reply|answers|answer)\s+within one business day\b|\b1 business day reply time\b|\bwithin one business day\b/gi, " ");
  // Legal pages keep their statutory response times as written
  const legal = ["/privacy/", "/terms/", "/cookies/"].includes(r);
  for (const [name, re] of RULES) {
    if (legal && (name === "availability promise" || name === "rate or timeline promise")) continue;
    const m = (name === "availability promise" ? ownCopy : body).match(re);
    if (m) {
      bad++;
      const i = body.indexOf(m[0]);
      console.log(`${r}  ${name}: "...${body.slice(Math.max(0, i - 50), i + 60).trim()}..."`);
    }
  }
}
console.log(bad ? `\n${bad} issue(s) found` : `OK: ${routes.length + extra.length} pages clean`);
process.exit(bad ? 1 : 0);
