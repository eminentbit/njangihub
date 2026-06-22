import React from "react";

interface NotificationsListProps {
  isDarkMode?: boolean;
  notifications: { _id: string; message: string; createdAt: string }[];
}

const NotificationsList: React.FC<NotificationsListProps> = ({
  isDarkMode = false,
  notifications,
}) => {
  return (
    <div
      style={{
        backgroundColor: isDarkMode ? "#4b5563" : "white",
        padding: "16px",
        borderRadius: "4px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        color: isDarkMode ? "white" : "black",
      }}
    >
      <h3 style={{ margin: "0 0 16px 0", fontSize: "18px" }}>Notifications</h3>
      {notifications.length < 1 ? (
        <div>No notifications found</div>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {notifications.map((notification, index) => (
            <li
              key={index}
              style={{
                padding: "8px",
                backgroundColor: isDarkMode ? "#374151" : "#e9d5ff",
                borderRadius: "4px",
                marginBottom: "8px",
                color: isDarkMode ? "white" : "black",
              }}
            >
              {notification.message}
            </li>
          ))}
          <li style={{ padding: "8px" }}>
            <a
              href="/board/notifications"
              style={{
                color: isDarkMode ? "#93c5fd" : "#2563eb",
                textDecoration: "none",
              }}
            >
              View all notifications
            </a>
          </li>
        </ul>
      )}
    </div>
  );
};

export default NotificationsList;
