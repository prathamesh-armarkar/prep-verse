import { useState } from "react";
import { loginUser } from "../../services/authService";
import "./LoginForm.css";

import {
    FaEnvelope,
    FaLock,
    FaEye,
    FaEyeSlash
} from "react-icons/fa";

function LoginForm({ switchToRegister, switchToForgot, onLoginSuccess, initialEmail = "" }) {

    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState(initialEmail);
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!email.trim()) {
            setErrorMessage("Email is required.");
            return;
        }

        if (!password) {
            setErrorMessage("Password is required.");
            return;
        }

        setErrorMessage("");
        setIsSubmitting(true);

        try {
            const response = await loginUser({ email: email.trim(), password });

            if (response?.success && onLoginSuccess) {
                onLoginSuccess(response);
            } else {
                setErrorMessage(response?.message || "Login failed.");
            }
        } catch (error) {
            setErrorMessage(error?.response?.data?.message || "Login failed. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (

        <form className="login-form" onSubmit={handleSubmit}>

            <div className="form-header">

                <h3>Welcome Back 👋</h3>

                <p>
                    Login to continue to PrepVerse AI
                </p>

            </div>

            {/* Email */}

            <div className="input-box">

                <FaEnvelope className="input-icon" />

                <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                />

            </div>

            {/* Password */}

            <div className="input-box">

                <FaLock className="input-icon" />

                <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                />

                <button
                    type="button"
                    className="eye-btn"
                    onClick={() =>
                        setShowPassword(!showPassword)
                    }
                >

                    {
                        showPassword
                            ? <FaEyeSlash />
                            : <FaEye />
                    }

                </button>

            </div>

            {/* Forgot Password */}

            <div className="forgot-link">

                <button
                    type="button"
                    onClick={switchToForgot}
                >
                    Forgot Password?
                </button>
 
            </div>

            {errorMessage && (
                <p className="form-error">{errorMessage}</p>
            )}

            {/* Login */}

            <button
                type="submit"
                className="login-button"
                disabled={isSubmitting}
            >
                {isSubmitting ? "Logging in..." : "Login"}
            </button>

            {/* Divider */}

            <div className="divider">

                <span>OR</span>

            </div>

            {/* Register */}

            <p className="bottom-text">

                Don't have an account?

                <button
                    type="button"
                    onClick={switchToRegister}
                >
                    Create Account
                </button>

            </p>

        </form>

    );

}

export default LoginForm;