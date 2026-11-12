// Contact sheets of the screenshot baselines, one per browser and width
import { readdirSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const ROOT = "tests/screenshots";
const OUT = join(ROOT, "contact-sheets");
const THUMB_W = 240;
const THUMB_H = 420;
const COLS = 8;
const LABEL = 22;
mkdirSync(OUT, { recursive: true });

const esc = (s) => s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c]);
for (const browser of ["chromium", "firefox", "webkit"]) {
  for (const width of ["390", "768", "1440"]) {
    const dir = join(ROOT, browser, width);
    if (!existsSync(dir)) continue;
    const files = readdirSync(dir).filter((f) => f.endsWith(".jpg")).sort((a, b) => (a === "home.jpg" ? -1 : b === "home.jpg" ? 1 : a.localeCompare(b)));
    const rows = Math.ceil(files.length / COLS);
    const cellH = THUMB_H + LABEL + 12;
    const tiles = [];
    for (const [i, f] of files.entries()) {
      // Top of each page, scaled to the tile width
      const meta = await sharp(join(dir, f)).metadata();
      const cropH = Math.min(meta.height, Math.round((meta.width * THUMB_H) / THUMB_W));
      const img = await sharp(join(dir, f)).extract({ left: 0, top: 0, width: meta.width, height: cropH }).resize(THUMB_W, THUMB_H, { fit: "contain", position: "top", background: "#ffffff" }).toBuffer();
      const x = (i % COLS) * (THUMB_W + 12) + 12;
      const y = Math.floor(i / COLS) * cellH + 52;
      const name = f.replace(/\.jpg$/, "").replace(/__/g, "/").slice(0, 34);
      tiles.push({ input: img, left: x, top: y + LABEL });
      tiles.push({ input: Buffer.from(`<svg width="${THUMB_W}" height="${LABEL}" xmlns="http://www.w3.org/2000/svg"><text x="0" y="15" font-family="Arial" font-size="13" fill="#262B47">${esc(name)}</text></svg>`), left: x, top: y });
    }
    const W = COLS * (THUMB_W + 12) + 12;
    const H = rows * cellH + 64;
    const title = Buffer.from(`<svg width="${W}" height="44" xmlns="http://www.w3.org/2000/svg"><text x="12" y="30" font-family="Arial" font-size="22" font-weight="bold" fill="#262B47">${browser} ${width}px, ${files.length} pages (top of each page)</text></svg>`);
    await sharp({ create: { width: W, height: H, channels: 3, background: "#F6F7F9" } })
      .composite([{ input: title, left: 0, top: 6 }, ...tiles])
      .jpeg({ quality: 78 })
      .toFile(join(OUT, `${browser}-${width}.jpg`));
    console.log(`${browser}-${width}.jpg: ${files.length} pages`);
  }
}
