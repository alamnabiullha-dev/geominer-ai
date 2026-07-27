import { motion } from "framer-motion";

export default function StatCard({ icon: Icon, label, value, sublabel, accent = "primary" }) {
  const accentClasses = {
    primary: "from-primary-600/20 to-primary-600/0 text-primary-400",
    accent: "from-accent-600/20 to-accent-600/0 text-accent-400",
    amber: "from-amber-500/20 to-amber-500/0 text-amber-400",
  };

  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="glass-card p-5 relative overflow-hidden"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${accentClasses[accent]} opacity-40 pointer-events-none`} />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs text-slate-400 font-medium">{label}</p>
          <p className="text-2xl font-display font-semibold text-slate-50 mt-1.5">{value}</p>
          {sublabel && <p className="text-xs text-slate-500 mt-1">{sublabel}</p>}
        </div>
        {Icon && (
          <div className={`h-10 w-10 rounded-xl bg-surface-100 flex items-center justify-center ${accentClasses[accent].split(" ").pop()}`}>
            <Icon size={18} />
          </div>
        )}
      </div>
    </motion.div>
  );
}
