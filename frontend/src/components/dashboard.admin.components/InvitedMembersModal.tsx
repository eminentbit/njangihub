import { Dialog, DialogTitle } from "@headlessui/react";
import { useState, useMemo } from "react";
import { FaUserCircle } from "react-icons/fa";
import { FiTrash2 } from "react-icons/fi";

interface InvitedMember {
  email?: string;
  phone?: string;
  status: string;
  groupId?: string;
  invitedBy?: string;
  createdAt?: string;
}
interface InviteIdentifier {
  email?: string;
  phone?: string;
  groupId?: string;
}

interface InvitedMembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  isInviting: boolean;
  members: InvitedMember[];
  onDelete: (member: InviteIdentifier) => void; // Pass member back for deletion
}

export default function InvitedMembersModal({
  isOpen,
  onClose,
  members,
  onDelete,
  isInviting,
}: InvitedMembersModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [memberToDelete, setMemberToDelete] = useState<InviteIdentifier | null>(
    null
  );

  const filteredMembers = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return members.filter((member) => {
      const contact = member.email || member.phone || "";
      return contact.toLowerCase().includes(query);
    });
  }, [searchQuery, members]);

  const confirmDelete = (member: InviteIdentifier) => {
    if (members.length <= 1) return;
    setMemberToDelete(member);
  };

  const handleConfirmDelete = () => {
    if (memberToDelete) {
      onDelete(memberToDelete);
      setMemberToDelete(null);
    }
  };

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
            Invited Members
          </DialogTitle>

          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search by email or phone..."
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
                  className="flex items-start justify-between border-b pb-3 border-gray-200 dark:border-gray-600"
                >
                  <div className="flex gap-3">
                    <FaUserCircle className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                    <div className="text-sm">
                      <div className="text-gray-900 dark:text-white font-medium">
                        {member.email || member.phone}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        Status:{" "}
                        <span
                          className={
                            member.status === "accepted"
                              ? "text-green-600"
                              : member.status === "pending"
                              ? "text-yellow-600"
                              : "text-gray-400"
                          }
                        >
                          {member.status}
                        </span>
                      </div>
                      {member.createdAt && (
                        <div className="text-xs text-gray-500 mt-1">
                          Invited at:{" "}
                          {new Date(member.createdAt).toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Cancel Invite Btn */}
                  {members.length > 1 && (
                    <button
                      onClick={() => confirmDelete(member)}
                      className="text-red-500 hover:text-red-600 transition"
                      title="Cancel Invite"
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  )}
                </li>
              ))
            ) : (
              <div className="text-center text-gray-500 dark:text-gray-400 mt-6">
                No invited members match your search.
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

      {/* Confirm Delete Dialog */}
      {memberToDelete && (
        <Dialog
          open={!!memberToDelete}
          onClose={() => setMemberToDelete(null)}
          className="fixed inset-0 z-50 overflow-y-auto"
        >
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black/50" />
            <div className="relative bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-sm w-full p-6">
              <DialogTitle className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                Cancel Invitation?
              </DialogTitle>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Are you sure you want to cancel this invite for{" "}
                <span className="font-semibold text-gray-900 dark:text-white">
                  {memberToDelete.email || memberToDelete.phone}
                </span>
                ?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  disabled={isInviting}
                  onClick={() => setMemberToDelete(null)}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md"
                >
                  No, Keep
                </button>
                <button
                  disabled={isInviting}
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition disabled:cursor-not-allowed disabled:opacity-50"
                >
                 {
                   isInviting ? "Canceling..." : "Yes, Cancel"
                 }
                </button>
              </div>
            </div>
          </div>
        </Dialog>
      )}
    </Dialog>
  );
}
