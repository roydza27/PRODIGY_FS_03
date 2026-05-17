import { BrowserRouter, Route, Routes } from "react-router-dom"

// Layouts
import PublicLayout from "@/shared/layouts/PublicLayout"
import AuthLayout from "@/shared/layouts/AuthLayout"
import DashboardLayout from "@/shared/layouts/DashboardLayout"

// Route Guards
import ProtectedRoute from "@/app/router/ProtectedRoute"
import PublicOnlyRoute from "@/app/router/PublicOnlyRoute"

// Pages
import HomePage from "@/features/home/pages/HomePage"
import LoginPage from "@/features/auth/pages/LoginPage"
import RegisterPage from "@/features/auth/pages/RegisterPage"
import DashboardPage from "@/features/dashboard/pages/DashboardPage"

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Website */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
        </Route>

        {/* Auth Routes */}
        <Route element={<PublicOnlyRoute />}>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>
        </Route>

        {/* Protected Dashboard */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route
              path="/dashboard"
              element={<DashboardPage />}
            />
          </Route>
        </Route>

      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter