import React, { useState, useRef, useEffect } from "react";
import { FaBell, FaSun, FaMoon, FaUserCircle, FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/create.auth.store";
import { ChevronDown, ChevronRight, LogOut } from "lucide-react";
import useUserStore from "../../store/create.user.store";

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  someStyles?: string
}

const Header: React.FC<HeaderProps> = ({ darkMode, setDarkMode, someStyles }) => {
  // Notification popover
  const [showNotifications, setShowNotifications] = useState(false);
  const { notifications } = useUserStore();
  const notificationRef = useRef<HTMLDivElement | null>(null);

  // Profile popover
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileRef = useRef<HTMLDivElement | null>(null);
  const { user } = useAuthStore();

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  // Close popovers when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getUserRole = (role: string | null | undefined) => {
    if (role == "member") {
      return "user"; 
    } else if (role == "bod") {
      return "board";
    } else return role ?? "user";
  };

  // Handle search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Use searchQuery to perform search logic
    alert(`Searching for: ${searchQuery}`);
    setSearchQuery("");
    searchInputRef.current?.blur();
  };

  return (
    <header className="sticky top-0 z-20 w-full bg-white dark:bg-gray-900 border-b shadow-sm">
      <div className="w-full flex items-center justify-between px-4 md:px-12 py-4">
        {/* Left: Logo + Search */}
        <div className="flex items-center w-full max-w-2xl">
          {/* Logo */}
          <img
            src="/logo5.png"
            alt="Logo"
            className={`h-10 mr-6 ${someStyles}`}  
          />

          {/* Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="relative flex-1"
            aria-label="Site search"
          >
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <FaSearch size={16} />
            </span>
            <input
              ref={searchInputRef}
              type="text"
              className="w-full pl-10 pr-4 py-2 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Search…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="submit"
              className="hidden"
              tabIndex={-1}
              aria-label="Submit search"
            >
              Search
            </button>
          </form>
        </div>




        {/* Right: Actions */}
        <div className="flex items-center ml-6">
          {/* Notification Bell */}
          <div className="relative mr-4" ref={notificationRef}>
            <button
              type="button"
              className="relative text-gray-700 dark:text-gray-200 hover:text-blue-600 focus:outline-none"
              onClick={() => setShowNotifications((v) => !v)}
              aria-label="Show notifications"
            >
              <FaBell size={22} />
              {notifications.some((n) => !n.isRead) && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500 border border-white dark:border-gray-900"></span>
              )}
            </button>
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
                <div className="p-4 border-b dark:border-gray-700 font-semibold text-blue-700 dark:text-blue-400">
                  Notifications
                </div>
                <ul>
                  {notifications.length === 0 ? (
                    <li className="p-4 text-gray-500">No notifications</li>
                  ) : (
                    notifications.map((n) => (
                      <li
                        key={n._id}
                        className={`px-4 py-2 flex items-center gap-2 cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-700 rounded transition ${
                          !n.isRead
                            ? "font-bold text-blue-800 dark:text-blue-300"
                            : "text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            !n.isRead ? "bg-blue-500" : "bg-gray-400"
                          } mr-2`}
                        ></span>
                        <span>{n.content}</span>
                        <span className="ml-auto text-xs text-gray-400">
                          {n.createdAt}
                        </span>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            )}
          </div>

          {/* Light/Dark toggle */}
          <button
            type="button"
            className="ml-2 p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-blue-200 dark:hover:bg-blue-900 transition focus:outline-none"
            onClick={() => setDarkMode((d) => !d)}
            aria-label="Toggle color mode"
          >
            {darkMode ? <FaSun size={18} /> : <FaMoon size={18} />}
          </button>

          {/* User Profile */}
          <div className="relative ml-4" ref={profileRef}>
            <button
              type="button"
              onClick={() => setShowProfileMenu((v) => !v)}
              className="flex items-center text-gray-700 dark:text-gray-200 focus:outline-none"
              aria-label="User menu"
              aria-haspopup="true"
              aria-expanded={showProfileMenu}
            >
              <FaUserCircle size={28} />
              <span className="ml-2 font-medium hidden md:inline">
                {user?.email?.split("@")[0]}
              </span>
              {showProfileMenu ? (
                <ChevronRight className="ml-1 hover:text-blue-600" />
              ) : (
                <ChevronDown className="ml-1 hover:text-blue-600" />
              )}
            </button>
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
                <ul className="py-1">
                  <li>
                    <Link
                      to={`/${getUserRole(user?.role)}/profile`}
                      className="block w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-center"
                    >
                      Profile
                    </Link>
                  </li>
                  <li className="bg-red-500 hover:bg-red-600 dark:hover:bg-red-700">
                    <Link
                      to="/logout"
                      className="block w-full text-left px-4 py-2"
                    >
                      <span className="flex gap-2 items-center justify-center">
                        <LogOut /> Logout
                      </span>
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
