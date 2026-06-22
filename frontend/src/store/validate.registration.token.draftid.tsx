import { create } from "zustand";
import axios from "axios";
import { secureGet } from "../utils/axiosClient";

// axios.defaults.withCredentials = true;

type ValidateTokenResponse = {
  success: boolean;
  message: string;
  errors?: string | null;
  status: string;
  data?: {
    userId: string;
    email: string;
    role: string;
    status: string;
  };
};

type ValidateAdminStateDashboardResponse = {
  success: boolean;
  valid: boolean;
  message: string;
  status: "valid" | "invalid" | "missing" | "redirect";
};

interface ValidateTokenState {
  isLoading: boolean;
  errors: string | null;
  success: boolean;
  message: string | null;
  validateInvitationToken: (token: string) => Promise<ValidateTokenResponse>;
  validateAdminStateDasboardId: (
    draftId: string
  ) => Promise<ValidateAdminStateDashboardResponse>; // for admin special dashbooard
}

export const useValidateInvitationToken = create<ValidateTokenState>((set) => ({
  isLoading: false,
  errors: null,
  success: false,
  message: null,
  validateInvitationToken: async (token: string) => {
    set({ isLoading: true, errors: null, success: false });
    try {
      const url = import.meta.env.VITE_VALIDATE_INVITE_TOKEN_API_URL;
      const response = await secureGet(`${url}?token=${token}`);
      set({
        isLoading: false,
        success: true,
        message: response.data.message,
      });
      return response.data;
    } catch (errors) {
      set({
        isLoading: false,
        errors:
          axios.isAxiosError(errors) && errors.response?.data?.message
            ? errors.response.data.message
            : "An error occurred while validating the token. Please try again.",
      });
    }
  },
  validateAdminStateDasboardId: async (draftId: string) => {
    set({ isLoading: true, errors: null, success: false });
    try {
      const url = import.meta.env.VITE_VALIDATE_DRAFTID_API_URL;
      const response = await secureGet(`${url}?draftId=${draftId}`);
      set({
        isLoading: false,
        success: true,
        message: response.data.message,
      });
      return response.data;
    } catch (errors) {
      set({
        isLoading: false,
        errors:
          axios.isAxiosError(errors) && errors.response?.data?.message
            ? errors.response.data.message
            : "An error occurred. Please try again.",
      });
      // Return the error response data if available
      if (axios.isAxiosError(errors) && errors.response?.data) {
        return errors.response.data;
      }
      return { status: "invalid", valid: false, message: "An error occurred." };
    }
  },
}));
