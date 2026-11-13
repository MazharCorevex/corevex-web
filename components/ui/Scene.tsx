import type { CSSProperties, ReactNode } from "react";

// 3D service scenes, CSS only
export type SceneKind =
  "custom" | "fullstack" | "mobile" | "assistant" | "saas" | "agents" | "rescue" | "refactor" | "board";

type Box = { x: number; y: number; w: number; h: number; z?: number; d?: number };
const pos = ({ x, y, w, h, z = 0, d = 0 }: Box) =>
  ({ "--x": `${x}%`, "--y": `${y}%`, "--w": `${w}%`, "--h": `${h}%`, "--z": z, "--d": `${-d}s` }) as CSSProperties;

function Card({ b, className = "", children }: { b: Box; className?: string; children?: ReactNode }) {
  return (
    <div className={`sc-card ${className}`} style={pos(b)}>
      {children}
    </div>
  );
}
const Lines = ({ n = 3 }: { n?: number }) => (
  <span className="sc-lines">
    {Array.from({ length: n }, (_, i) => (
      <i key={i} />
    ))}
  </span>
);
const Bars = ({ v }: { v: number[] }) => (
  <span className="sc-bars">
    {v.map((h, i) => (
      <i key={i} style={{ "--v": `${h}%`, "--i": i } as CSSProperties} />
    ))}
  </span>
);
const Ring = ({ label }: { label: string }) => (
  <span className="sc-ring">
    <svg viewBox="0 0 36 36">
      <circle cx="18" cy="18" r="15" />
      <circle cx="18" cy="18" r="15" className="on" />
    </svg>
    <b>{label}</b>
  </span>
);

function Body({ kind }: { kind: SceneKind }) {
  switch (kind) {
    case "custom":
      return (
        <>
          <Card b={{ x: 0, y: 22, w: 62, h: 74 }}>
            <b className="sc-t">Live operations</b>
            <Bars v={[40, 62, 48, 80, 66, 92, 74]} />
          </Card>
          <Card b={{ x: 66, y: 6, w: 34, h: 30, z: 50, d: 1 }}>
            <b className="sc-t">Orders</b>
            <b className="sc-n">1,284</b>
          </Card>
          <Card b={{ x: 66, y: 44, w: 34, h: 30, z: 80, d: 2 }} className="hot">
            <b className="sc-t">On time</b>
            <b className="sc-n">96.4%</b>
          </Card>
          <Card b={{ x: 6, y: 0, w: 44, h: 16, z: 34, d: 3 }} className="chip">
            <b className="sc-t">Workflow synced</b>
          </Card>
        </>
      );
    case "fullstack":
      return (
        <>
          {[
            ["Database", 0],
            ["API", 70],
            ["Frontend", 140],
          ].map(([t, z], i) => (
            <Card key={t} b={{ x: 14, y: 14, w: 72, h: 72, z: z as number, d: i }} className={i === 2 ? "hot" : ""}>
              <b className="sc-t">{t}</b>
              <Lines n={3} />
            </Card>
          ))}
          <span className="sc-dot rise" />
        </>
      );
    case "mobile":
      return (
        <>
          <Card b={{ x: 12, y: 2, w: 32, h: 94, z: 20 }} className="phone">
            <span className="sc-notch" />
            <Ring label="7,820" />
            <Bars v={[30, 55, 42, 70, 90, 60]} />
          </Card>
          <Card b={{ x: 54, y: 10, w: 32, h: 86, z: 70, d: 2 }} className="phone hot">
            <span className="sc-notch" />
            <b className="sc-t">Today</b>
            <Lines n={4} />
            <span className="sc-btn" />
          </Card>
        </>
      );
    case "assistant":
      return (
        <>
          <Card b={{ x: 2, y: 4, w: 70, h: 90 }}>
            <b className="sc-t">AI assistant</b>
            <span className="sc-msg me" />
            <span className="sc-msg ai">
              <Lines n={3} />
            </span>
            <span className="sc-msg me s2" />
          </Card>
          <Card b={{ x: 60, y: 48, w: 38, h: 40, z: 80, d: 2 }} className="hot">
            <b className="sc-t">Sources</b>
            <span className="sc-chips">
              <i />
              <i />
              <i />
            </span>
          </Card>
        </>
      );
    case "saas":
      return (
        <>
          <Card b={{ x: 0, y: 14, w: 64, h: 80 }}>
            <b className="sc-t">Subscribers</b>
            <b className="sc-n">3,912</b>
            <svg className="sc-chart" viewBox="0 0 100 40" preserveAspectRatio="none">
              <path d="M0 34 C 12 30, 20 32, 30 24 S 48 20, 58 16 S 80 10, 100 4" />
            </svg>
          </Card>
          {["Starter", "Growth", "Scale"].map((t, i) => (
            <Card
              key={t}
              b={{ x: 68, y: 4 + i * 32, w: 32, h: 26, z: i === 1 ? 80 : 40, d: i }}
              className={i === 1 ? "hot" : ""}
            >
              <b className="sc-t">{t}</b>
              <Lines n={1} />
            </Card>
          ))}
        </>
      );
    case "agents":
      return (
        <>
          <svg className="sc-links" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M16 14 L50 50 L84 14 M16 86 L50 50 L84 86" />
          </svg>
          {[
            ["Support", 0, 0],
            ["Sales", 68, 0],
            ["Ops", 0, 72],
            ["Finance", 68, 72],
          ].map(([t, x, y], i) => (
            <Card key={t} b={{ x: x as number, y: y as number, w: 32, h: 28, z: 24, d: i }}>
              <b className="sc-t">{t}</b>
              <span className="sc-ok" style={{ "--i": i } as CSSProperties}>
                Resolved
              </span>
            </Card>
          ))}
          <Card b={{ x: 33, y: 34, w: 34, h: 32, z: 70 }} className="hot hub">
            <span className="sc-pulse" />
            <b className="sc-t">Agent hub</b>
          </Card>
        </>
      );
    case "rescue":
      return (
        <>
          <Card b={{ x: 0, y: 8, w: 62, h: 86 }} className="code">
            {Array.from({ length: 6 }, (_, i) => (
              <span key={i} className="sc-code" style={{ "--i": i } as CSSProperties}>
                <i />
                <em />
              </span>
            ))}
          </Card>
          <Card b={{ x: 66, y: 10, w: 34, h: 50, z: 80, d: 1 }} className="hot">
            <b className="sc-t">Health</b>
            <Ring label="92" />
          </Card>
          <Card b={{ x: 66, y: 68, w: 34, h: 22, z: 40, d: 2 }} className="chip">
            <b className="sc-t">6 issues fixed</b>
          </Card>
        </>
      );
    case "refactor":
      return (
        <>
          <Card b={{ x: 0, y: 10, w: 44, h: 82 }} className="code messy">
            <b className="sc-t">Before</b>
            <Lines n={6} />
          </Card>
          <Card b={{ x: 54, y: 6, w: 46, h: 86, z: 70, d: 1 }} className="code clean hot">
            <b className="sc-t">After</b>
            <Lines n={6} />
            <span className="sc-scan" />
          </Card>
        </>
      );
    case "board":
      return (
        <>
          {["To do", "Doing", "Done"].map((t, i) => (
            <Card key={t} b={{ x: i * 34, y: 6, w: 31, h: 88, z: 0 }} className="col">
              <b className="sc-t">{t}</b>
              <span className="sc-task" />
              <span className="sc-task" />
              {i === 2 && <span className="sc-task done" />}
            </Card>
          ))}
          <span className="sc-mover" />
        </>
      );
  }
}

export default function Scene({
  kind,
  tone = "light",
  className = "",
}: {
  kind: SceneKind;
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <div className={`sc sc-${kind} ${tone} ${className}`.trim()} aria-hidden="true">
      <div className="sc-stage">
        <Body kind={kind} />
      </div>
    </div>
  );
}
