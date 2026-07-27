import { useState, useCallback, useRef } from "react";
import { FiUploadCloud, FiFile, FiX } from "react-icons/fi";

const ACCEPTED = ".csv,.xlsx,.xls,.sgy,.segy,.geojson,.json";

export default function FileDropzone({ file, onFileSelect, progress }) {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  const handleFiles = useCallback(
    (files) => {
      if (files && files[0]) onFileSelect(files[0]);
    },
    [onFileSelect]
  );

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  if (file) {
    return (
      <div className="border border-surface-border rounded-xl p-4 flex items-center gap-3 bg-surface-200">
        <div className="h-10 w-10 rounded-lg bg-primary-600/15 flex items-center justify-center text-primary-400 shrink-0">
          <FiFile size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-slate-200 truncate">{file.name}</p>
          <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
          {progress !== undefined && progress !== null && (
            <div className="mt-2 h-1.5 rounded-full bg-surface-100 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
        <button onClick={() => onFileSelect(null)} className="text-slate-500 hover:text-red-400 shrink-0">
          <FiX size={18} />
        </button>
      </div>
    );
  }

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={onDrop}
      onClick={() => inputRef.current?.click()}
      className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${
        dragOver ? "border-primary-500 bg-primary-600/5" : "border-surface-border hover:border-primary-600/50"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <FiUploadCloud className="mx-auto text-primary-400 mb-3" size={32} />
      <p className="text-sm text-slate-300 font-medium">Drag & drop your survey file here</p>
      <p className="text-xs text-slate-500 mt-1">or click to browse — CSV, Excel, SEG-Y, GeoJSON (max 50MB)</p>
    </div>
  );
}
