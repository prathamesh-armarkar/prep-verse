import { FaBriefcase, FaEnvelope, FaMapMarkerAlt, FaPhoneAlt, FaUserCircle } from "react-icons/fa";
import ProfilePhoto from "./ProfilePhoto";
import "./ProfileCard.css";

function ProfileCard({ profile, onPhotoChange }) {
    const location = [profile.city, profile.state].filter(Boolean).join(", ");

    return (
        <article className="profile-header-card">
            <div className="profile-header-left">
                <ProfilePhoto photo={profile.profile_photo} onPhotoChange={onPhotoChange} />
            </div>

            <div className="profile-header-info">
                <h2 className="profile-header-name">{profile.full_name || "Your Name"}</h2>

                {profile.target_role && (
                    <p className="profile-header-role">
                        <FaBriefcase />
                        {profile.target_role}
                    </p>
                )}

                <div className="profile-header-meta">
                    <span title={profile.email}>
                        <FaEnvelope />
                        {profile.email}
                    </span>
                    {profile.phone && (
                        <span title={profile.phone}>
                            <FaPhoneAlt />
                            {profile.phone}
                        </span>
                    )}
                    {location && (
                        <span title={location}>
                            <FaMapMarkerAlt />
                            {location}
                        </span>
                    )}
                </div>

                {profile.bio && <p className="profile-header-bio">{profile.bio}</p>}
            </div>

            {!profile.profile_photo && (
                <div className="profile-header-placeholder">
                    <FaUserCircle />
                </div>
            )}
        </article>
    );
}

export default ProfileCard;

