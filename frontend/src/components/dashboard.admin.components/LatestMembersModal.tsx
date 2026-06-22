/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dialog, DialogTitle } from "@headlessui/react";
import { useState, useMemo } from "react";
import { FaUserCircle } from "react-icons/fa";

interface LatestMembersProps {
  isOpen: boolean;
  onClose: () => void;
  members: any[];
}

export default function LatestMembersModal({
  isOpen,
  onClose,
  members,
}: LatestMembersProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMembers = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return members.filter(
      (member) =>
        `${member.firstName} ${member.lastName}`
          .toLowerCase()
          .includes(query) || member.email.toLowerCase().includes(query)
    );
  }, [searchQuery, members]);

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed z-50 inset-0 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black/50" />

        <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6">
          <DialogTitle className="text-blue-600 dark:text-blue-300 text-xl font-semibold mb-4">
            All Latest Members
          </DialogTitle>

          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full mb-4 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Member List */}
          <ul className="space-y-3">
            {filteredMembers.length > 0 ? (
              filteredMembers.map((member, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 border-b pb-3 border-gray-200 dark:border-gray-600"
                >
                  {member.profilePicUrl ? (
                    <img
                      src={member.profilePicUrl}
                      alt="Profile"
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <FaUserCircle className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                  )}
                  <div className="text-sm">
                    <div className="text-gray-900 dark:text-white font-medium">
                      {member.lastName} {member.firstName}
                    </div>
                    <div
                      className="text-blue-600 truncate max-w-[200px] cursor-pointer hover:underline"
                      title={member.email}
                      onClick={() =>
                        (window.location.href = `mailto:${member.email}`)
                      }
                    >
                      {member.email}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(member.createdAt!).toLocaleString()}
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <div className="text-center text-gray-500 dark:text-gray-400 mt-6">
                No members match your search.
              </div>
            )}
          </ul>

          <div className="mt-6 text-right">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
