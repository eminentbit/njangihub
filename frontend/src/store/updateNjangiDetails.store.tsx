/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { secureDelete, securePut } from "../utils/axiosClient";

type UpdateNjangiResponse = {
  sucess: boolean;
  message: string;
};

interface Njangi {
  _id: string;
  [key: string]: any;
}

interface UpdateNjangiState {
  loading: boolean;
  error: string | null;
  success: boolean;
  njangis: Njangi[];
  setNjangis: (njangis: Njangi[]) => void;
  updateNjangi: (
    id: string | null,
    updateData: Record<string, any>
  ) => Promise<UpdateNjangiResponse>;
  cancelNjangi: (id: string) => Promise<UpdateNjangiResponse>;
  reset: () => void;
}

export const useUpdateNjangiStore = create<UpdateNjangiState>((set) => ({
  loading: false,
  error: null,
  success: false,
  njangis: [],
  setNjangis: (njangis) => set({ njangis }),

  updateNjangi: async (id, updateData) => {
    set({ loading: true, error: null, success: false });
    try {
      const response = await securePut(
        `${import.meta.env.VITE_UPDATE_STATE_DASHBOARD_NJANGI}?draftId=${id}`,
        updateData
      );
      // update it in local state
      set((state) => ({
        loading: false,
        success: true,
        njangis: state.njangis.map((n) =>
          n._id === id ? { ...n, ...updateData } : n
        ),
      }));
      return response.data;
    } catch (err: any) {
      set({
        loading: false,
        error: err.response?.data?.message || err.message || "Update failed",
        success: false,
      });
      return {
        sucess: false,
        message: err.response?.data?.message || err.message || "Update failed",
      };
    }
  },
  cancelNjangi: async (id) => {
    set({ loading: true, error: null, success: false });
    try {
      const response = await secureDelete(
        `${import.meta.env.VITE_DELETE_STATE_DASHBOARD_NJANGI}?draftId=${id}`
      );
      // remove from local state
      set((state) => ({
        loading: false,
        success: true,
        njangis: state.njangis.filter((n) => n._id !== id),
      }));
      return response.data;
    } catch (err: any) {
      set({
        loading: false,
        error: err.response?.data?.message || err.message || "Update failed",
        success: false,
      });
      return {
        sucess: false,
        message: err.response?.data?.message || err.message || "Update failed",
      };
    }
  },
  reset: () => set({ loading: false, error: null, success: false }),
}));
