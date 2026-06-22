import {
  Bell,
  LogOut,
  Sun,
  Moon,
  User as UserIcon,
  ChevronDown,
} from "lucide-react";
import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/create.auth.store";
import { useBodStore } from "../../store/create.bod.store";
import { motion, AnimatePresence } from "framer-motion";
import useOnClickOutside from "../../hooks/useOnClickOutside";

interface HeaderProps {
  toggleTheme: () => void;
  isDarkMode: boolean;
}

const dropdownAnimation = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
  transition: { duration: 0.2 },
};

const Header: React.FC<HeaderProps> = ({ toggleTheme, isDarkMode }) => {
  const { user } = useAuthStore();
  const { notifications } = useBodStore();
  const navigate = useNavigate();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const getUserRole = (role: string | null | undefined) => {
    if (role == "member") {
      return "user";
    } else if (role == "bod") {
      return "board";
    } else return role ?? "user";
  };

  const notifRef = useRef<HTMLDivElement>(
    null
  ) as React.RefObject<HTMLDivElement>;
  const userMenuRef = useRef<HTMLDivElement>(
    null
  ) as React.RefObject<HTMLDivElement>;

  useOnClickOutside(notifRef, () => setShowNotifications(false));
  useOnClickOutside(userMenuRef, () => setShowUserMenu(false));

  return (
    <header className="sticky top-0 z-10 bg-white dark:bg-gray-900 shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex-shrink-0">
              <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
            </Link>

            <div className="relative text-gray-600 dark:text-gray-300">
              <input
                type="search"
                placeholder="Search..."
                className="block w-full bg-gray-100 dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 rounded-full pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <span className="absolute inset-y-0 left-3 flex items-center">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
                  />
                </svg>
              </span>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative" ref={notifRef}>
              <button
                type="button"
                onClick={() => setShowNotifications((prev) => !prev)}
                className="relative focus:outline-none"
              >
                <Bell className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    {...dropdownAnimation}
                    className="absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-20"
                  >
                    <div className="py-2">
                      <h3 className="px-4 py-2 text-sm font-semibold border-b border-gray-200 dark:border-gray-700">
                        Notifications
                      </h3>
                      {notifications.length === 0 ? (
                        <div className="px-4 py-4 text-center text-gray-500">
                          No new notifications
                        </div>
                      ) : (
                        <div className="max-h-60 overflow-y-auto">
                          {notifications.map((n, idx) => (
                            <div
                              key={idx}
                              className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                            >
                              <p className="text-sm text-gray-800 dark:text-gray-200">
                                {n.message}
                              </p>
                              <p className="text-xs text-gray-400">
                                {n.createdAt}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
                        <Link
                          to="/board/notifications"
                          className="text-indigo-600 dark:text-indigo-400 text-sm hover:underline"
                        >
                          View all notifications
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 focus:outline-none"
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5 text-yellow-400" />
              ) : (
                <Moon className="h-5 w-5 text-blue-400" />
              )}
            </button>

            {/* User Menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setShowUserMenu((prev) => !prev)}
                className="flex items-center space-x-2 focus:outline-none"
              >
                <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                  {user?.image ? (
                    <img
                      src={user.image}
                      alt="avatar"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <UserIcon className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                  )}
                </div>
                <ChevronDown className="h-4 w-4 text-gray-700 dark:text-gray-300" />
              </button>

              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    {...dropdownAnimation}
                    className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-20"
                  >
                    <div className="py-1">
                      <Link
                        to={`/${getUserRole(user?.role)}/profile`}
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Profile
                      </Link>
                      <Link
                        to="/settings"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Settings
                      </Link>
                      <button
                        type="button"
                        onClick={() => navigate("/logout")}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100 dark:hover:bg-red-700"
                      >
                        <div className="flex items-center">
                          <LogOut className="h-4 w-4 mr-2" /> Logout
                        </div>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
