// hooks/useRole.ts
import { useAuthStore } from "../store/create.auth.store";

export const useHasRole = (requiredRole: "admin" | "bod" | "user") => {
  const user = useAuthStore((s) => s.user);
  return user?.role === requiredRole;
};
