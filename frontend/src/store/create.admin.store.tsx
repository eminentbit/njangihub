import { create } from "zustand";
import { User } from "../types/auth.validator";
import { GroupRequest } from "../types/group.request";
import { Group } from "../hooks/useAdmin";

// Interface representing statistics related to submissions for a group
interface SubmissionStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

// Interface describing a history entry of a group's status updates
interface StatusHistoryEntry {
  id: string;
  groupName: string;
  currentStatus: string;
  timeline: {
    current: boolean;
    status: string;
    date: string;
    time: string;
    description: string;
    completed: boolean;
  }[];
}

interface AdminState {
  groupId: string | null;
  email: string;
  selectedMember: User | null;
  isEditingSettings: boolean;
  groups: Group[];
  members: User[];
  invitedMembers: { email: string; status: string }[];
  groupInfo: Group | null;
  draftInfo: GroupRequest | null;
  submissionStats: SubmissionStats | null;
  statusHistory: StatusHistoryEntry[] | null;
  activityTimeline: unknown;
  recentActivity: {
    createdGroups: Group[];
    pendingGroups: GroupRequest[];
  } | null;
  groupRecentActivities: {
    date: string;
    type: string;
    amount?: string;
    user?: string;
    note?: string;
  }[];

  // Setter functions to update the state
  setGroupId: (id: string) => void;
  setEmail: (email: string) => void;
  setSelectedMember: (member: User) => void;
  toggleEditSettings: () => void;

  setGroups: (groups: Group[]) => void;
  setMembers: (members: User[]) => void;
  setInvitedMembers: (invited: { email: string; status: string }[]) => void;
  setGroupInfo: (info: Group) => void;
  setDraftInfo: (draft: GroupRequest) => void;
  setSubmissionStats: (stats: SubmissionStats) => void;
  setActivityTimeline: (timeline: unknown) => void;
  setStatusHistory: (history: StatusHistoryEntry[]) => void;
  setRecentActivity: (activity: {
    createdGroups: Group[];
    pendingGroups: GroupRequest[];
  }) => void;
  setGroupRecentActivities: (
    activities: { date: string; type: string; amount?: string }[]
  ) => void;
}

// Zustand store implementation
export const useAdminState = create<AdminState>((set) => ({
  // Initial UI state
  groupId: null,
  email: "",
  selectedMember: null,
  isEditingSettings: false,
  activityTimeline: null,

  // Initial cache data
  groups: [],
  members: [],
  invitedMembers: [],
  groupInfo: null,
  draftInfo: null,
  submissionStats: null,
  statusHistory: null,
  recentActivity: null,
  groupRecentActivities: [],

  // UI setters
  setGroupId: (id) => set({ groupId: id }),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setActivityTimeline: (timeline: any) => set({ activityTimeline: timeline }),
  setEmail: (email) => set({ email }),
  setSelectedMember: (member) => set({ selectedMember: member }),
  toggleEditSettings: () =>
    set((s) => ({ isEditingSettings: !s.isEditingSettings })),
  setGroups: (groups) => set({ groups }),
  setMembers: (members) => set({ members }),
  setInvitedMembers: (invited) => set({ invitedMembers: invited }),
  setGroupInfo: (info) => set({ groupInfo: info }),
  setDraftInfo: (draft) => set({ draftInfo: draft }),
  setSubmissionStats: (stats) => set({ submissionStats: stats }),
  setStatusHistory: (history) => set({ statusHistory: history }),
  setRecentActivity: (activity) => set({ recentActivity: activity }),
  setGroupRecentActivities: (activities) =>
    set({ groupRecentActivities: activities }),
}));
