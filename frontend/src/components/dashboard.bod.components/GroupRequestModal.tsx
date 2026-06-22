import React from "react";
import { GroupDetails } from "../../types/create-njangi-types";

interface GroupRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: GroupDetails;
  onApprove?: () => void;
  onReject?: () => void;
  action?: "approve" | "reject";
}

const GroupRequestModal: React.FC<GroupRequestModalProps> = ({
  isOpen,
  onClose,
  request,
  onApprove,
  onReject,
  action,
}) => {
  if (!isOpen) return null;

  const getActionMessage = () => {
    if (action === "approve") {
      return `Are you sure you want to approve the request for "${request.groupName}"?`;
    } else if (action === "reject") {
      return `Are you sure you want to reject the request for "${request.groupName}"?`;
    }
    return "";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50">
      <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>

        <h2 className="mb-4 text-2xl font-bold text-gray-800">
          Confirm Action
        </h2>

        <div className="space-y-4">
          <p className="text-gray-600">{getActionMessage()}</p>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
            >
              Cancel
            </button>
            {action == "reject" && (
              <button
                type="button"
                onClick={onReject}
                className="rounded-md bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
              >
                Confirm Reject
              </button>
            )}
            {action === "approve" && (
              <button
                type="button"
                onClick={onApprove}
                className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
              >
                Confirm Approve
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupRequestModal;
