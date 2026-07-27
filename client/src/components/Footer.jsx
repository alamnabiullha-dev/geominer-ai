import { Link } from "react-router-dom";
import { FiLayers, FiGithub, FiTwitter, FiLinkedin } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="border-t border-surface-border bg-surface-300/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <FiLayers className="text-white" size={16} />
            </div>
            <span className="font-display font-semibold text-slate-100">GeoMiner AI</span>
          </div>
          <p className="text-sm text-slate-500 leading-relaxed">
            AI-powered mineral exploration for the next generation of mining companies.
          </p>
          <div className="flex gap-3 mt-4 text-slate-500">
            <FiGithub className="hover:text-slate-200 cursor-pointer" size={16} />
            <FiTwitter className="hover:text-slate-200 cursor-pointer" size={16} />
            <FiLinkedin className="hover:text-slate-200 cursor-pointer" size={16} />
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-200 mb-3">Platform</p>
          <ul className="space-y-2 text-sm text-slate-500">
            <li><a href="#features" className="hover:text-slate-300">Features</a></li>
            <li><a href="#how-it-works" className="hover:text-slate-300">How It Works</a></li>
            <li><a href="#technology" className="hover:text-slate-300">Technology</a></li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-200 mb-3">Account</p>
          <ul className="space-y-2 text-sm text-slate-500">
            <li><Link to="/login" className="hover:text-slate-300">Sign in</Link></li>
            <li><Link to="/register" className="hover:text-slate-300">Create account</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-200 mb-3">Minerals Covered</p>
          <ul className="space-y-2 text-sm text-slate-500">
            <li>Copper · Lithium · Gold</li>
            <li>Iron Ore · Nickel</li>
            <li>Silver · Zinc</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-surface-border py-5 text-center text-xs text-slate-600">
        © {new Date().getFullYear()} GeoMiner AI. Built for demonstration purposes — predictions use synthetic modeling.
      </div>
    </footer>
  );
}
