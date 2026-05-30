import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/app/store/auth.store";

type RoleRouteProps = {
  allowedRoles: string[];
};

export default function RoleRoute({ allowedRoles }: RoleRouteProps) {
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#111113]/95 flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user || !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on user role
    if (user?.role === "seller") {
      return <Navigate to="/seller" replace />;
    }
    if (user?.role === "admin") {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/account" replace />;
  }

  return <Outlet />;
}