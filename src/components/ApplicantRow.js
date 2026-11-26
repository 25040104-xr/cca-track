import StatusBadge from "./StatusBadge";
import { getStudentById } from "../data/students";
import { getCCAById } from "../services/ccaService";
import { isOverdue } from "../services/applicationService";
import { formatDate } from "../utils/dates";

// One row in the exco's applicant list.
// Props:
// - application: one application object from applications.js
// - onSelect: function to call when the exco clicks the row
function ApplicantRow({ application, onSelect }) {
  const student = getStudentById(application.studentId);
  const cca = getCCAById(application.ccaId);
  const overdue = isOverdue(application);

  return (
    <div
      className={overdue ? "applicant-row overdue" : "applicant-row"}
      onClick={() => onSelect(application.id)}
    >
      <div className="applicant-main">
        <strong>{student ? student.name : "Unknown student"}</strong>
        <span className="applicant-sub">{cca ? cca.name : "Unknown CCA"}</span>
      </div>

      <span className="applicant-date">Applied {formatDate(application.appliedAt)}</span>

      <StatusBadge status={application.status} />

      {overdue && <span className="overdue-flag">⚠ Pending too long</span>}
    </div>
  );
}

export default ApplicantRow;