import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../context/theme.context";
import Sidebar from "../../components/dashboard.bod.components/Sidebar";
import Header from "../../components/dashboard.bod.components/Header";
import BoardOverview from "../../components/dashboard.bod.components/BoardOverview";
import ResolutionVoting from "../../components/dashboard.bod.components/ResolutionVoting";
import AttendanceRate from "../../components/dashboard.bod.components/AttendanceRate";
import RecentResolutions from "../../components/dashboard.bod.components/RecentResolutions";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { useBodStore } from "../../store/create.bod.store";

const Dashboard: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { fetchMembers, fetchReports, fetchResolutions } = useBodStore();

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  useEffect(() => {
    fetchResolutions();
  }, [fetchResolutions]);

  // Auto-close sidebar on mobile
  useEffect(() => {
    const handleResize = () => setIsSidebarOpen(window.innerWidth >= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Framer Motion variants
  const containerVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { staggerChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div
        className={`flex-1 flex flex-col overflow-hidden ${
          isSidebarOpen ? "ml-64" : "ml-16"
        }`}
      >
        <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={toggleSidebar}
              className="md:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              aria-label="Toggle sidebar"
            >
              <span className="text-2xl">☰</span>
            </button>
            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Board Dashboard <span className="text-green-500">📊</span>
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Monitor board activities and make informed decisions.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              onClick={() => navigate("/board/resolutions")}
            >
              <span className="mr-2">
                <Plus />
              </span>{" "}
              New Resolution
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              onClick={() => navigate("/board/schedule")}
            >
              <span className="mr-2">📅</span> Schedule Meeting
            </motion.button>
          </div>

          <motion.section
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
          >
            <motion.div variants={itemVariants}>
              <BoardOverview isDarkMode={isDarkMode} />
            </motion.div>
          </motion.section>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <motion.div
              variants={itemVariants}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4"
            >
              <ResolutionVoting isDarkMode={isDarkMode} />
            </motion.div>
            <motion.div
              variants={itemVariants}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4"
            >
              <AttendanceRate isDarkMode={isDarkMode} />
            </motion.div>
            <motion.div
              variants={itemVariants}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4"
            >
              <RecentResolutions isDarkMode={isDarkMode} />
            </motion.div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
