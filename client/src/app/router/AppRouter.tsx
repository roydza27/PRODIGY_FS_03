import { BrowserRouter, Route, Routes } from "react-router-dom";

import PublicLayout from "@/shared/layouts/PublicLayout";
import AuthLayout from "@/shared/layouts/AuthLayout";
import UserLayout from "@/shared/layouts/UserLayout";
import AdminLayout from "@/shared/layouts/AdminLayout";

import ProtectedRoute from "@/app/router/ProtectedRoute";
import PublicOnlyRoute from "@/app/router/PublicOnlyRoute";

import HomePage from "@/features/home/pages/HomePage";
import LoginPage from "@/features/auth/pages/LoginPage";
import RegisterPage from "@/features/auth/pages/RegisterPage";

import AccountHomePage from "@/features/account/pages/AccountHomePage";
import AccountOrdersPage from "@/features/account/pages/AccountOrdersPage";
import AccountWishlistPage from "@/features/account/pages/AccountWishlistPage";
import AccountReviewsPage from "@/features/account/pages/AccountReviewsPage";
import AccountProfilePage from "@/features/account/pages/AccountProfilePage";
import AccountSettingsPage from "@/features/account/pages/AccountSettingsPage";
import AccountInvoicesPage from "@/features/account/pages/AccountInvoicesPage";
import AccountHistoryPage from "@/features/account/pages/AccountHistoryPage";
import AccountSavedPage from "@/features/account/pages/AccountSavedPage";
import SupportPage from "@/features/account/pages/SupportPage";
import SearchPage from "@/features/account/pages/SearchPage";

import AdminDashboardPage from "@/features/admin/pages/AdminDashboardPage";
import AdminProductsPage from "@/features/admin/pages/AdminProductsPage";
import AdminOrdersPage from "@/features/admin/pages/AdminOrdersPage";
import AdminCustomersPage from "@/features/admin/pages/AdminCustomersPage";
import AdminAnalyticsPage from "@/features/admin/pages/AdminAnalyticsPage";
import AdminInventoryPage from "@/features/admin/pages/AdminInventoryPage";
import AdminReportsPage from "@/features/admin/pages/AdminReportsPage";
import AdminShipmentsPage from "@/features/admin/pages/AdminShipmentsPage";
import AdminSettingsPage from "@/features/admin/pages/AdminSettingsPage";
import AdminStaffPage from "@/features/admin/pages/AdminStaffPage";
import AdminSupportPage from "@/features/admin/pages/AdminSupportPage";
import RoleRoute from "./RoleRoute";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
        </Route>

        <Route element={<PublicOnlyRoute />}>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<UserLayout />}>
            <Route path="/account" element={<AccountHomePage />} />
            <Route path="/account/orders" element={<AccountOrdersPage />} />
            <Route path="/account/wishlist" element={<AccountWishlistPage />} />
            <Route path="/account/reviews" element={<AccountReviewsPage />} />
            <Route path="/account/profile" element={<AccountProfilePage />} />
            <Route path="/account/settings" element={<AccountSettingsPage />} />
            <Route path="/account/invoices" element={<AccountInvoicesPage />} />
            <Route path="/account/history" element={<AccountHistoryPage />} />
            <Route path="/account/saved" element={<AccountSavedPage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/search" element={<SearchPage />} />
          </Route>
        </Route>

        <Route element={<RoleRoute allowedRoles={["admin"]} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/products" element={<AdminProductsPage />} />
            <Route path="/admin/orders" element={<AdminOrdersPage />} />
            <Route path="/admin/customers" element={<AdminCustomersPage />} />
            <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
            <Route path="/admin/inventory" element={<AdminInventoryPage />} />
            <Route path="/admin/reports" element={<AdminReportsPage />} />
            <Route path="/admin/shipments" element={<AdminShipmentsPage />} />
            <Route path="/admin/settings" element={<AdminSettingsPage />} />
            <Route path="/admin/staff" element={<AdminStaffPage />} />
            <Route path="/admin/support" element={<AdminSupportPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;