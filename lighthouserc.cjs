// Lighthouse CI, mobile by default (Moto G Power, Slow 4G); CV_LH_PRESET=desktop for desktop
const desktop = process.env.CV_LH_PRESET === "desktop";
const PORT = 3300;
const PAGES = [
  "/",
  "/services/",
  "/services/custom-software-development/",
  "/services/full-stack-development/",
  "/services/mobile-app-development/",
  "/services/saas-app-development/",
  "/services/ai-llm-development/",
  "/services/ai-automation/",
  "/services/ai-agents-as-a-service/",
  "/services/code-rescue/",
  "/work/",
  "/work/mary-properties/",
  "/about/",
  "/careers/",
  "/insights/",
  "/insights/what-is-rag/",
  "/contact/",
  "/faq/",
  "/privacy/",
  "/terms/",
  "/cookies/",
];
// The 404 page answers 404, which Lighthouse refuses to audit; tests/perf/vitals.spec.ts measures it

const quality = {
  "categories:accessibility": ["error", { minScore: 0.95 }],
  "categories:best-practices": ["error", { minScore: 0.95 }],
  "resource-summary:script:size": ["error", { maxNumericValue: 120 * 1024 }],
};
const speed = desktop
  ? {
      "categories:performance": ["error", { minScore: 0.98 }],
      "largest-contentful-paint": ["error", { maxNumericValue: 1200 }],
      "cumulative-layout-shift": ["error", { maxNumericValue: 0.02 }],
    }
  : {
      "categories:performance": ["error", { minScore: 0.95 }],
      "largest-contentful-paint": ["error", { maxNumericValue: 2000 }],
      "cumulative-layout-shift": ["error", { maxNumericValue: 0.05 }],
      "total-blocking-time": ["error", { maxNumericValue: 150 }],
      "speed-index": ["error", { maxNumericValue: 2500 }],
      "first-contentful-paint": ["error", { maxNumericValue: 1500 }],
    };

module.exports = {
  ci: {
    collect: {
      startServerCommand: `npx next start -p ${PORT}`,
      startServerReadyPattern: "Ready",
      url: (process.env.CV_LH_PAGES ? process.env.CV_LH_PAGES.split(",") : PAGES).map((p) => `http://localhost:${PORT}${p}`),
      numberOfRuns: Number(process.env.CV_LH_RUNS || 3),
      settings: {
        preset: desktop ? "desktop" : undefined,
        onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
        chromeFlags: "--headless=new --no-sandbox",
        // Report-only comparison: CV_LH_THROTTLING=devtools applies real throttling instead of simulating it
        ...(process.env.CV_LH_THROTTLING === "devtools" ? { throttlingMethod: "devtools" } : {}),
      },
    },
    assert: {
      aggregationMethod: "median-run",
      assertions: { ...speed, ...quality, "categories:seo": ["error", { minScore: 0.95 }] },
    },
    upload: { target: "filesystem", outputDir: `.lighthouseci/${desktop ? "desktop" : "mobile"}${process.env.CV_LH_THROTTLING === "devtools" ? "-devtools" : ""}` },
  },
};
