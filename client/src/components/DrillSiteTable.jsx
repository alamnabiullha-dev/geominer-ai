const riskBadge = {
  Low: "bg-accent-600/15 text-accent-400 border-accent-600/30",
  Medium: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  High: "bg-red-500/15 text-red-400 border-red-500/30",
};

export default function DrillSiteTable({ sites }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-surface-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-surface-200 text-slate-400 text-xs uppercase tracking-wide">
            <th className="text-left px-4 py-3 font-medium">Rank</th>
            <th className="text-left px-4 py-3 font-medium">Mineral</th>
            <th className="text-left px-4 py-3 font-medium">Coordinates</th>
            <th className="text-left px-4 py-3 font-medium">Depth</th>
            <th className="text-left px-4 py-3 font-medium">Probability</th>
            <th className="text-left px-4 py-3 font-medium">Confidence</th>
            <th className="text-left px-4 py-3 font-medium">Risk</th>
            <th className="text-left px-4 py-3 font-medium">Est. Cost</th>
            <th className="text-left px-4 py-3 font-medium">Revenue</th>
            <th className="text-left px-4 py-3 font-medium">ROI</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-border">
          {sites.map((s) => (
            <tr key={s.rank} className="hover:bg-surface-100/50 transition-colors">
              <td className="px-4 py-3">
                <span className="h-6 w-6 rounded-full bg-primary-600/15 text-primary-400 text-xs flex items-center justify-center font-semibold">
                  {s.rank}
                </span>
              </td>
              <td className="px-4 py-3 text-slate-200">{s.mineralType}</td>
              <td className="px-4 py-3 text-slate-400 font-mono text-xs">{s.latitude.toFixed(4)}, {s.longitude.toFixed(4)}</td>
              <td className="px-4 py-3 text-slate-300">{s.estimatedDepthM} m</td>
              <td className="px-4 py-3 text-slate-300">{(s.probability * 100).toFixed(0)}%</td>
              <td className="px-4 py-3 text-slate-300">{(s.confidence * 100).toFixed(0)}%</td>
              <td className="px-4 py-3">
                <span className={`text-xs px-2 py-1 rounded-full border ${riskBadge[s.risk]}`}>{s.risk}</span>
              </td>
              <td className="px-4 py-3 text-slate-400">${(s.estimatedCostUsd / 1e6).toFixed(1)}M</td>
              <td className="px-4 py-3 text-slate-400">${(s.expectedRevenueUsd / 1e6).toFixed(1)}M</td>
              <td className={`px-4 py-3 font-medium ${s.roiPct >= 0 ? "text-accent-400" : "text-red-400"}`}>{s.roiPct}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
