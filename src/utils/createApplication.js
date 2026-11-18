import { TODAY } from "./dates";

// Turns a Date into "YYYY-MM-DD" (the date format used in applications.js)
function toDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Builds a new application object in the same format as applications.js.
// Uses TODAY from dates.js (fixed for CA1) so every date in the app matches.
// In CA2, the backend will set the real date instead.
export function createApplication(studentId, cca, values) {
  const today = new Date(TODAY + "T00:00:00");
  const replyBy = new Date(TODAY + "T00:00:00");
  replyBy.setDate(today.getDate() + cca.responseDays);

  const todayString = toDateString(today);

  return {
    id: "app-" + Date.now(),
    studentId: studentId,
    ccaId: cca.id,
    status: "applied",
    phone: values.phone.trim(),
    experience: values.experience,
    reason: values.reason.trim(),
    appliedAt: todayString,
    updatedAt: todayString,
    nextStep: `Wait for the ${cca.name} exco to review your application.`,
    expectedReplyBy: toDateString(replyBy),
    history: [{ status: "applied", date: todayString, note: "Application submitted." }],
  };
}

// Finds this student's current application for a CCA (ignores withdrawn ones).
// Returns undefined if the student has not applied.
export function findExistingApplication(applications, studentId, ccaId) {
  return applications.find(
    (app) =>
      app.studentId === studentId &&
      app.ccaId === ccaId &&
      app.status !== "withdrawn"
  );
}