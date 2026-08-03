import { useRef, useState } from "react";
import { FaCamera, FaSpinner, FaTrash, FaUserCircle } from "react-icons/fa";
import { uploadPhoto, deletePhoto } from "../../services/profileService";
import "./ProfilePhoto.css";

function ProfilePhoto({ photo, onPhotoChange }) {
    const fileInputRef = useRef(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState("");

    const handleFileChange = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setError("");

        // Client-side validation (backend validates again)
        const allowed = ["image/jpeg", "image/png", "image/webp"];
        if (!allowed.includes(file.type)) {
            setError("Only JPG, PNG or WEBP images are allowed.");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setError("Profile photo must not exceed 5 MB.");
            return;
        }

        setIsUploading(true);
        try {
            const response = await uploadPhoto(file);
            if (response?.success && onPhotoChange) {
                onPhotoChange(response.profile);
            } else {
                setError(response?.message || "Photo could not be uploaded.");
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Photo could not be uploaded.");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const handleDelete = async () => {
        setError("");
        setIsDeleting(true);
        try {
            const response = await deletePhoto();
            if (response?.success && onPhotoChange) {
                onPhotoChange(response.profile);
            } else {
                setError(response?.message || "Photo could not be removed.");
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Photo could not be removed.");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="profile-photo-widget">
            <div className="profile-photo-avatar">
                {photo ? (
                    <img
                        src={photo.startsWith("http") ? photo : `https://prep-verse-b.onrender.com${photo}`}
                        alt="Profile"
                    />
                ) : (
                    <FaUserCircle />
                )}
                {isUploading && (
                    <div className="profile-photo-overlay">
                        <FaSpinner className="profile-photo-spinner" />
                    </div>
                )}
            </div>

            <div className="profile-photo-actions">
                <button
                    type="button"
                    className="profile-photo-btn"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading || isDeleting}
                >
                    <FaCamera />
                    {photo ? "Replace Photo" : "Upload Photo"}
                </button>

                {photo && (
                    <button
                        type="button"
                        className="profile-photo-btn danger"
                        onClick={handleDelete}
                        disabled={isUploading || isDeleting}
                    >
                        <FaTrash />
                        {isDeleting ? "Removing..." : "Remove"}
                    </button>
                )}

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                />
            </div>

            {error && <p className="profile-photo-error">{error}</p>}
            <p className="profile-photo-hint">JPG, PNG or WEBP · Max 5 MB</p>
        </div>
    );
}

export default ProfilePhoto;

