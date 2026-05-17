// src/app/router/PublicOnlyRoute.tsx
import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "@/app/providers/AuthProvider"

export default function PublicOnlyRoute() {
  const { isLoading, isAuthenticated } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        Loading...
      </div>
    )
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}