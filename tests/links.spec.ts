import { expect, test } from "@playwright/test";
import { ROUTES } from "./routes";

test.describe("links and images", () => {
  test.beforeEach(({}, info) => test.skip(info.project.name !== "1366", "runs once"));

  test("every internal link resolves", async ({ page, request }) => {
    const links = new Set<string>();
    for (const r of ROUTES) {
      await page.goto(r);
      const hrefs = await page.$$eval("a[href]", (as) => as.map((a) => a.getAttribute("href") || ""));
      hrefs.filter((h) => h.startsWith("/")).forEach((h) => links.add(h.split("#")[0]));
    }
    const broken: string[] = [];
    for (const l of links) {
      const res = await request.get(l);
      if (res.status() !== 200) broken.push(`${l} ${res.status()}`);
    }
    expect(broken, `${links.size} links checked`).toEqual([]);
  });

  test("every image loads", async ({ page }) => {
    const failed: string[] = [];
    page.on("response", (r) => {
      if (r.request().resourceType() === "image" && r.status() >= 400) failed.push(`${r.status()} ${r.url()}`);
    });
    for (const r of ROUTES) {
      await page.goto(r, { waitUntil: "domcontentloaded" });
      await page.evaluate(() => document.querySelectorAll("img[loading=lazy]").forEach((i) => ((i as HTMLImageElement).loading = "eager")));
      await page.waitForLoadState("networkidle");
      const broken = await page.$$eval("img", (imgs) =>
        imgs.filter((i) => i.complete && i.naturalWidth === 0 && i.getAttribute("src")).map((i) => i.getAttribute("src")),
      );
      broken.forEach((b) => failed.push(`${r} ${b}`));
      const masks = await page.$$eval(".stx-mask", (els) => els.map((e) => getComputedStyle(e).getPropertyValue("--logo")));
      for (const m of masks) {
        const url = m.match(/url\((.+)\)/)?.[1];
        if (url) {
          const res = await page.request.get(url);
          if (res.status() !== 200) failed.push(`${r} mask ${url}`);
        }
      }
    }
    expect([...new Set(failed)]).toEqual([]);
  });
});
