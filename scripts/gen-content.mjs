// Content from reference
import { promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { load, normHref, normSrc } from "./lib/html2jsx.mjs";

const ref = path.join(process.cwd(), "reference");
const outDir = path.join(process.cwd(), "content");
await fs.mkdir(outDir, { recursive: true });
const read = async (f) => load(await fs.readFile(path.join(ref, f), "utf8"));
const key = () => crypto.randomBytes(6).toString("hex");
const clean = (s) => (s || "").replace(/\s+/g, " ").trim();

// Portable Text from HTML
function spans($, el, markDefs, marks = []) {
  const out = [];
  $(el)
    .contents()
    .each((_, n) => {
      if (n.type === "text") {
        const t = n.data.replace(/\s+/g, " ");
        if (t) out.push({ _type: "span", _key: key(), text: t, marks: [...marks] });
      } else if (n.type === "tag") {
        if (n.name === "b" || n.name === "strong") out.push(...spans($, n, markDefs, [...marks, "strong"]));
        else if (n.name === "em" || n.name === "i") out.push(...spans($, n, markDefs, [...marks, "em"]));
        else if (n.name === "a") {
          const k = key();
          markDefs.push({ _type: "link", _key: k, href: normHref(n.attribs.href) });
          out.push(...spans($, n, markDefs, [...marks, k]));
        } else if (n.name === "br") out.push({ _type: "span", _key: key(), text: "\n", marks: [] });
        else out.push(...spans($, n, markDefs, marks));
      }
    });
  return out;
}

function block($, el, style = "normal", extra = {}) {
  const markDefs = [];
  const children = spans($, el, markDefs);
  if (children.length) {
    children[0].text = children[0].text.replace(/^\s+/, "");
    children[children.length - 1].text = children[children.length - 1].text.replace(/\s+$/, "");
  }
  return { _type: "block", _key: key(), style, markDefs, children, ...extra };
}

function toPortable($, root) {
  const blocks = [];
  $(root)
    .children()
    .each((_, n) => {
      const el = $(n);
      if (n.name === "p") blocks.push(block($, n, el.hasClass("intro") ? "lead" : "normal"));
      else if (n.name === "h2" || n.name === "h3") blocks.push(block($, n, n.name, n.attribs.id ? { anchor: n.attribs.id } : {}));
      else if (n.name === "ul" || n.name === "ol")
        el.children("li").each((_, li) => blocks.push(block($, li, "normal", { listItem: n.name === "ul" ? "bullet" : "number", level: 1 })));
      else if (n.name === "table") {
        const rows = [];
        el.find("tr").each((_, tr) => {
          rows.push({ _key: key(), _type: "tableRow", cells: $(tr).children("th,td").toArray().map((c) => clean($(c).text())) });
        });
        blocks.push({ _type: "table", _key: key(), rows, hasHeader: el.find("th").length > 0 });
      } else if (el.hasClass("takeaways") || el.hasClass("btns")) {
        // handled as fields
      } else if (n.name === "div") blocks.push(...toPortable($, n));
    });
  return blocks;
}

// Articles
const articles = [];
for (const dir of (await fs.readdir(path.join(ref, "insights"), { withFileTypes: true })).filter((d) => d.isDirectory())) {
  const slug = dir.name;
  const $ = await read(`insights/${slug}/index.html`);
  const ld = $('script[type="application/ld+json"]').toArray().map((s) => JSON.parse($(s).html()));
  const art = ld.find((d) => d["@type"] === "Article") || {};
  const faq = ld.find((d) => d["@type"] === "FAQPage");
  const prose = $(".prose").first();
  const ctas = prose.find(".btns a").toArray().map((a) => ({ label: clean($(a).text().replace("»", "")), href: normHref(a.attribs.href), primary: $(a).hasClass("btn") && !$(a).hasClass("btn-ghost") }));
  const authorBox = $(".author").first();
  articles.push({
    slug,
    title: clean($("h1").first().text()),
    seoTitle: clean($("title").text()),
    description: $('meta[name="description"]').attr("content"),
    category: clean($(".art-hero .chip").first().text()),
    categoryKey: null,
    readTime: parseInt($(".art-hero .meta-row span").eq(1).text(), 10),
    author: clean(authorBox.find("b").text()),
    authorRole: clean(authorBox.find(".muted").text()),
    image: normSrc($(".art-img img").attr("src")),
    imageAlt: $(".art-img img").attr("alt") || "",
    keywords: art.keywords || "",
    publishedAt: art.datePublished || "2026-11-06",
    takeaways: prose.find(".takeaways li").toArray().map((li) => clean($(li).text())),
    toc: $(".toc a").toArray().map((a) => ({ label: clean($(a).text()), anchor: a.attribs.href.replace("#", "") })),
    body: toPortable($, prose),
    faq: faq ? faq.mainEntity.map((q) => ({ q: q.name, a: q.acceptedAnswer.text })) : [],
    ctas,
    summary: "",
  });
}

// Index order, categories and summaries
{
  const $ = await read("insights/index.html");
  const order = [];
  $(".mag-feat[data-cat], .mag > a[data-cat]").each((_, a) => {
    const slug = normHref(a.attribs.href).split("/")[2];
    order.push(slug);
    const art = articles.find((x) => x.slug === slug);
    art.categoryKey = a.attribs["data-cat"];
    art.summary = clean($(a).find("p").first().text());
    art.featured = $(a).hasClass("mag-feat");
  });
  articles.sort((a, b) => order.indexOf(a.slug) - order.indexOf(b.slug));
  articles.forEach((a, i) => (a.order = i));
  const cats = $("[data-ifilter]").toArray().map((b) => ({ key: b.attribs["data-ifilter"], label: clean($(b).text()) }));
  await fs.writeFile(path.join(outDir, "insight-categories.json"), JSON.stringify(cats, null, 1));
}
{
  const $ = await read("index.html");
  $(".ins a").each((_, a) => {
    const slug = normHref(a.attribs.href).split("/")[2];
    const art = articles.find((x) => x.slug === slug);
    if (art) art.homeOrder = $(".ins a").index(a);
    const teaser = clean($(a).find("p.muted").text());
    if (art && teaser) art.homeTeaser = teaser;
    const alt = $(a).find("img").attr("alt");
    if (art && alt) art.cardAlt = alt;
  });
}
// Keep reading picks
for (const a of articles) {
  const $ = await read(`insights/${a.slug}/index.html`);
  a.related = $(".mag3 > a").toArray().map((x) => normHref(x.attribs.href).split("/")[2]);
}
await fs.writeFile(path.join(outDir, "articles.json"), JSON.stringify(articles, null, 1));

// Case studies
const cases = [];
{
  const $ = await read("work/index.html");
  $(".m-card").each((i, a) => {
    const slug = normHref(a.attribs.href).split("/")[2];
    cases.push({
      slug,
      order: i,
      categories: a.attribs["data-cat"].split(" "),
      industry: clean($(a).find(".chip").text()),
      name: clean($(a).find("h3").text()),
      summary: clean($(a).find("p").text()),
      image: normSrc($(a).find("img").attr("src")),
      imageAlt: $(a).find("img").attr("alt"),
    });
  });
  const home = await read("index.html");
  home(".rail-card").each((_, a) => {
    const slug = normHref(a.attribs.href).split("/")[2];
    const c = cases.find((x) => x.slug === slug);
    if (c) c.railAlt = home(a).find("img").attr("alt");
  });
}
for (const c of cases) {
  const $ = await read(`work/${c.slug}/index.html`);
  c.title = clean($("h1").text());
  c.seoTitle = clean($("title").text());
  c.description = $('meta[name="description"]').attr("content");
  c.heroAlt = $(".cs-hero .shot img").attr("alt");
  c.snapshot = $(".snap > div").toArray().map((d) => ({ label: clean($(d).find("span").text()), value: clean($(d).find("b").text()) }));
  const blocks = $(".cs-block").toArray();
  const byHead = (h) => blocks.find((b) => clean($(b).find("h2").text()).toLowerCase() === h);
  c.challenge = clean($(byHead("the challenge")).find("p").text());
  c.approach = $(byHead("how we approached it")).find("li").toArray().map((li) => clean($(li).text()));
  c.delivered = $(byHead("what we delivered")).find(".delivered > div").toArray().map((d) => ({ title: clean($(d).find("b").text()), text: clean($(d).find("span").text()) }));
  const next = $(".cs-block .m-card").attr("href");
  c.next = next ? normHref(next).split("/")[2] : null;
  c.results = [];
  c.isDesignStudy = true;
}
await fs.writeFile(path.join(outDir, "case-studies.json"), JSON.stringify(cases, null, 1));

// Team
{
  const $ = await read("about/index.html");
  const team = $(".leader").toArray().map((b, i) => {
    const id = b.attribs["data-leader"];
    const tpl = load($(`template#${id}`).html() || "");
    return {
      slug: id.replace(/^bio-/, ""),
      order: i,
      name: clean($(b).find("h3").text()),
      role: clean($(b).find(".info span").first().text()),
      short: clean($(b).find(".info p").text()),
      bio: tpl("p").not(".role").toArray().map((p) => clean(tpl(p).text())),
      image: normSrc($(b).find("img").attr("src")),
      linkedin: "",
      leadership: true,
    };
  });
  await fs.writeFile(path.join(outDir, "team.json"), JSON.stringify(team, null, 1));
}

// Jobs
{
  const $ = await read("careers/index.html");
  const jobs = $(".roles a").toArray().map((a, i) => ({
    slug: clean($(a).find("b").text()).toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    order: i,
    title: clean($(a).find("b").text()),
    type: clean($(a).find("span").eq(0).text()),
    location: clean($(a).find("span").eq(1).text()),
  }));
  await fs.writeFile(path.join(outDir, "jobs.json"), JSON.stringify(jobs, null, 1));
}

console.log(`articles ${articles.length}, case studies ${cases.length}`);
