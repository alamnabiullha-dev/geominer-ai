const mongoose = require("mongoose");

const surveySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true, trim: true },
    dataType: {
      type: String,
      enum: ["CSV", "Excel", "SEG-Y", "GeoJSON", "Geological Map", "Drill Core Assay"],
      required: true,
    },
    fileName: { type: String, required: true },
    filePath: { type: String, required: true },
    fileSizeBytes: { type: Number, default: 0 },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    notes: { type: String, default: "" },
    status: { type: String, enum: ["Uploaded", "Processing", "Analyzed", "Failed"], default: "Uploaded" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Survey", surveySchema);
