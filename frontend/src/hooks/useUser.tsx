import { useMutation, useQuery } from "@tanstack/react-query";
import { secureGet, securePost } from "../utils/axiosClient";
import useUserStore from "../store/create.user.store";

interface UserPaymentStatus {
  paymentStatus: boolean;
  sucess: boolean;
}

const fetchPaymentStatus = async (
  groupId: string,
  userIds: string[]
): Promise<UserPaymentStatus> => {
  const response = await secureGet(`/user/group/${groupId}/payment-status`, {
    params: { userIds: userIds.join(",") },
  });
  console.log(response.data);
  return response.data;
};

export const useUserPaymentStatus = (userIds: string[], groupId: string) => {
  const setHasPaidThisMonth = useUserStore(
    (state) => state.setHasPaidThisMonth
  );

  const query = useQuery({
    queryKey: ["paymentStatus", userIds, groupId],
    queryFn: async () => fetchPaymentStatus(groupId, userIds),
    enabled: userIds.length > 0 && !!groupId,
    select: (data) => {
      setHasPaidThisMonth(data.paymentStatus);
      return data.paymentStatus;
    },
    retry: 2,
  });

  return {
    hasPaidThisMonth: query.data ?? {},
    isLoading: query.isLoading,
    error: query.error,
  };
};

export const useChangePassword = () => {
  const mutation = useMutation({
    mutationFn: async (data: { oldPassword: string; newPassword: string }) => {
      console.log(data);
      const response = await securePost("/auth/change-password", data);
      return response.data;
    },
  });

  return {
    changePassword: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
};

export const usePaymentHistory = () => {
  const setPH = useUserStore((s) => s.setPaymentHistory);
  const query = useQuery({
    queryKey: ["paymentHistory"],
    queryFn: async () => {
      const response = await secureGet("/user/payment-history");
      return response.data;
    },
  });

  setPH(query.data);

  return {
    paymentHistory: query.data ?? [],
    paymentisLoading: query.isLoading,
    error: query.error,
  };
};
