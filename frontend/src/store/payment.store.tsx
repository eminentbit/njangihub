import { create } from "zustand";

interface TransactionStore {
  transactionId: string | null;
  reference: string | null;
  setTransaction: (id: string, ref: string) => void;
  clearTransaction: () => void;
}

export const useTransactionStore = create<TransactionStore>((set) => ({
  transactionId: sessionStorage.getItem("njangi_transaction_id") || null,
  reference: sessionStorage.getItem("njangi_transaction_ref") || null,

  setTransaction: (id: string, ref: string) => {
    sessionStorage.setItem("njangi_transaction_id", id);
    sessionStorage.setItem("njangi_transaction_ref", ref);
    set({ transactionId: id, reference: ref });
  },

  clearTransaction: () => {
    sessionStorage.removeItem("njangi_transaction_id");
    sessionStorage.removeItem("njangi_transaction_ref");
    set({ transactionId: null, reference: null });
  },
}));
