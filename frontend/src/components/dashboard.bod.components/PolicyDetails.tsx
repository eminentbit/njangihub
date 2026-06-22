import React from "react";

interface PolicyDetailsProps {
  policyId: number;
  isDarkMode: boolean;
  onBack: () => void;
}

const PolicyDetails: React.FC<PolicyDetailsProps> = ({
  policyId,
  isDarkMode,
  onBack,
}) => {
  const policiesDetails = {
    1: {
      title: "Board Meeting Policy",
      category: "Governance",
      version: "2.1",
      lastUpdated: "2025-05-01T10:00",
      status: "Active",
      summary: "Guidelines for conducting board meetings.",
      content:
        "This policy outlines the procedures for scheduling, conducting, and documenting board meetings. Key requirements include a minimum notice period of 7 days, a quorum of 50% of members, and detailed minutes to be recorded by the secretary.",
    },
    2: {
      title: "Financial Reporting Policy",
      category: "Financial",
      version: "1.3",
      lastUpdated: "2025-04-15T14:00",
      status: "Draft",
      summary: "Procedures for financial reporting.",
      content:
        "This draft policy establishes guidelines for preparing and submitting financial reports. It includes quarterly and annual reporting requirements, audit procedures, and approval processes by the finance committee.",
    },
    3: {
      title: "Operational Safety Policy",
      category: "Operational",
      version: "1.0",
      lastUpdated: "2025-03-10T09:00",
      status: "Archived",
      summary: "Safety protocols for operations.",
      content:
        "This archived policy details safety protocols for operational activities, including equipment usage, emergency procedures, and staff training. It has been superseded by a newer version effective June 2025.",
    },
  };

  const policy =
    policiesDetails[policyId as keyof typeof policiesDetails] || {};

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
          {policy.title}
        </h3>
      </div>
      <p
        style={{ color: isDarkMode ? "#d1d5db" : "#6b7280", fontSize: "14px" }}
      >
        <strong>Category:</strong> {policy.category}
      </p>
      <p
        style={{ color: isDarkMode ? "#d1d5db" : "#6b7280", fontSize: "14px" }}
      >
        <strong>Version:</strong> {policy.version}
      </p>
      <p
        style={{ color: isDarkMode ? "#d1d5db" : "#6b7280", fontSize: "14px" }}
      >
        <strong>Last Updated:</strong>{" "}
        {new Date(policy.lastUpdated).toLocaleString()}
      </p>
      <p
        style={{ color: isDarkMode ? "#d1d5db" : "#6b7280", fontSize: "14px" }}
      >
        <strong>Status:</strong> {policy.status}
      </p>
      <p
        style={{ color: isDarkMode ? "#d1d5db" : "#6b7280", fontSize: "14px" }}
      >
        <strong>Summary:</strong> {policy.summary}
      </p>
      <h4
        style={{
          fontSize: "16px",
          color: isDarkMode ? "white" : "black",
          margin: "16px 0 8px",
        }}
      >
        Full Policy Text
      </h4>
      <p
        style={{ color: isDarkMode ? "#d1d5db" : "#6b7280", fontSize: "14px" }}
      >
        {policy.content}
      </p>
    </div>
  );
};

export default PolicyDetails;
