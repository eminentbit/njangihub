import { useMutation } from "@tanstack/react-query";
import { securePost } from "../utils/axiosClient";

export const useRequestLoan = () => {
  const mutation = useMutation({
    mutationFn: async (data: {
      amount: number;
      notes: string;
      durationMonths: number;
      groupId: string;
    }) => {
      console.log(data);
      const response = await securePost("/user/loan-request", data);
      return response.data;
    },
  });

  return {
    requestLoan: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
};
