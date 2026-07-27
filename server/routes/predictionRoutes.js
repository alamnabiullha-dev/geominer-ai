const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
  predict,
  getPredictions,
  getPredictionById,
  deletePrediction,
  toggleFavorite,
} = require("../controllers/predictionController");

router.post("/predict", protect, predict);
router.get("/predictions", protect, getPredictions);
router.get("/predictions/:id", protect, getPredictionById);
router.delete("/predictions/:id", protect, deletePrediction);
router.patch("/predictions/:id/favorite", protect, toggleFavorite);

module.exports = router;
