"use client";

import { useState } from "react";
import {
  X,
  Users,
  DollarSign,
  Calendar,
  Mail,
  Phone,
  ArrowUpDown,
} from "lucide-react";

// Exchange rate: 1 USD = approximately 600 CFA
const CFA_EXCHANGE_RATE = 600;

interface GroupMember {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  joinedDate: string;
  paymentStatus: "Paid" | "Pending";
}

interface GroupDetails {
  name: string;
  description?: string;
  members: number;
  totalAmount?: number;
  createdAt: string;
  isAdmin: boolean;
  paid: number;
}

interface GroupDetailsModalProps {
  group: GroupDetails;
  onClose: () => void;
}

const GroupDetailsModal: React.FC<GroupDetailsModalProps> = ({
  group,
  onClose,
}) => {
  const [sortField, setSortField] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [activeTab, setActiveTab] = useState<
    "overview" | "members" | "payments"
  >("overview");
  const [members] = useState<GroupMember[]>(
    [
      {
        id: 1,
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "+237 6XX XXX XXX",
        role: "Admin",
        joinedDate: "Jan 15, 2023",
        paymentStatus: "Paid" as const,
      },
      {
        id: 2,
        name: "Sarah Johnson",
        email: "sarah.j@example.com",
        phone: "+237 6XX XXX XXX",
        role: "Member",
        joinedDate: "Jan 20, 2023",
        paymentStatus: "Paid" as const,
      },
      {
        id: 3,
        name: "Michael Brown",
        email: "michael.b@example.com",
        phone: "+237 6XX XXX XXX",
        role: "Member",
        joinedDate: "Feb 05, 2023",
        paymentStatus: "Paid" as const,
      },
      {
        id: 4,
        name: "Emily Davis",
        email: "emily.d@example.com",
        phone: "+237 6XX XXX XXX",
        role: "Member",
        joinedDate: "Mar 10, 2023",
        paymentStatus: "Pending" as const,
      },
    ].slice(0, group.members)
  );

  // Sample payments data
  const payments = [
    {
      id: 1,
      member: "John Doe",
      amount: 300 * CFA_EXCHANGE_RATE,
      date: "May 10, 2023",
      status: "Completed",
    },
    {
      id: 2,
      member: "Sarah Johnson",
      amount: 300 * CFA_EXCHANGE_RATE,
      date: "May 08, 2023",
      status: "Completed",
    },
    {
      id: 3,
      member: "Michael Brown",
      amount: 300 * CFA_EXCHANGE_RATE,
      date: "May 05, 2023",
      status: "Completed",
    },
    {
      id: 4,
      member: "Emily Davis",
      amount: 300 * CFA_EXCHANGE_RATE,
      date: "May 15, 2023",
      status: "Pending",
    },
  ].slice(0, group.paid + 1);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Apply sorting to members
  const sortedMembers = [...members].sort((a, b) => {
    if (!sortField) return 0;

    let comparison = 0;
    if (sortField === "name") {
      comparison = a.name.localeCompare(b.name);
    } else if (sortField === "role") {
      comparison = a.role.localeCompare(b.role);
    } else if (sortField === "joinedDate") {
      comparison =
        new Date(a.joinedDate).getTime() - new Date(b.joinedDate).getTime();
    } else if (sortField === "paymentStatus") {
      comparison = a.paymentStatus.localeCompare(b.paymentStatus);
    }

    return sortDirection === "asc" ? comparison : -comparison;
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-4xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-indigo-100 dark:bg-indigo-800 rounded-full flex items-center justify-center">
              <Users className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{group.name}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {group.description || "No description"}
              </p>
            </div>
          </div>
          <button
            type="button"
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b dark:border-gray-700">
          <div className="flex">
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "overview"
                  ? "border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
              onClick={() => setActiveTab("overview")}
            >
              Overview
            </button>
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "members"
                  ? "border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
              onClick={() => setActiveTab("members")}
            >
              Members
            </button>
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "payments"
                  ? "border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
              onClick={() => setActiveTab("payments")}
            >
              Payments
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                    <Users className="h-4 w-4" />
                    <span>Total Members</span>
                  </div>
                  <p className="text-2xl font-bold">{group.members}</p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                    <DollarSign className="h-4 w-4" />
                    <span>Total Amount</span>
                  </div>
                  <p className="text-2xl font-bold">
                    {(group.totalAmount || 0).toLocaleString()} CFA
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                    <Calendar className="h-4 w-4" />
                    <span>Created On</span>
                  </div>
                  <p className="text-2xl font-bold">{group?.createdAt}</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Payment Progress</h3>
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Payment Status</span>
                    <span>
                      {group.paid}/{group.members} paid
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-value"
                      style={{
                        width: `${(group.paid / group.members) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    {((group.paid / group.members) * 100).toFixed(0)}% of
                    members have paid their contributions
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">
                  Group Information
                </h3>
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">
                        Group Name:
                      </span>
                      <span className="font-medium">{group.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">
                        Description:
                      </span>
                      <span className="font-medium">
                        {group.description || "No description"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">
                        Admin:
                      </span>
                      <span className="font-medium">
                        {group.isAdmin ? "You" : "Other"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">
                        Created:
                      </span>
                      <span className="font-medium">{group?.createdAt}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">
                        Contribution per member:
                      </span>
                      <span className="font-medium">
                        {(
                          (group.totalAmount || 0) / group.members
                        ).toLocaleString()}{" "}
                        CFA
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "members" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Group Members</h3>
                {group.isAdmin && (
                  <button
                    type="button"
                    className="btn btn-primary text-sm py-1.5 px-3"
                  >
                    Add Member
                  </button>
                )}
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort("name")}
                      >
                        <div className="flex items-center gap-1">
                          <span>Name</span>
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        Contact
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort("role")}
                      >
                        <div className="flex items-center gap-1">
                          <span>Role</span>
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort("joinedDate")}
                      >
                        <div className="flex items-center gap-1">
                          <span>Joined</span>
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort("paymentStatus")}
                      >
                        <div className="flex items-center gap-1">
                          <span>Payment</span>
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </th>
                      {group.isAdmin && (
                        <th
                          scope="col"
                          className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                        >
                          Actions
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {sortedMembers.map((member) => (
                      <tr key={member.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-medium">
                              {member.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {member.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            <span>{member.email}</span>
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                            <Phone className="h-3 w-3" />
                            <span>{member.phone}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              member.role === "Admin"
                                ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300"
                                : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                            }`}
                          >
                            {member.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {member.joinedDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              member.paymentStatus === "Paid"
                                ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
                                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300"
                            }`}
                          >
                            {member.paymentStatus}
                          </span>
                        </td>
                        {group.isAdmin && (
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              type="button"
                              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 mr-3"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                            >
                              Remove
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "payments" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Payment History</h3>
                {group.isAdmin && (
                  <button
                    type="button"
                    className="btn btn-primary text-sm py-1.5 px-3"
                  >
                    Record Payment
                  </button>
                )}
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        Member
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        Amount
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        Date
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      {group.isAdmin && (
                        <th
                          scope="col"
                          className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                        >
                          Actions
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {payments.map((payment) => (
                      <tr key={payment.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {payment.member}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {payment.amount.toLocaleString()} CFA
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {payment.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              payment.status === "Completed"
                                ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
                                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300"
                            }`}
                          >
                            {payment.status}
                          </span>
                        </td>
                        {group.isAdmin && (
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              type="button"
                              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300"
                            >
                              View Receipt
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupDetailsModal;
