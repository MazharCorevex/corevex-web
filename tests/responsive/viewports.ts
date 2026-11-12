// Viewport matrix
export type VP = { name: string; width: number; height: number; kind: "phone" | "tablet" | "desktop"; dpr?: number; engine?: "chromium" | "firefox" | "webkit" };

// Every width in all three browsers
const WIDTHS: [number, number, VP["kind"]][] = [
  [320, 568, "phone"],
  [360, 800, "phone"],
  [375, 667, "phone"],
  [390, 844, "phone"],
  [412, 915, "phone"],
  [414, 896, "phone"],
  [430, 932, "phone"],
  [768, 1024, "tablet"],
  [820, 1180, "tablet"],
  [834, 1194, "tablet"],
  [1024, 1366, "tablet"],
  [1180, 820, "tablet"],
  [1280, 800, "desktop"],
  [1366, 768, "desktop"],
  [1440, 900, "desktop"],
  [1536, 864, "desktop"],
  [1920, 1080, "desktop"],
  [2560, 1440, "desktop"],
];

export const VIEWPORTS: VP[] = WIDTHS.map(([width, height, kind]) => ({ name: `w${width}`, width, height, kind }));

// Device profiles in their own engine, portrait and landscape
const PROFILES: (Omit<VP, "name"> & { device: string; rotate: boolean })[] = [
  { device: "iPhone SE", width: 375, height: 667, dpr: 2, kind: "phone", engine: "webkit", rotate: true },
  { device: "iPhone 13", width: 390, height: 844, dpr: 3, kind: "phone", engine: "webkit", rotate: true },
  { device: "iPhone 15 Pro Max", width: 430, height: 932, dpr: 3, kind: "phone", engine: "webkit", rotate: true },
  { device: "Pixel 7", width: 412, height: 915, dpr: 2.625, kind: "phone", engine: "chromium", rotate: true },
  { device: "Galaxy S23", width: 360, height: 780, dpr: 3, kind: "phone", engine: "chromium", rotate: true },
  { device: "iPad Mini", width: 768, height: 1024, dpr: 2, kind: "tablet", engine: "webkit", rotate: true },
  { device: "iPad Air", width: 820, height: 1180, dpr: 2, kind: "tablet", engine: "webkit", rotate: true },
  { device: "iPad Pro 12.9", width: 1024, height: 1366, dpr: 2, kind: "tablet", engine: "webkit", rotate: true },
  { device: "Surface Pro", width: 912, height: 1368, dpr: 2, kind: "tablet", engine: "chromium", rotate: true },
  { device: "Laptop 1366x768", width: 1366, height: 768, dpr: 1, kind: "desktop", engine: "chromium", rotate: false },
  { device: "Laptop 1920x1080", width: 1920, height: 1080, dpr: 1, kind: "desktop", engine: "chromium", rotate: false },
];

export const DEVICES: VP[] = PROFILES.flatMap(({ device, rotate, ...p }) => [
  { ...p, name: `${device} portrait`.replace(/ portrait$/, rotate ? " portrait" : "") },
  ...(rotate ? [{ ...p, name: `${device} landscape`, width: p.height, height: p.width }] : []),
]);

export const isTouch = (v: VP) => v.kind !== "desktop";
