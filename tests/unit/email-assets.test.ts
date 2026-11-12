import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

// Every image an email points to ships with the site
describe("email assets", () => {
  it("files referenced by email templates exist in public", () => {
    const src = ["lib/server/email.ts", "lib/server/forms.ts"].map((f) => readFileSync(f, "utf8")).join("\n");
    const paths = [...src.matchAll(/\$\{SITE_URL\}(\/[^"'\s)]+\.(?:png|jpe?g|gif|webp))/g)].map((m) => m[1]);
    expect(paths.length).toBeGreaterThan(0);
    for (const p of paths) expect(existsSync(join("public", p)), p).toBe(true);
  });

  it("the email logo is a PNG, which every mail client shows", () => {
    const src = readFileSync("lib/server/email.ts", "utf8");
    expect(src).toMatch(/corevex-logo-email\.png/);
    expect(src).not.toMatch(/<img[^>]+\.svg/);
  });
});
