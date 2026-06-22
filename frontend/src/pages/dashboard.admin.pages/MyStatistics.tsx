import React, { useState, useEffect, useMemo } from "react";
import {
  FaChartLine,
  FaUsers,
  FaMoneyBillWave,
  FaChartPie,
} from "react-icons/fa";
import Sidebar from "../../components/dashboard.admin.components/Sidebar";
import ActivityChart from "../../components/dashboard.admin.components/ActivityChart";
import ContributionChart from "../../components/dashboard.admin.components/ContributionChart";
import Header from "../../components/dashboard.admin.components/Header";
import { useFetchGroups } from "../../hooks/useAdmin";
import { Skeleton } from "../../components/skeleton-loaders/skeleton-card-loader";
import { format } from "date-fns";

// Shimmer effect for content loading
const ShimmerWrapper: React.FC<{
  children: React.ReactNode;
  loading: boolean;
}> = ({ children, loading }) => (
  <div className={`relative ${loading ? "overflow-hidden" : ""}`}>
    {loading && (
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer z-10" />
    )}
    {children}
  </div>
);

// loading card
const LoadingStatCard: React.FC = () => (
  <div className="bg-gradient-to-tr from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-xl shadow p-6 animate-pulse">
    <div className="flex items-center justify-between mb-4">
      <Skeleton className="w-8 h-8 rounded-full" />
      <Skeleton className="w-12 h-6" />
    </div>
    <Skeleton className="h-8 w-20 mb-2" />
    <Skeleton className="h-4 w-24" />
  </div>
);

const StatisticsPage: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [totalMembers, setTotalMembers] = useState(0);
  const [totalContributions, setTotalContribution] = useState(0);
  const [monthlyGrowth, setMonthlyGrowth] = useState("0.0");

  const { groups, isLoading } = useFetchGroups();

  console.log(groups);

  // fetch the totalNumber of memebers
  useEffect(() => {
    const totalMembersCount = groups.reduce(
      (total, group) => total + group?.groupMembers!.length,
      0
    );
    setTotalMembers(totalMembersCount);
  }, [groups]);

  // Toggle Tailwind dark class on <html>
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  // fetch the totalNumber of contribution
  useEffect(() => {
    const totalMembersContributions = groups.reduce(
      (sum, group) =>
        sum +
        group.memberContributions!.reduce(
          (groupSum, member) => groupSum + (member.totalAmountPaid || 0),
          0
        ),
      0
    );
    setTotalContribution(totalMembersContributions);
  }, [groups]);

  const firstGroupId = useMemo(() => groups[0]?._id, [groups]);
  // calculate monthlygrowth
  useEffect(() => {
    const monthlyTotals = new Map<string, number>();

    groups.forEach((group) => {
      const startNjangiDate = group.startDate;
      group.memberContributions?.forEach((contribution) => {
        const date = startNjangiDate!;
        const monthKey = format(date, "yyyy-MM");

        const prev = monthlyTotals.get(monthKey) || 0;
        monthlyTotals.set(monthKey, prev + (contribution.totalAmountPaid || 0));
      });
    });

    // Sort keys to get current and previous months
    const sortedMonths = Array.from(monthlyTotals.keys()).sort();
    const len = sortedMonths.length;

    if (len >= 2) {
      const thisMonthKey = sortedMonths[len - 1];
      const lastMonthKey = sortedMonths[len - 2];

      const thisMonthTotal = monthlyTotals.get(thisMonthKey) || 0;
      const lastMonthTotal = monthlyTotals.get(lastMonthKey) || 0;

      const growth =
        lastMonthTotal === 0
          ? 100 // or 0 depending on the definition
          : ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100;

      setMonthlyGrowth(growth.toFixed(1)); // store in state
    }
  }, [groups]);

  // summary
  const summary = [
    {
      icon: <FaUsers size={28} />,
      label: "Active Members",
      value: totalMembers,
    },
    {
      icon: <FaMoneyBillWave size={28} />,
      label: "Total Contributions",
      value: `${totalContributions} FCFA`,
    },
    {
      icon: <FaChartPie size={28} />,
      label: "Monthly Growth",
      value: `${monthlyGrowth}%`,
    },
  ];

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <div className="flex h-screen bg-white text-gray-800 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-200 overflow-hidden">
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30 lg:hidden"
          onClick={toggleSidebar}
          aria-label="Close sidebar"
        />
      )}

      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
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
        {/* Sticky Header */}
        <Header
          darkMode={isDarkMode}
          setDarkMode={setIsDarkMode}
          someStyles={`${!isSidebarOpen ? "md:ml-10" : "md:ml-0"}`}
        />

        {/* Scrollable Main */}
        <main className="flex-1 pt-20 px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="max-w-5xl mx-auto space-y-8">
            {/* Page Title */}
            <section className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
              <div>
                <h1 className="flex items-center text-3xl font-bold text-blue-700 dark:text-gray-100">
                  <FaChartLine className="mr-2" size={30} /> Statistics
                  Dashboard
                </h1>
                <p className="mt-1 text-gray-600 dark:text-gray-300">
                  Gain insights into your Njangi circle’s performance with
                  real-time metrics and charts.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200 text-xs font-semibold">
                Last updated: {new Date().toLocaleDateString()}
              </span>
            </section>

            {/* Summary Cards */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                <>
                  {[...Array(3)].map((_, i) => (
                    <LoadingStatCard key={i} />
                  ))}
                </>
              ) : (
                <>
                  {summary.map((item, idx) => (
                    <ShimmerWrapper loading={false}>
                      <div
                        key={idx}
                        className="flex items-center space-x-4 bg-white dark:bg-gray-800 rounded-lg shadow p-5 hover:shadow-lg transition"
                      >
                        <div className="p-2 bg-blue-50 dark:bg-gray-700 rounded-full">
                          {item.icon}
                        </div>
                        <div>
                          <p className="text-xl font-semibold dark:text-gray-100">
                            {item.value}
                          </p>
                          <p className="text-sm text-blue-400 dark:text-blue-300">
                            {item.label}
                          </p>
                        </div>
                      </div>
                    </ShimmerWrapper>
                  ))}
                </>
              )}
            </section>

            {/* Charts */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold dark:text-gray-100 mb-4">
                  Activity Over Time
                </h2>
                {!isLoading && groups.length > 0 && (
                  <ActivityChart groupId={firstGroupId} />
                )}
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold dark:text-gray-100 mb-4">
                  💰 Contributions Breakdown
                </h2>
                <ContributionChart />
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StatisticsPage;
