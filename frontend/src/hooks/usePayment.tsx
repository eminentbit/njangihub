import { useMutation, useQuery } from "@tanstack/react-query";
import { secureGet, securePost } from "../utils/axiosClient";
import { decryptData, isEncryptedResponse } from "../utils/crypto.service";
import { useTransactionStore } from "../store/payment.store";

export const tokenUrl = "/payment/token";
export const paymentUrl = "/payment/pay";

export const useFetchCampayToken = () => {
  const mutation = useMutation({
    mutationFn: async () => {
      const response = await securePost(tokenUrl, {});
      return response.data;
    },
  });

  return {
    getToken: mutation.mutateAsync,
    tokenLoading: mutation.isPending,
    tokenGetError: mutation.error,
  };
};

export const usePayWithMobile = () => {
  const { setTransaction } = useTransactionStore();

  const mutation = useMutation({
    mutationFn: async (variables: {
      amount: number;
      description: string;
      from: string;
      groupId: string;
    }) => {
      const response = await securePost(paymentUrl, variables);
      const data = response.data;

      // Update Zustand store + sessionStorage
      if (data.transactionId && data.reference) {
        setTransaction(data.transactionId, data.reference);
      }

      return data;
    },
  });

  return {
    initiatePayment: mutation.mutateAsync,
    paymentLoading: mutation.isPending,
    paymentError: mutation.error,
  };
};

export const usePaymentStatus = (
  reference: string | null,
  transactionId: string | null,
  enabled: boolean
) => {
  return useQuery({
    queryKey: ["payment-status", reference, transactionId],
    queryFn: async () => {
      const { data } = await secureGet(`/payment/status/${reference}`, {
        params: { transactionId },
      });

      const payload = isEncryptedResponse(data)
        ? await decryptData(data)
        : data;

      return payload;
    },
    enabled: !!reference && !!transactionId && enabled,
    refetchInterval: 5000, 
    refetchOnWindowFocus: true,
  });
};
