import React, { useState } from "react";
import { GroupRequest } from "../../types/group.request";
import { useBodStore } from "../../store/create.bod.store";
import { useCreateNjangiStore } from "../../store/create.njangi.store";

interface GroupRequestDetailsProps {
  request: GroupRequest;
  isDarkMode: boolean;
  onBack?: () => void;
}

const GroupRequestDetails: React.FC<GroupRequestDetailsProps> = ({
  request,
  isDarkMode,
  onBack,
}) => {
  const { isLoading, error, acceptRequest, rejectRequest } = useBodStore();
    const { clearDraftId } = useCreateNjangiStore();
  

  const [actionLoading, setActionLoading] = useState<
    "accept" | "reject" | null
  >(null);

  const handleAccept = async () => {
    setActionLoading("accept");
    try {
      await acceptRequest(request._id, "Approved by board");
      clearDraftId();
    } catch (e) {
      console.error("Failed to accept request", e);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async () => {
    setActionLoading("reject");
    try {
      await rejectRequest(request._id, "Not eligible");
      clearDraftId();
    } catch (e) {
      console.error("Failed to reject request", e);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div
      className={`${
        isDarkMode ? "bg-gray-700 text-gray-100" : "bg-white text-gray-900"
      } p-6 rounded-lg shadow-md max-h-[60vh] overflow-y-auto`}
    >
      <div className="flex items-start gap-4 mb-4 flex-col">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 bg-purple-600 text-white rounded-md shadow hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm md:text-base"
          >
            Back
          </button>
        )}
        <h3 className="text-lg font-semibold">Group Request Details</h3>
      </div>

      {isLoading ? (
        <p className="text-sm text-gray-500">Loading request...</p>
      ) : error ? (
        <p className="text-sm text-red-500">Error: {error}</p>
      ) : (
        <div className="space-y-2 mb-6">
          <p className="text-sm">
            <span className="font-medium">ID:</span> {request._id}
          </p>
          <p className="text-sm">
            <span className="font-medium">Leader Name:</span>{" "}
            {request.accountSetup.firstName} {request.accountSetup.lastName}
          </p>
          <p className="text-sm">
            <span className="font-medium">Group Name:</span>{" "}
            {request.groupDetails.groupName}
          </p>
          <p className="text-sm">
            <span className="font-medium">Max Members:</span>{" "}
            {request.groupDetails.numberOfMember}
          </p>
          <p className="text-sm">
            <span className="font-medium">Description:</span>{" "}
            {request.groupDetails.rules}
          </p>
          <p className="text-sm">
            <span className="font-medium">State:</span>{" "}
            {request.groupDetails.status}
          </p>
        </div>
      )}

      <div className="flex gap-4">
        <button
          type="button"
          onClick={handleAccept}
          disabled={actionLoading === "accept"}
          className="flex-1 px-3 py-2 bg-green-500 text-white rounded-md shadow hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 text-sm md:text-base disabled:opacity-50"
        >
          {actionLoading === "accept" ? "Approving..." : "Accept"}
        </button>
        <button
          type="button"
          onClick={handleReject}
          disabled={actionLoading === "reject"}
          className="flex-1 px-3 py-2 bg-red-500 text-white rounded-md shadow hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 text-sm md:text-base disabled:opacity-50"
        >
          {actionLoading === "reject" ? "Rejecting..." : "Reject"}
        </button>
      </div>
    </div>
  );
};

export default GroupRequestDetails;
