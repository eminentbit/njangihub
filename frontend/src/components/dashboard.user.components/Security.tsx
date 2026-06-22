import { useState } from "react";
import { Save } from "lucide-react";

const securityOptions = [
  {
    key: "twoFactor",
    label: "Two-Factor Authentication",
    desc: "Add an extra layer of security",
  },
  {
    key: "loginAlerts",
    label: "Login Notifications",
    desc: "Alerts for new login attempts",
  },
];

type SecurityPrefs = Record<(typeof securityOptions)[number]["key"], boolean>;

export default function SettingsSecurity() {
  const [prefs, setPrefs] = useState<SecurityPrefs>({
    twoFactor: false,
    loginAlerts: true,
  });

  const togglePref = (key: keyof SecurityPrefs) => {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleViewSessions = () => {
    // Navigate to sessions page or show modal
    alert("Redirecting to active sessions...");
  };

  const handleDeleteAccount = () => {
    if (confirm("Are you sure? This cannot be undone.")) {
      alert("Account deletion initiated.");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white dark:bg-gray-800 shadow-xl rounded-2xl">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
        Security Settings
      </h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
        Manage your account security and two-factor authentication options.
      </p>

      <div className="space-y-4">
        {securityOptions.map(({ key, label, desc }) => (
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
            <button
              type="button"
              onClick={() => togglePref(key as keyof SecurityPrefs)}
              className={`relative inline-flex items-center w-12 h-6 transition-colors rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 ${
                prefs[key as keyof SecurityPrefs]
                  ? "bg-indigo-600"
                  : "bg-gray-200 dark:bg-gray-700"
              }`}
              aria-pressed={prefs[key as keyof SecurityPrefs]}
              aria-label={`Toggle ${label}`}
            >
              <span
                className={`inline-block w-5 h-5 transform bg-white rounded-full shadow-md transition-transform ${
                  prefs[key as keyof SecurityPrefs]
                    ? "translate-x-6"
                    : "translate-x-1"
                }`}
              />
            </button>
          </div>
        ))}

        <div className="flex items-center justify-between p-4 border dark:border-gray-700 rounded-lg">
          <div>
            <p className="font-medium text-gray-900 dark:text-gray-100">
              Session Management
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              View and sign out of active sessions
            </p>
          </div>
          <button
            type="button"
            onClick={handleViewSessions}
            className="text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:underline transition"
          >
            View Sessions
          </button>
        </div>
      </div>

      <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
        <button
          type="button"
          onClick={handleDeleteAccount}
          className="w-full inline-flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-800/30 text-red-600 dark:text-red-400 font-medium py-2 px-4 rounded-lg transition"
        >
          <Save className="h-4 w-4" />
          Delete Account
        </button>
      </div>
    </div>
  );
}
