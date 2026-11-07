import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

const r = (p: string) => fileURLToPath(new URL(p, import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: /^@\//, replacement: r("./") },
      { find: "server-only", replacement: r("./tests/unit/stubs/empty.ts") },
    ],
  },
  test: {
    environment: "jsdom",
    globals: true,
    include: ["tests/unit/**/*.test.{ts,tsx}"],
    setupFiles: ["tests/unit/setup.ts"],
    env: { TEST_MODE: "true" },
    coverage: {
      provider: "v8",
      include: ["components/**/*.{ts,tsx}", "lib/**/*.{ts,tsx}"],
      // WebGL scene and OG image renderer need a GPU and the edge image runtime
      exclude: ["components/home/core-scene.ts", "lib/og.tsx", "**/*.d.ts"],
      reporter: ["text-summary", "json-summary", "html"],
      reportsDirectory: "test-results/coverage",
      thresholds: { lines: 80, statements: 80, functions: 80, branches: 70 },
    },
  },
});
