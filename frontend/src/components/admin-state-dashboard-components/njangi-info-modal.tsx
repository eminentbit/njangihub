import type React from "react";

import { useEffect, useState } from "react";
import { X, Info, Clock, CheckCircle, AlertTriangle, Home } from "lucide-react";

interface DashboardInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DashboardInfoModal({
  isOpen,
  onClose,
}: DashboardInfoModalProps) {
  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
    // Check if user has opted to not show this modal again
    const shouldHide = localStorage.getItem("hideDashboardInfoModal");
    if (shouldHide === "true" && isOpen) {
      onClose();
    }
  }, [isOpen, onClose]);

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem("hideDashboardInfoModal", "true");
    }
    onClose();
  };

  const handleDontShowAgainChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDontShowAgain(e.target.checked);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md sm:max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-xl">
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="bg-white bg-opacity-20 p-2 rounded-lg">
              <Info className="h-6 w-6" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold">
              Welcome to Your Njangi State Dashboard
            </h2>
          </div>

          <p className="text-blue-100 text-sm sm:text-base">
            Important information about your dashboard access
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Main Message */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">
                  Temporary Dashboard Access
                </h3>
                <p className="text-blue-800 text-sm leading-relaxed">
                  This dashboard is designed to keep you informed about your
                  Njangi application status while it's under review by our Board
                  of Directors (BOD).
                </p>
              </div>
            </div>
          </div>

          {/* Features List */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">
              What you can do here:
            </h4>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="bg-green-100 p-1 rounded-full">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    Track Application Status
                  </p>
                  <p className="text-sm text-gray-600">
                    Monitor your Njangi's approval progress in real-time
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-blue-100 p-1 rounded-full">
                  <Info className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    View Submission Details
                  </p>
                  <p className="text-sm text-gray-600">
                    Review all the information you submitted
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-yellow-100 p-1 rounded-full">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    Edit Within Time Limit
                  </p>
                  <p className="text-sm text-gray-600">
                    Make changes to your application if still within the edit
                    window
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Access Information */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Home className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-yellow-900 mb-2">
                  Dashboard Access
                </h4>
                <p className="text-yellow-800 text-sm leading-relaxed mb-2">
                  You can access this dashboard from our landing page as long as
                  your application is pending BOD approval.
                </p>
                <p className="text-yellow-800 text-sm leading-relaxed">
                  <strong>Note:</strong> Once your Njangi is approved or
                  rejected, this dashboard will no longer be accessible as
                  you'll be redirected to your main Njangi management area.
                </p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3">
              What happens next?
            </h4>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>BOD reviews your application (5-7 business days)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>You receive approval/rejection notification</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Access to main Njangi platform (if approved)</span>
              </div>
            </div>
          </div>

          {/* Don't Show Again Checkbox */}
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <input
              type="checkbox"
              id="dontShowAgain"
              checked={dontShowAgain}
              onChange={handleDontShowAgainChange}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            />
            <label
              htmlFor="dontShowAgain"
              className="text-sm text-gray-700 cursor-pointer"
            >
              Don't show this message again
            </label>
          </div>

          {/* Action Button */}
          <button
            type="button"
            onClick={handleClose}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Got it, let's continue
          </button>
        </div>
      </div>
    </div>
  );
}
