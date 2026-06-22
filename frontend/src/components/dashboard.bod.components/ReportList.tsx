import React from "react";
import ReportCard from "./ReportCard";
import { useBodStore } from "../../store/create.bod.store";

interface ReportListProps {
  isDarkMode: boolean;
  filter: { type: string; status: string };
  onSelectReport: (id: string) => void;
}

const ReportList: React.FC<ReportListProps> = ({
  isDarkMode,
  filter,
  onSelectReport,
}) => {
  // const reportsData = [
  //   { id: 1, title: 'Annual Financial Report', type: 'Financial', status: 'Pending', uploaded: '2025-05-01T10:00', summary: 'Comprehensive financial overview for 2024.' },
  //   { id: 2, title: 'Q1 Operational Review', type: 'Operational', status: 'Approved', uploaded: '2025-04-15T14:00', summary: 'Quarterly operational performance analysis.' },
  //   { id: 3, title: 'Strategic Plan 2025', type: 'Strategic', status: 'Archived', uploaded: '2025-03-10T09:00', summary: 'Strategic goals and initiatives for 2025.' },
  // ];

  const { reports } = useBodStore();

  const filteredReports = reports.filter((report) => {
    const matchesType = filter.type === "All" || report.type === filter.type;
    const matchesStatus =
      filter.status === "All" || report.status === filter.status;
    return matchesType && matchesStatus;
  });

  const isMobile = window.innerWidth < 768;

  return (
    <div
      style={{
        backgroundColor: isDarkMode ? "#4b5563" : "white",
        padding: "16px",
        borderRadius: "4px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        maxHeight: "50vh",
        overflowY: "auto",
      }}
    >
      <h3
        style={{
          margin: "0 0 16px 0",
          fontSize: "18px",
          color: isDarkMode ? "white" : "black",
        }}
      >
        Report List
      </h3>
      {filteredReports.length === 0 ? (
        <p style={{ color: isDarkMode ? "#d1d5db" : "#6b7280" }}>
          No reports found.
        </p>
      ) : (
        filteredReports.map((report, index) => (
          <ReportCard
            key={index}
            report={report}
            isDarkMode={isDarkMode}
            isMobile={isMobile}
            onSelect={() => onSelectReport(report.id)}
          />
        ))
      )}
    </div>
  );
};

export default ReportList;
