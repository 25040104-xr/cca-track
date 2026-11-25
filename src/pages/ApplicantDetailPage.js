import { useState } from "react";
import StatusBadge from "../components/StatusBadge";
import StatusTimeline from "../components/StatusTimeline";
import ConfirmDialog from "../components/ConfirmDialog";
import FormField from "../components/FormField";
import { getStudentById } from "../data/students";
import { getCCAById } from "../services/ccaService";
import { isInProgress, isOverdue } from "../services/applicationService";
import { createNotification } from "../services/notificationService";
import { STATUS_LABELS } from "../utils/statuses";
import { formatDate, TODAY } from "../utils/dates";
import "../styles/myApplications.css";
import "../styles/exco.css";

const EXPERIENCE_LABELS = {
  none: "No experience",
  some: "Some experience",
  experienced: "Experienced",
};

// Statuses an exco can choose (excos cannot withdraw for the student)
const EXCO_STATUSES = ["applied", "trial-scheduled", "trial-done", "accepted", "not-selected"];

const emptyForm = { status: "", nextStep: "", expectedReplyBy: "" };

// Checks the status form. Returns an object of error messages (empty = no errors).
function validateStatusForm(values, currentStatus) {
  const errors = {};
  const stillWaiting = values.status === "applied" || values.status === "trial-scheduled" || values.status === "trial-done";

  if (!values.status) {
    errors.status = "Please choose a new status.";
  } else if (values.status === currentStatus) {
    errors.status = "This is already the current status.";
  }

  if (values.nextStep.trim().length < 10) {
    errors.nextStep = "Tell the student what happens next (at least 10 characters).";
  }

  if (stillWaiting) {
    if (!values.expectedReplyBy) {
      errors.expectedReplyBy = "Please give the student a date to expect a reply.";
    } else if (values.expectedReplyBy < TODAY) {
      errors.expectedReplyBy = "The reply date cannot be in the past.";
    }
  }
  return errors;
}

// Exco page: one applicant's details + update their status.
// applications, notifications and their setters come from App.js (state lives there)
function ApplicantDetailPage({ applicationId, applications, setApplications, notifications, setNotifications, navigate }) {
  const [values, setValues] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [confirming, setConfirming] = useState(false);
  const [message, setMessage] = useState("");

  const application = applications.filter((a) => a.id === applicationId)[0];

  if (!application) {
    return (
      <div className="page">
        <div className="no-results">
          <h3>Sorry, this applicant could not be found.</h3>
          <button className="btn btn-primary" onClick={() => navigate("applicants")}>
            Back to Applicants
          </button>
        </div>
      </div>
    );
  }

  const student = getStudentById(application.studentId);
  const cca = getCCAById(application.ccaId);
  const overdue = isOverdue(application);

  // One function for every field in the form
  function handleChange(event) {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });
    setErrors({ ...errors, [name]: "" }); // clear that field's error while typing
  }

  function handleSubmit(event) {
    event.preventDefault();
    const newErrors = validateStatusForm(values, application.status);
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      setConfirming(true); // open the "Are you sure?" dialog
    }
  }

  // Runs only after the exco clicks "Update" in the dialog
  function handleConfirm() {
    const stillWaiting = values.status === "applied" || values.status === "trial-scheduled" || values.status === "trial-done";

    // 1. Update the application (copy the array, change only this one)
    setApplications(
      applications.map((a) =>
        a.id === application.id
          ? {
              ...a,
              status: values.status,
              updatedAt: TODAY,
              nextStep: values.nextStep.trim(),
              expectedReplyBy: stillWaiting ? values.expectedReplyBy : null,
              history: [...a.history, { status: values.status, date: TODAY, note: values.nextStep.trim() }],
            }
          : a
      )
    );

    // 2. Notify the student automatically
    const newNotification = createNotification(
      notifications,
      application.studentId,
      application.id,
      "Update from " + cca.name + ": your application is now " + STATUS_LABELS[values.status] + ". " + values.nextStep.trim()
    );
    setNotifications([newNotification, ...notifications]);

    // 3. Reset the form and show a success message
    setConfirming(false);
    setValues(emptyForm);
    setMessage("Status updated to " + STATUS_LABELS[values.status] + ". " + (student ? student.name : "The student") + " has been notified.");
  }

  const showReplyDate = values.status === "applied" || values.status === "trial-scheduled" || values.status === "trial-done";

  return (
    <div className="page">
      <button className="btn-link" onClick={() => navigate("applicants")}>
        ← Back to Applicants
      </button>

      <div className="app-detail-header">
        <div>
          <p className="application-sub">{cca.name}</p>
          <h1>{student ? student.name : "Unknown student"}</h1>
          <StatusBadge status={application.status} />
        </div>
      </div>

      {message !== "" && <div className="info-message">✅ {message}</div>}
      {overdue && (
        <div className="exco-alert">
          ⚠ This student was told to expect a reply by {formatDate(application.expectedReplyBy)}. Please update them.
        </div>
      )}

      <div className="detail-layout">
        <div className="detail-main">
          <section className="detail-section">
            <h2>Update status</h2>

            {application.status === "withdrawn" ? (
              <p>This student has withdrawn their application.</p>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <FormField label="New status" htmlFor="status" error={errors.status}>
                  <select id="status" name="status" value={values.status} onChange={handleChange}>
                    <option value="">-- Choose a status --</option>
                    {EXCO_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {STATUS_LABELS[s]}
                      </option>
                    ))}
                  </select>
                </FormField>

                <FormField label="Next step for the student" htmlFor="nextStep" error={errors.nextStep}>
                  <textarea
                    id="nextStep"
                    name="nextStep"
                    rows="3"
                    placeholder="e.g. Come for a trial on Mon 1 Dec, 6pm at the Sports Hall."
                    value={values.nextStep}
                    onChange={handleChange}
                  />
                </FormField>

                {showReplyDate && (
                  <FormField label="Expect a reply by" htmlFor="expectedReplyBy" error={errors.expectedReplyBy}>
                    <input
                      type="date"
                      id="expectedReplyBy"
                      name="expectedReplyBy"
                      value={values.expectedReplyBy}
                      onChange={handleChange}
                    />
                  </FormField>
                )}

                <button type="submit" className="btn btn-primary">
                  Update status
                </button>
              </form>
            )}
          </section>

          <section className="detail-section">
            <h2>Progress</h2>
            <StatusTimeline application={application} />
          </section>
        </div>

        <aside className="detail-side">
          <h2>Applicant</h2>
          <div className="answer">
            <p className="answer-label">Email</p>
            <p>{student ? student.email : "-"}</p>
          </div>
          <div className="answer">
            <p className="answer-label">Course</p>
            <p>{student ? student.course : "-"}</p>
          </div>
          <div className="answer">
            <p className="answer-label">Phone</p>
            <p>{application.phone}</p>
          </div>
          <div className="answer">
            <p className="answer-label">Applied on</p>
            <p>{formatDate(application.appliedAt)}</p>
          </div>
          <div className="answer">
            <p className="answer-label">Experience</p>
            <p>{EXPERIENCE_LABELS[application.experience]}</p>
          </div>
          <div className="answer">
            <p className="answer-label">Why they want to join</p>
            <p>{application.reason}</p>
          </div>
        </aside>
      </div>

      {confirming && (
        <ConfirmDialog
          title="Update status?"
          message={
            "Change " + (student ? student.name : "this student") + "'s status to " +
            STATUS_LABELS[values.status] + "? They will be notified straight away."
          }
          confirmText="Update"
          onConfirm={handleConfirm}
          onCancel={() => setConfirming(false)}
        />
      )}
    </div>
  );
}

export default ApplicantDetailPage;