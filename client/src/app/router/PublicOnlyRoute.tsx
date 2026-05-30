import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/app/store/auth.store";

export default function PublicOnlyRoute() {
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#111113]/95 text-white">
        Loading...
      </div>
    );
  }

  if (isAuthenticated) {
    if (user?.role === "admin") {
      return <Navigate to="/admin" replace />;
    }

    if (user?.role === "seller") {
      return <Navigate to="/seller" replace />;
    }

    return <Navigate to="/account" replace />;
  }

  return <Outlet />;
}