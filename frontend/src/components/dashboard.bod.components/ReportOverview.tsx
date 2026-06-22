import React from "react";
import { useBodStore } from "../../store/create.bod.store";

interface ReportOverviewProps {
  isDarkMode: boolean;
  filter: { type: string; status: string };
}

const ReportOverview: React.FC<ReportOverviewProps> = ({
  isDarkMode,
  filter,
}) => {
  // const reportsData = [
  //   { id: 1, title: 'Annual Financial Report', type: 'Financial', status: 'Pending', uploaded: '2025-05-01T10:00' },
  //   { id: 2, title: 'Q1 Operational Review', type: 'Operational', status: 'Approved', uploaded: '2025-04-15T14:00' },
  //   { id: 3, title: 'Strategic Plan 2025', type: 'Strategic', status: 'Archived', uploaded: '2025-03-10T09:00' },
  // ];
  const { reports } = useBodStore();

  const filteredReports = reports.filter((report) => {
    const matchesType = filter.type === "All" || report.type === filter.type;
    const matchesStatus =
      filter.status === "All" || report.status === filter.status;
    return matchesType && matchesStatus;
  });

  const totalReports = filteredReports.length;
  const pendingReports = filteredReports.filter(
    (r) => r.status === "Pending"
  ).length;

  return (
    <div
      style={{
        backgroundColor: isDarkMode ? "#4b5563" : "white",
        padding: "16px",
        borderRadius: "4px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        marginBottom: "16px",
      }}
    >
      <h3
        style={{
          margin: "0 0 8px 0",
          fontSize: "18px",
          color: isDarkMode ? "white" : "black",
        }}
      >
        Report Overview
      </h3>
      <p
        style={{
          margin: "0",
          fontSize: "20px",
          fontWeight: "bold",
          color: isDarkMode ? "white" : "black",
        }}
      >
        Total Reports: {totalReports}
      </p>
      <p
        style={{
          margin: "4px 0 0 0",
          fontSize: "16px",
          color: pendingReports > 0 ? "#f59e0b" : "#10b981",
        }}
      >
        Pending: {pendingReports} {pendingReports === 1 ? "report" : "reports"}
      </p>
    </div>
  );
};

export default ReportOverview;
