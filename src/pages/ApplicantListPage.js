import { useState } from "react";
import ApplicantRow from "../components/ApplicantRow";
import FilterBar from "../components/FilterBar";
import EmptyState from "../components/EmptyState";
import { isOverdue } from "../services/applicationService";
import "../styles/exco.css";

const FILTER_OPTIONS = ["All", "Applied", "Trial scheduled", "Trial done", "Accepted", "Not selected", "Pending too long"];

// Exco page: list of all applicants.
// Props:
// - applications: all applications (state kept in App.js)
// - navigate: function to change page
function ApplicantListPage({ applications, navigate }) {
  const [filter, setFilter] = useState("All");

  // Withdrawn applications are hidden from excos
  const activeApplications = applications.filter((a) => a.status !== "withdrawn");
  const overdueCount = activeApplications.filter((a) => isOverdue(a)).length;

  // Does this application match the filter button that is selected?
  function matchesFilter(application) {
    if (filter === "Applied") return application.status === "applied";
    if (filter === "Trial scheduled") return application.status === "trial-scheduled";
    if (filter === "Trial done") return application.status === "trial-done";
    if (filter === "Accepted") return application.status === "accepted";
    if (filter === "Not selected") return application.status === "not-selected";
    if (filter === "Pending too long") return isOverdue(application);
    return true; // "All"
  }

    // Show overdue applicants first so excos see the urgent ones straight away
  const shownApplications = activeApplications
    .filter(matchesFilter)
    .sort((a, b) => (isOverdue(b) ? 1 : 0) - (isOverdue(a) ? 1 : 0));

  function handleSelect(id) {
    navigate("applicantDetail", { applicationId: id });
  }

  return (
    <div className="page">
      <h1>Applicants</h1>
      <p className="applicant-count">{activeApplications.length} applicants in total</p>

      {overdueCount > 0 && (
        <div className="exco-alert">
          ⚠ {overdueCount} application(s) have passed their expected reply date. Please update them soon.
        </div>
      )}

      <FilterBar options={FILTER_OPTIONS} selected={filter} onSelect={setFilter} />

      {shownApplications.length === 0 ? (
        <EmptyState title="No applicants found" message="Try choosing a different filter." />
      ) : (
        <div className="applicant-list">
          {shownApplications.map((application) => (
            <ApplicantRow key={application.id} application={application} onSelect={handleSelect} />
          ))}
        </div>
      )}
    </div>
  );
}

export default ApplicantListPage;