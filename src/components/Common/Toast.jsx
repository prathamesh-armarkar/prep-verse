import { useEffect } from "react";
import { FaCheckCircle, FaExclamationTriangle, FaInfoCircle } from "react-icons/fa";
import "./Toast.css";

const ICONS = {
    success: FaCheckCircle,
    error: FaExclamationTriangle,
    info: FaInfoCircle
};

function Toast({ message, type = "success", onClose, duration = 4000 }) {
    useEffect(() => {
        if (!onClose) return;
        const timer = setTimeout(onClose, duration);
        return () => clearTimeout(timer);
    }, [onClose, duration]);

    if (!message) return null;

    const Icon = ICONS[type] || FaInfoCircle;

    return (
        <div className={`pv-toast pv-toast-${type}`} role="status">
            <Icon className="pv-toast-icon" />
            <p className="pv-toast-message">{message}</p>
            <button type="button" className="pv-toast-close" onClick={onClose} aria-label="Dismiss">
                ×
            </button>
        </div>
    );
}

export default Toast;

