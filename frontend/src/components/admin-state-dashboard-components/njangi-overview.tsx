import { CheckCircle, Clock, XCircle, Users } from "lucide-react";
import { useNjangiStateStore } from "../../store/njangi.state.store";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

interface NjangiStateOverviewProps {
  njangiId: string | null;
}

export function NjangiOverview({ njangiId }: NjangiStateOverviewProps) {
  const { getNjangiOverview } = useNjangiStateStore();

  const {
    data: overview = {
      totalSubmissions: 0,
      approved: 0,
      pending: 0,
      rejected: 0,
      status: "",
      groupName: "",
      submittedDate: "",
      recentActivities: [],
    },
    isLoading,
    error,
  } = useQuery({
    queryKey: ["njangiOverview", njangiId],
    queryFn: () => getNjangiOverview(njangiId!),
    enabled: !!njangiId,
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    refetchInterval: 30 * 1000, // Refetch every 30 seconds in the background
    refetchOnWindowFocus: true, // Refetch when window/tab regains focus
  });

  if (error) {
    console.error("Error fetching njangi overview:", error);
    toast.error(
      "An error occurred while fetching your stats. Please try again later.",
      {
        position: "top-right",
        duration: 5000,
      }
    );
  }

  console.log("Recent Activities from backend: ", overview.recentActivities);

  const stats = [
    {
      title: "Total Submissions",
      value: overview.totalSubmissions,
      icon: Users,
      color: "bg-blue-500",
    },
    {
      title: "Approved",
      value: overview.approved,
      icon: CheckCircle,
      color: "bg-green-500",
    },
    {
      title: "Pending",
      value: overview.pending,
      icon: Clock,
      color: "bg-yellow-500",
    },
    {
      title: "Rejected",
      value: overview.rejected,
      icon: XCircle,
      color: "bg-red-500",
    },
  ];

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow border-l-4 border-l-blue-400 p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">
                {stat.title}
              </h3>
              <div className={`p-2 rounded-full ${stat.color}`}>
                <stat.icon className="h-4 w-4 text-white" />
              </div>
            </div>
            <div className="text-2xl font-semibold text-gray-900 flex items-center gap-2 min-h-[32px]">
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-blue-500"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                  <span className="text-xs text-blue-400">
                    Fetching your stats...
                  </span>
                </>
              ) : (
                stat.value
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Activity
        </h2>
        <div className="space-y-4">
          {overview.recentActivities && overview.recentActivities.length > 0 ? (
            overview.recentActivities.map((activity, idx) => {
              // Choose badge color based on status
              let badgeClass = "bg-blue-100 text-blue-800";
              if (activity.status === "approved")
                badgeClass = "bg-green-100 text-green-800";
              if (activity.status === "pending")
                badgeClass = "bg-yellow-100 text-yellow-800";
              if (activity.status === "rejected")
                badgeClass = "bg-red-100 text-red-800";
              return (
                <div
                  key={idx}
                  className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:items-center justify-between p-4 bg-blue-50 rounded-lg"
                >
                  <div className="space-y-1">
                    <p className="font-medium text-gray-900">
                      {activity.groupName || "N/A"}
                    </p>
                    <p className="text-sm text-gray-600">
                      Submitted on{" "}
                      {activity.submittedDate
                        ? `${new Date(
                            activity.submittedDate
                          ).toLocaleDateString("en-US")} at ${new Date(
                            activity.submittedDate
                          ).toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                          })}`
                        : "N/A"}
                    </p>
                  </div>
                  <span
                    className={`${badgeClass} px-2 py-1 rounded-full text-xs font-medium mt-2 sm:mt-0 w-fit min-w-[80px] text-center`}
                  >
                    {activity.status
                      ? activity.status.charAt(0).toUpperCase() +
                        activity.status.slice(1)
                      : "N/A"}
                  </span>
                </div>
              );
            })
          ) : (
            <div className="text-gray-500 text-sm">No recent activity.</div>
          )}
        </div>
      </div>
    </div>
  );
}
