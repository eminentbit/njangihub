import { create } from "zustand";

type ProtectNjangiStore = {
  allowedToViewNoNjangi: boolean;
  allowNoNjangiView: () => void;
  resetNoNjangiView: () => void;
};

const useProtectNjangiStore = create<ProtectNjangiStore>((set) => ({
  allowedToViewNoNjangi: false,
  allowNoNjangiView: () => set({ allowedToViewNoNjangi: true }),
  resetNoNjangiView: () => set({ allowedToViewNoNjangi: false }),
}));

export default useProtectNjangiStore;
