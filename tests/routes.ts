import seo from "../lib/seo-data.json";

// Every page from the reference
export const ROUTES = Object.keys(seo)
  .filter((r) => r !== "/404/")
  .sort();

export const EXTRA_WIDTHS = [360, 414, 1024, 1280, 1440];
export const LANDSCAPE = [
  { width: 844, height: 390 },
  { width: 1024, height: 768 },
];
