import { afterEach, describe, expect, it, vi } from "vitest";

// Link previews need the primary host, never one that redirects
describe("SITE_URL", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });
  const load = async (v?: string) => {
    if (v !== undefined) vi.stubEnv("NEXT_PUBLIC_SITE_URL", v);
    vi.resetModules();
    return (await import("../../lib/site")).SITE_URL;
  };

  it("maps the bare domain to www", async () => {
    expect(await load("https://corevex-solutions.com")).toBe("https://www.corevex-solutions.com");
    expect(await load("https://corevex-solutions.com/")).toBe("https://www.corevex-solutions.com");
  });

  it("keeps www and other hosts as set", async () => {
    expect(await load("https://www.corevex-solutions.com/")).toBe("https://www.corevex-solutions.com");
    expect(await load("http://localhost:3100")).toBe("http://localhost:3100");
  });
});
