import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { FiSearch, FiTrash2, FiEye, FiStar, FiFilter } from "react-icons/fi";
import ChartCard from "../components/ChartCard";
import { TableSkeleton } from "../components/LoadingSkeleton";
import { getPredictions, deletePrediction } from "../services/predictionService";
import { useToast } from "../context/ToastContext";

const MINERALS = ["", "Copper", "Lithium", "Iron Ore", "Gold", "Nickel", "Silver", "Zinc"];
const SORTS = [
  { value: "-createdAt", label: "Newest first" },
  { value: "createdAt", label: "Oldest first" },
  { value: "-confidenceScore", label: "Highest confidence" },
  { value: "-depositDepthM", label: "Deepest deposit" },
];

export default function History() {
  const toast = useToast();
  const [predictions, setPredictions] = useState(null);
  const [search, setSearch] = useState("");
  const [mineral, setMineral] = useState("");
  const [sort, setSort] = useState("-createdAt");

  const load = useCallback(() => {
    getPredictions({ search, mineral, sort })
      .then((d) => setPredictions(d.predictions))
      .catch(() => setPredictions([]));
  }, [search, mineral, sort]);

  useEffect(() => {
    const id = setTimeout(load, 300);
    return () => clearTimeout(id);
  }, [load]);

  const handleDelete = async (id) => {
    if (!confirm("Delete this prediction? This cannot be undone.")) return;
    await deletePrediction(id);
    toast.success("Prediction deleted");
    load();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-slate-50">Prediction History</h1>
        <p className="text-sm text-slate-500 mt-1">Search, filter, and manage everything GeoMiner AI has predicted for you.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by mineral or survey name…"
            className="input-field pl-10"
          />
        </div>
        <div className="relative">
          <FiFilter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
          <select value={mineral} onChange={(e) => setMineral(e.target.value)} className="input-field pl-9 !w-48">
            {MINERALS.map((m) => <option key={m} value={m}>{m || "All minerals"}</option>)}
          </select>
        </div>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="input-field !w-48">
          {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </div>

      <ChartCard title={`${predictions?.length ?? ""} predictions`.trim()}>
        {predictions === null ? (
          <TableSkeleton rows={6} />
        ) : predictions.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-10">No predictions match your filters.</p>
        ) : (
          <div className="divide-y divide-surface-border">
            {predictions.map((p) => (
              <div key={p._id} className="flex items-center justify-between py-3 gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-slate-200 font-medium">{p.mineralType}</p>
                    {p.isFavorite && <FiStar size={13} className="fill-amber-400 text-amber-400" />}
                  </div>
                  <p className="text-xs text-slate-500 truncate">
                    {p.survey?.name} · {new Date(p.createdAt).toLocaleDateString()} · Confidence {(p.confidenceScore * 100).toFixed(0)}%
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Link to={`/predictions/${p._id}`} className="btn-secondary !px-3 !py-2">
                    <FiEye size={14} />
                  </Link>
                  <button onClick={() => handleDelete(p._id)} className="btn-secondary !px-3 !py-2 hover:!text-red-400">
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </ChartCard>
    </div>
  );
}
