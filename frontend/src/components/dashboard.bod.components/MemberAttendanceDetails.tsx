import React from "react";

interface MemberAttendanceDetailsProps {
  member: string;
  isDarkMode: boolean;
  onBack: () => void;
}

const MemberAttendanceDetails: React.FC<MemberAttendanceDetailsProps> = ({
  member,
  isDarkMode,
  onBack,
}) => {
  const attendanceHistory = [
    {
      meetingId: 1,
      date: "2025-05-01T10:00",
      title: "Q2 Strategy Review",
      attendees: ["Alice Smith", "Bob Johnson", "Clara Lee"],
    },
    {
      meetingId: 2,
      date: "2025-04-30T14:00",
      title: "Annual General Meeting",
      attendees: ["David Brown", "Emma Wilson", "Frank Davis", "Grace Kim"],
    },
    {
      meetingId: 3,
      date: "2025-05-15T09:00",
      title: "Emergency Budget Meeting",
      attendees: ["Henry Adams", "Isabel Clark"],
    },
  ];

  const memberAttendance = attendanceHistory.map((meeting) => ({
    ...meeting,
    attended: meeting.attendees.includes(member),
  }));

  const attendedCount = memberAttendance.filter((m) => m.attended).length;
  const totalMeetings = memberAttendance.length;
  const attendanceRate =
    totalMeetings > 0 ? Math.round((attendedCount / totalMeetings) * 100) : 0;

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
          {member}'s Attendance History
        </h3>
      </div>
      <p
        style={{
          fontSize: "20px",
          fontWeight: "bold",
          color: attendanceRate >= 80 ? "#10b981" : "#f59e0b",
          marginBottom: "16px",
        }}
      >
        {attendanceRate}% Attendance Rate
      </p>
      <h4
        style={{
          fontSize: "16px",
          color: isDarkMode ? "white" : "black",
          margin: "16px 0 8px",
        }}
      >
        Meeting History
      </h4>
      {memberAttendance.map((meeting) => (
        <div
          key={meeting.meetingId}
          style={{
            padding: "8px",
            backgroundColor: meeting.attended
              ? isDarkMode
                ? "#10b981"
                : "#d1fae5"
              : isDarkMode
              ? "#f59e0b"
              : "#fef3c7",
            borderRadius: "4px",
            marginBottom: "8px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <p
              style={{
                margin: "0",
                fontSize: "14px",
                color: isDarkMode ? "white" : "black",
              }}
            >
              {meeting.title}
            </p>
            <p
              style={{
                margin: "0",
                fontSize: "12px",
                color: isDarkMode ? "#d1d5db" : "#6b7280",
              }}
            >
              {new Date(meeting.date).toLocaleString()}
            </p>
          </div>
          <span
            style={{
              padding: "4px 8px",
              backgroundColor: meeting.attended ? "#10b981" : "#f59e0b",
              color: "white",
              borderRadius: "9999px",
              fontSize: "12px",
              fontWeight: "bold",
            }}
          >
            {meeting.attended ? "Present" : "Absent"}
          </span>
        </div>
      ))}
    </div>
  );
};

export default MemberAttendanceDetails;
