const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { getPdfReport, getCsvReport } = require("../controllers/reportController");

router.get("/pdf/:id", protect, getPdfReport);
router.get("/csv/:id", protect, getCsvReport);

module.exports = router;
