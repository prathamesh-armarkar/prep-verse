import { useState } from "react";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import "./RegistrationForm.css";

function ResetPassword({ switchToLogin }) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <form className="register-form">
            <div className="form-header">
                <h3>Reset Your Password 🔐</h3>
                <p>
                    Enter your email and choose a new password to continue.
                </p>
            </div>

            <div className="input-box">
                <FaEnvelope className="input-icon" />
                <input type="email" placeholder="Email Address" />
            </div>

            <div className="input-box">
                <FaLock className="input-icon" />
                <input type={showPassword ? "text" : "password"} placeholder="New Password" />
                <button
                    type="button"
                    className="eye-btn"
                    onClick={() => setShowPassword((previous) => !previous)}
                >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
            </div>

            <button type="submit" className="register-button">
                Update Password
            </button>

            <p className="bottom-text">
                <button type="button" onClick={switchToLogin}>
                    Back to Login
                </button>
            </p>
        </form>
    );
}

export default ResetPassword;
