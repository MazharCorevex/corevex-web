import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const config = [
  ...nextVitals,
  ...nextTs,
  {
    files: ["tests/**"],
    rules: { "@next/next/no-html-link-for-pages": "off", "@next/next/no-img-element": "off", "react-hooks/rules-of-hooks": "off" },
  },
  {
    ignores: [".next/**", "node_modules/**", "reference/**", "new-images/**", "public/**", "playwright-report/**", "test-results/**", "lighthouse/**", "next-env.d.ts"],
  },
];

export default config;
