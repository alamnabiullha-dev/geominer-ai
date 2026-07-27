import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMapPin, FiCpu } from "react-icons/fi";
import FileDropzone from "../components/FileDropzone";
import LocationPickerMap from "../components/LocationPickerMap";
import ChartCard from "../components/ChartCard";
import PredictionLoader from "../components/PredictionLoader";
import { uploadSurvey } from "../services/surveyService";
import { runPrediction } from "../services/predictionService";
import { useToast } from "../context/ToastContext";

const DATA_TYPES = ["CSV", "Excel", "SEG-Y", "GeoJSON", "Geological Map", "Drill Core Assay"];

export default function UploadSurvey() {
  const toast = useToast();
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(null);
  const [name, setName] = useState("");
  const [dataType, setDataType] = useState("CSV");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [predicting, setPredicting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!file) return setError("Please select a survey file to upload.");
    if (!lat || !lng) return setError("Please set survey GPS coordinates (click the map or enter manually).");

    setSubmitting(true);
    setProgress(0);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("name", name || file.name);
      formData.append("dataType", dataType);
      formData.append("latitude", lat);
      formData.append("longitude", lng);
      formData.append("notes", notes);

      const { survey } = await uploadSurvey(formData, setProgress);
      toast.success("Survey uploaded successfully");

      setPredicting(true);
      const { prediction } = await runPrediction(survey._id);
      toast.success("AI prediction complete");
      navigate(`/predictions/${prediction._id}`);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.detail || "Something went wrong. Please try again.");
      toast.error("Upload or prediction failed");
    } finally {
      setSubmitting(false);
      setPredicting(false);
      setProgress(null);
    }
  };

  if (predicting) {
    return (
      <div className="max-w-2xl mx-auto">
        <PredictionLoader />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-slate-50">Upload Survey Data</h1>
        <p className="text-sm text-slate-500 mt-1">
          Supported: 2D seismic profiles, MT resistivity, geological maps, fault line data, lithology maps, borehole data, drill core assays, GPS-tagged datasets.
        </p>
      </div>

      {error && (
        <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <ChartCard title="1. Survey File" subtitle="CSV, Excel, SEG-Y, GeoJSON, geological maps, or assay data (max 50MB)">
          <FileDropzone file={file} onFileSelect={setFile} progress={progress} />
        </ChartCard>

        <ChartCard title="2. Survey Details">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Survey name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className="input-field" placeholder="e.g. North Ridge Block 4" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Data type</label>
              <select value={dataType} onChange={(e) => setDataType(e.target.value)} className="input-field">
                {DATA_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div className="mt-4">
            <label className="text-xs text-slate-400 mb-1.5 block">Notes (optional)</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="input-field resize-none" placeholder="Field conditions, instrument calibration, anything relevant…" />
          </div>
        </ChartCard>

        <ChartCard title="3. GPS Coordinates" subtitle="Click the map to drop a pin, or enter coordinates manually" action={<FiMapPin className="text-primary-400" />}>
          <LocationPickerMap
            lat={lat ? parseFloat(lat) : null}
            lng={lng ? parseFloat(lng) : null}
            onPick={(la, ln) => { setLat(la.toFixed(5)); setLng(ln.toFixed(5)); }}
          />
          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Latitude</label>
              <input value={lat} onChange={(e) => setLat(e.target.value)} className="input-field" placeholder="e.g. 12.9716" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Longitude</label>
              <input value={lng} onChange={(e) => setLng(e.target.value)} className="input-field" placeholder="e.g. 79.1500" />
            </div>
          </div>
        </ChartCard>

        <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-60">
          <FiCpu size={16} /> {submitting ? "Uploading…" : "Upload & Run AI Prediction"}
        </button>
      </form>
    </div>
  );
}
