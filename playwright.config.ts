import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.PORT || 3100);

export default defineConfig({
  testDir: "./tests/e2e",
  outputDir: "test-results/.pw/e2e",
  timeout: 120_000,
  fullyParallel: true,
  workers: process.env.CI ? 2 : 4,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"], ["json", { outputFile: "test-results/e2e.json" }], ["html", { open: "never", outputFolder: "playwright-report" }]],
  use: { baseURL: `http://localhost:${PORT}`, storageState: "tests/consent-state.json", trace: "retain-on-failure" },
  webServer: {
    command: `npx next start -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: { TEST_MODE: "true" },
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1366, height: 768 } } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
});
