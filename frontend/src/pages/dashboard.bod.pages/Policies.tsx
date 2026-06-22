import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../context/theme.context";
import Header from "../../components/dashboard.bod.components/Header";
import Sidebar from "../../components/dashboard.bod.components/Sidebar";
import PolicyList from "../../components/dashboard.bod.components/PolicyList";
import PolicyFilter from "../../components/dashboard.bod.components/PolicyFilter";
import CreatePolicyForm from "../../components/dashboard.bod.components/CreatePolicyForm";
import PolicyDetails from "../../components/dashboard.bod.components/PolicyDetails";

const Policies: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [filter, setFilter] = useState({ category: "All", status: "All" });
  const [selectedPolicyId, setSelectedPolicyId] = useState<number | null>(null);
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

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <motion.div
        className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-16"
        } bg-gray-100 dark:bg-gray-800`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.3 } }}
      >
        <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6">
          {/* Top bar */}
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 px-4 py-2 rounded shadow">
              Policies <span className="text-purple-500">📜</span>
            </h1>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleForm}
              className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              {showForm ? "Cancel" : "Add Policy"}
            </motion.button>
          </div>

          {/* Form */}
          <AnimatePresence>
            {showForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
              >
                <CreatePolicyForm isDarkMode={isDarkMode} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Filters */}
          {!showForm && (
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <PolicyFilter filter={filter} setFilter={setFilter} />
            </div>
          )}

          {/* Content */}
          {selectedPolicyId !== null ? (
            <PolicyDetails
              policyId={selectedPolicyId}
              isDarkMode={isDarkMode}
              onBack={() => setSelectedPolicyId(null)}
            />
          ) : (
            <PolicyList
              isDarkMode={isDarkMode}
              filter={filter}
              onSelectPolicy={setSelectedPolicyId}
            />
          )}
        </main>
      </motion.div>
    </div>
  );
};

export default Policies;
