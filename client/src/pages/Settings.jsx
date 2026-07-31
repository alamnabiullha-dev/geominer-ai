/*import { useState } from "react";
import { FiMoon, FiSun, FiBell, FiGlobe, FiSave } from "react-icons/fi";
import ChartCard from "../components/ChartCard";
import { useAuth } from "../context/AuthContext";
import { updateProfile } from "../services/authService";
import { useToast } from "../context/ToastContext";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
  { code: "pt", label: "Português" },
  { code: "hi", label: "हिन्दी" },
];

export default function Settings() {
  const { user, updateLocalUser } = useAuth();
  const toast = useToast();
  const [settings, setSettings] = useState(
    user?.settings || { theme: "dark", notifications: true, language: "en" }
  );
  const [saving, setSaving] = useState(false);

  const handleThemeChange = (theme) => {
    setSettings((s) => ({ ...s, theme }));
    document.documentElement.classList.toggle("dark", theme === "dark");
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { user: updated } = await updateProfile({ settings });
      updateLocalUser(updated);
      toast.success("Settings saved");
    } catch {
      toast.error("Could not save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="font-display text-2xl font-semibold text-slate-50">Settings</h1>
        <p className="text-sm text-slate-500 mt-1">Customize how GeoMiner AI looks and notifies you.</p>
      </div>

      <ChartCard title="Appearance">
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleThemeChange("dark")}
            className={`flex items-center gap-2 justify-center rounded-xl border px-4 py-3 text-sm transition-colors ${
              settings.theme === "dark" ? "border-primary-600 bg-primary-600/10 text-primary-400" : "border-surface-border text-slate-400"
            }`}
          >
            <FiMoon size={15} /> Dark Mode
          </button>
          <button
            onClick={() => handleThemeChange("light")}
            className={`flex items-center gap-2 justify-center rounded-xl border px-4 py-3 text-sm transition-colors ${
              settings.theme === "light" ? "border-primary-600 bg-primary-600/10 text-primary-400" : "border-surface-border text-slate-400"
            }`}
          >
            <FiSun size={15} /> Light Mode
          </button>
        </div>
      </ChartCard>

      <ChartCard title="Notifications">
        <label className="flex items-center justify-between cursor-pointer">
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <FiBell size={15} /> Enable notifications
          </div>
          <input
            type="checkbox"
            checked={settings.notifications}
            onChange={(e) => setSettings((s) => ({ ...s, notifications: e.target.checked }))}
            className="accent-primary-600 h-4 w-4"
          />
        </label>
        <p className="text-xs text-slate-500 mt-2">Get toast alerts for uploads, predictions, downloads, and errors.</p>
      </ChartCard>

      <ChartCard title="Language">
        <div className="relative">
          <FiGlobe className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <select
            value={settings.language}
            onChange={(e) => setSettings((s) => ({ ...s, language: e.target.value }))}
            className="input-field pl-10"
          >
            {LANGUAGES.map((l) => <option key={l.code} value={l.code}>{l.label}</option>)}
          </select>
        </div>
      </ChartCard>

      <button onClick={handleSave} disabled={saving} className="btn-primary disabled:opacity-60">
        <FiSave size={15} /> {saving ? "Saving…" : "Save settings"}
      </button>
    </div>
  );
}. */


import { useState, useEffect } from "react";
import {
  FiMoon,
  FiSun,
  FiBell,
  FiGlobe,
  FiSave,
} from "react-icons/fi";
import ChartCard from "../components/ChartCard";
import { useAuth } from "../context/AuthContext";
import { updateProfile } from "../services/authService";
import { useToast } from "../context/ToastContext";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
  { code: "pt", label: "Português" },
  { code: "hi", label: "हिन्दी" },
];

export default function Settings() {
  const { user, updateLocalUser } = useAuth();
  const toast = useToast();

  const [settings, setSettings] = useState(
    user?.settings || {
      theme: "dark",
      notifications: true,
      language: "en",
    }
  );

  const [saving, setSaving] = useState(false);

  // Sync settings when user data changes
  useEffect(() => {
    if (user?.settings) {
      setSettings(user.settings);
    }
  }, [user]);

  // Apply theme on load and whenever it changes
  useEffect(() => {
    document.documentElement.classList.toggle(
      "dark",
      settings.theme === "dark"
    );
  }, [settings.theme]);

  const handleThemeChange = (theme) => {
    setSettings((prev) => ({
      ...prev,
      theme,
    }));
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      const { user: updated } = await updateProfile({
        settings,
      });

      updateLocalUser(updated);

      toast.success("Settings saved successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Could not save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-semibold text-slate-50">
          Settings
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Customize how GeoMiner AI looks and notifies you.
        </p>
      </div>

      {/* Appearance */}
      <ChartCard title="Appearance">
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleThemeChange("dark")}
            className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm transition-all ${settings.theme === "dark"
                ? "border-primary-600 bg-primary-600/10 text-primary-400"
                : "border-surface-border text-slate-400 hover:border-primary-500"
              }`}
          >
            <FiMoon size={16} />
            Dark Mode
          </button>

          <button
            onClick={() => handleThemeChange("light")}
            className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm transition-all ${settings.theme === "light"
                ? "border-primary-600 bg-primary-600/10 text-primary-400"
                : "border-surface-border text-slate-400 hover:border-primary-500"
              }`}
          >
            <FiSun size={16} />
            Light Mode
          </button>
        </div>
      </ChartCard>

      {/* Notifications */}
      <ChartCard title="Notifications">
        <label className="flex cursor-pointer items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <FiBell size={16} />
            Enable notifications
          </div>

          <input
            type="checkbox"
            checked={settings.notifications}
            onChange={(e) =>
              setSettings((prev) => ({
                ...prev,
                notifications: e.target.checked,
              }))
            }
            className="h-5 w-5 accent-primary-600"
          />
        </label>

        <p className="mt-2 text-xs text-slate-500">
          Get notifications for uploads, predictions, reports and errors.
        </p>
      </ChartCard>

      {/* Language */}
      <ChartCard title="Language">
        <div className="relative">
          <FiGlobe
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
          />

          <select
            value={settings.language}
            onChange={(e) =>
              setSettings((prev) => ({
                ...prev,
                language: e.target.value,
              }))
            }
            className="input-field pl-10"
          >
            {LANGUAGES.map((language) => (
              <option key={language.code} value={language.code}>
                {language.label}
              </option>
            ))}
          </select>
        </div>
      </ChartCard>

      {/* Save */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="btn-primary flex items-center gap-2 disabled:opacity-60"
      >
        <FiSave size={16} />
        {saving ? "Saving..." : "Save Settings"}
      </button>
    </div>
  );
}
