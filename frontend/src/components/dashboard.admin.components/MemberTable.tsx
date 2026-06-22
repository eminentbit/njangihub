import React from 'react';
import MemberRow from './MemberRow';

interface Member { id: number; name: string; role: string; status: 'Active' | 'Inactive'; }

interface MemberTableProps {
  members: Member[];
  onDelete: (id: number) => void;
}

const MemberTable: React.FC<MemberTableProps> = ({ members, onDelete }) => (
  <table className="min-w-full">
    <thead>
      <tr className="border-b">
        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Member</th>
        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Role</th>
        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
        <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
      </tr>
    </thead>
    <tbody>
      {members.map(m => (
        <MemberRow key={m.id} member={m} onDelete={onDelete} />
      ))}
    </tbody>
  </table>
);

export default MemberTable;