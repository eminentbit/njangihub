import { useAdminState } from "../store/create.admin.store";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  secureGet,
  securePost,
  securePut,
  secureDelete,
} from "../utils/axiosClient";
import { AxiosError } from "axios";
import { User } from "../types/auth.validator";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/create.auth.store";

// Exact Group shape as defined by backend
export interface Group {
  totalReceived?: number;
  totalContributed?: number;
  payoutMethod?: string;
  nextDue: Date;
  _id: string;
  name: string;
  description?: string;
  position?: number;
  totalRounds?: number;
  groupMembers: User[];
  memberContributions: Array<{
    totalAmountPaid: number;
    member: { _id: string; name: string; email: string };
  }>;
  payoutHistory?: { date: string; member: User }[];
  nextMeeting?: string;
  rules?: string;
  status?: string;
  startDate?: Date;
  adminId: string;
  isAdmin?: boolean;
  contributionFrequency?: string;
  contributionAmount?: number;
  totalFunds?: number;
  invitedMembers?: Array<{ email: string; status: string }>;
  createdAt: string;
}

export interface PaymentGroup {
  contributionAmount: number;
  name: string;
}

export type Member = User & {
  initials: string;
  name: string;
};

export interface InvitedMember {
  email: string;
  status: string;
  groupId: string | undefined;
}
export interface GroupSettings {
  contributionAmount?: number;
  paymentType?: string;
  privacy?: string;
}

interface InviteIdentifier {
  email?: string;
  phone?: string;
  groupId?: string;
}

// Hook: fetch all groups and sync to store
export function useFetchGroups() {
  const role = useAuthStore((s) => s.user?.role);
  const setGroups = useAdminState((s) => s.setGroups);

  const isReady = Boolean(role);

  const query = useQuery<Group[], AxiosError>({
    queryKey: ["groups", role],
    queryFn: () =>
      secureGet(role === "admin" ? "/admin/groups" : "/user/groups").then(
        (res) => res.data
      ),
    enabled: isReady,
    select: (data) => {
      setGroups(data);
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });

  return {
    groups: query.data ?? [],
    isLoading: query.isLoading || !isReady,
    error: query.error,
  };
}

export function useActivityTimeLine(groupId: string) {
  const setActivityTimeline = useAdminState((s) => s.setActivityTimeline);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const query = useQuery<any, AxiosError>({
    queryKey: ["group", groupId, "activityTimeline"],
    queryFn: () =>
      secureGet(`/admin/group/${groupId}/activity-timeline`).then(
        (res) => res.data.timeline
      ),
    enabled: Boolean(groupId),
    select: (data) => {
      setActivityTimeline(data);
      return data;
    },
  });

  return {
    activityTimeline: query.data ?? null,
    loading: query.isLoading,
    error: query.error,
  };
}

export const useGroupInfo = (groupId: string) => {
  const query = useQuery<Group, AxiosError>({
    queryKey: ["group", groupId],
    queryFn: () => secureGet(`/admin/group/${groupId}`).then((res) => res.data),
    enabled: Boolean(groupId),
  });

  return {
    groupInfo: query.data ?? null,
    loading: query.isLoading,
    error: query.error,
  };
};

export const useGroupActivities = (groupId: string) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const query = useQuery<any[], AxiosError>({
    queryKey: ["group", groupId, "activities"],
    queryFn: () =>
      secureGet(`/admin/group/${groupId}/recent-activities`).then(
        (res) => res.data
      ),
    enabled: Boolean(groupId),
  });

  return {
    activities: query.data ?? [],
    loading: query.isLoading,
    error: query.error,
  };
};

// Hook: fetch members for current groupId in store
export function useFetchMembers(groupId: string) {
  const setMembers = useAdminState((s) => s.setMembers);

  const query = useQuery<User[], AxiosError>({
    queryKey: ["admin", "members", groupId],
    queryFn: () =>
      secureGet(`/admin/group/${groupId}/members`).then(
        (res) => res.data.members
      ),
    enabled: Boolean(groupId), // run only if groupId exists
    select: (data) => {
      setMembers(data);
      return data;
    },
    // onError: (err) => console.error("Failed to fetch members:", err.message),
  });

  return {
    members: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
  };
}

// Hook: fetch invited members for current groupId
export function useFetchInvitedMembers(groupId: string) {
  const setInvited = useAdminState((s) => s.setInvitedMembers);

  const query = useQuery<InvitedMember[], AxiosError>({
    queryKey: ["admin", "invitedMembers", groupId],
    queryFn: () =>
      secureGet(`/admin/group/${groupId}/invited-members`).then(
        (res) => res.data
      ),
    enabled: Boolean(groupId),
    select: (data) => {
      setInvited(data);
      return data;
    },
    // onError: (err) =>
    // console.error("Failed to fetch invited members:", err.message),
  });

  return {
    invitedMembers: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
  };
}

//Hook: delete invited members
export function useDeleteInvite(groupId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (identifier: InviteIdentifier) => {
      return secureDelete(`/admin/group/${groupId}/cancel-invites`, {
        data: identifier,
      });
    },
    onSuccess: (_, deletedMember) => {
      toast.success(
        `Invite for ${deletedMember.email || deletedMember.phone} cancelled!`,
        {
          position: "top-right",
          duration: 5000,
        }
      );

      queryClient.invalidateQueries({
        queryKey: ["admin", "invitedMembers", groupId],
      });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (err: any) => {
      const message =
        (err.response?.data as { message?: string })?.message ||
        "Failed to cancel invite! Please try again.";
      toast.error(message, { position: "top-right", duration: 5000 });
    },
  });
}

// Hook: invite a member by email
export function useInviteMember(groupId: string) {
  const queryClient = useQueryClient();

  return useMutation<InvitedMember, AxiosError, string>({
    mutationFn: (email) =>
      securePost(`/admin/group/${groupId}/invite`, { email }).then(
        (res) => res.data
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "invitedMembers", groupId],
      });
    },
    onError: (err) => console.error("Invite failed:", err.message),
  });
}

// Hook: add a member
export function useAddMember(groupId: string) {
  const queryClient = useQueryClient();

  return useMutation<{ message: string }, AxiosError, string>({
    mutationFn: (email) =>
      securePost<{ message: string }>(`/admin/group/${groupId}/add-member`, {
        email,
      }).then((res) => res.data),
    onSuccess: (data) => {
      toast.success(data.message, {
        position: "top-right",
        duration: 5000,
      });
      queryClient.invalidateQueries({
        queryKey: ["admin", "members", groupId],
      });
    },
    onError: (err) => {
      const message =
        (err.response?.data as { message?: string })?.message ||
        "Failed to add member! Please try again.";
      toast.error(message, { position: "top-right", duration: 5000 });
    },
  });
}

// Hook: remove a member
export function useRemoveMember(groupId: string) {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError, string>({
    mutationFn: (userId) =>
      secureDelete(`/admin/group/${groupId}/remove-member/${userId}`).then(
        () => {
          console.log("User id: ", userId);
        }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "members", groupId],
      });
      toast.success("Member removed successfully!", {
        position: "top-right",
        duration: 5000,
      });
    },
    onError: (err) => console.error("Remove member failed:", err.message),
  });
}

// Hook: update group settings
export function useEditGroupSettings() {
  const groupId = useAdminState((s) => s.groupId)!;
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError, GroupSettings>({
    mutationFn: (settings) =>
      securePut(`/admin/group/${groupId}/settings`, settings).then(
        (res) => res.data
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "groups"] });
    },
    onError: (err) => console.error("Update settings failed:", err.message),
  });
}

interface GroupStatus {
  groupId: string;
  groupName: string;
  paidMembers: Member[];
  unpaidMembers: Member[];
}

export function useGetContributionOverview() {
  const query = useQuery<{ value: number; name: string }[], AxiosError>({
    queryKey: ["contributionOverview"],
    queryFn: () =>
      secureGet(`/user/contributions/overview`).then(
        (res) => res.data.overview
      ),
  });

  console.log(query.data);

  return {
    data: query.data ?? [],
    loading: query.isLoading,
    error: query.error,
  };
}

export function useAdminGroupPaymentStatus() {
  const query = useQuery<GroupStatus[], AxiosError>({
    queryKey: ["adminGroupPaymentStatus"],
    queryFn: () =>
      secureGet("/admin/group-payment-status").then((res) => res.data),
  });

  return {
    data: query.data ?? [],
    loading: query.isLoading,
    error: query.error,
  };
}

export function useNotifyDefaulters() {
  const mutation = useMutation<string, AxiosError>({
    mutationFn: async () => {
      const response = await securePost("/admin/notify-defaulters", {});
      return response.data.message;
    },
  });

  return {
    notify: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}
