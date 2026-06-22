import React from "react";
import { Resolution } from "../../store/create.bod.store";
import { capitalizeFirstLetter } from "../../utils/capitalize";

interface ResolutionCardProps {
  resolution: Resolution;
  isDarkMode: boolean;
}

const ResolutionCard: React.FC<ResolutionCardProps> = ({
  resolution,
  isDarkMode,
}) => {
  const statusColor =
    {
      Approved: "#10b981",
      Pending: "#f59e0b",
      Rejected: "#ef4444",
    }[resolution.status] || "#6b7280";

  return (
    <div
      style={{
        padding: "16px",
        backgroundColor: isDarkMode ? "#374151" : "#e9d5ff",
        borderRadius: "4px",
        marginBottom: "8px",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div>
        <h4
          style={{
            margin: "0 0 4px 0",
            fontSize: "16px",
            color: isDarkMode ? "white" : "black",
          }}
        >
          {resolution.title}
        </h4>
        <p
          style={{
            margin: "0",
            color: isDarkMode ? "#d1d5db" : "#6b7280",
            fontSize: "14px",
          }}
        >
          {resolution.description}
        </p>
        <p
          style={{
            margin: "4px 0 0 0",
            color: isDarkMode ? "#d1d5db" : "#6b7280",
            fontSize: "12px",
          }}
        >
          Date:{" "}
          {resolution.createdAt
            ? new Date(resolution.createdAt).toLocaleDateString()
            : "N/A"}
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
        }}
      >
        {capitalizeFirstLetter(resolution.status)}
      </span>
    </div>
  );
};

export default ResolutionCard;
