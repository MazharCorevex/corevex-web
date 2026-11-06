// Lighthouse CI
module.exports = {
  ci: {
    collect: {
      startServerCommand: "npx next start -p 3300",
      startServerReadyPattern: "Ready",
      url: [
        "http://localhost:3300/",
        "http://localhost:3300/services/code-rescue/",
        "http://localhost:3300/insights/what-is-rag/",
        "http://localhost:3300/contact/",
      ],
      numberOfRuns: 1,
      settings: { onlyCategories: ["performance", "accessibility", "best-practices", "seo"], chromeFlags: "--headless=new --no-sandbox" },
    },
    assert: {
      assertions: {
        "categories:performance": ["error", { minScore: 0.95 }],
        "categories:accessibility": ["error", { minScore: 0.95 }],
        "categories:best-practices": ["error", { minScore: 0.95 }],
        "categories:seo": ["error", { minScore: 0.95 }],
        "largest-contentful-paint": ["warn", { maxNumericValue: 2000 }],
        "cumulative-layout-shift": ["error", { maxNumericValue: 0.05 }],
      },
    },
    upload: { target: "filesystem", outputDir: ".lighthouseci" },
  },
};
