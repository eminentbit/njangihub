import React from "react";
import { useTheme } from "../../context/theme.context"; // Adjust path as needed

interface MinutesFilterProps {
  filter: string;
  setFilter: (newFilter: string) => void;
}

const MinutesFilter: React.FC<MinutesFilterProps> = ({ filter, setFilter }) => {
  const { isDarkMode } = useTheme();
  const isMobile = window.innerWidth < 768;

  const filters = ["All", "Draft", "Approved", "Archived"];

  return (
    <div
      style={{
        display: "flex",
        gap: "8px",
        flexWrap: isMobile ? "wrap" : "nowrap",
        justifyContent: isMobile ? "center" : "flex-start",
      }}
    >
      {filters.map((f) => (
        <button
          type="button"
          key={f}
          onClick={() => setFilter(f)}
          style={{
            padding: isMobile ? "4px 8px" : "4px 12px",
            backgroundColor:
              filter === f ? "#9333ea" : isDarkMode ? "#4b5563" : "#e5e7eb",
            color: filter === f ? "white" : isDarkMode ? "white" : "black",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            fontSize: isMobile ? "12px" : "14px",
          }}
        >
          {f}
        </button>
      ))}
    </div>
  );
};

export default MinutesFilter;
