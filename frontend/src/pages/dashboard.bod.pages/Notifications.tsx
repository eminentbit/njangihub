import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../context/theme.context";
import Header from "../../components/dashboard.bod.components/Header";
import Sidebar from "../../components/dashboard.bod.components/Sidebar";
import NotificationsList from "../../components/dashboard.bod.components/NotificationsList";
import { useBodStore } from "../../store/create.bod.store";
import useUserStore from "../../store/create.user.store";

const Notifications: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { isDarkMode, toggleTheme } = useTheme();
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  const { isLoading, notifications, error } = useBodStore();
  const { fetchNotifications } = useUserStore();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // auto collapse sidebar on mobile
  useEffect(() => {
    const onResize = () => setIsSidebarOpen(window.innerWidth >= 768);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "tween", duration: 0.3 }}
          ></motion.div>
        )}
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      </AnimatePresence>

      {/* Main content */}
      <motion.div
        className={`flex-1 flex flex-col overflow-hidden ${
          isSidebarOpen ? "ml-64" : "ml-16"
        }`}
        animate={{ marginLeft: isSidebarOpen ? 0 : 0 }}
      >
        <div className={`flex flex-col ${isSidebarOpen ? "ml-64" : "ml-16"}`}>
          <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={toggleSidebar}
                  className="md:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  aria-label="Toggle sidebar"
                >
                  ☰
                </button>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Notifications <span className="text-green-500">🔔</span>
                </h1>
              </div>
            </div>
            {isLoading ? (
              <div className="text-center text-gray-500 dark:text-gray-400">
                Loading notifications...
              </div>
            ) : error ? (
              <div className="text-center text-red-500">Error: {error}</div>
            ) : (
              <NotificationsList
                isDarkMode={isDarkMode}
                notifications={notifications}
              />
            )}
          </main>
        </div>
      </motion.div>
    </div>
  );
};

export default Notifications;
