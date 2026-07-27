import api from "./api";

export const runPrediction = (surveyId) => api.post("/predict", { surveyId }).then((r) => r.data);
export const getPredictions = (params) => api.get("/predictions", { params }).then((r) => r.data);
export const getPredictionById = (id) => api.get(`/predictions/${id}`).then((r) => r.data);
export const deletePrediction = (id) => api.delete(`/predictions/${id}`).then((r) => r.data);
export const toggleFavorite = (id) => api.patch(`/predictions/${id}/favorite`).then((r) => r.data);
