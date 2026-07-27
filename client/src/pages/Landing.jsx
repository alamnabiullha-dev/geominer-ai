import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiArrowRight, FiCpu, FiMap, FiBox, FiTrendingUp, FiUploadCloud,
  FiTarget, FiShield, FiFileText, FiActivity, FiLayers,
} from "react-icons/fi";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const FEATURES = [
  { icon: FiCpu, title: "AI Prediction Engine", desc: "Classifies mineral type and estimates probability, grade, and deposit geometry from survey signatures." },
  { icon: FiBox, title: "3D Subsurface Models", desc: "Rotate, zoom, and slice through an interactive underground model with layer toggles and transparency controls." },
  { icon: FiMap, title: "Interactive Drill Maps", desc: "Leaflet-powered maps plot survey locations, risk zones, and the top recommended drill sites." },
  { icon: FiTarget, title: "Drill Site Ranking", desc: "Top 10 sites ranked by probability, confidence, and projected ROI — ready to act on." },
  { icon: FiTrendingUp, title: "Economic Analysis", desc: "Mining cost, revenue, break-even, and investment scoring so viability is clear before you dig." },
  { icon: FiShield, title: "Uncertainty Mapping", desc: "Confidence, probability, and risk heatmaps quantify how much to trust each estimate." },
  { icon: FiFileText, title: "Professional Reports", desc: "Export polished PDF and CSV reports with charts, 3D captures, and full economic breakdowns." },
  { icon: FiActivity, title: "GeoMiner Assistant", desc: "An AI chatbot on every page explains predictions, geological terms, and survey guidance on demand." },
];

const STEPS = [
  { n: "01", title: "Upload survey data", desc: "Drop in CSV, Excel, SEG-Y, GeoJSON, geological maps, or drill core assay results." },
  { n: "02", title: "AI analyzes the signal", desc: "The model reads resistivity, magnetic, seismic, and gravity signatures to classify deposits." },
  { n: "03", title: "Explore the results", desc: "Review 3D models, 2D cross-sections, uncertainty maps, and ranked drill sites." },
  { n: "04", title: "Export & act", desc: "Download investor-ready PDF or CSV reports with full economic analysis." },
];

const TECH = [
  "React", "Node.js", "Express", "MongoDB", "FastAPI", "TensorFlow", "Scikit-Learn", "Three.js", "Leaflet.js", "Tailwind CSS",
];

const STATS = [
  { value: "7", label: "Minerals modeled" },
  { value: "10+", label: "Input data formats" },
  { value: "2D + 3D", label: "Visualization modes" },
  { value: "<3s", label: "Typical prediction time" },
];

const TESTIMONIALS = [
  { quote: "The 3D subsurface view made it trivial to explain drill targets to our investment committee.", name: "Exploration Lead", org: "Junior mining startup" },
  { quote: "Having ROI and risk scored automatically alongside geology changed how we prioritize sites.", name: "Geophysicist", org: "Independent consultancy" },
  { quote: "Uploading a SEG-Y file and getting a ranked drill plan back in seconds is exactly what field teams need.", name: "Survey Manager", org: "Regional exploration firm" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export default function Landing() {
  return (
    <div className="bg-surface min-h-screen overflow-x-hidden">
      <Navbar />

      {/* HERO */}
      <section className="relative bg-grid-pattern bg-grid">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-600/10 via-transparent to-surface pointer-events-none" />
        <div className="absolute top-24 right-[10%] h-72 w-72 rounded-full bg-primary-600/20 blur-[100px] animate-pulse-slow" />
        <div className="absolute top-40 left-[8%] h-64 w-64 rounded-full bg-accent-600/15 blur-[100px] animate-pulse-slow" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-28 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.6 }}>
            <span className="section-eyebrow">AI-Powered Mineral Exploration</span>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-slate-50 mt-4 leading-[1.1]">
              Find what's <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-400">underground</span> before you drill.
            </h1>
            <p className="text-slate-400 mt-5 text-lg leading-relaxed max-w-lg">
              GeoMiner AI analyzes geophysical survey data to predict mineral deposits, rank drill sites, and model the subsurface in interactive 3D — turning weeks of interpretation into minutes.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <Link to="/register" className="btn-primary">
                Get Started Free <FiArrowRight size={16} />
              </Link>
              <a href="#how-it-works" className="btn-secondary">
                See How It Works
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative"
          >
            <div className="glass-card p-6 animate-float">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono text-slate-500">PREDICTION.OUTPUT</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-accent-600/15 text-accent-400 border border-accent-600/30">Analyzed</span>
              </div>
              <div className="space-y-3">
                {[
                  { label: "Mineral Type", value: "Copper", color: "text-primary-400" },
                  { label: "Probability", value: "87.3%", color: "text-accent-400" },
                  { label: "Deposit Depth", value: "312 m", color: "text-slate-200" },
                  { label: "Confidence Score", value: "0.84", color: "text-slate-200" },
                ].map((r) => (
                  <div key={r.label} className="flex items-center justify-between border-b border-surface-border pb-2.5 last:border-0">
                    <span className="text-sm text-slate-500">{r.label}</span>
                    <span className={`text-sm font-mono font-medium ${r.color}`}>{r.value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 h-24 rounded-lg bg-surface-200 flex items-end gap-1 p-2">
                {[40, 65, 50, 80, 60, 90, 70, 55, 85, 45].map((h, i) => (
                  <div key={i} className="flex-1 rounded-sm bg-gradient-to-t from-primary-600 to-accent-500" style={{ height: `${h}%` }} />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-y border-surface-border bg-surface-300/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-display text-3xl font-bold text-slate-50">{s.value}</p>
              <p className="text-xs text-slate-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* OVERVIEW */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-24 text-center">
        <span className="section-eyebrow">Project Overview</span>
        <h2 className="font-display text-3xl font-bold text-slate-50 mt-4">
          One platform, from raw survey to drill-ready plan
        </h2>
        <p className="text-slate-400 mt-4 leading-relaxed max-w-2xl mx-auto">
          GeoMiner AI ingests geophysical survey data — seismic, magnetotelluric, lithology, borehole, or assay —
          and runs it through a mineral-prediction pipeline built for exploration teams. The result: a probability-ranked
          view of what's underground, where to drill next, and whether it's worth the investment.
        </p>
      </section>

      {/* FEATURES */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 pb-24">
        <div className="text-center mb-14">
          <span className="section-eyebrow">Features</span>
          <h2 className="font-display text-3xl font-bold text-slate-50 mt-4">Everything an exploration team needs</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: (i % 4) * 0.06 }}
              className="glass-card p-5 hover:border-primary-600/40 transition-colors"
            >
              <div className="h-10 w-10 rounded-xl bg-primary-600/15 text-primary-400 flex items-center justify-center mb-4">
                <f.icon size={18} />
              </div>
              <h3 className="text-sm font-semibold text-slate-100">{f.title}</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="bg-surface-300/40 border-y border-surface-border py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <span className="section-eyebrow">How It Works</span>
            <h2 className="font-display text-3xl font-bold text-slate-50 mt-4">From upload to drill plan in four steps</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {STEPS.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="relative"
              >
                <span className="font-display text-4xl font-bold text-primary-600/25">{s.n}</span>
                <h3 className="text-sm font-semibold text-slate-100 mt-2">{s.title}</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">{s.desc}</p>
                {i < STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-5 -right-3 w-6 h-px bg-surface-border" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TECHNOLOGY */}
      <section id="technology" className="max-w-6xl mx-auto px-4 sm:px-6 py-24 text-center">
        <span className="section-eyebrow">Technology Used</span>
        <h2 className="font-display text-3xl font-bold text-slate-50 mt-4 mb-10">Built on a modern, production-ready stack</h2>
        <div className="flex flex-wrap justify-center gap-3">
          {TECH.map((t) => (
            <span key={t} className="px-4 py-2 rounded-xl bg-surface-100 border border-surface-border text-sm text-slate-300 font-mono">
              {t}
            </span>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-surface-300/40 border-y border-surface-border py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <span className="section-eyebrow">What Teams Say</span>
            <h2 className="font-display text-3xl font-bold text-slate-50 mt-4">Trusted for faster exploration decisions</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="glass-card p-6">
                <p className="text-sm text-slate-300 leading-relaxed">"{t.quote}"</p>
                <div className="mt-4 pt-4 border-t border-surface-border">
                  <p className="text-sm font-medium text-slate-100">{t.name}</p>
                  <p className="text-xs text-slate-500">{t.org}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-24">
        <div className="glass-card relative overflow-hidden p-12 text-center">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600/15 to-accent-600/10 pointer-events-none" />
          <div className="relative">
            <FiUploadCloud className="mx-auto text-primary-400 mb-4" size={32} />
            <h2 className="font-display text-3xl font-bold text-slate-50">Ready to see what's beneath the surface?</h2>
            <p className="text-slate-400 mt-3 max-w-md mx-auto">
              Upload your first survey and get an AI-ranked drill plan in minutes.
            </p>
            <Link to="/register" className="btn-primary mt-7 inline-flex">
              Create Free Account <FiArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
