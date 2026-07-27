import { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FiDownload, FiChevronDown } from "react-icons/fi";
import { useToast } from "../context/ToastContext";

export default function ReportDownloadButton({ prediction }) {
  const [open, setOpen] = useState(false);
  const toast = useToast();
  const token = localStorage.getItem("geominer_token");

  const generateClientPdf = () => {
    const doc = new jsPDF();
    doc.setTextColor("#2563EB");
    doc.setFontSize(18);
    doc.text("GeoMiner AI - Prediction Report", 14, 18);

    doc.setTextColor("#334155");
    doc.setFontSize(10);
    doc.text(`Generated ${new Date().toLocaleString()}`, 14, 25);

    autoTable(doc, {
      startY: 32,
      head: [["Field", "Value"]],
      body: [
        ["Survey", prediction.survey?.name || "N/A"],
        ["Mineral Type", prediction.mineralType],
        ["Mineral Probability", `${(prediction.mineralProbability * 100).toFixed(1)}%`],
        ["Deposit Depth", `${prediction.depositDepthM} m`],
        ["Lateral Extent", `${prediction.lateralExtentM} m`],
        ["Ore Grade", `${prediction.oreGradePct}%`],
        ["Confidence Score", `${(prediction.confidenceScore * 100).toFixed(1)}%`],
        ["Uncertainty Score", `${(prediction.uncertaintyScore * 100).toFixed(1)}%`],
        ["Deposit Size", `${prediction.depositSizeKt} kt`],
        ["Expected Revenue", `$${Number(prediction.economics?.expectedRevenueUsd || 0).toLocaleString()}`],
        ["ROI", `${prediction.economics?.roiPct}%`],
      ],
      theme: "grid",
      headStyles: { fillColor: [37, 99, 235] },
    });

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      head: [["Rank", "Mineral", "Lat", "Lng", "Depth (m)", "Prob.", "Risk", "ROI"]],
      body: prediction.drillSites.slice(0, 10).map((s) => [
        s.rank, s.mineralType, s.latitude, s.longitude, s.estimatedDepthM,
        `${(s.probability * 100).toFixed(0)}%`, s.risk, `${s.roiPct}%`,
      ]),
      theme: "striped",
      headStyles: { fillColor: [34, 197, 94] },
    });

    doc.save(`geominer-report-${prediction._id}.pdf`);
    toast.success("Report downloaded");
    setOpen(false);
  };

  const downloadServer = async (format) => {
    try {
      const res = await fetch(`/api/report/${format}/${prediction._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Download failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `geominer-report-${prediction._id}.${format === "csv" ? "csv" : "pdf"}`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success(`${format.toUpperCase()} report downloaded`);
    } catch {
      toast.error("Could not download report");
    }
    setOpen(false);
  };

  return (
    <div className="relative">
      <button onClick={() => setOpen((o) => !o)} className="btn-accent">
        <FiDownload size={15} /> Download Report <FiChevronDown size={14} />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-52 glass-card p-1.5 z-20" onMouseLeave={() => setOpen(false)}>
          <button onClick={generateClientPdf} className="w-full text-left px-3 py-2 text-sm rounded-lg text-slate-300 hover:bg-surface-100">
            PDF (instant, in-browser)
          </button>
          <button onClick={() => downloadServer("pdf")} className="w-full text-left px-3 py-2 text-sm rounded-lg text-slate-300 hover:bg-surface-100">
            PDF (server-generated)
          </button>
          <button onClick={() => downloadServer("csv")} className="w-full text-left px-3 py-2 text-sm rounded-lg text-slate-300 hover:bg-surface-100">
            CSV export
          </button>
        </div>
      )}
    </div>
  );
}
