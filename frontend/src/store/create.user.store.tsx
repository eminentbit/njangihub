import { create } from "zustand";
// import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { GroupDetails } from "../types/create-njangi-types";
import { secureGet, securePost } from "../utils/axiosClient";
import { User } from "../types/auth.validator";

export interface Notification {
  isRead: boolean;
  _id: string;
  content: string;
  createdAt: string;
  message: string;
  user: User;
}

export interface PaymentHistory {
  groupName: string;
  type: string;
  amount: number;
  date: Date;
  status: string;
}
interface UserState {
  groups: GroupDetails[];
  notifications: Notification[];
  isLoading: boolean;
  error: string | null;
  hasPaidThisMonth: boolean;
  setHasPaidThisMonth: (hasPaid: boolean) => void;
  setGroups: (groups: GroupDetails[]) => void;
  paymentHistory: PaymentHistory | null;
  setPaymentHistory: (ph: PaymentHistory) => void;
  fetchNotifications: () => Promise<void>;
  fetchGroups: () => Promise<void>;
  setNotifications: (notifications: Notification[]) => void;
  setError: (error: string | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  markNotificationAsRead: (id: string) => void;
  markNotificationAsUnread: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  markAllNotificationsAsUnread: () => void;
  clearNotifications: () => void;
  setNotification: (notification: Notification) => void;
  removeNotification: (id: string) => void;
}

const useUserStore = create<UserState>((set) => ({
  groups: [],
  notifications: [],
  isLoading: false,
  error: null,
  hasPaidThisMonth: false,
  paymentHistory: null,
  setHasPaidThisMonth: (hasPaid: boolean) =>
    set({ hasPaidThisMonth: hasPaid, isLoading: false }),

  setPaymentHistory: (ph: PaymentHistory) =>
    set({ paymentHistory: ph, isLoading: false }),

  fetchGroups: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await secureGet(`/njangi/groups`);
      console.log("Fetched groups:", res.data.groups);
      set({ groups: res.data.groups, isLoading: false });
    } catch (err) {
      console.error("Failed to fetch groups:", err);
      set({ error: "Could not fetch groups", isLoading: false });
    }
  },

  setGroups: (groups) => set({ groups }),
  setNotifications: (
    notifications: Notification[] | ((prev: Notification[]) => Notification[])
  ) =>
    set((state) => ({
      notifications:
        typeof notifications === "function"
          ? notifications(state.notifications)
          : notifications,
    })),
  setError: (error) => set({ error }),
  setIsLoading: (isLoading) => set({ isLoading }),
  markNotificationAsRead: async (id) => {
    try {
      await securePost(`/notifications/${id}/read`, {});
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n._id === id ? { ...n, isRead: true } : n
        ),
      }));
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  },
  markNotificationAsUnread: async (id) => {
    try {
      await securePost(`/notifications/${id}/unread`, {});
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n._id === id ? { ...n, isRead: false } : n
        ),
      }));
    } catch (err) {
      console.error("Failed to mark notification as unread:", err);
    }
  },
  markAllNotificationsAsRead: async () => {
    try {
      await securePost(`/notifications/read-all`, {});
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
      }));
    } catch (err) {
      console.error("Failed to mark all notifications as read:", err);
    }
  },
  markAllNotificationsAsUnread: async () => {
    try {
      await securePost(`/notifications/unread-all`, {});
      set((state) => ({
        notifications: state.notifications.map((n) => ({
          ...n,
          isRead: false,
        })),
      }));
    } catch (err) {
      console.error("Failed to mark all notifications as unread:", err);
    }
  },
  clearNotifications: () => set({ notifications: [] }),
  setNotification: (notification) =>
    set((state) => ({
      notifications: [...state.notifications, notification],
    })),
  removeNotification: async (id) => {
    try {
      await secureGet(`/notifications/${id}/delete`);
      set((state) => ({
        notifications: state.notifications.filter((n) => n._id !== id),
      }));
    } catch (err) {
      console.error("Failed to remove notification:", err);
    }
  },

  fetchNotifications: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await secureGet(`/notifications/user`);
      set({
        notifications: res.data,
        isLoading: false,
      });
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
      set({ error: "Could not fetch notifications", isLoading: false });
    }
  },
}));

export const useGroupsQuery = () => {
  const setGroups = useUserStore((state) => state.setGroups);
  return useQuery({
    queryKey: ["groups"],
    queryFn: async () => {
      const res = await secureGet(`/njangi/groups`);
      setGroups(res.data);
      return res.data;
    },
  });
};

export default useUserStore;
