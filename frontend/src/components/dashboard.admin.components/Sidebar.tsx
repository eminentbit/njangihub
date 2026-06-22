import React, { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SidebarItem from "./SidebarItem";
import NotificationsPreview from "./NotificationsPreview";
import { FaBars, FaTimes } from "react-icons/fa";
import { useAuthStore } from "../../store/create.auth.store";
import { allMenu } from "../../utils/sidebar.items";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onTabChange?: (path: string) => void;
  notifications?: NotificationType[];
  onClose: () => void;
}

interface NotificationType {
  id: string;
  message: string;
  isRead: boolean;
  [key: string]: unknown;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onToggle,
  onTabChange,
  notifications = [],
  onClose,
}) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [isMobile, setIsMobile] = useState(false);
  const { user } = useAuthStore();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile && isOpen) onClose();
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen, onClose]);

  const menu = useMemo(() => {
    return user ? allMenu.filter((item) => item.roles.includes(user.role)) : [];
  }, [user]);

  const handleNav = (path: string) => {
    const base = user?.role === "admin" ? "/admin" : "/user";
    const fullPath = `${base}/${path}`;
    navigate(fullPath);
    onTabChange?.(fullPath);
    if (isMobile) onClose();
  };

  if (!user) return null;

  const isActive = (path: string) => pathname.endsWith(path);

  const renderItems = (showLabel: boolean) =>
    menu.map(({ icon, label, path }) => (
      <SidebarItem
        key={path}
        icon={icon}
        label={label}
        showLabels={showLabel}
        active={isActive(path)}
        badgeCount={
          path === "notifications"
            ? notifications.filter((n) => !n.isRead).length
            : 0
        }
        onClick={() => handleNav(path)}
      />
    ));

  const renderCollapsed = () =>
    menu.map(({ icon, label, path }) => (
      <SidebarItem
        key={path}
        icon={icon}
        label={label}
        tooltip
        showLabels={false}
        active={isActive(path)}
        badgeCount={
          path === "notifications"
            ? notifications.filter((n) => !n.isRead).length
            : 0
        }
        onClick={() => handleNav(path)}
      />
    ));

  return (
    <>
      {/* DESKTOP HAMBURGER */}
      {!isOpen && !isMobile && (
        <button
          onClick={onToggle}
          className="fixed top-4 left-4 z-40 p-2 rounded-full shadow focus:outline-none"
          aria-label="Expand sidebar"
          type="button"
        >
          <FaBars size={20} />
        </button>
      )}

      {/* DESKTOP SIDEBAR */}
      <div
        className={`fixed left-0 top-0 bottom-0 z-30 flex flex-col bg-blue-700 text-white border-r transition-width duration-300 ease-in-out
          ${isOpen ? "w-64" : "w-16"} hidden md:flex`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-blue-800">
          {isOpen && <div className="text-lg font-bold">NjangiHub</div>}
          <button
            onClick={onToggle}
            className="p-2 focus:outline-none"
            aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
            type="button"
          >
            <FaBars size={20} />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto px-2 py-4">
          {isOpen ? renderItems(true) : renderCollapsed()}
        </nav>
        {user.role === "admin" && notifications.length > 0 && isOpen && (
          <div className="px-2 pb-4">
            <NotificationsPreview
              onViewAll={() => handleNav("notifications")}
            />
          </div>
        )}
      </div>

      {/* MOBILE BOTTOM BAR (ONLY WHEN CLOSED) */}
      {!isMobile && null}
      {isMobile && !isOpen && (
        <div className="fixed bottom-0 left-0 right-0 z-40 flex h-16 md:hidden bg-blue-700 text-white">
          {renderCollapsed()}
        </div>
      )}

      {/* MOBILE SLIDE-IN MENU (ONLY WHEN OPEN) */}
      {isMobile && isOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* backdrop */}
          <div
            className="absolute inset-0 bg-black bg-opacity-40"
            onClick={onClose}
          />
          {/* panel */}
          <div className="relative flex flex-col bg-blue-700 text-white w-64">
            <div className="flex items-center justify-between h-16 px-4 border-b border-blue-800">
              <div className="text-lg font-bold">NjangiHub</div>
              <button onClick={onClose} aria-label="Close sidebar" type="button">
                <FaTimes size={24} />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto px-2 py-4">
              {renderItems(true)}
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
