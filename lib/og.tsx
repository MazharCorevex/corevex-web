import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";

export const ogSize = { width: 1200, height: 630 };

// Branded Open Graph card
export async function ogCard(label: string, title: string) {
  const mark = await readFile(path.join(process.cwd(), "public/images/logo/corevex-logo-primary-white.svg"), "utf8");
  const logo = `data:image/svg+xml;base64,${Buffer.from(mark).toString("base64")}`;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "radial-gradient(900px 600px at 85% 30%, #173f55 0%, #0f2246 45%, #0D1022 85%)",
          color: "#F4F5F8",
          fontFamily: "sans-serif",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logo} alt="" width={236} height={53} />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", color: "#8CD9D3", fontSize: 28, marginBottom: 20 }}>» {label}</div>
          <div style={{ display: "flex", fontSize: title.length > 70 ? 54 : 64, fontWeight: 700, lineHeight: 1.08, letterSpacing: -1.5, maxWidth: 1000 }}>
            {title}
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 24, color: "#C9CDD6" }}>
          <span>Engineered at the Core.</span>
          <span style={{ display: "flex", width: 120, height: 6, borderRadius: 3, background: "#48AC9F" }} />
        </div>
      </div>
    ),
    ogSize,
  );
}
