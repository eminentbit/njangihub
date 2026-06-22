import React, { useState } from "react";
import { useBodStore } from "../../store/create.bod.store";

interface AddReportFormProps {
  isDarkMode: boolean;
}

const AddReportForm: React.FC<AddReportFormProps> = ({ isDarkMode }) => {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("Financial");
  const [status, setStatus] = useState("Pending");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [metrics, setMetrics] = useState({
    revenue: 0,
    expenses: 0,
  });

  const { createReport } = useBodStore();

  const profit = metrics.revenue - metrics.expenses;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createReport(
      title,
      type,
      content,
      status,
      "",
      { ...metrics, profit },
      summary
    );
    setTitle("");
    setType("Financial");
    setStatus("Pending");
    setSummary("");
    setContent("");
    setMetrics({ revenue: 0, expenses: 0 });
  };

  return (
    <div
      className={`p-6 rounded-2xl shadow-md ${
        isDarkMode ? "bg-gray-800" : "bg-white"
      } max-w-md mx-auto`}
    >
      <h3
        className={`text-xl font-semibold mb-4 ${
          isDarkMode ? "text-white" : "text-gray-900"
        }`}
      >
        Add Report
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title Field */}
        <div>
          <label
            className={`block mb-1 font-medium ${
              isDarkMode ? "text-gray-200" : "text-gray-700"
            }`}
          >
            Report Title
          </label>
          <input
            type="text"
            placeholder="Enter title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 ${
              isDarkMode
                ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-purple-500"
                : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-indigo-500"
            }`}
            required
          />
        </div>

        {/* Type and Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              className={`block mb-1 font-medium ${
                isDarkMode ? "text-gray-200" : "text-gray-700"
              }`}
            >
              Type
            </label>
            <select
              title="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white focus:ring-purple-500"
                  : "bg-gray-50 border-gray-300 text-gray-900 focus:ring-indigo-500"
              }`}
            >
              {["Financial", "Operational", "Strategic"].map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              className={`block mb-1 font-medium ${
                isDarkMode ? "text-gray-200" : "text-gray-700"
              }`}
            >
              Status
            </label>
            <select
              title="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white focus:ring-purple-500"
                  : "bg-gray-50 border-gray-300 text-gray-900 focus:ring-indigo-500"
              }`}
            >
              {["Pending", "Approved", "Archived"].map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Summary */}
        <div>
          <label
            className={`block mb-1 font-medium ${
              isDarkMode ? "text-gray-200" : "text-gray-700"
            }`}
          >
            Summary
          </label>
          <input
            type="text"
            placeholder="Brief summary"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 ${
              isDarkMode
                ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-purple-500"
                : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-indigo-500"
            }`}
          />
        </div>

        {/* Content */}
        <div>
          <label
            className={`block mb-1 font-medium ${
              isDarkMode ? "text-gray-200" : "text-gray-700"
            }`}
          >
            Content
          </label>
          <textarea
            placeholder="Detailed content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 ${
              isDarkMode
                ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-purple-500"
                : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-indigo-500"
            }`}
            rows={4}
          />
        </div>

        {/* Metrics */}
        <div>
          <label
            className={`block mb-2 font-medium ${
              isDarkMode ? "text-gray-200" : "text-gray-700"
            }`}
          >
            Metrics
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label htmlFor="revenue">Revenue (FCFA)</label>
              <input
                type="number"
                placeholder="Revenue"
                value={metrics.revenue}
                onChange={(e) =>
                  setMetrics({
                    ...metrics,
                    revenue: parseFloat(e.target.value) || 0,
                  })
                }
                className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-purple-500"
                    : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-indigo-500"
                }`}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="expenses">Expenses (FCFA)</label>
              <input
                type="number"
                placeholder="Expenses"
                value={metrics.expenses}
                onChange={(e) =>
                  setMetrics({
                    ...metrics,
                    expenses: parseFloat(e.target.value) || 0,
                  })
                }
                className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-purple-500"
                    : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-indigo-500"
                }`}
              />
            </div>
            <div className="flex flex-col">
              <label
                className={`block mb-1 font-medium ${
                  isDarkMode ? "text-gray-200" : "text-gray-700"
                }`}
              >
                Profit (auto)
              </label>
              <input
                type="text"
                value={profit.toLocaleString()}
                readOnly
                className={`w-full px-3 py-2 rounded-lg border bg-gray-100 text-gray-700 ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "border-gray-300"
                }`}
                title="Automatically calculated: Revenue - Expenses"
              />
            </div>
          </div>
          <p
            className={`mt-1 text-sm ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Profit is calculated automatically from Revenue and Expenses.
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="mt-2 w-full py-2 rounded-lg shadow-sm text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add Report
        </button>
      </form>
    </div>
  );
};

export default AddReportForm;
