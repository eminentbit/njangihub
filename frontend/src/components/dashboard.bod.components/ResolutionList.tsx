import React from "react";
import ResolutionCard from "./ResolutionCard";
import { useBodStore } from "../../store/create.bod.store";

interface ResolutionListProps {
  isDarkMode: boolean;
  filter: string;
}

const ResolutionList: React.FC<ResolutionListProps> = ({
  isDarkMode,
  filter,
}) => {
  // const resolutions = [
  //   { id: 1, title: 'Strategic Plan 2025', status: 'Approved', date: '2025-04-15', description: 'Approval of the 5-year strategic plan.' },
  //   { id: 2, title: 'Budget Allocation Q2', status: 'Pending', date: '2025-04-20', description: 'Review and approve Q2 budget allocation.' },
  //   { id: 3, title: 'New Board Member Election', status: 'Rejected', date: '2025-04-10', description: 'Vote on new board member candidacy.' },
  // ];

  const { resolutions } = useBodStore();

  const filteredResolutions =
    filter === "All"
      ? resolutions
      : resolutions.filter((res) => res.status === filter);

  return (
    <div
      style={{
        backgroundColor: isDarkMode ? "#4b5563" : "white",
        padding: "16px",
        borderRadius: "4px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h3
        style={{
          margin: "0 0 16px 0",
          fontSize: "18px",
          color: isDarkMode ? "white" : "black",
        }}
      >
        Resolutions
      </h3>
      {filteredResolutions.length === 0 ? (
        <p style={{ color: isDarkMode ? "#d1d5db" : "#6b7280" }}>
          No resolutions found.
        </p>
      ) : (
        filteredResolutions.map((resolution, index) => (
          <ResolutionCard
            key={index}
            resolution={resolution}
            isDarkMode={isDarkMode}
          />
        ))
      )}
    </div>
  );
};

export default ResolutionList;
