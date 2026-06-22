import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../context/theme.context";
import Header from "../../components/dashboard.bod.components/Header";
import Sidebar from "../../components/dashboard.bod.components/Sidebar";
import ResolutionList from "../../components/dashboard.bod.components/ResolutionList";
import ResolutionFilter from "../../components/dashboard.bod.components/ResolutionFilter";
import NewResolutionModal from "../../components/dashboard.bod.components/NewResolutionModal";
import { Plus } from "lucide-react";
import { useBodStore } from "../../store/create.bod.store";

const modalBackdrop = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalContent = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

const Resolutions: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState("All");
  const { isDarkMode, toggleTheme } = useTheme();

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const { fetchResolutions } = useBodStore();

  useEffect(() => {
    const handleResize = () => setIsSidebarOpen(window.innerWidth >= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetchResolutions();
  }, [fetchResolutions]);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div
        className={`flex-1 flex flex-col overflow-hidden ${
          isSidebarOpen ? "ml-64" : "ml-16"
        }`}
      >
        <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Resolutions <span className="text-green-500">📋</span>
            </h1>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={openModal}
              className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              <span className="mr-2 flex">
                <Plus />
                New Resolution
              </span>{" "}
            </motion.button>
          </div>

          <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4 mb-6">
            <ResolutionFilter filter={filter} setFilter={setFilter} />
          </div>

          <ResolutionList isDarkMode={isDarkMode} filter={filter} />

          {/* Modal using Framer Motion */}
          <AnimatePresence>
            {isModalOpen && (
              <motion.div
                className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm"
                variants={modalBackdrop}
                initial="hidden"
                animate="visible"
                exit="hidden"
                onClick={closeModal}
              >
                <motion.div
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full p-6 z-50"
                  variants={modalContent}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  onClick={(e) => e.stopPropagation()}
                >
                  <NewResolutionModal
                    isDarkMode={isDarkMode}
                    onClose={closeModal}
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default Resolutions;
