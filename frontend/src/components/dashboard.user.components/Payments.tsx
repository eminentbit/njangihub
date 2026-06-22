"use client";

import { useState, useEffect } from "react";
import {
  DollarSign,
  Calendar,
  CreditCard,
  Download,
  Filter,
  ArrowUpDown,
  Check,
} from "lucide-react";
//import Sidebar from "../dashboard.admin.components/Sidebar";

// Exchange rate: 1 USD = approximately 600 CFA
const CFA_EXCHANGE_RATE = 600;

const Payments = () => {
  const [payments, setPayments] = useState([
    {
      id: 1,
      group: "Team Alpha",
      amount: 300 * CFA_EXCHANGE_RATE,
      date: "May 10, 2023",
      status: "Completed",
      method: "Credit Card",
    },
    {
      id: 2,
      group: "Project Beta",
      amount: 250 * CFA_EXCHANGE_RATE,
      date: "Apr 22, 2023",
      status: "Completed",
      method: "PayPal",
    },
    {
      id: 3,
      group: "Finance Club",
      amount: 150 * CFA_EXCHANGE_RATE,
      date: "Mar 15, 2023",
      status: "Completed",
      method: "Bank Transfer",
    },
    {
      id: 4,
      group: "Team Alpha",
      amount: 300 * CFA_EXCHANGE_RATE,
      date: "Feb 10, 2023",
      status: "Completed",
      method: "Credit Card",
    },
    {
      id: 5,
      group: "Project Beta",
      amount: 250 * CFA_EXCHANGE_RATE,
      date: "Jan 05, 2023",
      status: "Failed",
      method: "Credit Card",
    },
    {
      id: 6,
      group: "Finance Club",
      amount: 150 * CFA_EXCHANGE_RATE,
      date: "Dec 20, 2022",
      status: "Completed",
      method: "Mobile Money",
    },
    {
      id: 7,
      group: "Team Alpha",
      amount: 300 * CFA_EXCHANGE_RATE,
      date: "Nov 15, 2022",
      status: "Completed",
      method: "Bank Transfer",
    },
    {
      id: 8,
      group: "Project Beta",
      amount: 250 * CFA_EXCHANGE_RATE,
      date: "Oct 10, 2022",
      status: "Completed",
      method: "Credit Card",
    },
  ]);

  const [pendingPayments, setPendingPayments] = useState([
    {
      id: 1,
      group: "Finance Club",
      amount: 150 * CFA_EXCHANGE_RATE,
      dueDate: "May 30, 2023",
    },
    {
      id: 2,
      group: "Project Beta",
      amount: 250 * CFA_EXCHANGE_RATE,
      dueDate: "Jun 15, 2023",
    },
  ]);

  const [filterOpen, setFilterOpen] = useState(false);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterGroup, setFilterGroup] = useState("");
  const [showReceipt, setShowReceipt] = useState<number | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  // const [isOpen, setIsOpen] = useState(true);
  const [filteredPayments, setFilteredPayments] = useState<
    {
      id: number;
      group: string;
      amount: number;
      date: string;
      status: string;
      method: string;
    }[]
  >([]);

  useEffect(() => {
    // Apply filters
    let result = [...payments];

    if (filterStatus) {
      result = result.filter(
        (p) => p.status.toLowerCase() === filterStatus.toLowerCase()
      );
    }

    if (filterGroup) {
      result = result.filter(
        (p) => p.group.toLowerCase() === filterGroup.toLowerCase()
      );
    }

    // Apply sorting
    if (sortField) {
      result.sort((a, b) => {
        let comparison = 0;
        if (sortField === "group") {
          comparison = a.group.localeCompare(b.group);
        } else if (sortField === "amount") {
          comparison = a.amount - b.amount;
        } else if (sortField === "date") {
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
        } else if (sortField === "status") {
          comparison = a.status.localeCompare(b.status);
        } else if (sortField === "method") {
          comparison = a.method.localeCompare(b.method);
        }

        return sortDirection === "asc" ? comparison : -comparison;
      });
    }

    setFilteredPayments(result);
  }, [payments, filterStatus, filterGroup, sortField, sortDirection]);

  const handleSort = (field: string | null) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handlePayNow = (payment: {
    id: number;
    group: string;
    amount: number;
    dueDate?: string;
  }) => {
    setIsProcessingPayment(true);

    // Simulate payment processing
    setTimeout(() => {
      // In a real app, this would open a payment form
      alert(
        `Processing payment of ${payment.amount.toLocaleString()} CFA for ${
          payment.group
        }`
      );

      // Simulate successful payment
      const updatedPendingPayments = pendingPayments.filter(
        (p) => p.id !== payment.id
      );
      setPendingPayments(updatedPendingPayments);

      const newPayment = {
        id: payments.length + 1,
        group: payment.group,
        amount: payment.amount,
        date: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        status: "Completed",
        method: "Credit Card",
      };

      setPayments([newPayment, ...payments]);
      setIsProcessingPayment(false);
    }, 2000);
  };

  const handleDownload = () => {
    setIsDownloading(true);

    // Simulate download
    setTimeout(() => {
      // Create CSV content
      const headers = [
        "ID",
        "Group",
        "Amount (CFA)",
        "Date",
        "Status",
        "Method",
      ];
      const csvContent = [
        headers.join(","),
        ...filteredPayments.map((p) =>
          [p.id, p.group, p.amount, p.date, p.status, p.method].join(",")
        ),
      ].join("\n");

      // Create blob and download
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "payment_history.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      alert("Payment history downloaded successfully!");
      setIsDownloading(false);
    }, 1500);
  };

  const handleViewReceipt = (paymentId: number) => {
    setShowReceipt(paymentId);
  };

  const handleDownloadReceipt = (paymentId: number) => {
    // Simulate receipt download
    alert(`Downloading receipt for payment #${paymentId}...`);

    setTimeout(() => {
      // Create receipt content
      const payment = payments.find((p) => p.id === paymentId);
      const receiptContent = `
PAYMENT RECEIPT
--------------
Receipt #: ${payment?.id}
Group: ${payment?.group}
Amount: ${payment?.amount.toLocaleString()} CFA
Date: ${payment?.date}
Status: ${payment?.status}
Method: ${payment?.method}
      `;

      // Create blob and download
      const blob = new Blob([receiptContent], {
        type: "text/plain;charset=utf-8;",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `receipt_${payment?.id}.txt`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      alert("Receipt downloaded successfully!");
    }, 1000);
  };

  const applyFilters = () => {
    setFilterOpen(false);
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Calculate total contributed
  const totalContributed = payments
    .filter((payment) => payment.status === "Completed")
    .reduce((sum, payment) => sum + payment.amount, 0);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPayments.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    
      <div
        className="mx-auto  px-20 py-5 space-y-6 lg:ml-[20%] transition-all duration-300"
      >
        <div className="pt-6 w-full">
          <h1 className="text-3xl font-bold text-blue-700">Payments</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your payments and contributions
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-indigo-100 dark:bg-indigo-800">
                <DollarSign className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Contributed
                </p>
                <p className="text-2xl font-bold">
                  {totalContributed.toLocaleString()} CFA
                </p>
              </div>
            </div>
          </div>
          <div className="card bg-green-50 dark:bg-green-900/30 border border-green-100 dark:border-green-800">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-800">
                <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Completed Payments
                </p>
                <p className="text-2xl font-bold">
                  {payments.filter((p) => p.status === "Completed").length}
                </p>
              </div>
            </div>
          </div>
          <div className="card bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-100 dark:border-yellow-800">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-800">
                <Calendar className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Pending Payments
                </p>
                <p className="text-2xl font-bold">{pendingPayments.length}</p>
              </div>
            </div>
          </div>
        </div>
        {pendingPayments.length > 0 && (
          <div className="card">
            <h2 className="text-lg font-semibold mb-4">Pending Payments</h2>
            <div className="space-y-4">
              {pendingPayments.map((payment) => (
                <div
                  key={payment.id}
                  className="border dark:border-gray-700 rounded-lg p-4 flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-medium">{payment.group}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
                      <Calendar className="h-4 w-4" />
                      <span>Due: {payment.dueDate}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">
                      {payment.amount.toLocaleString()} CFA
                    </p>
                    <button
                      type="button"
                      className={`btn ${
                        isProcessingPayment ? "btn-disabled" : "btn-primary"
                      } mt-2 text-sm py-1.5 flex items-center justify-center gap-2`}
                      onClick={() => handlePayNow(payment)}
                      disabled={isProcessingPayment}
                    >
                      {isProcessingPayment && (
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      )}
                      {isProcessingPayment ? "Processing..." : "Pay Now"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Payment History</h2>
            <div className="flex items-center gap-2">
              <div className="relative">
                <button
                  type="button"
                  className="btn btn-secondary flex items-center gap-2"
                  onClick={() => setFilterOpen(!filterOpen)}
                >
                  <Filter className="h-4 w-4" />
                  <span>Filter</span>
                </button>
                {filterOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 border border-gray-200 dark:border-gray-700">
                    <div className="px-3 py-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Status
                      </label>
                      <select
                        title="filterStatus"
                        className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                      >
                        <option value="">All</option>
                        <option value="completed">Completed</option>
                        <option value="pending">Pending</option>
                        <option value="failed">Failed</option>
                      </select>
                    </div>
                    <div className="px-3 py-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Group
                      </label>
                      <select
                        title="filterGroup"
                        className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        value={filterGroup}
                        onChange={(e) => setFilterGroup(e.target.value)}
                      >
                        <option value="">All</option>
                        <option value="team alpha">Team Alpha</option>
                        <option value="project beta">Project Beta</option>
                        <option value="finance club">Finance Club</option>
                      </select>
                    </div>
                    <div className="border-t border-gray-200 dark:border-gray-700 mt-2 pt-2 px-3 py-1 flex justify-end">
                      <button
                        type="button"
                        className="text-sm text-indigo-600 dark:text-indigo-400 font-medium"
                        onClick={applyFilters}
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <button
                type="button"
                className="btn btn-secondary flex items-center gap-2"
                onClick={handleDownload}
                disabled={isDownloading}
              >
                {isDownloading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700 dark:text-gray-300"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>Exporting...</span>
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    <span>Export</span>
                  </>
                )}
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("group")}
                  >
                    <div className="flex items-center gap-1">
                      <span>Group</span>
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("amount")}
                  >
                    <div className="flex items-center gap-1">
                      <span>Amount</span>
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("date")}
                  >
                    <div className="flex items-center gap-1">
                      <span>Date</span>
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("status")}
                  >
                    <div className="flex items-center gap-1">
                      <span>Status</span>
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("method")}
                  >
                    <div className="flex items-center gap-1">
                      <span>Method</span>
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {currentItems.map((payment) => (
                  <tr key={payment.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {payment.group}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {payment.amount.toLocaleString()} CFA
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {payment.date}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          payment.status === "Completed"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
                            : "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300"
                        }`}
                      >
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <CreditCard className="h-4 w-4" />
                        <span>{payment.method}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        type="button"
                        className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300"
                        onClick={() => handleViewReceipt(payment.id)}
                      >
                        Receipt
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between mt-4 border-t dark:border-gray-700 pt-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Showing{" "}
              <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
              <span className="font-medium">
                {Math.min(indexOfLastItem, filteredPayments.length)}
              </span>{" "}
              of <span className="font-medium">{filteredPayments.length}</span>{" "}
              results
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className={`btn btn-secondary py-1 px-2 text-sm ${
                  currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={prevPage}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <button
                type="button"
                className={`btn btn-secondary py-1 px-2 text-sm ${
                  currentPage === totalPages
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                onClick={nextPage}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </div>
        {/* Receipt Modal */}
        {showReceipt !== null && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Payment Receipt</h2>
              <div className="border dark:border-gray-700 rounded-lg p-4 mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500 dark:text-gray-400">
                    Payment ID:
                  </span>
                  <span className="font-medium">#{showReceipt}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500 dark:text-gray-400">
                    Group:
                  </span>
                  <span className="font-medium">
                    {payments.find((p) => p.id === showReceipt)?.group}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500 dark:text-gray-400">
                    Amount:
                  </span>
                  <span className="font-medium">
                    {payments
                      .find((p) => p.id === showReceipt)
                      ?.amount.toLocaleString()}{" "}
                    CFA
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500 dark:text-gray-400">
                    Date:
                  </span>
                  <span className="font-medium">
                    {payments.find((p) => p.id === showReceipt)?.date}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500 dark:text-gray-400">
                    Status:
                  </span>
                  <span
                    className={`font-medium ${
                      payments.find((p) => p.id === showReceipt)?.status ===
                      "Completed"
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {payments.find((p) => p.id === showReceipt)?.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">
                    Method:
                  </span>
                  <span className="font-medium">
                    {payments.find((p) => p.id === showReceipt)?.method}
                  </span>
                </div>
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  className="btn btn-secondary flex items-center gap-2"
                  onClick={() => handleDownloadReceipt(showReceipt)}
                >
                  <Download className="h-4 w-4" />
                  <span>Download</span>
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setShowReceipt(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
  );
};

export default Payments;
