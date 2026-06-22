import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../context/theme.context";
import Header from "../../components/dashboard.bod.components/Header";
import Sidebar from "../../components/dashboard.bod.components/Sidebar";
import MeetingList from "../../components/dashboard.bod.components/MeetingList";
import MeetingFilter from "../../components/dashboard.bod.components/MeetingFilter";
import ScheduleMeetingForm from "../../components/dashboard.bod.components/ScheduleMeetingForm";
import { useBodStore } from "../../store/create.bod.store";

const MeetingSchedule: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [filter, setFilter] = useState<string>("All");
  const [showForm, setShowForm] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();
  const { listMeetings } = useBodStore();

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const toggleForm = () => setShowForm((prev) => !prev);

  useEffect(() => {
    const onResize = () => setIsSidebarOpen(window.innerWidth >= 768);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    listMeetings();
  }, [listMeetings]);

  const containerVariants = {
    visible: { transition: { type: "spring", stiffness: 70, damping: 15 } },
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <motion.div
        className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-16"
        }`}
        variants={containerVariants}
        initial="visible"
        animate="visible"
      >
        <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6">
          {/* Title and Action */}
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Meeting Schedule <span className="text-green-500">📅</span>
            </h1>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleForm}
              className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              {showForm ? "Cancel" : "Schedule Now"}
            </motion.button>
          </div>

          {/* Conditional Form */}
          <AnimatePresence>
            {showForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6"
              >
                <ScheduleMeetingForm isDarkMode={isDarkMode} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Filter and List */}
          {!showForm && (
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
              <MeetingFilter filter={filter} setFilter={setFilter} />
            </div>
          )}

          <section className="space-y-4">
            <MeetingList isDarkMode={isDarkMode} filter={filter} />
          </section>
        </main>
      </motion.div>
    </div>
  );
};

export default MeetingSchedule;
