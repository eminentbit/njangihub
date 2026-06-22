import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUsers,
  FaMoneyBillWave,
  FaChartPie,
  FaHandHoldingUsd,
  FaArrowRight,
  FaUserCircle,
} from "react-icons/fa";

import Sidebar from "../../components/dashboard.admin.components/Sidebar";
import StatCard from "../../components/dashboard.admin.components/StatCard";
import ContributionChart from "../../components/dashboard.admin.components/ContributionChart";
import ActivityChart from "../../components/dashboard.admin.components/ActivityChart";
import { quickActions } from "../../utils/data.admin.dashboard";

// Import the new Header component
import Header from "../../components/dashboard.admin.components/Header";
import { useFetchGroups, useGroupActivities } from "../../hooks/useAdmin";
import { getNextPayout } from "../../utils/payout";
import LatestMembersModal from "../../components/dashboard.admin.components/LatestMembersModal";
import { useAuthStore } from "../../store/create.auth.store";
import toast from "react-hot-toast";
import { Skeleton } from "../../components/skeleton-loaders/skeleton-card-loader";
import getActivityIcon from "../../utils/activityIcon";

// Loading Stat Card Component
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

// Loading Chart Component
const LoadingChart = ({ title }: { title: string }) => (
  <div
    title={title}
    className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 animate-pulse"
  >
    <Skeleton className="h-5 w-32 mb-4" />
    <div className="space-y-3">
      <Skeleton className="h-32 w-full" />
      <div className="flex justify-between">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  </div>
);

// Loading Activity Item
const LoadingActivityItem: React.FC = () => (
  <li className="flex items-start gap-3 animate-pulse">
    <Skeleton className="w-6 h-6 rounded-full mt-1" />
    <div className="flex-1">
      <div className="flex gap-2 mb-1">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-32" />
      </div>
      <Skeleton className="h-3 w-16" />
    </div>
  </li>
);

// Loading Member Item
const LoadingMemberItem = ({ title }: { title: string }) => (
  <li
    title={title}
    className="flex items-center py-2 border-b border-gray-100 dark:border-gray-700 animate-pulse"
  >
    <Skeleton className="w-8 h-8 rounded-full mr-3" />
    <div className={"flex-1"}>
      <Skeleton className="h-4 w-24 mb-1" />
      <Skeleton className="h-3 w-16" />
    </div>
  </li>
);

// Loading Info Card
const LoadingInfoCard: React.FC<{ title: string; className?: string }> = ({
  className = "",
}) => (
  <div
    className={`bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 animate-pulse ${className}`}
  >
    <Skeleton className="h-5 w-32 mb-4" />
    <div className="space-y-3">
      <div className="space-y-2">
        <Skeleton className="h-8 w-28" />
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-3 w-32" />
      </div>
    </div>
  </div>
);

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

export const AdminDashboardPage: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("admin");
  const [darkMode, setDarkMode] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false); //latest member modal

  // const { groups, isLoading } = useFetchGroups();
  const [totalMembers, setTotalMembers] = useState(0);
  const [totalContributions, setTotalContribution] = useState(0);

  const { groups, isLoading } = useFetchGroups();

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    const hasSeenWelcome = sessionStorage.getItem("hasSeenWelcomeToast");

    if (!hasSeenWelcome) {
      timeout = setTimeout(() => {
        toast.success("Glad to have you back! Here's your dashboard 💼", {
          position: "top-right",
          duration: 5000,
        });
        sessionStorage.setItem("hasSeenWelcomeToast", "true");
      }, 1000);
    }
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const totalMembersCount = groups.reduce(
      (total, group) => total + group?.groupMembers!.length,
      0
    );
    setTotalMembers(totalMembersCount);
  }, [groups]);

  // useEffect(() => {
  //   fetchGroups();
  // }, [fetchGroups]);

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

  const allMembers = groups?.flatMap((group) =>
    group.groupMembers!.map((member) => ({
      ...member,
      joinedAt: member.createdAt,
    }))
  );
  const { activities, loading } = useGroupActivities(groups?.[0]?._id ?? "");

  console.log("Activities", activities);

  // Sort by join date (descending)
  const sortedMembers = allMembers
    .filter((m) => m.joinedAt)
    .sort(
      (a, b) =>
        new Date(b.createdAt ?? "").getTime() -
        new Date(a.createdAt ?? "").getTime()
    );

  // Get the latest N members (e.g., 5)
  const latestMembers = sortedMembers.slice(0, 5);

  // const toggleSidebar = () => setIsOpen((prev) => !prev);

  const { user } = useAuthStore();

  const firstGroupId = useMemo(() => groups[0]?._id, [groups]);
  // const firstGroupMember = useMemo(() => groups[0]?.groupMembers[0], [groups]);
  const firstGroup = useMemo(() => groups[0], [groups]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("dark-mode", "true");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("dark-mode", "false");
    }
  }, [darkMode]);

  const setSidebarOpen = (updateFn: (prevState: boolean) => boolean) => {
    setIsOpen((prevState) => updateFn(prevState));
  };
  const navigate = useNavigate();

  const actions = quickActions.filter((action) => {
    return user?.role === "admin" || !action.showOnlyAdmin;
  });

  return (
    <div
      className={`flex h-screen overflow-hidden bg-gray-50 dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 transition-colors`}
    >
      {/* Sidebar toggle button (only for mobile) */}
      {/* <button
        type="button"
        onClick={toggleSidebar}
        className="absolute top-4 left-4 text-gray-700 dark:text-gray-200 lg:hidden z-40"
        title="Toggle Sidebar"
      >
        <FaBars size={24} />
      </button> */}

      <Sidebar
        isOpen={isOpen}
        onToggle={() => setSidebarOpen((o) => !o)}
        onTabChange={setActiveTab}
        onClose={() => setIsOpen(false)}
      />

      {/* Main Content */}
      <main
        className={`flex-1 transition-all duration-300 min-h-screen bg-gray-50 dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 overflow-auto 
          ${isOpen ? "lg:ml-64" : "lg:ml-0"}`}
      >
        {/* Header imported here */}
        <Header
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          someStyles={`${!isOpen ? "md:ml-10" : "md:ml-0"}`}
        />

        {/* DASHBOARD BODY */}
        {activeTab === "admin" && (
          <div className="px-2 md:px-6 py-8 max-w-[1100px] mx-auto">
            {/* Greeting & Overview */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-blue-700 dark:text-blue-300 mb-1">
                  Welcome to your dashboard
                </h1>
              </div>
              <div className="flex space-x-4">
                {actions.map((action, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      if (action.label === "View Contributions") {
                        navigate("/admin/contributions");
                      } else if (action.label === "Request Loan") {
                        navigate("/admin/loans-request");
                      } else {
                        action.onClick();
                      }
                    }}
                    disabled={isLoading}
                    className={`${action.color} flex items-center px-4 py-2 text-white rounded-lg shadow hover:scale-105 hover:shadow-lg transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
                  >
                    {action.icon}
                    <span className="ml-2">{action.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {isLoading ? (
                // Loading stat cards
                Array.from({ length: 4 }).map((_, index) => (
                  <LoadingStatCard key={index} />
                ))
              ) : (
                // Actual stat cards with subtle animations
                <>
                  <ShimmerWrapper loading={false}>
                    <StatCard
                      label="Total Members"
                      value={totalMembers.toString()}
                      icon={
                        <FaUsers
                          className="text-blue-500 animate-bounce"
                          style={{ animationDuration: "2s" }}
                          size={28}
                        />
                      }
                      className="bg-gradient-to-tr from-blue-100 to-blue-300 dark:from-blue-900 dark:to-blue-800 shadow transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
                    />
                  </ShimmerWrapper>
                  <ShimmerWrapper loading={false}>
                    <StatCard
                      label="Total Contributions"
                      value={totalContributions.toString()}
                      icon={
                        <FaHandHoldingUsd
                          className="text-blue-500 animate-pulse"
                          size={28}
                        />
                      }
                      className="bg-gradient-to-tr from-blue-100 to-blue-300 dark:from-blue-900 dark:to-blue-800 shadow transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
                    />
                  </ShimmerWrapper>
                  <ShimmerWrapper loading={false}>
                    <StatCard
                      label="Active Loans"
                      value="0"
                      icon={
                        <FaMoneyBillWave
                          className="text-yellow-500 animate-bounce"
                          style={{ animationDuration: "1.5s" }}
                          size={28}
                        />
                      }
                      className="bg-gradient-to-tr from-yellow-100 to-yellow-300 dark:from-yellow-900 dark:to-yellow-800 shadow transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
                    />
                  </ShimmerWrapper>
                  <ShimmerWrapper loading={false}>
                    <StatCard
                      label="Pending Payouts"
                      value="0"
                      icon={
                        <FaChartPie
                          className="text-purple-500 animate-spin"
                          style={{ animationDuration: "3s" }}
                          size={28}
                        />
                      }
                      className="bg-gradient-to-tr from-purple-100 to-purple-300 dark:from-purple-900 dark:to-purple-800 shadow transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
                    />
                  </ShimmerWrapper>
                </>
              )}
            </div>

            {/* Charts & Activity */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
              <div className="xl:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                {isLoading ? (
                  // Loading charts
                  <>
                    <LoadingChart title="Contribution Overview" />
                    <LoadingChart title="Activity Timeline" />
                  </>
                ) : (
                  // Actual charts
                  <>
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transform transition-all duration-300 hover:shadow-lg">
                      <h3 className="text-blue-700 dark:text-blue-300 font-semibold mb-2">
                        Contribution Overview
                      </h3>
                      <ContributionChart />
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transform transition-all duration-300 hover:shadow-lg">
                      <h3 className="text-blue-700 dark:text-blue-300 font-semibold mb-2">
                        Activity Timeline
                      </h3>
                      <ActivityChart groupId={firstGroupId} />
                    </div>
                  </>
                )}
              </div>

              {/* Recent Activity */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 flex flex-col transform transition-all duration-300 hover:shadow-lg">
                <h3 className="text-blue-700 dark:text-blue-300 font-semibold mb-4">
                  Recent Activity
                </h3>
                <ul className="space-y-4">
                  {loading ? (
                    // Loading activity items
                    Array.from({ length: 5 }).map((_, index) => (
                      <LoadingActivityItem key={index} />
                    ))
                  ) : activities.length > 0 ? (
                    // Actual activity items
                    activities.map((item, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 transform transition-all duration-200 hover:scale-[1.02]"
                      >
                        <div className="mt-1">{getActivityIcon(item.type)}</div>
                        <div>
                          <span className="font-semibold text-gray-800 dark:text-gray-100">
                            {item.description} {}{" "}
                          </span>
                          <span className="text-gray-700 dark:text-gray-300">
                            {item.action}
                          </span>
                          <div className="text-xs text-gray-400">
                            {new Date(item.createdAt).toDateString()}
                          </div>
                        </div>
                      </li>
                    ))
                  ) : (
                    <li>
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <div className="text-3xl mb-2">📊</div>
                        <p>No recent activities</p>
                      </div>
                    </li>
                  )}
                </ul>
              </div>
            </div>

            {/* Members List & Quick Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
              {/* Latest Members */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transform transition-all duration-300 hover:shadow-lg">
                <h3 className="text-blue-700 dark:text-blue-300 font-semibold mb-4">
                  Latest Members
                </h3>

                <ul>
                  {isLoading ? (
                    Array.from({ length: 2 }).map((_, index) => (
                      <LoadingMemberItem title="Latest Members" key={index} />
                    ))
                  ) : latestMembers.length > 0 ? (
                    <>
                      {latestMembers.slice(0, 2).map((member, index) => (
                        <li
                          key={index}
                          className="flex items-center py-2 border-b last:border-b-0 border-gray-100 dark:border-gray-700 transform transition-all duration-200 hover:scale-[1.02] hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded px-2"
                        >
                          {member.profilePicUrl ? (
                            <img
                              src={member.profilePicUrl}
                              alt="Profile"
                              className="w-8 h-8 rounded-full mr-3"
                            />
                          ) : (
                            <FaUserCircle className="text-gray-400 dark:text-gray-600 w-8 h-8 mr-3" />
                          )}
                          <div>
                            <div className="text-gray-900 dark:text-gray-100 font-semibold cursor-pointer">
                              {member.lastName} {member.firstName} at{" "}
                              <span
                                className="cursor-pointer hover:text-blue-500 max-w-[150px] inline-block truncate align-bottom"
                                title={member.email}
                                onClick={() => {
                                  window.location.href = `mailto:${member.email}`;
                                }}
                              >
                                {member.email}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(member.createdAt!).toLocaleString()}
                            </div>
                          </div>
                        </li>
                      ))}

                      {/* See More / See Less Button */}
                      {latestMembers.length > 2 && (
                        <button
                          onClick={() => setModalOpen(true)}
                          className="mt-3 text-sm text-blue-600 hover:underline font-medium"
                        >
                          See More
                        </button>
                      )}
                      <LatestMembersModal
                        isOpen={isModalOpen}
                        onClose={() => setModalOpen(false)}
                        members={latestMembers}
                      />
                    </>
                  ) : (
                    <li>
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <div className="text-3xl mb-2">👥</div>
                        <p>No members yet</p>
                      </div>
                    </li>
                  )}
                </ul>
              </div>

              {/* Next Payout */}
              {isLoading ? (
                <LoadingInfoCard
                  title="Next Njangi Payout"
                  className="flex flex-col justify-between"
                />
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 flex flex-col justify-between transform transition-all duration-300 hover:shadow-lg">
                  <div>
                    <h3 className="text-blue-700 dark:text-blue-300 font-semibold mb-2">
                      Next Njangi Payout
                    </h3>
                    <div className="text-4xl font-bold text-blue-600 dark:text-blue-300 mb-1 animate-pulse">
                      {getNextPayout(firstGroup)?.amount}
                    </div>
                    <div className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                      To:{" "}
                      <span className="font-semibold text-gray-800 dark:text-gray-100">
                        {getNextPayout(firstGroup)?.member.lastName}{" "}
                        {getNextPayout(firstGroup)?.member.firstName}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-500 dark:text-gray-400 text-xs">
                      <FaArrowRight
                        className="mr-2 animate-bounce"
                        style={{
                          animationDirection: "alternate",
                          animationDuration: "1s",
                        }}
                      />
                      Expected: {getNextPayout(firstGroup)?.date.toDateString()}
                    </div>
                  </div>
                </div>
              )}

              {/* Group Health */}
              {isLoading ? (
                <LoadingInfoCard
                  title="Group Health"
                  className="flex flex-col justify-between"
                />
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 flex flex-col justify-between transform transition-all duration-300 hover:shadow-lg">
                  <h3 className="text-blue-700 dark:text-blue-300 font-semibold mb-2">
                    Group Health
                  </h3>
                  <div className="flex items-center gap-4 mb-2">
                    <span className="w-3 h-3 rounded-full bg-blue-500 inline-block animate-pulse"></span>
                    <span className="text-lg font-bold text-blue-700 dark:text-blue-300">
                      Healthy
                    </span>
                  </div>
                  <div className="text-gray-600 dark:text-gray-300 text-sm">
                    All contributions up-to-date. <br /> No overdue loans.
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
