// About hero layer stack
const LAYERS = [
  { name: "Interface", tone: "ui", z: 180, d: "0s" },
  { name: "API", tone: "api", z: 120, d: "-1.5s" },
  { name: "Data", tone: "data", z: 60, d: "-3s" },
  { name: "Cloud", tone: "cloud", z: 0, d: "-4.5s" },
];

export default function LayerStack() {
  return (
    <div className="l3" aria-hidden="true">
      <span className="l3-glow" />
      <div className="l3-scene">
        {[...LAYERS].reverse().map((l) => (
          <div
            key={l.name}
            className={`l3-plane l3-${l.tone}`}
            style={{ "--z": l.z, "--d": l.d } as React.CSSProperties}
          >
            <span className="l3-tag">{l.name}</span>
            <i />
            <i />
            <i />
          </div>
        ))}
        <span className="l3-core" />
      </div>
    </div>
  );
}
