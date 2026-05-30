// src/app/router/ProtectedRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";

type ProtectedRouteProps = {
  allowedRoles?: string[]; // e.g., ["admin", "seller"]
};

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const user = useAuthStore((state) => state.user);
const isLoading = useAuthStore((state) => state.isLoading);
const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#111113] text-white">
        Loading...
      </div>
    );
  }

  // 1. Not logged in? Send to login screen.
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 2. Role-based blocking
  if (allowedRoles && allowedRoles.length > 0) {
    // If the user's role isn't in the allowed list
    if (!user?.role || !allowedRoles.includes(user.role)) {
      
      // Redirect them to their designated home area based on who they are
      if (user?.role === "admin") return <Navigate to="/admin" replace />;
      if (user?.role === "seller") return <Navigate to="/seller" replace />;
      
      // Default fallback for standard users
      return <Navigate to="/account" replace />;
    }
  }

  // 3. User is logged in and authorized!
  return <Outlet />;
}