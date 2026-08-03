import axios from "axios";

const api = axios.create({
    // baseURL: import.meta.env.VITE_API_BASE_URL || "https://prep-verse-b.onrender.com",
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000",
    withCredentials: false,
    headers: {
        "Content-Type": "application/json"
    }
});

// Automatically attach the JWT from localStorage to every request.
// Individual services may override the Authorization header explicitly,
// and this interceptor only fills it in when it is not already present.
api.interceptors.request.use(
    (config) => {
        if (!config.headers.Authorization) {
            const token = localStorage.getItem("prepverse_token");
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;

