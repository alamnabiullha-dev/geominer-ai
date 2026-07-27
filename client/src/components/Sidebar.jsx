import { NavLink } from "react-router-dom";
import { FiGrid, FiUploadCloud, FiClock, FiUser, FiSettings, FiLayers, FiX } from "react-icons/fi";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: FiGrid },
  { to: "/upload", label: "Upload Survey", icon: FiUploadCloud },
  { to: "/history", label: "Prediction History", icon: FiClock },
  { to: "/profile", label: "Profile", icon: FiUser },
  { to: "/settings", label: "Settings", icon: FiSettings },
];

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/60 z-30 lg:hidden" onClick={onClose} />
      )}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 shrink-0 bg-surface-300/80 backdrop-blur-xl border-r border-surface-border z-40 transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between px-6 h-16 border-b border-surface-border">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <FiLayers className="text-white" size={16} />
            </div>
            <span className="font-display font-semibold text-slate-100">GeoMiner AI</span>
          </div>
          <button onClick={onClose} className="lg:hidden text-slate-400">
            <FiX size={20} />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary-600/15 text-primary-400 border border-primary-600/30"
                    : "text-slate-400 hover:text-slate-100 hover:bg-surface-100"
                }`
              }
            >
              <Icon size={17} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="glass-card p-4">
            <p className="text-xs text-slate-400 leading-relaxed">
              AI predictions are generated from synthetic geophysical modeling for demonstration purposes.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
