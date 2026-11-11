import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.PORT || 3100);

export default defineConfig({
  testDir: "./tests/perf",
  outputDir: "test-results/.pw/perf",
  timeout: 120_000,
  fullyParallel: true,
  workers: process.env.CI ? 2 : 4,
  reporter: [["list"], ["json", { outputFile: "test-results/perf.json" }]],
  use: { baseURL: `http://localhost:${PORT}`, storageState: "tests/consent-state.json" },
  webServer: {
    command: `npx next start -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: { TEST_MODE: "true" },
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
