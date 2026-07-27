const axios = require("axios");

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://localhost:8000";

const runPrediction = async ({ surveyId, latitude, longitude, drillSites = 10 }) => {
  const { data } = await axios.post(`${AI_SERVICE_URL}/predict`, {
    survey_id: surveyId,
    latitude,
    longitude,
    drill_sites: drillSites,
  });
  return data;
};

const chatWithAssistant = async ({ message, context }) => {
  const { data } = await axios.post(`${AI_SERVICE_URL}/chat`, { message, context });
  return data;
};

module.exports = { runPrediction, chatWithAssistant };
