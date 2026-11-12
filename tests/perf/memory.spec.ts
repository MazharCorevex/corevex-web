import { mkdirSync, writeFileSync } from "node:fs";
import { expect, test } from "@playwright/test";

const MINUTES = Number(process.env.MEMORY_MINUTES || 5);
const PATHS = ["/services/", "/work/", "/about/", "/insights/", "/contact/", "/faq/", "/", "/services/code-rescue/", "/insights/what-is-rag/"];

// Five minutes of client-side navigation, heap after GC must not keep growing
test("no memory growth while navigating", async ({ page }) => {
  test.setTimeout((MINUTES + 3) * 60_000);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const cdp = await page.context().newCDPSession(page);
  await cdp.send("Performance.enable");
  const heap = async () => {
    await cdp.send("HeapProfiler.collectGarbage");
    await page.waitForTimeout(300);
    const { metrics } = await cdp.send("Performance.getMetrics");
    const get = (n: string) => metrics.find((m) => m.name === n)?.value ?? 0;
    return { heap: get("JSHeapUsedSize"), nodes: get("Nodes"), listeners: get("JSEventListeners") };
  };
  // Warm up one full loop first so caches are filled
  const go = async (p: string) => {
    const link = page.locator(`a[href="${p}"]`).first();
    if (await link.count()) await link.evaluate((a: HTMLAnchorElement) => a.click());
    else await page.evaluate((u) => history.pushState(null, "", u), p);
    await page.waitForURL((u) => u.pathname === p, { timeout: 15_000 }).catch(() => page.goto(p));
    await page.waitForTimeout(250);
  };
  for (const p of PATHS) await go(p);
  const start = await heap();
  const samples = [start];
  const end = Date.now() + MINUTES * 60_000;
  let loops = 0;
  while (Date.now() < end) {
    for (const p of PATHS) await go(p);
    loops++;
    if (loops % 5 === 0) samples.push(await heap());
  }
  // Compare like with like: the same page as the first sample
  await go(PATHS.at(-1)!);
  const last = await heap();
  samples.push(last);
  mkdirSync("test-results/perf", { recursive: true });
  writeFileSync("test-results/perf/memory.json", JSON.stringify({ minutes: MINUTES, loops, start, last, samples }, null, 2));
  // After warm-up the heap should level off: the second half grows under 5 percent
  const mid = samples[Math.floor(samples.length / 2)];
  expect(last.heap, "heap keeps climbing").toBeLessThan(mid.heap * 1.05);
  // Allow 20 percent plus 3 MB of noise after a full GC
  expect(last.heap).toBeLessThan(start.heap * 1.2 + 3 * 1024 * 1024);
  expect(last.nodes).toBe(start.nodes);
  expect(last.listeners).toBeLessThanOrEqual(start.listeners);
});
