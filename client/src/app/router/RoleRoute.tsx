import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/app/providers/AuthProvider";

type RoleRouteProps = {
  allowedRoles: Array<"user" | "admin">;
};

export default function RoleRoute({ allowedRoles }: RoleRouteProps) {
  const { isLoading, isAuthenticated, user } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/account" replace />;
  }

  return <Outlet />;
}