import { useState } from "react";
import { Save } from "lucide-react";

const notificationSettings = [
  {
    key: "email",
    label: "Email Notifications",
    desc: "Get email updates for important activities",
  },
  {
    key: "push",
    label: "Push Notifications",
    desc: "Receive notifications directly on your device",
  },
  {
    key: "reminders",
    label: "Payment Reminders",
    disabled: true,
    desc: "Be reminded of upcoming payments",
  },
  {
    key: "activity",
    label: "Group Activity",
    desc: "Stay in the loop with group actions",
  },
];

type SettingsNotificationsProps = Record<
  (typeof notificationSettings)[number]["key"],
  boolean
>;

export default function SettingsNotifications() {
  const [prefs, setPrefs] = useState<SettingsNotificationsProps>({
    email: true,
    push: false,
    reminders: true,
    activity: false,
  });

  const handleToggle = (key: keyof SettingsNotificationsProps) => {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    console.log("Saved preferences:", prefs);
    alert("Notification preferences saved successfully!");
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white dark:bg-gray-800 shadow-xl rounded-2xl">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
        Notification Settings
      </h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
        Customize how you receive updates and alerts.
      </p>

      <div className="space-y-4">
        {notificationSettings.map(({ key, label, disabled, desc }) => (
          <div
            key={key}
            className="flex items-center justify-between p-4 border dark:border-gray-700 rounded-lg"
          >
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">
                {label}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{desc}</p>
            </div>

            {/* Toggle Button */}
            <button
              type="button"
              onClick={() =>
                handleToggle(key as keyof SettingsNotificationsProps)
              }
              className={`relative inline-flex items-center w-12 h-6 transition-colors rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 ${
                prefs[key as keyof SettingsNotificationsProps]
                  ? "bg-indigo-600"
                  : "bg-gray-200 dark:bg-gray-700"
              }`}
              aria-pressed={prefs[key as keyof SettingsNotificationsProps]}
              aria-label={`Toggle ${label}`}
              disabled={disabled}
            >
              <span
                className={`inline-block w-5 h-5 transform bg-white rounded-full shadow-md transition-transform ${
                  prefs[key as keyof SettingsNotificationsProps]
                    ? "translate-x-6"
                    : "translate-x-1"
                }`}
              />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-end border-t border-gray-200 dark:border-gray-700 pt-4">
        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-medium py-2 px-4 rounded-lg transition"
        >
          <Save className="h-4 w-4" />
          Save Preferences
        </button>
      </div>
    </div>
  );
}
