// Lighthouse summary
import fs from "node:fs";
const dir = ".lighthouseci";
for (const f of fs.readdirSync(dir).filter((f) => f.startsWith("lhr-") && f.endsWith(".json"))) {
  const r = JSON.parse(fs.readFileSync(`${dir}/${f}`));
  const c = r.categories, a = r.audits;
  const s = (k) => Math.round(c[k].score * 100);
  const fails = Object.values(a).filter((x) => x.score !== null && x.score < 0.9 && !["informative", "notApplicable", "manual"].includes(x.scoreDisplayMode)).map((x) => x.id);
  console.log(new URL(r.finalDisplayedUrl).pathname.padEnd(28), "P", s("performance"), "A", s("accessibility"), "BP", s("best-practices"), "SEO", s("seo"), "| LCP", a["largest-contentful-paint"].displayValue, "CLS", a["cumulative-layout-shift"].displayValue, "TBT", a["total-blocking-time"].displayValue, "|", fails.join(" "));
}
