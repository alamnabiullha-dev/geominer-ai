import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMenu, FiBell, FiLogOut, FiChevronDown, FiSun, FiMoon } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

export default function Topbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark] = useState(true);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleTheme = () => {
    setDark((d) => !d);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <header className="sticky top-0 z-20 h-16 flex items-center justify-between px-4 sm:px-6 border-b border-surface-border bg-surface/80 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="lg:hidden text-slate-300">
          <FiMenu size={22} />
        </button>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={toggleTheme}
          className="h-9 w-9 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-100 hover:bg-surface-100 transition-colors"
          aria-label="Toggle theme"
        >
          {dark ? <FiSun size={17} /> : <FiMoon size={17} />}
        </button>
        <button className="relative h-9 w-9 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-100 hover:bg-surface-100 transition-colors">
          <FiBell size={17} />
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-accent-400" />
        </button>

        <div className="relative">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-surface-100 transition-colors"
          >
            <div
              className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold text-white"
              style={{ backgroundColor: user?.avatarColor || "#2563EB" }}
            >
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <span className="hidden sm:block text-sm text-slate-200">{user?.name}</span>
            <FiChevronDown size={14} className="text-slate-500" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 glass-card p-1.5" onMouseLeave={() => setMenuOpen(false)}>
              <button
                onClick={() => { setMenuOpen(false); navigate("/profile"); }}
                className="w-full text-left px-3 py-2 text-sm rounded-lg text-slate-300 hover:bg-surface-100"
              >
                Profile
              </button>
              <button
                onClick={() => { setMenuOpen(false); navigate("/settings"); }}
                className="w-full text-left px-3 py-2 text-sm rounded-lg text-slate-300 hover:bg-surface-100"
              >
                Settings
              </button>
              <hr className="border-surface-border my-1" />
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 text-left px-3 py-2 text-sm rounded-lg text-red-400 hover:bg-red-500/10"
              >
                <FiLogOut size={14} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
