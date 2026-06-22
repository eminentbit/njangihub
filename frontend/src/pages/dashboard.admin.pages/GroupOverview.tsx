import React, { useState, useEffect } from "react";
import {
  FaUsers,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaRegClock,
} from "react-icons/fa";
import Sidebar from "../../components/dashboard.admin.components/Sidebar";
import Header from "../../components/dashboard.admin.components/Header";
import { useNavigate, useParams } from "react-router-dom";
import { Cog } from "lucide-react";
import getRoleName from "../../utils/roles";
import { useAuthStore } from "../../store/create.auth.store";
import { useGroupActivities, useGroupInfo } from "../../hooks/useAdmin";

// Skeleton Component
const Skeleton: React.FC<{ className?: string; animate?: boolean }> = ({
  className = "",
  animate = true,
}) => (
  <div
    className={`bg-gray-200 dark:bg-gray-700 rounded ${
      animate ? "animate-pulse" : ""
    } ${className}`}
  />
);

// Loading Card Component
const LoadingCard: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-3">
    {children}
  </div>
);

// Loading Table Row Component
const LoadingTableRow: React.FC = () => (
  <tr className="animate-pulse">
    {[1, 2, 3, 4, 5].map((i) => (
      <td key={i} className="px-6 py-4">
        <Skeleton className="h-4 w-full" />
      </td>
    ))}
  </tr>
);

function formatDate(dateStr: string) {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Date(dateStr).toLocaleDateString(undefined, options);
}

const GroupOverviewPage: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [, setActiveTab] = useState<string>("/overview");
  const [isDarkMode, setDarkMode] = useState<boolean>(false);
  const { groupId } = useParams();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const { groupInfo, loading: groupInfoLoading } = useGroupInfo(groupId!);
  const { activities: groupRecentActivities, loading: activitiesLoading } =
    useGroupActivities(groupId!);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <div
      className={`flex h-screen bg-white text-gray-800 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-200`}
    >
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-30 lg:hidden"
          onClick={toggleSidebar}
          aria-label="Close sidebar overlay"
        />
      )}

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
         flex-1 h-full
          transition-all duration-300
          ${isSidebarOpen ? "lg:ml-44" : "ml-0"}
          overflow-y-auto
          md:px-16 px-10 py-0
        `}
      >
        {/* Sticky Header */}
        <Header darkMode={isDarkMode} setDarkMode={setDarkMode} />

        {/* Scrollable main area */}
        <main className="flex-1 pt-15 bg-white sm:px-4 md:px-16 transition-all duration-200">
          <div className="mx-auto max-w-5xl">
            <header className="mb-8 sm:mb-8">
              <h1 className="text-3xl font-bold text-blue-700 mb-2">
                Group Overview
              </h1>
              <div className="flex justify-between items-center">
                <p className="text-gray-600 dark:text-gray-300 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 16h-1v-4h-1m1-4h.01M12 20c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z"
                    />
                  </svg>
                  Summary and recent activities for your Njangi circle
                </p>
                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      `/${getRoleName(user?.role)}/group/${groupId}/settings`
                    )
                  }
                  className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                  disabled={groupInfoLoading}
                >
                  <Cog />
                  <span className="font-medium">Settings</span>
                </button>
              </div>
            </header>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Group Info Card */}
              {groupInfoLoading ? (
                <LoadingCard>
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <Skeleton className="h-6 w-32" />
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <div className="flex flex-wrap gap-4">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </LoadingCard>
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-3 transform transition-all duration-300 hover:shadow-lg">
                  <div className="flex items-center gap-3">
                    <FaUsers className="text-blue-500 text-2xl animate-bounce" />
                    <h2 className="text-xl font-bold text-blue-800 dark:text-gray-100">
                      {groupInfo?.name}
                    </h2>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">
                    {groupInfo?.description}
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <FaCalendarAlt /> Created:{" "}
                      {groupInfo?.createdAt
                        ? new Date(groupInfo.createdAt).toLocaleDateString()
                        : "N/A"}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaUsers /> Members: {groupInfo?.groupMembers.length}
                    </span>
                  </div>
                </div>
              )}

              {/* Financial Info Card */}
              {groupInfoLoading ? (
                <LoadingCard>
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-24" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-32" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </div>
                </LoadingCard>
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4 transform transition-all duration-300 hover:shadow-lg">
                  <div className="flex items-center gap-3">
                    <FaMoneyBillWave className="text-green-500 text-2xl animate-pulse" />
                    <div>
                      <div className="text-lg font-semibold text-green-700 dark:text-green-300">
                        CFA {groupInfo?.totalFunds}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Total Funds
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaRegClock
                      className="text-indigo-500 text-2xl animate-spin"
                      style={{ animationDuration: "3s" }}
                    />
                    <div>
                      <div className="text-lg font-semibold text-indigo-700 dark:text-indigo-300">
                        {groupInfo?.nextMeeting
                          ? formatDate(groupInfo.nextMeeting)
                          : "N/A"}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Next Meeting
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Rules */}
            <section className="mb-8">
              <h3 className="text-lg font-bold text-blue-700 dark:text-gray-100 mb-2">
                Group Rules
              </h3>
              {groupInfoLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-start gap-2">
                      <Skeleton className="h-2 w-2 rounded-full mt-2" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  ))}
                </div>
              ) : (
                <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-gray-300">
                  {groupInfo?.rules}
                </ul>
              )}
            </section>

            {/* Recent Activities */}
            <section>
              <h3 className="text-lg font-bold text-blue-700 dark:text-gray-100 mb-4">
                Recent Activities
              </h3>

              {/* Desktop Table */}
              <div className="hidden sm:block overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow transform transition-all duration-300 hover:shadow-lg">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      {["Date", "Type", "Member", "Amount", "Note"].map(
                        (col) => (
                          <th
                            key={col}
                            className="px-6 py-3 text-left text-sm font-medium text-blue-500 dark:text-gray-400 uppercase"
                          >
                            {col}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {activitiesLoading
                      ? // Loading rows
                        Array.from({ length: 4 }).map((_, index) => (
                          <LoadingTableRow key={index} />
                        ))
                      : // Actual data
                        groupRecentActivities.map((act, index) => (
                          <tr
                            key={index}
                            className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 transform hover:scale-[1.01]"
                          >
                            <td className="px-6 py-4 text-sm">
                              {formatDate(act.date)}
                            </td>
                            <td className="px-6 py-4 text-sm">{act.type}</td>
                            <td className="px-6 py-4 text-sm">{act.user}</td>
                            <td className="px-6 py-4 text-sm">
                              {act.amount != null ? (
                                <span
                                  className={`font-semibold transition-colors duration-200 ${
                                    act.type === "Withdrawal"
                                      ? "text-red-600 dark:text-red-400"
                                      : "text-green-700 dark:text-green-300"
                                  }`}
                                >
                                  ₦{act.amount.toLocaleString()}
                                </span>
                              ) : (
                                "--"
                              )}
                            </td>
                            <td className="px-6 py-4 text-sm">{act.note}</td>
                          </tr>
                        ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="sm:hidden space-y-4">
                {activitiesLoading
                  ? // Loading cards for mobile
                    Array.from({ length: 3 }).map((_, index) => (
                      <div
                        key={index}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 animate-pulse"
                      >
                        <div className="flex justify-between mb-2">
                          <Skeleton className="h-4 w-20" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                        <Skeleton className="h-4 w-24 mb-2" />
                        <Skeleton className="h-4 w-16 mb-2" />
                        <Skeleton className="h-3 w-full" />
                      </div>
                    ))
                  : // Actual mobile cards (you can uncomment and populate this)
                    groupRecentActivities.map((act, index) => (
                      <div
                        key={index}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 transform transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
                      >
                        <div className="flex justify-between mb-2">
                          <span className="font-semibold text-blue-600 dark:text-blue-300">
                            {act.type}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDate(act.date)}
                          </span>
                        </div>
                        <div className="text-sm text-gray-700 dark:text-gray-200">
                          By: {act.user}
                        </div>
                        {act.amount != null && (
                          <div
                            className={`mt-1 font-semibold transition-colors duration-200 ${
                              act.type === "Withdrawal"
                                ? "text-red-600 dark:text-red-400"
                                : "text-green-700 dark:text-green-300"
                            }`}
                          >
                            ₦{act.amount.toLocaleString()}
                          </div>
                        )}
                        <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          {act.note}
                        </div>
                      </div>
                    ))}
              </div>

              {/* Empty state when no activities and not loading */}
              {!activitiesLoading && groupRecentActivities.length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <div className="text-4xl mb-2">📝</div>
                  <p>No recent activities found</p>
                </div>
              )}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default GroupOverviewPage;
