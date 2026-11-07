// Viewport matrix
export type VP = { name: string; width: number; height: number; kind: "phone" | "tablet" | "desktop" };

const phones = [
  [360, 800],
  [375, 667],
  [390, 844],
  [412, 915],
  [430, 932],
];
const tablets = [
  [768, 1024],
  [820, 1180],
  [1024, 1366],
];
const desktops = [
  [1280, 800],
  [1366, 768],
  [1440, 900],
  [1536, 864],
  [1920, 1080],
  [2560, 1440],
];

const both = (list: number[][], kind: VP["kind"]): VP[] =>
  list.flatMap(([w, h]) => [
    { name: `${kind}-${w}x${h}`, width: w, height: h, kind },
    { name: `${kind}-${h}x${w}`, width: h, height: w, kind },
  ]);

export const VIEWPORTS: VP[] = [
  ...both(phones, "phone"),
  ...both(tablets, "tablet"),
  ...desktops.map(([w, h]) => ({ name: `desktop-${w}x${h}`, width: w, height: h, kind: "desktop" as const })),
];

export const isTouch = (v: VP) => v.kind !== "desktop";
