import React from "react";
import { useTheme } from "../../context/theme.context"; // Adjust path as needed

interface PolicyFilterProps {
  filter: { category: string; status: string };
  setFilter: (newFilter: { category: string; status: string }) => void;
}

const PolicyFilter: React.FC<PolicyFilterProps> = ({ filter, setFilter }) => {
  const { isDarkMode } = useTheme();
  const isMobile = window.innerWidth < 768;

  const categories = ["All", "Governance", "Financial", "Operational"];
  const statuses = ["All", "Active", "Draft", "Archived"];

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
        {categories.map((c) => (
          <button
            type="button"
            key={c}
            onClick={() => setFilter({ ...filter, category: c })}
            style={{
              padding: isMobile ? "4px 8px" : "4px 12px",
              backgroundColor:
                filter.category === c
                  ? "#9333ea"
                  : isDarkMode
                  ? "#4b5563"
                  : "#e5e7eb",
              color:
                filter.category === c
                  ? "white"
                  : isDarkMode
                  ? "white"
                  : "black",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
              fontSize: isMobile ? "12px" : "14px",
            }}
          >
            {c}
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

export default PolicyFilter;
