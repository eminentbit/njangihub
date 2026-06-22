import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

export interface Member {
  id: number;
  initials: string;
  name: string;
  role: string;
  status: "Active" | "Inactive";
}

export interface MemberCardProps {
  member: Member;
  onEdit?: (member: Member) => void;
  onDelete: (id: number) => void;
}

const MemberCard: React.FC<MemberCardProps> = ({
  member,
  onEdit,
  onDelete,
}) => (
  <div className="bg-white dark:bg-gray-700 rounded-lg shadow p-4 flex items-center justify-between">
    <div className="flex items-center">
      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-3">
        {member.initials}
      </div>
      <div>
        <p className="font-medium dark:text-gray-100">{member.name}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {member.role}
        </p>
        <span
          className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-semibold ${
            member.status === "Active"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {member.status}
        </span>
      </div>
    </div>
    <div className="flex space-x-2">
      {onEdit && (
        <button
          type="button"
          onClick={() => onEdit(member)}
          className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          aria-label="Edit member"
        >
          <FaEdit />
        </button>
      )}
      <button
        type="button"
        onClick={() => onDelete(member.id)}
        className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
        aria-label="Delete member"
      >
        <FaTrash />
      </button>
    </div>
  </div>
);

export default MemberCard;
