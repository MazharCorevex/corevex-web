// Image pipeline
import { promises as fs } from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { optimize } from "svgo";

const root = process.cwd();
const refImg = path.join(root, "reference/assets/img");
const outImg = path.join(root, "public/images");
const newImgs = path.join(root, "new-images");

async function walk(dir) {
  const out = [];
  for (const e of await fs.readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else out.push(p);
  }
  return out;
}

async function copyReference() {
  let n = 0;
  for (const file of await walk(refImg)) {
    const rel = path.relative(refImg, file);
    // Portfolio boards now come from new-images/portfolio
    if (rel.split(path.sep)[0] === "portfolio") continue;
    const dest = path.join(outImg, rel);
    await fs.mkdir(path.dirname(dest), { recursive: true });
    if (/.(mp4|webm)$|loop-poster/.test(file)) continue;
    if (file.endsWith(".svg")) {
      const src = await fs.readFile(file, "utf8");
      const res = optimize(src, { multipass: true, plugins: ["preset-default"] });
      await fs.writeFile(dest, res.data);
    } else {
      await fs.copyFile(file, dest);
    }
    n++;
  }
  return n;
}

async function convertNew() {
  let n = 0;
  try {
    await fs.access(newImgs);
  } catch {
    return 0;
  }
  const dest = path.join(outImg, "photos");
  await fs.mkdir(dest, { recursive: true });
  for (const file of await fs.readdir(newImgs)) {
    if (!/\.png$/i.test(file)) continue;
    const base = file.replace(/\.png$/i, "");
    const src = path.join(newImgs, file);
    await sharp(src).webp({ quality: 82 }).toFile(path.join(dest, `${base}.webp`));
    await sharp(src).resize({ width: 800, withoutEnlargement: true }).webp({ quality: 82 }).toFile(path.join(dest, `${base}-800.webp`));
    n++;
  }
  return n;
}

// Website icon set from new-images/icons
const ICONS = ["favicon.ico", "favicon.svg", "favicon-32.png", "apple-touch-icon.png", "icon-192.png", "icon-512.png", "icon-maskable-512.png", "site.webmanifest", "og-image.png", "og-image.jpg"];

async function rootIcons() {
  const pub = path.join(root, "public");
  const src = path.join(newImgs, "icons");
  try {
    await fs.access(src);
  } catch {
    return;
  }
  for (const f of ICONS) await fs.copyFile(path.join(src, f), path.join(pub, f));
}

// Portfolio boards: 1600 and 800 wide WebP
async function convertPortfolio() {
  const src = path.join(newImgs, "portfolio");
  try {
    await fs.access(src);
  } catch {
    return 0;
  }
  const dest = path.join(outImg, "portfolio");
  await fs.mkdir(dest, { recursive: true });
  let n = 0;
  for (const file of await fs.readdir(src)) {
    if (!/\.(png|webp|jpe?g)$/i.test(file)) continue;
    const base = file.replace(/\.(png|webp|jpe?g)$/i, "");
    const input = path.join(src, file);
    await sharp(input).resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 82 }).toFile(path.join(dest, `${base}-1600.webp`));
    await sharp(input).resize({ width: 800, withoutEnlargement: true }).webp({ quality: 82 }).toFile(path.join(dest, `${base}-800.webp`));
    n++;
  }
  return n;
}

const copied = await copyReference();
const converted = await convertNew();
const boards = await convertPortfolio();
console.log(`converted ${boards} portfolio boards`);
await rootIcons();
console.log(`copied ${copied} reference assets, converted ${converted} new PNGs`);

// Dimension manifest
const manifest = {};
for (const file of (await walk(outImg)).sort()) {
  const rel = "/images/" + path.relative(outImg, file).split(path.sep).join("/");
  if (/\.(webp|png|jpe?g|avif)$/i.test(file)) {
    const m = await sharp(file).metadata();
    manifest[rel] = [m.width, m.height];
  } else if (/.(mp4|webm)$|loop-poster/.test(file)) continue;
    if (file.endsWith(".svg")) {
    const s = await fs.readFile(file, "utf8");
    const w = s.match(/<svg[^>]*\swidth="([\d.]+)/);
    const h = s.match(/<svg[^>]*\sheight="([\d.]+)/);
    const vb = s.match(/viewBox="([\d.\s-]+)"/);
    if (w && h) manifest[rel] = [Math.round(+w[1]), Math.round(+h[1])];
    else if (vb) {
      const p = vb[1].trim().split(/\s+/).map(Number);
      manifest[rel] = [Math.round(p[2]), Math.round(p[3])];
    }
  }
}
await fs.writeFile(path.join(root, "lib/image-manifest.json"), JSON.stringify(manifest, null, 0));
console.log(`manifest: ${Object.keys(manifest).length} images`);
