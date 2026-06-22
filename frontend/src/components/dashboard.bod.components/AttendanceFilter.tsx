import React from "react";
import { useTheme } from "../../context/theme.context"; // Adjust path as needed

interface AttendanceFilterProps {
  filter: { period: string; member: string };
  setFilter: (newFilter: { period: string; member: string }) => void;
}

const AttendanceFilter: React.FC<AttendanceFilterProps> = ({
  filter,
  setFilter,
}) => {
  const { isDarkMode } = useTheme();
  const isMobile = window.innerWidth < 768;

  const periods = ["All", "This Month", "Last Month"];
  const members = [
    "All",
    "Alice Smith",
    "Bob Johnson",
    "Clara Lee",
    "David Brown",
    "Emma Wilson",
    "Frank Davis",
    "Grace Kim",
    "Henry Adams",
    "Isabel Clark",
  ];

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
        {periods.map((p) => (
          <button
            type="button"
            key={p}
            onClick={() => setFilter({ ...filter, period: p })}
            style={{
              padding: isMobile ? "4px 8px" : "4px 12px",
              backgroundColor:
                filter.period === p
                  ? "#9333ea"
                  : isDarkMode
                  ? "#4b5563"
                  : "#e5e7eb",
              color:
                filter.period === p ? "white" : isDarkMode ? "white" : "black",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
              fontSize: isMobile ? "12px" : "14px",
            }}
          >
            {p}
          </button>
        ))}
      </div>
      <select
        title="Filter Member"
        value={filter.member}
        onChange={(e) => setFilter({ ...filter, member: e.target.value })}
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
        {members.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>
    </div>
  );
};

export default AttendanceFilter;
