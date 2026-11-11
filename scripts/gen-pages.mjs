// Page markup from reference
import { promises as fs } from "node:fs";
import path from "node:path";
import { createConverter, importsFor, load } from "./lib/html2jsx.mjs";

const ref = path.join(process.cwd(), "reference");
const outDir = path.join(process.cwd(), "components/generated");
await fs.mkdir(outDir, { recursive: true });

const SIZES = [
  [".rail-card", "(max-width: 600px) 85vw, 560px"],
  [".t-wide", "(max-width: 860px) 100vw, 66vw"],
  [".tile", "(max-width: 860px) 100vw, 33vw"],
  [".acc-item", "(max-width: 860px) 100vw, 40vw"],
  [".ins-feat", "(max-width: 860px) 100vw, 55vw"],
  [".mag", "(max-width: 860px) 100vw, 33vw"],
  [".m-card", "(max-width: 860px) 100vw, 50vw"],
  [".art-img", "(max-width: 860px) 100vw, 45vw"],
  [".svc-photo", "(max-width: 860px) 100vw, 42vw"],
  [".shot", "(max-width: 1280px) 100vw, 1200px"],
  [".ed-photo", "100vw"],
  [".frame", "(max-width: 860px) 100vw, 42vw"],
  [".feat-media", "(max-width: 860px) 100vw, 50vw"],
  [".swipe", "(max-width: 600px) 80vw, 360px"],
  [".split-img", "(max-width: 860px) 100vw, 50vw"],
  [".ph", "160px"],
  [".author", "48px"],
];

const C = (name, file = name) => `import ${name} from "@/components/${file}";`;

function rules(page) {
  return ($, n) => {
    const el = $(n);
    const cls = n.attribs?.class || "";
    const has = (c) => cls.split(/\s+/).includes(c);

    if (/\bwords\b/.test(cls) && el.children().length === 0) {
      const extra = [];
      if (n.attribs["data-br"]) extra.push(`br={${n.attribs["data-br"]}}`);
      if (n.attribs["aria-hidden"]) extra.push(`aria-hidden="true"`);
      if (n.attribs.style) extra.push(`style={${JSON.stringify(Object.fromEntries(n.attribs.style.split(";").filter(Boolean).map((d) => { const [k, v] = d.split(":"); return [k.trim().replace(/-([a-z])/g, (_, c) => c.toUpperCase()), v.trim()]; })))}}`);
      return { jsx: `<Words as="${n.name}" className=${JSON.stringify(cls.replace(/\s*\bwords\b/, " words").trim())}${extra.length ? " " + extra.join(" ") : ""}>{${JSON.stringify(el.text().trim())}}</Words>`, imports: [C("Words", "ui/Words")] };
    }
    if (has("hero-art")) return { jsx: `<HeroArt />`, imports: [C("HeroArt", "home/HeroArt")] };
    if (n.attribs?.["data-health"] !== undefined) return { jsx: `<HealthCheck />`, imports: [C("HealthCheck", "home/HealthCheck")] };
    if (n.name === "section" && has("core")) return { jsx: `<CoreSection />`, imports: [C("CoreSection", "home/CoreSection")] };
    if (n.name === "section" && (has("marquee") || has("logo-strip"))) return { jsx: `<ClientLogos variant="${has("marquee") ? "marquee" : "strip"}" />`, imports: [C("ClientLogos", "sections/ClientLogos")] };
    if (n.name === "form" && page === "contact") return { jsx: `<ContactStepped />`, imports: [C("ContactStepped", "forms/ContactStepped")] };
    if (n.name === "form" && page === "careers") return { jsx: `<CareersForm roles={roles} blob={blob} />`, imports: [C("CareersForm", "forms/CareersForm")] };
    if (n.name === "form" && n.attribs["data-form"] !== undefined) return { jsx: `<QuickContact />`, imports: [C("QuickContact", "forms/QuickContact")] };
    if (has("hover-img") || has("sheet") || n.name === "template") return "";
    return null;
  };
}

function wrapRules(conv, $) {
  return (n) => {
    const cls = n.attribs?.class || "";
    const has = (c) => cls.split(/\s+/).includes(c);
    const inner = () => conv.convert($, n.children || []);
    const ca = `className=${JSON.stringify(cls)}`;
    if (n.name === "section" && n.attribs["data-rail"] !== undefined) return { c: "Rail", f: "interactive/Rail", jsx: () => `<Rail ${ca}>${inner()}</Rail>` };
    if (has("stx")) return { c: "Tabs", f: "interactive/Tabs", jsx: () => `<Tabs ${ca}>${inner()}</Tabs>` };
    if (has("acc")) return { c: "Accordion", f: "interactive/Accordion", jsx: () => `<Accordion ${ca}>${inner()}</Accordion>` };
    if (has("svc-rows")) return { c: "SvcRows", f: "interactive/SvcRows", jsx: () => `<SvcRows ${ca}${n.attribs["data-reveal-group"] !== undefined ? " data-reveal-group" : ""}>${inner()}</SvcRows>` };
    if (has("feat-wrap")) return { c: "FeatList", f: "interactive/FeatList", jsx: () => `<FeatList ${ca}>${inner()}</FeatList>` };
    if (has("ba")) return { c: "BeforeAfter", f: "interactive/BeforeAfter", jsx: () => `<BeforeAfter ${ca}>${inner()}</BeforeAfter>` };
    if (n.attribs?.["data-chat"] !== undefined || n.attribs?.["data-extract"] !== undefined || n.attribs?.["data-flow"] !== undefined) {
      const kind = n.attribs["data-chat"] !== undefined ? "chat" : n.attribs["data-extract"] !== undefined ? "extract" : "flow";
      return { c: "Demo", f: "interactive/Demo", jsx: () => `<Demo kind="${kind}" ${ca}>${inner()}</Demo>` };
    }
    return null;
  };
}

export async function convertMain(file, page, { select = "main", firstSectionPriority = true } = {}) {
  const $ = load(await fs.readFile(path.join(ref, file), "utf8"));
  const main = $(select).first();
  // Load reveals in the first section
  const first = main.children().first();
  first.find("[data-reveal]").attr("data-reveal", "load");
  if (first.is("[data-reveal]")) first.attr("data-reveal", "load");
  const firstImgs = new Set(firstSectionPriority ? first.find("img").toArray() : []);

  const base = rules(page);
  let conv;
  const wrap = (n) => wrapRules(conv, $)(n);
  conv = createConverter({
    sizes: ($, n) => {
      for (const [sel, s] of SIZES) if ($(n).closest(sel).length) return s;
      return undefined;
    },
    priority: ($, n, src) => firstImgs.has(n) && !src.endsWith(".svg"),
    replace: ($, n) => {
      const r = base($, n);
      if (r !== null) return r;
      const w = wrap(n);
      if (w) {
        conv.used.add(C(w.c, w.f));
        return w.jsx();
      }
      return null;
    },
  });
  const sections = main.children().toArray().map((n) => conv.convert($, [n]));
  return { sections, used: conv.used, $ };
}

async function writePage(name, file, page, opts = {}) {
  const { sections, used } = await convertMain(file, page, opts);
  const props = page === "careers" ? "{ roles, blob }: { roles: string[]; blob: boolean }" : "";
  const body = `${importsFor(used)}\n\n// ${name}\nexport default function ${name}(${props}) {\n  return (\n    <>\n${sections.map((s) => "      " + s).join("\n")}\n    </>\n  );\n}\n`;
  await fs.writeFile(path.join(outDir, `${name}.tsx`), body);
  console.log("wrote", name, sections.length, "sections");
}

const PAGES = [
  ["HomePage", "index.html", "home"],
  ["ServicesHub", "services/index.html", "services"],
  ["AiLabPage", "ai-lab/index.html", "ai-lab"],
  ["AboutPage", "about/index.html", "about"],
  ["CareersPage", "careers/index.html", "careers"],
  ["ContactPage", "contact/index.html", "contact"],
  ["FaqPage", "faq/index.html", "faq"],
  ["NotFoundPage", "404.html", "404"],
];

if (!process.argv[2]) {
  for (const [name, file, page] of PAGES) await writePage(name, file, page);
}

// Home sections
if (process.argv[2] === "--home") {
  const names = ["Hero", null, "ServicesBento", "CodeRescue", "Numbers", null, "WorkRail", "TechStack", "Process", "WhyCorevex", "Industries", "TrustCards", "InsightsBlock", "ContactFinale"];
  const { sections, $ } = await convertMain("index.html", "home");
  const dir = path.join(process.cwd(), "components/home/sections");
  await fs.mkdir(dir, { recursive: true });
  for (let i = 0; i < sections.length; i++) {
    const nm = names[i];
    if (!nm) continue;
    const target = path.join(dir, `${nm}.tsx`);
    if (await fs.access(target).then(() => true, () => false)) continue;
    const src = sections[i];
    const imp = [];
    const need = (re, line) => re.test(src) && imp.push(line);
    need(/as CSSProperties/, `import type { CSSProperties } from "react";`);
    need(/<Link /, `import Link from "next/link";`);
    need(/<Img /, `import Img from "@/components/ui/Img";`);
    need(/<BookCall/, `import BookCall from "@/components/booking/BookCall";`);
    need(/<Words /, `import Words from "@/components/ui/Words";`);
    need(/<HeroArt/, `import HeroArt from "@/components/home/HeroArt";`);
    need(/<HealthCheck/, `import HealthCheck from "@/components/home/HealthCheck";`);
    need(/<Rail /, `import Rail from "@/components/interactive/Rail";`);
    need(/<Tabs /, `import Tabs from "@/components/interactive/Tabs";`);
    need(/<Accordion /, `import Accordion from "@/components/interactive/Accordion";`);
    need(/<QuickContact/, `import QuickContact from "@/components/forms/QuickContact";`);
    await fs.writeFile(path.join(dir, `${nm}.tsx`), `${imp.join("\n")}\n\n// ${nm}\nexport default function ${nm}() {\n  return (\n    ${src}\n  );\n}\n`);
  }
  void $;
  console.log("home sections written");
}

// Services
if (process.argv[2] === "--services") {
  const { normHref, normSrc } = await import("./lib/html2jsx.mjs");
  const clean = (s) => (s || "").replace(/\s+/g, " ").trim();
  const slugs = (await fs.readdir(path.join(ref, "services"), { withFileTypes: true })).filter((d) => d.isDirectory()).map((d) => d.name);
  const bodyDir = path.join(process.cwd(), "components/services/bodies");
  await fs.mkdir(bodyDir, { recursive: true });
  const data = [];
  const pascal = (s) => s.replace(/(^|-)([a-z])/g, (_, __, c) => c.toUpperCase());
  for (const slug of slugs) {
    const file = `services/${slug}/index.html`;
    const { $ } = await convertMain(file, "service");
    const main = $("main");
    const secs = main.children("section").toArray();
    const hero = $(secs[0]);
    const btns = hero.find(".btns a").toArray().map((a) => ({ label: clean($(a).text().replace("»", "")), href: normHref(a.attribs.href), primary: !$(a).hasClass("btn-ghost") }));
    const deliverSec = secs.find((s) => $(s).find(".deliver").length);
    const faqSec = secs.find((s) => $(s).find(".faq").length);
    const relSec = secs.find((s) => clean($(s).find(".label").first().text()) === "Related services");
    const ctaSec = secs.find((s) => $(s).hasClass("cta-band"));
    const startIdx = secs.findIndex((s) => $(s).hasClass("logo-strip")) + 1;
    const endIdx = secs.indexOf(deliverSec);
    const middle = secs.slice(startIdx, endIdx);
    const svc = {
      slug,
      name: clean(hero.find(".crumbs span").last().text()),
      h1: clean(hero.find("h1").text()),
      lead: clean(hero.find(".lead").text()),
      buttons: btns,
      proof: hero.find(".proof-chips span").toArray().map((s) => clean($(s).text())),
      photo: normSrc(hero.find(".svc-photo img").attr("src")),
      photoAlt: hero.find(".svc-photo img").attr("alt") || "",
      chip: { value: clean(hero.find(".float-chip b").text()), label: clean(hero.find(".float-chip span").text()) },
      deliver: {
        label: clean($(deliverSec).find(".label").text()),
        title: clean($(deliverSec).find("h2").text()),
        steps: $(deliverSec).find(".deliver > div").toArray().map((d) => ({ title: clean($(d).find("b").text()), text: clean($(d).find("p").text()) })),
      },
      faq: $(faqSec).find("details").toArray().map((d) => ({ q: clean($(d).find("summary").text()), a: clean($(d).find("p").text()) })),
      faqTitle: clean($(faqSec).find("h2").text()),
      related: $(relSec).find("a.tile").toArray().map((a) => normHref(a.attribs.href).split("/")[2]),
      relatedTitle: clean($(relSec).find("h2").text()),
      cta: { title: clean($(ctaSec).find("h2").text()), text: clean($(ctaSec).find("p").text()), label: clean($(ctaSec).find("a").text().replace("»", "")), href: normHref($(ctaSec).find("a").attr("href")) },
    };
    data.push(svc);
    // Body sections
    const body = await convertMain(file, "service-body", { firstSectionPriority: false });
    const bodySecs = body.sections.slice(startIdx, endIdx);
    const src = bodySecs.join("\n");
    const imp = [];
    const need = (re, line) => re.test(src) && imp.push(line);
    need(/as CSSProperties/, `import type { CSSProperties } from "react";`);
    need(/<Link /, `import Link from "next/link";`);
    need(/<Img /, `import Img from "@/components/ui/Img";`);
    need(/<BookCall/, `import BookCall from "@/components/booking/BookCall";`);
    need(/<FeatList /, `import FeatList from "@/components/interactive/FeatList";`);
    need(/<BeforeAfter /, `import BeforeAfter from "@/components/interactive/BeforeAfter";`);
    need(/<Rail /, `import Rail from "@/components/interactive/Rail";`);
    const name = pascal(slug) + "Body";
    await fs.writeFile(path.join(bodyDir, `${name}.tsx`), `${imp.join("\n")}\n\n// ${slug}\nexport default function ${name}() {\n  return (\n    <>\n${src}\n    </>\n  );\n}\n`);
    void middle;
  }
  await fs.writeFile(path.join(process.cwd(), "content/services.json"), JSON.stringify(data, null, 1));
  console.log("services", data.length);
}
