import axios from "axios";

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000" });
// const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || "https://prep-verse-b.onrender.com" });

const authConfig = (token, config = {}) => ({
    ...config,
    headers: { ...config.headers, ...(token ? { Authorization: `Bearer ${token}` } : {}) }
});

const data = (response) => response.data?.data ?? response.data;

export const resumeService = {
    getLatest: async (token) => data(await api.get("/api/resume/latest", authConfig(token))),
    getHistory: async (token) => data(await api.get("/api/resume/history", authConfig(token))),
    getById: async (id, token) => data(await api.get(`/api/resume/${id}`, authConfig(token))),
    compare: async (id, token) => data(await api.get(`/api/resume/compare/${id}`, authConfig(token))),
    remove: async (id, token) => data(await api.delete(`/api/resume/${id}`, authConfig(token))),
    upload: async (file, token, targetRole = "", jobDescription = "", onUploadProgress) => {
        const formData = new FormData();
        formData.append("resume", file);
        formData.append("target_role", targetRole);
        if (jobDescription) formData.append("job_description", jobDescription);
        return data(await api.post("/api/resume/upload", formData, authConfig(token, {
            onUploadProgress,
            headers: { "Content-Type": "multipart/form-data" }
        })));
    }
};
