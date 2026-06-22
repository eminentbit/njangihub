import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/create.auth.store";

type Props = {
  allowedRoles: ("user" | "admin" | "bod" | "member")[];
};

export default function ProtectedRoute({ allowedRoles }: Props) {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  const currentPath = location.pathname;

  const getBasePath = (role: string) => {
    if (role === "bod") return "board";
    return role;
  };

  // Not logged in or invalid user
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // User role not allowed for this route group
  if (!allowedRoles.includes(user.role)) {
    const rolePath = getBasePath(user.role);
    const pathAfterRoot = currentPath.split("/").slice(2).join("/");
    const redirectPath = `/${rolePath}/${pathAfterRoot || "dashboard"}`;

    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
}
