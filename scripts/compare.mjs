// Reference vs build screenshots
import { chromium } from "@playwright/test";
import sharp from "sharp";
const [route = "/", width = "1366", out = "cmp"] = process.argv.slice(2);
const b = await chromium.launch();
const shots = [];
for (const [base, suffix] of [["http://localhost:4000", "ref"], ["http://localhost:3100", "new"]]) {
  const p = await b.newPage({ viewport: { width: +width, height: 900 } });
  const url = base + route;
  await p.goto(url, { waitUntil: "networkidle" });
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { scrollTo(0, y); await new Promise(r => setTimeout(r, 80)); } scrollTo(0, 0); });
  await p.evaluate(() => document.querySelectorAll("img[loading=lazy]").forEach((i) => (i.loading = "eager")));
  await p.waitForTimeout(2500);
  const file = `test-results/${out}-${suffix}.png`;
  await p.screenshot({ path: file, fullPage: true });
  shots.push(file);
  await p.close();
}
await b.close();
const metas = await Promise.all(shots.map((f) => sharp(f).metadata()));
const h = Math.max(...metas.map((m) => m.height));
const w = Math.max(...metas.map((m) => m.width));
await sharp({ create: { width: w * 2 + 20, height: h, channels: 3, background: "#ff00ff" } })
  .composite(shots.map((f, i) => ({ input: f, left: i * (w + 20), top: 0 })))
  .png()
  .toBuffer()
  .then((buf) => sharp(buf).resize({ width: 900 }).toFile(`test-results/${out}.png`));
console.log("heights", metas.map((m) => m.height).join(" vs "));
