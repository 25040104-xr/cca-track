import { useState } from "react";
import { isInProgress, isOverdue } from "../services/applicationService";
import { getCCAById } from "../services/ccaService";
import { formatDate, TODAY } from "../utils/dates";
import StatusBadge from "../components/StatusBadge";
import StatusTimeline from "../components/StatusTimeline";
import Emoji3D from "../components/Emoji3D";
import "../styles/myApplications.css";

const EXPERIENCE_LABELS = {
  none: "No experience",
  some: "Some experience",
  experienced: "Experienced",
};

// applications and setApplications come from App.js (the state lives there)
function ApplicationDetailPage({ applicationId, applications, setApplications, navigate }) {
  const [confirmingWithdraw, setConfirmingWithdraw] = useState(false);
  const [message, setMessage] = useState("");

  // filter() gives back an array, so [0] takes the first (and only) match
  const application = applications.filter((a) => a.id === applicationId)[0];

  if (!application) {
    return (
      <div className="page">
        <div className="no-results">
          <h3>Sorry, this application could not be found.</h3>
          <button className="btn btn-primary" onClick={() => navigate("myApplications")}>
            Back to My Applications
          </button>
        </div>
      </div>
    );
  }

  const cca = getCCAById(application.ccaId);
  const overdue = isOverdue(application);

  function handleWithdraw() {
    // Make a new array: copy every application, but change the one being withdrawn.
    // We never change the old state directly (L9: update arrays/objects with spread).
    setApplications((prev) =>
      prev.map((a) =>
        a.id === application.id
          ? {
              ...a,
              status: "withdrawn",
              updatedAt: TODAY,
              nextStep: "You withdrew this application.",
              expectedReplyBy: null,
              history: [...a.history, { status: "withdrawn", date: TODAY, note: "Withdrawn by student." }],
            }
          : a
      )
    );
    setConfirmingWithdraw(false);
    setMessage("You have withdrawn your application to " + cca.name + ".");
  }

  return (
    <div className="page">
      <button className="btn-link" onClick={() => navigate("myApplications")}>
        ← Back to My Applications
      </button>

      <div className="app-detail-header">
        <span className="application-emoji large">
          <Emoji3D emoji={cca.emoji} size={64} />
        </span>
        <div>
          <p className="application-sub">{cca.category}</p>
          <h1>{cca.name}</h1>
          <StatusBadge status={application.status} />
        </div>
      </div>

      {message !== "" && <div className="info-message">✅ {message}</div>}

      <div className="detail-layout">
        <div className="detail-main">
          <section className="detail-section next-step-box">
            <h2>Next step</h2>
            <p>{application.nextStep}</p>

            {application.expectedReplyBy !== null && (
              <p className={overdue ? "application-reply warning" : "application-reply"}>
                {overdue
                  ? "⚠️ Reply was expected by " +
                    formatDate(application.expectedReplyBy) +
                    ". You may want to contact the CCA exco."
                  : "📬 Expect a reply by " + formatDate(application.expectedReplyBy) + "."}
              </p>
            )}
          </section>

          <section className="detail-section">
            <h2>Progress</h2>
            <StatusTimeline application={application} />
          </section>
        </div>

        <aside className="detail-side">
          <h2>Your application</h2>
          <div className="answer">
            <p className="answer-label">Applied on</p>
            <p>{formatDate(application.appliedAt)}</p>
          </div>
          <div className="answer">
            <p className="answer-label">Last updated</p>
            <p>{formatDate(application.updatedAt)}</p>
          </div>
          <div className="answer">
            <p className="answer-label">Phone</p>
            <p>{application.phone}</p>
          </div>
          <div className="answer">
            <p className="answer-label">Experience</p>
            <p>{EXPERIENCE_LABELS[application.experience]}</p>
          </div>
          <div className="answer">
            <p className="answer-label">Why I want to join</p>
            <p>{application.reason}</p>
          </div>

          <button className="btn btn-block" onClick={() => navigate("ccaDetail", { ccaId: cca.id })}>
            View CCA info
          </button>

          {isInProgress(application) && !confirmingWithdraw && (
            <button className="btn btn-block btn-danger-outline" onClick={() => setConfirmingWithdraw(true)}>
              Withdraw application
            </button>
          )}

          {confirmingWithdraw && (
            <div className="withdraw-confirm">
              <p>
                Withdraw your application to <strong>{cca.name}</strong>? You will need to apply
                again if you change your mind.
              </p>
              <div className="withdraw-buttons">
                <button className="btn" onClick={() => setConfirmingWithdraw(false)}>
                  Cancel
                </button>
                <button className="btn btn-danger" onClick={handleWithdraw}>
                  Yes, withdraw
                </button>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

export default ApplicationDetailPage;
