import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../context/theme.context";
import Header from "../../components/dashboard.bod.components/Header";
import Sidebar from "../../components/dashboard.bod.components/Sidebar";
import MinutesList from "../../components/dashboard.bod.components/MinutesList";
import MinutesFilter from "../../components/dashboard.bod.components/MinutesFilter";
import AddMinutesForm from "../../components/dashboard.bod.components/AddMinutesForm";
import MinutesDetails from "../../components/dashboard.bod.components/MinutesDetails";

const MeetingMinutes: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [filter, setFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [selectedMinutesId, setSelectedMinutesId] = useState<number | null>(
    null
  );
  const { isDarkMode, toggleTheme } = useTheme();

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const toggleForm = () => setShowForm((prev) => !prev);

  useEffect(() => {
    const handleResize = () => setIsSidebarOpen(window.innerWidth >= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <main
        className={`flex-1 overflow-y-auto pb-4 md:pb-6 lg:pb-8 transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-16"
        } bg-gray-100 dark:bg-gray-800`}
      >
        <Header toggleTheme={toggleTheme} isDarkMode={isDarkMode} />

        <div className="flex flex-col p-4">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold px-4 py-2 rounded-md shadow bg-white dark:bg-gray-700">
              Meeting Minutes <span className="text-green-500">📝</span>
            </h1>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleForm}
              className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              {showForm ? "Cancel" : "Add Minutes"}
            </motion.button>
          </div>
          <AnimatePresence>
            {showForm && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="mb-6"
              >
                <AddMinutesForm isDarkMode={isDarkMode} />
              </motion.div>
            )}
          </AnimatePresence>
          {!showForm && (
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
              <MinutesFilter filter={filter} setFilter={setFilter} />
            </div>
          )}
          {selectedMinutesId ? (
            <MinutesDetails
              minutesId={selectedMinutesId}
              isDarkMode={isDarkMode}
              onBack={() => setSelectedMinutesId(null)}
            />
          ) : (
            <MinutesList
              isDarkMode={isDarkMode}
              filter={filter}
              onSelectMinutes={setSelectedMinutesId}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default MeetingMinutes;
