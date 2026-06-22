import { Trash } from "lucide-react";
import React from "react";

interface Member {
  id: number;
  name: string;
  role: string;
  status: "Active" | "Inactive";
}

interface MemberRowProps {
  member: Member;
  onDelete: (id: number) => void;
}

const MemberRow: React.FC<MemberRowProps> = ({ member, onDelete }) => (
  <tr className="border-b">
    <td className="py-3 px-4 flex items-center">
      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-2">
        {member.name.charAt(0)}
      </div>
      {member.name}
    </td>
    <td className="py-3 px-4">{member.role}</td>
    <td className="py-3 px-4">
      <span
        className={`text-xs px-2 py-1 rounded-full ${
          member.status === "Active"
            ? "bg-green-100 text-green-800"
            : "bg-gray-100 text-gray-800"
        }`}
      >
        {member.status}
      </span>
    </td>
    <td className="py-3 px-4 text-right">
      <button
        type="button"
        onClick={() => onDelete(member.id)}
        className="text-red-600 hover:text-red-800"
      >
        <Trash />
      </button>
    </td>
  </tr>
);

export default MemberRow;
