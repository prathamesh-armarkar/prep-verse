import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/Dashboard/DashboardLayout";
import { PageHeader } from "../../components/Common/ReusableComponents";
import ProfilePhoto from "../../components/Profile/ProfilePhoto";
import EditProfileForm from "../../components/Profile/EditProfileForm";
import Toast from "../../components/Common/Toast";
import { FaArrowLeft, FaSpinner } from "react-icons/fa";
import { getProfile, updateProfile } from "../../services/profileService";
import { useAuth } from "../../hooks/useAuth";
import "./EditProfile.css";

function EditProfile() {
    const navigate = useNavigate();
    const { logout, updateUser } = useAuth();

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [toast, setToast] = useState(null);

    const loadProfile = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const response = await getProfile();
            if (response?.success) {
                setProfile(response.profile);
            } else {
                setError(response?.message || "Profile could not be loaded.");
            }
        } catch (err) {
            const status = err.response?.status;
            const message = err.response?.data?.message || err.message || "Profile could not be loaded.";
            if (status === 401) {
                logout();
                navigate("/");
                return;
            }
            setError(message);
        } finally {
            setLoading(false);
        }
    }, [logout, navigate]);

    useEffect(() => {
        loadProfile();
    }, [loadProfile]);

    const handleSave = async (formData) => {
        setSaving(true);
        setError("");
        try {
            const response = await updateProfile(formData);
            if (response?.success) {
                setProfile(response.profile);
                updateUser({
                    first_name: response.profile.first_name,
                    last_name: response.profile.last_name,
                    profile_completed: response.profile.profile_completed
                });
                setToast({ message: "Profile saved successfully.", type: "success" });
            } else {
                setToast({ message: response?.message || "Profile could not be saved.", type: "error" });
            }
        } catch (err) {
            const status = err.response?.status;
            const message = err.response?.data?.message || err.message || "Profile could not be saved.";
            if (status === 401) {
                logout();
                navigate("/");
                return;
            }
            setToast({ message, type: "error" });
        } finally {
            setSaving(false);
        }
    };

    const handlePhotoChange = (updatedProfile) => {
        setProfile(updatedProfile);
        setToast({ message: "Profile photo updated.", type: "success" });
    };

    return (
        <DashboardLayout>
            <div className="edit-profile-page">
                <button type="button" className="edit-profile-back" onClick={() => navigate("/profile")}>
                    <FaArrowLeft /> Back to Profile
                </button>

                <PageHeader
                    eyebrow="Edit Profile"
                    title="Update your professional details"
                    subtitle="Keep your profile complete and up to date."
                />

                {toast && (
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={() => setToast(null)}
                    />
                )}

                {loading ? (
                    <div className="profile-loading">
                        <FaSpinner className="profile-spinner" />
                        <p>Loading your profile...</p>
                    </div>
                ) : error ? (
                    <div className="profile-error">
                        <span>{error}</span>
                        <button type="button" onClick={loadProfile}>Retry</button>
                    </div>
                ) : profile ? (
                    <div className="edit-profile-layout">
                        <div className="edit-profile-photo-card">
                            <h3>Profile Photo</h3>
                            <ProfilePhoto photo={profile.profile_photo} onPhotoChange={handlePhotoChange} />
                        </div>

                        <div className="edit-profile-form-card">
                            <EditProfileForm profile={profile} onSave={handleSave} isSaving={saving} />
                        </div>
                    </div>
                ) : null}
            </div>
        </DashboardLayout>
    );
}

export default EditProfile;

