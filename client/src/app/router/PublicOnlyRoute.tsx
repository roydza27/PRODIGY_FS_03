import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/app/providers/AuthProvider";

export default function PublicOnlyRoute() {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#111113]/95 flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  if (isAuthenticated) {
    return user?.role === "admin" ? (
      <Navigate to="/admin" replace />
    ) : (
      <Navigate to="/account" replace />
    );
  }

  return <Outlet />;
}