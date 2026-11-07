// Lighthouse CI, mobile (set LHCI_PRESET=desktop for desktop)
const desktop = process.env.LHCI_PRESET === "desktop";
const PORT = 3300;
const PAGES = [
  "/",
  "/services/custom-software-development/",
  "/services/full-stack-development/",
  "/services/mobile-app-development/",
  "/services/saas-app-development/",
  "/services/ai-llm-development/",
  "/services/ai-automation/",
  "/services/ai-agents-as-a-service/",
  "/services/code-rescue/",
  "/insights/what-is-rag/",
  "/insights/",
  "/contact/",
  "/about/",
];

module.exports = {
  ci: {
    collect: {
      startServerCommand: `npx next start -p ${PORT}`,
      startServerReadyPattern: "Ready",
      url: PAGES.map((p) => `http://localhost:${PORT}${p}`),
      numberOfRuns: Number(process.env.LHCI_RUNS || 3),
      settings: {
        preset: desktop ? "desktop" : undefined,
        onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
        chromeFlags: "--headless=new --no-sandbox",
      },
    },
    assert: {
      aggregationMethod: "median-run",
      assertions: {
        "categories:performance": ["error", { minScore: 0.95 }],
        "categories:accessibility": ["error", { minScore: 0.95 }],
        "categories:best-practices": ["error", { minScore: 0.95 }],
        "categories:seo": ["error", { minScore: 0.95 }],
        "largest-contentful-paint": ["error", { maxNumericValue: 2000 }],
        "cumulative-layout-shift": ["error", { maxNumericValue: 0.05 }],
        "total-blocking-time": ["error", { maxNumericValue: 150 }],
        "resource-summary:script:size": ["error", { maxNumericValue: 120 * 1024 }],
      },
    },
    upload: { target: "filesystem", outputDir: desktop ? ".lighthouseci/desktop" : ".lighthouseci/mobile" },
  },
};
