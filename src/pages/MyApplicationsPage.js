import { useState } from "react";
import { getMyApplications, isInProgress, isOverdue } from "../services/applicationService";
import { CURRENT_STUDENT_ID } from "../data/currentUser";
import { getCCAById } from "../services/ccaService";
import ApplicationCard from "../components/ApplicationCard";
import FilterBar from "../components/FilterBar";
import "../styles/myApplications.css";

const FILTER_OPTIONS = ["All", "In progress", "Accepted", "Not selected", "Withdrawn"];

// applications: the list of all applications (state kept in App.js, passed in as a prop)
function MyApplicationsPage({ applications, navigate }) {
  const [filter, setFilter] = useState("All");

  const myApplications = getMyApplications(applications, CURRENT_STUDENT_ID);

  // Numbers for the summary boxes
  const inProgressCount = myApplications.filter((a) => isInProgress(a)).length;
  const acceptedCount = myApplications.filter((a) => a.status === "accepted").length;
  const overdueCount = myApplications.filter((a) => isOverdue(a)).length;

  // Does this application match the filter button that is selected?
  function matchesFilter(application) {
    if (filter === "In progress") {
      return isInProgress(application);
    } else if (filter === "Accepted") {
      return application.status === "accepted";
    } else if (filter === "Not selected") {
      return application.status === "not-selected";
    } else if (filter === "Withdrawn") {
      return application.status === "withdrawn";
    }
    return true; // "All"
  }

  const shownApplications = myApplications.filter(matchesFilter);

  function handleSelect(id) {
    navigate("applicationDetail", { applicationId: id });
  }

  // Empty state: the student has not applied to any CCA yet
  if (myApplications.length === 0) {
    return (
      <div className="page">
        <h1>My Applications</h1>
        <div className="empty-state">
          <p className="no-results-icon">📭</p>
          <h3>You haven't applied to any CCA yet</h3>
          <p>Find a CCA you like and apply. You can track every application here.</p>
          <button className="btn btn-primary" onClick={() => navigate("directory")}>
            Explore CCAs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>My Applications</h1>
      <p className="page-intro">
        All your CCA applications in one place, with the next step and when to expect a reply.
      </p>

      <div className="summary-row">
        <div className="summary-box">
          <span className="summary-number">{myApplications.length}</span>
          <span className="summary-label">Total applied</span>
        </div>
        <div className="summary-box">
          <span className="summary-number">{inProgressCount}</span>
          <span className="summary-label">In progress</span>
        </div>
        <div className="summary-box">
          <span className="summary-number">{acceptedCount}</span>
          <span className="summary-label">Accepted</span>
        </div>
      </div>

      {overdueCount > 0 && (
        <div className="overdue-banner">
          ⚠️ <strong>{overdueCount}</strong> application(s) have passed the expected reply date.
          You may want to contact the CCA.
        </div>
      )}

      <FilterBar options={FILTER_OPTIONS} selected={filter} onSelect={setFilter} />

      {shownApplications.length === 0 ? (
        <div className="empty-state">
          <h3>No applications here</h3>
          <p>You have no applications under "{filter}".</p>
          <button className="btn" onClick={() => setFilter("All")}>
            Show all applications
          </button>
        </div>
      ) : (
        <div className="application-list">
          {shownApplications.map((application) => (
            <ApplicationCard
              key={application.id}
              application={application}
              cca={getCCAById(application.ccaId)}
              onSelect={handleSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default MyApplicationsPage;
