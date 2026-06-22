import { User, Lock, CreditCard, Bell, Shield } from "lucide-react";

type Tab = {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  key: string;
};

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function SettingsSidebar({
  isOpen,
  onToggle,
  activeTab,
  onTabChange,
}: SidebarProps) {
  const tabs: Tab[] = [
    { name: "Profile", icon: User, key: "profile" },
    { name: "Password", icon: Lock, key: "password" },
    { name: "Payment Methods", icon: CreditCard, key: "payment" },
    { name: "Notifications", icon: Bell, key: "notifications" },
    { name: "Security", icon: Shield, key: "security" },
  ];

  return (
    <aside
      className={`fixed top-0 ${
        isOpen ? "left-0" : "-left-64"
      } lg:static lg:left-0 w-64 h-full bg-white dark:bg-gray-800 shadow-xl lg:shadow-none transition-transform duration-300 z-20 rounded-r-2xl overflow-hidden`}
    >
      <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
        <button
          type="button"
          onClick={onToggle}
          className="lg:hidden p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-md"
        >
          <span className="sr-only">Toggle sidebar</span>
          {/* Icon can be added here */}☰
        </button>
      </div>
      <nav className="p-4 space-y-2">
        {tabs.map((tab) => (
          <button
            type="button"
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`flex items-center gap-3 w-full p-3 text-sm font-medium rounded-xl transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 ${
              activeTab === tab.key
                ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
                : "text-gray-700 dark:text-gray-300"
            }`}
          >
            <tab.icon className="h-5 w-5" />
            <span>{tab.name}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
