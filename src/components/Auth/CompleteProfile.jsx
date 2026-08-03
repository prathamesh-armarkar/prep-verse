import { useMemo, useState } from "react";
import logo from "../../assets/logo/logo.svg";
import { completeProfile } from "../../services/profileService";
import "./CompleteProfile.css";

function CompleteProfile({ onComplete, onSkip, email = "" }) {
    const [formData, setFormData] = useState({
        college: "",
        degree: "",
        year: "",
        careerGoal: "",
        skills: [],
        profileImage: ""
    });

    const [skillInput, setSkillInput] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isFormValid = useMemo(() => {
        return Boolean(
            formData.college.trim() &&
            formData.degree.trim() &&
            formData.year.trim() &&
            formData.careerGoal.trim()
        );
    }, [formData]);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));
        setErrorMessage("");
    };

    const handleSkillKeyDown = (event) => {
        if (event.key === "Enter" || event.key === ",") {
            event.preventDefault();
            const trimmedSkill = skillInput.trim();

            if (trimmedSkill && !formData.skills.includes(trimmedSkill)) {
                setFormData((previous) => ({
                    ...previous,
                    skills: [...previous.skills, trimmedSkill]
                }));
            }

            setSkillInput("");
        }
    };

    const removeSkill = (skillToRemove) => {
        setFormData((previous) => ({
            ...previous,
            skills: previous.skills.filter((skill) => skill !== skillToRemove)
        }));
    };

    const handleImageUpload = (event) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData((previous) => ({
                ...previous,
                profileImage: reader.result
            }));
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!isFormValid) {
            setErrorMessage("Please complete all required fields.");
            return;
        }

        setIsSubmitting(true);
        setErrorMessage("");

        try {
            const payload = {
                email,
                college: formData.college.trim(),
                degree: formData.degree,
                year: formData.year,
                careerGoal: formData.careerGoal,
                skills: formData.skills,
                profileImage: formData.profileImage
            };

            const response = await completeProfile(payload);

            if (response?.success && onComplete) {
                onComplete(payload);
            } else {
                setErrorMessage(response?.message || "Profile could not be saved.");
            }
        } catch (error) {
            setErrorMessage(error?.response?.data?.message || "Profile could not be saved.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="complete-profile">
            <div className="complete-profile-card">
                <div className="complete-profile-header">
                    <img src={logo} alt="PrepVerse AI" className="complete-profile-logo" />
                    <h3 className="complete-profile-title">Complete Your Profile</h3>
                    <p className="complete-profile-subtitle">
                        Let&apos;s personalize your PrepVerse AI experience.
                    </p>
                </div>

                <form className="complete-profile-form" onSubmit={handleSubmit}>
                    <div className="complete-profile-row">
                        <div className="complete-profile-group">
                            <label htmlFor="college">College / University</label>
                            <input
                                id="college"
                                name="college"
                                type="text"
                                className="complete-profile-input"
                                placeholder="Enter your college or university"
                                value={formData.college}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="complete-profile-group">
                            <label htmlFor="degree">Degree</label>
                            <select
                                id="degree"
                                name="degree"
                                className="complete-profile-select"
                                value={formData.degree}
                                onChange={handleChange}
                            >
                                <option value="">Select degree</option>
                                <option value="B.Tech">B.Tech</option>
                                <option value="BCA">BCA</option>
                                <option value="BSc Computer Science">BSc Computer Science</option>
                                <option value="BSc IT">BSc IT</option>
                                <option value="MCA">MCA</option>
                                <option value="M.Tech">M.Tech</option>
                                <option value="Diploma">Diploma</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>

                    <div className="complete-profile-row">
                        <div className="complete-profile-group">
                            <label htmlFor="year">Current Year</label>
                            <select
                                id="year"
                                name="year"
                                className="complete-profile-select"
                                value={formData.year}
                                onChange={handleChange}
                            >
                                <option value="">Select current year</option>
                                <option value="First Year">First Year</option>
                                <option value="Second Year">Second Year</option>
                                <option value="Third Year">Third Year</option>
                                <option value="Final Year">Final Year</option>
                                <option value="Graduate">Graduate</option>
                            </select>
                        </div>

                        <div className="complete-profile-group">
                            <label htmlFor="careerGoal">Career Goal</label>
                            <select
                                id="careerGoal"
                                name="careerGoal"
                                className="complete-profile-select"
                                value={formData.careerGoal}
                                onChange={handleChange}
                            >
                                <option value="">Select career goal</option>
                                <option value="Software Developer">Software Developer</option>
                                <option value="Full Stack Developer">Full Stack Developer</option>
                                <option value="AI/ML Engineer">AI/ML Engineer</option>
                                <option value="Data Scientist">Data Scientist</option>
                                <option value="Data Analyst">Data Analyst</option>
                                <option value="Backend Developer">Backend Developer</option>
                                <option value="Frontend Developer">Frontend Developer</option>
                                <option value="DevOps Engineer">DevOps Engineer</option>
                                <option value="Cloud Engineer">Cloud Engineer</option>
                                <option value="Cyber Security">Cyber Security</option>
                                <option value="UI/UX Designer">UI/UX Designer</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>

                    <div className="complete-profile-group">
                        <label htmlFor="skills">Skills (Optional)</label>
                        <input
                            id="skills"
                            type="text"
                            className="complete-profile-input"
                            placeholder="Type a skill and press Enter"
                            value={skillInput}
                            onChange={(event) => setSkillInput(event.target.value)}
                            onKeyDown={handleSkillKeyDown}
                        />

                        {formData.skills.length > 0 && (
                            <div className="skill-chip-list">
                                {formData.skills.map((skill) => (
                                    <span className="skill-chip" key={skill}>
                                        {skill}
                                        <button type="button" onClick={() => removeSkill(skill)}>
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="profile-photo-section">
                        <div className="photo-preview">
                            {formData.profileImage ? (
                                <img src={formData.profileImage} alt="Preview" />
                            ) : (
                                <span>Photo</span>
                            )}
                        </div>

                        <div className="profile-photo-actions">
                            <label className="photo-btn" htmlFor="profileImage">
                                Upload Photo
                            </label>
                            <input
                                id="profileImage"
                                type="file"
                                accept="image/*"
                                style={{ display: "none" }}
                                onChange={handleImageUpload}
                            />
                            <p className="profile-photo-hint">Optional · JPG or PNG</p>
                        </div>
                    </div>

                    {errorMessage && <p className="complete-profile-error">{errorMessage}</p>}

                    <button type="submit" className="submit-btn" disabled={!isFormValid || isSubmitting}>
                        {isSubmitting ? "Saving..." : "Save & Continue"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default CompleteProfile;
