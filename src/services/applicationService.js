import { TODAY } from "../utils/dates";

// The "logged in" student. Defined once in data/currentUser.js and shared here
// so the Part B pages can keep importing it from this service.
export { CURRENT_STUDENT_ID } from "../data/currentUser";

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

