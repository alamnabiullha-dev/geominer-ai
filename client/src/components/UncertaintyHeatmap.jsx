import { useState } from "react";

const MAPS = [
  { key: "confidence_map", label: "Confidence Map", from: "#0F172A", to: "#22C55E" },
  { key: "probability_map", label: "Probability Map", from: "#0F172A", to: "#2563EB" },
  { key: "risk_map", label: "Risk Distribution", from: "#0F172A", to: "#EF4444" },
];

function lerpColor(from, to, t) {
  const f = parseInt(from.slice(1), 16);
  const tt = parseInt(to.slice(1), 16);
  const fr = (f >> 16) & 255, fg = (f >> 8) & 255, fb = f & 255;
  const tr = (tt >> 16) & 255, tg = (tt >> 8) & 255, tb = tt & 255;
  const r = Math.round(fr + (tr - fr) * t);
  const g = Math.round(fg + (tg - fg) * t);
  const b = Math.round(fb + (tb - fb) * t);
  return `rgb(${r},${g},${b})`;
}

export default function UncertaintyHeatmap({ data }) {
  const [active, setActive] = useState(0);
  const map = MAPS[active];
  const grid = data[map.key];

  return (
    <div>
      <div className="flex gap-2 mb-4">
        {MAPS.map((m, i) => (
          <button
            key={m.key}
            onClick={() => setActive(i)}
            className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
              active === i
                ? "bg-primary-600/15 border-primary-600/40 text-primary-400"
                : "border-surface-border text-slate-400 hover:text-slate-200"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div
        className="grid gap-[2px] rounded-xl overflow-hidden border border-surface-border p-2 bg-surface-300"
        style={{ gridTemplateColumns: `repeat(${data.grid_size}, minmax(0, 1fr))` }}
      >
        {grid.flat().map((v, i) => (
          <div
            key={i}
            title={`${(v * 100).toFixed(0)}%`}
            className="aspect-square rounded-sm"
            style={{ backgroundColor: lerpColor(map.from, map.to, v) }}
          />
        ))}
      </div>

      <div className="flex items-center gap-2 mt-3 text-xs text-slate-500">
        <span>Low</span>
        <div className="h-2 flex-1 rounded-full" style={{ background: `linear-gradient(90deg, ${map.from}, ${map.to})` }} />
        <span>High</span>
      </div>
    </div>
  );
}
