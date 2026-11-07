// Group Playwright failures by message
import { readFileSync } from "node:fs";

const j = JSON.parse(readFileSync(process.argv[2] || "test-results/responsive.json", "utf8"));
const counts = new Map();
let passed = 0;
let failed = 0;
const walk = (s, path) => {
  for (const sp of s.specs || [])
    for (const t of sp.tests)
      for (const r of t.results.slice(-1)) {
        if (r.status === "passed") passed++;
        if (r.status === "passed" || r.status === "skipped") continue;
        failed++;
        const msg = (r.error?.message || "").replace(/\u001b\[[0-9;]*m/g, "");
        const lines = msg
          .split("\n")
          .filter((l) => /^\+\s+"/.test(l))
          .map((l) => l.replace(/^\+\s+"/, "").replace(/",?$/, "").replace(/\\"/g, '"'));
        if (!lines.length) lines.push(msg.split("\n").slice(0, 3).join(" | "));
        for (const l of lines) {
          const k = l.replace(/\d+x\d+/g, "NxN").replace(/visible -?\d+\.\.\d+ of \d+/, "visible ..").replace(/ at \d+$/, "");
          if (!counts.has(k)) counts.set(k, { n: 0, ex: [] });
          const c = counts.get(k);
          c.n++;
          if (c.ex.length < 3) c.ex.push(`${t.projectName} ${path.slice(1).join(" ")} ${sp.title}`);
        }
      }
  for (const c of s.suites || []) walk(c, [...path, c.title]);
};
for (const s of j.suites) walk(s, []);
for (const [k, v] of [...counts].sort((a, b) => b[1].n - a[1].n))
  console.log(String(v.n).padStart(4), k.slice(0, 160), "  <", v.ex.join(" ; ").slice(0, 160));
console.log(`passed ${passed}, failed ${failed}`);
