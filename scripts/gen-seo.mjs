// SEO data from reference
import { promises as fs } from "node:fs";
import path from "node:path";
import * as cheerio from "cheerio";

const ref = path.join(process.cwd(), "reference");
const out = {};

async function walk(dir) {
  const r = [];
  for (const e of await fs.readdir(dir, { withFileTypes: true })) {
    if (e.name === "assets" || e.name.startsWith("{")) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) r.push(...(await walk(p)));
    else if (e.name.endsWith(".html")) r.push(p);
  }
  return r;
}

for (const file of await walk(ref)) {
  const rel = path.relative(ref, file).split(path.sep).join("/");
  const route = rel === "404.html" ? "/404/" : "/" + rel.replace(/index\.html$/, "");
  const $ = cheerio.load(await fs.readFile(file, "utf8"));
  const ld = [];
  $('script[type="application/ld+json"]').each((_, s) => {
    const d = JSON.parse($(s).html());
    if (d["@type"] !== "Organization") ld.push(d);
  });
  out[route] = {
    title: $("title").text(),
    description: $('meta[name="description"]').attr("content") || "",
    ogTitle: $('meta[property="og:title"]').attr("content") || "",
    ogType: $('meta[property="og:type"]').attr("content") || "website",
    robots: $('meta[name="robots"]').attr("content") || "",
    ld,
  };
}

await fs.writeFile(path.join(process.cwd(), "lib/seo-data.json"), JSON.stringify(out, null, 1));
console.log(Object.keys(out).length, "pages");
