import React from "react";

interface DocumentPreviewProps {
  documentId: number;
  isDarkMode: boolean;
  onBack: () => void;
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  documentId,
  isDarkMode,
  onBack,
}) => {
  const documentsDetails = {
    1: {
      title: "Annual Report 2024",
      category: "Reports",
      uploadDate: "2025-01-15T09:00",
      summary: "Annual financial and operational report for 2024.",
      content:
        "This report covers the financial performance, operational highlights, and strategic goals achieved in 2024. Key points include a 15% revenue increase, expansion into new markets, and a focus on sustainability initiatives.",
    },
    2: {
      title: "Board Meeting Minutes Q1",
      category: "Minutes",
      uploadDate: "2025-04-01T14:00",
      summary: "Minutes from the Q1 board meeting.",
      content:
        "The Q1 board meeting discussed budget allocations, new project approvals, and updates to the governance structure. Decisions made include approving the budget for Q2 and assigning project leads for the new initiatives.",
    },
    3: {
      title: "Governance Policy 2025",
      category: "Policies",
      uploadDate: "2025-05-01T10:00",
      summary: "Updated governance policies for 2025.",
      content:
        "This document outlines the updated governance policies for 2025, including new guidelines for board member responsibilities, conflict of interest protocols, and compliance requirements.",
    },
  };

  const document =
    documentsDetails[documentId as keyof typeof documentsDetails] || {};

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
          {document.title}
        </h3>
      </div>
      <p
        style={{ color: isDarkMode ? "#d1d5db" : "#6b7280", fontSize: "14px" }}
      >
        <strong>Category:</strong> {document.category}
      </p>
      <p
        style={{ color: isDarkMode ? "#d1d5db" : "#6b7280", fontSize: "14px" }}
      >
        <strong>Uploaded:</strong>{" "}
        {new Date(document.uploadDate).toLocaleString()}
      </p>
      <p
        style={{ color: isDarkMode ? "#d1d5db" : "#6b7280", fontSize: "14px" }}
      >
        <strong>Summary:</strong> {document.summary}
      </p>
      <h4
        style={{
          fontSize: "16px",
          color: isDarkMode ? "white" : "black",
          margin: "16px 0 8px",
        }}
      >
        Content Preview
      </h4>
      <p
        style={{ color: isDarkMode ? "#d1d5db" : "#6b7280", fontSize: "14px" }}
      >
        {document.content}
      </p>
      <button
        type="button"
        onClick={() =>
          alert("Download functionality would be implemented here.")
        }
        style={{
          backgroundColor: "#10b981",
          color: "white",
          padding: "8px 16px",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          fontSize: isMobile ? "14px" : "16px",
          marginTop: "16px",
        }}
      >
        Download Document
      </button>
    </div>
  );
};

export default DocumentPreview;
