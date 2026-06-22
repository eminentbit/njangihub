import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const LoanRequestPage: React.FC = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [purpose, setPurpose] = useState("");
  const [duration, setDuration] = useState("3");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setMessage("Your loan request has been submitted for review.");
      setAmount("");
      setPurpose("");
      setDuration("3");
    }, 1500);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* Back button at top-left */}
      <button
        type="button"
        onClick={() => navigate("/admin/dashboard")}
        className="fixed left-8 top-8 flex items-center text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 hover:bg-blue-100 dark:hover:bg-gray-700 rounded-md px-3 py-2 transition-colors duration-300 z-20"
      >
        <FaArrowLeft className="mr-2" />
        Back to Dashboard
      </button>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto p-8 pt-24">
        <div className="mx-auto w-full max-w-2xl p-10 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-4 text-blue-700 dark:text-blue-400">
            Loan Request
          </h1>
          <p className="mb-6 text-gray-600 dark:text-gray-300">
            Need a loan? Fill out the form below and our admins will review your
            request promptly.
          </p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="loan-amount"
                className="block text-gray-700 dark:text-gray-200 font-medium mb-2"
              >
                Amount (CFA)
              </label>
              <input
                id="loan-amount"
                type="number"
                min="1000"
                step="500"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter loan amount (minimum CFA1,000)"
                required
                className="w-full px-5 py-3 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="purpose"
                className="block text-gray-700 dark:text-gray-200 font-medium mb-2"
              >
                Purpose
              </label>
              <input
                id="purpose"
                type="text"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="e.g. School fees, rent, business, etc."
                required
                className="w-full px-5 py-3 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="duration"
                className="block text-gray-700 dark:text-gray-200 font-medium mb-2"
              >
                Repayment Duration (months)
              </label>
              <select
                id="duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                required
                className="w-full px-5 py-3 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="3">3 months</option>
                <option value="6">6 months</option>
                <option value="9">9 months</option>
                <option value="12">12 months</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading || !amount || !purpose}
              className="w-full py-3 px-6 rounded-md bg-blue-700 hover:bg-blue-800 text-white font-semibold text-lg transition disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Request Loan"}
            </button>

            {message && (
              <div className="text-green-600 dark:text-green-400 font-medium pt-2 text-center">
                {message}
              </div>
            )}
          </form>

          <p className="mt-8 text-sm text-gray-500 dark:text-gray-400 text-center">
            Please ensure your contribution history is up to date before
            requesting a loan.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoanRequestPage;
