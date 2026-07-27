const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    prediction: { type: mongoose.Schema.Types.ObjectId, ref: "Prediction", required: true },
    format: { type: String, enum: ["pdf", "csv", "excel"], required: true },
    fileName: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Report", reportSchema);
