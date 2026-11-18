import { useState } from "react";
import { getCCAById } from "../services/ccaService";
import { validateApplication } from "../utils/validation";
import FormField from "../components/FormField";
import { formatDate } from "../utils/dates";

const emptyForm = { phone: "", experience: "", reason: "", agree: false };

// onApply: function from App.js that saves the new application and gives it back
// existingApplication: the student's current application to this CCA, if any
function ApplyFormPage({ ccaId, navigate, onApply, existingApplication }) {
  const cca = getCCAById(ccaId);
  const [values, setValues] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [newApplication, setNewApplication] = useState(null);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setValues({ ...values, [name]: type === "checkbox" ? checked : value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: undefined });
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    const newErrors = validateApplication(values);
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      setNewApplication(onApply(cca, values));
    }
  }

  if (!cca) {
    return (
      <div className="page">
        <div className="no-results">
          <h3>Sorry, this CCA could not be found.</h3>
          <button className="btn btn-primary" onClick={() => navigate("directory")}>
            Back to CCAs
          </button>
        </div>
      </div>
    );
  }

  if (newApplication) {
    return (
      <div className="page success-box">
        <h2>✅ Application submitted!</h2>
        <p>
          Your application to <strong>{cca.name}</strong> has been received.
        </p>
        <p>
          Expect a reply by <strong>{formatDate(newApplication.expectedReplyBy)}</strong>.
        </p>
        <button
          className="btn btn-primary"
          onClick={() => navigate("applicationDetail", { applicationId: newApplication.id })}
        >
          Track this application
        </button>{" "}
        <button className="btn" onClick={() => navigate("directory")}>
          Browse more CCAs
        </button>
      </div>
    );
  }

  // Stop the student from applying twice to the same CCA
  if (existingApplication) {
    return (
      <div className="page success-box">
        <h2>You've already applied to {cca.name}</h2>
        <p>You can check its status and next step in My Applications.</p>
        <button
          className="btn btn-primary"
          onClick={() => navigate("applicationDetail", { applicationId: existingApplication.id })}
        >
          View my application
        </button>{" "}
        <button className="btn" onClick={() => navigate("directory")}>
          Browse other CCAs
        </button>
      </div>
    );
  }

  return (
    <div className="page">
      <button className="btn-link" onClick={() => navigate("ccaDetail", { ccaId })}>
        ← Back to {cca.name}
      </button>
      <h2>Apply to {cca.name}</h2>

      <form className="apply-form" onSubmit={handleSubmit} noValidate>
        <FormField
          label="Phone number"
          htmlFor="phone"
          error={errors.phone}
          hint="e.g. 91234567"
        >
          <input
            id="phone"
            name="phone"
            type="tel"
            value={values.phone}
            onChange={handleChange}
          />
        </FormField>

        <FormField label="Experience level" htmlFor="experience" error={errors.experience}>
          <select
            id="experience"
            name="experience"
            value={values.experience}
            onChange={handleChange}
          >
            <option value="">-- Select --</option>
            <option value="none">No experience</option>
            <option value="some">Some experience</option>
            <option value="experienced">Experienced</option>
          </select>
        </FormField>

        <FormField
          label="Why do you want to join?"
          htmlFor="reason"
          error={errors.reason}
          hint={`${values.reason.trim().length}/300 characters (min 20)`}
        >
          <textarea
            id="reason"
            name="reason"
            rows="4"
            value={values.reason}
            onChange={handleChange}
          />
        </FormField>

        <FormField htmlFor="agree" error={errors.agree}>
          <label className="checkbox-label">
            <input
              id="agree"
              name="agree"
              type="checkbox"
              checked={values.agree}
              onChange={handleChange}
            />
            I agree to attend the trial session if shortlisted.
          </label>
        </FormField>

        <button type="submit" className="btn btn-primary">
          Submit application
        </button>
      </form>
    </div>
  );
}

export default ApplyFormPage;