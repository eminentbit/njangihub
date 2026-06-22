import axios from "axios";
import { create } from "zustand";
import { secureGet } from "../utils/axiosClient";
import { MyNjangiResponse } from "../types/my.njangi.types";

type NjangiOverviewResponse = {
  totalSubmissions: number;
  approved: number;
  pending: number;
  rejected: number;
  status: string;
  groupName: string;
  submittedDate: string;
  recentActivities: {
    groupName: string;
    status: string;
    submittedDate: string;
  }[];
};

type MyNjangisResponseData = {
  njangiID: string;
  njangiName: string;
  startDate: Date | string;
  submittonDate: Date | string;
  numberOfMember: string;
  contributionAmmount: string;
  status: string;
  contributionFrequency: string;
};
type MyNjangiStatusResponse = {
  status: string;
  groupId?: string;
  date: string;
  review?: string;
  pending: number;
  approved: number;
};

interface NjangiState {
  loading: boolean;
  errors: string | null;
  success: boolean;
  message: string | null;
  totalSubmissions: number;
  njangiId: string;
  approved: number;
  pending: number;
  rejected: number;
  status: string;
  groupName: string;
  submittedDate: Date | string;
  recentActivities?: {
    groupName: string;
    status: string;
    submittedDate: Date | string;
  }[];

  getNjangiOverview: (njangiId: string) => Promise<NjangiOverviewResponse>;
  getMyNjangis: (njangiId: string) => Promise<MyNjangisResponseData[]>;
  getMyNjangiDetails: (njangiId: string) => Promise<MyNjangiResponse[]>;
  getMyNjangiStatus: (njangiId: string) => Promise<MyNjangiStatusResponse>;
}

export const useNjangiStateStore = create<NjangiState>((set) => ({
  loading: false,
  errors: null,
  success: false,
  message: null,
  totalSubmissions: 0,
  njangiId: "",
  approved: 0,
  pending: 0,
  rejected: 0,
  status: "",
  groupName: "",
  submittedDate: "",

  getNjangiOverview: async (njangiId: string) => {
    set({ loading: true, errors: null, success: false });
    try {
      const url = import.meta.env.VITE_NJANGI_OVERVIEW_API_URL;
      const response = await secureGet(url, { params: { njangiId } });
      set({
        loading: false,
        success: true,
        message: "Njangi overview fetched successfully",
        totalSubmissions: response.data.totalSubmissions,
        approved: response.data.approved,
        pending: response.data.pending,
        rejected: response.data.rejected,
        status: response.data.status,
        groupName: response.data.groupName,
        submittedDate: response.data.submittedDate,
        recentActivities: response.data.recentActivities || [],
      });
      return {
        totalSubmissions: response.data.totalSubmissions,
        approved: response.data.approved,
        pending: response.data.pending,
        rejected: response.data.rejected,
        status: response.data.status,
        groupName: response.data.groupName,
        submittedDate: response.data.submittedDate,
        recentActivities: response.data.recentActivities || [],
      };
    } catch (error) {
      set({
        loading: false,
        errors:
          axios.isAxiosError(error) && error.response?.data?.message
            ? error.response.data.message
            : "An error occurred. Please try again.",
      });
      // Return a default NjangiOverviewResponse object in case of error
      return {
        totalSubmissions: 0,
        approved: 0,
        pending: 0,
        rejected: 0,
        status: "",
        groupName: "",
        submittedDate: "",
        recentActivities: [],
      };
    }
  },

  getMyNjangis: async (njangiId: string) => {
    set({ loading: true, errors: null, success: false });
    try {
      const url = import.meta.env.VITE_NJANGIS_API_URL;
      const response = await secureGet(url, { params: { njangiId } });
      set({
        loading: false,
        success: true,
        message: "My Njangi details fetched successfully",
      });
      return response.data as MyNjangisResponseData[];
    } catch (error) {
      set({
        loading: false,
        errors:
          axios.isAxiosError(error) && error.response?.data?.message
            ? error.response.data.message
            : "An error occurred. Please try again.",
      });
      // Return a default MyNjangiResponse object in case of error
      return [];
    }
  },

  getMyNjangiDetails: async (njangiId: string) => {
    set({ loading: true, errors: null, success: false });
    try {
      const url = import.meta.env.VITE_NJANGIS_DETAILS_API_URL;
      const response = await secureGet(url, { params: { njangiId } });
      set({
        loading: false,
        success: true,
        message: "Njangi details fetched successfully",
      });
      return response.data as MyNjangiResponse[];
    } catch (error) {
      set({
        loading: false,
        errors:
          axios.isAxiosError(error) && error.response?.data?.message
            ? error.response.data.message
            : "An error occurred. Please try again.",
      });
      // Return a default MyNjangiDetailsResponse object in case of error
      return [];
    }
  },

  getMyNjangiStatus: async (njangiId: string) => {
    set({ loading: true, errors: null, success: false });
    try {
      const url = import.meta.env.VITE_NJANGIS_STATUS_API_URL;
      const response = await secureGet(url, { params: { njangiId } });
      console.log("Response data from getMyNjangiStatus:", response);
      set({
        loading: false,
        success: true,
        message: "Njangi status fetched successfully",
      });
      return response.data as MyNjangiStatusResponse;
    } catch (error) {
      set({
        loading: false,
        errors:
          axios.isAxiosError(error) && error.response?.data?.message
            ? error.response.data.message
            : "An error occurred. Please try again.",
      });
      return {
        status: "",
        date: "",
        review: "",
        pending: 0,
        approved: 0,
      };
    }
  },
}));
