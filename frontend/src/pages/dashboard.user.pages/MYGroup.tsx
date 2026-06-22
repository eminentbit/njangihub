import { useState, useEffect } from "react";
import { HiX } from "react-icons/hi";
import { useFetchGroups } from "../../hooks/useAdmin";
import Sidebar from "../../components/dashboard.admin.components/Sidebar";
import Header from "../../components/dashboard.admin.components/Header";
import CreateGroupButton from "../../components/dashboard.admin.components/ui/create.group.button";
import GroupItem from "../../components/dashboard.user.components/GroupItem";
import ChatInterface from "../../components/dashboard.user.components/chat-interface";
import { useAuthStore } from "../../store/create.auth.store";

// Loading Skeleton Component
const GroupItemSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 animate-pulse">
    <div className="flex justify-between items-start mb-4">
      <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
    </div>

    <div className="space-y-3 mb-6">
      <div className="flex items-center gap-2">
        <div className="h-4 w-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-20"></div>
      </div>
      <div className="flex items-center gap-2">
        <div className="h-4 w-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
      </div>
    </div>

    <div className="flex gap-2">
      <div className="h-9 bg-gray-300 dark:bg-gray-600 rounded-lg flex-1"></div>
      <div className="h-9 bg-gray-300 dark:bg-gray-600 rounded-lg flex-1"></div>
    </div>
  </div>
);

const MyGroups = () => {
  // Modal state
  const [chatModalGroupId, setChatModalGroupId] = useState<string | null>(null);

  // Dark mode state
  const [darkMode, setDarkMode] = useState(false);
  // Sidebar open state
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Load persisted dark mode
  useEffect(() => {
    if (localStorage.getItem("dark-mode") === "true") {
      setDarkMode(true);
    }
  }, []);

  // Apply/remove `dark` class and persist
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("dark-mode", "true");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("dark-mode", "false");
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  // For shifting content with sidebar
  const offsetClass = sidebarOpen ? "lg:ml-64" : "lg:ml-16";

  const { groups, isLoading, error } = useFetchGroups();
  const { user } = useAuthStore();

  const adminGroupsCount = groups.filter(
    (group) => group.adminId == user?._id
  ).length;

  // Find the group being chatted
  const chatGroup = groups.find((g) => g._id === chatModalGroupId);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={toggleSidebar}
        onClose={closeSidebar}
      />

      {/* Main content area */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${offsetClass}`}
      >
        {/* Header */}
        <Header darkMode={darkMode} setDarkMode={toggleDarkMode} />

        {/* Page content */}
        <main
          className={`flex-1 transition-all duration-300 min-h-screen dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 overflow-auto 
          ${sidebarOpen ? "lg:ml-4" : "lg:ml-6"} p-6`}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-6">
            <h1 className="text-3xl md:text-4xl font-bold text-blue-700 dark:text-white">
              My Groups 
            </h1>
            <CreateGroupButton adminGroupsCount={adminGroupsCount} />
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <GroupItemSkeleton key={i} />
              ))}
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 max-w-md mx-auto">
                <div className="text-red-600 dark:text-red-400 text-4xl mb-4">
                  ⚠️
                </div>
                <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2">
                  Failed to load groups
                </h3>
                <p className="text-red-600 dark:text-red-400 mb-4">
                  {error.message ||
                    "Something went wrong while fetching your groups."}
                </p>
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* Groups Grid */}
          {!isLoading && !error && (
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {groups.map((group) => (
                <GroupItem
                  key={group._id}
                  group={group}
                  setChatModalGroupId={() => setChatModalGroupId(group?._id)}
                />
              ))}
            </section>
          )}

          {/* Empty State */}
          {!isLoading && !error && groups.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 dark:text-gray-600 text-6xl mb-4">
                👥
              </div>
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                No groups yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Create your first group to get started with collaboration.
              </p>
              <CreateGroupButton adminGroupsCount={0} />
            </div>
          )}
        </main>
      </div>

      {/* Chat Modal */}
      {chatModalGroupId && chatGroup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/60 backdrop-blur-sm"
          onClick={() => setChatModalGroupId(null)}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-6 relative transform transition-all duration-300 scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              type="button"
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              onClick={() => setChatModalGroupId(null)}
              aria-label="Close chat"
            >
              <HiX className="w-6 h-6" />
            </button>

            {/* Modal header */}
            <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white pr-8">
              {chatGroup.name} Chat
            </h2>

            {/* Chat content */}
            <div className="max-h-[60vh] overflow-y-auto">
              <ChatInterface
                groupId={chatGroup._id}
                groupName={chatGroup.name || ""}
                onClose={() => setChatModalGroupId(null)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyGroups;
