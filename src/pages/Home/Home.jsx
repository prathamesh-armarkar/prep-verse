import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../../components/Layout/Navbar";
import Footer from "../../components/Layout/Footer";

import Hero from "../../components/Home/Hero";
import Features from "../../components/Home/Features";
import HowItWorks from "../../components/Home/HowItWorks";
import CTA from "../../components/Home/CTA";

import AuthModal from "../../components/Auth/AuthModal";
import LoginForm from "../../components/Auth/LoginForm";
import RegistrationForm from "../../components/Auth/RegistrationForm";
import ForgotPassword from "../../components/Auth/ForgotPassword";
import OTPVerification from "../../components/Auth/OTPVerification";
import CompleteProfile from "../../components/Auth/CompleteProfile";

import { useAuth } from "../../hooks/useAuth";

function Home() {

    const [showAuth, setShowAuth] = useState(false);
    const [authMode, setAuthMode] = useState("login");
    const [registeredEmail, setRegisteredEmail] = useState("");

    const navigate = useNavigate();
    const { login, updateProfileComplete } = useAuth();

    const openAuth = (mode = "login") => {
        setAuthMode(mode);
        setShowAuth(true);
    };

    const closeAuth = () => {
        setShowAuth(false);
        setAuthMode("login");
    };

    const handleRegisterSuccess = (formData) => {
        setRegisteredEmail(formData.email || "");
        setAuthMode("otp");
    };

    const handleOtpSuccess = () => {
        setAuthMode("complete-profile");
    };

    const handleLoginSuccess = (response) => {
        // Save auth state from login response
        login(response);

        // Check if profile is completed
        if (response?.user?.profile_completed) {
            // Profile already completed → go directly to dashboard
            setShowAuth(false);
            navigate("/dashboard");
        } else {
            // Profile not completed → show complete profile form
            setRegisteredEmail(response?.user?.email || "");
            setAuthMode("complete-profile");
        }
    };

    const handleProfileComplete = () => {
        // Mark profile as completed in auth context
        updateProfileComplete();
        setShowAuth(false);
        navigate("/dashboard");
    };

    return (
        <>

            <Navbar openAuth={openAuth} />

            <Hero openAuth={openAuth} />

            <Features />

            <HowItWorks />

            <CTA openAuth={() => openAuth("register")} />

            <Footer />

            <AuthModal
                isOpen={showAuth}
                onClose={closeAuth}
            >

                {authMode === "login" && (

                    <LoginForm
                        switchToRegister={() => setAuthMode("register")}
                        switchToForgot={() => setAuthMode("forgot")}
                        onLoginSuccess={handleLoginSuccess}
                        initialEmail={registeredEmail}
                    />

                )}

                {authMode === "register" && (

                    <RegistrationForm
                        switchToLogin={() => setAuthMode("login")}
                        onRegisterSuccess={handleRegisterSuccess}
                    />

                )}

                {authMode === "otp" && (

                    <OTPVerification
                        email={registeredEmail}
                        onVerify={handleOtpSuccess}
                        onBackToLogin={() => setAuthMode("login")}
                    />

                )}

                {authMode === "forgot" && (

                    <ForgotPassword
                        switchToLogin={() => setAuthMode("login")}
                    />

                )}

                {authMode === "complete-profile" && (

                    <CompleteProfile
                        email={registeredEmail}
                        onComplete={handleProfileComplete}
                        onSkip={handleProfileComplete}
                    />

                )}

            </AuthModal>

        </>
    );
}

export default Home;
