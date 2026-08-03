import "./ReusableComponents.css";

function Input({
    label,
    id,
    name,
    type = "text",
    value,
    onChange,
    placeholder,
    required,
    disabled,
    error,
    hint,
    maxLength,
    ...rest
}) {
    return (
        <div className={`pv-field${error ? " has-error" : ""}`}>
            {label ? (
                <label htmlFor={id || name} className="pv-field-label">
                    {label}
                    {required ? <span className="pv-required"> *</span> : null}
                </label>
            ) : null}
            <input
                id={id || name}
                name={name}
                type={type}
                value={value ?? ""}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                disabled={disabled}
                maxLength={maxLength}
                className="pv-input"
                {...rest}
            />
            {hint && !error ? <p className="pv-field-hint">{hint}</p> : null}
            {error ? <p className="pv-field-error">{error}</p> : null}
        </div>
    );
}

export default Input;

