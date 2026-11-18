import { STATUS_LABELS } from "../utils/statuses";

// Coloured pill showing an application's status.
// The colours come from the .status-... classes in App.css.
function StatusBadge({ status }) {
  return <span className={"status-badge status-" + status}>{STATUS_LABELS[status]}</span>;
}

export default StatusBadge;
