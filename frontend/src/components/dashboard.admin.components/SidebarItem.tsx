import React from "react";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  showLabels?: boolean;
  onClick?: () => void;
  className?: string;
  tooltip?: boolean;
  badgeCount?: number;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  active = false,
  showLabels = true,
  onClick,
  className = "",
  tooltip = false,
  badgeCount = 0,
}) => (
  <button
    className={`
      relative flex items-center w-full px-4 py-3 text-left hover:bg-blue-900 transition
      ${active ? "bg-blue-900 font-bold rounded-md" : ""}
      ${showLabels ? "" : "justify-center"}
      ${className}
    `}
    onClick={onClick}
    title={tooltip && !showLabels ? label : undefined}
    aria-label={!showLabels ? label : undefined}
    type="button"
  >
    <span className="text-xl relative">
      {icon}
      {badgeCount > 0 && (
        <span className="absolute -top-1 -right-2 bg-red-500 text-xs rounded-full px-1">
          {badgeCount}
        </span>
      )}
    </span>
    {showLabels && <span className="ml-4">{label}</span>}
  </button>
);

export default SidebarItem;