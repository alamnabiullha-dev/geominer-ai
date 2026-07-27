const Survey = require("../models/Survey");

const EXT_TO_TYPE = {
  ".csv": "CSV",
  ".xlsx": "Excel",
  ".xls": "Excel",
  ".sgy": "SEG-Y",
  ".segy": "SEG-Y",
  ".geojson": "GeoJSON",
  ".json": "GeoJSON",
};

// @route POST /api/surveys/upload
const uploadSurvey = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const { name, latitude, longitude, notes, dataType } = req.body;
    if (latitude === undefined || longitude === undefined) {
      return res.status(400).json({ message: "latitude and longitude are required" });
    }

    const ext = ("." + req.file.originalname.split(".").pop()).toLowerCase();
    const resolvedType = dataType || EXT_TO_TYPE[ext] || "CSV";

    const survey = await Survey.create({
      user: req.user._id,
      name: name || req.file.originalname,
      dataType: resolvedType,
      fileName: req.file.originalname,
      filePath: req.file.filename,
      fileSizeBytes: req.file.size,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      notes: notes || "",
      status: "Uploaded",
    });

    res.status(201).json({ survey });
  } catch (err) {
    next(err);
  }
};

// @route GET /api/surveys
const getSurveys = async (req, res, next) => {
  try {
    const surveys = await Survey.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ surveys });
  } catch (err) {
    next(err);
  }
};

// @route GET /api/surveys/:id
const getSurveyById = async (req, res, next) => {
  try {
    const survey = await Survey.findOne({ _id: req.params.id, user: req.user._id });
    if (!survey) return res.status(404).json({ message: "Survey not found" });
    res.json({ survey });
  } catch (err) {
    next(err);
  }
};

// @route DELETE /api/surveys/:id
const deleteSurvey = async (req, res, next) => {
  try {
    const survey = await Survey.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!survey) return res.status(404).json({ message: "Survey not found" });
    res.json({ message: "Survey deleted" });
  } catch (err) {
    next(err);
  }
};

module.exports = { uploadSurvey, getSurveys, getSurveyById, deleteSurvey };
