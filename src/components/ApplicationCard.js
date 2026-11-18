import StatusBadge from "./StatusBadge";
import Emoji3D from "./Emoji3D";
import { isOverdue } from "../services/applicationService";
import { formatDate } from "../utils/dates";

// One application in the "My Applications" list.
// onSelect is a function from the page, called when "View details" is clicked.
function ApplicationCard({ application, cca, onSelect }) {
  const overdue = isOverdue(application);

  return (
    <div className={overdue ? "application-card overdue" : "application-card"}>
      <div className="application-card-top">
        <span className="application-emoji">
          <Emoji3D emoji={cca.emoji} size={40} />
        </span>
        <div className="application-card-title">
          <h3>{cca.name}</h3>
          <p className="application-sub">
            {cca.category} · Applied {formatDate(application.appliedAt)}
          </p>
        </div>
        <StatusBadge status={application.status} />
      </div>

      <p className="application-next">
        <strong>Next step:</strong> {application.nextStep}
      </p>

      {application.expectedReplyBy !== null && (
        <p className={overdue ? "application-reply warning" : "application-reply"}>
          {overdue
            ? "⚠️ Reply overdue (expected by " + formatDate(application.expectedReplyBy) + ")"
            : "📬 Reply expected by " + formatDate(application.expectedReplyBy)}
        </p>
      )}

      <button className="btn btn-small" onClick={() => onSelect(application.id)}>
        View details →
      </button>
    </div>
  );
}

export default ApplicationCard;
