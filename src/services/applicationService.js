import { TODAY } from "../utils/dates";

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
