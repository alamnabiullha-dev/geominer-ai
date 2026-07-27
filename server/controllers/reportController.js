const PDFDocument = require("pdfkit");
const Prediction = require("../models/Prediction");
const Report = require("../models/Report");

// Note: the spec lists jsPDF (a browser library) in the stack; the frontend
// also builds a client-side PDF via jsPDF for instant download from the
// results page. This server endpoint additionally generates a
// server-rendered PDF (via pdfkit) so a report can be regenerated later
// from history without needing the browser session that produced it.

const loadPrediction = async (req) => {
  const prediction = await Prediction.findOne({ _id: req.params.id, user: req.user._id }).populate("survey");
  return prediction;
};

// @route GET /api/report/pdf/:id
const getPdfReport = async (req, res, next) => {
  try {
    const prediction = await loadPrediction(req);
    if (!prediction) return res.status(404).json({ message: "Prediction not found" });

    const fileName = `geominer-report-${prediction._id}.pdf`;
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

    const doc = new PDFDocument({ margin: 50 });
    doc.pipe(res);

    doc.fontSize(20).fillColor("#2563EB").text("GeoMiner AI - Prediction Report", { align: "left" });
    doc.moveDown(0.3);
    doc.fontSize(10).fillColor("#64748B").text(`Generated ${new Date().toLocaleString()}`);
    doc.moveDown(1);

    doc.fontSize(14).fillColor("#0F172A").text("Survey Information");
    doc.fontSize(10).fillColor("#334155");
    doc.text(`Survey: ${prediction.survey?.name || "N/A"}`);
    doc.text(`Data type: ${prediction.survey?.dataType || "N/A"}`);
    doc.text(`Coordinates: ${prediction.survey?.latitude}, ${prediction.survey?.longitude}`);
    doc.moveDown(1);

    doc.fontSize(14).fillColor("#0F172A").text("Prediction Summary");
    doc.fontSize(10).fillColor("#334155");
    doc.text(`Mineral type: ${prediction.mineralType}`);
    doc.text(`Mineral probability: ${(prediction.mineralProbability * 100).toFixed(1)}%`);
    doc.text(`Deposit depth: ${prediction.depositDepthM} m`);
    doc.text(`Lateral extent: ${prediction.lateralExtentM} m`);
    doc.text(`Ore grade: ${prediction.oreGradePct}%`);
    doc.text(`Confidence score: ${(prediction.confidenceScore * 100).toFixed(1)}%`);
    doc.text(`Uncertainty score: ${(prediction.uncertaintyScore * 100).toFixed(1)}%`);
    doc.text(`Estimated deposit size: ${prediction.depositSizeKt} kt`);
    doc.moveDown(1);

    doc.fontSize(14).fillColor("#0F172A").text("Economic Analysis");
    doc.fontSize(10).fillColor("#334155");
    const e = prediction.economics || {};
    doc.text(`Estimated mining cost: $${Number(e.estimatedMiningCostUsd || 0).toLocaleString()}`);
    doc.text(`Expected revenue: $${Number(e.expectedRevenueUsd || 0).toLocaleString()}`);
    doc.text(`Profit: $${Number(e.profitUsd || 0).toLocaleString()}`);
    doc.text(`ROI: ${e.roiPct}%`);
    doc.text(`Investment score: ${e.investmentScore}/100`);
    doc.text(`Risk score: ${e.riskScore}/100`);
    doc.moveDown(1);

    doc.fontSize(14).fillColor("#0F172A").text("Top Recommended Drill Sites");
    doc.fontSize(9).fillColor("#334155");
    (prediction.drillSites || []).slice(0, 10).forEach((s) => {
      doc.text(
        `#${s.rank}  ${s.mineralType}  |  ${s.latitude}, ${s.longitude}  |  depth ${s.estimatedDepthM}m  |  prob ${(s.probability * 100).toFixed(0)}%  |  risk ${s.risk}  |  ROI ${s.roiPct}%`
      );
    });

    doc.end();

    await Report.create({ user: req.user._id, prediction: prediction._id, format: "pdf", fileName });
  } catch (err) {
    next(err);
  }
};

// @route GET /api/report/csv/:id
const getCsvReport = async (req, res, next) => {
  try {
    const prediction = await loadPrediction(req);
    if (!prediction) return res.status(404).json({ message: "Prediction not found" });

    const fileName = `geominer-report-${prediction._id}.csv`;
    const rows = [
      ["Field", "Value"],
      ["Survey", prediction.survey?.name || "N/A"],
      ["Mineral Type", prediction.mineralType],
      ["Mineral Probability", prediction.mineralProbability],
      ["Deposit Depth (m)", prediction.depositDepthM],
      ["Lateral Extent (m)", prediction.lateralExtentM],
      ["Ore Grade (%)", prediction.oreGradePct],
      ["Confidence Score", prediction.confidenceScore],
      ["Uncertainty Score", prediction.uncertaintyScore],
      ["Deposit Size (kt)", prediction.depositSizeKt],
      ["Estimated Mining Cost (USD)", prediction.economics?.estimatedMiningCostUsd],
      ["Expected Revenue (USD)", prediction.economics?.expectedRevenueUsd],
      ["ROI (%)", prediction.economics?.roiPct],
      [],
      ["Rank", "Mineral", "Lat", "Lng", "Depth(m)", "Probability", "Risk", "Confidence", "ROI(%)"],
      ...((prediction.drillSites || []).map((s) => [
        s.rank, s.mineralType, s.latitude, s.longitude, s.estimatedDepthM, s.probability, s.risk, s.confidence, s.roiPct,
      ])),
    ];

    const csv = rows.map((r) => r.map((v) => `"${v ?? ""}"`).join(",")).join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.send(csv);

    await Report.create({ user: req.user._id, prediction: prediction._id, format: "csv", fileName });
  } catch (err) {
    next(err);
  }
};

module.exports = { getPdfReport, getCsvReport };
