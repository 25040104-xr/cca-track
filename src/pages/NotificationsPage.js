import { useState } from "react";
import { getMyNotifications, countUnread } from "../services/notificationService";
import { CURRENT_STUDENT_ID } from "../services/applicationService";
import { getCCAById } from "../services/ccaService";
import NotificationItem from "../components/NotificationItem";
import FilterBar from "../components/FilterBar";
import "../styles/myApplications.css";

// notifications, setNotifications and applications come from App.js (the state lives there)
function NotificationsPage({ notifications, setNotifications, applications, navigate }) {
  const [filter, setFilter] = useState("All");

  const myNotifications = getMyNotifications(notifications, CURRENT_STUDENT_ID);
  const unreadCount = countUnread(myNotifications);

  let shownNotifications = myNotifications;
  if (filter === "Unread") {
    shownNotifications = myNotifications.filter((n) => n.read === false);
  }

  // Make a new array where only this notification is changed to read: true
  function handleMarkRead(id) {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }

  // Make a new array where all of this student's notifications are read: true
  function handleMarkAllRead() {
    setNotifications((prev) =>
      prev.map((n) => (n.studentId === CURRENT_STUDENT_ID ? { ...n, read: true } : n))
    );
  }

  // Clicking a notification marks it as read and opens that application
  function handleOpen(notification) {
    handleMarkRead(notification.id);
    navigate("applicationDetail", { applicationId: notification.applicationId });
  }

  // Find which CCA a notification is about (to show its emoji)
  function getCCAOfNotification(notification) {
    const application = applications.filter((a) => a.id === notification.applicationId)[0];
    return getCCAById(application.ccaId);
  }

  return (
    <div className="page">
      <div className="notifications-header">
        <div>
          <h1>Notifications</h1>
          <p className="page-intro">
            {unreadCount > 0 ? "You have " + unreadCount + " unread update(s)." : "You're all caught up!"}
          </p>
        </div>
        {unreadCount > 0 && (
          <button className="btn" onClick={handleMarkAllRead}>
            Mark all as read
          </button>
        )}
      </div>

      <FilterBar options={["All", "Unread"]} selected={filter} onSelect={setFilter} />

      {shownNotifications.length === 0 ? (
        <div className="empty-state">
          <p className="no-results-icon">🔔</p>
          <h3>{filter === "Unread" ? "No unread notifications" : "No notifications yet"}</h3>
          <p>
            {filter === "Unread"
              ? "You've read everything."
              : "When a CCA updates your application, you'll see it here."}
          </p>
        </div>
      ) : (
        <ul className="notification-list">
          {shownNotifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              cca={getCCAOfNotification(notification)}
              onOpen={handleOpen}
              onMarkRead={handleMarkRead}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

export default NotificationsPage;
