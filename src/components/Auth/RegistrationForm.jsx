import { useState } from "react";
import { registerUser } from "../../services/authService";
import "./RegistrationForm.css";

import {
    FaUser,
    FaEnvelope,
    FaLock,
    FaEye,
    FaEyeSlash
} from "react-icons/fa";

function RegistrationForm({ switchToLogin, onRegisterSuccess }) {

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        agreed: false
    });
    const [errorMessage, setErrorMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim()) {
            setErrorMessage("Please complete the required fields.");
            return;
        }

        if (formData.password.length < 8) {
            setErrorMessage("Password must be at least 8 characters long.");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setErrorMessage("Passwords do not match.");
            return;
        }

        if (!formData.agreed) {
            setErrorMessage("Please accept the Terms and Privacy Policy.");
            return;
        }

        setErrorMessage("");
        setIsSubmitting(true);

        try {
            const payload = {
                first_name: formData.firstName.trim(),
                last_name: formData.lastName.trim(),
                email: formData.email.trim(),
                password: formData.password
            };

            const response = await registerUser(payload);

            if (response?.success && onRegisterSuccess) {
                onRegisterSuccess({ ...formData, email: formData.email.trim() });
            } else {
                setErrorMessage(response?.message || "Registration failed.");
            }
        } catch (error) {
            setErrorMessage(error?.response?.data?.message || "Registration failed. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (

        <form className="register-form" onSubmit={handleSubmit}>

            <div className="form-header">

                <h3>Create Your Account 🚀</h3>

                <p>
                    Join PrepVerse AI and start preparing for your career.
                </p>

            </div>

            {/* First & Last Name */}

            <div className="row g-3">

                <div className="col-md-6">

                    <div className="input-box">

                        <FaUser className="input-icon" />

                        <input
                            type="text"
                            name="firstName"
                            placeholder="First Name"
                            value={formData.firstName}
                            onChange={handleChange}
                        />

                    </div>

                </div>

                <div className="col-md-6">

                    <div className="input-box">

                        <FaUser className="input-icon" />

                        <input
                            type="text"
                            name="lastName"
                            placeholder="Last Name"
                            value={formData.lastName}
                            onChange={handleChange}
                        />

                    </div>

                </div>

            </div>

            {/* Email */}

            <div className="input-box">

                <FaEnvelope className="input-icon" />

                <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                />

            </div>

            {/* Password */}

            <div className="input-box">

                <FaLock className="input-icon" />

                <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                />

                <button
                    type="button"
                    className="eye-btn"
                    onClick={() => setShowPassword(!showPassword)}
                >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>

            </div>

            {/* Confirm Password */}

            <div className="input-box">

                <FaLock className="input-icon" />

                <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                />

                <button
                    type="button"
                    className="eye-btn"
                    onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                    }
                >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>

            </div>

            {errorMessage && (
                <p className="form-error">{errorMessage}</p>
            )}

            {/* Terms */}

            <div className="terms-box">

                <input
                    type="checkbox"
                    id="terms"
                    name="agreed"
                    checked={formData.agreed}
                    onChange={handleChange}
                />

                <label htmlFor="terms">

                    I agree to the
                    <span> Terms</span> &
                    <span> Privacy Policy</span>

                </label>

            </div>

            {/* Register */}

            <button
                type="submit"
                className="register-button"
                disabled={isSubmitting}
            >
                {isSubmitting ? "Creating Account..." : "Create Account"}
            </button>

            <div className="divider">

                <span>OR</span>

            </div>

            <p className="bottom-text">

                Already have an account?

                <button
                    type="button"
                    onClick={switchToLogin}
                >
                    Login
                </button>

            </p>

        </form>

    );

}

export default RegistrationForm;