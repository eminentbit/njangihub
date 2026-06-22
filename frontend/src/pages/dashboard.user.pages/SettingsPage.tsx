import  { useState, useEffect } from "react";
import Sidebar from "../../components/dashboard.admin.components/Sidebar";
import Header from "../../components/dashboard.admin.components/Header";
import Settings from "../../components/dashboard.user.components/Settings";

export default function SettingsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("dark-mode") === "true"
  );

  // sync dark mode to <html> and localStorage
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("dark-mode", darkMode ? "true" : "false");
  }, [darkMode]);

  const toggleSidebar = () => setIsSidebarOpen((v) => !v);
  const toggleDarkMode = () => setDarkMode((dm) => !dm);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={toggleSidebar}
        onClose={toggleSidebar}
        onTabChange={() => {}}
        notifications={[]}
      />

      {/* Main content panel */}
      <div
        className={`
          flex flex-col flex-1 h-full
          ${isSidebarOpen ? "lg:ml-64" : "ml-0"}
          transition-all duration-300
          overflow-y-auto
        `}
      >
        {/* Mobile overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
            onClick={toggleSidebar}
            aria-label="Close sidebar overlay"
          />
        )}

        {/* Header */}
        <Header
          darkMode={darkMode}
          setDarkMode={toggleDarkMode}
          someStyles={`${!isSidebarOpen ? "md:ml-10" : "md:ml-0"}`}
        />

        {/* Page body */}
        <main className="flex-1 pt-20 pb-8 px-2 md:px-6 overflow-auto min-h-[80vh]">
          <Settings />
        </main>
      </div>
    </div>
  );
}
