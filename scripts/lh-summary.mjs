// Lighthouse medians per page
import fs from "node:fs";

const dir = process.argv.slice(2).find((a) => !a.startsWith("--")) || ".lighthouseci";
const runs = fs
  .readdirSync(dir)
  .filter((f) => f.startsWith("lhr-") && f.endsWith(".json"))
  .map((f) => JSON.parse(fs.readFileSync(`${dir}/${f}`, "utf8")));
const by = new Map();
for (const r of runs) {
  const p = new URL(r.finalDisplayedUrl).pathname;
  if (!by.has(p)) by.set(p, []);
  by.get(p).push(r);
}
const med = (xs) => {
  const s = [...xs].sort((a, b) => a - b);
  return s[Math.floor(s.length / 2)];
};
const rows = [];
for (const [p, rs] of by) {
  const s = (k) => med(rs.map((r) => Math.round(r.categories[k].score * 100)));
  const n = (k) => med(rs.map((r) => r.audits[k].numericValue));
  const js = med(rs.map((r) => r.audits["resource-summary"].details.items.find((i) => i.resourceType === "script")?.transferSize || 0));
  rows.push({ page: p, perf: s("performance"), a11y: s("accessibility"), bp: s("best-practices"), seo: s("seo"), lcp: (n("largest-contentful-paint") / 1000).toFixed(1) + " s", cls: n("cumulative-layout-shift").toFixed(3), tbt: Math.round(n("total-blocking-time")) + " ms", js: Math.round(js / 1024) + " KB", runs: rs.length });
}
rows.sort((a, b) => a.page.localeCompare(b.page));
if (process.argv.includes("--md")) {
  console.log("| Page | Perf | A11y | BP | SEO | LCP | CLS | TBT | JS |\n| --- | --- | --- | --- | --- | --- | --- | --- | --- |");
  for (const r of rows) console.log(`| ${r.page} | ${r.perf} | ${r.a11y} | ${r.bp} | ${r.seo} | ${r.lcp} | ${r.cls} | ${r.tbt} | ${r.js} |`);
} else console.table(rows);
