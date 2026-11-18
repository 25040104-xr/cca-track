import { useState } from "react";
import { getCCAById } from "../services/ccaService";
import { validateApplication } from "../utils/validation";
import { createApplication, findExistingApplication } from "../utils/createApplication";
import { CURRENT_STUDENT_ID } from "../data/currentUser";
import FormField from "../components/FormField";
import { formatDate } from "../utils/dates";

const emptyForm = { phone: "", experience: "", reason: "", agree: false };

function ApplyFormPage({ ccaId, applications, addApplication, navigate }) {
  const cca = getCCAById(ccaId);
  const [values, setValues] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [newApplication, setNewApplication] = useState(null);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setValues({ ...values, [name]: type === "checkbox" ? checked : value });
    // Clear this field's error once the user starts fixing it
    if (errors[name]) {
      setErrors({ ...errors, [name]: undefined });
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    const newErrors = validateApplication(values);
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      const application = createApplication(CURRENT_STUDENT_ID, cca, values);
      addApplication(application);
      setNewApplication(application);
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

  // Just submitted: show the success message
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
        <div className="success-actions">
          <button className="btn btn-primary" onClick={() => navigate("myApplications")}>
            View my applications
          </button>
          <button className="btn" onClick={() => navigate("directory")}>
            Browse more CCAs
          </button>
        </div>
      </div>
    );
  }

  // Already applied before: don't allow a second application
  const existing = findExistingApplication(applications, CURRENT_STUDENT_ID, cca.id);
  if (existing) {
    return (
      <div className="page">
        <div className="no-results">
          <h3>You've already applied to {cca.name}</h3>
          <p>You can check the status of your application instead.</p>
          <button
            className="btn btn-primary"
            onClick={() => navigate("applicationDetail", { applicationId: existing.id })}
          >
            View application status
          </button>
        </div>
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