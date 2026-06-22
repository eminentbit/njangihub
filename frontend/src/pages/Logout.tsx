import React from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/create.auth.store";
// import axios from "axios";

const LogoutPage: React.FC = () => {
  const { logout, setUser, setIsAuthenticated, user, isAuthenticated } =
    useAuthStore();

  const handleLogout = async () => {
    sessionStorage.clear();
    setUser(null);
    setIsAuthenticated(false);
    console.log(user);
    await logout();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-100 to-gray-200 p-4">
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 sm:p-8 md:p-10 text-center">
          {isAuthenticated ? (
            <>
              {/* Logout Prompt */}
              <div className="mx-auto mb-4 w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center bg-yellow-100 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7"
                  />
                </svg>
              </div>
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2">
                Ready to Logout?
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mb-6">
                Click the button below to sign out of your NJANGI account.
              </p>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-block px-4 sm:px-6 py-2 sm:py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition w-full sm:w-auto"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              {/* Logged Out Confirmation */}
              <div className="mx-auto mb-4 w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center bg-red-100 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 sm:h-8 sm:w-8 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-13v1"
                  />
                </svg>
              </div>
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2">
                You’ve been logged out
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mb-6">
                Thanks for visiting NJANGI. We hope to see you again soon.
              </p>
              <Link
                to="/login"
                className="inline-block px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition w-full sm:w-auto"
              >
                Log In Again
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LogoutPage;
