import { useEffect, useRef, useState } from "react";
import logo from "../../assets/logo/logo.svg";
import { verifyOtp, resendOtp } from "../../services/authService";
import "./OTPVerification.css";

function OTPVerification({
    email = "your email",
    onVerify,
    onResend,
    onBackToLogin
}) {
    const [otp, setOtp] = useState(Array(6).fill(""));
    const [activeIndex, setActiveIndex] = useState(0);
    const [errorMessage, setErrorMessage] = useState("");
    const [resendTimer, setResendTimer] = useState(30);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const inputRefs = useRef([]);

    useEffect(() => {
        if (resendTimer === 0) {
            return undefined;
        }

        const timer = window.setInterval(() => {
            setResendTimer((previous) => previous - 1);
        }, 1000);

        return () => window.clearInterval(timer);
    }, [resendTimer]);

    useEffect(() => {
        inputRefs.current[activeIndex]?.focus();
    }, [activeIndex]);

    const handleChange = (index, value) => {
        if (!/^\d*$/.test(value)) {
            return;
        }

        const nextOtp = [...otp];
        nextOtp[index] = value.slice(-1);
        setOtp(nextOtp);
        setErrorMessage("");

        if (value && index < otp.length - 1) {
            setActiveIndex(index + 1);
        }
    };

    const handleKeyDown = (index, event) => {
        if (event.key === "Backspace") {
            event.preventDefault();

            const nextOtp = [...otp];

            if (nextOtp[index]) {
                nextOtp[index] = "";
            } else if (index > 0) {
                nextOtp[index - 1] = "";
                setActiveIndex(index - 1);
            }

            setOtp(nextOtp);
            setErrorMessage("");
        }

        if (event.key === "ArrowLeft" && index > 0) {
            setActiveIndex(index - 1);
        }

        if (event.key === "ArrowRight" && index < otp.length - 1) {
            setActiveIndex(index + 1);
        }
    };

    const handlePaste = (event) => {
        event.preventDefault();
        const pastedValue = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);

        if (!pastedValue) {
            return;
        }

        const nextOtp = Array(6).fill("");
        pastedValue.split("").forEach((digit, index) => {
            nextOtp[index] = digit;
        });

        setOtp(nextOtp);
        setActiveIndex(Math.min(pastedValue.length, 5));
        setErrorMessage("");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const code = otp.join("");

        if (code.length !== 6) {
            setErrorMessage("Please enter the full 6-digit code.");
            return;
        }

        if (!/^\d{6}$/.test(code)) {
            setErrorMessage("Only numeric digits are allowed.");
            return;
        }

        setIsSubmitting(true);
        setErrorMessage("");

        try {
            const response = await verifyOtp({ email, otp: code });

            if (response?.success && onVerify) {
                onVerify(code);
            } else {
                setErrorMessage(response?.message || "OTP verification failed.");
            }
        } catch (error) {
            setErrorMessage(error?.response?.data?.message || "OTP verification failed.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResend = async () => {
        setResendTimer(30);
        setOtp(Array(6).fill(""));
        setActiveIndex(0);
        setErrorMessage("");

        try {
            await resendOtp({ email });
        } catch (error) {
            setErrorMessage(error?.response?.data?.message || "Could not resend code.");
        }

        if (onResend) {
            onResend();
        }
    };

    return (
        <form className="otp-verification" onSubmit={handleSubmit}>
            <div className="otp-header">
                <img src={logo} alt="PrepVerse AI" className="otp-logo" />
                <h3 className="otp-title">Verify Your Email</h3>
                <p className="otp-subtitle">
                    We&apos;ve sent a verification code to your email.
                    <br />
                    <span className="otp-email">{email}</span>
                </p>
            </div>

            <div className="otp-inputs" onPaste={handlePaste}>
                {otp.map((digit, index) => (
                    <input
                        key={index}
                        ref={(element) => {
                            inputRefs.current[index] = element;
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        className={`otp-input ${activeIndex === index ? "active" : ""}`}
                        onChange={(event) => handleChange(index, event.target.value)}
                        onKeyDown={(event) => handleKeyDown(index, event)}
                        onFocus={() => setActiveIndex(index)}
                    />
                ))}
            </div>

            {errorMessage && <p className="otp-error">{errorMessage}</p>}

            <button type="submit" className="otp-button" disabled={isSubmitting}>
                {isSubmitting ? "Verifying..." : "Verify Email"}
            </button>

            <p className="otp-resend">
                {resendTimer > 0 ? (
                    <>
                        Resend code in {resendTimer}s
                    </>
                ) : (
                    <button type="button" onClick={handleResend}>
                        Resend Code
                    </button>
                )}
            </p>

            <div className="otp-footer">
                <button type="button" onClick={onBackToLogin}>
                    Back to Login
                </button>
            </div>
        </form>
    );
}

export default OTPVerification;
