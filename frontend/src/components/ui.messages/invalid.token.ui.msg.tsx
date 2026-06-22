"use client";

import { AlertCircle, Clock, XCircle, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface InviteTokenStatusUiProps {
  inviteStatus: string;
  itemType?: string;
}

export default function InviteTokenStatusUi({
  inviteStatus,
  itemType = "invitation",
}: InviteTokenStatusUiProps) {
  const navigate = useNavigate();

  const getStatusConfig = () => {
    const itemName = itemType.toLowerCase();
    const itemNameCapitalized =
      itemType.charAt(0).toUpperCase() + itemType.slice(1);

    switch (inviteStatus) {
      case "missing":
        return {
          icon: (
            <AlertCircle className="w-16 h-16 text-blue-500 mx-auto mb-4" />
          ),
          title: `Oops! ${itemNameCapitalized} Missing`,
          message: `It looks like your ${itemName} is incomplete or missing. Don't worry, this happens sometimes! Please check your link or contact the person who shared this ${itemName} with you.`,
          bgGradient: "from-blue-50 to-blue-50",
        };
      case "invalid":
        return {
          icon: <XCircle className="w-16 h-16 text-blue-500 mx-auto mb-4" />,
          title: `Invalid ${itemNameCapitalized}`,
          message: `This ${itemName} appears to be invalid or may have already been used. No worries though! Please reach out to the admin for a fresh ${itemName}.`,
          bgGradient: "from-blue-50 to-purple-50",
        };
      case "expired":
        return {
          icon: <Clock className="w-16 h-16 text-blue-500 mx-auto mb-4" />,
          title: `${itemNameCapitalized} Expired`,
          message: `This ${itemName} has expired, but getting a new one is easy! Simply contact your admin and they'll provide you with a fresh ${itemName} right away.`,
          bgGradient: "from-blue-50 to-cyan-50",
        };
      case "valid":
        return {
          icon: (
            <AlertCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          ),
          title: `${itemNameCapitalized} Valid`,
          message: `Great! Your ${itemName} is valid and ready to use. You can proceed with confidence.`,
          bgGradient: "from-green-50 to-emerald-50",
        };
      default:
        return {
          icon: (
            <AlertCircle className="w-16 h-16 text-blue-500 mx-auto mb-4" />
          ),
          title: "Something Went Wrong",
          message: `We encountered an unexpected issue with your ${itemName}. Please try again or contact support.`,
          bgGradient: "from-blue-50 to-blue-50",
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div
      className={`min-h-screen flex items-center justify-center bg-gradient-to-br ${config.bgGradient} p-4`}
    >
      <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20 max-w-md w-full text-center">
        {config.icon}

        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          {config.title}
        </h2>

        <p className="text-gray-600 mb-8 leading-relaxed">{config.message}</p>

        <button
          type="button"
          onClick={() => navigate("/")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto"
        >
          <Home className="w-4 h-4" />
          Return Home
        </button>

        <div className="mt-6 text-sm text-gray-500">
          Need help? Contact your administrator
        </div>
      </div>
    </div>
  );
}
