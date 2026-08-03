import api from "./api";

const headers = (token) => ({
    headers: { Authorization: `Bearer ${token}` },
});

export const dashboardService = {
    /**
     * Fetch aggregated dashboard data (stats, activity, recommendations, goals).
     * @param {string} token - JWT auth token
     * @returns {Promise<Object>}
     */
    getDashboard: async (token) => {
        const response = await api.get("/api/dashboard", headers(token));
        return response.data?.data ?? null;
    },
};

