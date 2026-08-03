import "./Button.css";

function Button({
    children,
    type = "button",
    variant = "primary",
    size = "md",
    loading = false,
    disabled,
    onClick,
    className = "",
    ...rest
}) {
    const classes = [
        "pv-btn",
        `pv-btn-${variant}`,
        `pv-btn-${size}`,
        loading ? "is-loading" : "",
        className
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <button
            type={type}
            className={classes}
            onClick={onClick}
            disabled={disabled || loading}
            {...rest}
        >
            {loading ? <span className="pv-btn-spinner" aria-hidden="true" /> : null}
            <span className="pv-btn-content">{children}</span>
        </button>
    );
}

export default Button;

