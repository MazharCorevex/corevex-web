// Lighthouse CI results as markdown tables (median run per page)
import { readFileSync, readdirSync, existsSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const BUDGET = {
  mobile: { perf: 95, lcp: 2000, cls: 0.05, tbt: 150, si: 2500, fcp: 1500 },
  desktop: { perf: 98, lcp: 1200, cls: 0.02 },
};
const out = {};
let md = "";
// Median run per page: from an LHCI manifest, or from raw reports in a folder
function medianRuns(preset) {
  const dir = join(".lighthouseci", preset);
  const manifest = join(dir, "manifest.json");
  if (existsSync(manifest)) return JSON.parse(readFileSync(manifest, "utf8")).filter((r) => r.isRepresentativeRun).map((r) => JSON.parse(readFileSync(r.jsonPath, "utf8")));
  const raw = process.env[`LH_${preset.toUpperCase()}_DIR`];
  if (!raw || !existsSync(raw)) return [];
  const byUrl = new Map();
  for (const f of readdirSync(raw).filter((x) => x.endsWith(".json"))) {
    const lhr = JSON.parse(readFileSync(join(raw, f), "utf8"));
    if (lhr.configSettings.formFactor !== preset) continue;
    const u = lhr.requestedUrl;
    byUrl.set(u, [...(byUrl.get(u) || []), lhr]);
  }
  return [...byUrl.values()].map((list) => [...list].sort((a, b) => a.categories.performance.score - b.categories.performance.score)[Math.floor(list.length / 2)]);
}

for (const preset of ["mobile", "desktop"]) {
  const lhrs = medianRuns(preset);
  if (!lhrs.length) continue;
  const rows = lhrs.map((lhr) => {
    const a = lhr.audits;
    const n = (k) => a[k]?.numericValue ?? NaN;
    const path = new URL(lhr.finalDisplayedUrl || lhr.requestedUrl).pathname;
    const opp = Object.values(a)
      .filter((x) => x.details?.type === "opportunity" && (x.details.overallSavingsMs || 0) > 50)
      .sort((x, y) => y.details.overallSavingsMs - x.details.overallSavingsMs)
      .slice(0, 3)
      .map((x) => `${x.title} (${Math.round(x.details.overallSavingsMs)} ms)`);
    const lcpEl = a["largest-contentful-paint-element"]?.details?.items?.[0]?.items?.[0]?.node?.snippet || a["largest-contentful-paint-element"]?.details?.items?.[0]?.node?.snippet || "";
    const js = (a["resource-summary"]?.details?.items || []).find((i) => i.resourceType === "script")?.transferSize || 0;
    return {
      path,
      perf: Math.round(lhr.categories.performance.score * 100),
      a11y: Math.round(lhr.categories.accessibility.score * 100),
      bp: Math.round(lhr.categories["best-practices"].score * 100),
      seo: Math.round(lhr.categories.seo.score * 100),
      fcp: Math.round(n("first-contentful-paint")),
      lcp: Math.round(n("largest-contentful-paint")),
      tbt: Math.round(n("total-blocking-time")),
      cls: +n("cumulative-layout-shift").toFixed(3),
      si: Math.round(n("speed-index")),
      js: Math.round(js / 1024),
      opp,
      lcpEl: lcpEl.replace(/\s+/g, " ").slice(0, 90),
    };
  });
  const b = BUDGET[preset];
  const pass = (r) => r.perf >= b.perf && r.lcp < b.lcp && r.cls < b.cls && (b.tbt == null || r.tbt < b.tbt) && (b.si == null || r.si < b.si) && (b.fcp == null || r.fcp < b.fcp);
  rows.sort((x, y) => x.path.localeCompare(y.path));
  out[preset] = rows.map((r) => ({ ...r, pass: pass(r) }));
  md += `\n### ${preset === "mobile" ? "Mobile (Moto G Power, Slow 4G)" : "Desktop"}\n\n`;
  md += "| Page | Perf | A11y | BP | SEO | FCP | LCP | TBT | CLS | SI | JS KB | Budget |\n|---|---|---|---|---|---|---|---|---|---|---|---|\n";
  for (const r of out[preset]) md += `| ${r.path} | ${r.perf} | ${r.a11y} | ${r.bp} | ${r.seo} | ${(r.fcp / 1000).toFixed(2)} s | ${(r.lcp / 1000).toFixed(2)} s | ${r.tbt} ms | ${r.cls} | ${(r.si / 1000).toFixed(2)} s | ${r.js} | ${r.pass ? "PASS" : "FAIL"} |\n`;
}
mkdirSync("test-results/perf", { recursive: true });
writeFileSync("test-results/perf/lighthouse.json", JSON.stringify(out, null, 2));
writeFileSync("test-results/perf/lighthouse.md", md);
console.log(md);
if (out.mobile) {
  const slow = [...out.mobile].sort((x, y) => x.perf - y.perf || y.lcp - x.lcp).slice(0, 5);
  console.log("\nSlowest on mobile:");
  for (const s of slow) console.log(`${s.path}  perf ${s.perf}, LCP ${s.lcp} ms, TBT ${s.tbt} ms; LCP element: ${s.lcpEl}; ${s.opp.join("; ")}`);
}
