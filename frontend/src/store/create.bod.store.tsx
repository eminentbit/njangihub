// store/use.bod.store.ts
import { create } from "zustand";
import { AxiosError } from "axios";
import { GroupRequest } from "../types/group.request.ts";
import { secureGet, securePost } from "../utils/axiosClient.ts";
import { User } from "../types/auth.validator.ts";

export interface Report {
  id: string;
  type: string;
  content: string;
  summary?: string;
  status: string;
  title: string;
  uploaded: string;
}

export interface Metrics {
  profit: number;
  expenses: number;
  revenue: number;
}

export interface Resolution {
  id: string;
  status: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface Meeting {
  id: string;
  title: string;
  date: string;
  agenda: string;
  minutes: string;
  status: string;
  attendees?: User[];
}

interface BodStoreState {
  requests: GroupRequest[];
  isLoading: boolean;
  error: string | null;
  members: User[];
  meetings: Meeting[];
  notifications: {
    isRead: boolean;
    _id: string;
    message: string;
    createdAt: string;
  }[];
  resolutions: Resolution[];
  reports: Report[];
  fetchReports: () => Promise<void>;
  listMeetings: () => Promise<void>;
  createReport: (
    title: string,
    type: string,
    content: string,
    status: string,
    uploaded: string,
    metrics: Metrics,
    summary?: string
  ) => Promise<void>;
  createMeeting: (
    title: string,
    date: string,
    agenda: string,
    minutes: string,
    status: string,
    attendees?: User[]
  ) => Promise<void>;
  fetchRequests: () => Promise<void>;
  fetchResolutions: () => Promise<void>;
  fetchMembers: () => Promise<void>;
  createResolution: (title: string, description: string) => Promise<void>;
  acceptRequest: (id: string, reason: string) => Promise<void>;
  rejectRequest: (id: string, reason: string) => Promise<void>;
}

export const useBodStore = create<BodStoreState>((set) => ({
  requests: [],
  members: [],
  reports: [],
  isLoading: false,
  error: null,
  notifications: [],
  resolutions: [],
  meetings: [],

  createMeeting: async (
    title: string,
    date: string,
    agenda: string,
    minutes: string,
    status: string,
    attendees?: User[]
  ) => {
    try {
      const res = await securePost("/bod/meetings", {
        title,
        date,
        agenda,
        minutes,
        status,
        attendees,
      });

      set((state) => ({ meetings: [...state.meetings, res.data] }));
    } catch (err) {
      if (err instanceof AxiosError) {
        set({ error: err.response?.data });
      } else {
        console.error("An unknown error occured");
      }
    }
  },
  createResolution: async (title: string, description: string) => {
    try {
      const res = await securePost("/bod/resolutions", { title, description });
      set((state) => ({
        resolutions: [...state.resolutions, res.data],
      }));
    } catch (err) {
      console.error("Failed to create resolution:", err);
      set({ error: "Could not create resolution" });
    }
  },

  fetchResolutions: async () => {
    try {
      const res = await secureGet("/bod/resolutions");
      set({ resolutions: res.data });
    } catch (error) {
      if (error instanceof AxiosError) {
        set({ error: error.response?.data });
      }
      if (import.meta.env.DEV) console.log(error);
    }
  },

  listMeetings: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await secureGet(`/bod/meetings`);
      if (import.meta.env.DEV) console.log(res.data);
      set({
        meetings: res.data,
        isLoading: false,
      });
    } catch (err) {
      console.error("Failed to fetch meetings:", err);
      set({ error: "Could not fetch meetings", isLoading: false });
    }
  },

  fetchMembers: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await secureGet(`/bod/members`);
      if (import.meta.env.DEV) console.log(res.data);
      set({
        members: res.data,
        isLoading: false,
      });
    } catch (err) {
      console.error("Failed to fetch members:", err);
      set({ error: "Could not fetch members", isLoading: false });
    }
  },

  fetchRequests: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await secureGet(`/bod/drafts`);

      if (import.meta.env.DEV) console.log(res.data);

      set({
        requests: res.data.data,
        isLoading: false,
      });
    } catch (err) {
      console.error("Failed to fetch requests:", err);
      set({ error: "Could not fetch requests", isLoading: false });
    }
  },

  acceptRequest: async (id: string, reason: string) => {
    try {
      await securePost(`/bod/approve`, {
        reason,
        action: "approve",
        draftId: id,
      });
      set((state) => ({
        requests: state.requests.filter((req) => req._id !== id),
      }));
    } catch (err) {
      console.error("Failed to accept request:", err);
    }
  },

  fetchReports: async () => {
    set({ isLoading: true, error: null });

    try {
      const res = await secureGet(`/bod/reports`);
      if (import.meta.env.DEV) console.log(res.data);

      set({ reports: res.data.reports, isLoading: false });
    } catch (error) {
      if (error instanceof AxiosError) {
        set({ error: error.response?.data });
      }
    }
  },

  createReport: async (
    title: string,
    type: string,
    content: string,
    status: string,
    uploaded: string,
    metrics: Metrics,
    summary?: string
  ) => {
    try {
      const res = await securePost("/bod/reports", {
        title,
        type,
        content,
        summary,
        status,
        metrics,
        uploaded,
      });
      if (import.meta.env.DEV) console.log(res.data);
    } catch (err) {
      console.error("Failed to accept request:", err);
    }
  },

  rejectRequest: async (id: string, reason: string) => {
    try {
      await securePost(`/bod/reject`, {
        reason,
        action: "reject",
        draftId: id,
      });
      set((state) => ({
        requests: state.requests.filter((req) => req._id !== id),
      }));
    } catch (err) {
      console.error("Failed to reject request:", err);
    }
  },
}));
