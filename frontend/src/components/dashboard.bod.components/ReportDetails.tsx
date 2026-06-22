import React from "react";

interface ReportDetailsProps {
  reportId: string;
  isDarkMode: boolean;
  onBack: () => void;
}

const ReportDetails: React.FC<ReportDetailsProps> = ({
  reportId,
  isDarkMode,
  onBack,
}) => {
  const reportsDetails = {
    1: {
      title: "Annual Financial Report",
      type: "Financial",
      status: "Pending",
      uploaded: "2025-05-01T10:00",
      summary: "Comprehensive financial overview for 2024.",
      content:
        "Revenue: $10M, Expenses: $7M, Net Profit: $3M. Key highlights include a 15% revenue growth and a 10% reduction in operational costs.",
      keyMetrics: { revenue: "$10M", expenses: "$7M", profit: "$3M" },
      approvedDate: null,
    },
    2: {
      title: "Q1 Operational Review",
      type: "Operational",
      status: "Approved",
      uploaded: "2025-04-15T14:00",
      summary: "Quarterly operational performance analysis.",
      content:
        "Operational uptime: 98%, Employee satisfaction: 85%. Notable improvements in process efficiency and staff training programs.",
      keyMetrics: { uptime: "98%", satisfaction: "85%" },
      approvedDate: "2025-04-20T09:00",
    },
    3: {
      title: "Strategic Plan 2025",
      type: "Strategic",
      status: "Archived",
      uploaded: "2025-03-10T09:00",
      summary: "Strategic goals and initiatives for 2025.",
      content:
        "Goals include market expansion, sustainability focus, and technology upgrades. Budget allocated: $5M.",
      keyMetrics: { budget: "$5M", goals: "3" },
      approvedDate: "2025-03-15T14:00",
    },
  };

  const report = reportsDetails[reportId as unknown as keyof typeof reportsDetails] || {};

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
          {report.title}
        </h3>
      </div>
      <p
        style={{ color: isDarkMode ? "#d1d5db" : "#6b7280", fontSize: "14px" }}
      >
        <strong>Type:</strong> {report.type}
      </p>
      <p
        style={{ color: isDarkMode ? "#d1d5db" : "#6b7280", fontSize: "14px" }}
      >
        <strong>Status:</strong> {report.status}
      </p>
      <p
        style={{ color: isDarkMode ? "#d1d5db" : "#6b7280", fontSize: "14px" }}
      >
        <strong>Uploaded:</strong> {new Date(report.uploaded).toLocaleString()}
      </p>
      {report.approvedDate && (
        <p
          style={{
            color: isDarkMode ? "#d1d5db" : "#6b7280",
            fontSize: "14px",
          }}
        >
          <strong>Approved:</strong>{" "}
          {new Date(report.approvedDate).toLocaleString()}
        </p>
      )}
      <p
        style={{ color: isDarkMode ? "#d1d5db" : "#6b7280", fontSize: "14px" }}
      >
        <strong>Summary:</strong> {report.summary}
      </p>
      <h4
        style={{
          fontSize: "16px",
          color: isDarkMode ? "white" : "black",
          margin: "16px 0 8px",
        }}
      >
        Full Report
      </h4>
      <p
        style={{ color: isDarkMode ? "#d1d5db" : "#6b7280", fontSize: "14px" }}
      >
        {report.content}
      </p>
      <h4
        style={{
          fontSize: "16px",
          color: isDarkMode ? "white" : "black",
          margin: "16px 0 8px",
        }}
      >
        Key Metrics
      </h4>
      <ul
        style={{
          listStyle: "disc",
          paddingLeft: "20px",
          color: isDarkMode ? "#d1d5db" : "#6b7280",
        }}
      >
        {Object.entries(report.keyMetrics || {}).map(([key, value], index) => (
          <li key={index}>
            <strong>{key}:</strong> {value}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReportDetails;
