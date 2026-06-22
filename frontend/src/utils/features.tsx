import { Users, Clock, Shield, PieChart, CreditCard, Bell } from "lucide-react";

export const features = [
  {
    icon: <Users size={24} />,
    title: "Group Management",
    description:
      "Create and manage multiple Njangi groups with customizable rules and member roles.",
  },
  {
    icon: <CreditCard size={24} />,
    title: "Automated Collections",
    description:
      "Schedule automatic contributions and receive notifications when payments are due.",
  },
  {
    icon: <PieChart size={24} />,
    title: "Financial Reports",
    description:
      "Get detailed analytics on group savings, individual contributions, and disbursements.",
  },
  {
    icon: <Shield size={24} />,
    title: "Secure Transactions",
    description:
      "Bank-level security ensures your funds and personal information stay protected.",
  },
  {
    icon: <Clock size={24} />,
    title: "Scheduling",
    description:
      "Flexible scheduling options for contribution cycles and payout rotations.",
  },
  {
    icon: <Bell size={24} />,
    title: "Smart Notifications",
    description:
      "Stay updated with timely reminders about payments, meetings, and important events.",
  },
];
