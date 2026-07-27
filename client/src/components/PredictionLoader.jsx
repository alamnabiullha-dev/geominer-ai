import { motion } from "framer-motion";
import { FiCpu } from "react-icons/fi";
import { useEffect, useState } from "react";

const STAGES = [
  "Parsing survey data…",
  "Extracting geophysical signatures…",
  "Running mineral classification model…",
  "Estimating deposit geometry…",
  "Ranking drill-site candidates…",
  "Computing economic viability…",
];

export default function PredictionLoader() {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setStage((s) => Math.min(s + 1, STAGES.length - 1)), 900);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="glass-card flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="relative h-20 w-20 mb-6">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2.4, ease: "linear" }}
          className="absolute inset-0 rounded-full border-2 border-primary-600/30 border-t-primary-500"
        />
        <div className="absolute inset-0 flex items-center justify-center text-primary-400">
          <FiCpu size={26} />
        </div>
      </div>
      <p className="text-slate-100 font-medium">Running AI Prediction</p>
      <motion.p
        key={stage}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-sm text-slate-400 mt-2"
      >
        {STAGES[stage]}
      </motion.p>
      <div className="w-64 h-1.5 rounded-full bg-surface-100 mt-6 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-primary-500 to-accent-500"
          initial={{ width: "5%" }}
          animate={{ width: `${((stage + 1) / STAGES.length) * 100}%` }}
          transition={{ duration: 0.6 }}
        />
      </div>
    </div>
  );
}
