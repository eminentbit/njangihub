import React from "react";
import { useBodStore } from "../../store/create.bod.store";

interface BoardOverviewProps {
  style?: React.CSSProperties;
  isDarkMode?: boolean;
}

const BoardOverview: React.FC<BoardOverviewProps> = ({
  style,
  isDarkMode = false,
}) => {
  const { members, resolutions } = useBodStore();

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "16px",
        marginTop: "24px",
        ...style,
      }}
    >
      <div
        style={{
          backgroundColor: isDarkMode ? "#4b5563" : "white",
          padding: "16px",
          borderRadius: "4px",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h3 style={{ color: isDarkMode ? "white" : "black" }}>Board Members</h3>
        <p style={{ fontSize: "30px", color: isDarkMode ? "white" : "black" }}>
          {members.length}
        </p>
      </div>
      <div
        style={{
          backgroundColor: isDarkMode ? "#4b5563" : "white",
          padding: "16px",
          borderRadius: "4px",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h3 style={{ color: isDarkMode ? "white" : "black" }}>
          Resolutions Passed
        </h3>
        <p style={{ fontSize: "30px", color: "#22c55e" }}>
          {resolutions.length}
        </p>
      </div>
      <div
        style={{
          backgroundColor: isDarkMode ? "#4b5563" : "white",
          padding: "16px",
          borderRadius: "4px",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h3 style={{ color: isDarkMode ? "white" : "black" }}>
          Meeting Attendance
        </h3>
        <p style={{ fontSize: "30px", color: "#a855f7" }}>92%</p>
      </div>
    </div>
  );
};

export default BoardOverview;
