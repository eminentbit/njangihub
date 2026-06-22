import { useEffect, useState } from "react";
import {
  CreditCard,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  XCircle,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react";
import { Group, useFetchGroups } from "../../hooks/useAdmin";
import { useAuthStore } from "../../store/create.auth.store";
import Sidebar from "../../components/dashboard.admin.components/Sidebar";
import PaymentModal from "../../components/dashboard.user.components/PaymentModal";
import PaymentHistoryTable from "../../components/dashboard.user.components/PaymentHistory";
import { useFetchCampayToken, usePayWithMobile } from "../../hooks/usePayment";
import { useNavigate } from "react-router-dom";
import getRoleName from "../../utils/roles";
import { useSession } from "../../hooks/useSession";

// Skeleton Components
const StatCardSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 animate-pulse">
    <div className="flex items-center">
      <div className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg">
        <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded"></div>
      </div>
      <div className="ml-4 flex-1">
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-2"></div>
        <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
      </div>
    </div>
  </div>
);

const GroupCardSkeleton = () => (
  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 animate-pulse">
    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
      <div className="flex-1">
        <div className="flex items-center space-x-3 mb-3">
          <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-48"></div>
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-full w-16"></div>
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        </div>
      </div>
      <div className="mt-4 md:mt-0 md:ml-6">
        <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
      </div>
    </div>
  </div>
);

type PaymentMethod = "mobile_money" | "bank_transfer" | "card";

export default function PaymentsPage() {
  const { groups, isLoading } = useFetchGroups();
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("mobile_money");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const { fetchUser } = useSession();

  function handleResize() {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    } else {
      setIsSidebarOpen(true);
    }
  }

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    } else {
      setIsSidebarOpen(true);
    }
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const { user } = useAuthStore();

  const { getToken } = useFetchCampayToken();
  const { initiatePayment } = usePayWithMobile();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XAF",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getPaymentStatus = (group: Group) => {
    const now = new Date();
    const dueDate = new Date(group.nextDue);
    const daysDiff = Math.ceil(
      (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (group.status === "paid") return "paid";
    if (daysDiff < 0) return "overdue";
    if (daysDiff === 0) return "due";
    if (daysDiff <= 3) return "due_soon";
    return "upcoming";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "overdue":
        return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800";
      case "due":
        return "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800";
      case "due_soon":
        return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800";
      case "upcoming":
        return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800";
      case "paid":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "overdue":
        return <XCircle className="w-4 h-4" />;
      case "due":
      case "due_soon":
        return <AlertCircle className="w-4 h-4" />;
      case "upcoming":
        return <Clock className="w-4 h-4" />;
      case "paid":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "overdue":
        return "Overdue";
      case "due":
        return "Due Today";
      case "due_soon":
        return "Due Soon";
      case "upcoming":
        return "Upcoming";
      case "paid":
        return "Paid";
      default:
        return "Unknown";
    }
  };

  const handleInitiatePayment = async (group: Group) => {
    setSelectedGroup(group);
    setShowPaymentModal(true);
  };

  const handlePaymentSubmit = async (group: Group) => {
    if (!user?.phoneNumber && paymentMethod === "mobile_money") {
      alert("Please enter your phone number");
      return;
    }

    setIsProcessingPayment(true);
    try {
      await getToken();

      const data = await initiatePayment({
        amount: 10,
        description: "Test",
        from: user?.phoneNumber || "",
        groupId: group?._id,
      });

      if (import.meta.env.DEV) {
        console.log("Payment processing: ", data);
      }

      setTimeout(() => {
        navigate(`/${getRoleName(user?.role)}/payment-processing`);
      }, 3000);

      setShowPaymentModal(false);
      setSelectedGroup(null);
    } catch (error) {
      console.error("Payment failed:", error);
      alert("Payment failed. Please try again.");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Calculate stats with loading fallbacks
  const stats = {
    activeGroups: groups?.length || 0,
    totalContributed:
      groups?.reduce((sum, g) => sum + (g.totalContributed || 0), 0) || 0,
    totalReceived:
      groups?.reduce((sum, g) => sum + (g.totalReceived || 0), 0) || 0,
    nextDueDate:
      groups?.length > 0
        ? new Date(
            Math.min(...groups.map((g) => new Date(g.nextDue).getTime()))
          )
        : new Date(),
  };

  const netPosition = stats.totalContributed - stats.totalReceived;

  // Sort groups by urgency
  const sortedGroups = [...(groups || [])].sort((a, b) => {
    const statusPriority = {
      overdue: 1,
      due: 2,
      due_soon: 3,
      upcoming: 4,
      paid: 5,
    };

    const aStatus = getPaymentStatus(a);
    const bStatus = getPaymentStatus(b);

    return (statusPriority[aStatus] || 99) - (statusPriority[bStatus] || 99);
  });

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 md:flex-row">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onToggle={() => setIsSidebarOpen((p) => !p)}
      />

      <div
        className={`flex-1 transition-all duration-300 w-full ${
          isSidebarOpen ? "lg:ml-64" : "lg:ml-16"
        } ml-0`}
      >
        <div className="p-2 xs:p-3 sm:p-4 md:p-6 max-w-full sm:max-w-7xl mx-auto space-y-4 sm:space-y-6 md:space-y-8">
          {/* Header Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-3 xs:p-4 sm:p-6">
            <div className="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                  <Wallet className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                    Njangi Payments
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300 mt-1 text-xs xs:text-sm sm:text-base">
                    Welcome back, {user?.lastName} {user?.firstName}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2 sm:gap-0 sm:mt-6 lg:mt-0 sm:flex-row items-start sm:items-center space-x-0 sm:space-x-6 w-full sm:w-auto">
                <div className="text-center w-full sm:w-auto">
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    Next Payment
                  </p>
                  <p className="text-base sm:text-lg font-semibold text-red-600 dark:text-red-400">
                    {isLoading ? (
                      <span className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-20 sm:w-24 animate-pulse"></span>
                    ) : (
                      stats.nextDueDate.toLocaleDateString()
                    )}
                  </p>
                </div>
                <div className="text-center w-full sm:w-auto">
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    Urgent Payments
                  </p>
                  <p className="text-base sm:text-lg font-semibold text-orange-600 dark:text-orange-400">
                    {isLoading ? (
                      <span className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-8 sm:w-12 animate-pulse"></span>
                    ) : (
                      sortedGroups.filter((g) =>
                        ["overdue", "due", "due_soon"].includes(
                          getPaymentStatus(g)
                        )
                      ).length
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-2 xs:gap-3 sm:gap-4 md:gap-6">
            {isLoading ? (
              <>
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
              </>
            ) : (
              <>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Active Groups
                        </p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {stats.activeGroups}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                        <ArrowUpRight className="w-6 h-6 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Total Contributed
                        </p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {formatCurrency(stats.totalContributed)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                        <ArrowDownLeft className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Total Received
                        </p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {formatCurrency(stats.totalReceived)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                        <TrendingUp className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Net Position
                        </p>
                        <p
                          className={`text-2xl font-bold ${
                            netPosition >= 0
                              ? "text-green-600 dark:text-green-400"
                              : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          {formatCurrency(netPosition)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* My Groups Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-3 xs:p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2">
                <div>
                  <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                    My Njangi Groups
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mt-1 text-xs xs:text-sm sm:text-base">
                    Manage your group contributions and payments
                  </p>
                </div>
                {!isLoading && (
                  <div className="text-right">
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      {sortedGroups.length} active groups
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="p-3 xs:p-4 sm:p-6">
              {isLoading ? (
                <div className="space-y-3 xs:space-y-4">
                  <GroupCardSkeleton />
                  <GroupCardSkeleton />
                  <GroupCardSkeleton />
                </div>
              ) : sortedGroups.length === 0 ? (
                <div className="text-center py-8 xs:py-12">
                  <Users className="w-12 xs:w-16 h-12 xs:h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <h3 className="text-base xs:text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No Active Groups
                  </h3>
                  <p className="text-xs xs:text-sm text-gray-500 dark:text-gray-400">
                    You're not currently a member of any Njangi groups.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 xs:space-y-4">
                  {sortedGroups.map((group) => {
                    const status = getPaymentStatus(group);
                    return (
                      <div
                        key={group._id}
                        className="border border-gray-200 dark:border-gray-700 rounded-xl p-3 xs:p-4 sm:p-6 hover:shadow-md transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-600"
                      >
                        <div className="flex flex-col gap-3 xs:gap-4 lg:flex-row lg:items-center lg:justify-between">
                          <div className="flex-1">
                            <div className="flex flex-col xs:flex-row xs:items-center xs:space-x-3 mb-2 xs:mb-3 gap-1 xs:gap-0">
                              <h3 className="text-sm xs:text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                                {group.name}
                              </h3>
                              <span
                                className={`inline-flex items-center space-x-1 px-2 xs:px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                                  status
                                )}`}
                              >
                                {getStatusIcon(status)}
                                <span>{getStatusText(status)}</span>
                              </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-1 xs:gap-2 sm:gap-4 text-xs xs:text-sm">
                              <div className="space-y-1">
                                <p className="text-gray-600 dark:text-gray-300">
                                  <span className="font-medium">Members:</span>{" "}
                                  {group.groupMembers?.length || 0}
                                </p>
                                <p className="text-gray-600 dark:text-gray-300">
                                  <span className="font-medium">
                                    Contribution:
                                  </span>{" "}
                                  {formatCurrency(
                                    group.contributionAmount || 0
                                  )}
                                </p>
                                <p className="text-gray-600 dark:text-gray-300">
                                  <span className="font-medium">
                                    Frequency:
                                  </span>{" "}
                                  {group.contributionFrequency}
                                </p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-gray-600 dark:text-gray-300">
                                  <span className="font-medium">
                                    Your Position:
                                  </span>{" "}
                                  {group.position} of {group.totalRounds}
                                </p>
                                <p className="text-gray-600 dark:text-gray-300">
                                  <span className="font-medium">Next Due:</span>{" "}
                                  {new Date(group.nextDue).toLocaleDateString()}
                                </p>
                                <p className="text-gray-600 dark:text-gray-300">
                                  <span className="font-medium">
                                    Days Left:
                                  </span>{" "}
                                  {Math.max(
                                    0,
                                    Math.ceil(
                                      (new Date(group.nextDue).getTime() -
                                        new Date().getTime()) /
                                        (1000 * 60 * 60 * 24)
                                    )
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="mt-3 xs:mt-4 lg:mt-0 lg:ml-8 flex flex-col gap-2 xs:flex-row xs:gap-3">
                            {status === "overdue" && (
                              <button
                                type="button"
                                onClick={() => handleInitiatePayment(group)}
                                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 shadow-sm"
                              >
                                <AlertCircle className="w-4 h-4" />
                                <span>Pay Overdue</span>
                              </button>
                            )}
                            {status === "due" && (
                              <button
                                type="button"
                                onClick={() => handleInitiatePayment(group)}
                                className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 shadow-sm"
                              >
                                <CreditCard className="w-4 h-4" />
                                <span>Pay Now</span>
                              </button>
                            )}
                            {(status === "due_soon" ||
                              status === "upcoming") && (
                              <button
                                type="button"
                                onClick={() => handleInitiatePayment(group)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 shadow-sm"
                              >
                                <CreditCard className="w-4 h-4" />
                                <span>Pay Early</span>
                              </button>
                            )}
                            {status === "paid" && (
                              <button
                                type="button"
                                disabled
                                className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 px-6 py-3 rounded-lg font-medium flex items-center justify-center space-x-2 cursor-not-allowed"
                              >
                                <CheckCircle className="w-4 h-4" />
                                <span>Paid</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Payment History Section */}
          <PaymentHistoryTable formatCurrency={formatCurrency} />
        </div>

        {/* Enhanced Payment Modal */}
        {showPaymentModal && selectedGroup && (
          <PaymentModal
            formatCurrency={formatCurrency}
            handlePaymentSubmit={handlePaymentSubmit}
            paymentMethod={paymentMethod}
            selectedGroup={selectedGroup}
            setPaymentMethod={setPaymentMethod}
            setShowPaymentModal={setShowPaymentModal}
            isProcessingPayment={isProcessingPayment}
            setIsProcessingPayment={setIsProcessingPayment}
          />
        )}
      </div>
    </div>
  );
}
