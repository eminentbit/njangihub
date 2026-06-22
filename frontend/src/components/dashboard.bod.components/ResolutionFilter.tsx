import React from "react";
import { useTheme } from "../../context/theme.context"; // Adjust path as needed

interface ResolutionFilterProps {
  filter: string;
  setFilter: (newFilter: string) => void;
}

const ResolutionFilter: React.FC<ResolutionFilterProps> = ({
  filter,
  setFilter,
}) => {
  const { isDarkMode } = useTheme();

  const filters = ["All", "Approved", "Pending", "Rejected"];

  return (
    <div style={{ display: "flex", gap: "8px" }}>
      {filters.map((f) => (
        <button
          type="button"
          key={f}
          onClick={() => setFilter(f)}
          style={{
            padding: "4px 12px",
            backgroundColor:
              filter === f ? "#9333ea" : isDarkMode ? "#4b5563" : "#e5e7eb",
            color: filter === f ? "white" : isDarkMode ? "white" : "black",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          }}
        >
          {f}
        </button>
      ))}
    </div>
  );
};

export default ResolutionFilter;
