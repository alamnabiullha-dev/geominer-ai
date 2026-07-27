import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiMail, FiLayers, FiArrowRight, FiCheckCircle } from "react-icons/fi";
import { forgotPassword } from "../services/authService";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await forgotPassword(email);
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface bg-grid-pattern bg-grid flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
            <FiLayers className="text-white" size={18} />
          </div>
          <span className="font-display font-semibold text-lg text-slate-100">GeoMiner AI</span>
        </Link>

        <div className="glass-card p-8 text-center">
          {sent ? (
            <>
              <FiCheckCircle className="mx-auto text-accent-400 mb-3" size={32} />
              <h1 className="text-lg font-semibold text-slate-50">Check your email</h1>
              <p className="text-sm text-slate-400 mt-2">
                If an account exists for <span className="text-slate-300">{email}</span>, a password reset link is on its way.
              </p>
            </>
          ) : (
            <>
              <h1 className="text-xl font-display font-semibold text-slate-50 text-left">Reset your password</h1>
              <p className="text-sm text-slate-400 mt-1 text-left">Enter your email and we'll send you a reset link.</p>
              <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-left">
                <div>
                  <label className="text-xs text-slate-400 mb-1.5 block">Email</label>
                  <div className="relative">
                    <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="input-field pl-10" placeholder="you@company.com" />
                  </div>
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
                  {loading ? "Sending…" : "Send reset link"} <FiArrowRight size={15} />
                </button>
              </form>
            </>
          )}
        </div>

        <p className="text-center text-sm text-slate-500 mt-6">
          <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium">
            Back to sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
