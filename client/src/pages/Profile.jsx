import { useEffect, useState } from "react";
import { FiUser, FiMail, FiBriefcase, FiSave } from "react-icons/fi";
import ChartCard from "../components/ChartCard";
import { TableSkeleton } from "../components/LoadingSkeleton";
import { useAuth } from "../context/AuthContext";
import { updateProfile } from "../services/authService";
import { getSurveys } from "../services/surveyService";
import { getPredictions } from "../services/predictionService";
import { useToast } from "../context/ToastContext";

export default function Profile() {
  const { user, updateLocalUser } = useAuth();
  const toast = useToast();
  const [form, setForm] = useState({ name: user?.name || "", organization: user?.organization || "", role: user?.role || "" });
  const [saving, setSaving] = useState(false);
  const [surveys, setSurveys] = useState(null);
  const [predictions, setPredictions] = useState(null);

  useEffect(() => {
    getSurveys().then((d) => setSurveys(d.surveys)).catch(() => setSurveys([]));
    getPredictions().then((d) => setPredictions(d.predictions)).catch(() => setPredictions([]));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { user: updated } = await updateProfile(form);
      updateLocalUser(updated);
      toast.success("Profile updated");
    } catch {
      toast.error("Could not update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="font-display text-2xl font-semibold text-slate-50">Profile</h1>
        <p className="text-sm text-slate-500 mt-1">Manage your account details and review your activity.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <ChartCard title="Account Details" className="md:col-span-2">
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Full name</label>
              <div className="relative">
                <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field pl-10" />
              </div>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input value={user?.email} disabled className="input-field pl-10 opacity-60 cursor-not-allowed" />
              </div>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Organization</label>
              <div className="relative">
                <FiBriefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })} className="input-field pl-10" />
              </div>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Role</label>
              <input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="input-field" placeholder="e.g. Geologist" />
            </div>
            <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
              <FiSave size={15} /> {saving ? "Saving…" : "Save changes"}
            </button>
          </form>
        </ChartCard>

        <div className="space-y-6">
          <ChartCard title="Summary">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-slate-500">Surveys uploaded</span><span className="text-slate-200">{surveys?.length ?? "…"}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Predictions run</span><span className="text-slate-200">{predictions?.length ?? "…"}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Member since</span><span className="text-slate-200">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}</span></div>
            </div>
          </ChartCard>
        </div>
      </div>

      <ChartCard title="Uploaded Surveys">
        {surveys === null ? (
          <TableSkeleton rows={4} />
        ) : surveys.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-6">No surveys uploaded yet.</p>
        ) : (
          <div className="divide-y divide-surface-border">
            {surveys.map((s) => (
              <div key={s._id} className="flex items-center justify-between py-3 text-sm">
                <div>
                  <p className="text-slate-200">{s.name}</p>
                  <p className="text-xs text-slate-500">{s.dataType} · {new Date(s.createdAt).toLocaleDateString()}</p>
                </div>
                <span className="text-xs px-2 py-1 rounded-full border border-surface-border text-slate-400">{s.status}</span>
              </div>
            ))}
          </div>
        )}
      </ChartCard>
    </div>
  );
}
