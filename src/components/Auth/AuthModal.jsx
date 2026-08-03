import "./Auth.css";
import logo from "../../assets/logo/logo.svg";

function AuthModal({
    isOpen,
    onClose,
    children,
    title = "PrepVerse AI"
}) {

    if (!isOpen) return null;

    return (

        <div
            className="auth-overlay"
            onClick={onClose}
        >

            <div
                className="auth-modal"
                onClick={(e) => e.stopPropagation()}
            >

                <button
                    className="close-btn"
                    onClick={onClose}
                >
                    ✕
                </button>

                <div className="auth-logo">

    <img
        src={logo}
        alt="PrepVerse AI"
        className="auth-logo-image"
    />

    <p>
        AI Powered Career Assistance Platform
    </p>

</div>

                {children}

            </div>

        </div>

    );

}

export default AuthModal;