import { useMemo, useState } from "react";
import Input from "../Common/Input";
import Button from "../Common/Button";

const PHONE_PATTERN = /^\+?[0-9\s\-()]{10,20}$/;
const URL_PATTERN = /^https?:\/\//i;
const YEAR_PATTERN = /^(19[5-9]\d|20[0-2]\d|2100)$/;
const CGPA_PATTERN = /^\d{1,2}(\.\d{1,2})?$/;

const DEGREES = ["B.Tech", "BCA", "BSc Computer Science", "BSc IT", "MCA", "M.Tech", "Diploma", "Other"];
const ROLES = [
    "Software Developer", "Full Stack Developer", "AI/ML Engineer", "Data Scientist",
    "Data Analyst", "Backend Developer", "Frontend Developer", "DevOps Engineer",
    "Cloud Engineer", "Cyber Security", "UI/UX Designer", "Other"
];
const GENDERS = ["Male", "Female", "Other", "Prefer not to say"];

function EditProfileForm({ profile, onSave, isSaving }) {
    const [formData, setFormData] = useState({
        first_name: profile?.first_name || "",
        last_name: profile?.last_name || "",
        phone: profile?.phone || "",
        college: profile?.college || "",
        degree: profile?.degree || "",
        specialization: profile?.specialization || "",
        graduation_year: profile?.graduation_year || "",
        current_semester: profile?.current_semester || "",
        cgpa: profile?.cgpa || "",
        city: profile?.city || "",
        state: profile?.state || "",
        bio: profile?.bio || "",
        target_role: profile?.target_role || "",
        linkedin_url: profile?.linkedin_url || "",
        github_url: profile?.github_url || "",
        portfolio_url: profile?.portfolio_url || "",
        gender: profile?.gender || "",
        date_of_birth: profile?.date_of_birth || "",
        skills: profile?.skills || [],
        interests: profile?.interests || []
    });

    const [skillInput, setSkillInput] = useState("");
    const [interestInput, setInterestInput] = useState("");
    const [errors, setErrors] = useState({});

    const validate = () => {
        const nextErrors = {};

        if (formData.phone && !PHONE_PATTERN.test(formData.phone)) {
            nextErrors.phone = "Enter a valid phone number (10-15 digits).";
        }
        if (formData.cgpa && !CGPA_PATTERN.test(formData.cgpa)) {
            nextErrors.cgpa = "CGPA must be between 0 and 10 (max 2 decimals).";
        } else if (formData.cgpa && (parseFloat(formData.cgpa) < 0 || parseFloat(formData.cgpa) > 10)) {
            nextErrors.cgpa = "CGPA must be between 0 and 10.";
        }
        if (formData.graduation_year && !YEAR_PATTERN.test(formData.graduation_year)) {
            nextErrors.graduation_year = "Enter a valid year (1950-2100).";
        }
        for (const field of ["linkedin_url", "github_url", "portfolio_url"]) {
            if (formData[field] && !URL_PATTERN.test(formData[field])) {
                nextErrors[field] = "Must start with http:// or https://";
            }
        }

        return nextErrors;
    };

    const isFormValid = useMemo(() => {
        return Object.keys(errors).length === 0;
    }, [errors]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((previous) => ({ ...previous, [name]: value }));
        setErrors((previous) => ({ ...previous, [name]: "" }));
    };

    const handleAddChip = (listKey, value, setter) => {
        const trimmed = value.trim();
        if (!trimmed) return;
        setFormData((previous) => {
            if (previous[listKey].includes(trimmed)) return previous;
            return { ...previous, [listKey]: [...previous[listKey], trimmed] };
        });
        setter("");
    };

    const handleRemoveChip = (listKey, item) => {
        setFormData((previous) => ({
            ...previous,
            [listKey]: previous[listKey].filter((value) => value !== item)
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const nextErrors = validate();
        setErrors(nextErrors);
        if (Object.keys(nextErrors).length > 0) return;
        onSave(formData);
    };

    return (
        <form className="edit-profile-form" onSubmit={handleSubmit} noValidate>
            <div className="edit-profile-grid">
                <div className="edit-profile-section">
                    <h3 className="edit-profile-section-title">Personal Details</h3>

                    <div className="edit-profile-row">
                        <Input label="First Name" name="first_name" value={formData.first_name}
                            onChange={handleChange} required error={errors.first_name} />
                        <Input label="Last Name" name="last_name" value={formData.last_name}
                            onChange={handleChange} required error={errors.last_name} />
                    </div>

                    <div className="edit-profile-row">
                        <Input label="Email" name="email" value={profile?.email || ""}
                            disabled hint="Email cannot be changed" />
                        <Input label="Phone" name="phone" type="tel" value={formData.phone}
                            onChange={handleChange} placeholder="+91 98765 43210"
                            error={errors.phone} />
                    </div>

                    <div className="edit-profile-row">
                        <Input label="City" name="city" value={formData.city} onChange={handleChange} />
                        <Input label="State" name="state" value={formData.state} onChange={handleChange} />
                    </div>

                    <div className="edit-profile-row">
                        <div className="pv-field">
                            <label className="pv-field-label" htmlFor="gender">Gender</label>
                            <select id="gender" name="gender" className="pv-select" value={formData.gender} onChange={handleChange}>
                                <option value="">Select gender</option>
                                {GENDERS.map((gender) => <option key={gender} value={gender}>{gender}</option>)}
                            </select>
                        </div>
                        <Input label="Date of Birth" name="date_of_birth" type="date" value={formData.date_of_birth} onChange={handleChange} />
                    </div>
                </div>

                <div className="edit-profile-section">
                    <h3 className="edit-profile-section-title">Education & Career</h3>

                    <div className="edit-profile-row">
                        <Input label="College / University" name="college" value={formData.college} onChange={handleChange} />
                        <div className="pv-field">
                            <label className="pv-field-label" htmlFor="degree">Degree</label>
                            <select id="degree" name="degree" className="pv-select" value={formData.degree} onChange={handleChange}>
                                <option value="">Select degree</option>
                                {DEGREES.map((degree) => <option key={degree} value={degree}>{degree}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="edit-profile-row">
                        <Input label="Specialization" name="specialization" value={formData.specialization}
                            onChange={handleChange} placeholder="e.g. Computer Science" />
                        <Input label="Graduation Year" name="graduation_year" value={formData.graduation_year}
                            onChange={handleChange} placeholder="e.g. 2026"
                            error={errors.graduation_year} />
                    </div>

                    <div className="edit-profile-row">
                        <Input label="Current Semester" name="current_semester" value={formData.current_semester}
                            onChange={handleChange} placeholder="e.g. 6th" />
                        <Input label="CGPA" name="cgpa" value={formData.cgpa}
                            onChange={handleChange} placeholder="e.g. 8.5"
                            error={errors.cgpa} />
                    </div>

                    <div className="edit-profile-row">
                        <div className="pv-field">
                            <label className="pv-field-label" htmlFor="target_role">Target Role</label>
                            <select id="target_role" name="target_role" className="pv-select" value={formData.target_role} onChange={handleChange}>
                                <option value="">Select target role</option>
                                {ROLES.map((role) => <option key={role} value={role}>{role}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="edit-profile-row">
                        <div className="pv-field">
                            <label className="pv-field-label" htmlFor="bio">Bio</label>
                            <textarea id="bio" name="bio" className="pv-textarea" value={formData.bio}
                                onChange={handleChange} placeholder="A short professional summary..." maxLength={500} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="edit-profile-section">
                <h3 className="edit-profile-section-title">Links</h3>
                <div className="edit-profile-row">
                    <Input label="LinkedIn URL" name="linkedin_url" value={formData.linkedin_url}
                        onChange={handleChange} placeholder="https://linkedin.com/in/..."
                        error={errors.linkedin_url} />
                    <Input label="GitHub URL" name="github_url" value={formData.github_url}
                        onChange={handleChange} placeholder="https://github.com/..."
                        error={errors.github_url} />
                </div>
                <div className="edit-profile-row">
                    <Input label="Portfolio URL" name="portfolio_url" value={formData.portfolio_url}
                        onChange={handleChange} placeholder="https://yourportfolio.com"
                        error={errors.portfolio_url} />
                </div>
            </div>

            <div className="edit-profile-section">
                <h3 className="edit-profile-section-title">Skills & Interests</h3>

                <div className="pv-field">
                    <label className="pv-field-label" htmlFor="skills-input">Skills</label>
                    <input
                        id="skills-input"
                        type="text"
                        className="pv-input"
                        placeholder="Type a skill and press Enter"
                        value={skillInput}
                        onChange={(event) => setSkillInput(event.target.value)}
                        onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === ",") {
                                event.preventDefault();
                                handleAddChip("skills", skillInput, setSkillInput);
                            }
                        }}
                    />
                </div>
                {formData.skills.length > 0 && (
                    <div className="edit-profile-chips">
                        {formData.skills.map((skill) => (
                            <span className="edit-profile-chip" key={skill}>
                                {skill}
                                <button type="button" onClick={() => handleRemoveChip("skills", skill)}>×</button>
                            </span>
                        ))}
                    </div>
                )}

                <div className="pv-field" style={{ marginTop: 12 }}>
                    <label className="pv-field-label" htmlFor="interests-input">Interests</label>
                    <input
                        id="interests-input"
                        type="text"
                        className="pv-input"
                        placeholder="Type an interest and press Enter"
                        value={interestInput}
                        onChange={(event) => setInterestInput(event.target.value)}
                        onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === ",") {
                                event.preventDefault();
                                handleAddChip("interests", interestInput, setInterestInput);
                            }
                        }}
                    />
                </div>
                {formData.interests.length > 0 && (
                    <div className="edit-profile-chips">
                        {formData.interests.map((interest) => (
                            <span className="edit-profile-chip alt" key={interest}>
                                {interest}
                                <button type="button" onClick={() => handleRemoveChip("interests", interest)}>×</button>
                            </span>
                        ))}
                    </div>
                )}
            </div>

            <div className="edit-profile-actions">
                <Button type="submit" variant="primary" loading={isSaving}>
                    {isSaving ? "Saving..." : "Save Changes"}
                </Button>
            </div>
        </form>
    );
}

export default EditProfileForm;

