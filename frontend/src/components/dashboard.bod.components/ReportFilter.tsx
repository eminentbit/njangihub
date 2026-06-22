import React from "react";
import { useTheme } from "../../context/theme.context"; // Adjust path as needed

interface ReportFilterProps {
  filter: { type: string; status: string };
  setFilter: (newFilter: { type: string; status: string }) => void;
}

const ReportFilter: React.FC<ReportFilterProps> = ({ filter, setFilter }) => {
  const { isDarkMode } = useTheme();
  const isMobile = window.innerWidth < 768;

  const types = ["All", "Financial", "Operational", "Strategic"];
  const statuses = ["All", "Pending", "Approved", "Archived"];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        gap: "8px",
        flexWrap: isMobile ? "wrap" : "nowrap",
        justifyContent: isMobile ? "center" : "flex-start",
        marginBottom: isMobile ? "8px" : "0",
      }}
    >
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {types.map((t) => (
          <button
            type="button"
            key={t}
            onClick={() => setFilter({ ...filter, type: t })}
            style={{
              padding: isMobile ? "4px 8px" : "4px 12px",
              backgroundColor:
                filter.type === t
                  ? "#9333ea"
                  : isDarkMode
                  ? "#4b5563"
                  : "#e5e7eb",
              color:
                filter.type === t ? "white" : isDarkMode ? "white" : "black",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
              fontSize: isMobile ? "12px" : "14px",
            }}
          >
            {t}
          </button>
        ))}
      </div>
      <select
        title="Filter Status"
        value={filter.status}
        onChange={(e) => setFilter({ ...filter, status: e.target.value })}
        style={{
          padding: "4px 8px",
          backgroundColor: isDarkMode ? "#4b5563" : "#e5e7eb",
          color: isDarkMode ? "white" : "black",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          fontSize: isMobile ? "12px" : "14px",
        }}
      >
        {statuses.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ReportFilter;
