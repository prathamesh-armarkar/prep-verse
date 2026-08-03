import api from "./api";

const headers = (token) => ({
    headers: { Authorization: `Bearer ${token}` },
});

export const roadmapService = {
    /**
     * Generate a new skill roadmap.
     * @param {string} careerGoal - e.g. "Java Full Stack Developer"
     * @param {"beginner"|"intermediate"|"advanced"} currentLevel
     * @param {string} token - JWT auth token
     * @returns {Promise<Object>} - The generated roadmap
     */
    generate: async (careerGoal, currentLevel, token) => {
        const response = await api.post(
            "/api/roadmap/generate",
            { career_goal: careerGoal, current_level: currentLevel },
            headers(token),
        );
        return response.data?.data?.roadmap ?? response.data;
    },

    /**
     * Get the user's most recent roadmap.
     * @param {string} token - JWT auth token
     * @returns {Promise<Object|null>}
     */
    getLatest: async (token) => {
        const response = await api.get("/api/roadmap/latest", headers(token));
        return response.data?.data?.roadmap ?? null;
    },

    /**
     * Get all roadmaps for the user.
     * @param {string} token - JWT auth token
     * @returns {Promise<Array>}
     */
    getAll: async (token) => {
        const response = await api.get("/api/roadmap/all", headers(token));
        return response.data?.data?.roadmaps ?? [];
    },

    /**
     * Update roadmap completion progress.
     * @param {number} roadmapId
     * @param {number} percentage - 0-100
     * @param {string} token
     * @returns {Promise<boolean>}
     */
    updateProgress: async (roadmapId, percentage, token) => {
        const response = await api.put(
            "/api/roadmap/progress",
            { roadmap_id: roadmapId, completion_percentage: percentage },
            headers(token),
        );
        return response.data?.success ?? false;
    },

    /**
     * Delete a roadmap.
     * @param {number} roadmapId
     * @param {string} token
     * @returns {Promise<boolean>}
     */
    delete: async (roadmapId, token) => {
        const response = await api.delete(
            `/api/roadmap/${roadmapId}`,
            headers(token),
        );
        return response.data?.success ?? false;
    },
};

