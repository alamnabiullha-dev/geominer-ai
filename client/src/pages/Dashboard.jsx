import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  FiUploadCloud, FiCpu, FiTarget, FiTrendingUp, FiDollarSign, FiFileText, FiArrowRight,
} from "react-icons/fi";
import {
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, BarChart, Bar,
} from "recharts";
import StatCard from "../components/StatCard";
import ChartCard from "../components/ChartCard";
import { CardSkeleton, ChartSkeleton } from "../components/LoadingSkeleton";
import { useAuth } from "../context/AuthContext";
import { getPredictions } from "../services/predictionService";
import { getSurveys } from "../services/surveyService";

const MINERAL_COLORS = {
  Copper: "#B87333", Lithium: "#A78BFA", "Iron Ore": "#94A3B8",
  Gold: "#FBBF24", Nickel: "#60A5FA", Silver: "#E5E7EB", Zinc: "#38BDF8",
};

export default function Dashboard() {
  const { user } = useAuth();
  const [predictions, setPredictions] = useState(null);
  const [surveys, setSurveys] = useState(null);

  useEffect(() => {
    getPredictions().then((d) => setPredictions(d.predictions)).catch(() => setPredictions([]));
    getSurveys().then((d) => setSurveys(d.surveys)).catch(() => setSurveys([]));
  }, []);

  const loading = predictions === null || surveys === null;

  const stats = useMemo(() => {
    if (loading) return null;
    const totalDrillSites = predictions.reduce((a, p) => a + (p.drillSites?.length || 0), 0);
    const avgConfidence = predictions.length
      ? (predictions.reduce((a, p) => a + p.confidenceScore, 0) / predictions.length) * 100
      : 0;
    const avgEconomic = predictions.length
      ? predictions.reduce((a, p) => a + (p.economics?.investmentScore || 0), 0) / predictions.length
      : 0;
    return {
      totalSurveys: surveys.length,
      totalPredictions: predictions.length,
      totalDrillSites,
      avgConfidence: avgConfidence.toFixed(1),
      avgEconomic: avgEconomic.toFixed(1),
      reportsGenerated: predictions.length * 2, // pdf + csv available per prediction
    };
  }, [predictions, surveys, loading]);

  const mineralDistribution = useMemo(() => {
    if (loading) return [];
    const counts = {};
    predictions.forEach((p) => { counts[p.mineralType] = (counts[p.mineralType] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [predictions, loading]);

  const confidenceTrend = useMemo(() => {
    if (loading) return [];
    return [...predictions]
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      .map((p, i) => ({ name: `#${i + 1}`, confidence: Math.round(p.confidenceScore * 100) }));
  }, [predictions, loading]);

  const economicAnalysis = useMemo(() => {
    if (loading) return [];
    return predictions.slice(0, 8).map((p) => ({
      name: p.mineralType.slice(0, 3),
      roi: p.economics?.roiPct || 0,
    }));
  }, [predictions, loading]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-slate-50">Welcome back, {user?.name?.split(" ")[0]}</h1>
          <p className="text-sm text-slate-500 mt-1">Here's what's happening with your exploration projects.</p>
        </div>
        <Link to="/upload" className="btn-primary">
          <FiUploadCloud size={16} /> Upload Survey
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)
        ) : (
          <>
            <StatCard icon={FiUploadCloud} label="Total Surveys" value={stats.totalSurveys} accent="primary" />
            <StatCard icon={FiCpu} label="AI Predictions" value={stats.totalPredictions} accent="accent" />
            <StatCard icon={FiTarget} label="Recommended Sites" value={stats.totalDrillSites} accent="primary" />
            <StatCard icon={FiTrendingUp} label="Avg. Confidence" value={`${stats.avgConfidence}%`} accent="accent" />
            <StatCard icon={FiDollarSign} label="Economic Score" value={stats.avgEconomic} accent="amber" />
            <StatCard icon={FiFileText} label="Reports Generated" value={stats.reportsGenerated} accent="primary" />
          </>
        )}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-5">
        {loading ? (
          <>
            <ChartSkeleton /><ChartSkeleton /><ChartSkeleton />
          </>
        ) : (
          <>
            <ChartCard title="Mineral Distribution" subtitle="Across all predictions">
              {mineralDistribution.length === 0 ? (
                <EmptyChart />
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={mineralDistribution} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={3}>
                      {mineralDistribution.map((d) => (
                        <Cell key={d.name} fill={MINERAL_COLORS[d.name] || "#2563EB"} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: "#111827", border: "1px solid #1F2A44", borderRadius: 8 }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </ChartCard>

            <ChartCard title="Confidence Trend" subtitle="Most recent predictions">
              {confidenceTrend.length === 0 ? (
                <EmptyChart />
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={confidenceTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1F2A44" />
                    <XAxis dataKey="name" stroke="#64748B" fontSize={11} />
                    <YAxis stroke="#64748B" fontSize={11} />
                    <Tooltip contentStyle={{ background: "#111827", border: "1px solid #1F2A44", borderRadius: 8 }} />
                    <Line type="monotone" dataKey="confidence" stroke="#22C55E" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </ChartCard>

            <ChartCard title="Economic Analysis" subtitle="ROI % by mineral">
              {economicAnalysis.length === 0 ? (
                <EmptyChart />
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={economicAnalysis}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1F2A44" />
                    <XAxis dataKey="name" stroke="#64748B" fontSize={11} />
                    <YAxis stroke="#64748B" fontSize={11} />
                    <Tooltip contentStyle={{ background: "#111827", border: "1px solid #1F2A44", borderRadius: 8 }} />
                    <Bar dataKey="roi" fill="#2563EB" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </ChartCard>
          </>
        )}
      </div>

      {/* Recent activity */}
      <ChartCard title="Recent Activity" subtitle="Your latest predictions">
        {loading ? (
          <ChartSkeleton height={200} />
        ) : predictions.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-sm text-slate-500">No predictions yet — upload a survey to get started.</p>
            <Link to="/upload" className="btn-primary inline-flex mt-4">Upload Survey <FiArrowRight size={14} /></Link>
          </div>
        ) : (
          <div className="divide-y divide-surface-border">
            {predictions.slice(0, 6).map((p) => (
              <Link
                key={p._id}
                to={`/predictions/${p._id}`}
                className="flex items-center justify-between py-3 hover:bg-surface-100/40 -mx-2 px-2 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="h-9 w-9 rounded-lg flex items-center justify-center text-xs font-semibold text-white"
                        style={{ backgroundColor: MINERAL_COLORS[p.mineralType] || "#2563EB" }}>
                    {p.mineralType.slice(0, 2).toUpperCase()}
                  </span>
                  <div>
                    <p className="text-sm text-slate-200">{p.mineralType} deposit predicted</p>
                    <p className="text-xs text-slate-500">{new Date(p.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                <span className="text-xs text-accent-400 font-medium">{(p.confidenceScore * 100).toFixed(0)}% confidence</span>
              </Link>
            ))}
          </div>
        )}
      </ChartCard>
    </div>
  );
}

function EmptyChart() {
  return <div className="h-[220px] flex items-center justify-center text-sm text-slate-600">No data yet</div>;
}
