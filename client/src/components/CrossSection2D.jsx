export default function CrossSection2D({ data }) {
  const { layers, mineral_body, fault_line, recommended_boreholes_x_pct, confidence_envelope_m } = data;

  const width = 800;
  const height = 420;
  const maxDepth = Math.max(...layers.map((l) => l.bottom_m), mineral_body.bottom_m) * 1.1;
  const yScale = (m) => (m / maxDepth) * (height - 40) + 10;

  const layerColors = ["#334155", "#475569", "#57534E", "#292524", "#1F2937"];

  return (
    <div className="rounded-xl border border-surface-border bg-[#0B1120] overflow-hidden">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
        {/* surface line */}
        <line x1="0" y1={yScale(0)} x2={width} y2={yScale(0)} stroke="#22C55E" strokeWidth="2" />
        <text x="8" y={yScale(0) - 6} fill="#22C55E" fontSize="11">Surface</text>

        {/* rock layers */}
        {layers.map((l, i) => (
          <g key={l.name}>
            <rect
              x="0"
              y={yScale(l.top_m)}
              width={width}
              height={Math.max(1, yScale(l.bottom_m) - yScale(l.top_m))}
              fill={layerColors[i % layerColors.length]}
              opacity="0.85"
            />
            <text x={width - 10} y={yScale(l.top_m) + 14} fill="#94A3B8" fontSize="10" textAnchor="end">
              {l.name}
            </text>
          </g>
        ))}

        {/* confidence envelope */}
        <ellipse
          cx={width * 0.5}
          cy={yScale(mineral_body.center_depth_m)}
          rx={(mineral_body.lateral_extent_m / 2 + confidence_envelope_m) * 0.35}
          ry={(yScale(mineral_body.bottom_m) - yScale(mineral_body.top_m)) / 2 + 14}
          fill={mineral_body.color}
          opacity="0.12"
        />

        {/* mineral body */}
        <ellipse
          cx={width * 0.5}
          cy={yScale(mineral_body.center_depth_m)}
          rx={mineral_body.lateral_extent_m * 0.35}
          ry={(yScale(mineral_body.bottom_m) - yScale(mineral_body.top_m)) / 2}
          fill={mineral_body.color}
          opacity="0.85"
          stroke={mineral_body.color}
          strokeWidth="1.5"
        />
        <text
          x={width * 0.5}
          y={yScale(mineral_body.center_depth_m) + 4}
          fill="#0F172A"
          fontSize="11"
          fontWeight="600"
          textAnchor="middle"
        >
          {mineral_body.mineral}
        </text>

        {/* fault line */}
        <line
          x1={width * fault_line.x_position_pct}
          y1={yScale(0)}
          x2={width * fault_line.x_position_pct + 60}
          y2={height - 10}
          stroke="#F87171"
          strokeWidth="2"
          strokeDasharray="6,4"
        />
        <text x={width * fault_line.x_position_pct + 6} y={yScale(0) + 16} fill="#F87171" fontSize="10">
          Fault ({fault_line.dip_degrees}°)
        </text>

        {/* recommended boreholes */}
        {recommended_boreholes_x_pct.map((pct, i) => (
          <g key={i}>
            <line x1={width * pct} y1={yScale(0)} x2={width * pct} y2={yScale(mineral_body.center_depth_m)} stroke="#2563EB" strokeWidth="1.5" strokeDasharray="3,3" />
            <circle cx={width * pct} cy={yScale(0)} r="4" fill="#2563EB" />
            <text x={width * pct} y={yScale(0) - 10} fill="#60A5FA" fontSize="9" textAnchor="middle">B{i + 1}</text>
          </g>
        ))}
      </svg>

      <div className="flex flex-wrap gap-4 px-4 py-3 border-t border-surface-border text-xs text-slate-400">
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: mineral_body.color }} /> Mineral body</span>
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-red-400" /> Fault line</span>
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-primary-500" /> Recommended borehole</span>
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: mineral_body.color, opacity: 0.3 }} /> Confidence envelope</span>
      </div>
    </div>
  );
}
