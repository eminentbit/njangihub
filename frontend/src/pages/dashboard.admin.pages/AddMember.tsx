import React, { useState, useEffect } from "react";
import Sidebar from "../../components/dashboard.admin.components/Sidebar";
import MemberTable from "../../components/dashboard.admin.components/MemberTable";
import Header from "../../components/dashboard.admin.components/Header";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { FaUserPlus } from "react-icons/fa";

const AddMemberPage: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [, setActiveTab] = useState<string>("/members");
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [success, setSuccess] = useState<string | null>(null);

  // Toggle Tailwind dark class on <html>
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Email is invalid";
    if (!form.phone.trim()) errs.phone = "Phone is required";
    if (!form.role.trim()) errs.role = "Role is required";
    return errs;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setSuccess(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validate();
    if (Object.keys(validation).length) {
      setErrors(validation);
      setSuccess(null);
      return;
    }
    setSuccess("Member added successfully!");
    setForm({ name: "", email: "", phone: "", role: "" });
    setErrors({});
  };

  return (
    <div className="flex h-screen bg-white text-gray-800 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-200 overflow-hidden">
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-30 lg:hidden"
          onClick={toggleSidebar}
          aria-label="Close sidebar"
        />
      )}

      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onTabChange={setActiveTab}
        onToggle={toggleSidebar}
        notifications={[]}
        onClose={toggleSidebar}
      />

      {/* Content panel */}
      <div
        className={`
          flex flex-col flex-1 h-full
          ${isSidebarOpen ? "lg:ml-64" : "ml-0"}
          transition-all duration-300
          overflow-y-auto
        `}
      >
        {/* Sticky Header */}
        <Header darkMode={isDarkMode} setDarkMode={setIsDarkMode} />

        {/* Scrollable Main */}
        <main className="flex-1 pt-20 px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Page Header */}
            <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-center">
                <span className="mr-3 p-3 bg-blue-100 dark:bg-gray-700 rounded-full">
                  <FaUserPlus className="text-blue-500 text-xl" />
                </span>
                <div>
                  <h1 className="text-3xl font-bold text-blue-700 dark:text-gray-100">
                    Add New Member
                  </h1>
                  <p className="mt-1 text-gray-600 dark:text-gray-300">
                    Register a new member to your Njangi circle.
                  </p>
                </div>
              </div>
              <span className="mt-4 md:mt-0 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200 text-xs font-semibold">
                {new Date().toLocaleDateString()}
              </span>
            </section>

            {/* Form */}
            <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-10">
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name */}
                <div>
                  <label className="block text-gray-700 dark:text-gray-200 font-medium mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-900 dark:text-white ${
                      errors.name
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-700"
                    }`}
                    placeholder="Enter full name"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-gray-700 dark:text-gray-200 font-medium mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-900 dark:text-white ${
                      errors.email
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-700"
                    }`}
                    placeholder="e.g. user@email.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-gray-700 dark:text-gray-200 font-medium mb-1">
                    Phone
                  </label>
                  <PhoneInput
                    country="cm"
                    value={form.phone}
                    onChange={(phone) => {
                      setForm({ ...form, phone });
                      setErrors({ ...errors, phone: "" });
                      setSuccess(null);
                    }}
                    containerClass="w-full"
                    inputClass={`w-full px-4 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-900 dark:text-white ${
                      errors.phone
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-700"
                    }`}
                    dropdownClass="dark:bg-gray-800 dark:text-gray-200"
                    buttonClass="dark:bg-gray-900"
                    placeholder="Enter phone number"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                  )}
                </div>

                {/* Role */}
                <div>
                  <label className="block text-gray-700 dark:text-gray-200 font-medium mb-1">
                    Role
                  </label>
                  <select
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-900 dark:text-white ${
                      errors.role
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-700"
                    }`}
                    aria-label="Select role"
                  >
                    <option value="">Select role</option>
                    <option value="Member">Member</option>
                    <option value="Treasurer">Treasurer</option>
                  </select>
                  {errors.role && (
                    <p className="text-red-500 text-xs mt-1">{errors.role}</p>
                  )}
                </div>

                {/* Submit */}
                <div className="flex justify-end mt-6">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  >
                    Add Member
                  </button>
                  {success && (
                    <span className="ml-4 text-green-600 dark:text-green-400">
                      {success}
                    </span>
                  )}
                </div>
              </form>
            </section>

            {/* Members Table */}
            <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-lg font-bold text-green-700 dark:text-gray-100 mb-4">
                Current Members
              </h2>
              <div className="overflow-x-auto">
                <MemberTable
                  members={[]}
                  onDelete={(id) => console.log(`Delete ${id}`)}
                />
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AddMemberPage;
