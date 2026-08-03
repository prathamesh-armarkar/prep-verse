import { useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import "./Modal.css";

function Modal({ isOpen, onClose, title, children, size = "md" }) {
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (event) => {
            if (event.key === "Escape") onClose();
        };

        document.addEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "";
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="pv-modal-overlay" onClick={onClose}>
            <div
                className={`pv-modal pv-modal-${size}`}
                role="dialog"
                aria-modal="true"
                aria-label={title || "Modal"}
                onClick={(event) => event.stopPropagation()}
            >
                <div className="pv-modal-header">
                    {title ? <h3 className="pv-modal-title">{title}</h3> : <span />}
                    <button type="button" className="pv-modal-close" onClick={onClose} aria-label="Close">
                        <FaTimes />
                    </button>
                </div>
                <div className="pv-modal-body">{children}</div>
            </div>
        </div>
    );
}

export default Modal;

