import { Bell, Menu, X } from "lucide-react";
import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const sections = [
  {
    label: "Board Menu",
    items: [
      { to: "/board/dashboard", icon: "📊", label: "Dashboard" },
      { to: "/board/resolutions", icon: "📋", label: "Resolutions" },
    ],
  },
  {
    label: "Meetings",
    items: [
      { to: "/board/schedule", icon: "📅", label: "Schedule" },
      { to: "/board/minutes", icon: "📝", label: "Minutes" },
      { to: "/board/attendance", icon: "👥", label: "Attendance" },
    ],
  },
  {
    label: "Reports",
    items: [{ to: "/board/reports", icon: "📊", label: "Reports" }],
  },
  {
    label: "Group Requests",
    items: [{ to: "/board/group-requests", icon: "👥", label: "Requests" }],
  },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div>
      {!isOpen ? (
        <button
          type="button"
          className="fixed top-4 left-4 p-2 rounded-lg hover:bg-purple-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 z-30"
          onClick={toggleSidebar}
          aria-label="Open sidebar"
        >
          <Menu className="h-6 w-6 text-purple-600" />
        </button>
      ) : (
        <aside
          className={`fixed top-0 left-0 h-full z-20 transform bg-gradient-to-b from-purple-600 to-purple-800 text-white
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          transition-transform duration-300 ease-in-out w-64 shadow-lg`}
        >
          <div className="flex items-center justify-between p-4">
            <h2 className="text-lg font-semibold tracking-wide">Board</h2>
            <button
              type="button"
              className="p-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-300"
              onClick={toggleSidebar}
              aria-label="Close sidebar"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="flex flex-col space-y-6 px-4 overflow-y-auto h-[calc(100%-64px)]">
            {sections.map((section) => (
              <div key={section.label}>
                <h3 className="text-sm uppercase tracking-wider text-purple-200 mb-2 mt-4">
                  {section.label}
                </h3>
                <ul className="space-y-1">
                  {section.items.map(({ to, icon, label }) => (
                    <li key={to}>
                      <NavLink
                        to={to}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200 ${
                            isActive
                              ? "bg-white bg-opacity-20 text-white font-medium"
                              : "text-purple-100 hover:bg-white hover:bg-opacity-10"
                          }`
                        }
                      >
                        <span className="text-lg">{icon}</span>
                        <span className="flex-1 truncate">{label}</span>
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="mt-auto">
              <h3 className="text-sm uppercase tracking-wider text-purple-200 mb-2">
                Notifications
              </h3>
              <NavLink
                to="/board/notifications"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-lg transition-colors duration-200 ${
                    isActive
                      ? "bg-white bg-opacity-20 text-white font-medium"
                      : "text-purple-100 hover:bg-white hover:bg-opacity-10"
                  }`
                }
              >
                <Bell size={18} />
                <span className="truncate">View Notifications</span>
              </NavLink>
            </div>
          </nav>

          {isMobile && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <button
                type="button"
                onClick={toggleSidebar}
                className="text-white opacity-70 hover:opacity-100 focus:outline-none"
                aria-label="Close sidebar"
              >
                <X size={24} />
              </button>
            </div>
          )}
        </aside>
      )}
    </div>
  );
};

export default Sidebar;
