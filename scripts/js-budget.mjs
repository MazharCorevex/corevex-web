// First-load JS per page, gzipped
import { gzipSync } from "node:zlib";

const BASE = process.argv[2] || "http://localhost:3100";
const LIMIT = 120 * 1024;
const seo = JSON.parse(await (await import("node:fs/promises")).readFile(new URL("../lib/seo-data.json", import.meta.url), "utf8"));
const routes = Object.keys(seo).filter((r) => r !== "/404/");
const cache = new Map();

async function size(src) {
  if (cache.has(src)) return cache.get(src);
  const buf = Buffer.from(await (await fetch(new URL(src, BASE))).arrayBuffer());
  const n = gzipSync(buf, { level: 9 }).length;
  cache.set(src, n);
  return n;
}

let fail = false;
const rows = [];
for (const r of routes) {
  const html = await (await fetch(BASE + r)).text();
  const srcs = [...new Set([...html.matchAll(/<script([^>]*)src="([^"]+)"[^>]*>/g)].filter((m) => !/nomodule/i.test(m[0])).map((m) => m[2]))];
  let total = 0;
  for (const s of srcs) total += await size(s);
  const inline = [...html.matchAll(/<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/g)].reduce((n, m) => n + gzipSync(m[1]).length, 0);
  const kb = (total / 1024).toFixed(1);
  rows.push([r, kb, (inline / 1024).toFixed(1), srcs.some((s) => /three/.test(s))]);
  if (total > LIMIT) fail = true;
}
rows.sort((a, b) => b[1] - a[1]);
console.log("route".padEnd(52), "js kB gz", " inline kB (RSC payload)");
for (const [r, kb, il, bad] of rows) console.log(r.padEnd(52), kb.padStart(8), il.padStart(10), bad ? "  heavy chunk!" : "");
console.log(fail ? `\nFAIL: a page is over ${LIMIT / 1024} kB` : `\nOK: every page is under ${LIMIT / 1024} kB`);
process.exit(fail ? 1 : 0);
