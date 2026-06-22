import { Wallet } from "lucide-react";
import {
  FaBell,
  FaChartBar,
  FaCog,
  // FaInfoCircle,
  // FaUserPlus,
  FaUsers,
  // FaUsersCog,
  FaUserShield,
} from "react-icons/fa";

export interface MenuItem {
  icon: React.ReactNode;
  label: string;
  path: string;
  roles: string[];
}

export const allMenu: MenuItem[] = [
  {
    icon: <FaUserShield />,
    label: "Dashboard",
    path: "dashboard",
    roles: ["member", "admin"],
  },
  {
    icon: <FaUsers />,
    label: "My Groups",
    path: "groups",
    roles: ["member", "admin"],
  },
  {
    icon: <Wallet />,
    label: "Payments",
    path: "payments",
    roles: ["member", "admin"],
  },
  {
    icon: <FaCog />,
    label: "Settings",
    path: "settings",
    roles: ["member", "admin"],
  },
  // {
  //   icon: <FaUsersCog />,
  //   label: "Manage Members",
  //   path: "manage-members",
  //   roles: ["admin"],
  // },
  // {
  //   icon: <FaUsers />,
  //   label: "Groups Overview",
  //   path: "groups-overview",
  //   roles: ["admin"],
  // },
  // {
  //   icon: <FaInfoCircle />,
  //   label: "Group Info",
  //   path: "group/info",
  //   roles: ["admin"],
  // },
  {
    icon: <FaChartBar />,
    label: "My Statistics",
    path: "stats",
    roles: ["admin"],
  },
  // {
  //   icon: <FaUserPlus />,
  //   label: "Add Member",
  //   path: "add-member",
  //   roles: ["admin"],
  // },
  // {
  //   icon: <FaCog />,
  //   label: "Group Settings",
  //   path: "group-settings",
  //   roles: ["admin"],
  // },
  {
    icon: <FaBell />,
    label: "Notifications",
    path: "notifications",
    roles: ["admin"],
  },
];
