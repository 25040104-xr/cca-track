import { TODAY, addDays } from "../utils/dates";

// No login in CA1, so we pretend this student is logged in.
// In CA2 this will come from the logged-in user.
export const CURRENT_STUDENT_ID = "stu-01";

// Only the applications that belong to this student
export function getMyApplications(applications, studentId) {
  return applications.filter((application) => application.studentId === studentId);
}

// True if the student is still waiting for the CCA
export function isInProgress(application) {
  return (
    application.status === "applied" ||
    application.status === "trial-scheduled" ||
    application.status === "trial-done"
  );
}

// True if the student is still waiting and the expected reply date has passed.
// Dates written as "YYYY-MM-DD" can be compared like normal text.
export function isOverdue(application) {
  return (
    isInProgress(application) &&
    application.expectedReplyBy !== null &&
    application.expectedReplyBy < TODAY
  );
}

// The student's current application to this CCA (still in progress, or accepted).
// Gives back undefined if there is none, so the student is allowed to apply.
export function getActiveApplication(applications, studentId, ccaId) {
  return applications.find(
    (application) =>
      application.studentId === studentId &&
      application.ccaId === ccaId &&
      (isInProgress(application) || application.status === "accepted")
  );
}

// Builds a new application object from the Apply form.
// The expected reply date is today + the CCA's reply time (responseDays).
// In CA2 the backend will do this in POST /api/applications.
export function createApplication(applications, cca, formValues, studentId) {
  const number = String(applications.length + 1).padStart(2, "0");
  return {
    id: "app-" + number,
    studentId: studentId,
    ccaId: cca.id,
    status: "applied",
    phone: formValues.phone.trim(),
    experience: formValues.experience,
    reason: formValues.reason.trim(),
    appliedAt: TODAY,
    updatedAt: TODAY,
    nextStep: "Wait for the " + cca.name + " exco to review your application.",
    expectedReplyBy: addDays(TODAY, cca.responseDays),
    history: [{ status: "applied", date: TODAY, note: "Application submitted." }],
  };
}
