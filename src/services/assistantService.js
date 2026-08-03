import api from "./api";

const headers = (token) => ({
    headers: { Authorization: `Bearer ${token}` },
});

export const assistantService = {
    /**
     * Send a message to the AI career assistant.
     * @param {string} message - The user's message
     * @param {string} token - JWT auth token
     * @returns {Promise<{message: string, actions: string[]}>}
     */
    send: async (message, token) => {
        const response = await api.post(
            "/api/chat/send",
            { message },
            headers(token),
        );
        return response.data?.data ?? response.data;
    },

    /**
     * Get the user's chat history.
     * @param {string} token - JWT auth token
     * @param {number} [limit=50] - Max messages to fetch
     * @returns {Promise<Array>}
     */
    getHistory: async (token, limit = 50) => {
        const response = await api.get(
            `/api/chat/history?limit=${limit}`,
            headers(token),
        );
        return response.data?.data?.history ?? [];
    },

    /**
     * Clear the user's chat history.
     * @param {string} token - JWT auth token
     * @returns {Promise<boolean>}
     */
    clearHistory: async (token) => {
        const response = await api.delete("/api/chat/clear", headers(token));
        return response.data?.success ?? false;
    },
};

