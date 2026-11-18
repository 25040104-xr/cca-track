import Emoji3D from "./Emoji3D";
import { formatDate } from "../utils/dates";

// One notification in the Notifications page.
// onOpen: open the application this notification is about
// onMarkRead: mark this notification as read
function NotificationItem({ notification, cca, onOpen, onMarkRead }) {
  return (
    <li className={notification.read ? "notification-item" : "notification-item unread"}>
      <span className="notification-emoji">
        <Emoji3D emoji={cca ? cca.emoji : "🔔"} size={36} />
      </span>

      {/* role, tabIndex and onKeyDown let keyboard users open it with Enter too */}
      <div
        className="notification-body"
        role="button"
        tabIndex={0}
        onClick={() => onOpen(notification)}
        onKeyDown={(e) => {
          if (e.key === "Enter") onOpen(notification);
        }}
      >
        <p className="notification-message">{notification.message}</p>
        <p className="notification-time">{formatDate(notification.createdAt)}</p>
      </div>

      {notification.read ? (
        <span className="notification-read-label">Read</span>
      ) : (
        <button className="btn-link notification-mark" onClick={() => onMarkRead(notification.id)}>
          <span className="unread-dot"></span> Mark as read
        </button>
      )}
    </li>
  );
}

export default NotificationItem;
