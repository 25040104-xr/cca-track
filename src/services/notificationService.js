import { TODAY } from "../utils/dates";

// Only the notifications that belong to this student
export function getMyNotifications(notifications, studentId) {
  return notifications.filter((notification) => notification.studentId === studentId);
}

// How many of these notifications are not read yet
export function countUnread(notifications) {
  return notifications.filter((notification) => notification.read === false).length;
}

// Builds a new (unread) notification for a student.
// In CA2 the backend will create these automatically.
export function createNotification(notifications, studentId, applicationId, message) {
  const number = String(notifications.length + 1).padStart(2, "0");
  return {
    id: "noti-" + number,
    studentId: studentId,
    applicationId: applicationId,
    message: message,
    read: false,
    createdAt: TODAY,
  };
}
