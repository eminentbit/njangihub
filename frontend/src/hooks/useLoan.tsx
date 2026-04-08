import { useMutation } from "@tanstack/react-query";
<<<<<<< HEAD
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
=======
import axios from "axios";

interface LoanRequestPayload {
  amount: number;
  term: number;
  purpose: string;
}

interface LoanResponse {
  id: string;
  status: string;
}

const requestLoan = async (
  payload: LoanRequestPayload
): Promise<LoanResponse> => {
  const res = await axios.post("/api/loans/request", payload);
  return res.data;
};

export const useRequestLoan = () => {
  const { mutateAsync, ...rest } = useMutation<
    LoanResponse,
    Error,
    LoanRequestPayload
  >({
    mutationFn: requestLoan,
  });

  return {
    requestLoan: mutateAsync,
    ...rest,
>>>>>>> origin/main
  };
};
