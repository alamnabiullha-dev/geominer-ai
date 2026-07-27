import { useState } from "react";
import { Link } from "react-router-dom";
import { FiLayers, FiMenu, FiX } from "react-icons/fi";

const NAV = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#technology", label: "Technology" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-surface/70 backdrop-blur-xl border-b border-surface-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
            <FiLayers className="text-white" size={16} />
          </div>
          <span className="font-display font-semibold text-slate-100">GeoMiner AI</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className="text-sm text-slate-400 hover:text-slate-100 transition-colors">
              {n.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link to="/login" className="text-sm text-slate-300 hover:text-white px-3 py-2">
            Sign in
          </Link>
          <Link to="/register" className="btn-primary !py-2 !px-4 text-sm">
            Get Started
          </Link>
        </div>

        <button className="md:hidden text-slate-300" onClick={() => setOpen((o) => !o)}>
          {open ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-surface-border px-4 py-4 space-y-3">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} onClick={() => setOpen(false)} className="block text-sm text-slate-300">
              {n.label}
            </a>
          ))}
          <div className="flex gap-3 pt-2">
            <Link to="/login" className="btn-secondary flex-1 text-sm">Sign in</Link>
            <Link to="/register" className="btn-primary flex-1 text-sm">Get Started</Link>
          </div>
        </div>
      )}
    </header>
  );
}
