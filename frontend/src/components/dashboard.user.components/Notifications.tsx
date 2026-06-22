"use client";

import { useState } from "react";
import {
  Bell,
  Users,
  CreditCard,
  Calendar,
  Check,
  Filter,
  ChevronDown,
} from "lucide-react";

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "group",
      message: "John added you to Team Alpha",
      time: "2 hours ago",
      read: false,
    },
    {
      id: 2,
      type: "payment",
      message: "Sarah paid her contribution to Project Beta",
      time: "5 hours ago",
      read: false,
    },
    {
      id: 3,
      type: "reminder",
      message: "Payment due for Finance Club in 3 days",
      time: "1 day ago",
      read: false,
    },
    {
      id: 4,
      type: "group",
      message: "New message in Team Alpha group chat",
      time: "2 days ago",
      read: true,
    },
    {
      id: 5,
      type: "payment",
      message: "Your payment for Team Alpha was successful",
      time: "3 days ago",
      read: true,
    },
    {
      id: 6,
      type: "group",
      message: "Michael left Project Beta group",
      time: "5 days ago",
      read: true,
    },
  ]);

  const [filter, setFilter] = useState("all");
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const markAsRead = (id: number) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({ ...notification, read: true }))
    );
  };

  const handleNotificationClick = (notification: {
    id: number;
    type: string;
    message: string;
    time?: string;
    read?: boolean;
  }) => {
    // Mark as read
    markAsRead(notification.id);

    // Navigate based on notification type
    if (notification.type === "group") {
      // In a real app, this would navigate to the group
      alert(`Navigating to group mentioned in: ${notification.message}`);
    } else if (notification.type === "payment") {
      // In a real app, this would navigate to payments
      alert(`Navigating to payment details: ${notification.message}`);
    } else if (notification.type === "reminder") {
      // In a real app, this would navigate to pending payments
      alert(`Navigating to pending payment: ${notification.message}`);
    }
  };

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "all") return true;
    if (filter === "unread") return !notification.read;
    return notification.type === filter;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case "group":
        return (
          <Users className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
        );
      case "payment":
        return (
          <CreditCard className="h-5 w-5 text-green-600 dark:text-green-400" />
        );
      case "reminder":
        return (
          <Calendar className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
        );
      default:
        return <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Stay updated with your groups and payments
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              type="button"
              className="btn btn-secondary flex items-center gap-2"
              onClick={() => setShowFilterMenu(!showFilterMenu)}
            >
              <Filter className="h-4 w-4" />
              <span>Filter</span>
              <ChevronDown className="h-4 w-4" />
            </button>

            {showFilterMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 border border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  className={`block px-4 py-2 text-sm w-full text-left ${
                    filter === "all"
                      ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
                      : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                  onClick={() => {
                    setFilter("all");
                    setShowFilterMenu(false);
                  }}
                >
                  All Notifications
                </button>
                <button
                  type="button"
                  className={`block px-4 py-2 text-sm w-full text-left ${
                    filter === "unread"
                      ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
                      : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                  onClick={() => {
                    setFilter("unread");
                    setShowFilterMenu(false);
                  }}
                >
                  Unread Only
                </button>
                <button
                  type="button"
                  className={`block px-4 py-2 text-sm w-full text-left ${
                    filter === "group"
                      ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
                      : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                  onClick={() => {
                    setFilter("group");
                    setShowFilterMenu(false);
                  }}
                >
                  Group Notifications
                </button>
                <button
                  type="button"
                  className={`block px-4 py-2 text-sm w-full text-left ${
                    filter === "payment"
                      ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
                      : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                  onClick={() => {
                    setFilter("payment");
                    setShowFilterMenu(false);
                  }}
                >
                  Payment Notifications
                </button>
                <button
                  type="button"
                  className={`block px-4 py-2 text-sm w-full text-left ${
                    filter === "reminder"
                      ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
                      : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                  onClick={() => {
                    setFilter("reminder");
                    setShowFilterMenu(false);
                  }}
                >
                  Reminders
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={markAllAsRead}
          >
            Mark All as Read
          </button>
        </div>
      </div>

      <div className="card">
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-8">
              <Bell className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                No notifications
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                You don't have any {filter !== "all" ? filter + " " : ""}
                notifications at the moment.
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex items-start gap-4 p-4 rounded-lg ${
                  notification.read
                    ? "bg-white dark:bg-gray-800"
                    : "bg-indigo-50 dark:bg-indigo-900/20"
                } cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div
                  className={`p-2 rounded-full ${
                    notification.type === "group"
                      ? "bg-indigo-100 dark:bg-indigo-800"
                      : notification.type === "payment"
                      ? "bg-green-100 dark:bg-green-800"
                      : "bg-yellow-100 dark:bg-yellow-800"
                  }`}
                >
                  {getIcon(notification.type)}
                </div>

                <div className="flex-1">
                  <p
                    className={`${
                      notification.read
                        ? "text-gray-800 dark:text-gray-200"
                        : "text-gray-900 dark:text-gray-100 font-medium"
                    }`}
                  >
                    {notification.message}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {notification.time}
                  </p>
                </div>

                {!notification.read && (
                  <button
                    type="button"
                    className="p-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      markAsRead(notification.id);
                    }}
                    title="Mark as read"
                  >
                    <Check className="h-5 w-5" />
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
