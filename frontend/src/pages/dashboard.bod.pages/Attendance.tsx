import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../context/theme.context";
import Sidebar from "../../components/dashboard.bod.components/Sidebar";
import Header from "../../components/dashboard.bod.components/Header";
import AttendanceOverview from "../../components/dashboard.bod.components/AttendanceOverview";
import AttendanceFilter from "../../components/dashboard.bod.components/AttendanceFilter";
import AttendanceList from "../../components/dashboard.bod.components/AttendanceList";
import MemberAttendanceDetails from "../../components/dashboard.bod.components/MemberAttendanceDetails";

const Attendance: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [filter, setFilter] = useState({ period: "All", member: "All" });
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [showFilter, setShowFilter] = useState(true);
  const { isDarkMode, toggleTheme } = useTheme();

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  useEffect(() => {
    const handleResize = () => setIsSidebarOpen(window.innerWidth >= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div
        className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-16"
        }`}
      >
        {/* Header below sidebar */}
        <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

        <main className={`flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 `}>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 px-4 py-2 rounded-md shadow">
              Attendance <span className="text-green-500">👥</span>
            </h1>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilter((prev) => !prev)}
              className="inline-flex items-center px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              {showFilter ? "Hide Filters" : "Show Filters"}
            </motion.button>
          </div>

          <AnimatePresence>
            {showFilter && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-6"
              >
                <AttendanceFilter filter={filter} setFilter={setFilter} />
              </motion.div>
            )}
          </AnimatePresence>

          {selectedMember ? (
            <MemberAttendanceDetails
              member={selectedMember}
              isDarkMode={isDarkMode}
              onBack={() => setSelectedMember(null)}
            />
          ) : (
            <>
              <AttendanceOverview isDarkMode={isDarkMode} filter={filter} />
              <AttendanceList
                isDarkMode={isDarkMode}
                filter={filter}
                onSelectMember={setSelectedMember}
              />
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Attendance;
