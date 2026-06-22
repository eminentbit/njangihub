import { CheckCircle, Clock, AlertCircle, FileText } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useNjangiStateStore } from "../../store/njangi.state.store";

const StatusTracking = ({ njangiId }: { njangiId: string | null }) => {
  const { getMyNjangiStatus } = useNjangiStateStore();

  const {
    data: njangiStatus,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["njangiStatus", njangiId],
    queryFn: () => getMyNjangiStatus(njangiId!),
    enabled: !!njangiId,
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    refetchInterval: 30 * 1000, // Refetch every 30 seconds in the background
    refetchOnWindowFocus: true, // Refetch when window/tab regains focus
  });

  if (error) {
    console.log("Error fetching njangi status:", error);
  }

  const statusHistory = [
    {
      id: "NJ002",
      groupName: "Monthly Contribution Circle",
      currentStatus: njangiStatus?.status,
      timeline: [
        {
          status: "submitted",
          date: njangiStatus?.date,
          description: "Application submitted successfully",
          completed: true,
        },
        {
          status: "under_review",
          date: njangiStatus?.date,
          description: "BOD started reviewing your application",
          completed: true,
        },
        {
          status: "final_review",
          date: njangiStatus?.date,
          description: "Application in final review stage",
          completed: false,
          current: true,
        },
        {
          status: "decision",
          date: njangiStatus?.date,
          description: "Final decision will be communicated",
          completed: false,
        },
      ],
    },
  ];

  const getStatusIcon = (
    status: string,
    completed: boolean,
    current: boolean
  ) => {
    console.log(
      "Status:",
      status,
      "Completed:",
      completed,
      "Current:",
      current
    );
    if (current) return <Clock className="h-5 w-5 text-yellow-500" />;
    if (completed) return <CheckCircle className="h-5 w-5 text-green-500" />;
    return <Clock className="h-5 w-5 text-gray-400" />;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "under_review":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white rounded-lg shadow border-l-4 border-l-blue-500 p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">
              Applications in Review
            </h3>
            <FileText className="h-4 w-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {isLoading ? (
              <p className="text-xs text-blue-400 animate-pulse">fetching...</p>
            ) : (
              njangiStatus?.review || "0"
            )}
          </div>
          <p className="text-xs text-gray-600">
            {/* Empty for now */}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow border-l-4 border-l-green-500 p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">
              Approved This Month
            </h3>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {njangiStatus?.approved || "0"}
          </div>
          <p className="text-xs text-gray-600">{/* Empty for now */}</p>
        </div>

        <div className="bg-white rounded-lg shadow border-l-4 border-l-yellow-500 p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">
              Pending Action
            </h3>
            <AlertCircle className="h-4 w-4 text-yellow-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {njangiStatus?.pending || "N/A"}
          </div>
          <p className="text-xs text-gray-600">
            {njangiStatus?.date
              ? new Date(njangiStatus.date).toLocaleString("en-US", {
                  month: "numeric",
                  day: "numeric",
                  year: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                })
              : ""}
          </p>
        </div>
      </div>

      {statusHistory?.map((njangi) => (
        <div key={njangi.id} className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {njangi.groupName}
              </h3>
            </div>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                njangiStatus?.status ?? ""
              )}`}
            >
              {(njangiStatus?.status ?? "").replace("_", " ").toUpperCase()}
            </span>
          </div>

          <div className="space-y-6">
            <h4 className="font-semibold text-gray-900 mb-4">
              Application Timeline
            </h4>

            <div className="relative">
              {njangi.timeline.map((step, index) => (
                <div key={index} className="flex gap-4 pb-6 last:pb-0">
                  <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center">
                      {getStatusIcon(step.status, step.completed, false)}
                    </div>
                    {index < njangi.timeline.length - 1 && (
                      <div
                        className={`w-px h-12 mt-2 ${
                          step.completed ? "bg-green-200" : "bg-gray-200"
                        }`}
                      />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <p
                          className={`font-medium ${
                            step.current
                              ? "text-yellow-700"
                              : step.completed
                              ? "text-green-700"
                              : "text-gray-500"
                          }`}
                        >
                          {step.description}
                        </p>
                        <p className="text-sm text-gray-500">
                          {step.date
                            ? new Date(step.date).toLocaleString("en-US", {
                                month: "numeric",
                                day: "numeric",
                                year: "numeric",
                                hour: "numeric",
                                minute: "2-digit",
                                hour12: true,
                              })
                            : ""}
                        </p>
                      </div>
                      {step.current && (
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium w-fit">
                          Current Step
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-medium text-blue-900">Next Steps</p>
                  <p className="text-sm text-blue-700">
                    Your application is currently in the final review stage. The
                    BOD will make a decision within the next 2 business days.
                    You will be notified via email and SMS once a decision is
                    made.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatusTracking;
