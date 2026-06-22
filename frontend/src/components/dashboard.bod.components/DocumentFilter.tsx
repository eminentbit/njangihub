import React from "react";
import { useTheme } from "../../context/theme.context"; // Adjust path as needed

interface DocumentFilterProps {
  filter: { category: string; period: string };
  setFilter: (newFilter: { category: string; period: string }) => void;
}

const DocumentFilter: React.FC<DocumentFilterProps> = ({
  filter,
  setFilter,
}) => {
  const { isDarkMode } = useTheme();
  const isMobile = window.innerWidth < 768;

  const categories = ["All", "Reports", "Minutes", "Policies"];
  const periods = ["All", "This Year", "Last Year"];

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
        title="Filter Period"
        value={filter.period}
        onChange={(e) => setFilter({ ...filter, period: e.target.value })}
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
        {periods.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DocumentFilter;
