import api from "./api";

export const registerUser = (payload) => api.post("/auth/register", payload).then((r) => r.data);
export const loginUser = (payload) => api.post("/auth/login", payload).then((r) => r.data);
export const fetchProfile = () => api.get("/auth/profile").then((r) => r.data);
export const updateProfile = (payload) => api.put("/auth/profile", payload).then((r) => r.data);
export const forgotPassword = (email) => api.post("/auth/forgot-password", { email }).then((r) => r.data);
