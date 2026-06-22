import React, { useState, useEffect } from "react";
import { useTheme } from "../../context/theme.context";
import Header from "../../components/dashboard.bod.components/Header";
import Sidebar from "../../components/dashboard.bod.components/Sidebar";
import DocumentList from "../../components/dashboard.bod.components/DocumentList";
import DocumentFilter from "../../components/dashboard.bod.components/DocumentFilter";
import UploadDocumentForm from "../../components/dashboard.bod.components/UploadDocumentForm";
import DocumentPreview from "../../components/dashboard.bod.components/DocumentPreview";

const Documents: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [filter, setFilter] = useState({ category: "All", period: "All" });
  const [selectedDocumentId, setSelectedDocumentId] = useState<number | null>(
    null
  );
  const { isDarkMode, toggleTheme } = useTheme();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <Header toggleTheme={toggleTheme} isDarkMode={isDarkMode} />

      <div className="flex flex-1 flex-col md:flex-row transition-all duration-300">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

        <main
          className={`flex-1 overflow-y-auto transition-all duration-300 p-4 md:p-6 ${
            isDarkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-900"
          }`}
        >
          <div className="flex items-center gap-4 mb-6">
            {!isSidebarOpen && (
              <button
                type="button"
                onClick={toggleSidebar}
                className={`text-2xl focus:outline-none ${
                  isDarkMode ? "text-white" : "text-purple-800"
                }`}
              >
                ☰
              </button>
            )}
            <h1 className="text-2xl font-bold px-3 py-1 bg-white dark:bg-gray-700 shadow rounded-md">
              Documents <span className="text-green-500">📑</span>
            </h1>
          </div>

          <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center mb-6">
            <DocumentFilter filter={filter} setFilter={setFilter} />
            <UploadDocumentForm isDarkMode={isDarkMode} />
          </div>

          <div className="rounded-xl shadow-inner border border-gray-200 dark:border-gray-600 p-4 bg-white dark:bg-gray-700">
            {selectedDocumentId ? (
              <DocumentPreview
                documentId={selectedDocumentId}
                isDarkMode={isDarkMode}
                onBack={() => setSelectedDocumentId(null)}
              />
            ) : (
              <DocumentList
                isDarkMode={isDarkMode}
                filter={filter}
                onSelectDocument={setSelectedDocumentId}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Documents;
