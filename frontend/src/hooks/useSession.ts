// hooks/useSession.ts
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../store/create.auth.store";
import { User } from "../types/auth.validator";
// import axios from "axios";
import { secureGet } from "../utils/axiosClient";

const fetchSession = async (
  setUser: (user: User | null) => void,
  logout: () => void
): Promise<User | null> => {
  try {
    const res = await secureGet("/auth/session");
    const user = res.data.user;
    setUser(user);
    return user;
  } catch (err) {
    console.error("Session fetch failed:", err);
    logout();
    throw new Error("Invalid session or unauthorized");
  }
};

export const useSession = () => {
  const setUser = useAuthStore((s) => s.setUser);
  const logout = useAuthStore((s) => s.logout);

  const query = useQuery({
    queryKey: ["session"],
    queryFn: () => fetchSession(setUser, logout),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: false,
  });

  return {
    fetchUser: query.refetch,
    userLoading: query.isLoading,
    userError: query.error,
  };
};
