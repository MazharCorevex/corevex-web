import fs from "node:fs";
import * as cheerio from "cheerio";
const $ = cheerio.load(fs.readFileSync(process.argv[2], "utf8"));
const max = +(process.argv[3] || 4);
function walk(el, d) {
  if (d > max) return;
  $(el).children().each((_, c) => {
    const cls = c.attribs.class ? "." + c.attribs.class.replace(/ /g, ".") : "";
    const data = Object.keys(c.attribs).filter((k) => k.startsWith("data-")).join(",");
    const t = $(c).children().length ? "" : " " + $(c).text().trim().slice(0, 40);
    console.log("  ".repeat(d) + c.name + cls + (data ? "[" + data + "]" : "") + t);
    walk(c, d + 1);
  });
}
walk($("main")[0], 0);
