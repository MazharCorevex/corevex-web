// HTML to JSX
import * as cheerio from "cheerio";

const ATTR = {
  class: "className",
  for: "htmlFor",
  tabindex: "tabIndex",
  autocomplete: "autoComplete",
  fetchpriority: "fetchPriority",
  srcset: "srcSet",
  readonly: "readOnly",
  maxlength: "maxLength",
  minlength: "minLength",
  novalidate: "noValidate",
  colspan: "colSpan",
  rowspan: "rowSpan",
  "stroke-width": "strokeWidth",
  "stroke-linecap": "strokeLinecap",
  "stroke-linejoin": "strokeLinejoin",
  "stroke-dasharray": "strokeDasharray",
  "stroke-dashoffset": "strokeDashoffset",
  "fill-rule": "fillRule",
  "clip-rule": "clipRule",
  "stop-color": "stopColor",
  "stop-opacity": "stopOpacity",
  "fill-opacity": "fillOpacity",
  viewbox: "viewBox",
  inputmode: "inputMode",
  enctype: "encType",
  crossorigin: "crossOrigin",
  "xlink:href": "xlinkHref",
  "xml:space": "xmlSpace",
  "xmlns:xlink": "xmlnsXlink",
};
const BOOL = new Set(["required", "hidden", "open", "disabled", "multiple", "autofocus", "novalidate", "readonly", "defer", "async"]);
const VOID = new Set(["img", "input", "br", "hr", "meta", "link", "source", "area", "col", "embed", "wbr", "track"]);

export function normHref(href) {
  if (!href) return href;
  if (/^(https?:|mailto:|tel:|#|javascript:)/.test(href)) return href;
  let h = href.replace(/^(\.\.\/)+/, "").replace(/^\.\//, "");
  const [p, hash] = h.split("#");
  let path = p.replace(/index\.html$/, "").replace(/404\.html$/, "404/");
  path = "/" + path;
  if (!path.endsWith("/")) path += "/";
  path = path.replace(/\/+/g, "/");
  return path + (hash ? "#" + hash : "");
}

export function normSrc(src) {
  if (!src) return src;
  return src.replace(/^(\.\.\/)*assets\/img\//, "/images/");
}

const camel = (s) => s.replace(/-([a-z])/g, (_, c) => c.toUpperCase());

function styleObj(str) {
  const parts = str
    .split(";")
    .map((x) => x.trim())
    .filter(Boolean)
    .map((d) => {
      const i = d.indexOf(":");
      const k = d.slice(0, i).trim();
      const v = d.slice(i + 1).trim().replace(/url\(([^)]+)\)/g, (_, u) => `url(${normSrc(u.replace(/['"]/g, ""))})`);
      const key = k.startsWith("--") ? JSON.stringify(k) : /^-?[a-z]+(-[a-z]+)*$/.test(k) ? camel(k.replace(/^-ms-/, "ms-")) : JSON.stringify(k);
      return `${key}: ${JSON.stringify(v)}`;
    });
  return `{{ ${parts.join(", ")} } as CSSProperties}`;
}

function text(t) {
  t = t.replace(/\s+/g, " ");
  if (t === "") return "";
  if (/^ $/.test(t)) return `{" "}`;
  if (/[{}<>"'`]/.test(t) || /^\s|\s$/.test(t)) return `{${JSON.stringify(t)}}`;
  return t;
}

export function createConverter(opts = {}) {
  const used = new Set();
  const { sizes = () => undefined, replace = () => null, priority = () => false } = opts;

  function attrs(el, tag, skip = []) {
    const out = [];
    for (const [k0, v] of Object.entries(el.attribs || {})) {
      if (skip.includes(k0)) continue;
      const k = ATTR[k0] || k0;
      if (k0 === "style") {
        used.add("CSSProperties");
        out.push(`style=${styleObj(v)}`);
        continue;
      }
      if (k0 === "selected" || k0 === "checked") continue;
      if (BOOL.has(k0) && (v === "" || v === k0)) {
        out.push(k);
        continue;
      }
      if (tag === "input" && k0 === "value" && el.attribs.type !== "hidden" && el.attribs.type !== "submit") {
        out.push(`defaultValue=${JSON.stringify(v)}`);
        continue;
      }
      out.push(`${k}=${JSON.stringify(k0 === "data-img" ? normSrc(v) : v)}`);
    }
    return out.length ? " " + out.join(" ") : "";
  }

  function node($, n, depth = 0) {
    if (n.type === "text") {
      const raw = n.data;
      if (/^\s*$/.test(raw)) {
        const parent = n.parent && n.parent.name;
        if (["table", "tbody", "thead", "tr", "select", "ul", "ol", "dl", "colgroup"].includes(parent)) return "";
        if (raw.includes("\n")) return "";
        return raw.length ? `{" "}` : "";
      }
      return text(raw);
    }
    if (n.type === "comment") return "";
    if (n.type !== "tag" && n.type !== "script" && n.type !== "style") return "";
    const tag = n.name;
    const r = replace($, n);
    if (r !== null && r !== undefined) {
      if (typeof r === "object") {
        (r.imports || []).forEach((i) => used.add(i));
        return r.jsx;
      }
      return r;
    }
    if (tag === "script" || tag === "style") return "";
    const kids = () => (n.children || []).map((c) => node($, c, depth + 1)).join("");

    if (tag === "a") {
      const href = n.attribs.href || "";
      const label = $(n).text().trim();
      if (/-minute call/.test(label)) {
        used.add("BookCall");
        const cls = n.attribs.class ? ` className=${JSON.stringify(n.attribs.class)}` : "";
        return `<BookCall${cls}>Book a 30-minute call</BookCall>`;
      }
      const h = normHref(href);
      if (h && h.startsWith("/")) {
        used.add("Link");
        return `<Link href=${JSON.stringify(h)}${attrs(n, tag, ["href"])}>${kids()}</Link>`;
      }
      return `<a href=${JSON.stringify(h || "#")}${attrs(n, tag, ["href"])}>${kids()}</a>`;
    }
    if (tag === "img") {
      const src = normSrc(n.attribs.src || "");
      if (src.startsWith("/images/")) {
        used.add("Img");
        const alt = JSON.stringify(n.attribs.alt || "");
        const s = sizes($, n, src);
        const extra = [];
        if (n.attribs.class) extra.push(`className=${JSON.stringify(n.attribs.class)}`);
        if (n.attribs.style) {
          used.add("CSSProperties");
          extra.push(`style=${styleObj(n.attribs.style)}`);
        }
        if (n.attribs["aria-hidden"]) extra.push(`aria-hidden="true"`);
        if (n.attribs.height && src.endsWith(".svg") && !n.attribs.width) extra.push(`height={${n.attribs.height}}`);
        if (s) extra.push(`sizes=${JSON.stringify(s)}`);
        if (priority($, n, src)) extra.push("priority");
        return `<Img src=${JSON.stringify(src)} alt=${alt}${extra.length ? " " + extra.join(" ") : ""} />`;
      }
    }
    if (tag === "div" || tag === "span") {
      const st = n.attribs.style || "";
      const m = st.match(/background-image:\s*url\(([^)]+)\)/);
      if (m && /\bbg\b/.test(n.attribs.class || "")) {
        used.add("Img");
        const src = normSrc(m[1].replace(/['"]/g, ""));
        const rest = st.replace(/background-image:\s*url\([^)]+\);?/, "").trim();
        const restAttr = rest ? ` style=${styleObj(rest)}` : "";
        if (rest) used.add("CSSProperties");
        const s = sizes($, n, src) || "(max-width: 860px) 100vw, 50vw";
        return `<${tag} className=${JSON.stringify(n.attribs.class)}${restAttr}><Img src=${JSON.stringify(src)} alt="" fill sizes=${JSON.stringify(s)} /></${tag}>`;
      }
    }
    if (tag === "select") {
      const sel = $(n).find("option[selected]").first();
      const dv = sel.length ? ` defaultValue=${JSON.stringify(sel.attr("value") ?? sel.text())}` : "";
      return `<select${attrs(n, tag)}${dv}>${kids()}</select>`;
    }
    if (tag === "textarea") {
      return `<textarea${attrs(n, tag)}${$(n).text() ? ` defaultValue=${JSON.stringify($(n).text())}` : ""} />`;
    }
    if (tag === "input" && n.attribs.checked !== undefined) {
      return `<input${attrs(n, tag)} defaultChecked />`;
    }
    if (VOID.has(tag)) return `<${tag}${attrs(n, tag)} />`;
    const inner = kids();
    if (!inner && ["path", "circle", "rect", "ellipse", "line", "polyline", "polygon", "i", "span", "div", "canvas", "stop"].includes(tag)) {
      return `<${tag}${attrs(n, tag)} />`;
    }
    return `<${tag}${attrs(n, tag)}>${inner}</${tag}>`;
  }

  return {
    used,
    convert($, nodes) {
      return nodes.map((n) => node($, n)).join("");
    },
  };
}

export function importsFor(used) {
  const lines = [];
  if (used.has("CSSProperties")) lines.push(`import type { CSSProperties } from "react";`);
  if (used.has("Link")) lines.push(`import Link from "next/link";`);
  if (used.has("Img")) lines.push(`import Img from "@/components/ui/Img";`);
  if (used.has("BookCall")) lines.push(`import BookCall from "@/components/booking/BookCall";`);
  for (const u of used) {
    if (typeof u === "string" && u.startsWith("import ")) lines.push(u);
  }
  return lines.join("\n");
}

export function load(html) {
  return cheerio.load(html, { xml: false, decodeEntities: true, lowerCaseAttributeNames: false });
}
