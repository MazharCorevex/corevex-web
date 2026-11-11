import "server-only";
import { readFileSync } from "node:fs";
import { join } from "node:path";

export type Block = { t: "h2" | "p"; text: string } | { t: "ul"; items: string[] };
export type LegalDoc = { title: string; effective: string; blocks: Block[] };

// Legal markdown from content/legal
export function legalDoc(name: "privacy" | "terms" | "cookies"): LegalDoc {
  const src = readFileSync(join(process.cwd(), "content", "legal", `${name}.md`), "utf8");
  return parseLegal(src);
}

export function parseLegal(src: string): LegalDoc {
  const doc: LegalDoc = { title: "", effective: "", blocks: [] };
  let list: string[] | null = null;
  for (const raw of src.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line.startsWith("- ")) list = null;
    if (!line) continue;
    if (line.startsWith("# ")) doc.title = line.slice(2);
    else if (line.startsWith("## ")) doc.blocks.push({ t: "h2", text: line.slice(3) });
    else if (/^Effective date:/i.test(line) && !doc.effective) doc.effective = line.replace(/^Effective date:\s*/i, "");
    else if (line.startsWith("- ")) {
      if (!list) doc.blocks.push({ t: "ul", items: (list = []) });
      list.push(line.slice(2));
    } else doc.blocks.push({ t: "p", text: line });
  }
  return doc;
}
