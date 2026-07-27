const Survey = require("../models/Survey");
const Prediction = require("../models/Prediction");
const { runPrediction } = require("../utils/aiClient");

// @route POST /api/predict  { surveyId }
const predict = async (req, res, next) => {
  try {
    const { surveyId } = req.body;
    if (!surveyId) return res.status(400).json({ message: "surveyId is required" });

    const survey = await Survey.findOne({ _id: surveyId, user: req.user._id });
    if (!survey) return res.status(404).json({ message: "Survey not found" });

    survey.status = "Processing";
    await survey.save();

    let aiResult;
    try {
      aiResult = await runPrediction({
        surveyId: survey._id.toString(),
        latitude: survey.latitude,
        longitude: survey.longitude,
      });
    } catch (aiErr) {
      survey.status = "Failed";
      await survey.save();
      return res.status(502).json({
        message: "AI service is unreachable or failed to generate a prediction. Ensure the FastAPI service (ai/app.py) is running.",
        detail: aiErr.message,
      });
    }

    const { prediction, economics, drill_sites, cross_section_2d, model_3d, uncertainty_analysis } = aiResult;

    const saved = await Prediction.create({
      user: req.user._id,
      survey: survey._id,
      mineralType: prediction.mineral_type,
      mineralProbability: prediction.mineral_probability,
      mineralRanking: prediction.mineral_ranking.map((m) => ({ mineral: m.mineral, probability: m.probability })),
      depositDepthM: prediction.deposit_depth_m,
      lateralExtentM: prediction.lateral_extent_m,
      oreGradePct: prediction.ore_grade_pct,
      confidenceScore: prediction.confidence_score,
      uncertaintyScore: prediction.uncertainty_score,
      depositSizeKt: prediction.deposit_size_kt,
      economics: {
        estimatedMiningCostUsd: economics.estimated_mining_cost_usd,
        expectedRevenueUsd: economics.expected_revenue_usd,
        profitUsd: economics.profit_usd,
        roiPct: economics.roi_pct,
        breakEvenTons: economics.break_even_tons,
        investmentScore: economics.investment_score,
        riskScore: economics.risk_score,
        unitPriceUsdPerTon: economics.unit_price_usd_per_ton,
      },
      drillSites: drill_sites.map((s) => ({
        rank: s.rank,
        latitude: s.latitude,
        longitude: s.longitude,
        mineralType: s.mineral_type,
        probability: s.probability,
        estimatedDepthM: s.estimated_depth_m,
        risk: s.risk,
        confidence: s.confidence,
        estimatedCostUsd: s.estimated_cost_usd,
        expectedRevenueUsd: s.expected_revenue_usd,
        roiPct: s.roi_pct,
      })),
      crossSection2D: cross_section_2d,
      model3D: model_3d,
      uncertaintyAnalysis: uncertainty_analysis,
    });

    survey.status = "Analyzed";
    await survey.save();

    res.status(201).json({ prediction: saved });
  } catch (err) {
    next(err);
  }
};

// @route GET /api/predictions?search=&mineral=&minConfidence=&sort=
const getPredictions = async (req, res, next) => {
  try {
    const { search, mineral, minConfidence, sort = "-createdAt" } = req.query;
    const query = { user: req.user._id };

    if (mineral) query.mineralType = mineral;
    if (minConfidence) query.confidenceScore = { $gte: parseFloat(minConfidence) };

    let predictions = await Prediction.find(query).populate("survey", "name latitude longitude dataType").sort(sort);

    if (search) {
      const s = search.toLowerCase();
      predictions = predictions.filter(
        (p) =>
          p.mineralType.toLowerCase().includes(s) ||
          (p.survey && p.survey.name && p.survey.name.toLowerCase().includes(s))
      );
    }

    res.json({ predictions });
  } catch (err) {
    next(err);
  }
};

// @route GET /api/predictions/:id
const getPredictionById = async (req, res, next) => {
  try {
    const prediction = await Prediction.findOne({ _id: req.params.id, user: req.user._id }).populate("survey");
    if (!prediction) return res.status(404).json({ message: "Prediction not found" });
    res.json({ prediction });
  } catch (err) {
    next(err);
  }
};

// @route DELETE /api/predictions/:id
const deletePrediction = async (req, res, next) => {
  try {
    const prediction = await Prediction.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!prediction) return res.status(404).json({ message: "Prediction not found" });
    res.json({ message: "Prediction deleted" });
  } catch (err) {
    next(err);
  }
};

// @route PATCH /api/predictions/:id/favorite
const toggleFavorite = async (req, res, next) => {
  try {
    const prediction = await Prediction.findOne({ _id: req.params.id, user: req.user._id });
    if (!prediction) return res.status(404).json({ message: "Prediction not found" });
    prediction.isFavorite = !prediction.isFavorite;
    await prediction.save();
    res.json({ prediction });
  } catch (err) {
    next(err);
  }
};

module.exports = { predict, getPredictions, getPredictionById, deletePrediction, toggleFavorite };
