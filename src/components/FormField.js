function FormField({ label, htmlFor, error, hint, children }) {
  return (
    <div className={error ? "form-field has-error" : "form-field"}>
      {label && <label htmlFor={htmlFor}>{label}</label>}
      {children}
      {hint && !error && <p className="field-hint">{hint}</p>}
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}

export default FormField;