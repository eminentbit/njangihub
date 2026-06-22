import { HiCheckCircle, HiMail, HiUsers } from "react-icons/hi";
import { User } from "../../types/auth.validator";
import { User2Icon } from "lucide-react";
import { useUserPaymentStatus } from "../../hooks/useUser";

// Member Tooltip Component
const MemberTooltip = ({
  members,
  isVisible,
  position,
  groupId,
  paidMembersCount,
}: {
  members: User[];
  isVisible: boolean;
  groupId: string;
  position: { x: number; y: number };
  paidMembersCount: number;
}) => {
  const memberIds = members.map((member) => member._id);

  const uniqueMemberIds = Array.from(new Set(memberIds.map(String)));

  const { hasPaidThisMonth = [] } = useUserPaymentStatus(
    uniqueMemberIds,
    groupId
  ) as unknown as {
    hasPaidThisMonth: Array<{ userId: string; hasPaid: boolean }>;
  };

  if (!isVisible || !members?.length) return null;

  return (
    <div
      className="fixed z-50 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-600 min-w-72 max-w-80 backdrop-blur-sm"
      style={{
        left: position.x,
        top: position.y,
        transform: "translateY(-50%)",
      }}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-2">
          <HiUsers className="text-blue-600 dark:text-blue-400" />
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Group Members
          </h3>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <span>{members.length} total</span>
          <span className="flex items-center gap-1">
            <HiCheckCircle className="w-4 h-4 text-green-500" />
            {paidMembersCount} paid
          </span>
        </div>
      </div>

      {/* Members List */}
      <div className="max-h-64 overflow-y-auto p-2">
        {members.map((member) => {
          const status = Array.isArray(hasPaidThisMonth)
            ? hasPaidThisMonth.find((s) => s.userId === member._id)
            : undefined;

          const hasPaid = status ? status.hasPaid : false;

          return (
            <div
              key={member._id}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                {member.profilePicUrl ? (
                  <img
                    src={member.profilePicUrl}
                    alt={member.lastName}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-white dark:ring-gray-700"
                  />
                ) : (
                  <User2Icon />
                )}

                {/* Online indicator */}
                {member.isActive !== false && (
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white dark:border-gray-800"></div>
                )}
              </div>

              {/* Member Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-gray-900 dark:text-white text-sm truncate">
                    {member.lastName} {member.firstName}
                  </p>
                  {member.role === "admin" && (
                    <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs rounded-full font-medium">
                      Admin
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-1">
                  <HiMail className="w-3 h-3 text-gray-400" />
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {member.email}
                  </p>
                </div>
              </div>

              {/* Payment Status */}
              <div className="flex-shrink-0">
                {hasPaid ? (
                  <div className="flex items-center gap-1 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
                    <HiCheckCircle className="w-3 h-3 text-green-500" />
                    <span className="text-xs text-green-700 dark:text-green-400 font-medium">
                      Paid
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded-full">
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <span className="text-xs text-yellow-700 dark:text-yellow-400 font-medium">
                      Pending
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-750 rounded-b-xl">
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          {members.filter((m) => m.isActive !== false).length} members online
        </p>
      </div>
    </div>
  );
};

export default MemberTooltip;
