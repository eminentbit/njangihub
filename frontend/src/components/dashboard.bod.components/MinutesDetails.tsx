import React from "react";

interface MinutesDetailsProps {
  minutesId: number;
  isDarkMode: boolean;
  onBack: () => void;
}

const MinutesDetails: React.FC<MinutesDetailsProps> = ({
  minutesId,
  isDarkMode,
  onBack,
}) => {
  const minutesDetails = {
    1: {
      title: "Q2 Strategy Review",
      date: "2025-05-01T10:00",
      status: "Approved",
      summary: "Discussed strategic plan for Q2.",
      attendees: ["Alice Smith", "Bob Johnson", "Clara Lee"],
      decisions: ["Approved Q2 budget.", "Assigned marketing lead."],
      actionItems: ["Draft Q3 plan by June 1.", "Schedule follow-up meeting."],
    },
    2: {
      title: "Annual General Meeting",
      date: "2025-04-30T14:00",
      status: "Draft",
      summary: "Reviewed annual report and elections.",
      attendees: ["David Brown", "Emma Wilson", "Frank Davis"],
      decisions: ["Elected new board chair.", "Approved annual report."],
      actionItems: [
        "Finalize election documents.",
        "Distribute annual report.",
      ],
    },
    3: {
      title: "Emergency Budget Meeting",
      date: "2025-05-15T09:00",
      status: "Archived",
      summary: "Addressed budget shortfall.",
      attendees: ["Grace Kim", "Henry Adams", "Isabel Clark"],
      decisions: ["Cut non-essential spending.", "Requested financial audit."],
      actionItems: ["Submit audit report by May 30.", "Review spending cuts."],
    },
  };

  const minutes =
    minutesDetails[minutesId as keyof typeof minutesDetails] || {};

  const isMobile = window.innerWidth < 768;

  return (
    <div
      style={{
        backgroundColor: isDarkMode ? "#4b5563" : "white",
        padding: "16px",
        borderRadius: "4px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        maxHeight: "60vh",
        overflowY: "auto",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          marginBottom: "16px",
        }}
      >
        <button
          type="button"
          onClick={onBack}
          style={{
            backgroundColor: "#9333ea",
            color: "white",
            padding: "8px 16px",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            fontSize: isMobile ? "14px" : "16px",
          }}
        >
          Back
        </button>
        <h3
          style={{
            margin: "0",
            fontSize: "18px",
            color: isDarkMode ? "white" : "black",
          }}
        >
          {minutes.title}
        </h3>
      </div>
      <p
        style={{ color: isDarkMode ? "#d1d5db" : "#6b7280", fontSize: "14px" }}
      >
        <strong>Date:</strong> {new Date(minutes.date).toLocaleString()}
      </p>
      <p
        style={{ color: isDarkMode ? "#d1d5db" : "#6b7280", fontSize: "14px" }}
      >
        <strong>Status:</strong> {minutes.status}
      </p>
      <p
        style={{ color: isDarkMode ? "#d1d5db" : "#6b7280", fontSize: "14px" }}
      >
        <strong>Summary:</strong> {minutes.summary}
      </p>
      <h4
        style={{
          fontSize: "16px",
          color: isDarkMode ? "white" : "black",
          margin: "16px 0 8px",
        }}
      >
        Attendees
      </h4>
      <ul
        style={{
          listStyle: "disc",
          paddingLeft: "20px",
          color: isDarkMode ? "#d1d5db" : "#6b7280",
        }}
      >
        {(minutes.attendees || []).map((attendee: string, index: number) => (
          <li key={index}>{attendee}</li>
        ))}
      </ul>
      <h4
        style={{
          fontSize: "16px",
          color: isDarkMode ? "white" : "black",
          margin: "16px 0 8px",
        }}
      >
        Decisions
      </h4>
      <ul
        style={{
          listStyle: "disc",
          paddingLeft: "20px",
          color: isDarkMode ? "#d1d5db" : "#6b7280",
        }}
      >
        {(minutes.decisions || []).map((decision: string, index: number) => (
          <li key={index}>{decision}</li>
        ))}
      </ul>
      <h4
        style={{
          fontSize: "16px",
          color: isDarkMode ? "white" : "black",
          margin: "16px 0 8px",
        }}
      >
        Action Items
      </h4>
      <ul
        style={{
          listStyle: "disc",
          paddingLeft: "20px",
          color: isDarkMode ? "#d1d5db" : "#6b7280",
        }}
      >
        {(minutes.actionItems || []).map((action: string, index: number) => (
          <li key={index}>{action}</li>
        ))}
      </ul>
    </div>
  );
};

export default MinutesDetails;
