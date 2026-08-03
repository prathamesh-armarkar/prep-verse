import api from "./api";

export const registerUser = async (payload) => {
    const response = await api.post("/api/auth/register", payload);
    return response.data;
};

export const verifyOtp = async (payload) => {
    const response = await api.post("/api/auth/verify-otp", payload);
    return response.data;
};

export const resendOtp = async (payload) => {
    const response = await api.post("/api/auth/resend-otp", payload);
    return response.data;
};

export const loginUser = async (payload) => {
    const response = await api.post("/api/auth/login", payload);
    return response.data;
};
