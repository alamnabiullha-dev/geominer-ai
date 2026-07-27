const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");
const { uploadSurvey, getSurveys, getSurveyById, deleteSurvey } = require("../controllers/surveyController");

router.post("/upload", protect, upload.single("file"), uploadSurvey);
router.get("/", protect, getSurveys);
router.get("/:id", protect, getSurveyById);
router.delete("/:id", protect, deleteSurvey);

module.exports = router;
