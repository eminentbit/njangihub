import React from "react";
import { Meeting } from "../../store/create.bod.store";

interface MeetingCardProps {
  meeting: Meeting;
  isDarkMode: boolean;
  isMobile: boolean;
}

const MeetingCard: React.FC<MeetingCardProps> = ({
  meeting,
  isDarkMode,
  isMobile,
}) => {
  const statusColor =
    {
      Upcoming: "#10b981",
      Completed: "#f59e0b",
      Cancelled: "#ef4444",
    }[meeting.status] || "#6b7280";

  return (
    <div
      style={{
        padding: "16px",
        backgroundColor: isDarkMode ? "#374151" : "#e9d5ff",
        borderRadius: "4px",
        marginBottom: "8px",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        justifyContent: "space-between",
        alignItems: isMobile ? "flex-start" : "center",
        gap: "8px",
      }}
    >
      <div style={{ flex: "1" }}>
        <h4
          style={{
            margin: "0 0 4px 0",
            fontSize: "16px",
            color: isDarkMode ? "white" : "black",
          }}
        >
          {meeting.title}
        </h4>
        <p
          style={{
            margin: "0",
            color: isDarkMode ? "#d1d5db" : "#6b7280",
            fontSize: "14px",
          }}
        >
          {meeting.agenda}
        </p>
        <p
          style={{
            margin: "4px 0 0 0",
            color: isDarkMode ? "#d1d5db" : "#6b7280",
            fontSize: "12px",
          }}
        >
          Date: {new Date(meeting.date).toLocaleString()}
        </p>
      </div>
      <span
        style={{
          padding: "4px 8px",
          backgroundColor: statusColor,
          color: "white",
          borderRadius: "9999px",
          fontSize: "12px",
          fontWeight: "bold",
          alignSelf: isMobile ? "flex-end" : "center",
        }}
      >
        {meeting.status}
      </span>
    </div>
  );
};

export default MeetingCard;
