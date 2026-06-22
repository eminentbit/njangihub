import React from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import {
  useAdminGroupPaymentStatus,
  useNotifyDefaulters,
} from "../../hooks/useAdmin";

const ContributionPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: groupStatus, loading, error } = useAdminGroupPaymentStatus();
  const {
    notify,
    isLoading: notifying,
    isSuccess,
    error: notifyError,
  } = useNotifyDefaulters();

  const handleNotify = async () => {
    try {
      await notify();
    } catch {
      // handled by notifyError
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      {/* Back button */}
      <button
        type="button"
        onClick={() => navigate("/admin/dashboard")}
        className="absolute left-8 top-8 flex items-center text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 hover:bg-blue-100 dark:hover:bg-gray-700 rounded-md px-3 py-2 transition-colors duration-300"
      >
        <FaArrowLeft className="mr-2" />
        Back to Dashboard
      </button>

      <div className="flex-1 overflow-y-auto p-8">
        <div className="mx-auto mt-16 w-full max-w-4xl p-10 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold mb-6 text-blue-700 dark:text-blue-400">
            Contribution Status (Current Turn)
          </h1>

          {error && (
            <div className="p-4 mb-6 bg-red-100 text-red-700 rounded">
              Error loading data. Please try again.
            </div>
          )}

          {loading ? (
            <div>
              {/* Skeleton for group sections */}
              {[1, 2].map((i) => (
                <div key={i} className="mb-10 animate-pulse">
                  <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                  </div>
                  <div className="mt-6 space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            groupStatus.map((group) => (
              <div key={group.groupId} className="mb-10">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                  Group: {group.groupName}
                </h2>

                {/* Paid Members */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-green-600">
                    ✅ Paid Members
                  </h3>
                  <ul className="list-disc pl-6 mt-2">
                    {group.paidMembers.length > 0 ? (
                      group.paidMembers.map((member) => (
                        <li key={member._id} className="text-green-700">
                          {member.name} ({member.email})
                        </li>
                      ))
                    ) : (
                      <li className="text-gray-500">No one has paid yet.</li>
                    )}
                  </ul>
                </div>

                {/* Unpaid Members */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-red-600">
                    ❌ Unpaid Members
                  </h3>
                  <ul className="list-disc pl-6 mt-2">
                    {group.unpaidMembers.length > 0 ? (
                      group.unpaidMembers.map((member) => (
                        <li key={member._id} className="text-red-600">
                          {member.name} ({member.email})
                        </li>
                      ))
                    ) : (
                      <li className="text-gray-500">Everyone has paid.</li>
                    )}
                  </ul>
                </div>
              </div>
            ))
          )}

          {/* Notify Button & Feedback */}
          <div className="mt-8 text-center">
            <button
              onClick={handleNotify}
              disabled={loading || notifying || !!error}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-md transition disabled:opacity-50"
            >
              {notifying ? "Notifying..." : "Notify Defaulters"}
            </button>

            {isSuccess && (
              <p className="mt-4 text-sm text-green-700">
                Defaulters notified successfully.
              </p>
            )}
            {notifyError && (
              <p className="mt-4 text-sm text-red-700">
                Failed to notify defaulters.
              </p>
            )}
          </div>

          <p className="mt-8 text-sm text-gray-500 dark:text-gray-400 text-center">
            Use this page to track and remind members who haven't yet
            contributed during this turn.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContributionPage;
