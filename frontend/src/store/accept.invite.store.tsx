import { create } from "zustand";
import axios from "axios";
import { securePost } from "../utils/axiosClient";

const ACCEPT_INVITE_API = import.meta.env.VITE_ACCEPT_INVITE_MEMBER_API_URL;

interface MemberDataInfo {
  memberInfo: MemberInfo;
  inviteToken: string;
  message: string;
  userId: string;
  groupName:string
}

interface AcceptInviteState {
  isLoading: boolean;
  isErrors: string | null;
  success: boolean;
  acceptInvite: (
    inviteToken: string,
    memberInfo: MemberInfo
  ) => Promise<MemberDataInfo>;
}

interface MemberInfo {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
}

export const useAcceptInviteStore = create<AcceptInviteState>((set) => ({
  isLoading: false,
  isErrors: null,
  success: false,

  acceptInvite: async (inviteToken: string, memberInfo: MemberInfo) => {
    set({ isLoading: true, isErrors: null, success: false });
    try {
      console.log(`${ACCEPT_INVITE_API}?token=${inviteToken}`, memberInfo);
      const response = await securePost(
        `${ACCEPT_INVITE_API}?token=${inviteToken}`,
        memberInfo
      );
      set({ isLoading: false, success: true, isErrors: null });
      console.log(response.data);
      return response.data;
    } catch (isErrors) {
      set({
        isLoading: false,
        isErrors:
          axios.isAxiosError(isErrors) && isErrors.response?.data?.message
            ? isErrors.response.data.message
            : "An isErrors occurred while accepting your invite! Please try again.",
      });
      throw isErrors;
    }
  },
}));
