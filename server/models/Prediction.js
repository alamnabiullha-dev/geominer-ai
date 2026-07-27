const mongoose = require("mongoose");

const predictionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    survey: { type: mongoose.Schema.Types.ObjectId, ref: "Survey", required: true },

    mineralType: { type: String, required: true },
    mineralProbability: { type: Number, required: true },
    mineralRanking: [{ mineral: String, probability: Number }],
    depositDepthM: { type: Number, required: true },
    lateralExtentM: { type: Number, required: true },
    oreGradePct: { type: Number, required: true },
    confidenceScore: { type: Number, required: true },
    uncertaintyScore: { type: Number, required: true },
    depositSizeKt: { type: Number, required: true },

    economics: {
      estimatedMiningCostUsd: Number,
      expectedRevenueUsd: Number,
      profitUsd: Number,
      roiPct: Number,
      breakEvenTons: Number,
      investmentScore: Number,
      riskScore: Number,
      unitPriceUsdPerTon: Number,
    },

    drillSites: [
      {
        rank: Number,
        latitude: Number,
        longitude: Number,
        mineralType: String,
        probability: Number,
        estimatedDepthM: Number,
        risk: String,
        confidence: Number,
        estimatedCostUsd: Number,
        expectedRevenueUsd: Number,
        roiPct: Number,
      },
    ],

    crossSection2D: { type: mongoose.Schema.Types.Mixed },
    model3D: { type: mongoose.Schema.Types.Mixed },
    uncertaintyAnalysis: { type: mongoose.Schema.Types.Mixed },

    isFavorite: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Prediction", predictionSchema);
