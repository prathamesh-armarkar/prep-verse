import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/Dashboard/DashboardLayout";
import { PageHeader } from "../../components/Common/ReusableComponents";
import ProfileCard from "../../components/Profile/ProfileCard";
import Modal from "../../components/Common/Modal";
import Button from "../../components/Common/Button";
import Toast from "../../components/Common/Toast";
import {
    FaBriefcase,
    FaEnvelope,
    FaGithub,
    FaGraduationCap,
    FaLink,
    FaLinkedin,
    FaMapMarkerAlt,
    FaPhoneAlt,
    FaSignOutAlt,
    FaSpinner,
    FaTrash,
    FaUserGraduate,
    FaCalendarAlt,
    FaBook,
    FaStar
} from "react-icons/fa";
import { getProfile, deleteAccount } from "../../services/profileService";
import { useAuth } from "../../hooks/useAuth";
import "./Profile.css";

function Profile() {
    const navigate = useNavigate();
    const { logout, updateUser } = useAuth();

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteText, setDeleteText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const [toast, setToast] = useState(null);

    const loadProfile = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const response = await getProfile();
            if (response?.success) {
                setProfile(response.profile);
                // Sync user info in AuthContext
                updateUser({
                    first_name: response.profile.first_name,
                    last_name: response.profile.last_name,
                    profile_completed: response.profile.profile_completed
                });
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
    }, [logout, navigate, updateUser]);

    useEffect(() => {
        loadProfile();
    }, [loadProfile]);

    const handlePhotoChange = (updatedProfile) => {
        setProfile(updatedProfile);
        setToast({ message: "Profile photo updated.", type: "success" });
    };

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const handleDeleteAccount = async () => {
        if (deleteText !== "DELETE") return;
        setIsDeleting(true);
        try {
            const response = await deleteAccount();
            if (response?.success) {
                setDeleteModalOpen(false);
                setToast({ message: "Your account has been deleted.", type: "success" });
                setTimeout(() => {
                    logout();
                    navigate("/");
                }, 1200);
            } else {
                setToast({ message: response?.message || "Account could not be deleted.", type: "error" });
            }
        } catch (err) {
            const status = err.response?.status;
            const message = err.response?.data?.message || err.message || "Account could not be deleted.";
            if (status === 401) {
                logout();
                navigate("/");
                return;
            }
            setToast({ message, type: "error" });
        } finally {
            setIsDeleting(false);
        }
    };

    const completion = profile?.completion || { percentage: 0, completed_sections: 0, total_sections: 10 };
    const completedSections = completion.completed_sections ?? 0;
    const totalSections = completion.total_sections ?? 10;

    const formatDate = (value) => {
        if (!value) return "—";
        try {
            return new Date(value).toLocaleDateString(undefined, {
                year: "numeric", month: "short", day: "numeric"
            });
        } catch {
            return value;
        }
    };

    const infoRows = [
        { icon: <FaGraduationCap />, label: "College", value: profile?.college },
        { icon: <FaBook />, label: "Degree", value: profile?.degree },
        { icon: <FaUserGraduate />, label: "Specialization", value: profile?.specialization },
        { icon: <FaCalendarAlt />, label: "Graduation Year", value: profile?.graduation_year },
        { icon: <FaMapMarkerAlt />, label: "City", value: profile?.city },
        { icon: <FaMapMarkerAlt />, label: "State", value: profile?.state },
        { icon: <FaPhoneAlt />, label: "Phone", value: profile?.phone },
        { icon: <FaEnvelope />, label: "Email", value: profile?.email }
    ];

    const socialLinks = [
        { icon: <FaLinkedin />, label: "LinkedIn", url: profile?.linkedin_url, color: "#0a66c2" },
        { icon: <FaGithub />, label: "GitHub", url: profile?.github_url, color: "#181717" },
        { icon: <FaLink />, label: "Portfolio", url: profile?.portfolio_url, color: "#2563eb" }
    ].filter((link) => link.url);

    return (
        <DashboardLayout>
            <div className="profile-page">
                <PageHeader
                    eyebrow="Profile"
                    title="Present a polished professional identity"
                    subtitle="Your complete profile, sourced from your account data."
                    action={
                        <div className="profile-page-actions">
                            <button type="button" className="profile-logout-btn" onClick={handleLogout}>
                                <FaSignOutAlt /> Logout
                            </button>
                            <button type="button" className="profile-edit-btn" onClick={() => navigate("/profile/edit")}>
                                Edit Profile
                            </button>
                        </div>
                    }
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
                        <Button variant="secondary" onClick={loadProfile}>Retry</Button>
                    </div>
                ) : profile ? (
                    <>
                        <ProfileCard profile={profile} onPhotoChange={handlePhotoChange} />

                        {/* Completion bar */}
                        <section className="profile-completion-card">
                            <div className="profile-completion-header">
                                <div>
                                    <h3>Profile Completion</h3>
                                    <p>
                                        {completedSections} of {totalSections} sections completed
                                    </p>
                                </div>
                                <span className="profile-completion-percent">{completion.percentage}%</span>
                            </div>
                            <div className="profile-completion-bar">
                                <div
                                    className="profile-completion-fill"
                                    style={{ width: `${completion.percentage}%` }}
                                />
                            </div>
                            <div className="profile-completion-sections">
                                {completion.sections?.map((section) => (
                                    <span
                                        key={section.key}
                                        className={`profile-completion-chip${section.completed ? " done" : ""}`}
                                    >
                                        {section.completed ? "✓" : "○"} {section.label}
                                    </span>
                                ))}
                            </div>
                        </section>

                        {/* Details grid */}
                        <section className="profile-grid two-column">
                            <article className="profile-card">
                                <h3>Details</h3>
                                <div className="profile-info-list">
                                    {infoRows.map((row) => (
                                        <div className="profile-info-row" key={row.label}>
                                            <span className="profile-info-icon">{row.icon}</span>
                                            <div>
                                                <small>{row.label}</small>
                                                <p>{row.value || "—"}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </article>

                            <div className="profile-side-column">
                                {profile.skills?.length > 0 && (
                                    <article className="profile-card">
                                        <h3>Skills</h3>
                                        <div className="profile-meta-list">
                                            {profile.skills.map((skill) => (
                                                <span key={skill}>{skill}</span>
                                            ))}
                                        </div>
                                    </article>
                                )}

                                {profile.interests?.length > 0 && (
                                    <article className="profile-card">
                                        <h3>Interests</h3>
                                        <div className="profile-meta-list alt">
                                            {profile.interests.map((interest) => (
                                                <span key={interest}>{interest}</span>
                                            ))}
                                        </div>
                                    </article>
                                )}

                                {socialLinks.length > 0 && (
                                    <article className="profile-card">
                                        <h3>Connect</h3>
                                        <div className="profile-social-links">
                                            {socialLinks.map((link) => (
                                                <a
                                                    key={link.label}
                                                    href={link.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="profile-social-link"
                                                >
                                                    <span style={{ color: link.color }}>{link.icon}</span>
                                                    {link.label}
                                                </a>
                                            ))}
                                        </div>
                                    </article>
                                )}
                            </div>
                        </section>

                        {/* Education card */}
                        <section className="profile-grid">
                            <article className="profile-card">
                                <h3>Education</h3>
                                <div className="profile-education">
                                    <div className="profile-education-icon">
                                        <FaGraduationCap />
                                    </div>
                                    <div>
                                        <h4>{profile.degree || "Degree not added"}</h4>
                                        <p>{profile.college || "College not added"}</p>
                                        {profile.specialization && (
                                            <span className="profile-education-meta">{profile.specialization}</span>
                                        )}
                                        {profile.graduation_year && (
                                            <span className="profile-education-meta">
                                                Class of {profile.graduation_year}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </article>
                        </section>

                        {/* Account actions */}
                        <section className="profile-account-zone">
                            <div>
                                <h3>Account</h3>
                                <p>Last updated {formatDate(profile.updated_at)}</p>
                            </div>
                            <div className="profile-account-actions">
                                <Button variant="outline" onClick={handleLogout}>
                                    <FaSignOutAlt /> Logout
                                </Button>
                                <Button variant="danger" onClick={() => setDeleteModalOpen(true)}>
                                    <FaTrash /> Delete Account
                                </Button>
                            </div>
                        </section>
                    </>
                ) : null}

                {/* Delete account confirmation modal */}
                <Modal
                    isOpen={deleteModalOpen}
                    onClose={() => {
                        setDeleteModalOpen(false);
                        setDeleteText("");
                    }}
                    title="Delete Account"
                    size="sm"
                >
                    <div className="delete-account-modal">
                        <div className="delete-account-icon">
                            <FaTrash />
                        </div>
                        <h3>Are you absolutely sure?</h3>
                        <p>
                            This will permanently delete your account, profile, resumes, roadmaps,
                            chat history, and uploaded files. This action cannot be undone.
                        </p>
                        <label className="pv-field">
                            <span className="pv-field-label">
                                Type <strong>DELETE</strong> to confirm
                            </span>
                            <input
                                type="text"
                                className="pv-input"
                                value={deleteText}
                                onChange={(event) => setDeleteText(event.target.value)}
                                placeholder="DELETE"
                            />
                        </label>
                        <div className="delete-account-actions">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setDeleteModalOpen(false);
                                    setDeleteText("");
                                }}
                                disabled={isDeleting}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="danger"
                                onClick={handleDeleteAccount}
                                disabled={deleteText !== "DELETE"}
                                loading={isDeleting}
                            >
                                {isDeleting ? "Deleting..." : "Delete My Account"}
                            </Button>
                        </div>
                    </div>
                </Modal>
            </div>
        </DashboardLayout>
    );
}

export default Profile;

