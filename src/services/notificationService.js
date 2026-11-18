// Only the notifications that belong to this student
export function getMyNotifications(notifications, studentId) {
  return notifications.filter((notification) => notification.studentId === studentId);
}

// How many of these notifications are not read yet
export function countUnread(notifications) {
  return notifications.filter((notification) => notification.read === false).length;
}
