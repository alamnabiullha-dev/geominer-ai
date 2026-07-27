import api from "./api";

export const uploadSurvey = (formData, onProgress) =>
  api
    .post("/surveys/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (evt) => {
        if (onProgress && evt.total) onProgress(Math.round((evt.loaded * 100) / evt.total));
      },
    })
    .then((r) => r.data);

export const getSurveys = () => api.get("/surveys").then((r) => r.data);
export const getSurveyById = (id) => api.get(`/surveys/${id}`).then((r) => r.data);
export const deleteSurvey = (id) => api.delete(`/surveys/${id}`).then((r) => r.data);
