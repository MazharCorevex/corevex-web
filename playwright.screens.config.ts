import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.PORT || 3100);

// Full-page baselines for review in tests/screenshots
export default defineConfig({
  testDir: "./tests/screens",
  outputDir: "test-results/.pw/screens",
  timeout: 180_000,
  fullyParallel: true,
  workers: process.env.CI ? 2 : 6,
  reporter: [["list"]],
  use: { baseURL: `http://localhost:${PORT}`, storageState: "tests/consent-state.json" },
  webServer: {
    command: `npx next start -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: { TEST_MODE: "true" },
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
});
