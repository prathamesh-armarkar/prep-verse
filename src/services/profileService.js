 import api from "./api";

const unwrap = (response) => response.data;

/**
 * Fetch the current user's full profile.
 * @returns {Promise<Object>} { success, profile }
 */
export const getProfile = async () => {
    const response = await api.get("/api/profile");
    return unwrap(response);
};

/**
 * Update the current user's profile.
 * @param {Object} payload - editable profile fields
 * @returns {Promise<Object>} { success, message, profile }
 */
export const updateProfile = async (payload) => {
    const response = await api.put("/api/profile", payload);
    return unwrap(response);
};

/**
 * Upload/replace the current user's profile photo.
 * @param {File} file - JPG/PNG/WEBP image, max 5 MB
 * @param {Function} onUploadProgress - optional progress callback
 * @returns {Promise<Object>} { success, message, profile }
 */
export const uploadPhoto = async (file, onUploadProgress) => {
    const formData = new FormData();
    formData.append("photo", file);
    const response = await api.patch("/api/profile/photo", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress
    });
    return unwrap(response);
};

/**
 * Delete the current user's profile photo.
 * @returns {Promise<Object>} { success, message, profile }
 */
export const deletePhoto = async () => {
    const response = await api.delete("/api/profile/photo");
    return unwrap(response);
};

/**
 * Permanently delete the user's account and all associated data.
 * @returns {Promise<Object>} { success, message }
 */
export const deleteAccount = async () => {
    const response = await api.delete("/api/profile/delete");
    return unwrap(response);
};

/**
 * Complete profile during the signup flow (legacy endpoint).
 * @param {Object} payload - { email, college, degree, year, careerGoal, skills, profileImage }
 * @returns {Promise<Object>} { success, message, profile }
 */
export const completeProfile = async (payload) => {
    const response = await api.post("/api/profile/complete", payload);
    return unwrap(response);
};

