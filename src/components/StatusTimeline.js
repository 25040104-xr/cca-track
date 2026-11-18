import { STATUS_LABELS, STATUS_STEPS } from "../utils/statuses";
import { formatDate } from "../utils/dates";
import { isInProgress } from "../services/applicationService";

// Shows the steps the application has already gone through (from its history),
// then the steps that are still to come in grey.
function StatusTimeline({ application }) {
  const history = application.history;

  // Steps still to come = steps that are not in the history yet.
  // Only shown while the application is still in progress.
  let upcomingSteps = [];
  if (isInProgress(application)) {
    upcomingSteps = STATUS_STEPS.filter(
      (step) => history.filter((item) => item.status === step).length === 0
    );
  }

  return (
    <ul className="timeline">
      {history.map((item, index) => (
        <li key={index} className="timeline-step done">
          <span className={"timeline-dot dot-" + item.status}></span>
          <div>
            <p className="timeline-title">
              {STATUS_LABELS[item.status]}
              {index === history.length - 1 && <span className="timeline-now">Now</span>}
            </p>
            <p className="timeline-date">{formatDate(item.date)}</p>
            <p className="timeline-note">{item.note}</p>
          </div>
        </li>
      ))}

      {upcomingSteps.map((step) => (
        <li key={step} className="timeline-step upcoming">
          <span className="timeline-dot"></span>
          <div>
            <p className="timeline-title">{STATUS_LABELS[step]}</p>
            <p className="timeline-date">Not yet</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default StatusTimeline;
