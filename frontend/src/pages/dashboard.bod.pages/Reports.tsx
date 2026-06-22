import React, { useState, useEffect } from "react";
import { useTheme } from "../../context/theme.context";
import Header from "../../components/dashboard.bod.components/Header";
import Sidebar from "../../components/dashboard.bod.components/Sidebar";
import ReportOverview from "../../components/dashboard.bod.components/ReportOverview";
import ReportList from "../../components/dashboard.bod.components/ReportList";
import ReportFilter from "../../components/dashboard.bod.components/ReportFilter";
import AddReportForm from "../../components/dashboard.bod.components/AddReportForm";
import ReportDetails from "../../components/dashboard.bod.components/ReportDetails";
import { useBodStore } from "../../store/create.bod.store";

const Reports: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [filter, setFilter] = useState({ type: "All", status: "All" });
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const toggleForm = () => setShowForm((prev) => !prev);

  useEffect(() => {
    const handleResize = () => setIsSidebarOpen(window.innerWidth >= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { fetchReports } = useBodStore();

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          isOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          // className="shadow-md"
        />
        <div
          className={`flex flex-col w-full ${
            isSidebarOpen ? "ml-64" : "ml-16"
          }`}
        >
          <Header toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
          <main
            className={`flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 transition-all bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100`}
          >
            {/* Title Bar */}
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">
                Reports <span className="text-green-500">📊</span>
              </h1>
              <button
                type="button"
                onClick={toggleForm}
                className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {showForm ? "Cancel" : "Add New Report"}
              </button>
            </div>
            {/* Form & Filters */}
            {showForm ? (
              <div className="mb-6">
                <AddReportForm isDarkMode={isDarkMode} />
              </div>
            ) : (
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                <ReportFilter filter={filter} setFilter={setFilter} />
              </div>
            )}
            {/* Content */}
            {selectedReportId ? (
              <ReportDetails
                reportId={selectedReportId}
                isDarkMode={isDarkMode}
                onBack={() => setSelectedReportId(null)}
              />
            ) : (
              <>
                <ReportOverview isDarkMode={isDarkMode} filter={filter} />
                <ReportList
                  isDarkMode={isDarkMode}
                  filter={filter}
                  onSelectReport={setSelectedReportId}
                />
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Reports;
