import React, { useState, useEffect } from "react";
import { FaUserCircle, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import Sidebar from "../../components/dashboard.admin.components/Sidebar";
import Header from "../../components/dashboard.admin.components/Header";
import useUserStore from "../../store/create.user.store";

const FILTERS = [
  { label: "All", value: "all" },
  { label: "Unread", value: "unread" },
  { label: "Read", value: "read" },
];

const NotificationsPage: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [, setActiveTab] = useState("notifications");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [filter, setFilter] = useState("all");
  const {
    notifications,
    markAllNotificationsAsRead,
    markNotificationAsRead,
    markNotificationAsUnread,
  } = useUserStore();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "all") return true;
    if (filter === "unread") return !n.isRead;
    return n.isRead;
  });

  const toggleSidebar = () => setIsSidebarOpen((v) => !v);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onTabChange={setActiveTab}
        onToggle={toggleSidebar}
        notifications={[]}
        onClose={toggleSidebar}
      />

      {/* Content panel */}
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

        {/* Sticky Header */}
        <Header darkMode={isDarkMode} setDarkMode={setIsDarkMode} someStyles={`${!isSidebarOpen ? "md:ml-10" : "md:ml-0"}`} />

        {/* Scrollable Main */}
        <main className="flex-1 pt-20 pb-8 px-2 md:px-6 overflow-auto min-h-[80vh]">
          <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 md:p-8 mt-2 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                Notifications
              </h2>
              <div className="flex items-center mt-4 sm:mt-0 gap-2">
                {FILTERS.map((f) => (
                  <button
                    type="button"
                    key={f.value}
                    onClick={() => setFilter(f.value)}
                    className={`px-3 py-1 rounded-full text-sm font-semibold border transition 
                      ${
                        filter === f.value
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-600 hover:bg-blue-100 dark:hover:bg-blue-900"
                      }`}
                  >
                    {f.label}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => markAllNotificationsAsRead()}
                  className="ml-2 px-3 py-1 rounded-full text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-800 transition"
                >
                  Mark all as read
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {filteredNotifications.length === 0 && (
                <div className="text-center text-gray-500 dark:text-gray-400 py-12">
                  No notifications.
                </div>
              )}
              {filteredNotifications.map((n) => (
                <div
                  key={n._id}
                  className={`flex items-start space-x-4 p-4 rounded-xl shadow-sm transition-colors group relative overflow-hidden
                    ${
                      n.isRead
                        ? "bg-white dark:bg-gray-700"
                        : "bg-indigo-50 dark:bg-indigo-900 border-l-4 border-blue-500"
                    } animate-fadein`}
                >
                  <div className="flex-shrink-0">
                    {n.user.profilePicUrl ? (
                      <img
                        src={n.user.profilePicUrl}
                        alt={n.user.firstName}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <FaUserCircle className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <span
                          className={`text-gray-800 dark:text-gray-100 ${
                            n.isRead ? "" : "font-semibold"
                          }`}
                        >
                          {n.content}
                        </span>
                        <span className="ml-2 text-xs text-gray-400 dark:text-gray-500">
                          —{`${n.user.firstName} ${n.user.lastName}`}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 ml-1">
                        {n.isRead ? (
                          <button
                            type="button"
                            onClick={() => markNotificationAsUnread(n._id)}
                            className="text-yellow-500 hover:text-yellow-700 transition"
                            title="Mark as unread"
                          >
                            <FaCheckCircle />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => markNotificationAsRead(n._id)}
                            className="text-blue-600 hover:text-blue-800 transition"
                            title="Mark as read"
                          >
                            <FaTimesCircle />
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                      {n.createdAt}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      <style>{`
        .animate-fadein {
          animation: fadeIn .25s;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px);}
          to { opacity: 1; transform: translateY(0);}
        }
      `}</style>
    </div>
  );
};

export default NotificationsPage;
