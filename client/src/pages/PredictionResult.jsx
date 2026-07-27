import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiArrowLeft, FiTarget, FiLayers, FiTrendingUp, FiAlertTriangle, FiMapPin, FiStar,
} from "react-icons/fi";
import ChartCard from "../components/ChartCard";
import StatCard from "../components/StatCard";
import ThreeDModel from "../components/ThreeDModel";
import CrossSection2D from "../components/CrossSection2D";
import MapView from "../components/MapView";
import DrillSiteTable from "../components/DrillSiteTable";
import UncertaintyHeatmap from "../components/UncertaintyHeatmap";
import ReportDownloadButton from "../components/ReportDownloadButton";
import { ChartSkeleton } from "../components/LoadingSkeleton";
import { getPredictionById, toggleFavorite } from "../services/predictionService";
import { useToast } from "../context/ToastContext";

const TABS = ["3D Model", "2D Cross-Section", "Drill Sites & Map", "Uncertainty Analysis"];

export default function PredictionResult() {
  const { id } = useParams();
  const toast = useToast();
  const [prediction, setPrediction] = useState(null);
  const [tab, setTab] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    getPredictionById(id)
      .then((d) => setPrediction(d.prediction))
      .catch(() => setError("Could not load this prediction."));
  }, [id]);

  const handleFavorite = async () => {
    const { prediction: updated } = await toggleFavorite(id);
    setPrediction(updated);
    toast.success(updated.isFavorite ? "Added to favorites" : "Removed from favorites");
  };

  if (error) {
    return <div className="text-center py-20 text-slate-500">{error}</div>;
  }

  if (!prediction) {
    return (
      <div className="space-y-5">
        <ChartSkeleton height={80} />
        <ChartSkeleton height={460} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link to="/history" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 mb-2">
            <FiArrowLeft size={13} /> Back to history
          </Link>
          <h1 className="font-display text-2xl font-semibold text-slate-50 flex items-center gap-3">
            {prediction.mineralType} Deposit Prediction
            <button onClick={handleFavorite} aria-label="Toggle favorite">
              <FiStar
                size={20}
                className={prediction.isFavorite ? "fill-amber-400 text-amber-400" : "text-slate-600"}
              />
            </button>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {prediction.survey?.name} · {new Date(prediction.createdAt).toLocaleString()}
          </p>
        </div>
        <ReportDownloadButton prediction={prediction} />
      </div>

      {/* Summary stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={FiTarget} label="Mineral Probability" value={`${(prediction.mineralProbability * 100).toFixed(1)}%`} accent="primary" />
        <StatCard icon={FiLayers} label="Deposit Depth" value={`${prediction.depositDepthM} m`} sublabel={`Extent: ${prediction.lateralExtentM} m`} accent="accent" />
        <StatCard icon={FiTrendingUp} label="Confidence Score" value={`${(prediction.confidenceScore * 100).toFixed(1)}%`} sublabel={`Ore grade: ${prediction.oreGradePct}%`} accent="accent" />
        <StatCard icon={FiAlertTriangle} label="Uncertainty" value={`${(prediction.uncertaintyScore * 100).toFixed(1)}%`} sublabel={`ROI: ${prediction.economics?.roiPct}%`} accent="amber" />
      </div>

      {/* Mineral ranking + economics */}
      <div className="grid lg:grid-cols-3 gap-5">
        <ChartCard title="Mineral Ranking" subtitle="Model confidence per mineral type" className="lg:col-span-1">
          <div className="space-y-2.5">
            {prediction.mineralRanking?.slice(0, 5).map((m) => (
              <div key={m.mineral}>
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>{m.mineral}</span>
                  <span>{(m.probability * 100).toFixed(0)}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-surface-100 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary-600 to-accent-500" style={{ width: `${m.probability * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="Economic Analysis" subtitle="Cost, revenue, and viability" className="lg:col-span-2">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <EconomicStat label="Mining Cost" value={`$${(prediction.economics?.estimatedMiningCostUsd / 1e6).toFixed(2)}M`} />
            <EconomicStat label="Expected Revenue" value={`$${(prediction.economics?.expectedRevenueUsd / 1e6).toFixed(2)}M`} />
            <EconomicStat label="Profit" value={`$${(prediction.economics?.profitUsd / 1e6).toFixed(2)}M`} />
            <EconomicStat label="ROI" value={`${prediction.economics?.roiPct}%`} highlight />
            <EconomicStat label="Investment Score" value={`${prediction.economics?.investmentScore}/100`} />
            <EconomicStat label="Risk Score" value={`${prediction.economics?.riskScore}/100`} />
          </div>
        </ChartCard>
      </div>

      {/* Visualization tabs */}
      <div>
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
          {TABS.map((t, i) => (
            <button
              key={t}
              onClick={() => setTab(i)}
              className={`text-sm px-4 py-2 rounded-xl whitespace-nowrap transition-colors ${
                tab === i ? "bg-primary-600 text-white" : "bg-surface-100 text-slate-400 hover:text-slate-200"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
          {tab === 0 && <ThreeDModel data={prediction.model3D} />}
          {tab === 1 && <CrossSection2D data={prediction.crossSection2D} />}
          {tab === 2 && (
            <div className="space-y-5">
              <ChartCard title="Survey & Drill Site Map" subtitle="Recommended targets colored by risk" action={<FiMapPin className="text-primary-400" />}>
                <MapView
                  surveyLat={prediction.survey?.latitude}
                  surveyLng={prediction.survey?.longitude}
                  drillSites={prediction.drillSites}
                />
              </ChartCard>
              <ChartCard title="Top 10 Recommended Drill Sites" subtitle="Ranked by probability, confidence, and ROI">
                <DrillSiteTable sites={prediction.drillSites} />
              </ChartCard>
            </div>
          )}
          {tab === 3 && (
            <ChartCard title="Uncertainty Analysis" subtitle="Confidence, probability, and risk distribution across the survey area">
              <UncertaintyHeatmap data={prediction.uncertaintyAnalysis} />
            </ChartCard>
          )}
        </motion.div>
      </div>
    </div>
  );
}

function EconomicStat({ label, value, highlight }) {
  return (
    <div>
      <p className="text-xs text-slate-500">{label}</p>
      <p className={`text-lg font-display font-semibold mt-1 ${highlight ? "text-accent-400" : "text-slate-100"}`}>{value}</p>
    </div>
  );
}
